// 获取播放源及剧集
export const formatSeason = (videoList: Record<string, any>): Record<string, any> => {
  console.log('[film_common][formatSeason][start]剧集格式化流程开启')
  let data: any = {
    报错: ['格式化报错$f12查看更多报错信息'],
  }
  try {
    // 分离播放源
    const playFrom = videoList['vod_play_from']
    const playSources = playFrom.split('$').filter(Boolean)

    // 处理剧集信息，同时修复缺失'$'的条目
    const playUrl = videoList['vod_play_url']
    const episodesBySource = playUrl
      .split('$$$') // 分离不同播放源的剧集信息
      .map((sourceEpisodes: any) =>
        sourceEpisodes
          // 修复剧集格式，确保每个条目都包含'$'
          .replace(/\$+/g, '$') // 确保'$'不重复
          .split('#')
          .map((episode: any) => (episode.includes('$') ? episode : `正片$${episode}`))
      )

    // 构建完整列表
    const fullList: Record<string, string[]> = playSources.reduce((acc, source, index) => {
      acc[source] = episodesBySource[index]
      return acc
    }, {})

    data = fullList
    console.log(`[film_common][formatSeason][return]`, data)
  } catch (err) {
    console.log(`[film_common][formatSeason][error]`, err)
  } finally {
    console.log(`[film_common][formatSeason][end]剧集格式化流程结束`)
    return data
  }
}

// 格式化剧集名称
export const formatName = (item: string): string => {
  const [first] = item.split('$')
  return first.includes('http') ? '正片' : first
}

// 格式化剧集集数
export const formatIndex = (item: string): { index: string; url: string } => {
  const [index, url] = item.split('$')
  return { index, url }
}

// 格式化倒序集数
export const formatReverseOrder = (action: 'positive' | 'negative', current: number, total: number) => {
  // 当前 0 总 37 正序 1 倒序 37
  // 当前 1 总 37 正序 2 倒序 36
  if (action === 'positive') return current + 1;
  else if (action === 'negative') return total - current;
  return 1;
};

// EeverseOrder
export const reverseOrderHelper = (action: 'positive' | 'negative', data: Record<string, any[]>): Record<string, any[]> => {
  // 深拷贝辅助函数
  const newData = JSON.parse(JSON.stringify(data))

  if (action === 'positive') {
    console.log('[film_common][reverseOrderHelper]正序')
  } else {
    console.log('[film_common][reverseOrderHelper]倒序')
    Object.keys(newData).forEach((key) => newData[key].reverse())
  }
  console.log(newData)
  return newData
}
