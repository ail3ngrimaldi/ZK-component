/**
 * ZK Proof Web Component Library
 * Entry point for the modular ZK proof validation component
 */

// 🧩 Auto-register the component when imported
import './components/ZKProofWebComponent.js';

// 📦 Export the main Web Component (named + default)
export { ZKProofWebComponent } from './components/ZKProofWebComponent.js';
export { ZKProofWebComponent as default } from './components/ZKProofWebComponent.js';

// ⚙️ Export core services for advanced usage (optional)
export { BBoardAPI } from './core/BBoardAPI.js';

// 🧾 Export types for TypeScript users
export type { BBoardDerivedState } from './core/BBoardAPI.js';
export type { BBoardProviders } from './core/types.js';

// 🏷️ Library metadata (útil para debugging y logs)
export const version = '1.0.0';
export const name = 'zk-proof-web-component';
export const description = 'Reusable Web Component for generating ZK proofs on Midnight Network';

// ℹ️ Helper: Check if component is registered
export function isComponentRegistered() {
  return customElements.get('zk-proof') !== undefined;
}

// 🚀 Helper: Force register if needed (for edge cases)
export function registerComponent() {
  if (!isComponentRegistered()) {
    customElements.define('zk-proof', ZKProofWebComponent);
  }
}