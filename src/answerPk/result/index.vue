<template>
  <view class="answerPkMain" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="" :fixedStyle="vdata.fixedStyle" />
    <view class="winOrlose">
      <image
        v-if="vdata.selfScore > vdata.otherScore"
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/5a2d35787e4c4e05b18d728ffe3a090f/win.png"
        mode="scaleToFill"
      />
      <image
        class="loseImg"
        v-else
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/61a6f3ab77dc40b68131c844dc948c81/lose.png"
        mode="scaleToFill"
      />
      <!-- https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/61a6f3ab77dc40b68131c844dc948c81/lose.png -->
      <view v-if="vdata.selfScore > vdata.otherScore">好想告诉全世界你赢了</view>
      <view v-else>生活偶有失败，但终将胜利</view>
    </view>
    <view class="userInfo">
      <view class="userItem">
        <view class="imageInfo">
          <image
            :src="
              answerPk.questionInfo?.currentUserPortraitUrl
                ? answerPk.questionInfo?.currentUserPortraitUrl
                : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/ad4fecc900cf4bfe896d9261c7c8e2b8/defaultImg.png'
            "
            mode="scaleToFill"
          />
          <image
            v-if="vdata.selfScore > vdata.otherScore"
            class="winHg"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/qwzl/52dde779481d48b9a0618706a4e90093/sl.png"
          />
        </view>
        <view class="userGrand">
          <view class="name">{{ answerPk.questionInfo.currentUserName }}</view>
          <view class="grand">
            <text class="fs">{{ vdata.selfScore }}</text>
            <text>分</text>
          </view>
          <view class="timer">
            <text class="timerText">用时：</text>
            <text>{{ answerPk.answerInfo.divide }}:{{ answerPk.answerInfo.second }}</text>
          </view>
        </view>
      </view>
      <view class="userItem userItemRight">
        <view class="userGrand">
          <view class="name">{{ answerPk.questionInfo.matchUserName }}</view>
          <view class="grand">
            <text class="fs">{{ vdata.otherScore }}</text>
            <text>分</text>
          </view>
          <view class="timer">
            <text class="timerText">用时：</text>
            <text>{{ answerPk.answerInfo.divide }}:{{ answerPk.answerInfo.second }}</text>
          </view>
        </view>
        <view class="imageInfo">
          <image
            :src="
              answerPk.questionInfo?.matchUserPortraitUrl
                ? answerPk.questionInfo?.matchUserPortraitUrl
                : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/ad4fecc900cf4bfe896d9261c7c8e2b8/defaultImg.png'
            "
            mode="scaleToFill"
          />
          <image
            v-if="vdata.otherScore > vdata.selfScore"
            class="winHg"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/qwzl/52dde779481d48b9a0618706a4e90093/sl.png"
          />
        </view>
      </view>
    </view>
    <view class="answerSheet">
      <view class="topAnswer">
        <image
          class="leftImg"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/c2825782fda64686b39cb5849918ce51/left.png"
          mode="scaleToFill"
        />
        <image
          class="centerImg"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/3076229959ca438980b44eb51d04843e/answer.png"
          mode="scaleToFill"
        />
        <image
          class="rightImg"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/725748fe90734bf4ab5cdf07f6823e7a/right.png"
          mode="scaleToFill"
        />
      </view>
      <view class="answerList">
        <template :key="i" v-for="(item, i) in answerPk.answerInfo.answerList">
          <view :class="['answerItem', handleStyle(item) && 'errorItem']">
            {{ i + 1 }}
          </view>
        </template>
      </view>
      <view class="analysis" @tap="lookAnasisy">
        <text>查看解析</text>
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/0b63540dce0f4981aff45acf5f980241/arrow.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="footerBtn" @tap="againBegin">再来一局 </view>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, useAnswerPk, useUser } from '@/stores'
import { questionAnswerPk } from '@/api/intelligentQuestion'

import { debounce } from '@/utils'
import { getTryCount } from '@/api/index'
import MemberToast from '@/components/memberToast.vue'
import { reactive, onMounted, onUnmounted, ref } from 'vue'
const memberToast = ref()
const user = useUser()
const answerPk = useAnswerPk()
const system = useSystem()
const { navBarHeight } = system.navBarInfo

