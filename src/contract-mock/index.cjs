// src/contract-mock/index.cjs

// Mock mínimo del contrato para que BBoardAPI no falle
const Contract = function () {};
const ledger = function () {
  return {
    epoch: 0n,
    instance: 0n,
    attest: new Map(),
    allowedCountry: new Uint8Array(2),
    allowedMinAge: 18,
  };
};
const pureCircuits = {
  publicKey: function (secretKey, epochBytes) {
    // Devuelve un "public key" mock de 32 bytes
    return new Uint8Array(32).fill(1);
  },
};

module.exports = {
  Contract,
  ledger,
  pureCircuits,
};