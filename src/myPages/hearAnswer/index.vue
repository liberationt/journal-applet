<template>
  <view class="hearAnswer" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar :title="'听力答题'" />
    <view class="sliderTime">
      <image
        v-if="vdata.isPlay"
        @tap="stop"
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/4aee37f2a6be479fad4bd44b2b5f584c/stop.png"
      ></image>
      <image
        v-else
        @tap="play"
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/b6656a6a0ff045e5bf96ab70e89218d3/bf.png"
      ></image>
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
    <view :style="{ height: `calc(100vh - ${navBarHeight + 65}px)` }" class="answerMain">
      <template v-if="vdata.listenList && vdata.listenList.length">
        <view v-for="(item, i) in vdata.listenList" :key="i" class="list-item">
          <view class="topText">
            <view class="textNumber">第{{ i + 1 }}题</view>
            <view class="topQuestion">
              <view v-if="item.cropType" class="topQuestionIf">
                <view v-if="item.cropType == 1" class="imageList">
                  <image
                    :src="vtem"
                    mode="widthFix"
                    :key="key"
                    :style="{ width: vdata.imgSize[i + '_' + key] || 0 }"
                    @load="(e) => getImgSize(e, i + '_' + key)"
                    v-for="(vtem, key) in item.questionTopicCut"
                  />
                </view>
                <view v-else>
                  <rich-text :nodes="item.questionTopic"></rich-text>
                </view>
              </view>
              <view v-else class="img">
                <image
                  :style="{ width: vdata.imgSize[i + '_index'] || 0 }"
                  @load="(e) => getImgSize(e, i + '_index')"
                  :src="item.questionTopicImage"
                  mode="widthFix"
                />
              </view>
            </view>
          </view>
          <template v-if="item.questionAnswer">
            <view class="answer-item" v-for="(key, k) in item.questionAnswer" :key="k">
              <view
                :class="['item-info', key.isCheck && 'select-item']"
                @tap="chooseAnswer(key, item, k)"
              >
                <view class="english">{{ handleEng(key.ids) }}</view>
                <view class="answer-item-content">
                  <view v-if="key.cropType == 1">
                    <!-- <image src="" mode="scaleToFill" /> -->
                    <view v-if="key.cropUrl" class="imageList">
                      <image
                        :src="img"
                        :style="{ width: vdata.imgSize[i + '_' + k + '_' + imgKey] || 0 }"
                        @load="(e) => getImgSize(e, i + '_' + k + '_' + imgKey)"
                        v-for="(img, imgKey) in getAnswerImg(key.cropUrl)"
                        mode="widthFix"
                        :key="imgKey"
                      >
                        {{ vdata.imgSize[i + '_' + k + '_' + imgKey] }}
                      </image>
                    </view>
                  </view>
                  <view v-else><rich-text :nodes="key.stem"></rich-text></view>
                  <!-- <rich-text :nodes="key.stem"></rich-text> -->
                </view>
              </view>
            </view>
          </template>
          <!-- <template v-else>
            <view class="answer-img">
              <image
                :style="{ width: vdata.imgSize[i + '_index_' + i] || 0 }"
                @load="(e) => getImgSize(e, i + '_index_' + i, 300)"
                :src="item.questionAnswerImage"
                mode="widthFix"
              />
            </view>
          </template> -->
        </view>
        <view class="submit" @tap="toResult">提交练习</view>
      </template>
      <template v-else>
        <view class="noData">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
          />
          <text>暂无听力答题</text>
        </view>
      </template>
    </view>

    <doubleSpeedPopup
      :num="vdata.numDouble"
      @doubleChange="doubleChange"
      ref="doublePopupShow"
    ></doubleSpeedPopup>
  </view>
