import { request } from '@/services/request'

// 获取分类
export const getVodClass = (id) => request.Get('https://collect.wolongzyw.com/api.php/provide/vod', {
    params: {
        ac: 'class'
    }
})

export const getVodList = (t, pg) => request.Get('https://collect.wolongzyw.com/api.php/provide/vod', {
    params: {
        ac: 'videolist',
        t: t,
        pg: pg
    }
})