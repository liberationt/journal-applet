<template>
  <view class="questionMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <view>
      <NavBar :fixedStyle="vdata.fixedStyle" :onClickBack="returnClose">
        <template #center>
          <view class="centerInfo">
            <text class="current">0{{ vdata.current + 1 }}</text>
            <text class="allCurrent">/0{{ vdata.questionInfoList.length }}</text>
          </view>
        </template>
      </NavBar>
      <view>
        <swiper
          :style="{ height: `calc(100vh - ${navBarHeight + 93}px)` }"
          class="swiperInfo"
          indicator-color="#999"
          indicator-active-color="#333"
          :circular="false"
          :indicator-dots="false"
          :current="vdata.current"
          @change="changeCurrent"
          @animationfinish="animationChange"
        >
          <swiper-item v-for="(item, i) in vdata.questionInfoList" class="list-item" :key="i">
            <view class="timer">
              <view class="questionType">{{ item.quesType.name }}</view>
              <view class="rightInfo">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/f3a4ec8f9c674add8d102c6a8838eec8/shijianjishi.png"
                  mode="scaleToFill"
                />
                <text
                  >{{ vdata.divide ? vdata.divide : '00' }}:{{
                    vdata.second ? vdata.second : '00'
                  }}</text
                >
              </view>
            </view>
            <!-- <view class="questionTic">aaaa</view>
            <view class="answerList">
              <view
                v-for="(vtem, key) in 4"
                :key="vtem"
                :class="['answer-item', key == 0 && 'answer-item-select']"
              >
                <view class="answer-word">{{ handleEng(key + 1) }}</view>
                <view class="answer-item-choose">111</view>
              </view>
            </view> -->
            <view>
              <question-item-info :ques="item" :showExplain="item.showExplain"></question-item-info>
            </view>
            <!-- <template v-if="item.quesType.name != '单选题'">
              <template v-if="!item.isAnswer">
                <view class="computed">本题需在纸上答题，做完核对答案</view>
                <view class="computedBtn" @tap="changeAnswer(item)">已做完，核对答案</view>
              </template>
              <template v-else>
                <view class="handAnswer">
                  <view v-if="item.isRightAnswer === null" class="noAnswer">
                    <image
                      @tap="chooseAnswer(item, true)"
                      class="noAnswerImg"
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/368657d7bd5b474cb05e16ae5e4bd3b2/noRight.png"
                      mode="scaleToFill"
                    />
                    <image
                      @tap="chooseAnswer(item, false)"
                      class="noAnswerImg"
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/2f6a42d431bc4170a70585ab695e9a6f/noError.png"
                      mode="scaleToFill"
                    />
                  </view>
                  <view v-else class="yesAnswer">
                    <template v-if="item.isRightAnswer">
                      <image
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/190c39844c8e43368db055962702fc06/yesRight.png"
                        mode="scaleToFill"
                        class="yesRightImg"
                      />
                      <image
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/2f6a42d431bc4170a70585ab695e9a6f/noError.png"
                        mode="scaleToFill"
                        class="noAnswerImg"
                      />
                    </template>

                    <template v-else>
                      <image
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/368657d7bd5b474cb05e16ae5e4bd3b2/noRight.png"
                        mode="scaleToFill"
                        class="noAnswerImg"
                      />
                      <image
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/387a1a0f3a354ea3b5c848706fda0616/yewError.png"
                        mode="scaleToFill"
                        class="yesRightImg"
                      />
                    </template>
                  </view>
                </view>
              </template>
            </template> -->
          </swiper-item>
        </swiper>
        <view class="footerOpera">
          <view class="answerTk" @tap="showAnswerSheet">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/c5c6da6fc3224d418b527403b5028392/datiqia.png"
              mode="scaleToFill"
            />
            <text>答题卡</text>
          </view>
          <view class="nextBtn" @tap="nextBtn">{{
            vdata.current === vdata.questionInfoList.length - 1 ? '提交' : '下一题'
          }}</view>
        </view>
      </view>
      <view>
        <nut-overlay v-model:visible="vdata.answerSheet" :close-on-click-overlay="false">
          <view class="answerSheet">
            <view class="answerSheetTop">
              <text>答题卡</text>
              <image
                @tap="vdata.answerSheet = false"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/5df34e53e0a64a48a1805a233cef76bb/icon1.png"
                mode="scaleToFill"
              />
            </view>
            <view class="answerSheetCon">
              <view class="infoText">
                <view v-for="(item, i) in vdata.answerInfoTextList" :key="i" class="infoTextItem">
                  <image :src="item.icon" mode="scaleToFill" />
                  <text>{{ item.label }}</text>
                </view>
              </view>
              <view class="answerInfoSheet">
                <view
                  v-for="(item, i) in vdata.questionInfoList"
                  :key="i"
                  :class="[
                    'answerInfoSheetItem',
                    handelItem(item) === 2 && 'wzd',
                    handelItem(item) == 3 && 'wdw',
                  ]"
                  @tap="chooseSheet(i)"
                  >{{ i + 1 }}</view
                >
              </view>
              <view class="submit" @tap="submit"> 提交</view>
            </view>
          </view>
        </nut-overlay>
      </view>
      <view>
        <nut-overlay v-model:visible="vdata.allAnswer" :close-on-click-overlay="false">
          <view class="allAnAnswerInfo">
            <view>你还有题目未完成，确认提交？</view>
            <view class="allAnswerBtn">
              <view class="allSubmit" @tap="submitAnswer">仍要提交</view>
              <view class="allCommit" @tap="commitAnswer">继续做题</view>
            </view>
          </view>
        </nut-overlay>
      </view>
    </view>
    <view class="isLoadMain" v-if="vdata.showLoading">
      <view class="isLoadMainText">智能选题中…</view>
      <view class="progress">{{ vdata.progress }}%</view>
      <view class="loadImg">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/4ec4143aab394f58b147503edede698c/st.gif"
        />
      </view>
    </view>
    <view class="returnMain" v-if="vdata.isReturn">
      <image
        class="returnBg"
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/106d294aaabc4fb889432994f6fcc2f9/st.png"
        mode="scaleToFill"
      />
      <view class="good"> 很棒！你已经完成了{{ vdata.schedule }}% </view>
      <view class="commit">要不要继续练习呢？</view>
      <view class="againLook" @tap="vdata.isReturn = false">那再看看吧～</view>
      <view class="configReturn" @tap="configReturn">我真的要走啦</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { questionInfo } from '@/api/intelligentQuestion'
