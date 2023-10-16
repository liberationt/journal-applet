<template>
  <view class="mainContent" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar :fixedStyle="vdata.fixedStyle" :white="true" title="拍照批改" />
    <view class="position" v-if="vdata.show" :animation="vdata.animation">
      <image :src="vdata.url" mode="scaleToFill" />
    </view>
    <camera
      device-position="back"
      :style="getStyle"
      flash="auto"
      mode="normal"
      resolution="high"
      frame-size="small"
      class="cameras"
    >
    </camera>
    <cover-view class="btnScreen">
      <cover-image
        class="screen"
        @tap="takePhoto"
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/d22a39e259c745c890bf2eed36ea4726/screen.png"
      />
    </cover-view>
    <cover-view class="init">
      <cover-view class="broadwise broadwiseLine"></cover-view>
      <cover-view class="broadwise broadwiseLineTwo"></cover-view>
      <cover-view class="direction directionLine"></cover-view>
      <cover-view class="direction directionLineTwo"></cover-view>
      <cover-view class="tip">
        <cover-view class="color">抚平纸张</cover-view>
        <cover-view class="color">平行于参考线拍摄</cover-view>
      </cover-view>
    </cover-view>
  </view>
</template>
<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import Taro from '@tarojs/taro'
import { reactive, onMounted, computed } from 'vue'
import { getBaseUrl } from '@/api/url'
import { getOcrFile } from '@/api/index'
import { useSystem } from '@/stores'
import { getToken } from '@/utils/token'
import { debounce } from '@/utils'

const system = useSystem()
const { navBarHeight } = system.navBarInfo
const vdata = reactive({
  ctx: '',
  url: '',
  show: false,
  fixedStyle: {
    color: '#fff',
    background: '#000',
  },
  animation: {},
})
const getStyle = computed(() => {
  return {
    // height: `calc(100vh - ${navBarHeight + 120}px)`,
    // top: `${navBarHeight}px`,
    // bottom: '120px',
    // position: 'fixed',
  }
})
let animation: any = null
const takePhoto = debounce(() => {
  // animation = Taro.createAnimation({
  //   duration: 5000,
  //   timingFunction: 'ease',
  //   delay: 1000,
  // })
  const ctx = Taro.createCameraContext()
  const token = getToken()
  // ctx.setZoom({
  //   zoom: 1,
  // })
  ctx.takePhoto({
    quality: 'high',
    success: (res) => {
      let tempImagePath = res.tempImagePath
      // animation
      //   .translate(20, 100)
      //   .scale(0.8, 0.6)
      //   .step({ ducation: 300, timingFunction: 'ease' })
      //   .translate(50, 150)
      //   .scale(0.6, 0.2)
      //   .step({ ducation: 300, timingFunction: 'ease' })
      //   .translate(100, 200)
      //   .scale(0.3, 0.1)
      //   .step({ ducation: 300, timingFunction: 'ease' })
      // console.log(animation, 999)
      // animation.rotate(45).scale(0.5, 0.6).step()
      // animation.translate(50, 100).step({ duration: 3000 })
      // animation.translate(130, 150).step({ duration: 2000 })
      // vdata.animation = animation.export()
      Taro.uploadFile({
        url: getBaseUrl() + '/file/upload', //仅为示例，非真实的接口地址
        filePath: tempImagePath,
        name: 'files',
        formData: {
          files: tempImagePath,
          moduleName: 'ctb',
        },
        header: {
          wxAccessToken: token,
        },
        success(res) {
          if (res.data) {
            let data = JSON.parse(res.data)
            if (data.data.length) {
              Taro.redirectTo({
                url: `../dicGrades/index?tempImagePath=${data.data[0]}`,
              })
            }
            // upLoadOcr(JSON.parse(res.data))
          }
        },
      })
    },
  })
})
onMounted(() => {
  animation = Taro.createAnimation({
    duration: 2000,
    timingFunction: 'linear',
    delay: 500,
  })
})
</script>
<style lang="scss">
.mainContent {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  // box-sizing: border-box;
  .cameras {
    // position: fixed;
    // left: 0;
    // right: 0;
    height: calc(100vh - 120px);
  }
  .init {
    position: fixed;
    bottom: 120px;
    top: 0;
    left: 0;
    right: 0;
    z-index: 8;
    .tip {
      top: 40%;
      left: 50%;
      transform: translateX(-50%);
      position: fixed;
      z-index: 10;
      box-sizing: content-box;
      .color {
        text-align: center;
        color: #fff !important;
        margin: 6px auto;
        font-size: 14px;
      }
    }
    .singleQuestion {
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      z-index: 10;
      width: 90%;
      height: 25%;
      border-radius: 10px;
      opacity: 1;
      box-sizing: border-box;
      border: 1px solid #ffffff;
      box-sizing: border-box;
      padding-top: 14%;
      cover-view {
        text-align: center;
        color: #fff !important;
        margin: 6px auto;
        font-size: 14px;
      }
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
      bottom: 120px;
      background: #fff;
    }
    .directionLine {
      left: 33%;
    }
    .directionLineTwo {
      left: 66%;
    }
  }

  .btnScreen {
    // position: fixed;
    // left: 0;
    // bottom: 0;
    // width: 100%;
    // z-index: 100;
    position: relative;
    text-align: center;
    height: 120px;
    background: #000;
    .screen {
      width: 64px;
      height: 64px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .position {
    width: 300px;
    height: 300px;
    position: absolute;
    z-index: 1000;
    // animation-name: myBox;
    /* 动画执行时间 */
    // animation-duration: 4s;
    image {
      width: 300px;
      height: 300px;
    }
  }
  @keyframes myBox {
    0% {
      transform: translate(0, 0);
    }

    25% {
      transform: translate(100px, 100px);
      // transform: scale(0.8, 0.6);
    }

    50% {
      transform: translate(150px, 200px);
      // transform: scale(0.5, 0.3);
    }

    75% {
      transform: translate(200px, 400px);
      // transform: scale(0.5, 0.1);
    }

    100% {
      // transform: translate(200px, 420px);
      transform: scale(0.1, 0.1);

      // transform: scale(0.1, 0.1);
    }
  }
}
</style>
