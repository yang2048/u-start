import { createSSRApp } from 'vue'
import uvUI from '@/uni_modules/uv-ui-tools'
// import config from './constants/config'
import App from './App.vue'
import store from './store'
import 'virtual:uno.css'
// import VConsole from 'vconsole'

export function createApp() {
  const app = createSSRApp(App)
  // if (process.env.NODE_ENV === 'development') {
  //   // const vConsole = new VConsole()
  // } else {
  //   const vConsole = new VConsole()
  //   console.log('生产环境')
  // }

  // app.use(config)
  app.use(uvUI)
  app.use(store)
  return {
    app,
  }
}
