<template>
  <view class="photographResult">
    <NavBar title="批改结果"> </NavBar>
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
            <template v-for="(item, key) in vdata.searchResultResponseList" :key="key">
              <view
                v-if="item.questionNo != null"
                class="mc-item"
                :class="{ mcItemBorder: vdata.selectId == item.questionNo }"
                :style="handlePosition(item.point2dXYDtoList)"
                @tap="questionNoChange(item, item.questionNo)"
              >
                <view class="mcItemBorder-footer">
                  <view v-show="vdata.selectId != item.questionNo" class="questionNo">{{
                    item.questionNo
                  }}</view>
                </view>
              </view>
              <view v-else class="right-item" :style="handleRight(item.point2dXYDtoList)">
                <image
                  class="rightImg"
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kspg/c8b3625b9ff9414bb946eb09850aa7a1/dg.png"
                  mode="scaleToFill"
                />
              </view>
            </template>
          </view>
        </scroll-view>
      </view>

      <correctionResultsPopup
        @handleChange="handleChange"
        @getPopupHeight="getPopupHeight"
        ref="popupShow"
        :correct="true"
        :numberInfo="vdata.numberInfo"
        v-show="vdata.isResult"
      ></correctionResultsPopup>
      <!-- <searchAgainPopup v-else :isCorrect="true" ref="popupShow"></searchAgainPopup> -->
    </view>
    <view class="bottomBtn" v-if="vdata.scan">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/d02c7b7fb83d4247bc5f6ee5c8db35b2/loadingBg.gif"
      ></image>
    </view>
  </view>
</template>
<script setup>
import NavBar from '@/components/NavBar.vue'
import correctionResultsPopup from '@/components/correctionResultsPopup.vue'
// import searchAgainPopup from '@/components/searchAgainPopup.vue'
import scan from '@/components/scan.vue'
import { getOralResult, getOralDetail } from '@/api/oralCorrection'

import Taro, { useRouter } from '@tarojs/taro'
import { reactive, ref, onMounted, watch } from 'vue'
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo

const router = useRouter()

