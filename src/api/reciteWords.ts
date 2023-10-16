import request from '@/utils/request'
//获取首页相关接口
export function getReciteInfo(url?: string, data?: any, needLoding = false) {
  return request({
    url: `/memorizingWords/${url}`,
    method: 'post',
    selfConfig: {
      needLoding,
    },
    data,
  })
}
//获取单词相关
export function getWordInfo(url?: string, data?: any, needLoding = false) {
  return request({
    url: `/northWordContentRecord/${url}`,
    method: 'post',
    selfConfig: {
      needLoding,
    },
    data,
  })
}
//获取词书相关
export function getRecordInfo(url?: string, data?: any, needLoding = false) {
  return request({
    url: `/northWordBookRecord/${url}`,
    method: 'post',
    selfConfig: {
      needLoding,
    },
    data,
  })
}
// 获取版本
export function getVersionList() {
  return request({
    url: `/northWordBookRecord/list`,
    method: 'get',
  })
}
// 获取详情
export function getWordDetail(data) {
  return request({
    url: `/northEnglishDictionary/detail`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
