export const config = {
  name: '应用名称',
  domain: import.meta.env.VITE_API_BASE_URL,
  oss: import.meta.env.VITE_APP_OSS,
  schemeLink: `douyin://`, //唤起app地址
  downloadLink: '', //下载地址，下载app的地址
  emptyImg: '/static/images/common/zan.png',
  shareImg: import.meta.env.VITE_APP_OSS + '/common/share.png',
  dicts: {
    gender_type: [
      { label: '男', value: 'm' },
      { label: '女', value: 'f' },
      { label: '其他', value: 'o' },
    ],
  }
}

export default {
  install: (app: any) => {
    app.provide('config', config)
  },
}