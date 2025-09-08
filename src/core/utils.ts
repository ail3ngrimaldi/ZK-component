/**
 * Utility functions and helpers
 */

export class Logger {
  static log(message: string, data?: any): void {
    console.log(`[ZK-Component] ${message}`, data || '');
  }

  static error(message: string, error?: any): void {
    console.error(`[ZK-Component ERROR] ${message}`, error || '');
  }

  static warn(message: string, data?: any): void {
    console.warn(`[ZK-Component WARN] ${message}`, data || '');
  }
}

export const formatTimestamp = (): string => {
  return new Date().toISOString();
};

// TODO: Add more utilities as needed