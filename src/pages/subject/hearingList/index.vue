<template>
  <view class="hearing">
    <view v-if="vdata.dataList.length">
      <view class="hearingList" v-for="(item, index) in vdata.dataList" :key="index">
        <!-- <view @tap="toDetail(item, index)" class="box"> -->
        <view class="box">
          <view
            class="listPage"
            :class="{ disabled: !item.resourceUrl || item.deleteFlag == '1' }"
            >{{ getPeriodsNum(item.resourceIssue) }}</view
          >
          <image
            v-if="item.play"
            @tap="stop(item, index)"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/4aee37f2a6be479fad4bd44b2b5f584c/stop.png"
          ></image>
          <image
            @tap="disabledToast(item, index)"
            v-else-if="!item.resourceUrl || item.deleteFlag == '1'"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/31f55d440c8b47fe98fc78237f7b976f/playDisabled.png"
          ></image>
          <image
            @tap="play(item, index)"
            v-else-if="!!item.resourceUrl"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/b6656a6a0ff045e5bf96ab70e89218d3/bf.png"
          ></image>
        </view>
        <!-- <view class="audio" v-if="item.play">
        <audioBox ref="audioRef"></audioBox>
      </view> -->
        <view class="sliderTime" v-if="vdata.type === index">
          <view class="sliderTime_time">{{ getTimeStyle(vdata.current) }}</view>
          <slider
            class="slider"
            step="1"
            backgroundColor="#E7EEF3"
            activeColor="#96BBFF"
            :blockSize="vdata.blockSize"
            blockColor="#4A89FF"
            :max="vdata.timer"
            @change="changeVal"
            @changing="changeIng"
            :value="vdata.current"
          />
          <view class="sliderTime_time">{{ getTimeStyle(vdata.timer) }}</view>
          <view @tap="doubleSpeed" class="doubleSpeed">倍速</view>
        </view>
        <!-- <view @tap="lookText" v-if="vdata.type === index" class="lookText">查看听力原文 ></view> -->
        <view v-if="vdata.type === index" class="lookText">
          <view @tap="toAnswer(item)">听力答题 ></view>
          <view @tap="lookText">查看听力原文 ></view>
        </view>
        <!-- <view class="audio">
        <audioBox ref="audioRef" v-if="vdata.type === index" :index="vdata.type"></audioBox>
      </view> -->
      </view>
    </view>

    <view v-else class="noData">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/263553eae12b4f9ea0b70ee43d48c28d/resourceUpload.png"
      ></image>
      <view class="detail">正在加紧上传中...</view>
    </view>
    <view class="audioText" v-if="vdata.showTextPopup">
      <view class="showTextPopup">
        <view class="top">
          <view class="title">{{ getPeriodsNum(vdata.item.resourceIssue) }}</view>
          <view class="img">
            <image
              v-if="vdata.playShow"
              @tap="stop(vdata.item, vdata.type)"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/4aee37f2a6be479fad4bd44b2b5f584c/stop.png"
            ></image>
            <image
              v-else
              @tap="play(vdata.item, vdata.type)"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/b6656a6a0ff045e5bf96ab70e89218d3/bf.png"
            ></image>
          </view>
        </view>
        <view>
          <!-- <audioBox :textShow="true" ref="audioRef"></audioBox> -->
          <view class="sliderTime">
            <view class="sliderTime_time">{{ getTimeStyle(vdata.current) }}</view>
            <slider
              class="slider"
              step="1"
              backgroundColor="#E7EEF3"
              activeColor="#96BBFF"
              :blockSize="vdata.blockSize"
              blockColor="#4A89FF"
              :max="vdata.timer"
              :value="vdata.current"
              @change="changeVal"
              @changing="changeIng"
            />
            <view class="sliderTime_time">{{ getTimeStyle(vdata.timer) }}</view>
            <view @tap="doubleSpeed" class="doubleSpeed">倍速</view>
          </view>
          <view class="gc">
            <scroll-view
              white-space:
              nowrap
              :scroll-y="true"
              style="height: 362px"
              scroll-with-animation
              :trapScroll="true"
              :disableLowerScroll="true"
              :disableUpperScroll="true"
              :scroll-top="getSignTop()"
              @scroll="scroll"
            >
              <view class="scrollView">
                <view
                  class="signList"
                  v-for="(item, i) in vdata.signList"
                  :key="i"
                  :class="[
                    'item-sign',
                    i === vdata.locationIndex + 1 && 'active-sign',
                    i === vdata.locationIndex && 'gradual-change',
                  ]"
                  >{{ item.text }}</view
                >
              </view>
            </scroll-view>
            <view class="gradual-change"></view>
            <view class="gradual-change-bottom"></view>
          </view>
        </view>
        <view @tap="closeIconAudio" class="closeIconAudio"></view>
      </view>
    </view>
    <doubleSpeedPopup
      :num="vdata.numDouble"
      @doubleChange="doubleChange"
      ref="doublePopupShow"
    ></doubleSpeedPopup>
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import moment from 'moment'
import {
  onMounted,
  reactive,
  ref,
  nextTick,
  onBeforeUnmount,
  onUnmounted,
  watch,
  defineEmits,
} from 'vue'
import { getNorthJournalResourceCheckList } from '@/api/index'
import doubleSpeedPopup from '@/components/doubleSpeedPopup.vue'
import { getPeriodsNum } from '@/utils/index'
import { phoneType } from '@/utils/index'
import { usePerson } from '@/stores'

