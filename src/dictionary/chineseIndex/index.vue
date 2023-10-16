<template>
  <view class="chineseMain" :style="{ paddingTop: `${navBarHeight + 106}px` }">
    <NavBar title="" />
    <view class="worldList">
      <view v-for="(item, i) in vdata.wordList" :key="i" class="listItem">
        {{ item }}
      </view>
    </view>
    <view class="iconImg">
      <view class="icon">
        <image
          class="rImg"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/40b84fbe49fb4b84aa9456a8da8aed9d/r.png"
        />
        <image
          class="cImg"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/64a546b66f584931bab294e33b35a790/c.png"
        />
      </view>
    </view>
    <view class="searchBg" @tap="toSearch">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/8f129620daba44f38875eecca5832d69/search.png"
        mode="scaleToFill"
      />
      <text class="text">请输入汉字、拼音</text>
    </view>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import { useSystem, useUser } from '@/stores'
import Taro from '@tarojs/taro'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
import NavBar from '@/components/NavBar.vue'
import { reactive, ref } from 'vue'
import { getTryCount } from '@/api/index'
import { debounce } from '@/utils/index'
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const user = useUser()
const vdata = reactive({
  wordList: ['汉', '语', '字', '典'],
})
const toSearch = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '汉语字典', funCourseName: null })
    // vdata.termItemInfo = item
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
  Taro.navigateTo({
    url: '../searchChinese/index',
  })
}
</script>

<style lang="scss">
.chineseMain {
  background-image: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/389f34171f8a4b29a5ee321b7fe21979/hyzdBg.png');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: top;
  background-color: #fff;
  height: 100vh;
  box-sizing: border-box;
  .worldList {
    display: flex;
    margin: 0 40px 8px;
    justify-content: space-between;

    .listItem {
      background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/8140118f2ffd4e3bb47537d9d56b03e5/chinessBg.png')
        no-repeat center;
      background-size: 100% 100%;
      width: 62px;
      height: 62px;
      text-align: center;
      line-height: 62px;
      font-family: STKaitiSC-Black;
      font-family: '楷体';
      font-size: 32px;
      font-weight: normal;
      color: #d07506;
      font-weight: bold;
    }
  }
  .iconImg {
    position: relative;
    .rImg {
      position: absolute;
      width: 36px;
      height: 33px;
      position: absolute;
      top: 0;
      left: 14px;
    }
    .cImg {
      position: absolute;
      right: 40px;
      width: 76px;
      height: 69px;
      top: 4px;
    }
  }
  .searchBg {
    background: #fff;
    height: 50px;
    margin: 0 22px;
    border-radius: 90px;
    padding-left: 16px;
    display: flex;
    align-items: center;
    position: relative;
    box-shadow: 1px 3px 4px 0px rgba(226, 158, 56, 0.12);
    box-sizing: border-box;
    margin-top: 70px;
    image {
      width: 24px;
      height: 24px;
      margin-right: 3px;
    }
    .text {
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #c8c8c8;
    }
  }
}
</style>
