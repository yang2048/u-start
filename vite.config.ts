import path from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import viteCompression from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { uniuseAutoImports } from '@uni-helper/uni-use';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }: ConfigEnv):Promise<UserConfig> => {
  const env = loadEnv(mode, process.cwd(), '')
  const { VITE_PORT, VITE_PUBLIC_PATH, NODE_ENV, VITE_API_BASE_URL } = env
  //动态导入仅支持ESM的模块
  const UnoCss = await import('unocss/vite').then((i) => i.default)

  console.log("process.env: ", env.NODE_ENV);

  return {
    base: VITE_PUBLIC_PATH,
    plugins: [
      // 自动导入本地组件
      Components({
        // 指定组件位置，默认是src/components
        dirs: ['src/components'],
        deep: true, //search for subdirectories
        // ui库解析器
        // resolvers: [ElementPlusResolver()],
        extensions: ['vue'],
        // 配置文件生成位置
        dts: 'src/typings/components.d.ts',
      }),
      uni(),
      UnoCss(),
      AutoImport({
        imports: ['vue', 'uni-app', uniuseAutoImports()],
        dirs: ['src/components', 'src/stores', 'src/utils'],
        dts: 'src/typings/auto-imports.d.ts',
        vueTemplate: true,
      }),
      viteCompression({
        threshold: 10240, // 10K
      }),
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(process.cwd(), './src'),
        },
      ],
    },
    optimizeDeps: {
      exclude: ['vue-demi'],
    },
    server: {
      host: true,
      port: Number(VITE_PORT),
      proxy: {
        // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        '^/api/v1': {
          target: 'http://localhost:3000', // 后端服务实际地址
          changeOrigin: true, //开启代理
          rewrite: (path) => path.replace(/^\/api\/v1/, ''),
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          //发布时删除 console
          drop_console: process.env.NODE_ENV === 'production' ? true : false,
        },
      },
    },
  }
})
