import { defineStore } from 'pinia'

const state = {
  type: 'film',
  setting: {
    // playerMode: {
    //   // type: 'xgplayer',
    //   type: 'dplayer',
    //   external: '',
    // },
    snifferMode: {
      type: 'pie',
      url: '',
    },
    skipStartEnd: true,
    barrage: {
      url: '',
      key: '',
      support: [],
      start: '',
      mode: '',
      color: '',
      content: '',
    },
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
    getData: (state) => {
      return state.data
    },
    getSetting: (state) => {
      return state.setting
    },
  },
  actions: {
    updateConfig(payload: any) {
      for (const key in payload) {
        if (key === 'type') {
          this.type = payload.type;
        }
        if (key === 'data') {
          this.data = payload.data;
        }
        if (key === 'setting') {
          this.setting = {
            ...this.setting, // 保留原有的 setting 属性
            ...payload.setting, // 更新传入的 setting 属性
          };
        }
      }
    },
  },
})
