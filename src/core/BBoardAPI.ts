import contractModule from '../contract-mock/index.cjs';
const { Contract, ledger, pureCircuits } = contractModule;

import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import {
  type BBoardProviders,
  type DeployedBBoardContract,
  bboardPrivateStateKey,
} from './types.js';
import { createBBoardPrivateState } from './utils/index.js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, map, from, type Observable } from 'rxjs';
import { convert_bigint_to_Uint8Array } from '@midnight-ntwrk/compact-runtime';

/**
 * Estado derivado simplificado para el componente KYC
 */
export interface BBoardDerivedState {
  epoch: bigint;
  allowedCountry: Uint8Array;
  allowedMinAge: bigint;
}

/**
 * API simplificada para el Web Component KYC
 */
export class BBoardAPI {
  public readonly deployedContractAddress: ContractAddress;
  public readonly state$: Observable<BBoardDerivedState>;

  private constructor(
    private readonly deployedContract: DeployedBBoardContract,
    private readonly providers: BBoardProviders,
  ) {
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;

    // Observable de estado combinado (público + privado)
    this.state$ = combineLatest([
      providers.publicDataProvider.contractStateObservable(this.deployedContractAddress, { type: 'latest' }).pipe(
        map(contractState => ledger(contractState.data)),
      ),
      from(providers.privateStateProvider.get(bboardPrivateStateKey)),
    ]).pipe(
      map(([ledgerState, privateState]) => ({
        epoch: ledgerState.epoch as bigint,
        allowedCountry: ledgerState.allowedCountry as Uint8Array,
        allowedMinAge: BigInt(ledgerState.allowedMinAge ?? 18),
      }))
    );
  }

  /**
   * Genera y envía una prueba ZK de que el usuario cumple con edad y país.
   * @param age Edad del usuario (número)
   * @param country Código ISO de 2 letras (ej: "US", "AR")
   */
  async enrollOnce(age: number, country: string): Promise<string> {
    // Convertir país a Uint8Array
    const countryBytes = new Uint8Array([...country].map(c => c.charCodeAt(0)));
    // Convertir edad a bigint (asumiendo que el circuito espera un Uint<8>)
    const ageBigInt = BigInt(age);

    // Llamar al circuito
    const txData = await this.deployedContract.callTx.enrollOnce();

    // Devolver el hash de la transacción
    return txData.public.txHash;
  }

  /**
   * Verifica si el usuario actual es elegible (adulto + en país permitido)
   */
  async checkEligibleSelf(): Promise<boolean> {
    const ledgerState = await this.getLedgerSnapshot();
    const privateKey = await this.providers.privateStateProvider.get(bboardPrivateStateKey);
    if (!privateKey) throw new Error('No private key found');

    // Derivar la clave pública del usuario
    const publicKey = pureCircuits.publicKey(
      privateKey.secretKey,
      convert_bigint_to_Uint8Array(32, ledgerState.epoch as bigint)
    );

    // Buscar la attestation del usuario
    if (!ledgerState.attest.member(publicKey)) {
      return false;
    }

    const attestation = ledgerState.attest.lookup(publicKey);
    return attestation.adult === 1n && attestation.inCountry === 1n;
  }

  // --- Métodos estáticos ---

  /**
   * Despliega un nuevo contrato KYC (solo para desarrollo/testing)
   */
  static async deploy(providers: BBoardProviders): Promise<BBoardAPI> {
    // Generar clave privada aleatoria si no existe
    const privateState = await this.getOrCreatePrivateState(providers);

    // Valor por defecto para owner (usar wallet del usuario)
    const ownerValue = {
      is_left: true,
      left: { bytes: new Uint8Array(32) }, // Se reemplazará por la wallet real
      right: { bytes: new Uint8Array(32) },
    };

    const deployedContract = await deployContract<typeof Contract>(providers, {
      privateStateId: bboardPrivateStateKey,
      contract: new Contract({ localSecretKey: privateState.secretKey }),
      initialPrivateState: privateState,
      args: [ownerValue],
    });

    return new BBoardAPI(deployedContract, providers);
  }

  /**
   * Se conecta a un contrato existente
   */
  static async join(providers: BBoardProviders, contractAddress: string): Promise<BBoardAPI> {
    const privateState = await this.getOrCreatePrivateState(providers);
    const deployedContract = await findDeployedContract<typeof Contract>(providers, {
      contractAddress: contractAddress as ContractAddress,
      contract: new Contract({ localSecretKey: privateState.secretKey }),
      privateStateId: bboardPrivateStateKey,
      initialPrivateState: privateState,
    });

    return new BBoardAPI(deployedContract, providers);
  }

  private static async getOrCreatePrivateState(providers: BBoardProviders) {
    const existing = await providers.privateStateProvider.get(bboardPrivateStateKey);
    return existing ?? createBBoardPrivateState(crypto.getRandomValues(new Uint8Array(32)));
  }

  private async getLedgerSnapshot() {
    const cs = await this.providers.publicDataProvider.queryContractState(this.deployedContractAddress);
    if (!cs) throw new Error('No contract state found');
    return ledger(cs.data);
  }
}