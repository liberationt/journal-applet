<template>
  <view class="photographResult">
    <NavBar title="">
      <template #left>
        <cover-view class="left">
          <cover-image
            @tap="closePhoto"
            class="closeImg"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/581a0ecdd58b4f5cb35160a5b9fd23b2/backNav.png"
          ></cover-image>
        </cover-view>
      </template>
    </NavBar>
    <scan v-if="vdata.scan"></scan>
    <view class="content" :style="{ paddingTop: `${navBarHeight + 15}px` }">
      <view
        class="imgHeightBox"
        :style="{
          height: `calc(100vh - ${navBarHeight + vdata.popupHeight - 10}px)`,
          top: `${navBarHeight}px`,
        }"
      >
        <scroll-view
          class="scroll-view_H"
          white-space:
          nowrap
          :scroll-y="true"
          :scroll-with-animation="true"
          :trapScroll="true"
          :disableLowerScroll="true"
          :disableUpperScroll="true"
          :scroll-top="vdata.scrollTop"
        >
          <view class="box">
            <view class="maskedLayer"> </view>
            <image mode="widthFix" class="maskBg" :src="vdata.tempFilePath"> </image>
            <view
              class="mc-item"
              :class="{ mcItemBorder: vdata.selectId == item.searchResultSerialNo }"
              v-for="(item, key) in vdata.searchResultResponseList"
              :style="handlePosition(item.point2dXYList)"
              :key="key"
              @tap="questionNoChange(item, key)"
            >
              <view class="mcItemBorder-footer">
                <view v-show="vdata.selectId != item.searchResultSerialNo" class="questionNo">{{
                  item.searchResultSerialNo
                }}</view>
              </view>
              <template
                v-if="item.correctRecordAnswerResponses && item.correctRecordAnswerResponses.length"
              >
                <view
                  v-for="(items, i) in item.correctRecordAnswerResponses"
                  class="rightAnswer"
                  :key="i"
                >
                  <template v-if="items.point2dXYList">
                    <view :style="handleRight(item.point2dXYList, items.point2dXYList)" class="dc">
                      <image
                        v-if="items.isTrue"
                        class="rightImg"
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/33d548ad971142d3914e0a53e76c0f59/right.png"
                        mode="scaleToFill"
                      />
                      <image
                        v-else
                        class="errorImg"
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/12d09fbae00247aab794ac5fd1287142/error.png"
                        mode="scaleToFill"
                      />
                    </view>
                  </template>
                </view>
              </template>
            </view>
          </view>
        </scroll-view>
      </view>

      <searchResultPopup
        @handleChange="handleChange"
        @getPopupHeight="getPopupHeight"
        ref="popupShow"
        :correct="true"
        v-if="vdata.isResult"
      ></searchResultPopup>
      <searchAgainPopup v-else :isCorrect="true" ref="popupShow"></searchAgainPopup>
    </view>
    <view class="bottomBtn" v-if="vdata.scan">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/d02c7b7fb83d4247bc5f6ee5c8db35b2/loadingBg.gif"
      ></image>
    </view>
  </view>
</template>
<script setup>
import searchResultPopup from '@/components/searchResultPopup.vue'
import searchAgainPopup from '@/components/searchAgainPopup.vue'
import scan from '@/components/scan.vue'
import NavBar from '@/components/ProtogenesisNavbar.vue'
import { getPhotoProcess, getCorrectionRecordDetail } from '@/api/photoCorrect'

import Taro, { useRouter } from '@tarojs/taro'
import { reactive, ref, onMounted, watch } from 'vue'
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo

const router = useRouter()