import audioBox from '@/components/audioBox.vue'
const audioRef = ref('')
const personInfo = usePerson()
const props = defineProps({
  propsDataObj: {},
  selectId: '',
})
const vdata = reactive({
  openShowNum: '',
  blockSize: 8,
  initNum: 32.3,
  item: {},
  playShow: false,
  timerId: '',
  numDouble: 1,
  showTextPopup: false,
  journalResourceId: '',
  resourceType: '1',
  selectId: '',
  muted: false,
  type: '',
  autoplay: true,
  dataList: [],
  audioCtx: '',
  timer: '',
  current: '',
  locationIndex: '',
  src: 'https://bfqk.oss-cn-shanghai.aliyuncs.com/%E7%AC%AC1%E6%9C%9F_23.mp3',
  signList: [],
})
// const emit = defineEmits(['styleFlagChange'])
watch(
  () => vdata.type,
  (newValue) => {
    if (audioCtx) {
      console.log(watch, 'watch==========189')
      audioCtx.destroy()
      audioCtx = null
      vdata.timer = 0
      vdata.current = 0
    }
  }
)
const doublePopupShow = ref('')
const disabledToast = (item, index) => {
  if (!item.resourceUrl || item.deleteFlag == '1')
    return Taro.showToast({
      title: '资源紧急上传中...',
      icon: 'none',
      duration: 2000,
    })
}
const play = (item, index) => {
  vdata.playShow = !vdata.playShow
  vdata.item = item
  vdata.type = index
  // vdata.dataList[index].play = !vdata.dataList[index].play
  vdata.dataList.forEach((item, i) => {
    if (index === i) {
      item.play = !item.play
    } else {
      item.play = false
    }
  })
  nextTick(() => {
    if (!audioCtx) {
      vdata.numDouble = 1
      audioCtx = Taro.createInnerAudioContext()
      audioCtx.src = item.resourceUrl
      audioCtx.onCanplay(() => {
        let intervalTime = setInterval(() => {
          if (audioCtx.duration !== 0) {
            vdata.timer = Math.round(audioCtx.duration)
            console.log(vdata.timer, 'timer')
            clearInterval(intervalTime)
          }
        }, 0)
      })
    }
    audioCtx.onTimeUpdate(() => {
      if (!audioCtx) return
      vdata.current = Math.round(audioCtx.currentTime || 0)
      if (vdata.current == vdata.timer) {
        vdata.timer = Math.round(audioCtx.duration)
        // clearInterval(vdata.timerId)
      }
    })
    audioCtx.play()
    handelTimer()
    audioCtx.onEnded(() => {
      console.log('完成播放')
      vdata.dataList.forEach((item, i) => {
        item.play = false
      })
      vdata.playShow = false
      vdata.current = vdata.timer
      audioCtx.play()
      audioCtx.pause()
    })
  })
}
const stop = (item, index) => {
  vdata.playShow = !vdata.playShow
  vdata.item = item
  vdata.type = index
  vdata.dataList[index].play = !vdata.dataList[index].play
  audioCtx.pause()
  clearInterval(vdata.timerId)
}
//  查看听力
const lookText = () => {
  vdata.signList = []
  // vdata.locationIndex = ''
  vdata.playShow = vdata.dataList.some((item) => {
    return item.play
  })
  let resourceCaptions = vdata.item.resourceCaptions || []
  vdata.signList = resourceCaptions.filter((item) => item.channel_id === 0)
  // vdata.signList = vdata.item.resourceCaptions || []

  vdata.showTextPopup = true
  // emit('styleFlagChange', true)
}
//答题
const toAnswer = (item) => {
  if (audioCtx) {
    audioCtx.stop()
    audioCtx.destroy()
    audioCtx = null
  }
  if (vdata.timerId) {
    clearInterval(vdata.timerId)
  }
  item.play = false
  personInfo.setSourceUrl(item.resourceUrl)
  Taro.navigateTo({
    url: `/myPages/hearAnswer/index?journalSourceId=${props.propsDataObj.id}&issue=${item.resourceIssue}`,
  })
}
const closeIconAudio = () => {
  vdata.showTextPopup = false
}
//  倍数
const doubleSpeed = () => {
  if (!vdata.playShow)
    return Taro.showToast({
      title: '音频在暂停的状态下，不支持设置倍速',
      icon: 'none',
      duration: 2000,
    })
  doublePopupShow.value.popupShow(vdata.numDouble)
}
//  切换倍数
const doubleChange = (val) => {
  console.log(audioCtx.playbackRate, 'audioCtx.playbackRate')
  let flag = vdata.dataList.some((item) => {
    return item.play
  })

  vdata.numDouble = val
  audioCtx.playbackRate = val
  if (!phoneType()) {
    //  苹果手机设置倍速先暂停再播放
    audioCtx.pause() //暂停
  }
  if (flag) {
    audioCtx.play() //接着播放
  }

  doublePopupShow.value.closePopup()
}
const getList = async () => {
  let req = {
    journalResourceId: vdata.journalResourceId,
    resourceType: vdata.resourceType,
  }
  console.log(vdata.journalResourceId, 'vdata.journalResourceId======83')
  const res = await getNorthJournalResourceCheckList(req)
  vdata.dataList = res || []
}
// const changeVal = (e) => {
//   vdata.blockSize = 12
//   // audioCtx.pause()

