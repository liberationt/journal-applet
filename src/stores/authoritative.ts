import { defineStore } from 'pinia'
const useAuthoritative = defineStore({
  id: 'useAuthoritative',
  /** 状态 */
  state: () => ({
    useInfo: null,
    paperInfo: null,
  }),
  actions: {
    setUseInfo(val) {
      this.useInfo = val
    },
    setUseKey(key, value) {
      this.useInfo[key] = value
    },
    setPaperInfo(value) {
      this.paperInfo = value
    },
  },
})
export { useAuthoritative }
