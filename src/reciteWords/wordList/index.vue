<template>
  <view class="wordListMain" :style="{ paddingTop: `${navBarHeight + 15}px` }" @tap="closePop">
    <NavBar title="背单词"></NavBar>
    <view class="tabInfo">
      <view class="left">
        <view :class="['firstSelect', vdata.tabType == 0 && 'selectTab']" @tap="tabChange(0)"
          >已学单词</view
        >
        <view :class="vdata.tabType == 1 && 'selectTab'" @tap="tabChange(1)">未学单词</view>
      </view>
      <view class="right" @tap="changeUnit">
        <view>{{ vdata.unitValue }}</view>
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9400a5cb55b541adb59ef9050345fe1c/close-circle-fill.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <scroll-view
      v-if="vdata.wordList.length"
      class="scrollInfo"
      :scroll-y="true"
      @scrolltolower="lower"
      :style="{ height: `calc(100vh - ${navBarHeight + 68}px)` }"
    >
      <view v-for="(item, i) in vdata.wordList" :key="i" class="scroll-item">
        <view class="word">{{ item.englishWord }}</view>
        <view class="pronunciation" @tap="play(item)">
          <view class="pronunciationCon">
            <text v-if="recite.seting.pronunciation == 1">{{
              item?.faYin?.pronunciationAm?.phoneticSymbol ||
              item?.faYin?.pronunciationEn?.phoneticSymbol
            }}</text>
            <text v-else>{{
              item?.faYin?.pronunciationEn?.phoneticSymbol ||
              item?.faYin?.pronunciationAm?.phoneticSymbol
            }}</text>
            <image
              :src="
                item.isListened
                  ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hzyd/f0f5c244d00a46f086117eea200dcc20/bfGif.gif'
                  : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/1e9571619dc94277b25a8a75f1ee87fd/bf.png'
              "
              mode="scaleToFill"
            />
          </view>
          <view class="playDh" v-if="i === 1 && !vdata.isFlag">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/36fc825674e84e91b9bfbbcf60901eb5/xjt.png"
              mode="scaleToFill"
            />
            <text>点击可播放发音</text>
          </view>
        </view>
        <view class="interpretation">
          <template v-if="!item.isSelected">
            <view class="bg" @tap="look(item)"></view>
            <view class="playDh" v-if="i === 1 && !vdata.isFlag" @tap="look(item)">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/36fc825674e84e91b9bfbbcf60901eb5/xjt.png"
                mode="scaleToFill"
              />
              <text>点击可查看释义</text>
            </view>
          </template>
          <view class="interMain" v-else>
            <view class="unit">释义 </view>
            <view v-if="item?.shiYi?.wordInterpretationDTOList">
              <template v-for="(sy, key) in item.shiYi.wordInterpretationDTOList" :key="key">
                <text>{{ sy.terms }}</text>
                <text>{{ sy.interpretationContent }}</text>
              </template>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="noData" v-else>
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
      />
      <view>暂无相关单词</view>
    </view>
    <nut-popup
      position="bottom"
      :style="{ maxHeight: '80%' }"
      lock-scroll
      round
      v-model:visible="vdata.directory"
    >
      <view class="directory">
        <view class="topTitInfo">
          <view class="directoryTitle">目录</view>
          <image
            @tap="vdata.directory = false"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/47bed41528a3418b9111e5199de4ab61/icon1.png"
            mode="scaleToFill"
          />
        </view>
        <view class="directoryList">
          <view
            class="directoryItem"
            v-for="(item, i) in vdata.northWordChapterDTOList"
            :key="i"
            @tap="chooseUnit(item)"
          >
            <view class="direLeft">
              <text>{{ item.unitValue }}</text>
              <!-- <text class="oraStudy" v-if="item.hasCompleted">已学</text> -->
            </view>
            <view> </view>
          </view>
        </view>
      </view>
    </nut-popup>
  </view>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, useRecite } from '@/stores'
