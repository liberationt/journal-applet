import request from '@/utils/request'
import qs from 'qs'
//获取列表
export function getCorrectRecords(data) {
  return request({
    url: `/northEssayCorrection/getCorrectRecords`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}

export function deleteCorrect(data) {
  return request({
    url: `/northEssayCorrection/delete`,
    method: 'post',
    data,
  })
}
//作文批改 获取图片内容
export function getEssayContent(data) {
  return request({
    url: `/northEssayCorrection/getEssayContent`,
    method: 'post',
    data,
  })
}
//作文批改结果
export function getEssayCorrectResult(data) {
  return request({
    url: `/northEssayCorrection/getEssayCorrectResult`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    selfConfig: {
      needLoding: false,
    },
    timeout: 50000,
    data: qs.stringify(data, { indices: false }),
  })
}
//获取详情
export function getEssayDetail(data) {
  return request({
    url: `/northEssayCorrection/detail`,
    method: 'post',
    data,
  })
}
