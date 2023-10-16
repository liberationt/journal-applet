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
      <template #center>
        <cover-view class="center">
          <cover-image
            @tap="vdata.showBg = false"
            class="slPng"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/3c980d030a5b4749bc60622237c72e4b/slIcon.png"
          ></cover-image>
        </cover-view>
      </template>
    </NavBar>
    <camera
      device-position="back"
      :flash="vdata.isOpen ? 'torch' : 'off'"
      class="cameras"
      resolution="high"
      frame-size="small"
      :style="{ height: `calc(100vh - 115px)` }"
    >
    </camera>

    <cover-view class="mc" v-if="vdata.showBg">
      <cover-view class="bg">
        <cover-image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/67adccc40db44c6f92d9e487bbdde0c0/screenbg.png"
        ></cover-image>
      </cover-view>
      <cover-view class="title">
        <cover-image
          class="titleImg"
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
    <view class="radioMain" v-else>
      <view class="radioContent">
        <video
          class="radio"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/907ba11275ed4f3e8d60d0f8ebb58520/sl.mp4"
          :controls="false"
          :autoplay="true"
          :show-play-btn="false"
          :loop="true"
        ></video>
        <view class="radioText">
          <view class="xg">批量整理错题</view>
          <view class="qc">自动去除手写，轻松还原干净题目</view>
          <view class="pz" @tap="toExa">用演示试卷拍拍看</view>
        </view>
        <view class="radioClose" @tap="vdata.showBg = true">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/11086ab08fc44efeb1a79bbddde03017/closeBs.png"
            mode="scaleToFill"
          />
        </view>
      </view>
    </view>
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
      <view class="bj">
        <view class="showBj" v-if="vdata.imageList.length" @tap="submitUpload">
          <view class="bjList">
            <image :src="vdata.imageList[vdata.imageList.length - 1]" />
            <text>{{ vdata.imageList.length }}</text>
          </view>
          <cover-view>编辑</cover-view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '@/components/ProtogenesisNavbar.vue'
import { reactive, onMounted } from 'vue'
import { getBaseUrl } from '@/api/url'
import { getToken } from '@/utils/token'
import { debounce } from '@/utils'
const router = useRouter()
const vdata = reactive({
  ctx: '',
  url: '',
  isOpen: false,
  imageList: [],
  showBg: true,
})
//拍照
const takePhoto = debounce(() => {
  vdata.ctx.takePhoto({
    quality: 'high',
    success: (res) => {
      vdata.imageList.push(res.tempImagePath)
    },
  })
})
//选择图片
const chooseImg = () => {
  Taro.chooseMedia({
    mediaType: ['image'],
    sourceType: ['album'],
    success: (res) => {
      // vdata.imageList.push(res.tempImagePath)
      if (res.tempFiles && res.tempFiles.length) {
        res.tempFiles.forEach((item) => {
          vdata.imageList.push(item.tempFilePath)
        })
      }
    },
  })
}
// 关闭页面
const closePhoto = () => {
  Taro.navigateBack({ delta: router.params.type ? 2 : 1 })
}
const toExa = () => {
  vdata.showBg = true
  Taro.navigateTo({
    url: '../examples/index',
  })
}
//关闭或者打开
const checkOpen = () => {
  vdata.isOpen = !vdata.isOpen
}
const submitUpload = debounce(() => {
  Taro.showLoading({
    title: '正在上传中',
  })
  const arrList = []
  const token = getToken()
  for (let i = 0; i < vdata.imageList.length; i++) {
    Taro.uploadFile({
      url: getBaseUrl() + '/file/upload2ali',
      filePath: vdata.imageList[i],
      name: 'file',
      formData: {
        file: [vdata.imageList[i]],
        moduleName: 'ctb',
      },
      header: {
        wxAccessToken: token,
      },
      success(res) {
        if (res.data) {
          let data = JSON.parse(res.data)
          arrList.push(data.data[0])
        }
      },
      complete: () => {
        i++
        if (arrList.length === vdata.imageList.length) {
          Taro.hideLoading()
          // let imgUrl = arrList.join()
          Taro.navigateTo({
            url: `../wrongQuestion/index`,
          })
          vdata.imageList = []
          Taro.removeStorageSync('photoImgList')
          Taro.setStorageSync('photoImgList', arrList)
        }
      },
    })
  }
})
onMounted(() => {
  vdata.ctx = Taro.createCameraContext()
})
</script>
<style lang="scss">
.mainContent {
  height: 100vh;
  .cameras {
    height: calc(100vh - 115px);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 115px;
    right: 0;
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
      .titleImg {
        width: 228px;
        height: 210px;
      }
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
  .radioMain {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    z-index: 99999;
    .radioContent {
      position: absolute;
      left: 25px;
      right: 25px;
      top: 17%;
      bottom: 13%;
      background: #fff;
      box-sizing: border-box;
      border-radius: 10px;
      padding: 15px;
      .radio {
        width: 100%;
        height: 70%;
      }
      .radioText {
        text-align: center;
        .xg {
          font-family: PingFangSC-Medium;
          font-size: 17px;
          line-height: 20px;
          color: #333333;
          margin-top: 20px;
        }
        .qc {
          font-family: PingFangSC-Regular;
          font-size: 13px;
          line-height: 16px;
          color: #666666;
          margin: 10px auto 20px;
        }
        .pz {
          width: 173px;
          height: 40px;
          border-radius: 20px;
          opacity: 1;
          background: #2f5de7;
          font-family: PingFang SC;
          font-size: 15px;
          line-height: 40px;
          color: #ffffff;
          margin: 0 auto;
        }
      }
      .radioClose {
        position: absolute;
        right: 0;
        width: 20px;
        height: 20px;
        top: -26px;
        image {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>
