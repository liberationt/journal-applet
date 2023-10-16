<template>
  <view class="questionMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar :fixedStyle="vdata.fixedStyle">
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
            <view class="rightInfo" @tap="addWrong(item, i)" v-if="vdata.questionRightList[i]">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/adc2b0a17bd640c58b9ee7527e32c99c/ctb.png"
              />
              <text>加入错题本</text>
            </view>
            <view class="rightInfo" @tap="removeWrong(item, i)" v-else>
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/adc2b0a17bd640c58b9ee7527e32c99c/ctb.png"
              />
              <text>移除错题本</text>
            </view>
          </view>
          <view>
            <question-item-analysis :ques="item" :showExplain="true"></question-item-analysis>
          </view>
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
          vdata.current === vdata.questionInfoList.length - 1 ? '继续练习' : '下一题'
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
                v-for="(item, i) in intelligentQuestion?.answerInfo?.answerList"
                :key="i"
                :class="[
                  'answerInfoSheetItem',
                  handleStyle(item) === 2 && 'wzd',
                  handleStyle(item) === 3 && 'wdw',
                ]"
                @tap="chooseCurrent(i)"
                >{{ i + 1 }}</view
              >
            </view>
          </view>
        </view>
      </nut-overlay>
      <nut-overlay v-model:visible="vdata.memberShow" :close-on-click-overlay="false">
        <view class="memberMain">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/d9c0a4e7a65a47319462301fa3df5d6d/icon.png"
            mode="scaleToFill"
            class="closeImg"
            @tap="vdata.memberShow = false"
          />
          <image
            class="qy"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/e0fddd2f62dc432284d3824e1d56dfd2/qy.png"
            mode="scaleToFill"
          />
          <image
            class="qy"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/76d596eaa2674f25b3e7a51debc4bb93/yq1.png"
            mode="scaleToFill"
          />

          <view class="operate">
            <view class="toMember" @tap="toMember">开通教育周报会员</view>
          </view>
        </view>
      </nut-overlay>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, useIntelligentQuestion, useUser } from '@/stores'
import QuestionItemAnalysis from '@/components/QuestionItemAnalysis/QuestionItem.vue'
import { addWrongInfo } from '@/api/intelligentQuestion'
import { removeWrobook } from '@/api/wrongbook'

const system = useSystem()
const user = useUser()
const router = useRouter()
const intelligentQuestion = useIntelligentQuestion()
const { navBarHeight } = system.navBarInfo
import { reactive } from 'vue'

