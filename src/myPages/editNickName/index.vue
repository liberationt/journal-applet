<template>
  <view class="enterSchool" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar :title="'昵称'" />
    <view class="identityContent">
      <view class="inputInfo">
        <input
          placeholder="请输入你的昵称"
          type="nickname"
          v-model.trim="vdata.nickName"
          :auto-focus="true"
          :selectionStart="100"
          :selectionEnd="100"
        />
        <view class="rightBtn">
          <image
            v-if="vdata.nickName"
            @tap="clearInput"
            class="close-img"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/41cde43ac6eb4dae99fe55bf5f889baf/close.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view :class="['operatBtn', vdata.nickName && 'nextBtn']" @tap="vdata.nickName && next()"
        >确定</view
      >
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro'
import { reactive, onMounted, ref } from 'vue'
import { useSystem, usePerson } from '@/stores'
import NavBar from '@/components/NavBar.vue'
const system = useSystem()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
const vdata = reactive({
  nickName: '',
})

const clearInput = () => {
  vdata.nickName = ''
}

const next = () => {
  // personInfo.setSchoolName(vdata.nickName)
  personInfo.setUserKey('nickName', vdata.nickName)
  Taro.navigateBack({ delta: 1 })
}
onMounted(() => {
  vdata.nickName = personInfo.userInfo?.nickName || ''
})
</script>

<style lang="scss">
.enterSchool {
  padding: 0 20px;
  box-sizing: border-box;
  .inputInfo {
    margin-bottom: 60px;
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
