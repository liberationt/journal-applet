<template>
  <view class="searchInfo">
    <view class="topOption">
      <view class="left">
        <view class="grand" @tap="showClass">
          <text :class="vdata.showPoput && 'text'">{{ grandText }}</text>
          <!-- <text :class="[vdata.showPoput ? 'jbs' : 'jb']"></text> -->
          <image
            :class="[vdata.showPoput && 'tp5']"
            :src="
              vdata.showPoput
                ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/2d3ec36046bd4693a69c3f9c92e37127/sjt.png'
                : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/7b21783778a64df980d24ad173a8fe9c/xjt.png'
            "
          />
        </view>
        <view class="grand" @tap="showTime">
          <text :class="vdata.showTime && 'text'">{{ timerText }}</text>
          <!-- <text :class="[vdata.showTime ? 'jbs' : 'jb']"></text> -->
          <image
            :class="[vdata.showTime && 'tp5']"
            :src="
              vdata.showTime
                ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/2d3ec36046bd4693a69c3f9c92e37127/sjt.png'
                : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/7b21783778a64df980d24ad173a8fe9c/xjt.png'
            "
          />
        </view>
        <view class="grand source" @tap="showSource">
          <text :class="vdata.sourceShow && 'text'">{{ sourceText }}</text>
          <!-- <text :class="[vdata.showTime ? 'jbs' : 'jb']"></text> -->
          <image
            :class="[vdata.sourceShow && 'tp5']"
            :src="
              vdata.sourceShow
                ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/2d3ec36046bd4693a69c3f9c92e37127/sjt.png'
                : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/7b21783778a64df980d24ad173a8fe9c/xjt.png'
            "
          />
        </view>
      </view>
      <view class="right">
        <slot name="right"></slot>
      </view>
    </view>

    <nut-popup
      position="top"
      :style="{ top: `${navBarHeight + 40}px` }"
      round
      v-model:visible="vdata.showPoput"
    >
      <view class="popupMain">
        <nut-radiogroup @change="getGrandValue" v-model="vdata.grand" direction="horizontal">
          <nut-radio
            shape="button"
            :label="item.value"
            v-for="(item, i) in vdata.grandList"
            :key="i"
            >{{ item.text }}</nut-radio
          >
        </nut-radiogroup>
      </view>
    </nut-popup>
    <nut-popup
      position="top"
      :style="{ top: `${navBarHeight + 40}px` }"
      round
      v-model:visible="vdata.showTime"
    >
      <view class="popupTime">
        <nut-radiogroup @change="getTimerValue" v-model="vdata.timer" direction="horizontal">
          <nut-radio
            shape="button"
            :label="item.value"
            v-for="(item, i) in vdata.timerList"
            :key="i"
            >{{ item.text }}</nut-radio
          >
        </nut-radiogroup>
      </view>
    </nut-popup>
    <nut-popup
      position="top"
      :style="{ top: `${navBarHeight + 40}px` }"
      round
      v-model:visible="vdata.sourceShow"
    >
      <view class="popupTime">
        <nut-radiogroup @change="getSourceValue" v-model="vdata.source" direction="horizontal">
          <nut-radio
            shape="button"
            :label="item.value"
            v-for="(item, i) in vdata.sourceList"
            :key="i"
            >{{ item.text }}</nut-radio
          >
        </nut-radiogroup>
      </view>
    </nut-popup>
  </view>
</template>
<script setup lang="ts">
import { reactive, defineEmits, watch, computed, withDefaults, defineProps } from 'vue'
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const emit = defineEmits(['grandChange', 'timerChange', 'sourceChange'])
const props = withDefaults(
  defineProps<{
    grand: string
    close: boolean
  }>(),
  {
    grand: '',
    close: false,
  }
)
const vdata = reactive({
  showPoput: false,
  showTime: false,
  sourceShow: false,
  source: '',
  grand: '',
  timer: '',
  grandList: [
    {
      text: '全部',
      value: '',
    },
    {
      text: '语文',
      value: 1,
    },
    {
      text: '数学',
      value: 2,
    },
    {
      text: '英语',
      value: 3,
    },
    {
      text: '物理',
      value: 4,
    },
    {
      text: '化学',
      value: 5,
    },
    {
      text: '生物',
      value: 6,
    },
    {
      text: '政治',
      value: 7,
    },
    {
      text: '历史',
      value: 8,
    },
    {
      text: '地理',
      value: 9,
    },
    {
      text: '科学',
      value: 10,
    },
    {
      text: '其它',
      value: 11,
    },
  ],
  timerList: [
    {
      text: '不限',
      value: 0,
    },
    {
      text: '七天内',
      value: 7,
    },
    {
      text: '30天内',
      value: 30,
    },
  ],
  sourceList: [
    {
      text: '不限',
      value: 0,
    },
    {
      text: '教育周报',
      value: 1,
    },
    {
      text: '拍照搜题',
      value: 2,
    },
    {
      text: '拍照批改',
      value: 3,
    },
    {
      text: '录错题',
      value: 4,
    },
    {
      text: '智能刷题',
      value: 5,
    },
    {
      text: '答题pk',
      value: 6,
    },
  ],
})
const showClass = () => {
  vdata.showPoput = true
  vdata.showTime = false
  vdata.sourceShow = false
}
const showTime = () => {
  vdata.showTime = true
  vdata.showPoput = false
  vdata.sourceShow = false
}
const showSource = () => {
  vdata.sourceShow = true
  vdata.showTime = false
  vdata.showPoput = false
}
const close = () => {
  vdata.showTime = false
  vdata.showPoput = false
  vdata.sourceShow = false
}
const getGrandValue = () => {
  vdata.showPoput = false
  emit('grandChange', vdata.grand)
}
const getTimerValue = () => {
  vdata.showTime = false
  emit('timerChange', vdata.timer)
}

