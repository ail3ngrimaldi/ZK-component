/**
 * Shared types and interfaces for the ZK Proof Web Component
 */

export interface ZKProofConfig {
  validationType: string;
  threshold: number;
  inputLabel: string;
  successMessage: string;
  errorMessage: string;
  buttonText: string;
}

export interface ZKProofResult {
  success: boolean;
  proof?: string;
  publicResult?: number;
  timestamp: string;
  validationType: string;
  threshold: number;
}

export interface WalletState {
  connected: boolean;
  address?: string;
  network?: string;
}

// TODO: Add more types as needed