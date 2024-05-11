import { defineMock } from '@alova/mock';

export default defineMock(
  {
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
  },
  true
);// 默认为true，可以指定为false关闭
