<template>
  <view class="dictationExercise" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="选择训练" :fixedStyle="vdata.fixedStyle" />
    <view class="dictMain" :style="{ height: `calc(100vh - ${navBarHeight + 115}px)` }">
      <view class="topSet">
        <view class="setLeft">
          <text>请选择听写范围</text>
          <text class="fy">点击字词听发音</text>
        </view>
        <view class="setRight" @tap="openSeet">
          <img
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/aa183cd941f64da6a6d863ca807875fc/seting.png"
            alt=""
          />
          <text>设置</text>
        </view>
      </view>
      <view class="chooseMain" v-if="vdata.wordList">
        <view v-for="(item, key) in vdata.wordList" :key="key" class="choose-item">
          <view class="item-text">
            <view>{{ key }} ({{ item.contentList.length }})</view>
            <view>
              <image
                @tap="itemChange(item, key)"
                :src="
                  item.isSelected
                    ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/ec5240eb81704251b0cce36b418df57e/check.png'
                    : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/33934d01a03d47df852944826735310e/nocheck.png'
                "
                mode="scaleToFill"
              />
            </view>
          </view>

          <view class="item-word">
            <template v-for="(vtem, k) in item.contentList" :key="k">
              <view
                @tap="audioPlay(vtem)"
                v-if="vtem.chineseContent && vtem.chineseContent.length == 1"
                :class="['text-item', vtem.isPlay && 'text-item-select']"
              >
                {{ vtem.chineseContent }}
              </view>
              <view
                v-else
                :class="['text-item-main', vtem.isPlay && 'text-item-select-main']"
                @tap="audioPlay(vtem)"
              >
                <view v-for="(text, textIndex) in vtem.chineseContent" :key="textIndex">
                  <view class="text-item-item">
                    {{ text }}
                  </view>
                </view>
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>
    <view class="option">
      <view class="checkBtn" @tap="allChange">
        <image
          :src="
            vdata.checkAll
              ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/ec5240eb81704251b0cce36b418df57e/check.png'
              : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/33934d01a03d47df852944826735310e/nocheck.png'
          "
          mode="scaleToFill"
        />
        全选
      </view>
      <view
        :class="['delete', getNumber.length && 'selectColor']"
        @tap="getNumber.length && begin()"
        >开始听写 ({{ getNumber.length }})</view
      >
    </view>

    <view class="seeting">
      <nut-popup
        @click-overlay="closePopup"
        @click-close-icon="closePopup"
        round
        position="bottom"
        closeable
        :style="{ height: '420px' }"
        v-model:visible="vdata.showPoput"
      >
        <view class="versionContent">
          <view class="title">听写设置</view>
          <view class="versionInfo">
            <view class="item-info">
              <view class="titleText">朗读次数</view>
              <view class="item-choose">
                <view
                  :class="[
                    'item-choose-info',
                    vdata.setInfo.number == item.value && 'item-choose-select',
                  ]"
                  @tap="itemChoose(item, 1)"
                  v-for="(item, i) in vdata.numberList"
                  :key="i"
                  >{{ item.text }}</view
                >
              </view>
            </view>
            <view class="item-info">
              <view class="titleText">时间间隔</view>
              <view class="item-choose">
                <view
                  :class="[
                    'item-choose-info',
                    vdata.setInfo.interval == item.value && 'item-choose-select',
                  ]"
                  @tap="itemChoose(item, 2)"
                  v-for="(item, i) in vdata.intervalList"
                  :key="i"
                  >{{ item.text }}</view
                >
              </view>
            </view>
            <view class="item-info">
              <view class="titleText">听写顺序</view>
              <view class="item-choose">
                <view
                  :class="[
                    'item-choose-info',
                    vdata.setInfo.well == item.value && 'item-choose-select',
                  ]"
                  @tap="itemChoose(item, 3)"
                  v-for="(item, i) in vdata.wellList"
                  :key="i"
                  >{{ item.text }}</view
                >
              </view>
            </view>
          </view>
          <view class="seetSubmit" @tap="setSubmit">确定</view>
        </view>
      </nut-popup>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, usePerson } from '@/stores'
