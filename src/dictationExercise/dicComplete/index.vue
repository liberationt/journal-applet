<template>
  <view class="dicComplete" :style="{ paddingTop: `${navBarHeight + 65}px` }">
    <NavBar title="" />
    <view class="titleInfo">
      <view class="good">太棒了！听写完成</view>
      <view class="phone">快去拍照看看正确率吧</view>
    </view>
    <view class="wordInfo" :style="{ height: `calc(100vh - ${navBarHeight + 280}px)` }">
      <view class="title">字词听写</view>
      <view>
        <view class="item-word">
          <template v-for="(vtem, k) in vdata.hearList" :key="k">
            <view v-if="vtem.chineseContent && vtem.chineseContent.length == 1" class="text-item">
              {{ vtem.chineseContent }}
            </view>
            <view v-else class="text-item-main">
              <view v-for="(text, textIndex) in vtem.chineseContent" :key="textIndex">
                <view class="text-item-item">
                  {{ text }}
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
    <view class="botOpera">
      <view class="phone" @tap="photograph">拍照批改</view>
      <view class="again" @tap="again">在听一次</view>
    </view>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, usePerson, useUser } from '@/stores'
import { debounce } from '@/utils'
import { getTryCount } from '@/api/index'
import MemberToast from '@/components/memberToast.vue'
import { reactive, ref } from 'vue'
const memberToast = ref()
const user = useUser()
const system = useSystem()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  hearList: '',
})
const again = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '听写训练', funCourseName: null })
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
  Taro.redirectTo({
    url: '../dictationBegin/index',
  })
}
const photograph = debounce(() => {
  Taro.redirectTo({
    url: '../photograph/index',
  })
})
useDidShow(() => {
  vdata.hearList = personInfo.dicExerciseList
})
</script>
<style lang="scss">
.dicComplete {
  height: 100vh;
  // background: linear-gradient(180deg, #0081ff 2%, #4699ff 55%, #4690ff 82%, #f7f9fb 101%);
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/8e8234d49d2441fb89e73051ec2f24b5/studyBg.png')
    no-repeat top;
  background-size: 100%;
  .titleInfo {
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #ffffff;
    .good {
      font-family: PingFangSC-Semibold;
      font-size: 32px;
      margin-bottom: 15px;
    }
  }
  .wordInfo {
    background: #fff;
    border-radius: 20px 20px 0 0;
    position: fixed;
    bottom: 95px;
    left: 0;
    right: 0;
    box-sizing: border-box;
    padding: 25px;
    overflow-y: scroll;
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #333333;
    }
    .item-word {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      margin: 16px 0;
      .text-item {
        height: 42px;
        width: 42px;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/7c5f3b233cf14427bb7224454edd3c56/textbg.png')
          no-repeat center;
        font-family: PingFangSC-Regular;
        background-size: 100% 100%;
        font-size: 20px;
        color: #343434;
        text-align: center;
        line-height: 42px;
        margin-bottom: 10px;
        margin-right: 10px;
        border-radius: 3px;
      }
      .text-item-select {
        color: #0256ff;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/7e78f1e6a91244bfab0edc8f1909f65a/selectbg.png')
          no-repeat center;
        background-size: 100% 100%;
      }
      .text-item-main {
        display: flex;
        margin-right: 10px;
      }

      .text-item-item {
        height: 41px;
        width: 41px;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/7c5f3b233cf14427bb7224454edd3c56/textbg.png')
          no-repeat center;
        font-family: PingFangSC-Regular;
        background-size: 100% 100%;
        font-size: 20px;
        color: #343434;
        text-align: center;
        line-height: 41px;
        margin-bottom: 10px;
      }
      .text-item-select-main {
        .text-item-item {
          color: #0256ff;
          color: #0256ff;
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/7e78f1e6a91244bfab0edc8f1909f65a/selectbg.png')
            no-repeat center;
          background-size: 100% 100%;
        }
      }
    }
  }
  .botOpera {
    height: 88px;
    box-shadow: inset 0px 1px 1px 1px #ffffff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 15px 25px 0;
    box-sizing: border-box;
    text-align: center;
    line-height: 40px;
    justify-content: space-between;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    border-top: 1px solid #f0f0f0;
    view {
      width: 152px;
      height: 40px;
      border-radius: 25px;
    }
    .phone {
      border: 1px solid #0c61ff;
      box-sizing: border-box;
      color: #2f5de7;
    }
    .again {
      background: #2f5de7;
      color: #fff;
    }
  }
}
</style>
