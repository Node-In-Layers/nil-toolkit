import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export const readConfig = async (environment?: string) => {
  const theEnvironment = environment || process.env.VITE_ENVIRONMENT || 'local'
  const config = await import(`./config.${theEnvironment}.ts`)
  const theConfig = config.default()
  return JSON.stringify(theConfig)
}

const config = await readConfig()

export const defaultConfig = (args: object) => {
  return defineConfig({
    plugins: [react()],
    define: {
      __CONFIG__: config,
    },
    build: {
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          chunkFileNames: 'index.js',
          entryFileNames: 'index.js',
          assetFileNames: 'index.css',
        },
      },
    },
    ...args,
  })
}
