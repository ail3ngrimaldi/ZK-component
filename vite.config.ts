// vite.config.ts

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // 📦 Modo librería (no app)
    lib: {
      entry: 'src/index.ts', // Punto de entrada
      name: 'ZKProofWebComponent', // Nombre global (para UMD)
      formats: ['es', 'umd'], // Genera ESM (modernos) y UMD (legacy)
      fileName: (format) => `zk-proof-web-component.${format}.js`,
    },
    // 🧩 Externaliza dependencias (no las incluyas en el bundle)
    rollupOptions: {
      external: [
        '@midnight-ntwrk/compact-runtime',
        '@midnight-ntwrk/midnight-js-contracts',
        '@midnight-ntwrk/wallet',
        'rxjs',
      ],
      output: {
        globals: {
          '@midnight-ntwrk/compact-runtime': 'CompactRuntime',
          '@midnight-ntwrk/midnight-js-contracts': 'MidnightJSContracts',
          '@midnight-ntwrk/wallet': 'MidnightWallet',
          rxjs: 'rxjs',
        },
      },
    },
    // 🧾 Genera declaración de tipos (.d.ts)
    sourcemap: true,
    emptyOutDir: true,
  },
});