// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 假定我们有一个可以返回 Promise 的
// 通用 API（请忽略此 API 具体实现细节）
import { readFileName } from '../api/file'

export function createStore () {
  return new Vuex.Store({
    state: {
      fileNames: ''
    },
    actions: {
        readFileName ({ commit }) {
        // `store.dispatch()` 会返回 Promise，
        // 以便我们能够知道数据在何时更新
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