const vdata = reactive({
  tabType: 1,
  directory: false,
  fixedStyle: {
    color: '#fff',
  },
  otherScore: '',
  selfScore: '',
  timer: null,
})
const againBegin = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '答题乐园', funCourseName: null })
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
    url: '../opponent/index?delete=1',
  })
}
const result = () => {
  let params = {
    currentKey: answerPk.questionInfo.currentKey,
    matchKey: answerPk.questionInfo.matchKey,
  }
  questionAnswerPk('getPKResult', params).then((res) => {
    if (res) {
      if (res.otherScore !== null && res.selfScore !== null) {
        vdata.otherScore = res.otherScore
        vdata.selfScore = res.selfScore
        clearInterval(vdata.timer)
        vdata.timer = null
      }
    }
  })
}
const handleStyle = (item) => {
  let flag = false
  if (item.northSubmitResult != 1) {
    flag = true
  }
  return flag
}
const lookAnasisy = () => {
  Taro.navigateTo({
    url: '../resultDetail/index',
  })
}
onMounted(() => {
  result()
  vdata.timer = setInterval(() => {
    result()
  }, 1000)
})
useDidHide(() => {
  if (vdata.timer) {
    clearInterval(vdata.timer)
  }
})
onUnmounted(() => {
  if (vdata.timer) {
    clearInterval(vdata.timer)
  }
})
</script>
<style lang="scss">
.answerPkMain {
  // height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/f80aa4a3f30c43b98ff678949eec2f77/bg.png')
    no-repeat center;
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 0 22px 60px;
  box-sizing: border-box;
  height: 100vh;
  .winOrlose {
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #ffffff;
    margin-bottom: 35px;
    image {
      width: 130px;
      height: 125px;
      margin-bottom: 12px;
    }
    .loseImg {
      width: 130px;
      height: 104px;
      margin-bottom: 12px;
    }
  }
  .userInfo {
    display: flex;
    justify-content: space-between;

    .userItem {
      width: 160px;
      height: 70px;
      border-radius: 8px;
      background: linear-gradient(270deg, #22cfff 0%, rgba(194, 251, 255, 0.46) 100%);
      align-items: center;
      display: flex;
      padding: 0 6px;
      .imageInfo {
        position: relative;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        flex-shrink: 0;
        margin-right: 10px;
        image {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        .winHg {
          position: absolute;
          top: -12px;
          left: 16px;
          width: 29px;
          height: 19px;
        }
      }
      .userGrand {
        flex: 1;
        font-family: PingFangSC-Semibold;
        font-size: 12px;
        color: #ffffff;
        .name {
          width: 84px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .grand {
          display: flex;
          align-items: center;
          // align-items: flex-end;
          .fs {
            font-size: 18px;
            margin-right: 3px;
            margin-top: -2px;
          }
        }
        .timer {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
    .userItemRight {
      background: linear-gradient(270deg, rgba(194, 251, 255, 0.46) 0%, #22cfff 100%);
      .imageInfo {
        margin-left: 10px;
      }
    }
  }
  .answerSheet {
    background: linear-gradient(180deg, #e7f0ff 0%, #ffffff 98%);
    border: 3px solid #ffffff;
    // height: 145px;
    margin: 46px 0 80px;
    border-radius: 15px;
    box-shadow: 0px 4px 1px 0px rgba(207, 224, 255, 0.3);
    display: flex;
    flex-direction: column;
    padding: 15px;
    box-sizing: border-box;
    // justify-content: space-between;
    .topAnswer {
      display: flex;
      justify-content: center;
      align-items: center;
      .leftImg,
      .rightImg {
        width: 12px;
        height: 12px;
      }
      .centerImg {
        width: 54px;
        height: 20px;
        margin: 0 10px;
      }
    }
    .answerList {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin: 20px 0;
      .answerItem {
        width: 40px;
        height: 40px;
        background: #7edc7e;
        text-align: center;
        margin-right: 20px;
        line-height: 40px;
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #ffffff;
        border-radius: 50%;
        flex-shrink: 0;
        margin-right: 20px;
        margin-bottom: 15px;
      }
      .answerItem:nth-child(5n) {
        margin-right: 0;
      }
      .errorItem {
        background: #ff8578;
      }
    }
    .analysis {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #999999;
      image {
        width: 10px;
        height: 10px;
      }
    }
  }
  .footerBtn {
    // position: fixed;
    // bottom: 60px;
    // left: 50px;
    // right: 50px;
    text-align: center;
    width: 100%;
    height: 42px;
    line-height: 42px;
    background: #fff;
    border-radius: 30px;
    box-shadow: 0px 4px 1px 0px rgba(207, 224, 255, 0.3);
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #414141;
  }
}
</style>