const vdata = reactive({
  questionType: 1,
  isResult: false,
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
  numberInfo: {},
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
//  切换题号
const questionNoChange = (item, key) => {
  vdata.selectId = item.questionNo
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
  // let res = {
  //   imgUrl: 'https://scsf.oss-cn-shanghai.aliyuncs.com/741.jpg',
  //   correctRate: 0.57,
  //   imgHeight: 1706,
  //   imgWidth: 1280,
  //   questionNum: 7,
  //   wrongNum: 3,
  //   correctNum: 4,
  //   questionVos: [
  //     {
  //       questionNo: 1,
  //       text: '{7|12}×{3|14}=2',
  //       rightText: '{7|12}×{3|14}={1|8}',
  //       point2dXYDtoList: [
  //         {
  //           x: 764,
  //           y: 531,
  //         },
  //         {
  //           x: 1184,
  //           y: 530,
  //         },
  //         {
  //           x: 1184,
  //           y: 678,
  //         },
  //         {
  //           x: 764,
  //           y: 679,
  //         },
  //       ],
  //       isRight: false,
  //     },
  //     {
  //       questionNo: null,
  //       text: '{5|6}×1.2=1',
  //       rightText: '{5|6}×1.2=1',
  //       point2dXYDtoList: [
  //         {
  //           x: 125,
  //           y: 543,
  //         },
  //         {
  //           x: 461,
  //           y: 543,
  //         },
  //         {
  //           x: 461,
  //           y: 685,
  //         },
  //         {
  //           x: 125,
  //           y: 685,
  //         },
  //       ],
  //       isRight: true,
  //     },
  //     {
  //       questionNo: null,
  //       text: '{2|3}×{9|10}={3|5}',
  //       rightText: '{2|3}×{9|10}={3|5}',
  //       point2dXYDtoList: [
  //         {
  //           x: 121,
  //           y: 700,
  //         },
  //         {
  //           x: 512,
  //           y: 699,
  //         },
  //         {
  //           x: 512,
  //           y: 869,
  //         },
  //         {
  //           x: 121,
  //           y: 869,
  //         },
  //       ],
  //       isRight: true,
  //     },
  //     {
  //       questionNo: 2,
  //       text: '14.4×{9|16}=3',
  //       rightText: '14.4×{9|16}=8.1',
  //       point2dXYDtoList: [
  //         {
  //           x: 770,
  //           y: 714,
  //         },
  //         {
  //           x: 1176,
  //           y: 714,
  //         },
  //         {
  //           x: 1176,
  //           y: 860,
  //         },
  //         {
  //           x: 770,
  //           y: 861,
  //         },
  //       ],
  //       isRight: false,
  //     },
  //     {
  //       questionNo: null,
  //       text: '0.6×{2|5}={6|25}',
  //       rightText: '0.6×{2|5}={6|25}',
  //       point2dXYDtoList: [
  //         {
  //           x: 767,
  //           y: 872,
  //         },
  //         {
  //           x: 1222,
  //           y: 872,
  //         },
  //         {
  //           x: 1222,
  //           y: 1057,
  //         },
  //         {
  //           x: 767,
  //           y: 1057,
  //         },
  //       ],
  //       isRight: true,
  //     },
  //     {
  //       questionNo: null,
  //       text: '{7|30}×{10|21}={1|9}',
  //       rightText: '{7|30}×{10|21}={1|9}',
  //       point2dXYDtoList: [
  //         {
  //           x: 113,
  //           y: 873,
  //         },
  //         {
  //           x: 570,
  //           y: 873,
  //         },
  //         {
  //           x: 570,
  //           y: 1084,
  //         },
  //         {
  //           x: 113,
  //           y: 1084,
  //         },
  //       ],
  //       isRight: true,
  //     },
  //     {
  //       questionNo: 3,
  //       text: '4.8×{3|8}-4.8×{3|8}=',
  //       rightText: '4.8×{3|8}-4.8×{3|8}=0',
  //       point2dXYDtoList: [
  //         {
  //           x: 136,
  //           y: 1215,
  //         },
  //         {
  //           x: 824,
  //           y: 1215,
  //         },
  //         {
  //           x: 824,
  //           y: 1433,
  //         },
  //         {
  //           x: 136,
  //           y: 1434,
  //         },
  //       ],
  //       isRight: false,
  //     },
  //   ],
  // }
  let res
  if (router.params.correctRecordId) {
    res = await getOralDetail({ id: router.params.correctRecordId })
  } else {
    vdata.scan = true
    let req = {
      imageUrl: router.params.tempFilePath,
    }
    res = await getOralResult(req)
  }
  if (res.code) {
    Taro.showToast({
      title: res.msg,
      icon: 'none',
      duration: 2000,
    })
    vdata.scan = false
    return
  }
  if (!res) {
    vdata.isResult = false
    vdata.scan = false
    setTimeout(() => {
      popupShow.value.popupShow(2)
    }, 300)
    return
  } else {
    const { correctNum, questionNum, wrongNum } = res
    vdata.orgWidth = res.imgWidth
    vdata.orgHeight = res.imgHeight
    vdata.searchResultResponseList = res.questionVos || []
    if (!vdata.searchResultResponseList.length) {
      vdata.isResult = false
      vdata.scan = false
      setTimeout(() => {
        popupShow.value.popupShow(2)
      }, 300)
      return
    }
    vdata.numberInfo = {
      correctNum,
      questionNum,
      wrongNum,
    }
    vdata.isResult = true
    setTimeout(() => {
      vdata.scan = false
      let searchResultResponseList = vdata.searchResultResponseList.filter(
        (item) => item.questionNo !== null
      )
      popupShow.value.popupShow(
        searchResultResponseList,
        res.correctRecordId || router.params.correctRecordId || ''
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
      .rightImg {
        width: 23px;
        height: 23px;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
      .mc-item {
        position: absolute;
        left: 0;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.16);
        box-sizing: border-box;
        border: 2px solid #ff4141;
        .questionNo {
          border-radius: 10px;
          background: #4f94ff;
          color: #fff;
          padding: 2px 5px;
          position: absolute;
          left: 50%;
          font-size: 12px;
          top: 50%;
          transform: translate(-50%, -50%);
          // z-index: 100;
        }
      }
      .right-item {
        position: absolute;
        left: 0;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.16);
        box-sizing: border-box;
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
