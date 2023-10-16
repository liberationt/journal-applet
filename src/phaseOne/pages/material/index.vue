<template>
  <view class="mainContent">
    <!-- <NavBar :title="'身份信息'" background="#fff" /> -->
    <view class="identityContent">
      <view class="topInfo">
        <view class="identity">
          <text>完善你的资料</text>
          <view>
            <text>2</text>
            <text class="otherText">/2</text>
          </view>
        </view>
        <view class="topTitle">可以为你推荐更好的学习资源哦 </view>
      </view>
      <view class="selfInfo">
        <view>
          <view class="label">姓名</view>
          <view class="inputInfo">
            <input
              placeholder="请输入真实姓名"
              type="text"
              v-model.trim="vdata.realNameSelf"
              :selectionStart="100"
              :selectionEnd="100"
            />
            <view class="rightBtn">
              <image
                v-if="vdata.realNameSelf"
                @tap="clearInput"
                class="close-img"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/41cde43ac6eb4dae99fe55bf5f889baf/close.png"
                mode="scaleToFill"
              />
            </view>
          </view>
        </view>
        <view class="schoolInfo">
          <view class="label">学校</view>
          <view class="school" @tap="chooseSchool">
            <text class="no" v-if="!vdata.userSchoolName">请选择学校</text>
            <text class="yse" v-else>{{ vdata.userSchoolName }}</text>
            <image
              class="yjt"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/d420fdeb6e694da7a0dbfa1e2c4a7b39/close-circle-fill.png"
              alt=""
            />
          </view>
        </view>
      </view>
      <view
        :class="['operatBtn', vdata.realNameSelf && vdata.userSchoolName && 'nextBtn']"
        @tap="next()"
        >开启学习之旅</view
      >
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { reactive, onMounted, ref } from 'vue'
import { saveFirstUserInfo } from '@/api/index'
import { useSystem, useUser, usePerson } from '@/stores'
const system = useSystem()
const router = useRouter()
const personInfo = usePerson()
const user = useUser()
const { navBarHeight } = system.navBarInfo
const vdata = reactive({
  realNameSelf: '',
  userSchoolName: '',
  userSchoolId: '',
})
const getName = (e) => {
  vdata.realNameSelf = e.detail.value
}
const clearInput = () => {
  vdata.realNameSelf = ''
}
const chooseSchool = () => {
  personInfo.setRealNameSelf(vdata.realNameSelf)
  Taro.navigateTo({
    url: '../school/index',
  })
}
const next = () => {
  if (!vdata.realNameSelf) {
    Taro.showToast({
      title: '请输入真实姓名',
      icon: 'none',
      duration: 2000,
    })
    return
  }
  if (!vdata.userSchoolName) {
    Taro.showToast({
      title: '请选择学校',
      icon: 'none',
      duration: 2000,
    })
    return
  }

  const params = {
    classGrade: personInfo.classGrade,
    classLevel: '',
    realNameSelf: vdata.realNameSelf,
    userAddress: personInfo.userAddress ? personInfo.userAddress : '',
    userSchoolName: vdata.userSchoolName,
    userType: personInfo.identity,
    userSchoolId: vdata.userSchoolId,
  }
  saveFirstUserInfo(params).then((res: any) => {
    if (res == '更新成功') {
      user.setUserInfo()
      Taro.switchTab({
        url: '/pages/index/index',
      })
    } else {
      Taro.showToast({
        title: '更新失败',
        icon: 'none',
        duration: 2000,
      })
    }
  })
  // Taro.switchTab({
  //   url: '/pages/index/index',
  // })
}
useDidShow(() => {
  vdata.userSchoolName = personInfo.userSchoolName
  vdata.userSchoolId = personInfo.userSchoolId
})
onMounted(() => {})
</script>

<style lang="scss">
.mainContent {
  padding: 60px 0;
  box-sizing: border-box;
}
.identity {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.identityContent {
  box-sizing: border-box;
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
  .selfInfo {
    .label {
      font-family: PingFangSC-Medium;
      font-size: 15px;
      color: #333333;
      margin-bottom: 20px;
    }
    .inputInfo {
      height: 50px;
      background: #f8f8f8;
      border-radius: 90px;
      display: flex;
      align-items: center;
      padding: 0 15px;
      input {
        height: 50px;
        width: 100%;
        font-size: 14px;
        caret-color: #2f5de7;
      }
      .input-placeholder {
        font-family: PingFang SC;
        font-size: 14px;
        color: #c8c8c8;
      }
      .rightBtn {
        display: flex;
        align-items: center;
      }
      .close-img {
        width: 17.5px;
        height: 17.5px;
        margin-right: 0px;
      }
    }
  }
  .schoolInfo {
    margin-top: 40px;
  }
  .school {
    min-height: 50px;
    background: #f8f8f8;
    border-radius: 90px;
    display: flex;
    align-items: center;
    padding: 10px 30px 10px 15px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    position: relative;
    .no {
      color: #c8c8c8;
    }
    .yjt {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 16px;
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
