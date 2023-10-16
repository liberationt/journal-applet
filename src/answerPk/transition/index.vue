<template>
  <view>
    <view
      class="transitionMain"
      :style="{ paddingTop: `${navBarHeight + 130}px` }"
      v-if="vdata.isTransition"
    >
      <NavBar title="答题PK" :fixedStyle="vdata.fixedStyle" :onClickBack="returnOrClose" />
      <view class="content">
        <view class="timer">{{ vdata.timer }}</view>
        <view class="begin" v-if="vdata.timer <= 1">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/d35214c11170498e8af6b5cc81b5f606/begin.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <nut-overlay v-model:visible="vdata.showToast" :close-on-click-overlay="false">
        <view class="toastInfo">
          <view class="contentText">
            <view>
              <view>现在退出对战，将视为PK失败</view>
              <view>确定退出吗？</view>
            </view>
          </view>
          <view class="contentBtn">
            <view class="cancel" @tap="cancel">取消</view>
            <view class="confirm" @tap="confirm"> 继续等待 </view>
          </view>
        </view>
      </nut-overlay>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, usePerson } from '@/stores'
const system = useSystem()
const personInfo = usePerson()

const { navBarHeight } = system.navBarInfo
import { reactive, onMounted } from 'vue'

const vdata = reactive({
  timer: 3,
  isShow: false,
  showToast: false,
  directory: false,
  fixedStyle: {
    color: '#fff',
  },
  isTransition: true,
})
const cancel = () => {
  vdata.showToast = false
}
const confirm = () => {
  vdata.showToast = false
}
const returnOrClose = () => {
  vdata.showToast = true
}
onMounted(() => {
  setTimeout(() => {
    let timer = setInterval(() => {
      vdata.timer--
      if (vdata.timer == 1) {
        setTimeout(() => {
          Taro.redirectTo({
            url: '../answer/index',
          })
        }, 1000)
        clearInterval(timer)
        timer = null
      }
    }, 1000)
  }, 200)
  // vdata.isShow = true
})
</script>
<style lang="scss">
.transitionMain {
  height: 100vh;
  position: relative;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/ba49adb8fce84f6eb1750072e3537366/bg.png')
    no-repeat center;
  background-size: 100% 100%;
  box-sizing: border-box;
  .content {
    .timer {
      font-size: 48px;
      color: #ff8759;
      // linear-gradient(180deg, #ffdb00 0%, #ff8759 100%);
      font-size: 48px;
      font-weight: bold;
      text-align: center;
    }
    .begin {
      margin-top: 25px;
      text-align: center;
      image {
        width: 133px;
        height: 32px;
      }
    }
  }
  .toastInfo {
    top: 40%;
    background: #fff;
    width: 280px;
    height: 163px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 18px;
    padding: 25px;
    text-align: center;
    .contentText {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
      color: #333333;
      margin-bottom: 14px;
    }
    .contentBtn {
      display: flex;
      justify-content: space-between;
      view {
        width: 112px;
        height: 40px;
        box-sizing: border-box;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: #2f5de7;
        line-height: 40px;
        border-radius: 23px;
      }
      .cancel {
        border: 1px solid #2f5de7;
      }
      .confirm {
        background: #2f5de7;
        color: #fff;
      }
    }
  }
}
</style>
