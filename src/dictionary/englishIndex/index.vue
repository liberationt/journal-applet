<template>
  <view class="chineseMain" :style="{ paddingTop: `${navBarHeight + 106}px` }">
    <NavBar title="" />
    <view class="worldList">
      <view v-for="(item, i) in vdata.wordList" :key="i" class="listItem">
        {{ item }}
      </view>
    </view>
    <view class="bookFlow">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/3bd0329f8686498b906a69be97913f0b/bookflow.png"
        mode="scaleToFill"
      />
    </view>
    <view class="searchBg" @tap="toSearch">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/8f129620daba44f38875eecca5832d69/search.png"
        mode="scaleToFill"
      />
      <text class="text">请输入要翻译的单词</text>
    </view>
    <view class="word" @tap="toWordBook">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/325106ef88514734a875c43bb685e9c3/word.png"
        mode="scaleToFill"
      />
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
  wordList: ['英', '汉', '词', '典'],
})
const toSearch = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '英汉词典', funCourseName: null })
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
    url: '../searchEnglish/index',
  })
}
const toWordBook = () => {
  Taro.navigateTo({
    url: '../wordBook/index',
  })
}
</script>

<style lang="scss">
.chineseMain {
  background-image: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/af4aeeb3d8a746ef8913386614795ff8/yhcdBg.png');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: top;
  background-color: #fff;
  height: 100vh;
  box-sizing: border-box;
  .worldList {
    display: flex;
    margin: 0 40px 30px;
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
      color: #2f66e7;
      font-weight: bold;
    }
  }
  .bookFlow {
    margin: 0 25px;
    text-align: right;
    image {
      width: 86px;
      height: 35px;
      margin-bottom: -3px;
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
    box-shadow: 1px 3px 5px 0px rgba(98, 136, 212, 0.12);
    box-sizing: border-box;
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
  .word {
    margin: 44px 20px;
    image {
      height: 71px;
      width: 100%;
    }
  }
}
</style>
