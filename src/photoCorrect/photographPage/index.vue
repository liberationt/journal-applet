<template>
  <view class="mainContent">
    <view>
      <NavBar title="拍照">
        <template #left>
          <cover-view class="left">
            <cover-image
              @tap="closePhoto"
              class="closeImg"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/11086ab08fc44efeb1a79bbddde03017/closeBs.png"
            ></cover-image>
          </cover-view>
        </template>
        <template #center>
          <cover-view class="center">
            <cover-image
              class="slPng"
              v-if="!vdata.isExamples"
              @tap="giveExamples"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/c76f67d82d7a4571b02d9fdc5506e278/sl.png"
            ></cover-image>
            <cover-view :style="{ color: '#fff' }" v-else>支持学语文、英语批改</cover-view>
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
      >
      </camera>
      <cover-view v-show="vdata.isExamples" class="viewExamples">
        <cover-image
          class="imgExamples"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/57214481463f49478baf165b3c2bc163/examplesBg.png"
        ></cover-image>
      </cover-view>
      <!-- <cover-view class="singleSuestion"></cover-view> -->
      <cover-view class="init">
        <cover-view class="broadwise broadwiseLine"></cover-view>
        <cover-view class="broadwise broadwiseLineTwo"></cover-view>
        <cover-view class="direction directionLine"></cover-view>
        <cover-view class="direction directionLineTwo"></cover-view>
        <cover-view class="tip">
          <cover-view>一次拍摄一整页</cover-view>
          <cover-view>题目与参考线平行</cover-view>
        </cover-view>
      </cover-view>

      <cover-view class="mc">
        <cover-view> </cover-view>
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
    </view>
    <cover-view class="arrowBox" v-show="vdata.isExamples">
      <cover-view class="arrow">点击下方体验拍照搜题</cover-view>
      <cover-view class="arrowhead"></cover-view>
    </cover-view>
    <view class="bottomBtn">
      <view class="titleBox" v-if="!vdata.isExamples"> 目前支持教育周报小学语文、英语批改 </view>
      <view class="xc" @tap="chooseImg">
        <view class="xc" v-show="!vdata.isExamples">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/992a68adb08741e599eb8edc35cc3b9d/xc.png"
          />
          <text>相册</text>
        </view>
      </view>
      <view class="screenBtn">
        <image
          @tap="takePhoto"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/c963da6c26d04585b377b11d8557949b/screen.png"
        />
        <!-- <image
          @tap="takePhoto"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/6dbd83807001441abc35dbf63adb141c/circularLoad.gif"
        /> -->
      </view>
      <view class="bj"> </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import NavBar from '@/components/ProtogenesisNavbar.vue'
import { reactive, onMounted, watch } from 'vue'
import { getBaseUrl } from '@/api/url'
import { getToken } from '@/utils/token'
import { debounce } from 'lodash'
// import { url } from 'inspector'