</template>
<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro'
import { reactive, onMounted, ref, nextTick, onBeforeUnmount } from 'vue'
import { getListening } from '@/api/index'
import { useSystem, usePerson } from '@/stores'
import NavBar from '@/components/NavBar.vue'
import moment from 'moment'
import doubleSpeedPopup from '@/components/doubleSpeedPopup.vue'
import { phoneType } from '@/utils/index'
const router = useRouter()
const system = useSystem()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
const doublePopupShow = ref()
const vdata: any = reactive({
  realNameSelf: '',
  blockSize: 8,
  timer: '',
  current: '',
  numDouble: 1,
  isPlay: false,
  issue: '',
  journalSourceId: '',
  resourceUrl: '',
  listenList: [],
  imgSize: {},
})
//获取答案
const getItemAnswer = (answer) => {
  if (!answer) return []
  let answerList = JSON.parse(answer)
  return answerList
}
const toResult = () => {
  personInfo.setHearResult(vdata.listenList)
  Taro.redirectTo({
    url: '../hearResult/index',
  })
}
const getAnswerImg = (url) => {
  return url.split(',')
}
const getImgSize = (e, index, type?: Number) => {
  let maxWidth = type || 250
  const { width } = e.detail
  if (width > maxWidth) {
    vdata.imgSize[index] = `${maxWidth}px`
  } else {
    vdata.imgSize[index] = `${width}px`
  }
}
//1234-ABCD
const handleEng = (val) => {
  return String.fromCharCode(64 + parseInt(val))
}
//默认单选处理
const chooseAnswer = (item, list, i) => {
  if (list.questionAnswer.length) {
    list.questionAnswer.forEach((element, key) => {
      if (key !== i) {
        element.isCheck = false
      }
    })
  }
  item.isCheck = !item.isCheck
}
//设置时间格式
const getTimeStyle = (timer) => {
  return moment(Number(timer) * 1000).format('mm:ss')
}
const play = () => {
  vdata.isPlay = true
  nextTick(() => {
    if (!audioCtx) {
      audioCtx = Taro.createInnerAudioContext()
      audioCtx.src = vdata.resourceUrl
      // 'https://scsf.oss-cn-shanghai.aliyuncs.com/dictation-exercise/5c9306dd-909c-4396-8255-15b6f3958082.mp3'
      audioCtx.onCanplay(() => {
        let intervalTime = setInterval(() => {
          if (audioCtx.duration !== 0) {
            vdata.timer = Math.round(audioCtx.duration)
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
      }
    })
    audioCtx.playbackRate = vdata.numDouble
    audioCtx.play()
    handelTimer()
    audioCtx.onEnded(() => {
      vdata.isPlay = false
      vdata.current = vdata.timer
      // audioCtx.play()
      audioCtx.stop()
    })
  })
}
const stop = () => {
  vdata.isPlay = false
  audioCtx.pause()
}
//  倍数
const doubleSpeed = () => {
  // if (!vdata.isPlay)
  //   return Taro.showToast({
  //     title: '音频在暂停的状态下，不支持设置倍速',
  //     icon: 'none',
  //     duration: 2000,
  //   })
  doublePopupShow.value.popupShow(vdata.numDouble)
}
//  切换倍数
const doubleChange = (val) => {
  vdata.numDouble = val
  if (!audioCtx) {
    doublePopupShow.value.closePopup()
    return
  }
  audioCtx.playbackRate = val
  if (!phoneType()) {
    //  苹果手机设置倍速先暂停再播放
    audioCtx.pause() //暂停
  }
  audioCtx.play()
  doublePopupShow.value.closePopup()
}
const handelTimer = () => {
  // vdata.timerId = setInterval(() => {
  //   vdata.signList.forEach((item, i) => {
  //     if (
  //       vdata.current > Math.floor(item.begin_time / 1000) &&
  //       vdata.current < Math.ceil(item.end_time / 1000)
  //     ) {
  //       vdata.locationIndex = i - 1
  //     }
  //   })
  // }, 200)
}
let audioCtx: any = null
const changeVal = (e) => {
  vdata.blockSize = 8
  if (!audioCtx) return
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
  if (vdata.isPlay) {
    audioCtx.play()
  }
}
let num = 0
const changeIng = (e) => {
  if (num && e.detail.value < num) {
    num = e.detail.value + 1
  } else {
    num = e.detail.value
  }
  vdata.blockSize = 16

  if (!audioCtx) return
  audioCtx.offTimeUpdate()
  vdata.current = num
}
const getAnswer = () => {
  let params = {
    issue: vdata.issue,
    journalSourceId: vdata.journalSourceId,
  }
  getListening(params).then((res: any) => {
    if (res && res.length) {
      res.forEach((item) => {
        if (item.questionAnswer) {
          item.questionAnswer = JSON.parse(item.questionAnswer)
        }
      })
      vdata.listenList = res
    } else {
      vdata.listenList = []
    }
    //
  })
}
onBeforeUnmount(() => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  if (vdata.timerId) {
    clearInterval(vdata.timerId)
  }
})
onMounted(() => {
  vdata.issue = router.params?.issue || ''
  vdata.journalSourceId = router.params?.journalSourceId || ''
  vdata.resourceUrl = personInfo.resourceUrl
  play()
  getAnswer()
})
</script>

<style lang="scss">
.hearAnswer {
  height: 100vh;
  box-sizing: border-box;
  .sliderTime {
    display: flex;
    align-items: center;
    padding: 5px 16px;
    height: 60px;
    box-sizing: border-box;
    background: #fff;
    view {
      font-size: 12px;
      color: #666666;
    }
    image {
      width: 20px;
      height: 20px;
      margin-right: 15px;
    }
    slider {
      flex: 1;
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
      margin-top: -1px;
    }
    .sliderTime_time {
      width: 40px;
    }
    slider {
      // width: 100px !important;
      flex: 1;
      margin: 10px 8px 10px 4px;
    }
  }
  .answerMain {
    background: #f6f9fd;
    overflow-y: scroll;
    padding: 12px 16px 34px;
    .list-item {
      padding: 20px 15px;
      background: #fff;
      margin-bottom: 12px;
      border-radius: 10px;
      .topText {
        display: flex;
        margin-bottom: 12px;
        .textNumber {
          width: 45px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          background: #f4f4f4;
          font-family: PingFangSC-Medium;
          font-size: 12px;
          /* 文本色/二级 */
          color: #666666;
          margin-right: 10px;
          flex-shrink: 0;
          border-radius: 4px;
        }
        .topQuestion {
          flex: 1;
          .topQuestionIf {
            width: 100%;
            .imageList {
              image {
                width: 100%;
              }
            }
          }
          .img {
            width: 100%;
            image {
              width: 100%;
            }
          }
        }
      }
      .answer-item {
        display: flex;
        margin-bottom: 12px;
        .item-info {
          background: #f6f6f6;
          padding: 15px 0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          width: 100%;
          .english {
            width: 45px;
            text-align: center;
            flex-shrink: 0;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #333333;
            border-right: 1px solid #e8e8e8;
            margin-right: 10px;
          }
          .answer-item-content {
            flex: 1;
            .imageList {
              image {
                width: 100%;
              }
            }
          }
        }
        .select-item {
          background: #e0eaff;
          .english {
            color: #2f5de7;
          }
          .answer-item-content {
            color: #2f5de7;
          }
        }
      }
      .answer-img {
        width: 100%;
        image {
          max-width: 100%;
          width: 100%;
        }
      }
    }
  }
  .submit {
    height: 40px;
    border-radius: 20px;
    background: #2f5de7;
    color: #fff;
    text-align: center;
    line-height: 40px;
    margin-top: 40px;
  }
  .noData {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    flex-direction: column;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    font-weight: normal;
    line-height: 18px;
    color: #333333;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 30px;
    }
  }
}
</style>
