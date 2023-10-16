<template>
  <view class="mainContent">
    <view class="imageInfo">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/e07aabcf9657406db5a470440b187dab/pt.png"
        mode="widthFix"
      />
    </view>

    <view class="bottomBtn">
      <view class="screenBtn">
        <image
          @tap="takePhoto"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/c963da6c26d04585b377b11d8557949b/screen.png"
        />
      </view>
      <view class="arrow">
        <text>点击拍摄图片</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import { reactive, onMounted } from 'vue'

const vdata = reactive({})
const takePhoto = () => {
  Taro.redirectTo({
    url: '../examplesPic/index',
  })
}
//拍照
onMounted(() => {})
</script>
<style lang="scss">
.mainContent {
  .arrow {
    background: #0256ff;
    position: absolute;
    border-radius: 6px;
    width: 100px;
    height: 30px;
    top: -3%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    margin-left: -1%;
    line-height: 30px;
    font-size: 14px;
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
  .arrow:after {
    content: '';
    position: absolute;
    bottom: -14.5px;
    left: 50%;
    transform: (translateX(-50%));
    height: 0;
    width: 0;
    border-top: 10px solid #000;
    border-left: 10px solid #0256ff;
    /* border-right: 20px solid #AF9E9E; */
    border-bottom: 10px solid #000;
    transform: rotate(90deg);
  }
  @keyframes beat {
    0% {
      top: -10%;
    }

    100% {
      top: -3%;
    }
  }

  .imageInfo {
    text-align: center;
    box-sizing: border-box;
    padding-top: 10px;
    width: 100%;
    height: calc(100vh - 115px);
    image {
      width: 100%;
      height: 100%;
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
    justify-content: center;
    align-items: center;
    color: #fff;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    box-sizing: border-box;
    z-index: 10;
    .screenBtn {
      text-align: center;
      image {
        width: 64px;
        height: 64px;
      }
    }
  }
}
</style>