//   // vdata.current = e.detail.value
//   setTimeout(() => {
//     // play(vdata.item, vdata.type)
//     // vdata.item = item
//     // vdata.type = index
//     // vdata.dataList[index].play = !vdata.dataList[index].play
//     // vdata.playShow = true
//     // vdata.dataList.forEach((item, i) => {
//     //   if (vdata.type === i) {
//     //     item.play = true
//     //   } else {
//     //     item.play = false
//     //   }
//     // })
//     nextTick(() => {
//       audioCtx.onTimeUpdate(() => {
//         if (!audioCtx) return
//         vdata.current = Math.round(audioCtx.currentTime || 0)
//         console.log(vdata.current, '================vdata.current   335')
//         if (vdata.current == vdata.timer) {
//           // console.log(12345678909876543234567890)
//           vdata.timer = Math.round(audioCtx.duration)
//           clearInterval(vdata.timerId)
//         }
//       })
//       // audioCtx.play()
//       // handelTimer()
//       console.log(222, 'handelTimer=================')
//     })

//     audioCtx.seek(e.detail.value)
//     // audioCtx.play()
//   }, 500)
//   // audioCtx.play()
// }
let num = 0

const changeVal = (e) => {
  vdata.playShow = vdata.dataList.some((item) => {
    return item.play
  })
  console.log(e, 'e=======滑动结束')
  console.log(vdata.playShow, 'vdata.playShow=========366')
  vdata.blockSize = 8
  audioCtx.pause()
  // vdata.current = e.detail.value
  let count = 0
  audioCtx.onTimeUpdate(() => {
    count = count + 1
    if (count < 2) return
    if (Math.round(audioCtx.currentTime) < num) return
    vdata.current = Math.round(audioCtx.currentTime)
  })
  audioCtx.seek(e.detail.value)
  if (vdata.playShow) {
    audioCtx.play()
  }
}
Taro.onAudioInterruptionBegin(() => {
  if (audioCtx) {
    vdata.openShowNum = vdata.current
    audioCtx.pause()
    clearInterval(vdata.timerId)
    // vdata.playShow = false
    // // vdata.dataList[index].play = !vdata.dataList[index].play
    // vdata.dataList.forEach((item, i) => {
    //   item.play = false
    // })
    // audioCtx.pause()
    // clearInterval(vdata.timerId)
  }
})
//  监听音频中断结束事件。在收到 onAudioInterruptionBegin 事件之后，小程序内所有音频会暂停，收到此事件之后才可再次播放成功
Taro.onAudioInterruptionEnd(() => {
  // setTimeout(() => {
  if (audioCtx) {
    vdata.current = vdata.openShowNum
    // audioCtx.pause() //暂停
    audioCtx.onTimeUpdate(() => {
      vdata.current = Math.round(audioCtx.currentTime || 0)
      console.log(vdata.current, 'vdata.current==========audioCtx.onTimeUpdate')
      if (vdata.current == vdata.timer) {
        vdata.timer = Math.round(audioCtx.duration)
        // clearInterval(vdata.timerId)
      }
    })
    audioCtx.play()
    vdata.playShow = true
    // vdata.dataList[index].play = !vdata.dataList[index].play
    vdata.dataList.forEach((item, i) => {
      if (i === vdata.type) {
        item.play = true
      } else {
        item.play = false
      }
    })
    handelTimer()
    audioCtx.onEnded(() => {
      console.log('完成播放')
      vdata.dataList.forEach((item, i) => {
        item.play = false
      })
      vdata.playShow = false
      vdata.current = vdata.timer
      audioCtx.play()
      audioCtx.pause()
    })
  }
  // }, 500)
})
const changeIng = (e) => {
  if (num && e.detail.value < num) {
    num = e.detail.value + 1
  } else {
    num = e.detail.value
  }
  vdata.blockSize = 8
  audioCtx.offTimeUpdate()

  vdata.current = num
  console.log(vdata.current, '===============372')
}

