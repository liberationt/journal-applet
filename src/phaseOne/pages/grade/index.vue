<template>
  <view class="mainContent" :style="{ paddingTop: `${navBarHeight + 60}px` }">
    <NavBar :title="''" background="#fff" />
    <view class="identityContent">
      <view class="topInfo">
        <view class="identity">
          <text class="fontWeight">完善你的资料</text>
          <view>
            <text class="fontWeight">1</text>
            <text class="otherText">/2</text>
          </view>
        </view>
        <view class="topTitle">可以为你推荐更好的学习资源哦 </view>
      </view>
      <view class="address" @tap="showAddress">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/415a206444cd486dae3b533ab6894ab8/position.png"
          mode="scaleToFill"
        />
        <text class="address-text">{{ vdata.address ? vdata.address : '选择地区' }}</text>
        <image
          class="jt"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/cca1d87eb9604626b58939318ea58c20/xjt.png"
          mode="scaleToFill"
        />
      </view>
      <view>
        <Grade @handleChange="getGrade" :grande="vdata.grade" />
      </view>
      <view :class="['operatBtn', vdata.grade && vdata.address && 'nextBtn']" @tap="next()"
        >下一步</view
      >
    </view>
    <Address ref="address" @handleChange="addressChange" />
  </view>
</template>
<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import Grade from '@/components/Grade.vue'
import { reactive, onMounted, ref } from 'vue'
import { useSystem, useUser, usePerson } from '@/stores'
import Address from '@/components/address.vue'
const system = useSystem()
const router = useRouter()
const personInfo = usePerson()
const user = useUser()
const { navBarHeight } = system.navBarInfo
const address = ref()
const vdata = reactive({
  grade: '',
  address: '',
  addressList: [],
})
const next = () => {
  if (!vdata.address) {
    Taro.showToast({
      title: '请选择您所在地区',
      icon: 'none',
      duration: 2000,
    })
    return
  }
  if (!vdata.grade) {
    Taro.showToast({
      title: '请选择您所在年级',
      icon: 'none',
      duration: 2000,
    })
    return
  }
  personInfo.setAddress(vdata.address)
  personInfo.setClassGrade(vdata.grade)
  Taro.navigateTo({
    url: '../material/index',
  })
}
const addressChange = (val) => {
  // vdata.addressList = val
  vdata.address = val.join('/')
}
const showAddress = () => {
  address.value.addressShow()
}
const getGrade = (value) => {
  vdata.grade = value[0]
}
onMounted(() => {})
</script>

<style lang="scss">
.mainContent {
  padding: 60px 0;
  box-sizing: border-box;
  .address {
    margin-bottom: 40px;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    font-weight: normal;
    line-height: 14px;
    letter-spacing: 0px;
    display: flex;
    align-items: center;
    color: #333333;
    image {
      width: 14px;
      height: 14px;
      margin-right: 5px;
    }
    .jt {
      width: 7px;
      height: 7px;
      margin-left: 7px;
    }
    .address-text {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
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
    font-weight: bold;
    letter-spacing: 0px;
    color: #3d3d3d;
    margin-bottom: 20px;
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
    background: #f6f6f6;
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
    background: #2f5de7;
    color: #fff;
  }
  .imgInfo {
    image {
      width: 88px;
      height: 88px;
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
