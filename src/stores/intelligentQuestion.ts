import { defineStore } from 'pinia'
const useIntelligentQuestion = defineStore({
  id: 'intelligentQuestion',
  /** 状态 */
  state: () => ({
    versionInfo: null,
    answerInfo: null,
    searchOra: null,
    uniTitle: null,
    saveInfo: null,
  }),
  actions: {
    setVersionInfo(val) {
      this.versionInfo = val
    },
    setSearchOra(val) {
      this.searchOra = val
    },
    setAnswerInfo(val) {
      this.answerInfo = val
    },
    setUniTitle(val) {
      this.uniTitle = val
    },
    setSaveInfo(val) {
      this.saveInfo = val
    },
  },
})
export { useIntelligentQuestion }