const vdata: any = reactive({
  fixedStyle: {
    background: '#e2e9fa',
  },
  current: 0,
  divide: 0,
  second: 0,
  isLast: 0,
  progress: 0,
  answerSheet: false,
  questionInfoList: [],
  isReturn: false,
  allAnswer: false,
  showLoading: true,
  memberShow: false,
  answerInfoTextList: [
    {
      label: '正确',
      icon: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/deea55b5cc3f4cc78e1af317281395e4/d.png',
    },
    {
      label: '部分正确',
      icon: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/c335cbce25694874871c89973c088ed0/bd.png',
    },
    {
      label: '错误',
      icon: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/99b764aa6e6046deb6f08e9719afbc60/c.png',
    },
  ],
  questionRightList: [],
})
const changeCurrent = (val) => {
  const { current } = val.detail
  vdata.isLast = current
  vdata.current = current
}
const animationChange = (val) => {
  // if (vdata.isLast === vdata.questionInfoList.length - 1) {
  //   vdata.isLast += 1
  // } else if (vdata.isLast > vdata.questionInfoList.length - 1) {
  //   vdata.answerSheet = true
  // }
}
const handleStyle = (item) => {
  let flag = 0
  if (item.submitResult.every((ele) => ele.result === 1)) {
    flag = 1
  } else if (item.submitResult.every((ele) => ele.result === 0)) {
    flag = 2
  } else {
    flag = 3
  }
  return flag
}
const getRight = (i) => {
  let flag = false
  if (
    intelligentQuestion?.answerInfo?.answerList[i].submitResult.every((ele) => ele.result === 1)
  ) {
    return (flag = true)
  }
  return flag
}
const addWrong = (item, i) => {
  let params = {
    id: item.questionCode,
    bookOriginType: '4',
    subject: intelligentQuestion.saveInfo?.subject,
    grade: intelligentQuestion.saveInfo?.grade,
    term: intelligentQuestion.saveInfo?.term,
  }
  addWrongInfo(params).then((res) => {
    Taro.showToast({
      title: '已加入错题本',
      icon: 'none',
      duration: 2000,
    })
    vdata.questionRightList[i] = !vdata.questionRightList[i]
  })
}
const removeWrong = (item, i) => {
  let params = {
    exerciseBookIds: [item.questionCode],
  }
  removeWrobook(params).then((res) => {
    setTimeout(() => {
      Taro.showToast({
        title: '移除成功',
        icon: 'none',
        duration: 2000,
      })
    }, 100)
    vdata.questionRightList[i] = !vdata.questionRightList[i]
  })
}
// 未答完提交
const submitAnswer = () => {
  Taro.redirectTo({
    url: '../reportAnswer/index',
  })
}
const chooseCurrent = (i) => {
  vdata.current = i
  vdata.answerSheet = false
}
//下一题获或提交
const nextBtn = () => {
  if (vdata.current < vdata.questionInfoList.length - 1) {
    vdata.current += 1
  } else {
    if (!user.vip) {
      vdata.memberShow = true
    } else {
      Taro.redirectTo({
        url: '../index/index?type=3',
      })
    }
  }
}
const toMember = () => {
  vdata.memberShow = false
  Taro.navigateTo({
    url: '/phaseOne/pages/memberPurchase/index',
  })
}
//提交
const submit = () => {
  vdata.allAnswer = true
}
//显示答题卡
const showAnswerSheet = () => {
  vdata.answerSheet = true
}
useDidShow(() => {
  if (router.params.current) {
    vdata.current = Number(router.params.current)
  }
  vdata.questionInfoList = intelligentQuestion?.answerInfo?.questionList

  intelligentQuestion?.answerInfo?.answerList.forEach((item: any) => {
    vdata.questionRightList.push(item.submitResult.every((ele) => ele.result === 1))
  })
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
      .handAnswer {
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
            image {
              width: 20px;
              height: 20px;
            }
          }
          .answer-item-choose {
            flex: 1;
            padding-left: 20px;
            box-sizing: border-box;
          }
        }
        .answer-item-select {
          background: rgba(172, 222, 172, 0.12);
          box-sizing: border-box;
          border: 1px solid #6cd06c;
          .answer-word {
            color: #6cd06c;
          }
        }
        .answer-item-error {
          background: rgba(255, 117, 117, 0.06);
          box-sizing: border-box;
          border: 1px solid #ffbcb5;
        }
        // .handAnswer {
        //   margin: 30px 0;
        //   .noAnswer,
        //   .yesAnswer {
        //     display: flex;
        //     align-items: flex-end;
        //     justify-content: space-between;
        //   }
        //   .noAnswerImg {
        //     width: 155px;
        //     height: 82px;
        //   }
        //   .yesRightImg {
        //     width: 155px;
        //     height: 110px;
        //   }
        // }
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
          background: #7edc7e;
          text-align: center;
          line-height: 40px;
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #ffffff;
        }
        .wzd {
          background: #ff8578;
        }
        .wdw {
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/c335cbce25694874871c89973c088ed0/bd.png')
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
    .progress {
      margin: 20px 0 30px;
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
  .memberMain {
    position: absolute;
    left: 50%;
    top: 50%;
    padding-top: 100px;
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    width: 342px;
    height: 356px;
    text-align: center;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/320c432205d6469d9216b633c486f465/mb.png')
      no-repeat center;
    background-size: 100% 100%;
    .closeImg {
      width: 18px;
      height: 18px;
      position: absolute;
      right: 0;
      top: -22px;
    }
    .qy {
      width: 226px;
      height: 72px;
      margin-bottom: 16px;
    }
    .operate {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 20px;
      view {
        height: 44px;
        text-align: center;
        border-radius: 30px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
      }
      .toMember {
        background: linear-gradient(90deg, #ff6b00 -1%, #ff3429 100%);
        width: 100%;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #ffffff;
        line-height: 44px;
      }
    }
  }
}
</style>
