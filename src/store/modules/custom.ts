import { defineStore } from 'pinia'

const state = {
    history: [],
    see: [],
    player: {

    },
}

export const useCustomStore = defineStore('userCustom', {
  persist: true, // 数据持久化
  state: () => state,
  getters: {
    getHistory: (state) => {
      return state.history
    },
    getPlayer: (state) => {
      return state.player
    },
    getSee: (state) => {
      return state.see
    }
  },
  actions: {
    updateHistory(payload: never) {
      this.history.push(payload)
    },
    updateSee(payload: never) {
      this.see.push(payload)
    },
    restHistory() {
      this.history = []
    },
    restSee() {
      this.see = []
    }
  },
})