import { getDicExeInfo } from '@/api/dictationExercise'
import bookVersion from '@/components/bookVersion.vue'
const system = useSystem()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
import { reactive, ref, nextTick, computed, onMounted } from 'vue'
const activeNames = reactive([1])
const versionBook = ref()
const vdata: any = reactive({
  activeNames: [1],
  fixedStyle: {
    color: '#333',
  },
  showPoput: false,
  checkAll: false,
  wordList: null,
  numberList: [
    {
      text: '1次',
      value: 1,
    },
    {
      text: '2次',
      value: 2,
    },
    {
      text: '3次',
      value: 3,
    },
  ],
  intervalList: [
    {
      text: '3秒',
      value: 3000,
    },
    {
      text: '5秒',
      value: 5000,
    },
    {
      text: '10秒',
      value: 10000,
    },
    {
      text: '15秒',
      value: 15000,
    },
  ],
  wellList: [
    {
      text: '顺序',
      value: 1,
    },
    {
      text: '乱序',
      value: 2,
    },
  ],
  setInfo: {
    number: 2,
    well: 1,
    interval: 3000,
  },
  searchInfo: {
    bookId: 0,
    sectionKey: 0,
    unitKey: 0,
  },
})
let audioCtx: any = null
//重置列表
const audioReset = () => {
  if (audioCtx) {
    // audioCtx.stop()
    audioCtx.destroy()
    audioCtx = null
  }

  for (let key in vdata.wordList) {
    if (vdata.wordList[key].contentList && vdata.wordList[key].contentList.length) {
      vdata.wordList[key].contentList.map((item) => {
        item.isPlay = false
      })
    }
  }
}
//全选
const allChange = (val) => {
  vdata.checkAll = !vdata.checkAll
  for (let key in vdata.wordList) {
    vdata.wordList[key].isSelected = vdata.checkAll
  }
}
const getNumber = computed(() => {
  let list = []
  for (let key in vdata.wordList) {
    if (
      vdata.wordList[key].isSelected &&
      vdata.wordList[key].contentList &&
      vdata.wordList[key].contentList.length
    ) {
      list = list.concat(vdata.wordList[key].contentList)
    }
  }
  return list
})
// 文字播放
const audioPlay = (item) => {
  audioReset()
  if (item.contentUrl) {
    isPlay(item)
  } else {
    const params = {
      content: item.chineseContent,
      contentId: item.contentId,
    }
    getDicExeInfo('getContentVoice', params).then((res: any) => {
      if (res) {
        item.contentUrl = res.voiceUrl
        isPlay(item)
      }
    })
  }
}
const isPlay = (item) => {
  nextTick(() => {
    item.isPlay = true
    if (!audioCtx) {
      audioCtx = Taro.createInnerAudioContext()
    }
    audioCtx.src = item.contentUrl
    audioCtx.play()
    audioCtx.onEnded(() => {
      item.isPlay = false
      audioCtx.stop()
    })
  })
}
//开始听写
const begin = () => {
  let arrList = []
  for (let key in vdata.wordList) {
    if (vdata.wordList[key].isSelected) {
      if (vdata.wordList[key].contentList && vdata.wordList[key].contentList.length) {
        vdata.wordList[key].contentList.forEach((item) => {
          arrList.push(item)
        })
      }
    }
  }
  if (vdata.setInfo.well == 2) {
    arrList = randomSort(arrList)
  }
  personInfo.setDicList(arrList)
  personInfo.setSeting(vdata.setInfo)
  Taro.navigateTo({ url: '../dictationBegin/index' })
}
const randomSort = (arr) => {
  // return Math.random() > 0.5 ? -1 : 1
  var length = arr.length,
    randomIndex,
    temp
  while (length) {
    randomIndex = Math.floor(Math.random() * length--)
    temp = arr[randomIndex]
    arr[randomIndex] = arr[length]
    arr[length] = temp
  }
  return arr
}
//选择听写
const itemChange = (item, i) => {
  item.isSelected = !item.isSelected
  let flag = true
  for (let key in vdata.wordList) {
    if (!vdata.wordList[key].isSelected) {
      flag = false
    }
  }
  vdata.checkAll = flag
}
//打开设置选项
const openSeet = () => {
  vdata.showPoput = true
}
//关闭设置
const closePopup = () => {
  vdata.setInfo = {
    number: 2,
    well: 1,
    interval: 3000,
  }
}
//确定设置
const setSubmit = () => {
  vdata.showPoput = false
}
//设置选项
const itemChoose = (item, type) => {
  if (type == 1) {
    vdata.setInfo.number = item.value
  } else if (type == 2) {
    vdata.setInfo.interval = item.value
  } else {
    vdata.setInfo.well = item.value
  }
}
//选择版本回调
const bookChange = (val) => {
  console.log(val, 888)
}
//
const study = () => {
  Taro.navigateTo({
    url: '../traninSelect/index',
  })
}
//获取列表
const getList = async () => {
  let params = personInfo.searchDic
  let res: any = await getDicExeInfo('contentList', params)
  if (res.content) {
    vdata.wordList = res.content
    for (let key in vdata.wordList) {
      if (vdata.wordList[key].isSelected) {
        vdata.checkAll = true
      } else {
        vdata.checkAll = false
      }
    }
  }
}
onMounted(() => {
  getList()
})
useDidHide(() => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  vdata.checkAll = false
})
</script>
<style lang="scss">
.dictationExercise {
  height: 100vh;
  padding-bottom: 110px;
  background-color: #f3f4f6;
  .dictMain {
    overflow-y: auto;
    padding: 20px 15px 0;
  }
  .topSet {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .setLeft {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #333333;
      display: flex;
      flex-direction: column;
      .fy {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        margin-top: 8px;
      }
    }
    .setRight {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      img {
        width: 25px;
        height: 25px;
      }
    }
  }
  .chooseMain {
    .choose-item {
      background: #fff;
      border-radius: 8px;
      box-sizing: border-box;
      margin-bottom: 10px;
      padding: 0 16px 1px;
      .item-text {
        height: 58px;
        border-bottom: 1px solid #ecf0f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        image {
          width: 18px;
          height: 18px;
        }
      }
      .item-word {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        margin: 16px 0;
        .text-item {
          height: 42px;
          width: 42px;
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/7c5f3b233cf14427bb7224454edd3c56/textbg.png')
            no-repeat center;
          font-family: PingFangSC-Regular;
          background-size: 100% 100%;
          font-size: 20px;
          color: #343434;
          text-align: center;
          line-height: 42px;
          margin-bottom: 10px;
          margin-right: 10px;
          border-radius: 3px;
        }
        .text-item-select {
          color: #0256ff;
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/7e78f1e6a91244bfab0edc8f1909f65a/selectbg.png')
            no-repeat center;
          background-size: 100% 100%;
        }
        .text-item-main {
          display: flex;
          margin-right: 10px;
        }

        .text-item-item {
          height: 42px;
          width: 42px;
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/7c5f3b233cf14427bb7224454edd3c56/textbg.png')
            no-repeat center;
          font-family: PingFangSC-Regular;
          background-size: 100% 100%;
          font-size: 20px;
          color: #343434;
          text-align: center;
          line-height: 42px;
          margin-bottom: 10px;
          border-radius: 3px;
        }
        .text-item-select-main {
          .text-item-item {
            color: #0256ff;
            background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/7e78f1e6a91244bfab0edc8f1909f65a/selectbg.png')
              no-repeat center;
            font-family: PingFangSC-Regular;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  .option {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 90px;
    background: #fff;
    width: 100%;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    // align-items: center;
    box-sizing: border-box;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    image {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
    .checkBtn {
      display: flex;
      align-items: center;
      font-size: 14px;
      height: 44px;
    }
    .delete {
      width: 206px;
      height: 44px;
      border-radius: 22px;
      color: #cbcbcb;
      background: #eeeeee;
      line-height: 44px;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
    }
    .selectColor {
      background: #2f5de7;
      color: #ffffff;
    }
  }

  .seeting {
    .popup-bottom {
      height: 100%;
    }
    .versionContent {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .title {
      font-size: 16px;
      color: #333333;
      font-weight: bold;
      padding: 20px;
      border-bottom: 0.5px solid #f0f0f0;
    }
    .versionInfo {
      margin-top: 15px;
      padding-left: 20px;
      .titleText {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #333333;
        margin-bottom: 8px;
      }
      .item-choose {
        display: flex;
        margin-bottom: 20px;
        .item-choose-info {
          width: 72px;
          height: 35px;
          border-radius: 18px;
          background: #f5f5f5;
          text-align: center;
          line-height: 35px;
          font-size: 13px;
          margin-right: 16px;
        }
        .item-choose-select {
          background: #e0eaff;
          color: #0256ff;
        }
      }
    }
    .seetSubmit {
      height: 44px;
      border-radius: 22px;
      background: #2f5de7;
      text-align: center;
      line-height: 44px;
      color: #fff;
      position: absolute;
      bottom: 33px;
      left: 15px;
      right: 15px;
    }
  }
}
</style>
