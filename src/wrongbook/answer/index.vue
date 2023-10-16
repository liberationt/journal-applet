<template>
  <view class="answerContent" :style="{ paddingTop: `${navBarHeight + 12}px` }">
    <NavBar :title="'答案'" />
    <view class="imageContent" v-if="!vdata.mainHeight"> </view>
    <view class="welMain" v-else>
      <cropper v-if="phoneType()" @cropdown="cropdown" :cropperOptions="vdata.cropperOptions" />
      <welCropper v-else @cropdown="cropdown" :cropperOptions="vdata.cropperOptions" />
    </view>
    <view class="bottomBtn">
      <view class="newP">
        <view class="newOpera" @tap="resetImg">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/88b0663e6f7e4b6dac561ff3c77d8182/xiangji.png"
            mode="scaleToFill"
          />
          <text>重拍</text>
        </view>
      </view>
      <view class="btn">
        <view class="calc" @tap="calc">取消</view>
        <view class="submit" v-if="!vdata.isLoading" @tap="submit">保存</view>
        <nut-button v-else :loading="vdata.isLoading" type="primary">保存中</nut-button>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro'
import welCropper from '@/components/welCropper.vue'
import cropper from '@/components/cropper.vue'
import { phoneType } from '@/utils/index'
import NavBar from '@/components/NavBar.vue'
import { reactive, onMounted, nextTick } from 'vue'
import { getBaseUrl } from '@/api/url'
import { useSystem } from '@/stores'
import { getToken } from '@/utils/token'

import { updateAnswer } from '@/api/wrongbook'
const system = useSystem()
const router = useRouter()
const { navBarHeight } = system.navBarInfo
const vdata = reactive({
  cropperOptions: {
    hidden: true,
    src: '',
    mode: 'rectangle',
    sizeType: ['original'],
    boxQuestionHeight: '',
  },
  imgUrl: '',
  mainHeight: '',
  isLoading: false,
})
//获取裁剪图片
const cropdown = ({ res }) => {
  if (res?.tempFilePath) {
    vdata.imgUrl = res.tempFilePath
  }
}
//重拍
const resetImg = () => {
  Taro.redirectTo({
    url: '../answerGraph/index',
  })
}
const calc = () => {
  Taro.navigateBack({ delta: 1 })
}
const submit = () => {
  vdata.isLoading = true
  const token = getToken()
  let timer = setTimeout(() => {
    if (vdata.imgUrl) {
      Taro.uploadFile({
        url: getBaseUrl() + '/file/upload2ali', //仅为示例，非真实的接口地址
        filePath: vdata.imgUrl,
        name: 'file',
        formData: {
          file: [vdata.imgUrl],
          moduleName: 'ctb',
        },
        header: {
          wxAccessToken: token,
        },
        success(res) {
          if (res.data) {
            let data = JSON.parse(res.data)
            Taro.setStorageSync('imageUrl', data.data[0])
            Taro.navigateBack({ delta: 1 })
          }
        },
        fail() {
          Taro.showToast({
            title: '上传失败',
            icon: 'none',
            duration: 3000,
          })
        },
        complete() {
          vdata.isLoading = false
        },
      })
    } else {
      submit()
    }
  }, 1000)
}
onMounted(() => {
  const { params } = router
  nextTick(() => {
    let timer = setInterval(() => {
      Taro.createSelectorQuery()
        .select('.imageContent')
        .boundingClientRect((rec) => {
          if (rec) {
            if (params?.imgUrl) {
              vdata.cropperOptions.src = params.imgUrl
            }
            vdata.mainHeight = rec.height
            vdata.cropperOptions.boxQuestionHeight = rec.height - 20
            clearInterval(timer)
          }
        })
        .exec()
    }, 100)
  })
  // vdata.cropperOptions.src = params.imgUrl
})
</script>
<style lang="scss">
.answerContent {
  height: 100vh;
  display: flex;
  padding-bottom: 115px;
  box-sizing: border-box;
  flex-direction: column;
  .imageContent {
    flex: 1;
  }
  .welMain {
    flex: 1;
    position: relative;
  }
  .bottomBtn {
    height: 115px;
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    box-sizing: border-box;
    padding: 20px 15px 55px;
    z-index: 10;
    .newOpera {
      display: flex;
      align-items: center;
      image {
        width: 14px;
        height: 13px;
        margin-right: 4px;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      view {
      }
      .nut-button--normal {
        // padding: 0;
        // width: 95px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        border-radius: 25px;
      }
      .calc {
        color: #333333;
        box-sizing: border-box;
        border: 1px solid #c8c8c8;
        margin-right: 20px;
        width: 95px;
        height: 40px;
        text-align: center;
        line-height: 38px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        border-radius: 25px;
      }
      .submit {
        background: #2f5de7;
        color: #fff;
        width: 95px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        border-radius: 25px;
      }
    }
  }
}
</style>
