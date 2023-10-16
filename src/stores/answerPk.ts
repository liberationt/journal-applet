import { defineStore } from 'pinia'
const useAnswerPk = defineStore({
  id: 'answerPk',
  /** 状态 */
  state: () => ({
    versionInfo: null,
    answerInfo: null,
    questionInfo: null,
    music: true,
    subjectInfo: null,
    saveInfo: null,
  }),
  actions: {
    setVersionInfo(val) {
      this.versionInfo = val
    },
    setVersionKey(key, val) {
      this.versionInfo[key] = val
    },
    setSearchOra(val) {
      this.searchOra = val
    },
    setQuestionInfo(val) {
      this.questionInfo = val
    },
    setAnswerInfo(val) {
      this.answerInfo = val
    },
    setMusic(val) {
      this.music = val
    },
    setSubjectInfo(val) {
      this.subjectInfo = val
    },
    setSaveInfo(val) {
      this.saveInfo = val
    },
  },
})
export { useAnswerPk }
