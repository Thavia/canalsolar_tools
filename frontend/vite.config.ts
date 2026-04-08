import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig((env) => {
  const isSsrBuild = Boolean((env as { ssrBuild?: boolean }).ssrBuild)

  return {
    plugins: [react()],
    ssr: {
      noExternal: ['react-helmet-async'],
    },
    server: {
      port: 5173,
    },
    build: {
      outDir: isSsrBuild ? 'dist/server' : 'dist/client',
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: isSsrBuild
        ? undefined
        : {
            input: {
              main: resolve(rootDir, 'index.html'),
              embed: resolve(rootDir, 'embed.html'),
            },
            output: {
              entryFileNames: (chunkInfo) => {
                if (chunkInfo.name === 'embed') {
                  return 'assets/embed.js'
                }
                return 'assets/[name]-[hash].js'
              },
              chunkFileNames: 'assets/[name]-[hash].js',
              assetFileNames: (assetInfo) => {
                // CSS com hash para evitar problemas de cache
                if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                  if (
                    assetInfo.names &&
                    assetInfo.names.some((name: string) => name.includes('embed'))
                  ) {
                    return 'assets/embed-[hash].css'
                  }
                  // CSS principal com hash
                  return 'assets/index-[hash].css'
                }
                return 'assets/[name]-[hash].[ext]'
              },
            },
          },
    },
  }
})





