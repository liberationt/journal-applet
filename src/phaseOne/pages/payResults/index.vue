<template>
  <view
    :class="['mainContent', vdata.type == 2 && 'errorContent']"
    :style="{
      paddingTop: `${navBarHeight + 23}px`,
    }"
  >
    <NavBar :title="'支付结果'" />
    <view class="payInfo">
      <image
        :src="
          vdata.type == 1
            ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/9dfc08f12b6a49d09ef4e958bd871b3c/success.png'
            : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/a47de12153aa449297deeab151c1e55f/error.png'
        "
      />
    </view>
    <view class="payMessage">
      <text v-if="vdata.type == 1">支付成功！</text>
      <text class="errMessage" v-else> 支付失败！</text>
    </view>
    <view class="operatBtn">
      <view v-if="vdata.type == 1" @tap="goHome">开始学习吧</view>
      <view class="errorBg" v-else @tap="goMember"> 重新支付</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { onMounted, reactive } from 'vue'
import { useSystem, useUser } from '@/stores'
const system = useSystem()
const user = useUser()
const router = useRouter()

const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  type: '',
})
const goHome = () => {
  if (user.userInfo?.userType) {
    Taro.switchTab({
      url: '/pages/index/index',
    })
  } else {
    Taro.redirectTo({
      url: '../identity/index',
    })
  }
}
const goMember = () => {
  Taro.redirectTo({
    url: '../memberPurchase/index',
  })
}
onMounted(() => {
  vdata.type = router.params?.payStatus
})
</script>
<style lang="scss">
.mainContent {
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/d84a480501c148a0a54aab3b1101e02f/successBg.png')
    no-repeat top;
  background-size: 100%;
}
.errorContent {
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/a093a3f5edc245daaac38e200e4ab496/errorBg.png')
    no-repeat top;
}
.payInfo {
  text-align: center;
  image {
    width: 154px;
    height: 154px;
  }
}
.payMessage {
  text-align: center;
  font-size: 18px;
  color: #00c27e;
  font-weight: 600;
  margin-top: 6px;
  .errMessage {
    color: #d97070;
  }
}
.operatBtn {
  width: 180px;
  height: 40px;
  border-radius: 20px;
  background: #2f5de7;
  text-align: center;
  line-height: 40px;
  color: #fff;
  letter-spacing: 1px;
  margin: 223px auto 0;
  .errorBg {
    background: #07c160;
    border-radius: 20px;
  }
}
</style>
