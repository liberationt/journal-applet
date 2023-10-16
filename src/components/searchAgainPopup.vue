<template>
  <view class="searchAgainPopup">
    <nut-popup
      @close="closePopup"
      round
      position="bottom"
      :close-on-click-overlay="false"
      :style="{ height: '400px' }"
      v-model:visible="vdata.popupShow"
    >
      <view class="box">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/db44470f5fd946ef8d93daf1ff5745fb/noResultBg.png"
        ></image>
        <view v-if="props.isCorrect">
          <view class="title">未找到可识别的题目</view>
          <view> 目前支持教育周报小学语文、英语批改</view>
        </view>
        <view v-else>
          <view>暂未搜索到任何结果～</view>
          <view>（当前仅支持搜索教育周报题目）</view>
        </view>
        <view class="againBtn" @tap="againBtn">{{
          props.isCorrect ? '重新批改' : '重新搜题'
        }}</view>
      </view>
    </nut-popup>
  </view>
</template>
<script lang="ts" setup>
import Taro, { setNavigationBarTitle } from '@tarojs/taro'
import { reactive } from 'vue'
const props = defineProps({
  isCorrect: false,
})
const vdata = reactive({
  questionType: 1,
  popupShow: false,
})
const popupShow = (val) => {
  if (val) {
    vdata.questionType = val || 1
  }
  vdata.popupShow = true
}
const closePopup = () => {}
const againBtn = () => {
  // vdata.popupShow = false
  if (props.isCorrect) {
    //  重新批改
    Taro.redirectTo({
      url: '/photoCorrect/photographPage/index',
    })
  } else {
    //  重新搜题
    Taro.redirectTo({
      url: `/photoSearch/photographPage/index?type=${vdata.questionType}`,
    })
  }
}
defineExpose({
  popupShow,
})
</script>
<style lang="scss">
.searchAgainPopup {
  .box {
    text-align: center;
    padding-top: 60px;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 11px;
    }
    view {
      font-size: 12px;
      line-height: 17px;
      color: #414141;
      margin-bottom: 6px;
    }
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      line-height: 25px;
      text-align: center;
      color: #333333;
    }
    .againBtn {
      margin: 0 auto;

      margin-top: 40px;
      width: 178px;
      height: 44px;
      text-align: center;
      line-height: 44px;
      border-radius: 22px;
      background: #0256ff;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>
