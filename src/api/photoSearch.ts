import request from '@/utils/request'

//  身份认证
export function getValidAuth(data) {
  return request({
    url: `/northQuestionLibrary/validAuth`,
    method: 'post',
    data,
  })
}
//  查看题目坐标
export function getSearchQuestion(data) {
  return request({
    url: `/northQuestionLibrary/searchQuestion`,
    method: 'post',
    data,
  })
}
//  单题搜索，查询结果
export function getHandleSearchSingle(data) {
  return request({
    url: `/northQuestionLibrary/handleSearchSingle`,
    method: 'post',
    data,
  })
}
//  整页搜索查询坐标及结果
export function getHandleSearchPage(data) {
  return request({
    url: `/northQuestionLibrary/handleSearchPage`,
    method: 'post',
    data,
  })
}
//  加入错题本
export function getAddWrong(data) {
  return request({
    url: `/northQuestionLibrary/addWrong`,
    method: 'post',
    data,
  })
}
//  移出错题本
export function removeWrobook(data) {
  return request({
    url: `/northExerciseBook/removeOut`,
    method: 'post',
    data,
  })
}
//们本转图片
export function textToImage(data) {
  return request({
    url: `/northQuestionLibrary/toImage`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