import NavBar from '@/components/NavBar.vue'
import { useSystem, useIntelligentQuestion } from '@/stores'
// import QuestionItem from "@/components/QuestionItem/QuestionCell.vue"
import QuestionItemInfo from '@/components/QuestionItemInfo/QuestionItem.vue'
const system = useSystem()
const router = useRouter()
const intelligentQuestion = useIntelligentQuestion()
const { navBarHeight } = system.navBarInfo
import { onMounted, reactive, onUnmounted, nextTick } from 'vue'

const vdata: any = reactive({
  fixedStyle: {
    background: '#e2e9fa',
  },
  chapterCode: '',
  current: 0,
  divide: 0,
  second: 0,
  isLast: 0,
  progress: 0,
  schedule: 0,
  answerSheet: false,
  isReturn: false,
  allAnswer: false,
  showLoading: true,
  questionInfoList: [],
  isLoading: true,
  answerInfoTextList: [
    {
      label: '已作答',
      icon: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/6eb02b43a515478eb40ab24fd0dec3ef/yzd.png',
    },
    {
      label: '未答完',
      icon: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/169b8b3ed10844378682c9ee18e9d850/wdw.png',
    },
    {
      label: '未作答',
      icon: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/dbf30300e5714189a390dac4e02350f3/wzd.png',
    },
  ],
  timer: null,
  allQuestionList: [],
})
const changeAnswer = (item) => {
  item.isAnswer = true
  item.showExplain = true
}
const chooseAnswer = (item, val) => {
  item.isRightAnswer = val
}
const handelItem = (item) => {
  let flag = 0
  if (!item.children.length) {
    if (item.isRightAnswer !== null || item.answerList.length) {
      flag = 1
    } else {
      flag = 2
    }
  } else {
    if (item.children.every((ele) => ele.isRightAnswer === null && !ele.answerList.length)) {
      flag = 2
    } else if (
      item.children.every(
        (ele) => ele.isRightAnswer !== null || (ele.isRightAnswer === null && ele.answerList.length)
      )
    ) {
      flag = 1
    } else {
      flag = 3
    }
  }
  return flag
}
const chooseSheet = (i) => {
  vdata.current = i
  vdata.answerSheet = false
}
//返回
const returnClose = () => {
  let alreadyNum = alreadyLate()
  if (alreadyNum) {
    let countNumber = calculate()
    vdata.schedule = Math.round((alreadyNum / countNumber) * 100)
    vdata.isReturn = true
  } else {
    Taro.navigateBack({ delta: 1 })
  }
}
//确认返回
const configReturn = () => {
  Taro.navigateBack({ delta: 1 })
}
//1234-ABCD
const handleEng = (val) => {
  return String.fromCharCode(64 + parseInt(val))
}
const changeCurrent = (val) => {
  const { current } = val.detail
  vdata.isLast = current
  vdata.current = current
}
const animationChange = (val) => {
  if (vdata.isLast === vdata.questionInfoList.length - 1) {
    vdata.isLast += 1
  } else if (vdata.isLast > vdata.questionInfoList.length - 1) {
    vdata.answerSheet = true
  }
}
//提交结果
const submitAnswerDetail = () => {
  clearInterval(vdata.timer)
  vdata.timer = null
  let arrList = []
  vdata.questionInfoList.forEach((item) => {
    if (!item.children.length) {
      let objectInfo: any = {
        questionId: item.questionCode,
        submitResult: [
          {
            questionCode: item.questionId,
            result: 1,
          },
        ],
      }
      if (!item.answerList.length) {
        if (item.isRightAnswer) {
          arrList.push(objectInfo)
        } else {
          objectInfo.submitResult[0].result = 0
          arrList.push(objectInfo)
        }
      } else {
        let answerString = item.answerList.join('')
        let answerDetail = item.explain[0].answers.join('')
        if (answerString.indexOf(answerDetail) != -1) {
          arrList.push(objectInfo)
        } else {
          objectInfo.submitResult[0].result = 0
          arrList.push(objectInfo)
        }
      }
    } else {
      let submitResult = []
      item.children.forEach((vtem) => {
        if (!vtem.answerList.length) {
          if (vtem.isRightAnswer) {
            submitResult.push({
              questionId: vtem.questionId,
              result: 1,
            })
          } else {
            submitResult.push({
              questionId: vtem.questionId,
              result: 0,
            })
          }
        } else {
          let answerString = vtem.answerList.join('')
          let answerDetail = vtem.explain[0].answers.join('')
          if (answerString.indexOf(answerDetail) != -1) {
            submitResult.push({
              questionId: vtem.questionId,
              result: 1,
            })
          } else {
            submitResult.push({
              questionId: vtem.questionId,
              result: 0,
            })
          }
        }
      })
      arrList.push({
        questionId: item.questionCode,
        submitResult: submitResult,
      })
    }
  })
  let params = {
    submitQuestionDTOList: arrList,
    submitType: 1,
    subject: intelligentQuestion.saveInfo?.subject,
    grade: intelligentQuestion.saveInfo?.grade,
    term: intelligentQuestion.saveInfo?.term,
  }
  questionInfo('submitResult', params).then((res) => {
    let answerInfo = {
      answerList: arrList,
      divide: vdata.divide,
      second: vdata.second,
      total: calculate(),
      questionList: vdata.questionInfoList,
    }
    intelligentQuestion.setAnswerInfo(answerInfo)
    Taro.redirectTo({
      url: '../reportAnswer/index',
    })
  })
}
//计算条数
const calculate = () => {
  let countList = []
  vdata.questionInfoList.forEach((item) => {
    if (!item.children.length) {
      countList.push(1)
    } else {
      item.children.forEach((vtem) => {
        countList.push(1)
      })
    }
  })
  return countList.length
}
//计算做题数目
const alreadyLate = () => {
  let countList = []
  vdata.questionInfoList.forEach((item) => {
    if (!item.children.length) {
      if (item.isRightAnswer !== null || item.answerList.length) {
        countList.push(1)
      }
    } else {
      item.children.forEach((vtem) => {
        if (vtem.isRightAnswer !== null || vtem.answerList.length) {
          countList.push(1)
        }
      })
    }
  })
  return countList.length
}
// 未答完提交
const submitAnswer = () => {
  submitAnswerDetail()
  // Taro.redirectTo({
  //   url: '../reportAnswer/index',
  // })
}
//下一题获或提交
const nextBtn = () => {
  if (vdata.current < vdata.questionInfoList.length - 1) {
    vdata.current += 1
  } else {
    if (isCheckQuestion()) {
      submitAnswerDetail()
    } else {
      vdata.allAnswer = true
    }
  }
}
//检查是否做完
const isCheckQuestion = () => {
  let flag = true
  vdata.questionInfoList.forEach((item) => {
    if (item.children.length) {
      item.children.forEach((vtem) => {
        if (vtem.isRightAnswer === null && !vtem.answerList.length) {
          flag = false
        }
      })
    } else {
      if (item.isRightAnswer === null && !item.answerList.length) {
        flag = false
      }
    }
  })
  return flag
}
//提交
const submit = () => {
  if (isCheckQuestion()) {
    submitAnswerDetail()
  } else {
    vdata.allAnswer = true
  }
}
const commitAnswer = () => {
  vdata.allAnswer = false
  vdata.answerSheet = true
}
//显示答题卡
const showAnswerSheet = () => {
  vdata.answerSheet = true
}
//加载进度条
const isLoading = () => {
  let timer = setInterval(() => {
    if (vdata.progress < 98) {
      vdata.progress = vdata.isLoading ? vdata.progress + 1 : Math.min(100, vdata.progress + 9)
    } else {
      if (vdata.allQuestionList && vdata.allQuestionList.length) {
        if (vdata.allQuestionList.length > 5) {
          vdata.questionInfoList = vdata.allQuestionList.slice(0, 5)
        } else {
          vdata.questionInfoList = vdata.allQuestionList
        }
      }
      vdata.progress = 100
      vdata.showLoading = false
      clearInterval(timer)
      timer = null
      vdata.timer = setInterval(setIntervalTimer, 1000)
    }
  }, 200)
}
const setIntervalTimer = () => {
  vdata.second++
  if (vdata.second <= 59) {
    if (vdata.second <= 9) {
      vdata.second = '0' + vdata.second
    }
  } else {
    vdata.second = 0
    vdata.divide++
    if (vdata.divide <= 59) {
      if (vdata.divide <= 9) {
        vdata.divide = '0' + vdata.divide
      }
    } else {
      clearInterval(vdata.timer)
      vdata.timer = null
    }
  }
}
const questionList = (url, type) => {
  let params: any = null
  if (type == 1) {
    params = {
      chapterCode: vdata.chapterCode,
    }
  } else {
    const { gradeCode, periodCode, subjectCode, termCode, versionCode } =
      intelligentQuestion.searchOra
    params = {
      gradeCode,
      periodCode,
      subjectCode,
      termCode,
      versionCode,
    }
  }
  questionInfo(url, params).then((res: any) => {
    vdata.isLoading = false
    res.forEach((item, i) => {
      let oragin = {
        questionCode: item.questionCode,
        questionId: item.questionId,
        subjectCode: item.subjectCode,
      }
      questionInfo('getQuestionInfo', oragin).then((req: any) => {
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
          // vdata.questionInfoList.push(req.data)
          vdata.allQuestionList.push(req.data)
        }
      })
    })
  })
}
useDidShow(() => {
  isLoading()
})
onUnmounted(() => {
  if (vdata.timer) {
    clearInterval(vdata.timer)
    vdata.timer = null
  }
})
onMounted(() => {
  if (router.params.chapterCode) {
    vdata.chapterCode = router.params.chapterCode
    questionList('pushQuestions', 1)
  } else {
    questionList('pushQuestionsWithSubject', 2)
  }
})
</script>
<style lang="scss">
.questionMain {
  height: 100vh;
  background: #e2e9fa;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  .centerInfo {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    font-weight: 400;
    .current {
      font-size: 20px;
    }
    .allCurrent {
      padding-top: 3px;
    }
  }
  .swiperInfo {
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    background: #fff;
    box-sizing: border-box;
    .list-item {
      padding: 15px;
      box-sizing: border-box;
      height: 100%;
      overflow-y: scroll;
      .timer {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .questionType {
          height: 22px;
          padding: 0 8px;
          font-family: PingFangSC-Semibold;
          font-size: 12px;
          color: #ffffff;
          background: #ffca54;
          border-radius: 4px;
          text-align: center;
          line-height: 22px;
        }
        .rightInfo {
          display: flex;
          align-items: center;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #333333;
          image {
            width: 12px;
            height: 12px;
            margin-right: 5px;
          }
        }
      }
      .questionTic {
        margin: 20px 0;
      }
      .answerList {
        .answer-item {
          padding: 10px 0;
          background: #f2f2f2;
          margin-bottom: 15px;
          border-radius: 6px;
          display: flex;
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
            background: #fff;
            padding-left: 20px;
            box-sizing: border-box;
          }
        }
        .answer-item-select {
          background: #e0eaff;
          .answer-word {
            color: #2f5de7;
          }
        }
      }
      .answerDetail {
        margin-top: 20px;
        .answerText {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #333333;
          margin-bottom: 10px;
          image {
            width: 16px;
            height: 16px;
            margin-right: 8px;
          }
        }
        .richTextInfo {
          font-size: 14px;
          margin-top: 20px;
        }
      }
      .handAnswer {
        // position: fixed;
        // left: 20px;
        // background: red;
        // right: 20px;
        // bottom: 0px;
        margin: 30px 0;
        .noAnswer,
        .yesAnswer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .noAnswerImg {
          width: 155px;
          height: 82px;
        }
        .yesRightImg {
          width: 155px;
          height: 110px;
        }
      }
      .computed {
        text-align: center;
        margin-top: 20px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        font-weight: normal;
        line-height: 25px;
        letter-spacing: 0px;
        color: #999999;
        border-top: 0.5px solid #ecf0f6;
        padding-top: 20px;
      }
      .computedBtn {
        width: 164px;
        height: 36px;
        border-radius: 20px;
        background: #2f5de7;
        text-align: center;
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        font-weight: normal;
        line-height: 36px;
        color: #ffffff;
        margin: 10px auto 20px;
      }
    }
  }
  .footerOpera {
    background: #fff;
    position: fixed;
    bottom: 0;
    height: 100px;
    box-sizing: border-box;
    padding: 15px;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    .answerTk {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 10px;
      color: #666666;
      image {
        width: 22px;
        height: 20px;
        margin-bottom: 4px;
      }
      flex-shrink: 0;
      margin-right: 16px;
    }
    .nextBtn {
      flex: 1;
      height: 44px;
      line-height: 44px;
      text-align: center;
      line-height: 44px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #ffffff;
      border-radius: 25px;
      background: #2f5de7;
    }
  }
  .answerSheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 35px;
    overflow: hidden;
    border-radius: 16px 16px 0 0;
    background: #fff;
    .answerSheetTop {
      height: 56px;
      border-bottom: 1px solid #ecf0f6;
      text-align: center;
      line-height: 56px;
      position: relative;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #06080d;
      image {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .answerSheetCon {
      padding: 20px 15px 0;
      .infoText {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #333333;
        .infoTextItem {
          display: flex;
          align-items: center;
          margin: 0 10px;
          image {
            width: 6px;
            height: 6px;
            margin-right: 4px;
          }
        }
      }
      .answerInfoSheet {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
        .answerInfoSheetItem {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2f5de7;
          text-align: center;
          line-height: 40px;
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #ffffff;
        }
        .wzd {
          background: #d0d0d0;
        }
        .wdw {
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/169b8b3ed10844378682c9ee18e9d850/wdw.png')
            no-repeat center;
          background-size: 100% 100%;
        }
      }
      .submit {
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #ffffff;
        border-radius: 25px;
        background: #2f5de7;
      }
    }
  }
  .allAnAnswerInfo {
    height: 150px;
    background: #fff;
    border-radius: 16px;
    position: absolute;
    left: 47px;
    right: 47px;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    padding: 30px 21px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #333333;
    .allAnswerBtn {
      display: flex;
      margin-top: 30px;
      justify-content: space-between;
      view {
        border-radius: 20px;
        background: #ffffff;
        box-sizing: border-box;
        // border: 1px solid #2f5de7;
        box-sizing: border-box;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        text-align: center;
        color: #2f5de7;
        height: 40px;
        box-sizing: border-box;
        width: 112px;
      }
      .allSubmit {
        box-sizing: border-box;
        border: 1px solid #2f5de7;
        line-height: 38px;
      }
      .allCommit {
        background: #2f5de7;
        color: #f9f9f9;
        line-height: 40px;
      }
    }
  }
  .isLoadMain {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 100%;
    background: #fff;
    z-index: 100;
    box-sizing: border-box;
    padding-top: 140px;
    text-align: center;
    font-family: AlimamaShuHeiTi-Bold;
    font-size: 18px;
    color: #333333;
    .isLoadMainText {
      font-weight: 600;
    }
    .progress {
      margin: 20px 0 30px;
      font-size: 28px;
    }
    .loadImg {
      text-align: center;
      image {
        width: 246px;
        height: 279px;
      }
    }
  }
  .returnMain {
    height: 100vh;
    background-image: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/460e28cdddcb4e62b1752511362a4a48/bdcBg.png');
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100%;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    padding-top: 120px;
    z-index: 100;
    background-color: #fff;
    text-align: center;
    .returnBg {
      width: 271px;
      height: 157px;
    }
    .good,
    .commit {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      line-height: 25px;
      color: #333333;
    }
    .good {
      margin-top: 23px;
    }
    .againLook {
      margin: 40px 34px 20px;
      height: 40px;
      border-radius: 20px;
      background: linear-gradient(0deg, #2f5de7, #2f5de7),
        linear-gradient(270deg, #455dfe 0%, #57a4fe 78%, #5ec1fe 100%);
      line-height: 40px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #ffffff;
    }
    .configReturn {
      margin: 0 34px;
      height: 40px;
      border-radius: 20px;
      box-sizing: border-box;
      border: 0.5px solid #2f5de7;
      line-height: 38px;
      font-size: 16px;
      font-family: PingFangSC-Regular;
      color: #2f5de7;
    }
  }
}
</style>
