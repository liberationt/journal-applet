<template>
  <view class="mainContent">
    <view>
      <NavBar title="">
        <template #left>
          <cover-view class="left">
            <cover-image
              @tap="closePhoto"
              class="closeImg"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/11086ab08fc44efeb1a79bbddde03017/closeBs.png"
            ></cover-image>
          </cover-view>
        </template>
      </NavBar>
      <cover-image :src="vdata.url" class="bgImg" v-if="vdata.url"></cover-image>
      <camera
        v-else
        device-position="back"
        :flash="vdata.isOpen ? 'torch' : 'off'"
        binderror="error"
        class="cameras"
        resolution="high"
        frame-size="small"
      >
      </camera>
      <cover-view class="init">
        <cover-view class="broadwise broadwiseLine"></cover-view>
        <cover-view class="broadwise broadwiseLineTwo"></cover-view>
        <cover-view class="direction directionLine"></cover-view>
        <cover-view class="direction directionLineTwo"></cover-view>
        <cover-view class="tip">
          <cover-view>请竖屏正对纸面拍摄</cover-view>
          <cover-view>文字对齐参考线 </cover-view>
          <cover-view>清晰拍摄整页题目 </cover-view>
        </cover-view>
      </cover-view>

      <cover-view class="mc" v-if="!vdata.url">
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
    <view class="bottomBtn" v-if="!vdata.url">
      <view class="xc" @tap="chooseImg">
        <view class="xc">
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
      </view>
      <view class="bj"> </view>
    </view>
    <canvas
      canvas-id="my-canvas"
      v-show="false"
      :style="{
        width: `${vdata.canvasWidth}px`,
        height: `${vdata.canvasHeight}px`,
        position: 'absolute',
        top: '-2000%',
      }"
    >
    </canvas>
    <!-- <view :class="['bottomBtn', 'bottomBtns']" v-else>
      <view @tap="vdata.url = ''">重拍 </view>
      <view @click="toPhoto"> 使用照片 </view>
    </view> -->
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import NavBar from '@/components/ProtogenesisNavbar.vue'
import { reactive, onMounted, watch } from 'vue'
import { getBaseUrl } from '@/api/url'
import { getToken } from '@/utils/token'

const vdata: any = reactive({
  show: false,
  ctx: '',
  url: '',
  isOpen: false,
  canvasWidth: 0,
  canvasHeight: 0,
})
//拍照
function takePhoto() {
  vdata.ctx.takePhoto({
    quality: 'high',
    // success: (res) => {
    //   upLoadImg(res.tempImagePath)
    // },
    success: async (restp) => {
      // 拍照时候判断手机是否的方向横向还是竖向，使用异步函数，防止异步问题
      console.log(123456)
      await new Promise(function (resolve, reject) {
        // 开启监听设备方向
        Taro.startDeviceMotionListening({
          success: function (e) {
            console.log('监听成功')
            // 监听设备方向变化事件
            Taro.onDeviceMotionChange(function (resodm) {
              console.log(123456, resodm.gamma)
              // Y 轴转动的夹角（gamma）大于40或者小于-40时认为为横屏拍摄
              if (resodm.gamma < -40 || resodm.gamma > 40) {
                //取消监听设备方向变化事件
                console.log('横屏', resodm.gamma)
                Taro.offDeviceMotionChange()
                vdata.url = restp.tempImagePath
                console.log(vdata.url, 'uuuuuuuuu')
                Taro.getImageInfo({
                  src: restp.tempImagePath,
                  success(resgi) {
                    console.log('图片信息')
                    //创建 canvas 的绘图上下文 CanvasContext 对象
                    let canvasContext = Taro.createCanvasContext('my-canvas')
                    //存放旋转后的图片的画布的宽高
                    vdata.canvasWidth = resgi.height
                    vdata.canvasHeight = resgi.width
                    canvasContext.translate(resgi.height / 2, resgi.width / 2)
                    console.log(
                      'vdata.canvasWidth===>',
                      vdata.canvasWidth,
                      'vdata.canvasHeight==>',
                      vdata.canvasHeight
                    )
                    if (resodm.gamma < -40) {
                      //开始旋转操作，gamma小于-40顺时针旋转90度
                      canvasContext.rotate((90 * Math.PI) / 180)
                    } else {
                      //开始旋转操作，gamma小于40逆时针旋转90度
                      canvasContext.rotate((-90 * Math.PI) / 180)
                    }

                    canvasContext.drawImage(
                      restp.tempImagePath,
                      -resgi.width / 2,
                      -resgi.height / 2,
                      resgi.width,
                      resgi.height
                    )
                    canvasContext.draw(true, async () => {
                      console.log('开始绘画')
                      // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
                      await new Promise(function (resolve, reject) {
                        Taro.canvasToTempFilePath(
                          {
                            // 把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。
                            canvasId: 'my-canvas',
                            success(res) {
                              console.log('wx.canvasToTempFilePath', res.tempFilePath)
                              console.log(res)
                              let filePath = res.tempFilePath
                              vdata.url = filePath
                              upLoadImg(vdata.url)
                              resolve()
                            },
                          },
                          this
                        )
                      })
                    })
                  },
                  fail: () => {
                    console.log('获取失败')
                  },
                })
                // upLoadImg(restp.tempImagePath)
                // resolve()
              } else {
                console.log('竖屏')
                vdata.url = restp.tempImagePath
                // upLoadImg(restp.tempImagePath)
                vdata.isVertical = 1
                Taro.offDeviceMotionChange()
                resolve()
              }
            })
            // Taro.stopDeviceMotionListening({
            //   success: (res) => {},
            // })
          },
          fail: function (e) {
            console.log('失败了')
            //关闭面板
            Taro.stopDeviceMotionListening({
              success: (res) => {},
            })
            reject()
          },
        })
      })
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
        console.log(imgUrl, 'imgUrlimgUrlimgUrlimgUrl')
        // vdata.url = imgUrl
        // Taro.redirectTo({
        //   url: `../correctionResults/index?tempFilePath=${imgUrl}`,
        // })
      }
    },
    fail() {
      // Taro.showToast({
      //   title: '上传失败',
      //   icon: 'none',
      //   duration: 3000,
      // })
    },
  })
}
// 关闭页面
const closePhoto = () => {
  Taro.navigateBack({ delta: 1 })
}
const toPhoto = () => {
  Taro.navigateTo({
    url: `../photoTaking/index?url=${vdata.url}`,
  })
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
  .cameras,
  .bgImg {
    height: calc(100vh - 110px);
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
    height: calc(100vh - 110px);
    padding-top: 25px;
    width: 100%;

    view {
      width: 100%;
      height: calc(100vh - 165px);
    }
  }
  .init {
    position: fixed;
    bottom: 110px;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    width: 100%;
    .tip {
      top: 30%;
      position: fixed;
      text-align: center;
      width: 100%;
      left: 0;
      right: 0;
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
    bottom: 110px;
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
    height: 110px;
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
  .bottomBtns {
    padding: 0 30px;
  }
}
</style>
