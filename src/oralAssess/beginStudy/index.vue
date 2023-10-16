<template>
  <view class="beginStudy" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="口语测评" :onClickBack="returnOrClose" :fixedStyle="vdata.fixedStyle">
      <template #center>
        <view class="modeStyle">
          <view :class="vdata.modeType == 1 && 'modeChoose'" @tap="modeChange(1)">领读</view>
          <view :class="vdata.modeType == 2 && 'modeChoose'" @tap="modeChange(2)">速读</view>
        </view>
      </template>
    </NavBar>
    <view class="palyMain" :style="{ height: `calc(100vh - ${navBarHeight + 15}px)` }">
      <template v-if="vdata.modeType == 1">
        <view v-for="(item, i) in vdata.wordList" :key="i" class="play-item">
          <view class="currentPlay" v-if="vdata.current === i">
            <view class="current">{{ i + 1 }}/{{ vdata.wordList.length }}</view>
            <view class="wordInfo">
              <view class="englishWord" v-if="!item.wordDtoFollow">{{ item.englishText }}</view>
              <view class="englishWord" v-else>
                <!-- <rich-text :nodes="getNodes(item.wordDtoFollow, item.englishText)"></rich-text> -->
                <text
                  v-for="(tItem, j) in item.wordDtoFollow"
                  :key="j"
                  :class="['wordText', tItem.isRed && tItem.text && 'redWordText']"
                >
                  {{ tItem.text }}</text
                >
              </view>
              <view class="chainWord">{{ item.chineseText }}</view>
            </view>
            <view class="collect" @tap="collectChange(item)">
              <image
                v-if="item.favoriteId"
                class="chooseImg"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/365c7f6acaa64ad898abd3609004152d/choosecollect.png"
                mode="scaleToFill"
              />
              <image
                v-else
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/9753865b05894fd793efe84c02e70080/nocollect.png"
                mode="scaleToFill"
              />
            </view>
            <view class="operate">
              <view class="operate-item" v-if="!item.isSoundFollow">
                <view>
                  <image
                    v-if="!item.isPlayFollow"
                    @tap="play(1, item)"
                    src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/9d8c762b6937401f9bca7bc16afcc35d/stopInfo.png"
                  />
                  <image
                    v-else
                    @tap="play(2, item)"
                    src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/af7f8012481b4621a2e8d09343de67bd/play.png"
                  />
                </view>
                <view>
                  <image
                    @tap="record(1, item, i)"
                    src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/e36bcb236af049d6a6b38379bff93b4b/ly.png"
                  />
                </view>
                <view>
                  <image
                    v-if="!item.soundUrlFollow && item.scoreFollow === null"
                    src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/2376728ab68747b984956faf1955d8c9/bf.png"
                  />
                  <view
                    :class="[
                      'grandInfo',
                      item.scoreFollow > 80 && 'goodGrand',
                      item.scoreFollow < 60 && 'errorGrand',
                    ]"
                    v-else
                    @tap="myPlay(item)"
                  >
                    <text>{{ item.scoreFollow }}</text>
                    <image
                      v-if="!item.isReadFollow"
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/7d6cd32c31f84dec919dfd8da59d8ebe/bficon.png"
                    />
                    <image
                      v-else
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/northern/play_animate.gif"
                    />
                  </view>
                </view>
              </view>
              <view v-else @tap="record(2, item, i)" class="recordInfo">
                <text v-for="item in 10" :key="item" :class="'text' + item"></text>
                <view class="closeBtn">点击波纹,结束录音</view>
              </view>
            </view>
          </view>
          <view
            class="noPlay"
            @tap="noRead(item, i)"
            v-else-if="!item.soundUrlFollow && vdata.current < i"
          >
            <view class="noRead">未读</view>
            <view class="text">{{ item.englishText }}</view>
          </view>
          <view
            v-else-if="item.soundUrlFollow && vdata.current != i"
            class="noPlay"
            @tap="changeTab(item, i)"
          >
            <view class="noRead">{{ item.scoreFollow }}</view>
            <view class="text">{{ item.englishText }}</view>
          </view>
        </view>
      </template>
      <template v-else>
        <view v-for="(item, i) in vdata.wordList" :key="i" class="play-item">
          <view class="currentPlay" v-if="vdata.currentSpeed == i">
            <view class="current">{{ i + 1 }}/{{ vdata.wordList.length }}</view>
            <view class="wordInfo">
              <!-- <view class="englishWord">{{ item.englishText }}</view>
              <view class="chainWord">{{ item.chineseText }}</view> -->
              <view class="englishWord" v-if="!item.wordDtoSpeed">{{ item.englishText }}</view>
              <view class="englishWord" v-else>
                <!-- <rich-text :nodes="getNodes(item.wordDtoSpeed, item.englishText)"></rich-text> -->
                <text
                  v-for="(tItem, j) in item.wordDtoFollow"
                  :key="j"
                  :class="['wordText', tItem.isRed && tItem.text && 'redWordText']"
                >
                  {{ tItem.text }}</text
                >
              </view>
              <view class="chainWord">{{ item.chineseText }}</view>
            </view>
            <view class="operate">
              <view class="operate-item operate-items" v-if="!item.isSoundSpeed">
                <view v-if="item.scoreSpeed === null">
                  <image
                    v-if="!item.soundUrlSpeed"
                    src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/e36bcb236af049d6a6b38379bff93b4b/ly.png"
                  />
                  <image
                    v-else
                    src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/5e2e6caeccc74b7685c928655c18df84/cl.png"
                  />
                </view>
                <view v-else class="operate-items-answer">
                  <view>
                    <image
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/e36bcb236af049d6a6b38379bff93b4b/ly.png"
                    />
                  </view>
                  <view
                    :class="[
                      'grandInfo',
                      item.scoreSpeed > 80 && 'goodGrand',
                      item.scoreSpeed < 60 && 'errorGrand',
                    ]"
                  >
                    <text>{{ item.scoreSpeed }} </text>
                  </view>
                </view>
              </view>
              <view v-else @tap="recordSpeed(2, item)" class="recordInfo">
                <text v-for="item in 10" :key="item" :class="'text' + item"></text>
                <view class="closeBtn">点击波纹,结束录音</view>
              </view>
            </view>
          </view>
          <!-- <view class="noPlay" v-else-if="item.soundUrlFollow">
            <view class="noRead">未读</view>
            <view class="text">{{ item.englishText }}</view>
          </view> -->
          <!-- <view class="noPlay" v-else-if="vdata.currentSpeed">

          </view>
          <view class="noPlay" v-else @tap="chageSpeedTab(i)">
            <view class="text">{{ item.englishText }}</view>
          </view> -->
          <!-- @tap="noRead(item, i)" -->
          <view class="noPlay" v-else-if="!item.soundUrlSpeed && vdata.currentSpeed < i">
            <view class="noRead">未读</view>
            <view class="text">{{ item.englishText }}</view>
          </view>
          <view
            v-else-if="item.soundUrlSpeed && vdata.currentSpeed != i"
            class="noPlay"
            @tap="chageSpeedTab(i)"
          >
            <view class="noRead">{{ item.scoreSpeed }}</view>
            <view class="text">{{ item.englishText }}</view>
          </view>
        </view>
      </template>
      <view :class="['completeBtn', flag && 'completeBtns']" @tap="complete"> 完成测评 </view>
    </view>
    <nut-dialog
      teleport="#app"
      title="温馨提示"
      :content="vdata.modeType == 1 ? '确定切换到速读模式?' : '确定切换到领读模式?'"
      v-model:visible="vdata.visible"
      @ok="config"
      @cancel="cancel"
    >
    </nut-dialog>

    <nut-dialog
      teleport="#app"
      title="温馨提示"
      :content="'测评未完成，确认退出吗'"
      v-model:visible="vdata.visibleShow"
      @ok="configShow"
      @cancel="cancelShow"
    >
    </nut-dialog>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, usePerson } from '@/stores'
