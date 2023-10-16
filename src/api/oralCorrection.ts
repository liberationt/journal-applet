import request from '@/utils/request'
import qs from 'qs'
//获取列表
export function getOralCorrentList(data) {
  return request({
    url: `/northOralCorrection/records`,
    method: 'get',
    selfConfig: {
      needLoding: false,
    },
  })
}
//批改接口
export function getOralResult(data) {
  return request({
    url: `/northOralCorrection/getResult`,
    method: 'post',
    data,
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    // },
    // data: qs.stringify(data),
  })
}
// 删除
export function deleteCorrect(data) {
  return request({
    url: `/northOralCorrection/delete`,
    method: 'post',
    data,
  })
}
//获取详情
export function getOralDetail(data) {
  return request({
    url: `/northOralCorrection/detail`,
    method: 'post',
    data,
  })
}
