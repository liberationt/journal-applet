<template>
  <view class="answerMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar title="答题乐园" :fixedStyle="vdata.fixedStyle" :onClickBack="returnOrClose" />
    <scroll-view
      class="scroll-content"
      scroll-y="true"
      scroll-with-animation="true"
      :style="{ height: `calc(100vh - ${navBarHeight + 93}px)` }"
    >
      <view class="topInfo">
        <view class="leftInfo">
          <text class="current">{{ vdata.current }} </text>
          <text> /10</text>
        </view>
        <view class="rightInfo">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/6256d1f3fdef457f8fe7d5e4d1f2ac05/timer.png"
            mode="scaleToFill"
          />
          <text
            >{{ vdata.divide ? vdata.divide : '00' }}:{{ vdata.second ? vdata.second : '00' }}</text
          >
        </view>
      </view>
      <view class="questionMain">
        <template v-for="(item, i) in vdata.questionList" :key="item">
          <view class="questionContent" v-if="vdata.current === i + 1">
            <view class="questionTop">
              <view class="topLeft">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/276b7faaab504b62877afbdcee22ae5c/topLeft.png"
                  mode="scaleToFill"
                />
              </view>
              <view class="topRight">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/35a9e36d6c9249d7a6efc3d0e0451471/topRight.png"
                  mode="scaleToFill"
                />
              </view>
              <view class="bottomLeft">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/cec30cc3bcf041559b6b6e8c360ff81b/bottomLeft.png"
                  mode="scaleToFill"
                />
              </view>
              <view class="bottomRight">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/3e939d9bf41a4282afd46949052f8f7e/bottomRight.png"
                  mode="scaleToFill"
                />
              </view>
              <view class="ques-topic clearfix">
                <rich-text class="ques-type" :nodes="getStem(item)"></rich-text>
              </view>
            </view>
            <view class="questionList">
              <view
                v-for="(suboption, index) in getOptions(item)"
                :key="index"
                :class="[
                  'questionItem',
                  getAnswerSelect(item.answerList, index) && 'questionItemSelect',
                ]"
                @tap="chooseAnswerInfo(index, item)"
              >
                <view class="answer-word">{{ optionTag(index) }} </view>
                <rich-text class="answer-item-choose" :nodes="getAnswerStem(suboption)"></rich-text>
              </view>
            </view>
          </view>
        </template>
      </view>
    </scroll-view>
    <view class="footer">
      <view class="leftDtk" @tap="showPoput">
        <image
          @tap="vdata.answerSheet = false"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/2e9362637c904548887aaaea1479c928/datiqia.png"
          mode="scaleToFill"
        />
        <text>答题卡</text>
      </view>
      <view class="btnNext" @tap="nextBtn"> {{ vdata.current < 10 ? '下一题' : '提交' }} </view>
    </view>
    <nut-popup
      position="bottom"
      :style="{ maxHeight: '80%' }"
      lock-scroll
      round
      v-model:visible="vdata.answerSheet"
    >
      <!-- <view class="seeting-list">
        <view class="study-seeting">目录</view>
      </view> -->
      <view class="directory">
        <view class="topTitInfo">
          <view class="directoryTitle">答题卡</view>
          <image
            @tap="vdata.answerSheet = false"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/47bed41528a3418b9111e5199de4ab61/icon1.png"
            mode="scaleToFill"
            class="closeImg"
          />
        </view>
        <view class="answerText">
          <view class="answerLeft">
            <view class="bg"></view>
            <view>已作答</view>
          </view>
          <view class="answerRight">
            <view class="bg bgs"></view>
            <view>未作答</view>
          </view>
        </view>
        <view class="directoryList">
          <view
            :class="['directoryItem', item.answerList.length && 'selectDirectoryItem']"
            v-for="(item, i) in vdata.questionList"
            :key="item"
            @tap="redirect(i + 1)"
          >
            {{ i + 1 }}
          </view>
        </view>
        <view class="submit" @tap="submitResult">提交</view>
      </view>
    </nut-popup>
    <nut-overlay v-model:visible="vdata.returnShow" :close-on-click-overlay="false">
      <view class="toastInfo" v-if="vdata.showType === 1">
        <view class="contentText">
          <view>
            <view>现在退出对战，将视为PK失败</view>
            <view>确定退出吗？</view>
          </view>
        </view>
        <view class="contentBtn">
          <view class="cancel" @tap="returnConfig">退出</view>
          <view class="confirm" @tap="confirm"> 继续PK </view>
        </view>
      </view>
      <view class="toastInfo" v-if="vdata.showType === 2">
        <view class="contentText">
          <view>
            <view>你的对手已交卷 </view>
            <view> 即将为你自动提交噢</view>
          </view>
        </view>
        <view class="contentBtn">
          <view class="handleWidth" @tap="forcedSumbit">交卷（{{ vdata.countTimer }}）</view>
        </view>
      </view>
      <view class="toastInfo" v-if="vdata.showType === 3">
        <view class="contentText">
          <view>
            <view>你的对手退出房间放弃PK</view>
            <view>当前PK已结束</view>
          </view>
        </view>
        <view class="contentBtn">
          <view class="handleWidth" @tap="returnAnswer">退出</view>
        </view>
      </view>

      <view class="toastInfo" v-if="vdata.showType === 4">
        <view class="contentText">
          <view>
            <view>交卷时间到！</view>
          </view>
        </view>
        <view class="contentBtn">
          <view class="handleWidth" @tap="forcedSumbit">交卷（{{ vdata.countTimer }}）</view>
        </view>
      </view>
    </nut-overlay>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, useAnswerPk } from '@/stores'
