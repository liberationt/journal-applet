<template>
  <view class="wordListMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar title="背单词"></NavBar>
    <scroll-view
      v-if="true"
      class="scrollInfo"
      :scroll-y="true"
      :style="{ height: `calc(100vh - ${navBarHeight + 93}px)` }"
    >
      <view class="topTitle">一小结的单词学完啦，休息下看看这些单词，你都记住了吗？</view>
      <view v-for="item in 10" :key="item" class="scroll-item">
        <view class="word">pie</view>
        <view class="pronunciation">
          <text>['okjupsai]</text>
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/d899a708a89e42f09c8a361d8d289a5d/bf.png"
            mode="scaleToFill"
          />
        </view>
        <view class="interpretation">
          <view class="bg" v-if="false"></view>
          <view class="interMain" v-else>
            <view class="unit">释义 </view>
            <view
              >n.（医）肺尘病、矽肺病、（医）肺尘
              n.（医）肺尘病、矽肺病、v.（医）肺尘病、矽的肺病、矽的的肺…</view
            >
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="footer">
      <view class="footerBtn">返回首页</view>
    </view>
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
  tabType: 1,
})
//tab切换
const tabChange = (num) => {
  vdata.tabType = num
}
useDidShow(() => {})
</script>
<style lang="scss">
.wordListMain {
  height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/460e28cdddcb4e62b1752511362a4a48/bdcBg.png')
    no-repeat top;
  background-size: 100%;
  box-sizing: border-box;

  .scrollInfo {
    padding-left: 18px;
    box-sizing: border-box;
    .scroll-item {
      padding: 10px 30px 15px 0;
      border-bottom: 1px solid rgba(239, 239, 239, 0.7);
      .word {
        font-family: SourceHanSansCN-Bold;
        font-size: 16px;
        font-weight: bold;
        line-height: 19px;
        color: #333333;
      }
      .pronunciation {
        display: flex;
        align-items: center;
        background: #eff7ff;
        border-radius: 4px;
        height: 24px;
        margin: 5px 0 8px;
        width: 90px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #727488;
        image {
          width: 16px;
          height: 16px;
        }
      }
      .interpretation {
        .bg {
          width: 207px;
          height: 24px;
          background: linear-gradient(90deg, #f1f8ff -1%, #e0ecfa 100%);
        }
        .interMain {
          display: flex;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #343434;
          .unit {
            font-family: PingFangSC-Semibold;
            font-size: 12px;
            font-weight: 600;
            line-height: 14px;
            color: #343434;
            width: 25px;
            flex-shrink: 0;
            margin-right: 8px;
          }
        }
      }
    }
    .topTitle {
      height: 30px;
      border-radius: 19.5px;
      margin-top: 15px;
      background: #e0eaff;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      line-height: 30px;
      text-align: center;
      color: #343434;
      margin-right: 18px;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 93px;
    box-sizing: border-box;
    padding: 15px 25px;
    .footerBtn {
      width: 100%;
      height: 44px;
      border-radius: 23px;
      background: #2f5de7;
      line-height: 46px;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      font-weight: 500;
      color: #f9f9f9;
      margin: 0 auto;
    }
  }
}
</style>
