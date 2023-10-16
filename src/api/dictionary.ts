import request from '@/utils/request'
//获取语文搜索列表
export function getChineseList(data) {
  return request({
    url: `/northChineseDictionary/charList`,
    method: 'post',
    data,
  })
}
//获取语文文字详情
export function getCharDetail(data,needLoding=true) {
  return request({
    url: `/northChineseDictionary/charDetail`,
    method: 'post',
    data,
    selfConfig: {
      needLoding,
    },
  })
}
//搜索英文列表
export function getEnglishList(data) {
  return request({
    url: `/northEnglishDictionary/list`,
    method: 'post',
    data,
  })
}
//单词详情
export function getWordTextDetail(data) {
  return request({
    url: `/northEnglishDictionary/detail`,
    method: 'post',
    data,
  })
}
//单词收藏
export function addFavorite(data,needLoding=true) {
  return request({
    url: `/northEnglishDictionary/addFavorite`,
    method: 'post',
    data,
    selfConfig: {
      needLoding,
    },
  })
}
//收藏本列表
export function getFavoriteList(data) {
  return request({
    url: `/northEnglishDictionary/favoriteList`,
    method: 'post',
    data,
  })
}
