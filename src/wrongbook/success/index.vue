<template>
  <view class="mainContent">
    <view class="payInfo">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/9dfc08f12b6a49d09ef4e958bd871b3c/success.png"
      />
    </view>
    <view class="payMessage">
      <text>保存错题成功</text>
    </view>
    <view class="operatBtn">
      <view class="look" @tap="look">去看错题</view>
      <view class="commit" @tap="commit">继续录入</view>
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
  grand: '',
  branch: '',
  term: '',
})
const look = () => {
  Taro.redirectTo({
    url: `/wrongbook/wrongList/index?grand=${vdata.grand}&branch=${vdata.branch}&term=${vdata.term}`,
  })
}
const commit = () => {
  Taro.redirectTo({
    url: '/wrongbook/photograph/index?type=2',
  })
}
onMounted(() => {
  vdata.type = router.params?.payStatus || ''
  vdata.grand = router.params?.grand || ''
  vdata.branch = router.params?.branch || ''
  vdata.term = router.params?.term || ''
})
</script>
<style lang="scss">
.mainContent {
  padding-top: 28px;
}

.payInfo {
  text-align: center;
  margin-bottom: 15px;
  image {
    width: 154px;
    height: 154px;
  }
}
.payMessage {
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: normal;
  line-height: 25px;
  letter-spacing: 0px;
  text-align: center;
  color: #333333;
}
.operatBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  letter-spacing: 1px;
  margin: 64px auto 0;

  font-family: PingFangSC-Regular;
  view {
    width: 116px;
    border-radius: 25px;
  }
  .look {
    box-sizing: border-box;
    border: 1px solid #c8c8c8;
    color: #333333;
    margin-right: 30px;
  }
  .commit {
    background: #0256ff;
    color: #ffffff;
  }
}
</style>
