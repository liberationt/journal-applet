<template>
  <view class="mainContent">
    <view class="noData" v-if="vdata.dataList && !vdata.dataList.length">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
      />
      <text>暂无交易记录</text>
    </view>
    <view class="list-item" v-for="(item, i) in vdata.dataList" :key="i" v-else>
      <view class="topTitle">
        <view>{{ item.title }}</view>
        <view class="money" v-if="item.type == 1">
          <text class="dw"> ¥</text>
          <text>{{ item.price }} </text>
        </view>
        <view class="noMoney" v-else>
          <text>会员卡激活</text>
        </view>
      </view>
      <view class="timer">到期时间：{{ item.expireTime }}</view>
      <view class="timer">购买时间：{{ item.createTime }}</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { setNavigationBarTitle } from '@tarojs/taro'
import { onMounted, reactive } from 'vue'
import { useSystem } from '@/stores'
import { getTransactList } from '@/api/user'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  digit: '',
  showError: false,
  dataList: [],
})
const submit = () => {
  vdata.showError = true
}
const goMember = () => {}
const toHome = () => {}
onMounted(() => {
  getTransactList().then((res: any) => {
    if (res && res.length) {
      vdata.dataList = res
    }
  })
})
</script>
<style lang="scss">
.noData {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  image {
    width: 160px;
    height: 130px;
    margin-top: 120px;
    margin-bottom: 24px;
  }
  color: #999999;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
}
.list-item {
  border-bottom: 1px solid #dfdfdf;
  margin: 0 15px;
  padding: 16px 5px;
  box-sizing: border-box;
  .topTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333;
    margin-bottom: 18px;
    .money {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      font-weight: 500;
      color: #e70202;
      display: flex;
      align-items: center;
      .dw {
        font-size: 14px;
        margin-right: 3px;
      }
    }
    .noMoney {
      font-family: PingFangSC-Regular;
      font-size: 14px;
    }
  }
  .timer {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: normal;
    color: #999999;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
}
</style>
