<template>
  <view class="photographResult" :style="{ paddingTop: `${navBarHeight + 12}px` }">
    <NavBar @vipclick="changeVip" :type="vdata.memberType" />
    <view class="topTitle">已为您自动框选题目，请点击选择，支持多选</view>
    <view class="photographMain">
      <view class="swiperMain">
        <view class="handelImg" v-if="!vdata.showImg">
          <nut-button loading type="warning"></nut-button>
          <view>图片处理中</view>
        </view>

        <swiper
          v-else
          class="swiper"
          indicator-color="#999"
          indicator-active-color="#333"
          :circular="false"
          :indicator-dots="false"
        >
          <swiper-item v-for="(item, i) in vdata.imgList" :key="i">
            <view class="list-item">
              <image :src="item.originUrl" class="imageContent" :mode="computedFixed">
                <view class="mc">
                  <template v-if="item.contentListInfoList && item.contentListInfoList.length">
                    <view
                      class="mc-item"
                      v-for="(bg, key) in item.contentListInfoList"
                      :style="handlePosition(item, bg.point2dXYList)"
                      :key="key"
                    >
                      <view class="bj">编辑</view>
                      <view class="jj" v-show="!bg.isCheck">
                        <image
                          @tap="changeIsCheck(i, key, true)"
                          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/69ddc2a38118419eb6815bb37f6fee70/addPot.png"
                          mode="scaleToFill"
                        />
                      </view>
                      <view class="jy" v-show="bg.isCheck">
                        <image
                          @tap="changeIsCheck(i, key, false)"
                          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/5fb2d6d087aa44b1b42c405f364610ca/commit.png"
                          mode="scaleToFill"
                        />
                      </view>
                    </view>
                  </template>
                </view>
              </image>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <view class="footer">
      <view class="btn" @tap="toPic">拍其它图片</view>
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useSystem } from '@/stores'
import NavBar from '@/components/VipNavBar.vue'
import { reactive, onMounted, computed } from 'vue'
import { processImage, saveSegment } from '@/api/wrongbook'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const router: any = useRouter()
const vdata: any = reactive({
  memberType: 2,
  imgList: [
    {
      originUrl:
        'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/e07aabcf9657406db5a470440b187dab/pt.png',
      removeHandWriteUrl:
        'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/e07aabcf9657406db5a470440b187dab/pt.png',
      rhwHeight: null,
      rhwWidth: null,
      contentListInfoList: [
        {
          posId: 0,
          isCheck: false,
          type: 1,
          point2dXYList: [
            {
              x: 70,
              y: 114,
            },
            {
              x: 1082,
              y: 122,
            },
            {
              x: 1090,
              y: 743,
            },
            {
              x: 71,
              y: 734,
            },
          ],
        },
        {
          posId: 1,
          isCheck: false,
          type: 1,
          point2dXYList: [
            {
              x: 63,
              y: 952,
            },
            {
              x: 1098,
              y: 956,
            },
            {
              x: 1098,
              y: 1106,
            },
            {
              x: 61,
              y: 1101,
            },
          ],
        },
        {
          posId: 2,
          isCheck: false,
          type: 1,
          point2dXYList: [
            {
              x: 62,
              y: 1105,
            },
            {
              x: 1082,
              y: 1106,
            },
            {
              x: 1082,
              y: 1297,
            },
            {
              x: 59,
              y: 1294,
            },
          ],
        },
        {
          posId: 3,
          isCheck: false,
          type: 1,
          point2dXYList: [
            {
              x: 59,
              y: 1292,
            },
            {
              x: 1096,
              y: 1294,
            },
            {
              x: 1096,
              y: 1480,
            },
            {
              x: 58,
              y: 1474,
            },
          ],
        },
        {
          posId: 4,
          isCheck: false,
          type: 1,
          point2dXYList: [
            {
              x: 63,
              y: 1482,
            },
            {
              x: 1083,
              y: 1489,
            },
            {
              x: 1084,
              y: 1613,
            },
            {
              x: 64,
              y: 1605,
            },
          ],
        },
      ],
      height: '1656',
      width: '1184',
      orgHeight: '1637',
      orgWidth: '1156',
    },
  ],
  current: 0,
  mainWidth: '',
  showImg: false,
})
const handleStyle = (item) => {
  if (vdata.memberType == 1) {
    return {
      backgroundImage: `url(${item.originUrl})`,
    }
  } else {
    return {
      backgroundImage: `url(${item.removeHandWriteUrl})`,
    }
  }
}
const toPic = () => {
  Taro.navigateTo({
    url: '../photograph/index',
  })
}
const handlePosition = (item, list) => {
  if (vdata.mainWidth) {
    // orgWidth原始图片宽度
    // orgHeight原始图片高度
    let left = ((list[0].x / item.orgWidth) * 100).toFixed(2)
    let top = ((list[0].y / item.orgHeight) * 100).toFixed(2)
    let width = (((list[1].x - list[0].x) / item.orgWidth) * 100).toFixed(2)
    let height = (((list[2].y - list[1].y) / item.orgHeight) * 100).toFixed(2)
    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`,
    }
  }
}

const computedFixed = computed(() => {
  let str = 'heightFix'
  if (vdata.memberType == 2) {
    let scal = vdata.imgList[0].rhwWidth / vdata.imgList[0].rhwHeight
    str = scal > 1 ? 'widthFix' : 'heightFix'
  } else {
    let scal = vdata.imgList[0].orgWidth / vdata.imgList[0].orgHeight
    str = scal > 1 ? 'widthFix' : 'heightFix'
  }
  return str
})

const changeVip = (val) => {
  vdata.memberType = val
  if (val == 1) {
    vdata.cropperOptions.src = vdata.imgList[0].originUrl
  } else {
    vdata.cropperOptions.src = vdata.imgList[0].removeHandWriteUrl
  }
}
const changeIsCheck = (i, key, flag) => {
  vdata.imgList[i].contentListInfoList[key].isCheck = flag
}
onMounted(() => {
  let timer = setInterval(() => {
    Taro.createSelectorQuery()
      .select('.list-item')
      .boundingClientRect((rec) => {
        if (rec) {
          vdata.mainWidth = rec.width
          vdata.mainHeight = rec.height
          clearInterval(timer)
        }
      })
      .exec()
  }, 1000)
  setTimeout(() => {
    vdata.showImg = true
  }, 2000)
})
</script>
<style lang="scss">
.photographResult {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 115px;
}
.photographMain {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.welMain {
  flex: 1;
  position: relative;
}
.swiperMain {
  flex: 1;
  background: #f8f8f8;
  position: relative;
  box-sizing: border-box;
  // padding: 20px 20px 0;
  // padding-top: 20px;
  display: flex;
  flex-direction: column;
  .swiper {
    // height: 100%;
    flex: 1;
    .list-item {
      // padding: 0 20px;
      height: 100%;
      box-sizing: border-box;
      .imageContent {
        width: 100%;
        position: relative;
        height: 100%;
        left: 50%;
        transform: translateX(-50%);
      }
      .mc {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        top: 0;
        overflow: hidden;
        // background: rgba(0, 0, 0, 0.1);
        .mc-item {
          position: absolute;
          left: 0;
          top: 0;
          border: 1px solid #2f5de7;
          box-sizing: border-box;
          background: rgba(47, 93, 230, 0.1);
          .bj {
            position: absolute;
            right: 0;
            width: 32px;
            height: 19px;
            font-size: 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 0 0 0 10px;
            text-align: center;
            line-height: 19px;
            color: #fff;
            z-index: 100;
          }
          .jj,
          .jy {
            width: 24px;
            height: 24px;
            line-height: 10px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;
            image {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
  }
  .current {
    text-align: center;
    height: 50px;
    line-height: 40px;
  }
  .handelImg {
    width: 100%;
    height: 100%;
    background: #333;
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 14px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
    .nut-button--warning {
      background: #333;
    }
  }
}
.topTitle {
  height: 40px;
  font-family: PingFang SC;
  font-size: 13px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  background: #eff3ff;
  color: #333333;
  line-height: 40px;
  padding-left: 14px;
  position: relative;
  z-index: 10;
}
.footer {
  position: fixed;
  bottom: 0px;
  right: 0;
  left: 0;
  background: #fff;
  padding: 20px 20px 0;
  height: 115px;
  box-sizing: border-box;
  .btn {
    height: 40px;
    background: #0256ff;
    border-radius: 25px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    font-size: 15px;
  }
}
</style>
