<template>
  <view class="mainContent">
    <NavBar title="拍照">
      <template #left>
        <cover-view class="left">
          <cover-image
            @tap="closePhoto"
            class="closeImg"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/defc8daae7ae4d4689dd3f3041702087/closeIcon.png"
          ></cover-image>
        </cover-view>
      </template>
    </NavBar>
    <camera
      device-position="back"
      :flash="vdata.isOpen ? 'torch' : 'off'"
      binderror="error"
      class="cameras"
      resolution="high"
      frame-size="small"
      :style="{ height: `calc(100vh - 115px)` }"
    >
    </camera>

    <cover-view class="mc">
      <cover-view class="bg">
        <cover-image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/67adccc40db44c6f92d9e487bbdde0c0/screenbg.png"
        ></cover-image>
      </cover-view>
      <cover-view class="title">
        <cover-image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/89a1d5bd43994016951d31f410d2676c/screenTitle.png"
        ></cover-image>
      </cover-view>
      <cover-view class="openBtn" @tap="checkOpen">
        <cover-image
          v-if="vdata.isOpen"
          class="openImgs"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/ea22de36918146f49c8ca94c71b29fc1/gb.png"
        ></cover-image>
        <cover-image
          v-else
          class="openImg"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/a0cac92e6e5f4c14b4a28fd39df1595f/zl.png"
        ></cover-image>
        <cover-view> {{ vdata.isOpen ? '轻触关闭' : '轻触照亮' }}</cover-view>
      </cover-view>
    </cover-view>
    <view class="bottomBtn">
      <view class="xc" @tap="chooseImg">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/992a68adb08741e599eb8edc35cc3b9d/xc.png"
        />
        <text>相册</text>
      </view>
      <view class="screenBtn">
        <image
          @tap="takePhoto"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/c963da6c26d04585b377b11d8557949b/screen.png"
        />
      </view>
      <view class="bj"> </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import NavBar from '@/components/ProtogenesisNavbar.vue'
import { reactive, onMounted } from 'vue'
import { getBaseUrl } from '@/api/url'
import { getToken } from '@/utils/token'

const vdata = reactive({
  ctx: '',
  url: '',
  isOpen: false,
  imageList: [],
})
//拍照
function takePhoto() {
  vdata.ctx.takePhoto({
    quality: 'high',
    success: (res) => {
      upLoadImg(res.tempImagePath)
    },
  })
}
//选择图片
const chooseImg = () => {
  Taro.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album'],
    success: (res) => {
      if (res.tempFiles && res.tempFiles.length) {
        upLoadImg(res.tempFiles[0].tempFilePath)
      }
    },
  })
}
const upLoadImg = (filePath) => {
  const token = getToken()
  Taro.uploadFile({
    url: getBaseUrl() + '/file/upload2ali', //仅为示例，非真实的接口地址
    filePath: filePath,
    name: 'file',
    formData: {
      file: [filePath],
      moduleName: 'ctb',
    },
    header: {
      wxAccessToken: token,
    },
    success(res) {
      if (res.data) {
        let data = JSON.parse(res.data)
        let imgUrl = data.data[0]
        Taro.redirectTo({
          url: `../answer/index?imgUrl=${imgUrl}`,
        })
      }
    },
    fail() {
      Taro.showToast({
        title: '上传失败',
        icon: 'none',
        duration: 3000,
      })
    },
  })
}
// 关闭页面
const closePhoto = () => {
  Taro.navigateBack({ delta: 1 })
}
//关闭或者打开
const checkOpen = () => {
  vdata.isOpen = !vdata.isOpen
}

onMounted(() => {
  vdata.ctx = Taro.createCameraContext()
})
</script>
<style lang="scss">
.mainContent {
  height: 100vh;
  .cameras {
    height: calc(100vh - 115px);
  }
  .mc {
    position: fixed;
    bottom: 115px;
    top: 0;
    left: 0;
    right: 0;
    z-index: 8;
    // background: rgba(0, 0, 0, 0.15);
    // background: url('')
    //   no-repeat center;
    // background-size: 100% 100%;
    .bg {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }
    .title {
      width: 228px;
      height: 210px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .openBtn {
      position: absolute;
      left: 50%;
      bottom: 40px;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      .openImg {
        width: 24px;
        height: 30px;
        margin-bottom: 6px;
      }
      .openImgs {
        margin-bottom: 6px;
        width: 24px;
        height: 41px;
      }
    }
  }
  .bottomBtn {
    height: 115px;
    width: 100%;
    background: #000;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    box-sizing: border-box;
    z-index: 10;
    .xc {
      width: 90px;
      padding-left: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      image {
        width: 27px;
        height: 27px;
        margin-bottom: 5px;
      }
    }
    .screenBtn {
      text-align: center;
      image {
        width: 64px;
        height: 64px;
      }
    }
    .bj {
      width: 90px;
      .showBj {
        display: flex;
        align-items: center;
        position: relative;
        .bjList {
          border: 1px solid #fff;
          border-radius: 2px;
          margin-right: 10px;
          position: relative;
          text {
            width: 14px;
            height: 14px;
            background: #ff4040;
            border-radius: 50%;
            position: absolute;
            top: -7px;
            right: -7px;
            text-align: center;
            line-height: 14px;
            font-size: 11px;
            font-family: PingFangSC-Regular;
          }
        }
        image {
          width: 43px;
          height: 43px;
        }
      }
    }
  }
}
</style>
