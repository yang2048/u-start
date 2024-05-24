import { defineStore } from 'pinia'
import {uniq} from "lodash";

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
      this.history.unshift(payload)
      this.history = uniq(this.history);
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
