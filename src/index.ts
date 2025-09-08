/**
 * ZK Proof Web Component Library
 * Entry point for the modular ZK proof validation component
 */

// Export the main Web Component
export { ZKProofWebComponent } from './components/ZKProofWebComponent';

// Export core services for advanced usage
export { BBoardAPI } from './core/BBoardAPI';
export { WalletConnector } from './core/WalletConnector';
export { ZKProofService } from './core/ZKProofService';
export { Logger } from './core/utils';

// Export types
export type { 
  ZKProofConfig, 
  ZKProofResult, 
  WalletState 
} from './core/types';

// Auto-register the component when imported
import './components/ZKProofWebComponent';

// Library metadata
export const version = '1.0.0';
export const name = 'zk-proof-web-component';

// Default export for convenience
export { ZKProofWebComponent as default } from './components/ZKProofWebComponent';