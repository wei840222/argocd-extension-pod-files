import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { viteExternalsPlugin } from 'vite-plugin-externals'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    viteExternalsPlugin({
      react: 'React',
      'react-dom': 'ReactDOM'
    }, {
      disableInServe: true
    })
  ],
  server: {
    proxy: {
      '/extensions/pod-files': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/extensions\/pod-files/, ''),
      },
    },
  }
})
