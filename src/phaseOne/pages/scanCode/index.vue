<template>
  <view class="mainContent">
    <NavBar :fixedStyle="vdata.fixedStyle" :white="true" title="拍摄会员卡" />
    <camera
      device-position="back"
      :style="{ height: `calc(100vh - ${navBarHeight + 120}px)`, top: `${navBarHeight}px` }"
      flash="auto"
      mode="normal"
      resolution="high"
      class="cameras"
      frame-size="small"
    >
      <cover-view class="btnScreen">
        <cover-image
          class="screen"
          @tap="takePhoto"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/c963da6c26d04585b377b11d8557949b/screen.png"
        />
      </cover-view>
    </camera>
    <cover-view class="mc" :style="{ top: `${navBarHeight}px` }">
      <!-- 拍照后的回显图片，必须在裁剪蒙层上面，不然不显示 -->
      <cover-image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/card/de26b85801ed4500bfc433733789f686/zzc.png"
      ></cover-image>
      <!-- 拍照蒙层，按照这个裁剪 -->
      <!-- <cover-image :src="vdata.url" v-else></cover-image> -->
    </cover-view>
  </view>
</template>
<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import Taro from '@tarojs/taro'
import { reactive, onMounted } from 'vue'
import { getBaseUrl } from '@/api/url'
import { getOcrFile } from '@/api/index'
import { useSystem } from '@/stores'
import { getToken } from '@/utils/token'
import { debounce } from 'lodash'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const vdata = reactive({
  ctx: '',
  url: '',
  fixedStyle: {
    color: '#fff',
    background: '#000',
  },
})

const takePhoto = debounce(() => {
  const ctx = Taro.createCameraContext()
  ctx.setZoom({
    zoom: 1,
  })
  const token = getToken()
  ctx.takePhoto({
    quality: 'high',
    success: (res) => {
      let tempImagePath = res.tempImagePath
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
            upLoadOcr(JSON.parse(res.data))
          }
        },
      })
    },
  })
}, 500)

const upLoadOcr = (res: any) => {
  if (res.code === 0) {
    const url = res.data[0]
    getOcrFile({ url: url }).then((req: any) => {
      console.log(req, '344444')
      if (req) {
        Taro.navigateTo({
          url: `../activateMember/index?cardNumber=${req}`,
        })
      } else {
        Taro.showToast({
          title: '没有识别，请重新拍摄',
        })
      }
    })
  }
}
// function init(ctx, canvas, tempImagePath) {
//   let img = canvas.createImage()
//   img.src = tempImagePath
//   img.onload = (e) => {
//     vdata.width = img.width
//     // let c_x = img.width * 0.05
//     // let c_w = img.width * 0.89
//     // let c_y = img.height * 0.365
//     // let c_h = img.height * 0.12

//     // let c_x = img.width * 0.03
//     // let c_w = img.width * 0.94
//     // let c_y = img.height * 0.04
//     // let c_h = img.height * 0.6

//     //截取图片指定部分并绘制到canvas
//     // ctx.drawImage(img, c_x, c_y, c_w, c_h, 0, 0, 300, 300 * (c_h / c_w)) //width固定为300,按比例计算出height
//     ctx.drawImage(
//       img,
//       0,
//       0,
//       img.width,
//       img.height,
//       0,
//       0,
//       img.width,
//       img.width * (img.height / img.width)
//     ) //width固定为300,按比例计算出height
//     return
//     //将canvas内容保存为图片
//     // Taro.canvasToTempFilePath({
//     //   canvas: canvas,
//     //   x: 0, //画布x轴起点
//     //   y: 0, //画布y轴起点
//     //   width: img.width, //画布宽度
//     //   height: img.height, //画布高度
//     //   destWidth: img.width, //输出图片宽度
//     //   destHeight: img.height, //输出图片高度
//     //   fileType: 'png',
//     //   success: (res) => {
//     //     // this.setData({
//     //     //   image: res.tempFilePath,
//     //     //   showPic: true,
//     //     // })
//     //     //将图片保存到本地相册
//     //     Taro.saveImageToPhotosAlbum({
//     //       filePath: res.tempFilePath,
//     //     })
//     //   },
//     //   fail: (res) => {
//     //     console.log(res)
//     //   },
//     // })
//   }
//   img.onerror = (e) => {}
// }
onMounted(() => {})
</script>
<style lang="scss">
.mainContent {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  .cameras {
    position: fixed;
    left: 0;
    bottom: 120px;
    right: 0;
  }
  .screen {
    width: 64px;
    height: 64px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .mc {
    position: fixed;
    bottom: 120px;
    left: 0;
    right: 0;
    z-index: 8;
  }
  .btnScreen {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    height: 120px;
    background: #000;
  }
}
</style>
