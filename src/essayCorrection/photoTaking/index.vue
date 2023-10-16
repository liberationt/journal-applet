<template>
  <view class="photoTaking" :style="{ paddingTop: `${navBarHeight + 12}px` }">
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
    </NavBar>
    <view class="welMain" :style="{ top: `${navBarHeight + 12}px` }">
      <cropper
        v-if="phoneType() && vdata.welCropperShow"
        @cropdown="cropdown"
        :isVertical="vdata.isVertical"
        :cropperOptions="vdata.cropperOptions"
      />
      <welCropper
        v-else-if="!phoneType() && vdata.welCropperShow"
        @cropdown="cropdown"
        :isVertical="vdata.isVertical"
        :cropperOptions="vdata.cropperOptions"
      />
    </view>
    <view class="bottomBtn">
      <view class="titleBox"> 框出语文作文手稿，建议不要包含题目信息 </view>
      <view class="rephotographBtn" @tap="chooseImg">重拍</view>
      <view class="screenBtn">
        <image
          class="takePhoto"
          @tap="takePhoto"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/ca32529035c64c8081cbbf882d90690e/takePhoto.png"
        />
      </view>
      <view class="bj"> </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import NavBar from '@/components/ProtogenesisNavbar.vue'
import { reactive, onMounted, watch, ref } from 'vue'
import { useSystem } from '@/stores'
// import welCropper from '@/components/welCropper.vue'
import welCropper from '@/components/welCropper.vue'
import cropper from '@/components/cropper.vue'
import { phoneType } from '@/utils/index'
import Taro, { useRouter } from '@tarojs/taro'
import { getSearchQuestion } from '@/api/photoSearch'
import { getToken } from '@/utils/token'
import { debounce } from '@/utils/index'
import { getBaseUrl } from '@/api/url'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const router = useRouter()
const vdata = reactive({
  ossFileUrl: '',
  posLeftTopX: 0.01,
  posLeftTopY: 0.01,
  posRightBottomX: 0.99,
  posRightBottomY: 0.99,
  welCropperShow: false,
  isVertical: false,
  mainWidth: '',
  mainHeight: '',
  urlBg: '',
  cropperOptions: {
    hidden: true,
    src: '',
    mode: 'rectangle',
    sizeType: ['original'],
    type: 'pzst',
  },
  tempFilePath: '',
  isSubmit: true,
})
watch(
  () => vdata.urlBg,
  () => {
    vdata.cropperOptions.src = vdata.urlBg
  }
)
//  切割后的图片
const cropdown = ({ res }) => {
  if (res?.tempFilePath) {
    vdata.tempFilePath = res.tempFilePath
  }
}
//  上传图片
const upLoadImg = (filePath) => {
  Taro.showLoading({
    title: '正在上传',
  })
  const token = getToken()
  Taro.uploadFile({
    url: getBaseUrl() + '/file/upload2ali',
    filePath: filePath,
    name: 'file',
    formData: {
      file: [filePath],
      moduleName: 'pzst',
    },
    header: {
      wxAccessToken: token,
    },
    success(res) {
      if (res.data) {
        Taro.hideLoading()
        let data = JSON.parse(res.data)
        vdata.ossFileUrl = data.data[0]
        Taro.redirectTo({
          url: `../composition/index?tempFilePath=${vdata.ossFileUrl}`,
        })
      }
    },
    fail(err) {
      console.log(err)
    },
    complete: () => {
      vdata.isSubmit = true
    },
  })
}
//  确定拍照搜题
const takePhoto = debounce(async () => {
  // if (!vdata.tempFilePath) {
  //   console.log('加载中')
  // }
  if (!vdata.isSubmit) {
    return
  }
  vdata.isSubmit = false
  if (!vdata.tempFilePath) {
    Taro.showLoading({
      title: '图片处理中',
    })
    let timer = setInterval(async () => {
      if (vdata.tempFilePath) {
        Taro.hideLoading()
        upLoadImg(vdata.tempFilePath)
        clearInterval(timer)
        timer = null
      }
    }, 500)
  } else {
    await upLoadImg(vdata.tempFilePath)
  }
})
//  重拍
const chooseImg = () => {
  Taro.redirectTo({
    url: '../photographPage/index',
  })
}
// 关闭页面
const closePhoto = () => {
  Taro.redirectTo({
    url: '../photographPage/index',
  })
}
const pointPosition = () => {
  const cropperOptions = Object.assign(vdata.cropperOptions, {
    boxQuestionHeight: vdata.mainHeight,
    boxQuestionTop: 0,
    canvasType: false,
    src: vdata.urlBg,
    editImgInfo: {
      originalImgUrl: vdata.urlBg,
      posLeftTopX: vdata.posLeftTopX,
      posLeftTopY: vdata.posLeftTopY,
      posRightBottomX: vdata.posRightBottomX,
      posRightBottomY: vdata.posRightBottomY,
    },
  })
  vdata.cropperOptions = cropperOptions
  vdata.welCropperShow = true
}
onMounted(async () => {
  vdata.isVertical = router.params.isVertical && router.params.isVertical == 2 ? true : false
  let timer = setInterval(() => {
    Taro.createSelectorQuery()
      .select('.welMain')
      .boundingClientRect((rec) => {
        if (rec) {
          vdata.urlBg = router.params.url
          vdata.mainWidth = rec.width
          vdata.mainHeight = rec.height
          pointPosition()
          clearInterval(timer)
        }
      })
      .exec()
  }, 100)
  //  接口报错，默认选框
})
</script>
<style lang="scss">
.photoTaking {
  width: 100%;
  height: 100vh;
  background: #000;
  padding-top: 100px;
  // position: relative;
  .welMain {
    position: fixed;
    // top:0;
    left: 0;
    bottom: 140px;
    right: 0;
    // height: calc(100vh - 140px);
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

    .titleBox {
      position: absolute;
      top: 10px;
      left: 0;
      font-size: 13px;
      text-align: center;
      width: 100%;
      font-size: 14px;
    }
    .rephotographBtn {
      padding-left: 40px;

      width: 90px;
      height: 58px;
      text-align: center;
      line-height: 58px;
      font-size: 16px;
      color: #ffffff;
    }
    .screenBtn {
      text-align: center;
      padding-top: 10px;

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
</style>
