import {
    createPrivateStateProvider,
    createZkConfigProvider,
    createProofProvider,
    createPublicDataProvider,
    createWalletProvider,
    createMidnightProvider,
  } from '@midnight-ntwrk/midnight-js-contracts';
  
  import { type BBoardProviders } from './types.js';
  
  /**
   * Crea proveedores preconfigurados para usar en el Web Component.
   * Asume que el usuario tiene instalada la billetera Midnight Lace.
   */
  export function createProviders(): BBoardProviders {
    // 1. Proveedor de estado privado (almacena clave secreta localmente)
    const privateStateProvider = createPrivateStateProvider({
      storageKey: 'zk-private-state',
    });
  
    // 2. Configuración de circuitos ZK (usa valores por defecto)
    const zkConfigProvider = createZkConfigProvider();
  
    // 3. Proveedor de generación de pruebas ZK
    const proofProvider = createProofProvider({
      // URL del servidor de pruebas ZK (puedes parametrizarlo después)
      proofServerUrl: 'https://proof.testnet.midnight.network',
    });
  
    // 4. Proveedor de datos públicos (consulta el estado del contrato en la blockchain)
    const publicDataProvider = createPublicDataProvider({
      indexerUrl: 'https://indexer.testnet.midnight.network',
    });
  
    // 5. Proveedor de billetera (conecta con Midnight Lace)
    const walletProvider = createWalletProvider();
  
    // 6. Proveedor de red (envía transacciones)
    const midnightProvider = createMidnightProvider({
      nodeUrl: 'wss://node.testnet.midnight.network',
    });
  
    return {
      privateStateProvider,
      zkConfigProvider,
      proofProvider,
      publicDataProvider,
      walletProvider,
      midnightProvider,
    };
  }