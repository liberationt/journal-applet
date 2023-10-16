<template>
  <view class="dictationBegin" :style="{ paddingTop: `${navBarHeight + 60}px` }">
    <NavBar title="" />
    <view class="hartImg">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/b1895a2a4de6468fa7be307d674db4c2/bfj.png"
        alt=""
      />
    </view>
    <view class="unitNumber">
      <view class="current">{{ vdata.current }}</view>
      <view class="allNum">/{{ vdata.hearList.length }}</view>
    </view>
    <view class="hartText">自动播放，每个字词读{{ vdata.setting.number }}遍</view>
    <!-- https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/06c4c5f1861f4961bb5ded20c287ad82/disLeftBtn.png
    https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/6e6f96a38f3049b99fa6d12f30b875a3/disRightBtn.png -->
    <view class="operaImg">
      <image
        @tap="vdata.current > 1 && aduioChange(1)"
        class="leftImg"
        :src="
          vdata.current > 1
            ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/fba5d9ba8d9b4fa68eb45b66f97fd1bb/leftBtn.png'
            : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/06c4c5f1861f4961bb5ded20c287ad82/disLeftBtn.png'
        "
        alt=""
      />
      <view class="centerOpera">
        <nut-circleprogress
          class="circleprogress"
          :progress="progress"
          color="#2F5DE7"
          strokeWidth="7"
        >
        </nut-circleprogress>
        <view class="operaBtn" @click="beginPlay">
          <image
            class="beginImg"
            v-if="vdata.play"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/2c0c73d4876e4d8faeb733af3537929c/begin.png"
            alt=""
          />
          <image
            v-else
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/4dffc49caf8f402a91bfa503b303b9f2/stop.png"
            alt=""
          />
        </view>
      </view>
      <image
        @tap="vdata.current < vdata.hearList.length && aduioChange(2)"
        class="rightImg"
        :src="
          vdata.current == vdata.hearList.length
            ? ' https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/6e6f96a38f3049b99fa6d12f30b875a3/disRightBtn.png'
            : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/45b413dfbeab4e4d95d13abd373dabcd/rightBtn.png'
        "
        alt=""
      />
    </view>
    <nut-overlay v-model:visible="vdata.visible" :close-on-click-overlay="false">
      <view class="timeShowInfo">
        <view class="baby">
          <img
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/c7aadca003b741fb94c2e2a785026ad7/body.png"
            alt=""
          />
          <view class="timerResult">{{ vdata.timer }}s</view>
        </view>
        <view class="timerShowText">
          <view>请拿出纸和笔</view>
          <view> 准备好之后我们开始听写啦</view>
        </view>
        <view class="begin" @click="beginDic"> 开始听写 </view>
      </view>
    </nut-overlay>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, usePerson } from '@/stores'
