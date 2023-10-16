<template>
  <view class="studyPlanMain" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="制定词书" :fixedStyle="vdata.fixedStyle"></NavBar>
    <view class="setInfo">
      <view class="plan">
        <view class="bg"
          >1
          <image
            class="icon"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/07e35a7401f84df0bee58c66cb757f49/icon1.png"
            mode="scaleToFill"
          />
        </view>
        <text>选择学习词书</text>
      </view>
      <image
        class="jtInfo"
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/b33a283c57974eb283a30481b60cdf60/bdcjt.png"
        mode="scaleToFill"
      />
      <view class="set">
        <view class="bg">2</view>
        <text>设置学习计划</text>
      </view>
    </view>
    <view class="bookInfo">
      <view class="left">
        <image
          class="left-bg"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/446d8803ee0d48b4b2be1899549ce266/dcs.png"
          mode="scaleToFill"
        >
        </image>
      </view>
      <view class="right">
        <view class="right-title">单词书名称单词书名称 单词大声道</view>
        <view class="right-bottom">
          <text>2222词</text>
          <text>3234242人正在背</text>
        </view>
      </view>
    </view>
    <view class="studyPlan">
      <view class="studyText">
        <view>每天学习</view>
        <view>学习天数</view>
      </view>
      <view class="pickerInfo">
        <picker-view
          indicator-style="height: 30px;"
          style="width: 100%; height: 170px"
          :value="value"
          indicatorClass="selected-item"
          @change="onChange"
        >
          <picker-view-column class="left-column">
            <view class="picker-item" v-for="(item, index) in vdata.dayList" :key="index"
              >{{ item }}个</view
            >
          </picker-view-column>
          <picker-view-column class="right-column">
            <view v-for="(item, index) in vdata.timeList" class="picker-item'" :key="index"
              >{{ item }}天</view
            >
          </picker-view-column>
        </picker-view>
        <view class="icon">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/c22584771ddb4f849a4d72bad6c1fcae/icon.png"
            mode="scaleToFill"
          />
        </view>
      </view>
    </view>
    <view class="expect">
      预计每天学<text>10</text>分钟，<text>100</text> 天学完(2022年12月12日)
    </view>
    <view class="footer" @tap="beganStudy">开始学习该计划！</view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import { PickerView, PickerViewColumn } from '@tarojs/components'

import NavBar from '@/components/NavBar.vue'
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
import { reactive } from 'vue'

const vdata = reactive({
  fixedStyle: {
    color: '#fff',
  },
  showRound: false,
  pronunciation: '',
  sound: '',
  dayList: [10, 20, 30, 40, 50],
  timeList: [10, 5, 3, 3, 2],
})
const beganStudy = () => {
  Taro.navigateTo({
    url: '../index/index',
  })
}
useDidShow(() => {})
</script>
<style lang="scss">
.studyPlanMain {
  height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/460e28cdddcb4e62b1752511362a4a48/bdcBg.png')
    no-repeat top;
  background-size: 100%;
  box-sizing: border-box;
  // display: flex;
  // flex-direction: column;

  .setInfo {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #343434;
    margin-bottom: 26px;
    .plan,
    .set {
      display: flex;
      flex-direction: column;
      align-items: center;
      .bg {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        text-align: center;
        line-height: 25px;
        margin-bottom: 6px;
        background: #fff;
        color: #4a89ff;
        font-weight: 500;
      }
    }
    .plan {
      .bg {
        border: 1px solid #4a89ff;
        background: #e3edff;
        position: relative;
        .icon {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
        }
      }
    }
    .set {
      margin-left: 57px;
      text {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        font-weight: 500;
        color: #4a89ff;
      }
      .bg {
        background: #4a89ff;
        color: #fff;
      }
    }
    .jtInfo {
      position: absolute;
      width: 73px;
      height: 6px;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .bookInfo {
    margin: 0 10px;
    display: flex;
    padding: 12px;
    border-radius: 12px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0px 4px 8px 0px rgba(231, 239, 247, 0.9);

    .left {
      position: relative;
      flex-shrink: 0;
      margin-right: 13px;
      .left-bg {
        width: 80px;
        height: 106px;
      }
      .bdc {
        width: 54px;
        height: 22px;
        position: absolute;
        top: 26px;
        left: 13px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .right-title {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        line-height: 22px;
        color: #343434;
      }
      .right-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #343434;
      }
    }
  }
  .studyPlan {
    padding: 0 52px;
    margin: 30px 0 40px;

    .studyText {
      display: flex;
      // justify-content: center;
      // align-items: center;
      border-bottom: 1px solid rgba(151, 151, 151, 0.3);
      padding: 13px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #343434;
      view {
        width: 50%;
        text-align: center;
      }
    }
    .pickerInfo {
      position: relative;
      .selected-item {
        text-align: center;
        background: rgba($color: #4989ff, $alpha: 0.1);
        position: relative;
      }
      .selected-item::before {
        content: '';
        position: absolute;
        top: 0px;
        border: none;
      }
      .selected-item::after {
        content: '';
        position: absolute;
        bottom: 0;
        border: none;
      }

      .picker-item {
        text-align: center;
        border: none !important;
        line-height: 30px;
      }
      .left-column .picker-item {
        border-radius: 15px 0 0 15px;
      }
      .right-column .picker-item {
        border-radius: 0px 15px 15px 0px;
      }
      .icon {
        position: absolute;
        width: 18px;
        height: 18px;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        image {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
  .expect {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    line-height: 14px;
    color: #343434;
    display: flex;
    align-items: center;
    justify-content: center;
    text {
      color: #4a89ff;
    }
  }
  .footer {
    border-radius: 23px;
    background: #4a89ff;
    height: 46px;
    line-height: 46px;
    text-align: center;
    margin: 19px 45px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
    color: #f9f9f9;
  }
}
</style>
