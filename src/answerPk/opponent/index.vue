<template>
  <view>
    <view class="opponentMain" v-if="vdata.isTransition">
      <NavBar title="答题乐园" :fixedStyle="vdata.fixedStyle" :onClickBack="returnOrClose" />
      <view :class="['topInfo', vdata.isShow && 'show']">
        <image
          class="txImg"
          :src="
            personInfo?.userInfo?.portraitUrl ||
            'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/ad4fecc900cf4bfe896d9261c7c8e2b8/defaultImg.png'
          "
          mode="scaleToFill"
        />
      </view>

      <view class="centerVs">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/eb5bb2e0d6474dd481e53883720d8793/vs.png"
          mode="scaleToFill"
        />
      </view>
      <view :class="['bottomInfo', vdata.isShow && 'show']">
        <view class="wait-wrapper">
          <template v-if="vdata.wait">
            <view class="avatar-wrapper">
              <view class="avatar" />
            </view>
          </template>
          <template v-else>
            <view class="pkSuccess">
              <image :src="vdata.pkUser?.matchUserPortraitUrl" />
            </view>
          </template>
          <view class="text">{{ vdata.wait ? '正在寻找对手…' : '匹配成功' }}</view>
        </view>
      </view>
      <nut-overlay v-model:visible="vdata.showToast" :close-on-click-overlay="false">
        <view class="toastInfo">
          <view class="contentText">
            <view>
              <view>对手正在赶来的路上 </view>
              <view>确定取消对战吗？</view>
            </view>
          </view>
          <view class="contentBtn">
            <view class="cancel" @tap="cancel">取消</view>
            <view class="confirm" @tap="confirm"> 继续等待 </view>
          </view>
        </view>
      </nut-overlay>
    </view>
    <view
      class="transitionMain"
      :style="{ paddingTop: `${navBarHeight + 130}px` }"
      v-show="!vdata.isTransition"
    >
      <NavBar title="答题PK" :fixedStyle="vdata.fixedStyle" :onClickBack="returnOrClose" />
      <view class="content">
        <view class="timer">
          <image
            class="three"
            v-show="vdata.currentTimer === 3"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/20ccc54e529849b09f9e23e1fadf407c/3.png"
          />
          <image
            class="three"
            v-show="vdata.currentTimer === 2"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/67a83b0052064cca906ff8231c54a73d/2.png"
          />
          <image
            class="one"
            v-show="vdata.currentTimer <= 1"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/c17dfd9424094dcb994c908319f83e9b/1.png"
          />
        </view>
        <view class="begin" v-if="vdata.currentTimer <= 1">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/d35214c11170498e8af6b5cc81b5f606/begin.png"
            mode="scaleToFill"
          />
        </view>
        <view>
          <image
            class="sd"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/a0cf551465e14ad5803d4a2697712d36/sd.png"
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
import Taro, { useDidShow, useRouter, useDidHide } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, useUser, useAnswerPk } from '@/stores'
import { questionAnswerPk, questionInfo } from '@/api/intelligentQuestion'
const system = useSystem()
const personInfo = useUser()
const router = useRouter()
const answerPk = useAnswerPk()
const { navBarHeight } = system.navBarInfo
import { reactive, onMounted, onBeforeUnmount } from 'vue'

const vdata: any = reactive({
  isShow: false,
  showToast: false,
  tabType: 1,
  directory: false,
  fixedStyle: {
    color: '#fff',
  },
  subject: '',
  grade: '',
  timer: null,
  index: 0,
  wait: true,
  pkUser: null,
  isTransition: true,
  currentTimer: 3,
  timerInfo: null,
  questionList: [],
})

