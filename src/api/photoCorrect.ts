import request from '@/utils/request'
import qs from 'qs'
//拍照批改列表
export function getPhotoCorrentList(data) {
  return request({
    url: `/northQuestionCorrectionRecord/page`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
//拍照批改记录
// export function getPhotoCorrentList(data) {
//   return request({
//     url: `/northQuestionCorrectionRecord/list`,
//     method: 'post',
//     data,
//     selfConfig: {
//       needLoding: false,
//     },
//   })
// }

//删除批改记录
export function deleteCorrect(data) {
  return request({
    url: `/northQuestionCorrectionRecord/delete`,
    method: 'post',
    data,
  })
}
//查询详情
export function getPhotoDetail(data) {
  return request({
    url: `/northQuestionCorrectionRecord/detail`,
    method: 'post',
    data,
  })
}
//手动批改
export function handCorrect(data) {
  return request({
    url: `/northQuestionCorrectionRecord/handCorrect`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
//处理拍照
export function getPhotoProcess(data) {
  return request({
    url: `/northQuestionCorrectionRecord/process`,
    method: 'post',
    data,
    selfConfig: {
      needLoding: false,
    },
  })
}
//  整页搜索查询坐标及结果
export function getHandleCorrent(data) {
  return request({
    url: `/northQuestionCorrectionRecord/process`,
    method: 'post',
    data,
  })
}
//拍照批改详情
export function getCorrectionRecordDetail(data) {
  return request({
    url: `/northQuestionCorrectionRecord/detail`,
    method: 'post',
    data,
  })
}
