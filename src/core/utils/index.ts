// src/core/utils/index.ts

export function createBBoardPrivateState(secretKey: Uint8Array) {
    return { secretKey };
  }
  
  // Helper para generar bytes aleatorios (si lo necesitas)
  export function randomBytes(length: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
  }