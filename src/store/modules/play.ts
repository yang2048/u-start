import { defineStore } from 'pinia'
import { tbl_site, tbl_iptv, tbl_analyze } from '@/constants/config0519.json'
import _ from "lodash";

const state = {
  type: 'film',
  setting: {},
  site: {
    default: {
      categories: '',
      ext: '',
      api: 'https://cj.vodimg.top/api.php/provide/vod/',
      group: '切片',
      id: '33',
      isActive: true,
      key: 'vodimg',
      name: '影图资源',
      playUrl: '',
      search: 1,
      status: true,
      type: 1,
    },
    search: 'all',
    data: tbl_site,
    iptv: tbl_iptv,
    analyze: tbl_analyze,
  },
  data: {
    info: {},
    ext: {},
  },
}

export const usePlayStore = defineStore('play', {
  persist: true, // 数据持久化
  state: () => state,
  getters: {
    getType: (state) => {
      return state.type
    },
    getSite: (state) => {
      return state.site
    },
    getData: (state) => {
      return state.data
    },
    getIptv: (state) => {
      return state.site.iptv
    },
    getSetting: (state) => {
      return state.setting
    },
    getSearchGroup: (state) => {
      return _.filter(state.site.data, (item) => item['group'] == state.site.default.group)
    },
    getSearchSite: (state) => {
      return _.filter(state.site.data, (item) => item['search'] === 1)
    },
  },
  actions: {
    updateConfig(payload: any) {
      for (const key in payload) {
        if (key === 'type') {
          this.type = payload.type
        }
        if (key === 'site') {
          this.site = payload.site
        }
        if (key === 'data') {
          this.data = payload.data
        }
        if (key === 'setting') {
          this.setting = {
            ...this.setting, // 保留原有的 setting 属性
            ...payload.setting, // 更新传入的 setting 属性
          }
        }
      }
    },
  },
})