let audioCtx: any = null
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
//设置时间格式
const getTimeStyle = (timer) => {
  return moment(Number(timer) * 1000).format('mm:ss')
}
const handelTimer = () => {
  vdata.timerId = setInterval(() => {
    vdata.signList.forEach((item, i) => {
      if (
        vdata.current > Math.floor(item.begin_time / 1000) &&
        vdata.current < Math.ceil(item.end_time / 1000)
      ) {
        vdata.locationIndex = i - 1
      }
    })
  }, 200)
}
const getSignTop = () => {
  return vdata.locationIndex * 30
}
const touchstart = () => {
  vdata.blockSize = 16
}
const touchend = () => {
  vdata.blockSize = 8
}
onBeforeUnmount(() => {
  console.log(5678)
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  if (vdata.timerId) {
    clearInterval(vdata.timerId)
  }
})
onUnmounted(() => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  if (vdata.timerId) {
    clearInterval(vdata.timerId)
  }
})

onMounted(() => {
  setTimeout(() => {
    // Taro.setStorageSync('isPdfBack', true)
    if (phoneType()) {
      vdata.initNum = 32.3
    } else {
      vdata.initNum = 31.4
    }
    vdata.journalResourceId = props.propsDataObj.id || ''
    if (props.selectId === '0') {
      vdata.resourceType = '1'
    } else {
      vdata.resourceType = '2'
    }
    if (!vdata.journalResourceId) return
    getList()
  }, 200)
})
</script>
<style lang="scss">
.hearing {
  position: static;
  z-index: 99999;
  .sliderTime {
    display: flex;
    align-items: center;
    padding: 5px 16px;
    view {
      font-size: 12px;
      color: #666666;
    }
    slider {
      flex: 1;
      margin: 10px 8px 10px 4px;
    }
    .doubleSpeed {
      padding: 1px 6px;

      background: #ffffff;

      box-sizing: border-box;
      /* 描边色/描边浅色 */
      border: 1px solid #d8d8d8;
      border-radius: 4px;
      vertical-align: middle;
      margin-left: 8px;
      margin-right: -1px;
    }
    .sliderTime_time {
      width: 40px;
    }
    // slider {
    //   width: 100px !important;
    // }
  }
  .lookText {
    // font-size: 12px;
    // text-align: center;
    // padding: 16px 0;
    // color: #4a89ff;
    // border-top: 0.5px solid #f0f0f0;
    // margin: 0 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 0;
    border-top: 0.5px solid #f0f0f0;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    view {
      margin: 0 20px;
    }
    color: #4a89ff;
  }
  .item-sign {
    text-align: center;
    // margin: 20rpx 0rpx;
    color: #666;
    height: 30px;
  }
  .active-sign {
    color: #4a89ff;
    // color: linear-gradient(yellow, red);
  }
  // .gradual-change {
  //   background-image: linear-gradient(180deg, #ffffff, #666);
  //   background-clip: text;
  //   color: transparent;
  // }
  // .gradual-change-bottom {
  //   background-image: linear-gradient(180deg, #666, #fff);
  //   background-clip: text;
  //   color: transparent;
  // }
  .gc {
    position: relative;

    .gradual-change {
      height: 30px;
      width: 98%;
      position: absolute;
      top: -5px;
      left: 0;
      background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/9a677c6429644685981c70036c02ad74/maskTop.png')
        no-repeat top;
      background-size: 100% 100%;
    }
    .gradual-change-bottom {
      height: 40px;
      width: 98%;
      position: absolute;
      bottom: -5px;
      left: 0;
      background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/2824ce1eaee54b548d3775dcb08cd5ff/maskBottom.png')
        no-repeat top;
      background-size: 100% 100%;
    }
    .scrollView {
      padding-top: 20px;
    }
    .signList {
      // height: 32px;
      // line-height: 32px;
      font-size: 12px;
    }
  }
  .hearingList {
    width: 100%;
    min-height: 56px;
    background: #fff;
    margin-bottom: 12px;
    border-radius: 8px;

    .box {
      width: 100%;
      padding: 0 16px;
      line-height: 56px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .listPage {
        display: inline-block;
        vertical-align: middle;
        align-items: center;
        font-size: 16px;
        color: #333333;
      }
      .nut-icon {
        vertical-align: middle;
      }
      .disabled {
        font-size: 16px;
        color: #999999;
      }
      image {
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
    }
    .audio {
      display: block;
      margin: 0 16px;
      border-top: 0.5px solid #f0f0f0;
    }
  }
  .noData {
    text-align: center;
    padding-top: 70px;
    image {
      margin-bottom: 24px;
      width: 160px;
      height: 130px;
    }
    .detail {
      font-size: 14px;
      text-align: center;
      color: #999999;
    }
  }
  .audioText {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    // transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.3);
    padding: 16px;
    .showTextPopup {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 17px;
      width: 340px;
      // height: 400px;
      border-radius: 8px;
      position: relative;
      background: #fff;

      .top {
        display: flex;
        justify-content: space-between;
        border-bottom: 0.5px solid #f0f0f0;
        padding-bottom: 17px;
        .title {
          font-size: 16px;
          /* 正文#333333 */
          color: #333333;
        }
        .img {
          width: 24px;
          height: 24px;
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
      .closeIconAudio {
        width: 40px;
        height: 40px;
        position: absolute;
        left: 50%;
        bottom: -60px;
        transform: translateX(-50%);
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/audio/2444b7cd728240168ef11a3de7720c93/closeIconAudio.png')
          no-repeat;
        background-size: 100% 100%;
      }
    }
    .flooter {
      height: 70px;
      view {
        height: 70px;
        background: rgba(0, 0, 0, 0.1);
        opacity: 0.1;
      }
    }
    .sliderTime {
      padding: 5px 0px;
    }
    .nut-overlay {
      background: rgba(0, 0, 0, 0.5) !important;
    }
  }
}
</style>
