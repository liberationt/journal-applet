import request from '@/utils/request'
export function chapterInfo(url?: string, data?: any, needLoding = false) {
  return request({
    url: `/northQuestionBrushChapter/${url}`,
    method: 'post',
    selfConfig: {
      needLoding,
    },
    data,
  })
}
export function questionInfo(url?: string, data?: any, needLoding = false) {
  return request({
    url: `/northQuestionBrushTiku/${url}`,
    method: 'post',
    selfConfig: {
      needLoding,
    },
    data,
  })
}
export function questionAnswerPk(url?: string, data?: any, needLoding = false) {
  return request({
    url: `/northQuestionBrushChapter/${url}`,
    method: 'post',
    selfConfig: {
      needLoding,
    },
    data,
  })
}
//我的成绩
export function queryMyScore() {
  return request({
    url: `/northQuestionBrushChapter/myScore`,
    method: 'get',
  })
}
//判断是否刷过提
export function currentDayFirstUse() {
  return request({
    url: `/northQuestionBrushSubmitRecord/isCurrentDayFirstUse`,
    method: 'get',
    selfConfig: {
      needLoding: false,
    },
  })
}
// 加入错题
export function addWrongInfo(data) {
  return request({
    url: `/northQuestionBrushChapter/addWrong`,
    method: 'post',
    selfConfig: {
      needLoding: false,
    },
    data,
  })
}
