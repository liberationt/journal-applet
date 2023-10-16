<template>
  <view class="mainContent" :style="{ paddingTop: `${navBarHeight + 33}px` }">
    <NavBar :title="'激活会员'" />
    <view class="memberImg">
      <!-- <view class="gread">{{ vdata.termTxt }}</view> -->
      <view class="memberContet">
        <view class="displayFlex">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/mb/da992c2879ea4eccbb94ba241bc2fc44/xtb.png"
            alt=""
          />
          <text>教育周报会员</text>
        </view>
        <view class="cx">·畅学教育周报全部精品资源·</view>
      </view>
    </view>
    <view class="form-content" :style="{ top: `${navBarHeight + 140}px` }">
      <view class="title">激活期刊会员</view>
      <view :class="vdata.showError && 'errorBorder'">
        <view class="inputInfo">
          <input
            placeholder="请输入激活码"
            type="number"
            :value="vdata.cardPassword"
            @input="getVal"
            :selectionStart="100"
            :selectionEnd="100"
          />
          <image
            v-if="vdata.cardPassword"
            @tap="clearInput"
            class="close-img"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/41cde43ac6eb4dae99fe55bf5f889baf/close.png"
            mode="scaleToFill"
          />
          <image @tap="getScreen" class="sm-img" src="@/assets/images/saomiao.png" alt="" />
        </view>
        <view class="errorMsg" v-if="vdata.showError && vdata.cardPassword">{{
          vdata.errorMsg
        }}</view>
      </view>
      <view
        :class="['operationBtn', vdata.cardPassword && 'active']"
        @tap="vdata.cardPassword && submit()"
        >立即激活</view
      >
      <view class="goMember" @tap="goMember">
        <text>没有激活码？</text>
        <text class="memberColor">去购买期刊会员 ></text>
      </view>
      <view class="to-home" @tap="toHome" v-if="vdata.isNot">先去首页看看</view>
    </view>
    <nut-overlay v-model:visible="vdata.camera" :lock-scroll="true">
      <view class="cameraMain">
        <view class="title">相机权限</view>
        <view>请在「设置」选项中</view>
        <view>允许小程序访问您的摄像头</view>
        <view class="authSetting" @tap="setCamera">去开启摄像头权限</view>
      </view>
    </nut-overlay>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { reactive, onMounted } from 'vue'
import { useSystem, useUser } from '@/stores'
import { memberActivate } from '@/api/index'
import { getMember } from '@/api/user'
import { debounce } from 'lodash'
const system = useSystem()
const user = useUser()
const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  cardPassword: '',
  showError: false,
  errorMsg: '',
  camera: false,
  isNot: true,
  vipName: '',
  termTxt: '',
})
//激活会员
const submit = () => {
  let params = {
    cardPassword: vdata.cardPassword,
  }
  memberActivate(params)
    .then(async (req: any) => {
      //req存在 说明失败了
      if (req) {
        vdata.showError = true
        vdata.errorMsg = req.msg
      } else {
        const res: any = await getMember()
        user.setVip(res)
        await user.setUserInfo()
        setTimeout(() => {
          toHome()
        }, 500)
      }
    })
    .catch((err) => {
      vdata.showError = true
      vdata.errorMsg = err.msg
    })
}
// 打开授权
const setCamera = () => {
  Taro.openSetting({
    success: function (res) {
      console.log(res.authSetting)
      res.authSetting = {
        'scope.camera': true,
      }
    },
  })
}
const getVal = (e) => {
  vdata.cardPassword = e.detail.value
  if (!e.detail.value) {
    vdata.showError = false
  }
}
// 开通会员
const goMember = () => {
  Taro.navigateTo({
    url: '../memberPurchase/index',
  })
}
const clearInput = () => {
  vdata.cardPassword = ''
  vdata.showError = false
  vdata.errorMsg = ''
}
//去首页
const toHome = () => {
  if (user.userInfo?.userType) {
    Taro.switchTab({
      url: '/pages/index/index',
    })
  } else {
    Taro.redirectTo({
      url: '../identity/index',
    })
  }
}
//拍照
const getScreen = debounce(() => {
  // Taro.navigateTo({
  //   url: '../scanCode/index',
  // })
  Taro.getSetting({
    success: function (res) {
      if (!res.authSetting['scope.camera']) {
        if (!Taro.getStorageSync('camera')) {
          Taro.authorize({
            scope: 'scope.camera',
            success: function () {
              Taro.setStorageSync('camera', 1)
              Taro.navigateTo({
                url: '../scanCode/index',
              })
            },
            fail: function () {
              Taro.setStorageSync('camera', 1)
            },
          })
        } else {
          vdata.camera = true
        }
      } else {
        Taro.navigateTo({
          url: '../scanCode/index',
        })
      }
    },
  })
}, 500)
onMounted(() => {
  const { params } = useRouter()
  if (params?.cardNumber) {
    vdata.cardPassword = params.cardNumber
  }
  if (params?.isNot) {
    vdata.isNot = false
  }
  // getMemberDetail().then((res: any) => {
  //   vdata.vipName = res.vipName || ''
  //   vdata.termTxt = res.termTxt || ''
  // })
})
</script>
<style lang="scss">
@import './index.scss';
.cameraMain {
  background: #fff;
  width: 265px;
  height: 192px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  color: #999999;
  .title {
    font-family: PingFang SC;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 14px;
  }
  .authSetting {
    width: 162px;
    height: 40px;
    border-radius: 21px;
    background: #2f5de7;
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    line-height: 40px;
    margin-top: 22px;
  }
}
</style>
