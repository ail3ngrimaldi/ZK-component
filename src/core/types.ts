// src/core/types.ts

import {
  type PrivateStateProvider,
  type ZkConfigProvider,
  type ProofProvider,
  type PublicDataProvider,
  type WalletProvider,
  type MidnightProvider,
} from '@midnight-ntwrk/midnight-js-contracts';

// 🔑 Clave para almacenar el estado privado del usuario
export const bboardPrivateStateKey = 'bboard-private-state-v1';

// 🧩 Interfaces

export interface BBoardProviders {
  privateStateProvider: PrivateStateProvider;
  zkConfigProvider: ZkConfigProvider;
  proofProvider: ProofProvider;
  publicDataProvider: PublicDataProvider;
  walletProvider: WalletProvider;
  midnightProvider: MidnightProvider;
}

export interface BBoardPrivateState {
  secretKey: Uint8Array;
}

export interface DeployedBBoardContract {
  deployTxData: any;
  callTx: any;
}