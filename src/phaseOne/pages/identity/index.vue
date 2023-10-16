<template>
  <view class="mainContent" :style="{ paddingTop: `${navBarHeight + 60}px` }">
    <NavBar :title="''" background="#fff" />
    <view class="identityContent">
      <view class="topInfo">
        <view class="identity">
          <text>Hello!</text>
          <!-- <view>
            <text>1</text>
            <text class="otherText">/2</text>
          </view> -->
        </view>
        <view class="topTitle">选择你的角色登录吧</view>
      </view>
      <view>
        <!-- @tap="chooseIdent(item)" -->
        <view
          v-for="(item, i) in vdata.identList"
          :key="i"
          :class="['list_item', i == 1 && 'chooseBg']"
          @tap="next(item.value)"
        >
          <view>{{ item.name }}</view>
          <view class="imgInfo">
            <image :src="item.url" mode="" />
            <image
              class="closeBg"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9400a5cb55b541adb59ef9050345fe1c/close-circle-fill.png"
              mode="scaleToFill"
            />
          </view>
        </view>
      </view>
      <!-- <view :class="['operatBtn', vdata.type && 'nextBtn']" @tap="vdata.type && next()"
        >下一步</view
      > -->
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro, { setNavigationBarTitle } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { reactive, onMounted } from 'vue'

import { useSystem, usePerson } from '@/stores'
// import { useRouter } from getCurrentInstance()
const personInfo: any = usePerson()
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const vdata = reactive({
  identList: [
    {
      value: 1,
      name: '我是家长',
      url: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/grzx/488218f8be1841a98532b8edc6a7c28d/jz.png',
    },
    {
      value: 2,
      name: '我是学生',
      url: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/grzx/1fded3ffa7e647d798d71d0b47e3b0d1/xs.png',
    },
  ],
  type: '',
})
const chooseIdent = (item) => {
  vdata.type = item.value
}
const next = (value) => {
  personInfo.setIdentity(value)
  Taro.navigateTo({
    url: `../grade/index?type=${value}`,
  })
}
onMounted(() => {})
</script>

<style lang="scss">
.identity {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.identityContent {
  padding: 0 20px;
  font-family: PingFang SC;
  .topInfo {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 0px;
    color: #3d3d3d;
    margin-bottom: 35px;
  }
  .otherText {
    font-size: 12px;
    font-weight: normal;
  }
  .topTitle {
    font-size: 12px;
    font-weight: normal;
    margin-top: 10px;
  }
  .list_item {
    height: 120px;
    border-radius: 16px;
    background: #fff7ee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 0 27px;
    box-sizing: border-box;
    margin-bottom: 30px;
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 600;
    line-height: 20px;
    color: #333333;
  }
  .chooseBg {
    background: #f4f9ff;
  }
  .imgInfo {
    display: flex;
    align-items: center;
    image {
      width: 88px;
      height: 88px;
    }
    .closeBg {
      width: 20px;
      height: 20px;
      margin-left: 12px;
    }
  }
  .operatBtn {
    height: 50px;
    border-radius: 54px;
    background: #d9d9d9;
    margin-top: 50px;
    text-align: center;
    line-height: 50px;
    font-family: PingFang SC;
    font-size: 18px;
    font-weight: 500;
    color: #fff;
  }
  .nextBtn {
    background: #2f5de7;
  }
}
</style>