import { getReciteInfo, getWordInfo } from '@/api/reciteWords'
const system = useSystem()
const recite = useRecite()
const { navBarHeight } = system.navBarInfo
import { reactive, onMounted, computed } from 'vue'
const vdata = reactive({
  fixedStyle: {
    color: '#fff',
  },
  directory: false,
  tabType: 0,
  unitKey: '',
  unitValue: '',
  searchInfo: {
    condition: {
      bookId: 0,
      studyType: 0,
      unitKey: 0,
    },
    current: 1,
    orders: [
      {
        asc: true,
        column: '',
      },
    ],
    size: 10,
  },
  northWordChapterDTOList: [],
  wordList: [],
  total: 0,
  isFlag: false,
})
const isFlag = computed(() => {
  return Taro.getStorageSync('isFlag') ? true : false
})
//tab切换
const tabChange = (num) => {
  vdata.tabType = num
  vdata.searchInfo.condition.studyType = num
  queryList()
}
// 章节弹框
const changeUnit = () => {
  vdata.directory = true
}
//获取章节
const getUnitList = (bookId) => {
  getReciteInfo('chapter', { bookId }).then((res) => {
    if (res) {
      vdata.northWordChapterDTOList = res.northWordChapterDTOList || []
    }
  })
}
// 分页
const lower = () => {
  if (hasNext()) {
    getWordList()
  }
}
const hasNext = () => {
  if (vdata.searchInfo.current * vdata.searchInfo.size < vdata.total) {
    vdata.searchInfo.current = vdata.searchInfo.current + 1
    return true
  } else {
    return false
  }
}
const queryList = () => {
  vdata.wordList = []
  vdata.searchInfo.current = 1
  getWordList()
}
const getWordList = () => {
  getWordInfo('page', vdata.searchInfo, true).then((res: any) => {
    if (res) {
      vdata.wordList = vdata.wordList.concat(res.records || [])
      vdata.total = res.total
    }
  })
}
//音频相关
let audioCtx: any = null
// 播放
const play = (item) => {
  audioReset()
  item.isListened = true
  if (!audioCtx) {
    audioCtx = Taro.createInnerAudioContext()
  }
  let src = null
  if (recite.seting.pronunciation == 1) {
    src =
      item?.faYin?.pronunciationAm?.phoneticSymbolUrl ||
      item?.faYin?.pronunciationAm?.otherUrl ||
      item?.faYin?.pronunciationEn?.phoneticSymbolUrl ||
      item?.faYin?.pronunciationEn?.otherUrl
  } else {
    src =
      item?.faYin?.pronunciationEn?.phoneticSymbolUrl ||
      item?.faYin?.pronunciationEn?.otherUrl ||
      item?.faYin?.pronunciationAm?.phoneticSymbolUrl ||
      item?.faYin?.pronunciationAm?.otherUrl
  }
  audioCtx.src = src
  audioCtx.play()
  audioCtx.onEnded(() => {
    item.isListened = false
    audioCtx.stop()
  })
}
const look = (item) => {
  item.isSelected = true
}
//重置
const audioReset = () => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  vdata.wordList.map((item: any) => {
    item.isListened = false
  })
}
//章节选择
const chooseUnit = (item) => {
  vdata.unitValue = item.unitValue
  vdata.directory = false
  vdata.searchInfo.condition.unitKey = item.unitKey
  queryList()
}
const closePop = () => {
  vdata.isFlag = true
  Taro.setStorageSync('isFlag', true)
}
onMounted(() => {
  vdata.isFlag = Taro.getStorageSync('isFlag') ? true : false
  let currentSearch = JSON.parse(JSON.stringify(recite.currentBook))
  vdata.searchInfo.condition.bookId = currentSearch.bookId
  vdata.searchInfo.condition.unitKey = currentSearch.unitKey
  vdata.unitValue = currentSearch.unitValue
  getWordList()
  getUnitList(currentSearch.bookId)
})
</script>
<style lang="scss">
.wordListMain {
  height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/460e28cdddcb4e62b1752511362a4a48/bdcBg.png')
    no-repeat top;
  background-size: 100%;
  box-sizing: border-box;
  // padding: 0 20px;
  .tabInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 27px;
    box-sizing: border-box;
    // view {
    //   margin: 0 15px;
    // }
    .left {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #666666;
      flex-shrink: 0;
      .firstSelect {
        margin-right: 36px;
      }
      .selectTab {
        color: #2f5de7;
        position: relative;
        font-weight: 600;
      }
      .selectTab::after {
        position: absolute;
        content: '';
        width: 36px;
        height: 4px;
        bottom: -7px;
        left: 50%;
        right: 0;
        background: #2f5de7;
        display: inline-block;
        border-radius: 2px;
        transform: translateX(-50%);
      }
    }
    .right {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      text-align: right;
      color: #333333;

      view {
        max-width: 150px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
      }
    }

    image {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
  }
  .scrollInfo {
    box-sizing: border-box;
    .scroll-item {
      padding: 10px 0;
      margin: 0 20px;
      border-bottom: 1px solid rgba(239, 239, 239, 0.7);
      .word {
        font-family: SourceHanSansCN-Bold;
        font-size: 16px;
        font-weight: bold;
        line-height: 19px;
        color: #333333;
      }

      .pronunciation {
        position: relative;
        margin: 5px 0 8px;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        height: 24px;
        color: #727488;
        image {
          width: 16px;
          height: 16px;
        }
        .pronunciationCon {
          display: flex;
          align-items: center;
          position: absolute;
          background: #eff7ff;
          border-radius: 4px;
          padding: 0 8px;
          height: 24px;
        }
        .playDh {
          position: absolute;
          top: -30px;
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/8881cd2ff8aa4756ae737e4cc92f441c/dhbg.png')
            no-repeat center;
          background-size: 100% 100%;
          width: 124px;
          height: 36px;
          left: 70px;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
          animation: moveAnimation 1s ease-in-out infinite;
          padding-top: 9px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #ffffff;
          image {
            width: 7px;
            height: 12px;
            margin-right: 5px;
          }
        }
      }

      .interpretation {
        position: relative;
        .bg {
          width: 207px;
          height: 24px;
          background: linear-gradient(90deg, #f1f8ff -1%, #e0ecfa 100%);
        }
        .playDh {
          position: absolute;
          top: -13px;
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/8881cd2ff8aa4756ae737e4cc92f441c/dhbg.png')
            no-repeat center;
          background-size: 100% 100%;
          width: 124px;
          height: 36px;
          right: 50px;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
          padding-top: 9px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #ffffff;
          animation: moveAnimation 1s ease-in-out infinite;
          image {
            width: 7px;
            height: 12px;
            margin-right: 5px;
          }
        }
        .interMain {
          display: flex;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #343434;
          .unit {
            font-family: PingFangSC-Semibold;
            font-size: 12px;
            font-weight: 600;
            line-height: 14px;
            color: #343434;
            width: 25px;
            flex-shrink: 0;
            margin-right: 8px;
          }
          .syList {
            display: flex;
            align-items: center;
          }
        }
      }
      @keyframes moveAnimation {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(10px);
        }
        100% {
          transform: translateY(0);
        }
      }
    }
  }
  .noData {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transform: translate(-50%, -50%);
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #414141;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 20px;
    }
  }
  .directory {
    padding: 0 16px 10px;
    .topTitInfo {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .directoryTitle {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        font-weight: 500;
        color: #06080d;
        font-weight: 700;
      }
      image {
        width: 24px;
        height: 24px;
      }
    }
    .directoryList {
      .directoryItem {
        padding: 20px 0;
        border-top: 1px solid rgba(236, 240, 246, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #333333;
        .direLeft {
          display: flex;
          align-items: center;
          .oraStudy {
            box-sizing: border-box;
            height: 14px;
            width: 30px;
            text-align: center;
            line-height: 12px;
            font-family: PingFangSC-Medium;
            font-size: 10px;
            color: #ff5b45;
            border: 1px solid #ff5b45;
            border-radius: 3px;
            margin-left: 5px;
          }
        }
      }
    }
  }
  .popup-bottom.round {
    border-radius: 18px 18px 0 0;
  }
}
</style>
