<template>
  <view class="assessResult" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar :fixedStyle="vdata.fixedStyle" />
    <view class="topText">
      <view>{{ vdata.sectionName }}</view>
      <view class="grand">
        <text class="number">{{ gerScore(vdata.totalScore) || 0 }}</text>
        <text class="unit">分</text>
      </view>
    </view>
    <view
      class="scrollMain"
      :style="{
        height: `calc(100vh - ${navBarHeight + 200}px)`,
      }"
    >
      <scroll-view class="scroll-view_H" :scroll-y="true" @scrolltolower="lower">
        <view class="scroll-item" v-for="(item, i) in vdata.audioList" :key="i">
          <view class="english">
            <view class="english-text">{{ item.englishText }}</view>
            <image
              v-if="!item.isPlay"
              @tap="audioPlay(item, 1)"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kspg/b65ab4ba6762483a92fc0e15b1f2a741/vadio.png"
              alt=""
            />
            <image
              v-else
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/7f223a621ff440119894c238f15c4649/bf.gif"
              alt=""
            />
          </view>
          <view class="myInfo">
            <view class="myAudio" @tap="audioPlay(item, 2)">
              <text>我的录音</text>
              <image
                v-if="!item.isSound"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/8e7ac2baef2644d7857f7882771be459/bf.png"
                mode="scaleToFill"
              />
              <image
                v-else
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/a6494dbeb14b41458f5359e396de63c3/bfgif.gif"
                mode="scaleToFill"
              />
            </view>
            <view>
              <text class="errorColor" v-if="item.score < 60">{{ item.score || 0 }}分</text>
              <text class="goodColor" v-else-if="item.score >= 80">{{ item.score || 0 }}分</text>
              <text class="normalColor" v-else>{{ item.score }}分</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="footerBtn">
      <view class="hasNext" v-if="vdata.hasNext">
        <view class="reload" @tap="again">重新测评</view>
        <view class="next" @tap="next">学习下一节</view>
      </view>
      <view v-else class="notReload" @tap="again">重新测评</view>
    </view>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import { reactive, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useSystem, usePerson, useUser } from '@/stores'
import { getOralInfo } from '@/api/oralAssess'

import { debounce } from '@/utils'
import { getTryCount } from '@/api/index'
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const user = useUser()

const system = useSystem()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
const router = useRouter()
const group2 = ref()
const vdata: any = reactive({
  audioList: [],
  totalScore: 0,
  sectionName: '',
  hasNext: true,
  searchDic: {},
  readType: null,
  fixedStyle: {
    color: '#fff',
  },
})
let audioCtx: any = null
const audioReset = () => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  vdata.audioList.map((item) => {
    item.isPlay = false
    item.isSound = false
  })
}
const again = () => {
  Taro.redirectTo({ url: '../beginStudy/index' })
}
const gerScore = (val) => {
  if (val) {
    val = Math.round(val)
  }
  return val
}
const next = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '口语测评', funCourseName: null })
    if (memberInfo.vipState == 1) {
      if (memberInfo.tryFlag == 1) {
        if (memberInfo.configCount <= memberInfo.hasTryCount) {
          memberToast.value.showToast(false)
        } else {
          memberToast.value.showToast(true, memberInfo.configCount, memberInfo.hasTryCount)
        }
      } else {
        memberToast.value.showToast(false)
      }
    } else {
      handleNavigate()
    }
  } else {
    handleNavigate()
  }
})

const handleNavigate = () => {
  personInfo.setSearchOra(vdata.searchDic)
  Taro.redirectTo({ url: '../beginStudy/index' })
}

const audioPlay = (item, type) => {
  audioReset()
  nextTick(() => {
    if (type == 1) {
      item.isPlay = true
      if (item.playUrl) {
        createPlay(item.playUrl, item, 1)
      } else {
        let params = {
          content: item.englishText,
          contentId: item.contentId,
          contentType: personInfo.searchOra.type,
        }
        getOralInfo('getContentVoice', params).then((res: any) => {
          item.playUrl = res.voiceUrl
          createPlay(item.playUrl, item, 1)
        })
      }
    } else {
      item.isSound = true
      if (item.soundUrl) {
        createPlay(item.soundUrl, item, 2)
      }
    }
  })
}
const createPlay = (src, item, type) => {
  audioCtx = Taro.createInnerAudioContext()
  audioCtx.src = src
  audioCtx.play()
  audioCtx.onEnded(() => {
    if (type == 1) {
      item.isPlay = false
    } else {
      item.isSound = false
    }
    audioCtx.stop()
  })
}
onBeforeUnmount(() => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
})
//获取列表
const getPageList = () => {
  let params = {
    ...personInfo.searchOra,
    readType: vdata.readType,
  }

  getOralInfo('evalResult', params).then((res: any) => {
    if (res) {
      vdata.audioList = res.result
      vdata.totalScore = res.totalScore
      vdata.sectionName = res.sectionName
      vdata.hasNext = res.hasNext
      vdata.searchDic = res.nextChapterVo
    }
  })
}

onMounted(() => {
  if (router.params.readType) {
    vdata.readType = router.params.readType
  }
  getPageList()
})
</script>
<style lang="scss">
.assessResult {
  background-image: url('https://scsf.oss-cn-shanghai.aliyuncs.com/kspg/resultBg.png');
  background-repeat: no-repeat;
  background-position: top;
  height: 100vh;
  background-size: 100%;
  background-color: #f6f9fd;
  box-sizing: border-box;
  .topText {
    font-family: PingFangSC-Medium;
    font-size: 15px;
    text-align: center;
    color: #ffffff;
    .grand {
      display: flex;
      height: 45px;
      margin: 10px 0 25px;
      justify-content: center;
      .number {
        font-size: 40px;
      }
      .unit {
        line-height: 70px;
        margin-left: 3px;
      }
    }
  }
  .scrollMain {
    background: #fff;
    overflow-y: scroll;
    margin: 0 15px;
    border-radius: 12px 12px 0 0;
    padding: 16px;
    box-sizing: border-box;
    .scroll-item {
      padding: 14px 0;
      border-bottom: 1px solid #e6e6e6;

      .english {
        font-family: PingFangSC-Medium;
        font-size: 15px;
        color: #343434;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .english-text {
          flex: 1;
        }
        image {
          width: 20px;
          height: 20px;
        }
        margin-bottom: 5px;
      }
      .myInfo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        .myAudio {
          width: 82px;
          height: 24px;
          border-radius: 4px;
          opacity: 1;
          background: #eff7ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #727488;
          image {
            width: 12px;
            height: 12px;
            margin-left: 3px;
          }
        }
        .errorColor {
          color: #ff230a;
        }
        .normalColor {
          color: #ffb81a;
        }
        .goodColor {
          color: #5db75d;
        }
      }
    }
  }
  .footerBtn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    height: 93px;
    padding: 15px 25px 0;
    box-sizing: border-box;
    border-top: 1px solid #f1f1f1;
    .hasNext {
      display: flex;
      justify-content: space-between;
      view {
        width: 155px;
        height: 44px;
        border-radius: 23px;
        text-align: center;
        line-height: 44px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
      }
      .reload {
        background: linear-gradient(0deg, #2f5de7, #2f5de7), #fff7eb;
        color: #ffffff;
      }
      .next {
        box-sizing: border-box;
        border: 1px solid #2f5de7;
        color: #2f5de7;
      }
    }
    .notReload {
      border-radius: 23px;
      text-align: center;
      line-height: 44px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      background: linear-gradient(0deg, #2f5de7, #2f5de7), #fff7eb;
      color: #ffffff;
      font-size: 16px;
    }
  }
}
</style>
