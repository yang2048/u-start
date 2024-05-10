import GlobalFetch from 'alova/GlobalFetch';
import { createAlova } from 'alova';
import { defineMock, createAlovaMockAdapter } from '@alova/mock';
import { uniappRequestAdapter, uniappMockResponse } from '@alova/adapter-uniapp';
import users from '../mock/users';

// 模拟数据请求适配器
export default createAlovaMockAdapter([users], {
      // 全局控制是否启用mock接口，默认为true
  enable: true,

  // mock接口响应延迟，单位毫秒
  delay: 1000,

  // 是否打印mock接口请求信息
  mockRequestLogger: true,

    // 非模拟请求适配器，用于未匹配mock接口时发送请求
    // httpAdapter: GlobalFetch(),
  // 模拟接口回调，data为返回的模拟数据，你可以用它构造任何你想要的对象返回给alova
  // 以下为默认的回调函数，它适用于使用GlobalFetch请求适配器
  // 如果你使用的是其他请求适配器，在模拟接口回调中请自定义返回适合适配器的数据结构
//   onMockResponse: data => new Response(JSON.stringify(data))
  // 指定uniapp请求适配器后，未匹配模拟接口的请求将使用这个适配器发送请求
  httpAdapter: uniappRequestAdapter,

  //  模拟响应适配器，指定后响应数据将转换为uniapp兼容的数据格式
  onMockResponse: uniappMockResponse
});