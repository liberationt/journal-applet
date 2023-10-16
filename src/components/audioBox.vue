<template>
  <!-- <view class="bf" @tap="play">播放</view>
  <view class="bf" @tap="stop">暂停</view>
  <view class="bf" @tap="close">关闭</view>
  <view class="bf" @tap="getTime">获取时长</view>
  <view class="bf" @tap="setTime">设置时长</view>
  <view class="bf" @tap="setplaybackRate">设置倍数</view>
  <view @tap="test"> 测试 </view> -->
  <view class="sliderTime">
    <view>{{ getTimeStyle(vdata.current) }}</view>
    <slider
      class="slider"
      step="1"
      backgroundColor="#E7EEF3"
      activeColor="#96BBFF"
      blockSize="12"
      blockColor="#4A89FF"
      :max="vdata.timer"
      @change="changeVal"
      @changing="changeIng"
      :value="vdata.current"
    />
    <view>{{ getTimeStyle(vdata.timer) }}</view>
    <view @tap="doubleSpeed" class="doubleSpeed">倍速</view>
  </view>
  <view class="gc">
    <scroll-view
      :scroll-y="true"
      style="height: 300px"
      scroll-with-animation
      :scrollTop="getSignTop()"
      @scroll="scroll"
      @touchstart="touchstart"
      @touchend="touchend"
    >
      <view
        class="signList"
        v-for="(item, i) in vdata.signList"
        :key="i"
        :class="['item-sign', i === vdata.locationIndex + 1 && 'active-sign']"
        >{{ item.text }}</view
      >
    </scroll-view>
  </view>
  <doubleSpeedPopup
    :num="vdata.numDouble"
    @doubleChange="doubleChange"
    ref="popupShow"
  ></doubleSpeedPopup>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import doubleSpeedPopup from './doubleSpeedPopup.vue'
// import { Audio } from '@nutui/nutui-taro'
import moment from 'moment'
import { onMounted, ref, reactive, onBeforeUnmount, onUnmounted } from 'vue'
const props = defineProps({
  textShow: false,
})
const myVadio: any = ref('')
const popupShow = ref('')
const vdata: any = reactive({
  timerId: null,
  numDouble: 1,
  audioCtx: '',
  timer: '',
  current: '',
  locationIndex: '',
  src: 'https://bfqk.oss-cn-shanghai.aliyuncs.com/%E7%AC%AC1%E6%9C%9F_23.mp3',
  signList: [],
})
const test = () => {}
const changeVal = (e) => {
  // vdata.current = e.detail.value
  audioCtx.onTimeUpdate(() => {
    //console.info(audio.currentTime,audio.duration);
    vdata.current = Math.round(audioCtx.currentTime)
  })
  audioCtx.seek(e.detail.value)
  audioCtx.play()
  // audioCtx.play()
}
const changeIng = (e) => {
  audioCtx.offTimeUpdate()
  vdata.current = e.detail.value
}
let audioCtx = Taro.createInnerAudioContext()
audioCtx.src = vdata.src
audioCtx.onCanplay(() => {
  let intervalTime = setInterval(() => {
    if (audioCtx.duration !== 0) {
      vdata.timer = Math.round(audioCtx.duration)
      clearInterval(intervalTime)
    }
  }, 0)
})
//监听播放过程，进度处理
audioCtx.onTimeUpdate(() => {
  vdata.current = Math.round(audioCtx.currentTime)
  if (vdata.current == vdata.timer) {
    vdata.timer = Math.round(audioCtx.duration)
    clearInterval(vdata.timerId)
  }
})
//开始
const play = (url) => {
  // audioCtx.stop()
  // audioCtx.destroy()
  // audioCtx = Taro.createInnerAudioContext()

  // audioCtx.src = url
  // console.log(vdata.timer, 'vdata.timer')
  // audioCtx.seek(vdata.timer)
  audioCtx.play()
  // audioCtx.play()
  handelTimer()
}
//暂停
const stop = () => {
  audioCtx.stop()
  clearInterval(vdata.timerId)
}
//关闭
const close = () => {
  audioCtx.stop()
}
//获取时长
const getTime = () => {}
//设置时长
const setTime = () => {
  audioCtx.seek(8)
}
// 设置倍数
const setplaybackRate = () => {
  audioCtx.playbackRate = 0.5
}
//  倍数
const doubleSpeed = () => {
  popupShow.value.popupShow(vdata.numDouble)
}
//  切换倍数
const doubleChange = (val) => {
  console.log(val, '============403')
  vdata.numDouble = val
  audioCtx.playbackRate = val
  popupShow.value.closePopup()
}
//设置时间格式
const getTimeStyle = (timer) => {
  return moment(Number(timer) * 1000).format('mm:ss')
}
const handelTimer = () => {
  vdata.timerId = setInterval(() => {
    vdata.signList.forEach((item, i) => {
      // item.begin_time = Math.floor(item.begin_time / 1000)
      // item.end_time = Math.ceil(item.end_time / 1000)
      console.log(item, '=========')
      if (
        vdata.current > Math.floor(item.begin_time / 1000) &&
        vdata.current < Math.ceil(item.end_time / 1000)
      ) {
        vdata.locationIndex = i - 1
        console.log(vdata.locationIndex, '===========')
      }
    })
  }, 500)
}
const getSignTop = () => {
  return vdata.locationIndex * 30
}
const scroll = (e) => {
  console.log(e, 888)
}
const touchstart = () => {}
const touchend = () => {}
onMounted(() => {})
onBeforeUnmount(() => {
  clearInterval(vdata.timerId)
  console.log('onBeforeUnmount=======441')
})
onUnmounted(() => {
  clearInterval(vdata.timerId)
})
defineExpose({
  play,
  stop,
})
</script>
<style lang="scss">
.bf {
  margin: 20px 0;
}
.sliderTime {
  display: flex;
  align-items: center;
  padding: 5px 0;
  view {
    font-size: 12px;
    color: #666666;
    vertical-align: middle;
  }
  slider {
    flex: 1;
  }
}
.doubleSpeed {
  padding: 1px 6px;
  line-height: 36px;

  background: #ffffff;

  box-sizing: border-box;
  /* 描边色/描边浅色 */
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  vertical-align: middle;
  margin-left: 5px;
  margin-top: -1px;
}
.gc {
  .signList {
    font-size: 12px;
  }
}
.item-sign {
  text-align: center;
  // margin: 20rpx 0rpx;
  color: #ccc;
  height: 30px;
  line-height: 30px;
}
.active-sign {
  color: blue;
}
</style>