const vdata = reactive({
  questionType: 1,
  scrollTop: 0,
  orgWidth: '',
  orgHeight: '',
  popupHeight: 0,
  mainHeight: '',
  mainWidth: '',
  selectId: 1,
  tempFilePath: '',
  scan: false,
  searchResultResponseList: [],
})
const popupShow = ref()
const handlePosition = (list) => {
  // Width原始图片宽度
  // Height原始图片高度
  let left = ((list[0].x / vdata.orgWidth) * 100).toFixed(2)
  let top = ((list[0].y / vdata.orgHeight) * 100).toFixed(2)
  let width = (((list[2].x - list[0].x) / vdata.orgWidth) * 100).toFixed(2)
  let height = (((list[2].y - list[0].y) / vdata.orgHeight) * 100).toFixed(2)
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
  }
}
const handleRight = (list, list1) => {
  let left2 = ((list[0].x / vdata.orgWidth) * 100).toFixed(2)
  let top2 = ((list[0].y / vdata.orgHeight) * 100).toFixed(2)
  let width2 = (((list[2].x - list[0].x) / vdata.orgWidth) * 100).toFixed(2)
  let height2 = (((list[2].y - list[0].y) / vdata.orgHeight) * 100).toFixed(2)
  let left1 = ((list1[0].x / vdata.orgWidth) * 100).toFixed(2)
  let top1 = ((list1[0].y / vdata.orgHeight) * 100).toFixed(2)
  let width1 = (((list1[2].x - list1[0].x) / vdata.orgWidth) * 100).toFixed(2)
  let height1 = (((list1[2].y - list1[0].y) / vdata.orgHeight) * 100).toFixed(2)
  let left = (((left1 - left2) / width2) * 100).toFixed(2)
  let top = (((top1 - top2) / height2) * 100).toFixed(2)
  let width = ((width1 / width2) * 100).toFixed(2)
  let height = ((height1 / height2) * 100).toFixed(2)
  // let width =
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
    // width: '80%',
    // height: '80%',
  }
}
//  切换题号
const questionNoChange = (item, key) => {
  vdata.selectId = item.searchResultSerialNo
  popupShow.value.questionNoChange(item, key)
}
//  swiper滑动，触发
const handleChange = (index) => {
  vdata.selectId = index + 1
}
//  获取弹框高度
const getPopupHeight = (val) => {
  vdata.popupHeight = val
}
// 关闭页面
const closePhoto = () => {
  Taro.navigateBack({ delta: 1 })
}
onMounted(async () => {
  vdata.tempFilePath = router.params.tempFilePath || ''
  vdata.questionType = router.params.questionType || 1
  let timer = setInterval(() => {
    Taro.createSelectorQuery()
      .select('.maskBg')
      .boundingClientRect((rec) => {
        if (rec) {
          vdata.mainHeight = rec.height
          vdata.mainWidth = rec.width
        }
      })
      .exec()
  }, 300)

  // const res = await getPhotoProcess(req)
  let res
  if (router.params.correctRecordId) {
    res = await getCorrectionRecordDetail({ correctRecordId: router.params.correctRecordId })
  } else {
    vdata.scan = true
    let req = {
      imgUrl: router.params.tempFilePath,
      courseType: Taro.getStorageSync('courseType'),
    }
    res = await getPhotoProcess(req)
  }

  if (!res) {
    vdata.isResult = false
    vdata.scan = false
    setTimeout(() => {
      popupShow.value.popupShow(2)
    }, 300)
    return
  } else {
    vdata.orgWidth = res.originWidth
    vdata.orgHeight = res.originHeight
    vdata.searchResultResponseList = res.questionCorrectionResponses || []
    if (!vdata.searchResultResponseList.length) {
      vdata.isResult = false
      vdata.scan = false
      setTimeout(() => {
        popupShow.value.popupShow(2)
      }, 300)
      return
    }
    vdata.isResult = true
    vdata.searchResultResponseList.forEach((item, index) => {
      if (
        !(item.searchResultsContentResponseList && item.searchResultsContentResponseList.length)
      ) {
        item.show = true
      }
      // item.searchResultsContentResponseList = item.searchResultsContentResponseList || [{}]
      item.searchResultsContentResponseList = item.searchResultsContentResponseList || [{}]
      if (item.searchResultsContentResponseList.length) {
        item.searchResultsContentResponseList.forEach((element, index) => {
          element.addOrdelFlag = false
          element.topic = element.topic || ''
          element.process = element.process || ''
          // element.topic = element.topic.replace('<img ', '<img style="width:100%;height:auto"')
          // element.process = element.process.replace('<img ', '<img style="width:100%;height:auto"')
          if (element.process) {
            element.process = element.process.replace(
              '<img ',
              '<img style="width:100%;height:auto"'
            )
          }
          element.answerList = []
          if (element.questionAnswer && element.questionAnswer.length) {
            element.questionAnswer.forEach((str) => {
              str.stem = str.stem.replace('<img ', '<img style="width:100%;height:auto"')
              if (str.flag === true || str.flag === 'true') {
                element.answerList.push(str)
              }
            })
          }
        })
      }

      item.id = index
      item.resultId = 0
      let length =
        item.searchResultsContentResponseList.length > 3
          ? 3
          : item.searchResultsContentResponseList.length
      item.resultList = []
      for (let i = 0; i < length; i++) {
        let str = ''
        if (i === 0) {
          str = '结果一'
        } else if (i === 1) {
          str = '结果二'
        } else {
          str = '结果三'
        }
        item.resultList.push({ label: str, id: i })
      }
    })
    setTimeout(() => {
      vdata.scan = false
      popupShow.value.popupShow(
        vdata.searchResultResponseList,
        res.correctRecordId || router.params.correctRecordId
      )
      setTimeout(() => {
        vdata.popupHeight = 552
      }, 200)
    }, 500)
  }
})
</script>
<style lang="scss">
.photographResult {
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  .viewImage {
    .nut-overlay {
      background: #000000;
    }
    .nut-popup {
      background: none;
    }
  }
  .content {
    // padding-top: 80px;
    padding-left: 20px;
    padding-right: 20px;
    .imgHeightBox {
      overflow: auto;
      width: 100%;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .maskBg {
      width: 100%;
      // height: 85%;
    }
    .box {
      position: relative;
      width: 100%;
      .maskedLayer {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.16);
        position: absolute;
        left: 0;
        top: 0;
      }
      .mc-item {
        position: absolute;
        left: 0;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.16);
        box-sizing: border-box;
        border: 1px solid #fafafa;
        .questionNo {
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          padding: 2px 5px;
          position: absolute;
          left: 50%;
          font-size: 12px;
          top: 50%;
          transform: translate(-50%, -50%);
          // z-index: 100;
        }
        .dc {
          position: absolute;
          z-index: 1;
          .rightImg {
            width: 18px;
            height: 12px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          .errorImg {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: '-5px';
            bottom: 0;
            right: 0;
          }
        }
        .rightAnswer {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
        }
      }
      .mcItemBorder {
        border: 1px solid rgba(255, 255, 255, 0.16);
      }
      .mcItemBorder::before {
        position: absolute;
        top: -1px;
        left: -1px;
        width: 10px;
        height: 10px;
        border-left: 2px solid #ffffff;
        border-top: 2px solid #ffffff;
        content: '';
      }
      .mcItemBorder::after {
        position: absolute;
        top: -1px;
        right: -1px;
        width: 10px;
        height: 10px;
        border-right: 2px solid #ffffff;
        border-top: 2px solid #ffffff;
        content: '';
      }
      .mcItemBorder .mcItemBorder-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .mcItemBorder .mcItemBorder-footer::before {
        position: absolute;
        bottom: -1px;
        left: -1px;
        width: 10px;
        height: 10px;
        border-left: 2px solid #ffffff;
        border-bottom: 2px solid #ffffff;
        content: '';
      }
      .mcItemBorder .mcItemBorder-footer::after {
        position: absolute;
        bottom: -1px;
        right: -1px;
        width: 10px;
        height: 10px;
        border-right: 2px solid #ffffff;
        border-bottom: 2px solid #ffffff;
        content: '';
      }
    }
  }
  .bottomBtn {
    height: 115px;
    width: 100%;
    background: #000;
    position: fixed;
    bottom: 0;
    // padding: 0 16px 0 50px;
    z-index: 1;
    image {
      width: 64px;
      height: 64px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .popupBox {
    image {
      width: 100%;
      // height: 85%;
    }
  }
}
.scroll-view_H {
  white-space: nowrap;
  width: 100%;
  height: 100%;
}
</style>
