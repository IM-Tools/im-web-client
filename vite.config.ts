import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname)
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin ({
        // 指定要缓存的文件夹
        iconDirs: [resolve(process.cwd(), 'src/assets/svg/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      open: false,
      https: false,
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_API,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
