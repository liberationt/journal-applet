<template>
  <view class="essayCorrectionMain" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="口算批改" />

    <view class="contentInfo">
      <view class="photo">
        <image
          @tap="toPhoto"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/8d05e67f6e374a9ca57607e4361e60a2/photo.png"
          mode="scaleToFill"
        />
        <view>拍照批改</view>
      </view>
    </view>
    <view class="operate">
      <view @tap="toList">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/4e04769f121745abb55239e1ad66c7fc/lishixiao.png"
          mode="scaleToFill"
        />
        <text>批改历史</text>
      </view>
      <text>|</text>
      <view @tap="vdata.showToast = true">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/7c22cf39666a4d68bcc0a4bed3bf47ca/lishixiao1.png"
          mode="scaleToFill"
        />
        <text>支持题型</text>
      </view>
    </view>
    <view class="imageInfo">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/30bc8867498e47198b63b229dddc5968/pgal.png"
        mode="scaleToFill"
      />
    </view>
    <view class="toastImg" v-show="vdata.showToast">
      <view class="toastMain">
        <view class="title">支持题型</view>
        <view class="type">目前仅支持小学数学题目</view>
        <view class="imgInfo">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/2de7bd00f93f456185d865044376d818/demoPic.png"
            mode="widthFix"
          />
        </view>
        <view @tap="vdata.showToast = false" class="btn">我知道了</view>
      </view>
    </view>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, usePerson, useUser } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
import { reactive, ref } from 'vue'
import { getTryCount } from '@/api/index'
import { debounce } from '@/utils/index'
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const user = useUser()

const vdata = reactive({
  showToast: false,
})
const toPhoto = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '口算批改', funCourseName: null })
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
    url: '../photographPage/index',
  })
}
const toList = () => {
  Taro.navigateTo({
    url: '../correctList/index',
  })
}
const showToast = () => {}
useDidShow(() => {})
</script>
<style lang="scss">
.essayCorrectionMain {
  height: 100vh;
  .contentInfo {
    padding: 0 16px;
    box-sizing: border-box;
    .photo {
      height: 165px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/b2e3d5d77086470692a64b55badff14c/ksbj.png')
        no-repeat center;
      background-size: 100% 100%;
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 20px;
      image {
        width: 100px;
        height: 87px;
        margin-bottom: 5px;
      }
    }
  }
  .operate {
    display: flex;
    background: #fafafa;
    height: 42px;
    margin: 10px 15px 15px;
    align-items: center;
    border-radius: 10px;
    image {
      width: 13px;
      height: 13px;
      margin-right: 5px;
    }
    view {
      width: 48%;
      display: flex;
      align-items: center;
      justify-content: center;
      text {
        font-family: PingFang SC;
        font-size: 14px;
        color: #333333;
      }
    }
    text {
      color: #dcdcdc;
      font-size: 12px;
    }
  }
  .imageInfo {
    margin: 0 15px;
    image {
      height: 222px;
      width: 100%;
    }
  }
}
.toastImg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  .toastMain {
    position: absolute;
    top: 50%;
    left: 50%;
    background: #fff;
    border-radius: 16px;
    height: 530px;
    width: 313px;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 16px 0 23px;
    box-sizing: border-box;
    .title {
      font-family: 苹方-简;
      font-size: 17px;
      font-weight: 600;
      color: #333333;
    }
    .type {
      font-family: 苹方-简;
      font-size: 12px;
      color: #999999;
      margin: 6px 0 20px;
    }
    .imgInfo {
      width: 100%;
      height: 375px;
      overflow-y: scroll;
      // margin: 0 16px;
      image {
        width: 278px;
      }
      margin-bottom: 16px;
    }
    .btn {
      border-radius: 20px;
      opacity: 1;
      background: #4f94ff;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 47px;
    }
  }
}
</style>
