import { defineMock } from '@alova/mock';

export default defineMock(
  {
    // 捕获get请求
    '/todo': [1, 2, 3, 4],

    // rest风格请求
    '/todo/{id}': ({ params }) => {
      const id = params.id;
      // ...
      return {
        title: '...',
        time: '10:00'
      };
    },

    // 返回更详细的信息
    '[POST]/todo': ({ query, data }) => {
      // ...
      return {
        status: 403,
        statusText: 'unknown error',
        responseHeaders: {
          // ...
        },
        body: {
          success: true
        }
      };
    },

    // key前面添加`-`，表示禁用此mock接口
    '-[DELETE]/todo/{id}': ({ params }) => {
      // ...
      return { success: true };
    }
  },
  true
);// 第二个参数表示是否启用本组mock接口，默认为true，可以指定为false关闭
