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
            <view class="maskedLayer" :style="{ height: `${vdata.mainHeight}px` }"> </view>
            <image mode="widthFix" class="maskBg" :src="vdata.tempFilePath"></image>
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
            </view>
          </view>
        </scroll-view>
      </view>

      <searchResultPopup
        @handleChange="handleChange"
        @getPopupHeight="getPopupHeight"
        ref="popupShow"
        v-if="vdata.isResult"
      ></searchResultPopup>
      <searchAgainPopup v-else ref="popupShow"></searchAgainPopup>
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
import { getHandleSearchPage } from '@/api/photoSearch'

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
  selectId: 1,
  tempFilePath: '',
  scan: true,
  searchResultResponseList: [],
})
const popupShow = ref()
// watch(
//   () => vdata.selectId,
//   (val) => {
//     // vdata.scrollTop = vdata.searchResultResponseList[val - 1].point2dXYList[0].y / 3.3
//   }
// )
const handlePosition = (list) => {
  // Width原始图片宽度
  // Height原始图片高度
  let left = ((list[0].x / vdata.orgWidth) * 100).toFixed(2)
  let top = ((list[0].y / vdata.orgHeight) * 100).toFixed(2)
  let width = (((list[1].x - list[0].x) / vdata.orgWidth) * 100).toFixed(2)
  let height = (((list[2].y - list[1].y) / vdata.orgHeight) * 100).toFixed(2)
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
  }
}
//  切换题号
const questionNoChange = (item, key) => {
  vdata.selectId = item.searchResultSerialNo
  console.log(item, key, 999)
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
  Taro.redirectTo({
    url: '../photographPage/index?type=2',
  })
}
onMounted(async () => {
  vdata.tempFilePath = router.params.tempFilePath
  vdata.questionType = router.params.questionType || 1
  // let timer = setInterval(() => {
  //   Taro.createSelectorQuery()
  //     .select('.maskBg')
  //     .boundingClientRect((rec) => {
  //       if (rec) {
  //         console.log(rec.height, 'rec.height==========')
  //         vdata.mainHeight = rec.height
  //         clearInterval(timer)
  //       }
  //     })
  //     .exec()
  // }, 1500)
  let req = {
    imageUrl: router.params.tempFilePath,
    courseType: Taro.getStorageSync('courseType'),
    // imageUrl: 'https://scsf.oss-cn-shanghai.aliyuncs.com/aaa/5.png',
  }
  const res = await getHandleSearchPage(req)
  if (!res) {
    vdata.isResult = false
    vdata.scan = false
    setTimeout(() => {
      popupShow.value.popupShow(2)
    }, 300)
    return
  } else {
    vdata.orgWidth = res.orgWidth
    vdata.orgHeight = res.orgHeight
    vdata.searchResultResponseList = res.searchResultResponseList || []
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
      item.searchResultsContentResponseList = item.searchResultsContentResponseList || [{}]
      item.searchResultsContentResponseList.forEach((element, index) => {
        element.addOrdelFlag = false
        element.topic = element.topic || ''
        element.process = element.process || ''
        element.topic = element.topic.replace('<img ', '<img style="width:100%;height:auto"')
        element.process = element.process.replace('<img ', '<img style="width:100%;height:auto"')
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
      popupShow.value.popupShow(vdata.searchResultResponseList)
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
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  // background: rgba(0, 0, 0, 0.16);
  // position: relative;
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
        border: 1px solid red;
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
