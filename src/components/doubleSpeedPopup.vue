<template>
  <view class="dooubleSpeedMain">
    <nut-popup
      @close="closePopup"
      round
      position="bottom"
      closeable
      :style="{ height: '410px' }"
      v-model:visible="vdata.showRound"
    >
      <view class="doubleSpeedPopup">
        <view class="title">播放倍速</view>
        <view
          class="list"
          v-for="(item, index) in vdata.list"
          :key="index"
          @click="changeDouble(item, index)"
        >
          <view class="name">{{ item.label }}</view>
          <view class="img">
            <image
              v-if="item.id != vdata.numDouble"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/audio/d2f61e5dec284ea789b6e45f4246316f/noSelectIcon.png"
            ></image>
            <image
              v-else
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/audio/ae6c9e95ddc841cd8dce66a800f744d5/selectIcon.png"
            ></image>
          </view>
        </view>
      </view>
    </nut-popup>
  </view>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro'
import { reactive, ref, defineEmits } from 'vue'
const emit = defineEmits(['doubleChange'])
const vdata = reactive({
  numDouble: '1',
  list: [
    { label: 'x 0.5', id: 0.5 },
    { label: 'x 0.75', id: 0.75 },
    { label: 'x 1.0', id: 1 },
    { label: 'x 1.25', id: 1.25 },
    { label: 'x 1.75', id: 1.75 },
    { label: 'x 2.0', id: 2 },
  ],
  showRound: false,
})
const popupShow = async (val) => {
  vdata.numDouble = val
  vdata.showRound = true
}
const changeDouble = (item, index) => {
  console.log(item, 'item=')
  emit('doubleChange', item.id)
}
const closePopup = () => {
  vdata.showRound = false
}
defineExpose({
  popupShow,
  closePopup,
})
</script>
<style lang="scss">
.doubleSpeedPopup {
  .title {
    // height: 65px;
    // line-height: 65px;
    font-size: 16px;
    color: #333333;
    padding: 20px;
    border-bottom: 0.5px solid #f0f0f0;
  }
  .list {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 48px;
    line-height: 48px;
    .name {
      font-size: 14px;
      color: #333333;
      vertical-align: middle;
    }
    .img {
      margin-top: 5px;
      width: 20px;
      height: 20px;
      // background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/audio/d2f61e5dec284ea789b6e45f4246316f/noSelectIcon.png')
      //   no-repeat top;
      // background-size: 100% 100%;
      vertical-align: middle;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.dooubleSpeedMain {
  .nut-icon {
    font-weight: 700;
    color: #000;
  }
}
</style>
