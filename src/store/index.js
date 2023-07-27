import { createStore } from 'vuex'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/utils'

export default createStore({
  state: {
    userInfo: {},
    token: '',
    // 文件上传进度
    uploadProgress: {
      progress: 0,
      id: '',
    },
  },
  getters: {
    userInfo: (state) => state.userInfo,
    token: (state) => state.token,
    uploadProgress: (state) => state.uploadProgress,
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      setLocalStorage('userInfo', userInfo)
    },
    setToken(state, token) {
      state.token = token
    },
    initUserInfo(state) {
      state.userInfo = {}
      removeLocalStorage('userInfo')
    },
    initToken(state) {
      state.token = ''
    },
    logOut(state) {
      state.userInfo = {}
      state.token = ''
      removeLocalStorage('userInfo')
    },
    setUploadProgress(state, uploadProgress) {
      state.uploadProgress = uploadProgress
    }
  },
  actions: {},
  modules: {},
})
