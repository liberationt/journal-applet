import request from '@/utils/request'
import qs from 'qs'
interface IPerson {
  name: string
  age: number
  avatar: string
}

export function getUserInfo() {
  return request({
    url: `/northUserInfo/getUserInfo`,
    method: 'get',
  })
}

//vip激活
export function memberActivate(data) {
  return request({
    url: `/northCardInfo/activate`,
    method: 'post',
    data,
    selfConfig: {
      needToast: false,
    },
  })
}
// 用户首次进入小程序填写资料，点击 开启学习之旅保存
export function saveFirstUserInfo(data) {
  return request({
    url: `/northUserInfo/save`,
    method: 'post',
    data,
  })
}
//获取学校
export function getSchool(data) {
  return request({
    url: `/baseSchoolInfo/list`,
    method: 'post',
    data,
  })
}
//学校分页
export function getSchoolList(data) {
  return request({
    url: `/baseSchoolInfo/page`,
    method: 'post',
    data,
  })
}

//会员信息查询
export function getMemberDetail() {
  return request({
    url: `/northTermPrice/detail`,
    method: 'get',
  })
}

//查询线上会员信息
export function getOnlineMember() {
  return request({
    url: `/northTermPrice/paidMember`,
    method: 'get',
    selfConfig: {
      needLoding: false,
    },
  })
}
//  当前登陆人语数英的在学周报
export const getLearningList = () => {
  return request({
    url: `/northUserStudyLog/getLearning`,
    method: 'get',
    selfConfig: {
      needLoding: false,
    },
  })
}
//  确定切换-增加当前周报
export const geTtoggle = (data) => {
  return request({
    url: `/northUserStudyLog/toggle`,
    method: 'post',
    data,
  })
}
//  根据科目和年级获取期刊资源list
export const getNorthJournalResourceList = (data) => {
  return request({
    url: `/northJournalResource/list`,
    method: 'post',
    data,
  })
}
//支付
export function payMoney(data) {
  return request({
    url: `/wxPay/pay`,
    method: 'post',
    data,
  })
}
//支付查询
export function queryPay(params) {
  return request({
    url: `/wxPay/query`,
    method: 'get',
    params,
  })
}
//更新用户 信息
export function updateUserInfo(data) {
  return request({
    url: `/northUserInfo/updateUserInfo`,
    method: 'post',
    data,
  })
}
//ocr图片识别
export function getOcrFile(data) {
  return request({
    url: `/northCardInfo/recognize`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    data: qs.stringify(data),
  })
}
//  根据期刊资源id和资源类型获取对应的pdf或者mp3 对应页面功能去核对
export const getNorthJournalResourceCheckList = (data) => {
  return request({
    url: `/northJournalResource/check`,
    method: 'post',
    data,
  })
}
//签到
export const dailySign = () => {
  return request({
    url: `/northDailySignRecord/dailySign`,
    method: 'get',
  })
}
//签到日历
export const singRecords = () => {
  return request({
    url: `/northDailySignRecord/singRecords`,
    method: 'get',
  })
}
//听力答题
export const getListening = (data) => {
  return request({
    url: `/listening/list`,
    method: 'post',
    data,
  })
}
//历史记录
export const getLastRecord = (data) => {
  return request({
    url: `/northOralBookRecord/getLastRecord`,
    method: 'post',
    data,
  })
}
//权威资料
export const getAuthority = (data) => {
  return request({
    url: `/testPaper/page`,
    method: 'post',
    data,
  })
}
//获取答案解析
export const getAnswerAnalysis = (data) => {
  return request({
    url: `/northJournalResource/getAnswerKey`,
    method: 'post',
    data,
  })
}
//配套答案保留历史记录
export const analysisRecord = (data) => {
  return request({
    url: `/northJournalResource/addRecord`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
// 扫码进入 获取参数
export const scanEnterBookId = (data) => {
  return request({
    url: `/northUserStudyLog/scanEnter`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
//功能试用统计
export const getTryCount = (data) => {
  return request({
    url: `/northTryCountStatistics/getTryCount`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
//权威资料功能试用次数
export const testPaper = () => {
  return request({
    url: `/testPaper/count`,
    method: 'get',
    selfConfig: {
      needLoding: false,
    },
  })
}
