<template>
  <view class="oralSearch">
    <view class="topOption">
      <view class="left">
        <view class="grand" @tap="showClass">
          <text :class="vdata.showPoput && 'text'">{{ getGrandText() }}</text>
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
          <text :class="vdata.showTime && 'text'">{{ getTimerText() }}</text>
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
  </view>
</template>
<script setup lang="ts">
import { reactive, defineEmits, watch } from 'vue'
import { useSystem, useUser } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const emit = defineEmits(['grandChange', 'timerChange'])
// const props = defineProps({
//   grand: '',
//   close: '',
// })
const vdata = reactive({
  showPoput: false,
  showTime: false,
  grand: '',
  timer: '',
  grandList: [
    {
      text: '全部',
      value: '',
    },
    {
      text: '句子',
      value: 1,
    },
    {
      text: '单词',
      value: 2,
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
})
const showClass = () => {
  vdata.showPoput = !vdata.showPoput
  vdata.showTime = false
}
const showTime = () => {
  vdata.showTime = !vdata.showTime
  vdata.showPoput = false
}
const close = () => {
  vdata.showTime = false
  vdata.showPoput = false
}
const getGrandValue = () => {
  vdata.showPoput = false
  emit('grandChange', vdata.grand)
}
const getTimerValue = () => {
  vdata.showTime = false
  emit('timerChange', vdata.timer)
}
const getGrandText = () => {
  let text = '全部'
  let arrList = vdata.grandList.filter((item) => item.value == vdata.grand)
  if (arrList.length) {
    text = arrList[0].text
  }
  return text
}
const getTimerText = () => {
  let text = '加入时间'
  let arrList = vdata.timerList.filter((item) => item.value == vdata.timer)
  if (arrList.length) {
    text = arrList[0].text
  }
  return text
}
// watch(
//   () => props.grand,
//   (newVal) => {
//     vdata.grand = Number(newVal)
//     getGrandText()
//   }
// )
// watch(
//   () => props.close,
//   (newVal) => {
//     // if (newVal) {
//     //   close()
//     // }
//     close()
//   }
// )
</script>
<style lang="scss">
.oralSearch {
  .popup-top {
    // top: 100px;
  }
  .popupMain {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 15px;
    .nut-radio__button {
      padding: 0;
      width: 73px;
      height: 35px;
      justify-content: center;
      border-radius: 18px;
    }
    .nut-radiogroup--horizontal .nut-radio {
      margin-right: 0;
    }
    .nut-radiogroup .nut-radio {
      margin-bottom: 15px;
      margin-right: 18px;
    }
    .nut-radiogroup {
      display: flex;
      flex-wrap: wrap;
      //   justify-content: space-between;
    }
    .nut-radio:last-child {
      margin-bottom: 15px !important;
    }
    .nut-radio__button--active {
      border: none;
      color: #0256ff;
    }
  }
  .popupTime {
    padding: 10px 15px;
    .nut-radio__button {
      padding: 0;
      width: 73px;
      height: 35px;
      justify-content: center;
      border-radius: 15px;
    }
    .nut-radio__button {
      padding: 0;
      width: 73px;
      height: 35px;
      justify-content: center;
      border-radius: 18px;
    }
    .nut-radiogroup--horizontal .nut-radio {
      margin-right: 0;
    }
    .nut-radiogroup .nut-radio {
      margin-bottom: 15px;
      margin-right: 18px;
    }
    .nut-radiogroup {
      display: flex;
      flex-wrap: wrap;
      //   justify-content: space-between;
    }
    .nut-radio:last-child {
      margin-bottom: 15px !important;
    }
    .nut-radio__button--active {
      border: none;
      color: #0256ff;
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
  .left {
    display: flex;
    .grand {
      display: flex;
      align-items: center;
      width: 70px;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      font-weight: normal;
      color: #333333;
      .text {
        color: #2f5de7;
      }
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
</style>
