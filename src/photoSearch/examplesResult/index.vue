<template>
  <view class="examplesResult">
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
    <view class="content" :style="{ paddingTop: `${navBarHeight}px` }">
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
          <view @tap="questionNoChange(1)" class="questionNo questionNo_first">
            <view v-show="vdata.questionNoShow == 1">1</view>
          </view>
          <view @tap="questionNoChange(2)" class="questionNo questionNo_second">
            <view v-show="vdata.questionNoShow == 2">2</view>
          </view>
          <view @tap="questionNoChange(3)" class="questionNo questionNo_third">
            <view v-show="vdata.questionNoShow == 3">3</view>
          </view>
          <view @tap="questionNoChange(4)" class="questionNo questionNo_fourth">
            <view v-show="vdata.questionNoShow == 4">4</view>
          </view>
          <view class="arrowBox" v-show="!vdata.questionNoShow">
            <view class="arrow">点击查答案解析</view>
            <view class="arrowhead"></view>
          </view>
          <view class="box">
            <image mode="widthFix" class="maskBg" :src="vdata.tempFilePath"></image>
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="bottomBtn">
      <view class="title">{{ vdata.type ? '批改完成' : '搜题完成' }}</view>
      <view class="detail">请点击图片上的题目查看详情</view>
      <view class="againBtn" @tap="closePhoto">体验完毕，立即拍照</view>
    </view>
    <examplesPopup
      @questionNoChangeEmit="questionNoChangeEmit"
      @getPopupHeight="getPopupHeight"
      ref="popupShow"
    ></examplesPopup>
  </view>
</template>
<script setup>
import examplesPopup from '@/components/examplesPopup.vue'
import NavBar from '@/components/ProtogenesisNavbar.vue'
import Taro, { useRouter } from '@tarojs/taro'
import { reactive, ref, onMounted, watch } from 'vue'
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo

const router = useRouter()

const vdata = reactive({
  initFlag: false,
  scrollTop: 0,
  questionNoShow: '',
  popupHeight: 0,
  isResult: true,
  tempFilePath: '',
  type: '',
  searchResultResponseList: [],
})
const popupShow = ref()
watch(
  () => vdata.questionNoShow,
  (val) => {
    if (val == 1 || !val) {
      vdata.scrollTop = 0
    } else if (val == 2) {
      vdata.scrollTop = 180
    } else if (val == 3) {
      vdata.scrollTop = 280
    } else {
      vdata.scrollTop = 380
    }
  }
)
// 关闭页面
const closePhoto = () => {
  if (vdata.type) {
    Taro.redirectTo({
      url: '/photoCorrect/photographPage/index',
    })
  } else {
    Taro.redirectTo({
      url: '../photographPage/index',
    })
  }
}
//  获取弹框高度
const getPopupHeight = (val) => {
  vdata.popupHeight = val
}
//  切换题号
const questionNoChange = (val) => {
  popupShow.value.popupShow()
  setTimeout(() => {
    if (!vdata.initFlag) {
      vdata.popupHeight = 552
    }
    vdata.questionNoShow = val
    vdata.initFlag = true
    popupShow.value.changeNo(val - 1)
  }, 500)
}
const questionNoChangeEmit = (val) => {
  vdata.questionNoShow = val
}
onMounted(() => {
  vdata.tempFilePath = router.params.tempFilePath
  vdata.type = router.params.type || ''
})
</script>
<style lang="scss">
.examplesResult {
  width: 100%;
  height: 100vh;
  // background: rgba(0, 0, 0, 0.16);
  // position: relative;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .content {
    overflow: hidden;
    height: 100%;
    .imgHeightBox {
      overflow: auto;
      // position: relative;
      width: 100%;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      .questionNo {
        left: 5%;
        width: 90%;
        border: 1px solid #fff;
        border-radius: 5px;
        position: absolute;
        view {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/39676e063e234befafa93b69710a4d71/questionNo.png')
            no-repeat top;
          background-size: 100% 100%;
        }
      }
      .questionNo_first {
        height: 155px;
        top: 62px;
      }
      .questionNo_second {
        height: 100px;
        top: 225px;
      }
      .questionNo_third {
        height: 70px;
        top: 335px;
      }
      .questionNo_fourth {
        height: 70px;
        top: 410px;
      }
      .arrowBox {
        width: 120px;
        height: 40px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 180px;
        z-index: 99;
        animation-name: beat;
        /*动画名称*/
        animation-duration: 0.4s;
        /*设置秒数*/
        animation-timing-function: linear;
        /*速度曲线*/
        animation-iteration-count: infinite;
        /*播放次数*/
        animation-direction: alternate;
        /*逆向播放*/
        animation-play-state: running;
        /*正在运行*/
      }
      .arrow {
        background: #ffb25f;
        border-radius: 6px;
        width: 120px;
        height: 36px;
        color: #fff;

        text-align: center;
        line-height: 36px;
        font-size: 14px;
      }
      .arrowhead {
        width: 12px;
        height: 12px;
        background: #ffb25f;
        margin: 0 auto;
        transform: rotate(45deg);
        margin-top: -6px;
      }
      @keyframes beat {
        0% {
          top: 180px;
        }

        100% {
          top: 190px;
        }
      }
    }
    .maskBg {
      width: 100%;
    }
  }
  .bottomBtn {
    height: 150px;
    background: #fff;
    border-radius: 10px;
    position: fixed;
    bottom: 0;
    padding: 25px 15px 0;
    .title {
      font-size: 16px;
      line-height: 22px;
      color: #333333;
      margin-bottom: 6px;
    }
    .detail {
      font-size: 14px;
      color: #666666;
      margin-bottom: 6px;
    }
    .againBtn {
      text-align: center;
      margin: 0 auto;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      width: 345px;
      height: 44px;
      border-radius: 22px;
      background: #0256ff;
      line-height: 44px;
    }
  }
}
.scroll-view_H {
  white-space: nowrap;
  width: 100%;
  height: 100%;
}
</style>
