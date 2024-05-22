import { defineStore } from 'pinia'

const state = {
    history: [],
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
    }
  },
  actions: {
    updateHistory(payload: never) {
      this.history.push(payload)
    },
    restHistory() {
      this.history = []
    }
  },
})
