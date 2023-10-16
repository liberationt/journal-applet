import { defineStore } from 'pinia'
const useRecite = defineStore({
  id: 'useRecite',
  /** 状态 */
  state: () => ({
    versionInfo: null,
    currentBook: null,
    // 操作
    seting: {
      pronunciation: 1,
      sound: true,
    },
  }),
  actions: {
    setVersion(val) {
      this.versionInfo = val
    },
    setCurrentBook(val) {
      this.currentBook = val
    },
    setSetKey(key, value) {
      this.seting[key] = value
    },
  },
})
export { useRecite }
