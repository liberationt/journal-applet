<template>
  <nut-overlay v-model:visible="vdata.memberShow" :close-on-click-overlay="false">
    <view class="memberMain">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/d9c0a4e7a65a47319462301fa3df5d6d/icon.png"
        mode="scaleToFill"
        class="closeImg"
        @tap="closeMember"
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

      <view class="operation" v-if="vdata.configCount - vdata.hasTryCount == 0">
        <view class="toMember" @tap="toMember">开通教育周报会员</view>
      </view>
      <view class="operation" v-else>
        <view class="free" @tap="toBegin"
          >免费练习({{ vdata.configCount - vdata.hasTryCount }}/{{ vdata.configCount }})</view
        >
        <view class="member" @tap="toMember">开通教育周报会员</view>
      </view>
    </view>
  </nut-overlay>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import { reactive, defineEmits, defineExpose } from 'vue'
const emit = defineEmits(['handleFree', 'handleNav'])
const props = defineProps({
  hiddenNavBar: {
    type: Boolean,
    default: false,
  },
})
const vdata: any = reactive({
  memberShow: false,
  configCount: 0,
  hasTryCount: 0,
  showCount: false,
  parameter1: '',
  parameter2: '',
})
const toMember = () => {
  vdata.memberShow = false
  if (props.hiddenNavBar) {
    emit('handleNav')
  }
  Taro.navigateTo({
    url: '/phaseOne/pages/memberPurchase/index',
  })
}
const toBegin = () => {
  vdata.memberShow = false
  emit('handleFree', vdata.parameter1, vdata.parameter2)
}
const showToast = (
  flag,
  configCount = 0,
  hasTryCount = 0,
  parameter1 = null,
  parameter2 = null
) => {
  vdata.memberShow = true
  vdata.showCount = flag
  vdata.configCount = configCount
  vdata.hasTryCount = hasTryCount
  vdata.parameter1 = parameter1
  vdata.parameter2 = parameter2
}
const closeMember = () => {
  vdata.memberShow = false
  if (props.hiddenNavBar) {
    emit('handleNav')
  }
}
defineExpose({
  showToast,
})
</script>
<style lang="scss">
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
  .operation {
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
    .free {
      box-sizing: border-box;
      border: 1px solid #893500;
      color: #893500;
      line-height: 42px;
      width: 132px;
    }
    .member {
      background: linear-gradient(90deg, #ff6b00 -1%, #ff3429 100%);
      box-shadow: 0px 3px 22px 0px rgba(155, 82, 58, 0.2);
      line-height: 44px;
      color: #fff;
      width: 154px;
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
</style>
