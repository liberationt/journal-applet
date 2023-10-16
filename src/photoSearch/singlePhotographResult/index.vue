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
    <view class="content" :style="{ paddingTop: `${navBarHeight}px` }">
      <view class="maskedLayer" @tap="viewPicture"> </view>
      <image mode="widthFix" class="maskBg" :src="vdata.tempFilePath"></image>
      <searchResultPopup
        :type="true"
        :tempFilePath="vdata.tempFilePath"
        v-if="vdata.isResult"
        ref="popupShow"
      ></searchResultPopup>
      <searchAgainPopup v-else ref="popupShow"></searchAgainPopup>
      <view class="viewImage">
        <nut-popup
          @tap="vdata.imgShow = false"
          :style="{ width: '100%' }"
          v-model:visible="vdata.imgShow"
        >
          <image mode="widthFix" class="maskBg" :src="vdata.tempFilePath"></image>
        </nut-popup>
      </view>
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
import { getHandleSearchSingle } from '@/api/photoSearch'

import Taro, { useRouter } from '@tarojs/taro'
import { reactive, ref, onMounted } from 'vue'
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo

const router = useRouter()

const vdata = reactive({
  isResult: true,
  tempFilePath: '',
  imgShow: false,
  scan: true,
  searchResultResponseList: [],
})
const popupShow = ref()
const viewPicture = () => {
  vdata.imgShow = true
}
// 关闭页面
const closePhoto = () => {
  if (vdata.imgShow) {
    vdata.imgShow = false
  } else {
    Taro.redirectTo({
      url: '../photographPage/index',
    })
  }
}
onMounted(async () => {
  vdata.tempFilePath = router.params.tempFilePath
  let req = {
    imgUrl: router.params.tempFilePath,
    courseType: Taro.getStorageSync('courseType'),
    // imgUrl: 'https://scsf.oss-cn-shanghai.aliyuncs.com/abc/ma_1_2-2.png',
  }
  const res = await getHandleSearchSingle(req)
  if (!res) {
    vdata.isResult = false
  } else {
    vdata.searchResultResponseList = res.searchResultResponseList || []
    if (!vdata.searchResultResponseList || !vdata.searchResultResponseList.length) {
      vdata.isResult = false
      vdata.scan = false
      setTimeout(() => {
        popupShow.value.popupShow()
      }, 300)
      return
    }
    // vdata.isResult = true
    vdata.searchResultResponseList.forEach((item, index) => {
      item.searchResultsContentResponseList.forEach((element, index) => {
        element.addOrdelFlag = false
        if (element.topic) {
          element.topic = element.topic.replace('<img ', '<img style="width:100%;height:auto"')
        }
        if (element.process) {
          element.process = element.process.replace('<img ', '<img style="width:100%;height:auto"')
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
  }
  setTimeout(() => {
    vdata.scan = false
    popupShow.value.popupShow(vdata.searchResultResponseList)
  }, 300)
})
</script>
<style lang="scss">
.photographResult {
  width: 100%;
  height: 100vh;
  // background: rgba(0, 0, 0, 0.16);
  // position: relative;

  .content {
    // padding-top: 80px;
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    .maskedLayer {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.16);
      position: fixed;
    }
    .maskBg {
      width: calc(100% - 40px);
      margin-left: 20px;
      margin-right: 20px;
      margin-top: 20px;
      // height: 85%;
    }
  }
  .bottomBtn {
    height: 115px;
    width: 100%;
    background: #000;
    position: fixed;
    bottom: 0;
    image {
      width: 64px;
      height: 64px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .viewImage {
    .nut-overlay {
      background: #000000;
    }
    .nut-popup {
      background: none;
    }
    image {
      margin: 0 !important;
      width: 100% !important;
    }
  }
}
</style>