import { questionInfo, questionAnswerPk } from '@/api/intelligentQuestion'
const system = useSystem()
const answerPk = useAnswerPk()
const { navBarHeight } = system.navBarInfo
import { reactive, onMounted, onUnmounted, onBeforeUnmount } from 'vue'

const vdata: any = reactive({
  isShow: false,
  current: 1,
  tabType: 1,
  directory: false,
  answerSheet: false,
  divide: 0,
  second: 0,
  fixedStyle: {
    color: '#fff',
  },
  timer: null,
  questionList: [],
  returnShow: false,
  queryOverTimer: null,
  showType: '',
  countTimer: 3,
  forcedTimer: null,
  isOverTimer: 0,
  isError: true,
  isLoadingBtn: true,
})
const timer = () => {
  vdata.isOverTimer++
  if (vdata.isOverTimer === 297) {
    vdata.showType = 4
    vdata.returnShow = true
    vdata.forcedTimer = setInterval(() => {
      if (vdata.countTimer == 1) {
        forcedSumbit()
        return
      }
      vdata.countTimer--
    }, 1000)
  }
  vdata.second++
  if (vdata.second <= 59) {
    if (vdata.second <= 9) {
      vdata.second = '0' + vdata.second
    }
  } else {
    vdata.second = 0
    vdata.divide++
    if (vdata.divide < 5) {
      vdata.divide = '0' + vdata.divide
    } else {
      clearInterval(vdata.timer)
      vdata.timer = null
    }
  }
}
const returnOrClose = () => {
  vdata.returnShow = true
  vdata.showType = 1
}
const returnConfig = () => {
  overPk(0, false, 1)
  vdata.isError = false
  Taro.navigateBack({ delta: 1 })
  vdata.returnShow = false
  resetTime()
}
const resetTime = () => {
  if (vdata.timer) {
    clearInterval(vdata.timer)
    vdata.timer = null
  }
  if (vdata.queryOverTimer) {
    clearInterval(vdata.queryOverTimer)
    vdata.queryOverTimer = null
  }
  if (vdata.forcedTimer) {
    clearInterval(vdata.forcedTimer)
    vdata.forcedTimer = null
  }
}
const confirm = () => {
  vdata.returnShow = false
}
// 获取题干
const getStem = (ques) => {
  let stem = ''
  if (ques && ques.context) {
    stem = formatRichTextInfo(ques.context.stem, 280) || ''
  } else {
    stem = ''
  }
  return stem
}
const getAnswerStem = (ques) => {
  let stem = ''
  stem = formatRichTextInfo(ques, 210)
  return stem
}
const formatRichTextInfo = (str, width) => {
  let result = ''
  let reg1 = /<img[^>]style="[^"]*/g
  str = str.replace(/<table[^>]*>/gi, '<table max-width="100%"  style="max-width:100%;"')
  if (!reg1.test(str)) {
    result = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  } else {
    let srcReg = /<img[^>]style="[^"]*/g
    let videoList = str.match(srcReg) || []
    if (videoList && videoList.length) {
      if (videoList[0].indexOf('width') != -1) {
        result = str.replace(
          /(<img[^>]*style="[^"]*?)(\bwidth\s*:\s*\d+[^;"]*?px;)(\s?height\s*:\s*\d+[^;"]*?px;)([^<]*\/>)/gi,
          function (match, p1, p2, p3, p4) {
            var widthValue = parseInt(p2.match(/\d+/)[0])
            // var heightValue = parseInt(p3.match(/\d+/)[0])
            if (widthValue > width) {
              return p1 + `width: ${width}px; height: auto;` + p4
            }
            return match // 如果width小于等于375，则不做替换，保持原样
          }
        )
      } else if (videoList[0].indexOf('height') != -1) {
        result = str.replace(
          /(<img[^>]*style="[^"]*?)(\s?height\s*:\s*\d+[^;"]*?px;)([^<]*\/>)/gi,
          function (match, p1, p2, p3) {
            var widthValue = parseInt(p2.match(/\d+/)[0])
            if (widthValue > width) {
              return p1 + `width: ${width}px;` + p3
            }
            return match // 如果width小于等于375，则不做替换，保持原样
          }
        )
      } else {
        result = str.replace(/<img[^>]*>/gi, function (match, capture) {
          match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
          return match
        })
        result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
        result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
      }
    } else {
      result = str.replace(/<img[^>]*>/gi, function (match, capture) {
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
        return match
      })
      //再设置新的样式
      result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
      result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
    }
  }
  return result
}
// 获取选项
const getOptions = (ques) => {
  if (ques && ques.context) {
    return ques.context.options
  } else {
    return null
  }
}
//是否选中
const getAnswerSelect = (list, index) => {
  if (!list.length) return false
  if (list.includes(optionTag(index))) {
    return true
  } else {
    return false
  }
}
//选中答案
const chooseAnswerInfo = (index, ques) => {
  if (getQuestionTypeDx(ques.quesType.name)) {
    let answerList = [optionTag(index)]
    ques.answerList = answerList
  }
  setTimeout(() => {
    if (vdata.current < 10) {
      vdata.current += 1
    }
  }, 500)
}
const getQuestionTypeDx = (str) => {
  let flag = false
  if (str.indexOf('单选') != -1 || str.indexOf('选择题') != -1 || str.indexOf('单项选择') != -1) {
    flag = true
  }
  return flag
}
const optionTag = (i) => {
  const optionlist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return optionlist.charAt(i)
}
const begin = () => {
  vdata.timer = setInterval(timer, 1000)
}
const tabChange = (val) => {
  vdata.tabType = val
}
const showPoput = () => {
  vdata.answerSheet = true
}
//下一题或者提交
const nextBtn = () => {
  if (vdata.current < 10) {
    vdata.current += 1
  } else {
    submitResult()
  }
}
const forcedSumbit = () => {
  vdata.returnShow = false
  submitResult()
}
// 提交
const submitResult = () => {
  if (!vdata.isLoadingBtn) {
    return
  }
  vdata.isLoadingBtn = false
  resetTime()
  let arrList = []
  let rightCoutn = 0
  vdata.questionList.forEach((item) => {
    let objectInfo: any = {
      questionId: item.questionCode,
      northSubmitResult: 1,
      submitType: 2,
    }
    if (!item.answerList.length) {
      objectInfo.northSubmitResult = 0
      arrList.push(objectInfo)
    } else {
      let answerString = item.answerList.join('')
      let answerDetail = item.explain[0].answers.join('')
      if (answerString.indexOf(answerDetail) != -1) {
        arrList.push(objectInfo)
        rightCoutn += 1
      } else {
        objectInfo.northSubmitResult = 0
        arrList.push(objectInfo)
      }
    }
  })
  let params = {
    pkResultDTOList: arrList,
    subject: answerPk.saveInfo?.subject,
    grade: answerPk.saveInfo?.grade,
    term: answerPk.saveInfo?.term,
  }
  questionAnswerPk('submitPKResult', params).then((res) => {
    let answerInfo = {
      answerList: arrList,
      divide: vdata.divide,
      second: vdata.second,
      questionList: vdata.questionList,
    }
    answerPk.setAnswerInfo(answerInfo)
    // Taro.redirectTo({
    //   url: '../reportAnswer/index',
    // })
  })
  overPk(rightCoutn, true, 2)
  vdata.isError = false
}
const overPk = (score, isRigth, type) => {
  let params = {
    currentKey: answerPk?.questionInfo?.currentKey,
    matchKey: answerPk?.questionInfo?.matchKey,
    overType: type,
    score: score * 10,
    type: answerPk?.questionInfo?.type,
  }
  questionAnswerPk('overPK', params).then((res) => {
    if (isRigth) {
      setTimeout(() => {
        Taro.showLoading({
          title: '正在提交...',
        })
      }, 500)
      setTimeout(() => {
        Taro.hideLoading()
        Taro.redirectTo({
          url: '../result/index',
        })
        vdata.isLoadingBtn = true
      }, 2000)
    }
  })
}
//退出
const returnAnswer = () => {
  overPk(0, false, 1)
  vdata.isError = false
  resetTime()
  Taro.navigateBack({
    delta: 1,
  })
}
//重定向
const redirect = (type) => {
  vdata.current = type
  vdata.answerSheet = false
}
const queryPkOver = () => {
  const { grade, subject } = answerPk.versionInfo
  let params = {
    grade: grade,
    subject: subject,
  }
  vdata.queryOverTimer = setInterval(() => {
    questionAnswerPk('isOver', params).then((res) => {
      // vdata.returnShow = true
      // vdata.showType = 2
      // clearInterval(vdata.queryOverTimer)
      // vdata.queryOverTimer = null
      // vdata.forcedTimer = setInterval(() => {
      //   if (vdata.countTimer == 1) {
      //     forcedSumbit()
      //     return
      //   }
      //   vdata.countTimer--
      // }, 1000)
      //1 对手返回 离开
      //2 对手已经交卷
      if (res == 1) {
        vdata.returnShow = true
        vdata.showType = 3
        clearInterval(vdata.queryOverTimer)
        vdata.queryOverTimer = null
      } else if (res == 2) {
        vdata.returnShow = true
        vdata.showType = 2
        clearInterval(vdata.queryOverTimer)
        vdata.queryOverTimer = null
        vdata.forcedTimer = setInterval(() => {
          if (vdata.countTimer == 1) {
            forcedSumbit()
            return
          }
          vdata.countTimer--
        }, 1000)
      }
    })
  }, 1000)
}
// //音频
// let innerAudioContext: any = null
// const createBgAudio = () => {
//   innerAudioContext = Taro.createInnerAudioContext()
//   innerAudioContext.src =
//     'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/b536ce0985cd499ca366e676bbc35aca/bfbg.mp3'
//   innerAudioContext.play() // 播放
//   innerAudioContext.onEnded(() => {
//     resetAudio()
//     createBgAudio()
//   })
// }
// const resetAudio = () => {
//   if (innerAudioContext) {
//     innerAudioContext.destroy()
//     innerAudioContext = null
//   }
// }
// useDidShow(() => {
//   if (answerPk.music) {
//     createBgAudio()
//   }
// })
onBeforeUnmount(() => {
  // resetAudio()
})
useDidHide(() => {
  // resetAudio()
  if (vdata.isError) {
    overPk(0, false, 1)
  }
})
// onUnmounted(() => {
//   if (vdata.isError) {
//     overPk(0, false, 1)
//   }
// })
onMounted(() => {
  vdata.questionList = answerPk?.questionInfo?.questionList || []
  queryPkOver()
  begin()
  // vdata.isShow = true
})
</script>
<style lang="scss">
.answerMain {
  height: 100vh;
  position: relative;
  box-sizing: border-box;
  background: #6289ff;
  .scroll-content {
    padding-bottom: 10px;
    .topInfo {
      display: flex;
      justify-content: space-between;
      padding-right: 20px;
      padding-top: 25px;
      align-items: center;
      color: #ffffff;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      .current {
        font-size: 20px;
        font-weight: 600;
        margin: 3px;
      }
      .leftInfo {
        width: 90px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 0 20px 20px 0;
      }
      .rightInfo {
        display: flex;
        align-items: center;
        align-items: center;
        image {
          width: 12px;
          height: 12px;
          margin-right: 5px;
        }
      }
    }
    .questionMain {
      padding: 20px 0;
      background: #fff;
      margin: 30px 16px 0;
      border-radius: 12px;
      .questionTop {
        min-height: 134px;
        position: relative;
        padding: 27px;
        box-sizing: border-box;
        margin-bottom: 30px;
        .topLeft {
          position: absolute;
          left: 10px;
          top: 0;
        }
        .topRight {
          position: absolute;
          right: 10px;
          top: 0;
        }
        .bottomLeft {
          position: absolute;
          left: 10px;
          bottom: 0;
        }
        .bottomRight {
          position: absolute;
          right: 10px;
          bottom: 0;
        }
        image {
          width: 10px;
          height: 67px;
        }
      }
      .questionItem {
        margin: 18px;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/770e9c6d9dcf471daf0989fc399abaf0/xzbg.png')
          no-repeat center;
        background-size: 100% 100%;
        padding: 13px;
        display: flex;
        align-items: center;
        .answer-word {
          width: 45px;
          height: 25px;
          text-align: center;
          line-height: 25px;
          border-right: 1px solid #e8e8e8;
          flex-shrink: 0;
          font-size: 16px;
          color: #333333;
        }
        .answer-item-choose {
          flex: 1;
          // background: #fff;
          padding-left: 20px;
          box-sizing: border-box;
        }
      }
      .questionItemSelect {
        color: #2f5de7;
        background-image: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/c9bf8225eb014b429856fc8042c767c6/select.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        .answer-word {
          color: #2f5de7;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    height: 93px;
    background: #fff;
    box-sizing: border-box;
    padding: 15px 15px 0 22px;
    display: flex;
    justify-content: space-between;

    .leftDtk {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-family: PingFangSC-Regular;
      font-size: 9px;
      color: #666666;
      height: 44px;
      image {
        width: 22px;
        height: 20px;
        margin-bottom: 4px;
      }
    }
    .btnNext {
      border-radius: 25px;
      opacity: 1;
      height: 44px;
      line-height: 44px;
      background: #2f5de7;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      text-align: center;
      color: #ffffff;
      width: 297px;
    }
  }
  .directory {
    // padding: 0 0 10px;
    padding-bottom: 34px;
    .topTitInfo {
      height: 56px;
      position: relative;
      border: 1px solid #ecf0f6;
      .directoryTitle {
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        font-weight: 500;
        color: #06080d;
        font-weight: 700;
        line-height: 56px;
      }
      image {
        position: absolute;
        top: 17px;
        right: 16px;
        width: 24px;
        height: 24px;
      }
    }
    .answerText {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0 15px;
      .answerLeft,
      .answerRight {
        margin: 0 25px;
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #333333;
        .bg {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2f5de7;
          margin-right: 3px;
        }
        .bgs {
          background: #d0d0d0;
        }
      }
    }
    .directoryList {
      display: flex;
      flex-wrap: wrap;
      padding: 0 20px;
      .directoryItem {
        height: 40px;
        opacity: 1;
        width: 40px;
        background: #d0d0d0;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #ffffff;
        margin-right: 33px;
        margin-bottom: 15px;
      }
      .directoryItem:nth-child(5n) {
        margin-right: 0;
      }
      .selectDirectoryItem {
        background: #2f5de7;
      }
    }
    .submit {
      margin: 30px 15px 0;
      height: 44px;
      border-radius: 25px;
      background: #2f5de7;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #ffffff;
      text-align: center;
      line-height: 44px;
    }
  }

  .center {
    text-align: center !important;
  }
  .right {
    text-align: right !important;
  }
  .text-indent {
    text-indent: 28px;
  }
  .blank {
    display: inline-block;
    width: 0.5em;
  }
  .cloze,
  .fill,
  .longFill {
    display: inline-block;
    min-width: 2.5em;
    height: 1em;
    text-align: center;
    line-height: 1em;
    padding: 0 0.5em;
    border-bottom: 1px solid #333;
    vertical-align: bottom;
  }
  .longFill {
    min-width: 15em;
  }
  // .fill {
  //   border: 1px solid #333;
  //   height: 1.5em;
  //   line-height: 1.5em;
  //   /*margin: 0 0.5em;*/
  //   vertical-align: middle;
  // }
  .brack,
  .tab {
    display: inline-block;
    min-width: 2em;
    text-align: center;
  }
  .underline {
    text-decoration: underline;
  }

  .wave {
    /*display: inline-block;*/
    padding-bottom: 8px;
    background: url(./edit/wave.png) repeat-x center bottom;
    word-break: break-word;
  }
  .point2 {
    /*display: inline-block;*/
    padding-bottom: 4px;
    background: url(./edit/point.png) repeat-x center bottom;
    word-break: break-word;
  }

  .cp-ensigna {
    padding-bottom: 16px;
    position: relative;
    word-break: break-word;
  }
  .cp-ensignb {
    padding-bottom: 16px;
    position: relative;
    word-break: break-word;
  }

  .cp-ensignc {
    padding-bottom: 16px;
    position: relative;
    word-break: break-word;
  }

  .cp-ensignd {
    padding-bottom: 16px;
    position: relative;
    word-break: break-word;
  }

  .cp-ensigna::after,
  .cp-ensignb::after,
  .cp-ensignc::after,
  .cp-ensignd::after {
    content: ' ';
    width: 20px;
    height: 20px;
    position: absolute;
    top: 12px;
    left: 50%;
    margin-left: -10px;
  }
  .cp-ensigna::after {
    background: url('./edit/cp-ensigna.png') no-repeat center bottom;
  }
  .cp-ensignb::after {
    background: url('./edit/cp-ensignb.png') no-repeat center bottom;
  }

  .cp-ensignc::after {
    background: url('./edit/cp-ensignc.png') no-repeat center bottom;
  }

  .cp-ensignd::after {
    background: url('./edit/cp-ensignd.png') no-repeat center bottom;
  }
  .cpk-circlefill {
    display: inline-block;
    min-width: 35px;
    text-align: center;
    vertical-align: bottom;
    border: 1px solid #333;
    height: 35px;
    line-height: 35px;
    vertical-align: middle;
    border-radius: 18px;
  }
  .cpk-squarefill {
    display: inline-block;
    min-width: 35px;
    text-align: center;
    vertical-align: bottom;
    border: 1px solid #333;
    height: 35px;
    line-height: 35px;
    vertical-align: middle;
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
    padding: 24px;
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
        width: 110px;
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
      .handleWidth {
        width: 236px;
        border-radius: 24.5px;
        background: #2f5de7;
        color: #ffffff;
      }
    }
  }
}
</style>
