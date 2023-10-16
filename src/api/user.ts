import request from '@/utils/request'
//获取用户信息
export function getUserInfo() {
  return request({
    url: `/northUserInfo/getUserInfo`,
    method: 'get',
    selfConfig: {
      needLoding: false,
    },
  })
}
// 登录
export function wxLogin(data) {
  return request({
    url: `/wxLogin/getToken`,
    method: 'post',
    params: data,
  })
}
// 获取用户手机号
export function getUserPhone(params) {
  return request({
    url: `/wxLogin/bindPhoneNumber`,
    method: 'get',
    params,
  })
}
// 是否是第一次录入信息，需要填写资料，
export function firstEntry() {
  return request({
    url: `/northUserInfo/firstEntry`,
    method: 'get',
  })
}
// 判断是否vip
export function getMember() {
  return request({
    url: `/northUserInfo/isVip`,
    method: 'get',
    selfConfig: {
      needLoding: false,
    },
  })
}
//交易记录
export function getTransactList() {
  return request({
    url: `/northOrdersLog/list`,
    method: 'get',
  })
}

//修改用户升年级已首次展示首页为true
export function updateDisplayed(data) {
  return request({
    url: `/northUserInfo/updateDisplayed`,
    method: 'post',
    data,
  })
}

//手动入录学校
export function loggingSchool(data) {
  return request({
    url: `/baseSchoolInfo/entrySchool`,
    method: 'post',
    data,
  })
}

//获取学校详细信息by id
export function getShcoolDetail(params) {
  return request({
    url: `/baseSchoolInfo/getDetailInfo`,
    method: 'post',
    params,
  })
}