const getSourceValue = () => {
  vdata.sourceShow = false
  emit('sourceChange', vdata.source)
}
const grandText = computed(() => {
  let text = '全部'
  let arrList = vdata.grandList.filter((item) => item.value === vdata.grand)
  if (arrList.length) {
    text = arrList[0].text
  }
  return text
})
const timerText = computed(() => {
  let text = '加入时间'
  let arrList = vdata.timerList.filter((item: any) => item.value === vdata.timer)
  if (arrList.length) {
    text = arrList[0].text
  }
  return text
})

const sourceText = computed(() => {
  let text = '来源'
  let arrList = vdata.sourceList.filter((item: any) => item.value === vdata.source)
  if (arrList.length) {
    text = arrList[0].text
  }
  return text
})

watch(
  () => props.grand,
  (newVal) => {
    vdata.grand = Number(newVal)
  }
)
watch(
  () => props.close,
  () => {
    // if (newVal) {
    //   close()
    // }
    close()
  }
)
</script>
<style lang="scss">
.searchInfo {
  .popup-top {
    // top: 100px;
  }
  .popupMain {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 25px;
    .nut-radio__button {
      padding: 0;
      width: 73px;
      height: 35px;
      justify-content: center;
    }
    .nut-radiogroup--horizontal .nut-radio {
      margin-right: 0;
    }
    .nut-radiogroup .nut-radio {
      margin-bottom: 15px;
    }
    .nut-radiogroup {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .nut-radio:last-child {
      margin-bottom: 15px !important;
    }
  }
  .popupTime {
    padding: 10px 25px;
    overflow: hidden;
    .nut-radiogroup {
      margin-right: -20rpx;
    }
    .nut-radio__button {
      padding: 0;
      width: 73px;
      height: 35px;
      justify-content: center;
    }
  }
}
.topOption {
  height: 40px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #333333;
  padding: 0 14px;
  position: relative;
  z-index: 9999;
  // backdrop-filter: blur(27.2px);
  // box-shadow: 0px 0.5px 0px 0px rgba(0, 0, 0, 0.9);
  // border-top: 1px solid rgba(0, 0, 0, 0.9);
  .left {
    display: flex;
    .grand {
      // margin-right: 30px;
      display: flex;
      align-items: center;
      // justify-content: center;
      width: 70px;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      font-weight: normal;
      color: #333333;
      &.source {
        width: auto;
        padding: 0 10px 0 20px;
      }
      .text {
        color: #2f5de7;
      }
      // .jb {
      //   border: 2px solid #333;
      //   width: 5px;
      //   height: 5px;
      //   border-left-color: transparent;
      //   border-top-color: transparent;
      //   transform: rotate(-45deg); //上箭头
      //   margin-top: 3px;
      //   margin-left: 5px;
      // }
      // .jbs {
      //   border: 2px solid #2f5de7;
      //   transform: rotate(-135deg); //上箭头
      //   margin-top: 5px;
      //   margin-left: 7px;
      //   border-left-color: transparent;
      //   border-top-color: transparent;
      //   width: 5px;
      //   height: 5px;
      // }
      image {
        width: 7px;
        height: 7px;
        margin-left: 5px;
      }
      .tp5 {
        margin-top: 4px;
      }
    }
  }
}
// .grand {
//   display: flex;
//   align-items: center;
//   .jb {
//     border: 2px solid #c2c0c0;
//     width: 5px;
//     height: 5px;
//     border-left-color: transparent;
//     border-top-color: transparent;
//     transform: rotate(-135deg); //上箭头
//   }
// }
</style>
