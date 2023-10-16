<template>
  <view class="reportAnswerMain" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="练习报告"></NavBar>
    <view class="topInfo">
      <view class="topTitle">{{ intelligentQuestion.uniTitle }}</view>
      <view class="progressInfo">
        <nut-circleprogress
          class="progress"
          :progress="getRain"
          radius="65"
          :color="vdata.gradientColor"
          strokeWidth="10"
        >
        </nut-circleprogress>
        <view class="accuracy">
          <view>{{ getRain }}%</view>
          <view class="accuracyText">正确率</view>
        </view>
      </view>
      <view class="answerQuestion">
        <view class="leftInfo">
          <view>{{ vdata.rightTotal }}/{{ intelligentQuestion?.answerInfo?.total }}</view>
          <view class="text">正确题数</view>
        </view>
        <view class="rightInfo">
          <view
            >{{ intelligentQuestion?.answerInfo?.divide }}:{{
              intelligentQuestion?.answerInfo?.second
            }}</view
          >
          <view class="text">用时</view>
        </view>
      </view>
    </view>
    <view class="answer">
      <view class="answerTitle">
        <view>答题卡</view>
        <view class="ts">错题已自动加入错题本</view>
        <view></view>
      </view>
      <view class="questionInfo">
        <view class="questionTextInfo">
          <view v-for="(item, i) in vdata.answerList" :key="i" class="questionTextInfoItem">
            <image :src="item.icon" mode="scaleToFill" />
            <text>{{ item.label }}</text>
          </view>
        </view>
        <view class="totalInfo"
          >共{{ intelligentQuestion?.answerInfo?.answerList.length }}题{{
            intelligentQuestion?.answerInfo?.total
          }}道小题</view
        >
      </view>
      <view class="questionNumberList">
        <view
          v-for="(item, i) in intelligentQuestion?.answerInfo?.answerList"
          :key="i"
          :class="[
            'numberItem',
            handleStyle(item) === 3 && 'bgNumberItem',
            handleStyle(item) === 2 && 'errorNumberItem',
          ]"
          @tap="toAnswer(i)"
        >
          <view>{{ i + 1 }}</view>
        </view>
      </view>

      <view class="operation">
        <view class="leftBtn" @tap="lookAnalysis">查看解析</view>
        <view class="rightBtn" @tap="continueQuestion">继续练习</view>
      </view>
    </view>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'

import NavBar from '@/components/NavBar.vue'
import { useSystem, useIntelligentQuestion, useUser } from '@/stores'
import { debounce } from '@/utils'
import { getTryCount } from '@/api/index'
import MemberToast from '@/components/memberToast.vue'
import { reactive, ref, computed } from 'vue'
const memberToast = ref()
const system = useSystem()
const user = useUser()
const intelligentQuestion = useIntelligentQuestion()
const { navBarHeight } = system.navBarInfo
const vdata = reactive({
  progress: 10,
  gradientColor: {
    '0%': '#3162e8',
    '100%': '#4aa0fc',
  },
  answerList: [
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
  rightTotal: 0,
  memberShow: false,
})
const lookAnalysis = () => {
  Taro.navigateTo({
    url: '../reportAnalysis/index',
  })
}
const toAnswer = (i) => {
  Taro.navigateTo({
    url: `../reportAnalysis/index?current=${i}`,
  })
}
const continueQuestion = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '智能刷题', funCourseName: null })
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
  Taro.redirectTo({
    url: '../index/index?type=2',
  })
}
const toMember = () => {
  vdata.memberShow = false
  Taro.navigateTo({
    url: '/phaseOne/pages/memberPurchase/index',
  })
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

const getRain = computed(() => {
  let rain = Math.round((vdata.rightTotal / intelligentQuestion?.answerInfo?.total) * 100) || 0
  return rain
})
useDidShow(() => {
  if (intelligentQuestion?.answerInfo?.answerList.length) {
    let rightList = []
    intelligentQuestion.answerInfo.answerList.forEach((item) => {
      item.submitResult.forEach((vtem) => {
        if (vtem.result === 1) {
          rightList.push(vtem)
        }
      })
    })
    vdata.rightTotal = rightList.length
  }
})
</script>
<style lang="scss">
.reportAnswerMain {
  background: #f0f8ff;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .topInfo {
    text-align: center;
    margin-bottom: 20px;

    .topTitle {
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      font-weight: 600;
      color: #333333;
    }
    .progressInfo {
      text-align: center;
      position: relative;
      height: 130px;
      margin: 16px 0;
      .progress {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .nut-circleprogress-text {
          display: none;
        }
      }
      .accuracy {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-family: PingFangSC-Semibold;
        font-size: 28px;
        color: #2f5de7;
        top: 35px;
        .accuracyText {
          font-size: 12px;
          color: #666666;
          font-family: PingFangSC-Regular;
        }
      }
    }
    .answerQuestion {
      display: flex;
      align-items: center;
      .leftInfo,
      .rightInfo {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: PingFangSC-Semibold;
        font-size: 18px;
        color: #333333;
        font-weight: 600;
        .text {
          font-size: 12px;
          color: #666666;
          font-weight: normal;
          margin-top: 3px;
          font-family: PingFangSC-Regular;
        }
      }
    }
  }
  .answer {
    background: #fff;
    flex: 1;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    padding: 20px 16px 0;
    .answerTitle {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      .ts {
        font-weight: normal;
        padding: 0 8px;
        height: 20px;
        background: rgba(47, 93, 231, 0.1);
        border-radius: 12px;
        margin-left: 4px;
        font-family: PingFangSC-Regular;
        font-size: 11px;
        color: #2f5de7;
        line-height: 20px;
      }
    }
    .questionInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0 25px;
      image {
        width: 6px;
        height: 6px;
      }
      .questionTextInfo {
        display: flex;
        .questionTextInfoItem {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #666666;
          display: flex;
          align-items: center;
          margin-right: 22px;
          image {
            margin-right: 5px;
          }
        }
      }
      .totalInfo {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
      }
    }
    .questionNumberList {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      .numberItem {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #ffffff;
        background: #7edc7e;
      }
      .bgNumberItem {
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/c335cbce25694874871c89973c088ed0/bd.png')
          no-repeat center;
        background-size: 100% 100%;
      }
      .errorNumberItem {
        background: #ff8578;
      }
    }
    .operation {
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      view {
        width: 152px;
        height: 44px;
        border-radius: 25px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        line-height: 44px;
        text-align: center;
        background: #2f5de7;
        font-family: PingFangSC-Medium;
        color: #ffffff;
      }
      .leftBtn {
        border: 1px solid #0c61ff;
        line-height: 42px;
        background: #fff;
        box-sizing: border-box;
        color: #2f5de7;
      }
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
