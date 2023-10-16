import { defineStore } from 'pinia'
const usePerson = defineStore({
  id: 'person',
  /** 状态 */
  state: () => ({
    identity: '',
    classGrade: '',
    userAddress: '',
    realNameSelf: '',
    userSchoolName: '',
    automaticUpGrades: true,
    userSchoolId: '',
    userInfo: {},
    essayCorrection: {
      aiEvaluationsVo: {},
      originalCommentVo: [],
      scoreDetailVo: [],
      totalScore: '',
      totalWordNum: '',
    },
    grade: '', //作文批改年级
    resourceUrl: '', //听力音频
    listenList: [], //听力结果页面
    versionInfo: {},
    bookInfo: {
      unitKey: '',
      type: '',
      sectionKey: '',
    },
    dicExerciseList: [], // 听写训练list
    setting: {}, // 听写训练设置
    searchDic: {}, //听写训练查询数据
    searchOra: {}, //英语口语测评
  }),
  actions: {
    setIdentity(val: any) {
      this.identity = val
    },
    setAddress(val: string) {
      this.userAddress = val
    },
    setClassGrade(val: any) {
      this.classGrade = val
    },
    setRealNameSelf(val: any) {
      this.realNameSelf = val
    },
    setSchoolName(val: string) {
      this.userSchoolName = val
    },
    setSchoolId(val: string) {
      this.userSchoolId = val
    },
    setAutomaticUpGrades(val: any) {
      this.automaticUpGrades = val
    },
    setUserInfo(val: any) {
      this.userInfo = val
    },
    setUserKey(key: string, val: any) {
      this.userInfo[key] = val
    },
    setEssay(val: any) {
      this.essayCorrection = val
    },
    setGrade(val) {
      this.grade = val
    },
    setSourceUrl(val) {
      this.resourceUrl = val
    },
    setHearResult(val) {
      this.listenList = val
    },
    setVersion(val) {
      this.versionInfo = val
    },
    setBookInfo(val) {
      this.bookInfo = val
    },
    setDicList(val) {
      this.dicExerciseList = val
    },
    setSeting(val) {
      this.setting = val
    },
    setSearchDic(val) {
      this.searchDic = val
    },
    setSearchOra(val) {
      this.searchOra = val
    },
  },
})
export { usePerson }
