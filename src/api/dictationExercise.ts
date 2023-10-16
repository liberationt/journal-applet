import request from '@/utils/request'
//获取版本信息
export function getChineseVersionList(url) {
  return request({
    url: `${url}`,
    method: 'post',
    selfConfig: {
      needLoding: false,
    },
    data: {},
  })
}
export function getDicExeInfo(url?: string, data?: any, needLoding = false) {
  return request({
    url: `/dicExe/${url}`,
    method: 'post',
    selfConfig: {
      needLoding,
    },
    data,
  })
}
