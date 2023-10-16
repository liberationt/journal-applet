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
    <view class="welMain">
      <!-- <welCropper
        v-if="vdata.welCropperShow"
        @cropdown="cropdown"
        :cropperOptions="vdata.cropperOptions"
      /> -->
      <cropper
        v-if="phoneType() && vdata.welCropperShow"
        @cropdown="cropdown"
        :cropperOptions="vdata.cropperOptions"
      />
      <welCropper
        v-else-if="!phoneType() && vdata.welCropperShow"
        @cropdown="cropdown"
        :cropperOptions="vdata.cropperOptions"
      />
    </view>
    <view class="bottomBtn">
      <view class="titleBox"> 一次只选一题，更容易搜到答案 </view>
      <view class="rephotographBtn" @tap="chooseImg">重拍</view>
      <view class="screenBtn">
        <image
          class="takePhoto"
          @tap="takePhoto"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/ca32529035c64c8081cbbf882d90690e/takePhoto.png"
        />
      </view>
      <view class="bj">
        <!-- 旋转 -->
        <!-- <view @tap="submitUpload">
          <view>
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/77ca315facfe4369b891a6b0a6a5f6c4/revolve.png"
            />
          </view>
        </view> -->
      </view>
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
import { getBaseUrl } from '@/api/url'
import { getToken } from '@/utils/token'

const system = useSystem()
const { navBarHeight } = system.navBarInfo
const router = useRouter()
const vdata = reactive({
  ossFileUrl: '',
  posLeftTopX: 0.05,
  posLeftTopY: 0.33,
  posRightBottomX: 0.95,
  posRightBottomY: 0.58,
  welCropperShow: false,
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
        let data = JSON.parse(res.data)
        vdata.ossFileUrl = data.data[0]
        Taro.redirectTo({
          url: `../singlePhotographResult/index?tempFilePath=${vdata.ossFileUrl}`,
        })
      }
    },
    complete: () => {},
  })
}
//  确定拍照搜题
const takePhoto = async () => {
  // if (!vdata.tempFilePath) {
  //   console.log('加载中')
  // }
  await upLoadImg(vdata.tempFilePath)
}
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
  setTimeout(() => {
    Taro.hideLoading()
  }, 1000)
}
onMounted(async () => {
  Taro.showLoading({
    title: '加载中',
  })
  let timer = setInterval(() => {
    Taro.createSelectorQuery()
      .select('.welMain')
      .boundingClientRect((rec) => {
        if (rec) {
          vdata.mainWidth = rec.width
          vdata.mainHeight = rec.height
          clearInterval(timer)
        }
      })
      .exec()
  }, 100)
  vdata.urlBg = router.params.url
  let req = {
    imgUrl: router.params.url,
  }
  const res = await getSearchQuestion(req)
  if (res.code === 1) {
    //  接口报错，默认选框
    return pointPosition()
  }
  if (res.searchBoxInfoDtoList && res.searchBoxInfoDtoList.length) {
    let width = res.width
    let height = res.height
    let list = [
      {
        x: (vdata.posLeftTopX * width).toFixed(0),
        y: (vdata.posLeftTopY * height).toFixed(0),
      },
      {
        x: (vdata.posRightBottomX * width).toFixed(0),
        y: (vdata.posLeftTopY * height).toFixed(0),
      },
      {
        x: (vdata.posLeftTopX * width).toFixed(0),
        y: (vdata.posRightBottomY * height).toFixed(0),
      },
      {
        x: (vdata.posRightBottomX * width).toFixed(0),
        y: (vdata.posRightBottomY * height).toFixed(0),
      },
    ]
    let singleList = []
    //  搜到题
    res.searchBoxInfoDtoList.forEach((element) => {
      if (
        list[0].x < element.point2dXYList[0].x &&
        list[0].y < element.point2dXYList[0].y &&
        list[3].x > element.point2dXYList[2].x &&
        list[3].y > element.point2dXYList[2].y
      ) {
        singleList = element.point2dXYList
      }
    })
    if (singleList.length) {
      ;(vdata.posLeftTopX = singleList[0].x / width),
        (vdata.posLeftTopY = singleList[0].y / height),
        (vdata.posRightBottomX = singleList[2].x / width),
        (vdata.posRightBottomY = singleList[2].y / height)
    }
    pointPosition()
  } else {
    //  未搜到题，默认选框
    pointPosition()
  }
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
    position: relative;
    height: calc(100% - 140px);
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
