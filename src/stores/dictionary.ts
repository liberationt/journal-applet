import { defineStore } from 'pinia'
const useDictionary = defineStore({
  id: 'dictionary',
  /** 状态 */
  state: () => ({
    historyList: [],
    hisEnglishList: [],
  }),
  actions: {
    setHistory(val) {
      if (this.historyList.length && this.historyList.length >= 20) {
        this.historyList.splice(19, 1)
      }
      const index = this.historyList.findIndex((item) => item === val)
      if (index != -1) {
        this.historyList.splice(index, 1)
      }
      this.historyList.unshift(val)
    },
    setResetDict() {
      this.historyList = []
    },

    setEngHistory(val) {
      if (this.hisEnglishList.length && this.hisEnglishList.length >= 20) {
        this.hisEnglishList.splice(19, 1)
      }
      const index = this.hisEnglishList.findIndex((item) => item === val)
      if (index != -1) {
        this.hisEnglishList.splice(index, 1)
      }
      this.hisEnglishList.unshift(val)
    },
    setResetEng() {
      this.hisEnglishList = []
    },
  },
})
export { useDictionary }
