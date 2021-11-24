// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { readFileName } from '../api/file'
export function createStore () {
  return new Vuex.Store({
    state: {
      fileNames: ''
    },
    actions: {
        readFileName ({ commit }) {
        return commit('setFileNames', readFileName("D://file"))
      }
    },
    mutations: {
      setFileNames (state, v) {
        state.fileNames = v
      }
    }
  })
}