import bookVersion from '@/components/bookVersion.vue'
import { getDicExeInfo } from '@/api/dictationExercise'
const system = useSystem()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
import { reactive, onMounted, nextTick, onBeforeUnmount, computed } from 'vue'
const vdata: any = reactive({
  current: 1,
  visible: true,
  timer: 5,
  beginTimer: null,
  play: false,
  hearList: [],
  setTimer: null,
  index: 1,
  setting: {
    number: 2,
    interval: 3000,
    well: 1,
  },
})
const progress = computed(() => {
  let progress
  if (vdata.hearList && vdata.hearList.length) {
    progress = Math.round((vdata.current / vdata.hearList.length) * 100)
  }
  return progress
})
// 播放
let audioCtx: any = null
//开始播放
const beginPlay = () => {
  if (vdata.play) {
    vdata.play = false
    audioCtx.stop()
    audioCtx.destroy()
    audioCtx = null
    if (vdata.setTimer) {
      clearTimeout(vdata.setTimer)
      vdata.setTimer = null
    }
  } else {
    vdata.play = true
    autoPlay()
  }
}
const autoPlay = () => {
  let item = vdata.hearList[vdata.current - 1]
  nextTick(() => {
    if (!audioCtx) {
      audioCtx = Taro.createInnerAudioContext()
    }
    if (!item.contentUrl) {
      const params = {
        content: item.chineseContent,
        contentId: item.contentId,
      }
      getDicExeInfo('getContentVoice', params).then((res: any) => {
        if (res) {
          item.contentUrl = res.voiceUrl
          play(item.contentUrl)
        }
      })
    } else {
      play(item.contentUrl)
    }
  })
}
const play = (url) => {
  audioCtx.src = url
  audioCtx.play()
  audioCtx.onEnded(() => {
    if (vdata.setting.number == vdata.index) {
      vdata.index = 1
      if (vdata.current == vdata.hearList.length) {
        audioCtx.destroy()
        audioCtx = null
        if (vdata.setTimer) {
          clearTimeout(vdata.setTimer)
          vdata.setTimer = null
        }
        Taro.redirectTo({
          url: '../dicComplete/index',
        })
      } else {
        vdata.setTimer = setTimeout(() => {
          vdata.current += 1
          //清空操作 不然有问题
          if (audioCtx) {
            audioCtx.destroy()
            audioCtx = null
          }
          autoPlay()
        }, vdata.setting.interval)
      }
    } else {
      if (vdata.setTimer) {
        clearTimeout(vdata.setTimer)
        vdata.setTimer = null
      }
      vdata.setTimer = setTimeout(() => {
        vdata.index++
        //清空操作 不然有问题
        if (audioCtx) {
          audioCtx.destroy()
          audioCtx = null
        }
        autoPlay()
      }, vdata.setting.interval)
    }
  })
}
//开始学习
const beginDic = () => {
  clearInterval(vdata.beginTimer)
  vdata.beginTimer = null
  vdata.visible = false
  vdata.play = true
  autoPlay()
}
// 左右切换
const aduioChange = (type) => {
  if (type == 1) {
    vdata.current -= 1
  } else {
    vdata.current += 1
  }
  // vdata.play = false
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  if (vdata.setTimer) {
    clearTimeout(vdata.setTimer)
    vdata.setTimer = null
  }

  if (vdata.play) {
    beginDic()
  }
  // if (vdata.play && audioCtx) {
  //   audioCtx.destroy()
  //   audioCtx = null
  //   autoPlay()
  // }
}
useDidHide(() => {
  vdata.play = false
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  if (vdata.setTimer) {
    clearTimeout(vdata.setTimer)
    vdata.setTimer = null
  }
})
onBeforeUnmount(() => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  if (vdata.setTimer) {
    clearTimeout(vdata.setTimer)
    vdata.setTimer = null
  }
})
onMounted(() => {
  vdata.beginTimer = setInterval(() => {
    vdata.timer -= 1
    if (vdata.timer < 1) {
      beginDic()
    }
  }, 1000)
})
useDidShow(() => {
  vdata.hearList = personInfo.dicExerciseList
  vdata.setting = personInfo.setting
})
</script>
<style lang="scss">
.dictationBegin {
  // background: #d2deff;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/2cb24008b5ac4bbdb91a0795cbed1ba4/txxlbg.png')
    no-repeat top;
  background-size: 100% 100%;
  height: 100vh;

  .hartImg {
    text-align: center;
    image {
      width: 317px;
      height: 260px;
    }
  }
  .unitNumber {
    display: flex;
    justify-content: center;
    font-family: PingFangSC-Semibold;
    color: #2f5de7;
    font-size: 14px;
    height: 59px;
    // margin-top: 0px;
    .current {
      font-size: 18px;
      font-weight: normal;
      text-align: center;
      letter-spacing: 0px;
      font-size: 30px;
    }
    .allNum {
      line-height: 50px;
    }
  }
  .hartText {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
    text-align: center;
  }
  .operaImg {
    position: absolute;
    bottom: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    right: 0;
    .leftImg,
    .rightImg {
      width: 22px;
      height: 23px;
    }
    .centerImg {
      width: 96px;
      height: 96px;
      margin: 0 42px;
    }
    .centerOpera {
      width: 100px;
      height: 100px;
      position: relative;
      overflow: hidden;
      // border-radius: 50%;
      // box-sizing: border-box;
      // background: #3f87a6;
      // position: relative;
      // overflow: hidden;
      margin: 0 37px;
      .circleprogress {
        width: 96px;
        height: 96px;
        position: absolute;
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .operaBtn {
        width: 72px;
        height: 72px;
        background: #2f5de7;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        // left: 11px;
        // top: 11px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        image {
          width: 48px;
          height: 48px;
        }
        .beginImg {
          width: 26px;
          height: 28px;
        }
      }
      .nut-circleprogress-text {
        display: none;
      }
    }
  }
  .timeShowInfo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .baby {
      position: relative;
      text-align: center;
      img {
        width: 221px;
        height: 160px;
      }
      .timerResult {
        width: 45px;
        height: 24px;
        border-radius: 20px;
        box-sizing: border-box;
        border: 1px solid #d6d6d6;
        text-align: center;
        line-height: 24px;
        position: absolute;
        right: 0;
        top: 10px;
        font-size: 12px;
        color: #fff;
      }
    }
    .timerShowText {
      width: 251px;
      height: 144px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      position: relative;
      top: -44px;
      background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/af9a5864e6f2415aa6d6262e95e35569/showTimeTextBg.png')
        no-repeat center;
      background-size: 100% 100%;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      view {
        margin: 5px;
      }
    }
    .begin {
      // position: relative;
      width: 251px;
      height: 46px;
      border-radius: 30px;
      background: linear-gradient(279deg, #2b60ff -3%, #2696ff 99%);
      text-align: center;
      line-height: 46px;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #ffffff;
    }
  }
}
</style>
