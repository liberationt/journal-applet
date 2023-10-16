import request from '@/utils/request'
import qs from 'qs'
//获取版本信息
export function getVersionList(url) {
  return request({
    url: `${url}`,
    method: 'post',
    selfConfig: {
      needLoding: false,
    },
    data: {},
  })
}
export function getOralInfo(url?: string, data?: any, needLoding = false) {
  return request({
    url: `/oral/${url}`,
    method: 'post',
    selfConfig: {
      needLoding,
    },
    data,
  })
}
export function northOralFavorite(url?: string, data?: any, needLoding = false) {
  return request({
    url: `/northOralFavorite/${url}`,
    method: 'post',
    selfConfig: {
      needLoding,
    },
    data,
  })
}