import { getToken } from '@/utils/token'
import { debounce } from '@/utils'
const system = useSystem()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
import { reactive, ref, nextTick, computed, onBeforeUnmount } from 'vue'
import { getOralInfo, northOralFavorite } from '@/api/oralAssess'

import { getBaseUrl } from '@/api/url'
const versionBook = ref()
const vdata = reactive({
  activeNames: [1],
  modeType: 1,
  fixedStyle: {
    color: '#333',
  },
  visibleShow: false,
  wordList: [],
  current: 0,
  visible: false,
  timer: null,
  currentSpeed: 0,
  nextTimer: null,
  isClose: false,
  isRecord: false,
})
const getList = async () => {
  let params = personInfo.searchOra
  let res: any = await getOralInfo('contentList', params)
  if (res) {
    vdata.wordList = res || []

    play(1, vdata.wordList[0])
    // let flag = res.findIndex((item) => {
    //   return !item.soundUrlFollow
    // })
    // if (flag > -1) {
    //   vdata.current = flag
    // } else {
    //   vdata.current = res.length - 1
    // }
  }
}
//速度模式开始  ===  领读和速度拆开处理
const beginSpeed = () => {
  if (!vdata.wordList.length) return
  resetSpeed()
  let speedItem: any = vdata.wordList[vdata.currentSpeed]
  if (!speedItem.playUrl) {
    let params = {
      content: speedItem.englishText,
      contentId: speedItem.contentId,
      contentType: personInfo.searchOra.type,
    }
    getOralInfo('getContentVoice', params).then((res: any) => {
      speedItem.playUrl = res.voiceUrl
      speedPlay(speedItem)
    })
  } else {
    speedPlay(speedItem)
  }
}
//重置
const resetSpeed = () => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  vdata.wordList.map((item) => {
    item.isReadSpeed = false
    item.isSoundSpeed = false
    item.isPlaySpeed = false
  })
}
// 播放原音
const speedPlay = (item) => {
  item.isPlaySpeed = true
  audioCtx = Taro.createInnerAudioContext()
  audioCtx.src = item.playUrl
  audioCtx.play()
  audioCtx.onEnded(() => {
    item.isPlaySpeed = false
    audioCtx.stop()
    setPlayInter(item)
  })
}
//开始录音
const setPlayInter = (item) => {
  setTimeout(() => {
    recordSpeed(1, item)
  }, 1000)
}
//录音按钮   不能重复创建多个  onStop只执行一个
const recordSpeed = debounce((type, item) => {
  if (type == 1) {
    item.isSoundSpeed = true
    let num = 0
    recorderManager.start({
      duration: 10000,
      format: 'mp3',
    })
    vdata.timer = setInterval(() => {
      num += 1
      if (num > 10) {
        item.isSoundSpeed = false
        recorderManager.stop()
        clearInterval(vdata.timer)
        vdata.timer = null
      }
    }, 1000)
  } else {
    item.isSoundSpeed = false
    if (vdata.timer) {
      clearInterval(vdata.timer)
      vdata.timer = null
    }
    recorderManager.stop()
  }
})
// recorderManagerSpeed.onStop((res) => {
//   if (res.tempFilePath) {
//     debugger
//     upLoadImg(res.tempFilePath, 2)
//   }
// })
//速度模式结束
const getNodes = (list, str) => {
  let string = ''
  list.forEach((element: any) => {
    if (element.isRed && element.text) {
      element.text = element.text.replace(
        element.text,
        `<span style='color:red'> ${element.text}</span>`
      )
      string += element.text
    } else {
      string = string + ' ' + element.text
    }
  })
  console.log(string, 'ssssssssssssss')
  return string
}
const flag = computed(() => {
  let index = false
  if (vdata.modeType == 1) {
    index = vdata.wordList.findIndex((item) => !item.soundUrlFollow)
    if (index > -1) {
      index = false
    } else {
      index = true
    }
  } else {
    index = vdata.wordList.findIndex((item) => !item.soundUrlSpeed)
    if (index > -1) {
      index = false
    } else {
      index = true
    }
  }
  return index
})
const returnOrClose = () => {
  if (vdata.modeType == 1) {
    let index = vdata.wordList.filter((item) => !item.soundUrlFollow)
    if (index.length) {
      vdata.isClose = true
      vdata.visibleShow = true
      audioReset()
    }
  } else {
    let index = vdata.wordList.filter((item) => !item.soundUrlSpeed)
    if (index.length) {
      vdata.isClose = true
      vdata.visibleShow = true
      audioReset()
    }
  }
}
// 收藏
const collectChange = debounce((item) => {
  // item.isCollect = !item.isCollect
  let params = {
    contentId: item.contentId,
    enable: item.favoriteId ? false : true,
    favoriteId: item.favoriteId,
    contentType: personInfo.searchOra.type,
    // bookId: 30,
  }
  northOralFavorite('addFavorite', params).then((res) => {
    if (item.favoriteId) {
      item.favoriteId = null
    } else {
      item.favoriteId = res
    }
  })
})
//音频相关
let audioCtx: any = null
//播放音频
const play = (type, item) => {
  if (type == 1) {
    audioPlay(1, item)
  } else {
    stopAudio(item)
  }
}
const stopAudio = (item: any) => {
  if (audioCtx) audioCtx.stop()

  item.isPlayFollow = false
  item.isReadFollow = false
}
const noRead = debounce((item, type) => {
  // if (vdata.wordList[type - 1].soundUrlFollow) {
  //   vdata.current = type
  // } else if (!item.soundUrlFollow) {
  //   return Taro.showToast({
  //     title: '请按照顺序进行学习',
  //     icon: 'none',
  //     duration: 2000,
  //   })
  // }
  let arrList = vdata.wordList.filter((item) => item.isSoundFollow)
  if (arrList.length) {
    Taro.showToast({
      title: '正在录音中，暂不能切换',
      icon: 'none',
      duration: 1000,
    })
    return
  }

  if (type != 0 && vdata.wordList[type - 1].scoreFollow === null) {
    Taro.showToast({
      title: '请按照顺序进行学习',
      icon: 'none',
      duration: 1000,
    })
    return
  }
  if (vdata.isRecord) {
    Taro.showToast({
      title: '测评中，暂不能切换',
      icon: 'none',
      duration: 1000,
    })
    return
  }

  if (vdata.wordList[type - 1].soundUrlFollow) {
    vdata.current = type
  } else if (!item.soundUrlFollow) {
    return Taro.showToast({
      title: '请按照顺序进行学习',
      icon: 'none',
      duration: 2000,
    })
  }
})
const audioReset = () => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  vdata.wordList.map((item) => {
    item.isReadFollow = false
    item.isSoundFollow = false
    item.isPlayFollow = false
  })
}
const changeTab = debounce((item, key) => {
  let arrList = vdata.wordList.filter((item) => item.isSoundFollow)
  if (arrList.length) {
    Taro.showToast({
      title: '正在录音中，暂不能切换',
      icon: 'none',
      duration: 1000,
    })
    return
  }

  if (key != 0 && vdata.wordList[key - 1].scoreFollow === null) {
    Taro.showToast({
      title: '请按照顺序进行学习',
      icon: 'none',
      duration: 1000,
    })
    return
  }
  if (vdata.isRecord) {
    Taro.showToast({
      title: '测评中，暂不能切换',
      icon: 'none',
      duration: 1000,
    })
    return
  }
  audioReset()
  vdata.current = key
})
const audioPlay = (type, item) => {
  audioReset()
  nextTick(() => {
    let src = ''
    if (type === 1) {
      item.isPlayFollow = true
      if (!item.playUrl) {
        let params = {
          content: item.englishText,
          contentId: item.contentId,
          contentType: personInfo.searchOra.type,
        }
        getOralInfo('getContentVoice', params).then((res: any) => {
          item.playUrl = res.voiceUrl
          playInfo(item, type, item.playUrl)
        })
      } else {
        playInfo(item, type, item.playUrl)
      }
    } else if (type === 2) {
      item.isReadFollow = true
      src = item.soundUrlFollow
      playInfo(item, type, src)
    }
  })
}
const playInfo = (item, type, src) => {
  if (!audioCtx) {
    audioCtx = Taro.createInnerAudioContext()
  }
  audioCtx.src = src
  audioCtx.play()
  audioCtx.onEnded(() => {
    if (type === 1) {
      item.isPlayFollow = false
    } else if (type === 2) {
      item.isReadFollow = false
    }
    audioCtx.stop()
  })
}
//录音按钮
let recorderManager = Taro.getRecorderManager()
const record = (type, item, i) => {
  stopAudio(item)
  vdata.current = i
  if (type === 1) {
    vdata.isClose = false
    vdata.isRecord = true
    item.isSoundFollow = true
    let num = 0
    recorderManager.start({
      duration: 10000,
      format: 'mp3',
    })
    vdata.timer = setInterval(() => {
      num += 1
      if (num > 10) {
        item.isSoundFollow = false
        recorderManager.stop()
        clearInterval(vdata.timer)
        vdata.timer = null
      }
    }, 1000)
  } else {
    item.isSoundFollow = false
    if (vdata.timer) {
      clearInterval(vdata.timer)
      vdata.timer = null
    }
    recorderManager.stop()
  }
}
recorderManager.onStop((res) => {
  if (res.tempFilePath) {
    if (vdata.isClose) {
      return
    } else {
      upLoadImg(res.tempFilePath, vdata.modeType)
    }
  }
})
const upLoadImg = (filePath, type) => {
  const token = getToken()

  Taro.uploadFile({
    url: getBaseUrl() + '/file/upload2ali',
    filePath: filePath,
    name: 'file',
    formData: {
      file: [filePath],
      moduleName: 'kycp',
    },
    header: {
      wxAccessToken: token,
    },
    success(res) {
      if (res.data) {
        let data = JSON.parse(res.data)
        if (type == 1) {
          vdata.wordList[vdata.current].soundUrlFollow = data.data[0] || ''
        } else {
          vdata.wordList[vdata.currentSpeed].soundUrlSpeed = data.data[0] || ''
        }
        contentEvaluation(type)
      }
    },
    complete: () => {},
  })
}
//通过录音找结果
const contentEvaluation = (type) => {
  let params = {
    contentId:
      type == 1
        ? vdata.wordList[vdata.current].contentId
        : vdata.wordList[vdata.currentSpeed].contentId,
    soundUrl:
      type == 1
        ? vdata.wordList[vdata.current].soundUrlFollow
        : vdata.wordList[vdata.currentSpeed].soundUrlSpeed,
    content:
      type == 1
        ? vdata.wordList[vdata.current].englishText
        : vdata.wordList[vdata.currentSpeed].englishText,
    type: vdata.modeType,
    bookId: personInfo.searchOra.bookId || 30,
    contentType: personInfo.searchOra.type,
  }
  getOralInfo('contentEvaluation', params).then((res) => {
    if (res) {
      vdata.isRecord = false
      if (type == 1) {
        vdata.wordList[vdata.current].scoreFollow = res.totalScore
        vdata.wordList[vdata.current].isSoundFollow = false
        vdata.wordList[vdata.current].wordDtoFollow = res.words
        // vdata.current += 1
      } else {
        vdata.wordList[vdata.currentSpeed].scoreSpeed = res.totalScore
        vdata.wordList[vdata.currentSpeed].isSoundSpeed = false
        vdata.wordList[vdata.current].wordDtoSpeed = res.words
        if (vdata.currentSpeed >= vdata.wordList.length - 1) {
          return
        } else {
          vdata.currentSpeed += 1
          vdata.nextTimer = setTimeout(() => {
            beginSpeed()
          }, 1500)
        }
      }
    } else {
      vdata.isRecord = false
      Taro.showToast({
        title: '',
        icon: 'none',
        duration: 2000,
      })
      if (type == 1) {
        vdata.wordList[vdata.current].scoreFollow = 0
        vdata.wordList[vdata.current].isSoundFollow = false
        // vdata.current += 1
      } else {
        vdata.wordList[vdata.currentSpeed].scoreSpeed = 0
        vdata.wordList[vdata.currentSpeed].isSoundSpeed = false
        if (vdata.currentSpeed >= vdata.wordList.length - 1) {
          return
        } else {
          vdata.currentSpeed += 1
          vdata.nextTimer = setTimeout(() => {
            beginSpeed()
          }, 1000)
        }
      }
    }
  })
}
const chageSpeedTab = (type) => {
  if (flag.value) {
    vdata.currentSpeed = type
  }
}
//我的录音播放
const myPlay = (item) => {
  audioPlay(2, item)
}
//版本切换
const changeBook = (val) => {
  versionBook.value.popupShow()
}
//模式切换
const modeChange = (val) => {
  if (vdata.modeType == val) return
  if (vdata.timer) {
    clearInterval(vdata.timer)
    vdata.timer = null
  }
  recorderManager.pause()
  if (vdata.nextTimer) {
    clearTimeout(vdata.nextTimer)
    vdata.nextTimer = null
  }
  if (val == 2) {
    vdata.visible = true
    audioReset()
  } else {
    vdata.visible = true
    resetSpeed()
  }
}
//弹框拦截
const config = () => {
  vdata.modeType = vdata.modeType == 1 ? 2 : 1
  vdata.currentSpeed = 0
  if (vdata.modeType == 2) {
    beginSpeed()
  }
}
const cancel = () => {
  vdata.visible = false
  if (vdata.modeType == 2) {
    beginSpeed()
  }
}
const configShow = () => {
  Taro.navigateBack({ delta: 1 })
}
const cancelShow = () => {
  vdata.isClose = false
  if (vdata.modeType == 2) {
    beginSpeed()
  }
}
//选择版本回调
const bookChange = (val) => {
  console.log(val, 888)
}
//收藏
const toCollect = () => {
  Taro.navigateTo({
    url: '../collectList/index',
  })
}
// 完成测评
const complete = () => {
  if (!flag.value) {
    return
  }
  Taro.redirectTo({
    url: `../assessResult/index?readType=${vdata.modeType}`,
  })
}
const returnClose = () => {
  if (vdata.timer) {
    clearInterval(vdata.timer)
    vdata.timer = null
  }
  recorderManager.pause()
  if (vdata.nextTimer) {
    clearTimeout(vdata.nextTimer)
    vdata.nextTimer = null
  }
  audioReset()
  resetSpeed()
}
useDidHide(() => {
  returnClose()
})
onBeforeUnmount(() => {
  returnClose()
})
useDidShow(() => {
  getList()
})
</script>
<style lang="scss">
.beginStudy {
  .modeStyle {
    background: #ededed;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    border-radius: 25px;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    height: 30px;
    padding: 0 2px;
    align-items: center;
    color: #999999;
    view {
      width: 58px;
      height: 24px;
      text-align: center;
      line-height: 23px;
    }
    .modeChoose {
      background: #fff;
      color: #333;
      border-radius: 25px;
    }
  }
  .palyMain {
    background: #f8f8f8;
    overflow-y: scroll;
    box-sizing: border-box;
    padding-bottom: 30px;
    .play-item {
      .noPlay {
        border-bottom: 1px solid #eee;
        padding: 50px;
        position: relative;
        .noRead {
          width: 34px;
          height: 34px;
          background: #e8e8e8;
          font-size: 12px;
          border-radius: 50%;
          position: absolute;
          right: 16px;
          top: 12px;
          text-align: center;
          line-height: 34px;
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #999999;
        }
        .text {
          font-size: 18px;
          color: #999999;
          font-family: 思源黑体;
          /* 溢出的内容将它隐藏 */
          word-break: break-all;
          box-sizing: border-box;
          overflow: hidden;
          text-align: center;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .currentPlay {
        word-break: break-all;
        background: #fff;
        margin-bottom: 20px;
        position: relative;
        text-align: center;
        padding: 20px 0;
        .current {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #343434;
          margin-bottom: 25px;
        }
        .wordInfo {
          padding: 0px 40px;
          .englishWord {
            word-break: break-all;
            box-sizing: border-box;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 12px;

            font-family: 思源黑体;
            font-size: 18px;
            font-weight: 500;
            line-height: 28px;
            color: #343434;
            .wordText {
              padding: 0 2px;
            }
            .redWordText {
              color: red;
            }
          }
          .chainWord {
            word-break: break-all;
            box-sizing: border-box;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 40px;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            line-height: 14px;
            color: #343434;
          }
        }
        .collect {
          position: absolute;
          top: 0px;
          right: 10px;
          width: 50px;
          height: 40px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          image {
            width: 24px;
            height: 24px;
          }
          .chooseImg {
            width: 20px;
            height: 20px;
          }
        }
        .operate {
          //   display: flex;
          .operate-item {
            display: flex;
            padding: 0 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            image {
              width: 52px;
              height: 52px;
            }
            .grandInfo {
              display: flex;
              justify-content: center;
              align-items: center;
              background: #ffb81a;

              width: 52px;
              height: 52px;
              font-family: PingFangSC-Medium;
              font-size: 18px;
              /* 文本色/白色 */
              color: #ffffff;
              border-radius: 50%;
              image {
                width: 15px;
                height: 15px;
              }
            }
            .errorGrand {
              background: #ff230a;
            }
            .goodGrand {
              background: #5db75d;
            }
          }
          .operate-items {
            justify-content: center;
            .grandInfo {
              margin-left: 50px;
            }
            .operate-items-answer {
              display: flex;
            }
          }
          .recordInfo {
            display: flex;
            height: 56px;
            position: relative;
            // background: yellow;
            align-items: center;
            justify-content: center;
            text {
              background-color: #2f5de7; //声波颜色
              width: 3px;
              height: 10px;
              margin: 0 10px;
              display: inline-block;
              border: none;
              animation: note 0.2s ease-in-out;
              animation-iteration-count: infinite;
              animation-direction: alternate;
            }
            .closeBtn {
              position: absolute;
              top: -5px;
              left: 50%;
              width: 100%;
              transform: translateX(-50%);
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #cccccc;
            }
            .text1 {
              animation-delay: -1s;
            }

            .text2 {
              animation-delay: -0.9s;
            }

            .text3 {
              animation-delay: -0.8s;
            }

            .text4 {
              animation-delay: -0.7s;
            }

            .text5 {
              animation-delay: -0.6s;
            }

            .text6 {
              animation-delay: -0.5s;
            }

            .text7 {
              animation-delay: -0.4s;
            }

            .text8 {
              animation-delay: -0.3s;
            }

            .text9 {
              animation-delay: -0.2s;
            }

            .text10 {
              animation-delay: -0.1s;
            }

            @keyframes note {
              from {
                transform: scaleY(1);
              }
              to {
                transform: scaleY(4);
              }
            }
          }
        }
      }
    }
  }
  .completeBtn {
    height: 44px;
    border-radius: 22px;
    background: #eeeeee;
    margin: 40px 15px 0;
    text-align: center;
    line-height: 44px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #cbcbcb;
  }
  .completeBtns {
    background: #2f5de7;
    color: #fff;
  }
}
</style>
