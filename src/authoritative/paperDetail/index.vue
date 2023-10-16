<template>
  <view class="paperDetailMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar title="试卷详情" :fixedStyle="vdata.fixedStyle" />
    <view class="topText">
      <view>{{ authoritative.paperInfo?.pdfTitle }}</view>
      <view class="answer" v-if="authoritative.paperInfo?.paperAnswerImageUrls?.length"
        >含答案</view
      >
    </view>

    <view class="footer">
      <view>导出后打印作答，效率更高</view>
      <view class="opera">
        <view class="operaItem" @tap="shareWx">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/93d2d57e04934660a12c7022f6b42203/wx.png"
          />
          <view>微信发送</view>
        </view>
        <view @tap="copyUrl">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/233836ffacfd4c22851b91f1e1b3ca59/fuzhilianjie.png"
          />
          <view>复制链接</view>
        </view>
      </view>
    </view>
    <template v-if="vdata.isLoading">
      <view class="loadingMain" :style="{ top: `${navBarHeight}px` }">
        <view class="loadingToast">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwzl/7cfafe0eed934b1dbe88745b11c699b5/prosse.png"
            mode="scaleToFill"
          />
          <view class="progress">{{ vdata.progress }}%</view>
          <view>试卷加载中</view>
        </view>
      </view>
    </template>
    <scroll-view
      v-else
      class="scroll-content"
      scroll-y="true"
      :style="{
        height: `calc(100vh - ${navBarHeight + 132 + vdata.topHeight - 16}px)`,
        top: `${navBarHeight + vdata.topHeight - 16}px`,
      }"
    >
      <view class="paperList">
        <view
          class="paperItem"
          v-for="(item, i) in vdata.imageList"
          :key="item"
          @tap="lookDetail(i)"
        >
          <image
            mode="widthFix"
            :src="item"
            :style="{ width: vdata.imgSize[i + '_' + 'index'] || 0 }"
            @load="(e) => getImgSize(e, i + '_' + 'index')"
          ></image>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useUnload, useDidHide } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, useAuthoritative } from '@/stores'
const system = useSystem()
const authoritative: any = useAuthoritative()
const { navBarHeight } = system.navBarInfo
import { nextTick, reactive, ref } from 'vue'
const vdata: any = reactive({
  fixedStyle: {
    background: '#f3f6ff',
  },
  topHeight: 0,
  mainWidth: 0,
  isLoading: true,
  progress: 0,
  timer: null,
  imageList: [],
  imgSize: {},
})
const lookDetail = (index) => {
  Taro.previewImage({
    current: vdata.imageList[index], // 当前显示图片的http链接
    urls: vdata.imageList, // 需要预览的图片http链接列表
  })
}
const getImgSize = (e, index, type?: Number) => {
  let maxWidth = type || vdata.mainWidth
  const { width } = e.detail

  if (width > maxWidth) {
    vdata.imgSize[index] = `${maxWidth}px`
  } else {
    vdata.imgSize[index] = `${width}px`
  }
}
const shareWx = () => {
  Taro.showLoading({ title: '文件生成中...' })
  Taro.downloadFile({
    url: authoritative.paperInfo.mergePdfUrl,
    success: function (res) {
      const filePath = res.tempFilePath
      Taro.shareFileMessage({
        filePath: filePath,
        fileName: `${authoritative.paperInfo.pdfTitle}`,
        fail() {
          Taro.showToast({
            title: '取消分享',
            icon: 'none',
            duration: 2000,
          })
          Taro.hideLoading()
        },
        success() {
          Taro.hideLoading()
          Taro.showToast({
            title: '分享成功',
            icon: 'none',
            duration: 2000,
          })
        },
      })
    },
  })
}
const copyUrl = () => {
  Taro.setClipboardData({
    data: authoritative.paperInfo?.mergePdfUrl,
    success(res) {
      console.log(res)
    },
  })
}
const isLoading = () => {
  vdata.timer = setInterval(() => {
    if (vdata.progress < 98) {
      vdata.progress = Math.min(100, vdata.progress + 9)
    } else {
      vdata.progress = 100
      vdata.isLoading = false
      clearInterval(vdata.timer)
      vdata.timer = null
    }
  }, 200)
}
const getImageList = () => {
  if (authoritative.paperInfo.paperAnswerImageUrls) {
    vdata.imageList = authoritative.paperInfo.paperImageUrls.concat(
      authoritative.paperInfo.paperAnswerImageUrls
    )
  } else {
    vdata.imageList = authoritative.paperInfo.paperImageUrls
  }
}
useDidShow(() => {
  let timer = setInterval(() => {
    Taro.createSelectorQuery()
      .select('.topText')
      .boundingClientRect((rec) => {
        if (rec) {
          vdata.topHeight = rec.height
          vdata.mainWidth = rec.width
          clearInterval(timer)
          timer = null
        }
      })
      .exec()
    Taro.createSelectorQuery()
      .select('.paperDetailMain')
      .boundingClientRect((rec) => {
        if (rec) {
          vdata.mainWidth = rec.width
          clearInterval(timer)
          timer = null
        }
      })
      .exec()
  }, 1000)
  isLoading()
  getImageList()
})
// useUnload(() => {
//   console.log(123)
// })
// useDidHide(() => {
//   console.log(456)
// })
</script>
<style lang="scss">
.paperDetailMain {
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  .topText {
    padding: 26px 15px 40px;
    background: #f3f6ff;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    line-height: 20px;
    color: #333333;
    font-weight: 600;
    box-sizing: border-box;
    .answer {
      width: 48px;
      height: 20px;
      border-radius: 4px;
      background: #ffffff;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #666666;
      text-align: center;
      line-height: 20px;
      margin-top: 10px;
      font-weight: normal;
    }
  }
  .scroll-content {
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    box-sizing: border-box;
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 132px;
    .paperList {
      padding: 15px 0;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 132px;
    z-index: 10;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    box-shadow: 0px -2px 4px 0px rgba(233, 233, 233, 0.5);
    box-sizing: border-box;
    padding-top: 10px;
    box-sizing: border-box;
    image {
      width: 36px;
      height: 36px;
    }
    .opera {
      margin-top: 20px;
      display: flex;
      padding: 0 80px;
      justify-content: space-between;
    }
  }
  .loadingMain {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #414141;
    background: #fff;
    z-index: 10;
    .loadingToast {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      image {
        width: 49px;
        height: 55px;
      }
      .progress {
        margin: 8px;
      }
    }
  }
}
</style>
