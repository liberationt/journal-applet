import request from '@/utils/request'
import qs from 'qs'

//错题本首页学科
export function wrongbookList(data) {
  return request({
    url: `/northExerciseBook/list`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
// 错题本切割
export function processImage(data) {
  return request({
    url: `/northExerciseBook/process`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
//保存错题本
export function saveSegment(data) {
  return request({
    url: `/northExerciseBook/saveSegment`,
    method: 'post',
    data,
  })
}
//删除错题本
export function removeWrobook(data) {
  return request({
    url: `/northExerciseBook/removeOut`,
    method: 'post',
    data,
  })
}

//错题本列表
export function wrongList(data) {
  return request({
    url: `/northExerciseBook/page`,
    method: 'post',
    data,
  })
}
//错题本详情
export function wrongDetail(data) {
  return request({
    url: `/northExerciseBook/detail`,
    method: 'post',
    data,
  })
}
//修改答案
export function updateAnswer(data) {
  return request({
    url: `/northExerciseBook/updateAnswer`,
    method: 'post',
    data,
  })
}

//修改标签
export function updateTag(data) {
  return request({
    url: `/northExerciseBook/updateTag`,
    method: 'post',
    data,
  })
}
//获取组卷名称
export function getPaperName(data) {
  return request({
    url: `/northExercisePaper/getName`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
//组卷
export function combinePaper(data) {
  return request({
    url: `/northExercisePaper/combine`,
    method: 'post',
    data,
  })
}
export function combinePaperV2(data) {
  return request({
    url: `/northExercisePaper/combineV2`,
    method: 'post',
    data,
  })
}
//组卷列表
export function getPaperList(data) {
  return request({
    url: `/northExercisePaper/page`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
//删除组卷
export function deletePaper(data) {
  return request({
    url: `/northExercisePaper/delete`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
//发送邮箱
export function sendEmail(data) {
  return request({
    url: `/northNoticeLog/send`,
    method: 'post',
    data,
  })
}
//添加错题标签
export function addTag(data) {
  return request({
    url: `/northErrorQuestionTag/addTag`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
//获取添加错题标签
export function tagList() {
  return request({
    url: `/northErrorQuestionTag/list`,
    method: 'get',
    selfConfig: {
      needLoding: false,
    },
  })
}
// 删除标签
export function deleteTag(data) {
  return request({
    url: `/northErrorQuestionTag/deleteTag`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