const vdata = reactive({
  show: false,
  tempFilePath: '',
  questionType: 2,
  titleList: [
    { value: 1, label: '搜单题' },
    { value: 2, label: '搜整页' },
  ],
  ctx: '',
  url: '',
  isExamples: false,
  isOpen: false,
  examplesBg:
    'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/57214481463f49478baf165b3c2bc163/examplesBg.png',
})
//  点击示例
const giveExamples = () => {
  vdata.isExamples = true
}
//拍照
const takePhoto = debounce(() => {
  if (vdata.isExamples) {
    Taro.redirectTo({
      url: `/photoSearch/examplesResult/index?tempFilePath=${vdata.examplesBg}&type=1`,
    })
  } else {
    vdata.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        upLoadImg(res.tempImagePath)
      },
    })
  }
}, 500)
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
  Taro.showLoading({
    title: '加载中...',
  })
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
        Taro.hideLoading()
        Taro.redirectTo({
          url: `../photographResult/index?tempFilePath=${imgUrl}`,
        })
      }
    },
    fail() {
      Taro.hideLoading()
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
  // Taro.redirectTo({
  //   url: '../index/index',
  // })
  if (vdata.isExamples) {
    vdata.isExamples = false
  } else {
    Taro.navigateBack({ delta: 1 })
  }
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
  .cameras {
    height: calc(100vh - 140px);
  }
  .broadwise {
    position: fixed;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 1px;
    background: hsl(0, 0%, 100%);
  }
  .broadwiseLine {
    top: 30%;
  }
  .broadwiseLineTwo {
    top: 57%;
  }
  .direction {
    z-index: 9;
    top: 0;
    position: fixed;
    width: 1px;
    height: 100%;
    background: #fff;
  }
  .directionLine {
    left: 33%;
  }
  .directionLineTwo {
    left: 66%;
  }
  .viewExamples {
    position: fixed;
    top: 30%;
    left: 5%;
    transform: translateY(-25%);
    z-index: 9;
    width: 90%;
    height: 65%;
    .imgExamples {
      width: 325px;
      height: 520px;
      margin: 0 auto;
    }
  }
  .bg_FilePath {
    background: #000;
    padding: 0 20px;
    height: calc(100vh - 140px);
    padding-top: 25px;
    width: 100%;

    view {
      width: 100%;
      height: calc(100vh - 165px);
    }
  }
  .init {
    position: fixed;
    bottom: 140px;
    top: 0;
    left: 0;
    right: 0;
    z-index: 8;
    .tip {
      top: 40%;
      left: 50%;
      transform: translateX(-50%);
      position: fixed;
      width: 175px;
      z-index: 10;
      box-sizing: content-box;
      text-align: center;
      color: #fff !important;
      margin: 6px auto;
      font-size: 14px;
    }
  }

  .mc {
    position: fixed;
    bottom: 140px;
    top: 0;
    left: 0;
    right: 0;
    z-index: 8;
    background: rgba(0, 0, 0, 0.15);
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
    height: 140px;
    width: 100%;
    background: #000;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding-bottom: 30px;
    color: #fff;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    box-sizing: border-box;
    // padding: 0 16px 0 50px;
    z-index: 10;
    position: relative;
    .titleBox {
      position: absolute;
      top: 10px;
      left: 50%;
      text-align: center;
      font-size: 14px;
      transform: translateX(-50%);
      width: 100%;
    }
    .xc {
      width: 90px;
      padding-left: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 10px;
      image {
        width: 27px;
        height: 27px;
        margin-bottom: 5px;
      }
    }
    .screenBtn {
      text-align: center;
      padding-top: 10px;

      image {
        width: 64px;
        height: 64px;
      }
      .takePhoto {
        width: 52px;
        height: 52px;
      }
    }
    .bj {
      width: 90px;
      padding-left: 30px;
      padding-top: 10px;
      image {
        width: 21px;
        height: 21px;
      }
    }
  }
}
.showNone {
  display: none;
}
.arrowBox {
  width: 160px;
  height: 40px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 120px;
  z-index: 99;
  animation-name: beat;
  /*动画名称*/
  animation-duration: 0.4s;
  /*设置秒数*/
  animation-timing-function: linear;
  /*速度曲线*/
  animation-iteration-count: infinite;
  /*播放次数*/
  animation-direction: alternate;
  /*逆向播放*/
  animation-play-state: running;
  /*正在运行*/
}
.arrow {
  background: #0256ff;
  border-radius: 6px;
  width: 160px;
  height: 30px;
  // top: -20px;
  color: #fff;

  text-align: center;
  line-height: 30px;
  font-size: 14px;
}
.arrowhead {
  width: 12px;
  height: 12px;
  background: #0256ff;
  margin: 0 auto;
  transform: rotate(45deg);
  margin-top: -6px;
}
@keyframes beat {
  0% {
    bottom: 110px;
  }

  100% {
    bottom: 120px;
  }
}
</style>
