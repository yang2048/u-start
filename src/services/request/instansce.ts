import { createAlova } from 'alova'
import VueHook from 'alova/vue';
import AdapterUniapp from '@alova/adapter-uniapp'
import mockAdapter from './mockAdapter'

export const alovaInstance = createAlova({
  // baseURL: 'https://api.alovajs.org',
  timeout: 5000,
  // statesHook: VueHook,
  ...AdapterUniapp({
    // 通过环境变量控制是否使用模拟请求适配器
    mockRequest: process.env.NODE_ENV === 'development' ? mockAdapter : undefined,
  }),
  beforeRequest(method) {
    // 假设我们需要添加token到请求头
    method.config.headers.token = 'token'
  },
  responded: {
    // 请求成功的拦截器
    // 当使用GlobalFetch请求适配器时，第一个参数接收Response对象
    // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
    onSuccess: async (response:any, method) => {
      // console.info(response)
      if (response.statusCode >= 400) {
        throw new Error(response.errMsg)
      }
      const json = await response.data;
      // if (json.code !== 200) {
      //   // 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误
      //   throw new Error(json.message)
      // }

      // 解析的响应数据将传给method实例的transformData钩子函数，这些函数将在后续讲解
      return json
    },
    onError: (err, method) => {
      console.error(err.message)
      uni.showToast({ title: '请求异常', icon: 'error' })
    },
    // onComplete: async (method) => {
      // 处理请求完成逻辑 关闭请求 loading 状态
    // },
  },
})