const tabChange = (val) => {
  vdata.tabType = val
}
const cancel = () => {
  vdata.showToast = false
  if (vdata.timer) {
    clearInterval(vdata.timer)
    vdata.timer = null
  }
  Taro.navigateBack({ delta: 1 })
}
const confirm = () => {
  vdata.showToast = false
}
const returnOrClose = () => {
  if (vdata.wait) {
    vdata.showToast = true
  }
}
const beginPk = () => {
  let params = {
    grade: vdata.grade,
    subject: vdata.subject,
  }
  questionAnswerPk('startMatch', params)
    .then((res) => {
      vdata.timer = setInterval(() => {
        vdata.index += 1
        getPkUser()
        // setTimeout(() => {
        //   vdata.isTransition = false
        //   setTimer()
        // }, 1500)
      }, 1000)
    })
    .catch(() => {
      Taro.navigateBack({ delta: 1 })
    })
}
const setTimer = () => {
  vdata.timerInfo = setInterval(() => {
    vdata.currentTimer -= 1
    if (vdata.currentTimer <= 0) {
      clearInterval(vdata.timerInfo)
      vdata.timerInfo = null
      let params = {
        questionList: vdata.questionList,
        grade: vdata.grade,
        subject: vdata.subject,
        currentKey: vdata.pkUser.currentKey,
        matchKey: vdata.pkUser.matchKey,
        type: vdata.pkUser.type,
        currentUserName: vdata.pkUser.currentUserName,
        currentUserPortraitUrl: vdata.pkUser.currentUserPortraitUrl,
        matchUserName: vdata.pkUser.matchUserName,
        matchUserPortraitUrl: vdata.pkUser.matchUserPortraitUrl,
      }
      answerPk.setQuestionInfo(params)
      Taro.redirectTo({
        url: '../answer/index',
      })
    }
  }, 1000)
}
const getPkUser = () => {
  let params = {
    grade: vdata.grade,
    subject: vdata.subject,
    type: vdata.index <= 10 ? 0 : 1,
  }
  questionAnswerPk('getMatchUser', params).then((res) => {
    if (res) {
      clearInterval(vdata.timer)
      vdata.timer = null
      if (res.code) {
        return
      }
      vdata.pkUser = res
      vdata.wait = false
      getQuerstionInfo(vdata.pkUser.grade)
    }
  })
}
const overPk = () => {
  let params = {
    currentKey: vdata.pkUser.currentKey,
    matchKey: vdata.pkUser.matchKey,
    overType: 1,
    score: 0,
    type: vdata.pkUser.type,
  }
  questionAnswerPk('overPK', params).then((res) => {
    setTimeout(() => {
      Taro.navigateBack({ delta: 1 })
    }, 2000)
  })
}
const getQuerstionInfo = (grade) => {
  let params = {
    grade,
    subject: vdata.subject,
  }
  questionAnswerPk('getMatchQuestions', params)
    .then((res) => {
      if (res) {
        if (res.code) {
          overPk()
          return
        }
        setTimeout(() => {
          vdata.isTransition = false
          setTimer()
        }, 1500)
        res.forEach((item) => {
          let origan = {
            questionCode: item.questionCode,
            questionId: item.questionId,
            subjectCode: item.subjectCode,
          }
          questionInfo('getQuestionInfo', origan).then((req) => {
            if (req) {
              req.data.isAnswer = false
              req.data.isRightAnswer = null
              req.data.showExplain = false
              req.data.answerList = []
              req.data.questionCode = item.questionId
              if (req.data.children && req.data.children.length) {
                req.data.children.map((vtem) => {
                  vtem.isAnswer = false
                  vtem.isRightAnswer = null
                  vtem.showExplain = false
                  vtem.answerList = []
                })
              }
              vdata.questionList.push(req.data)
            }
          })
        })
      }
    })
    .catch((err) => {
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000)
    })
}
onMounted(() => {
  setTimeout(() => {
    vdata.isShow = true
  }, 200)
  const { grade, subject } = answerPk.subjectInfo
  vdata.grade = grade
  vdata.subject = subject
  beginPk()
})
let innerAudioContext: any = null
const createBgAudio = () => {
  innerAudioContext = Taro.createInnerAudioContext()
  innerAudioContext.src =
    'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/b536ce0985cd499ca366e676bbc35aca/bfbg.mp3'
  innerAudioContext.play() // 播放
  innerAudioContext.onEnded(() => {
    resetAudio()
    createBgAudio()
  })
}
const resetAudio = () => {
  if (innerAudioContext) {
    innerAudioContext.destroy()
    innerAudioContext = null
  }
}
useDidShow(() => {
  if (answerPk.music) {
    createBgAudio()
  }
})
onBeforeUnmount(() => {
  resetAudio()
})
useDidHide(() => {
  resetAudio()
})
</script>
<style lang="scss">
.opponentMain {
  height: 100vh;
  position: relative;
  .topInfo,
  .bottomInfo {
    position: absolute;
    height: 50%;
    left: 0px;
    right: 0px;
    transition: all 0.5s ease-in-out;
    &.show {
      transform: translateY(0%);
    }
    .txImg {
      width: 90px;
      height: 90px;
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .topInfo {
    top: 0px;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/85d9e60153f04eaba94d4d73822f3b45/topBg.png')
      no-repeat center;
    background-size: 100% 100%;
    transform: translateY(-100%);
  }
  .bottomInfo {
    bottom: 0px;
    transform: translateY(100%);
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/7c690e4bebc74cc995adc30423a91bbf/bottomBg.png')
      no-repeat center;
    background-size: 100% 100%;
    .wait-wrapper {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
    .pkSuccess {
      margin-bottom: 30px;
      image {
        width: 90px;
        height: 90px;
        border-radius: 50%;
      }
    }
    .avatar-wrapper {
      position: relative;
      width: 134px;
      height: 134px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.disabledAnimation {
        &::after {
          content: none;
        }
      }
      &::after {
        content: ' ';
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/edb3e5069528469394d9e09d00a8cd43/mb.png')
          top left/100% 100% no-repeat;
        animation: rotateAnimation 2s infinite linear;
      }
      @keyframes rotateAnimation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(359deg);
        }
      }
      .avatar {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/8774b6735e244670b5b5f6b824f1d0bc/tx.png')
          top left/100% 100% no-repeat;
        border: 4px solid #fff;
      }
    }
    .text {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      line-height: 33px;
      color: #ffffff;
      margin-top: 5px;
    }
  }
  .centerVs {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    image {
      width: 93px;
      height: 67px;
    }
  }
  .toastInfo {
    top: 40%;
    background: #fff;
    width: 280px;
    // height: 163px;
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
.transitionMain {
  height: 100vh;
  width: 100vw;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
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
      .three {
        width: 35px;
        height: 49px;
      }
      .one {
        width: 32px;
        height: 49px;
      }
    }
    .sd {
      width: 152px;
      height: 81px;
      position: absolute;
      top: 340px;
      left: 50%;
      transform: translateX(-50%);
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
