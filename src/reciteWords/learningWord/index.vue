<template>
  <view class="learningWordMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar title="背单词"></NavBar>
    <scroll-view
      v-if="!vdata.already"
      class="scrollInfo"
      :scroll-y="true"
      :style="{
        height: `calc(100vh - ${navBarHeight}px)`,
      }"
    >
      <view :style="{ paddingBottom: vdata.isDetail ? '93px' : '10px' }">
        <view class="stepInfo">
          <view class="stepBg">
            <view class="step" :style="getStep"></view>
          </view>
          <view class="group">
            <view>
              <text>第{{ vdata.currentGroup || 0 }}组</text>
              <text>/共{{ vdata.groupList.length || 0 }}组</text>
            </view>
            <view>
              <text>本组进度</text>
              <text>{{ vdata.current + 1 }}/{{ vdata.currentList.length }}</text>
            </view>
          </view>
        </view>
        <template v-for="(item, i) in vdata.currentList" :key="i">
          <view v-if="vdata.current === i">
            <view class="topInfo">
              <view class="wordInfo">
                <!-- 给出英文单词，并对应给出四个选项，选择对应汉语意思 -->
                <template v-if="item.type == 1">
                  <view class="wordFirst">
                    <view class="word">{{ getWordText(item, item.type) }}</view>
                    <view class="pronunciation">
                      <text v-if="recite.seting.pronunciation == 1">{{
                        item?.faYin?.pronunciationAm?.phoneticSymbol ||
                        item?.faYin?.pronunciationEn?.phoneticSymbol
                      }}</text>
                      <text v-else>{{
                        item?.faYin?.pronunciationEn?.phoneticSymbol ||
                        item?.faYin?.pronunciationAm?.phoneticSymbol
                      }}</text></view
                    >
                    <view @tap="play(item)">
                      <image
                        class="yp"
                        :src="
                          item.isListened
                            ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/416128c8818243e3960c10062f354439/lbGif.gif'
                            : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/cd3d35809c5349d68e578c6bf80ee0d0/yp.png'
                        "
                        mode="scaleToFill"
                      />
                    </view>
                  </view>
                </template>
                <!-- 给出汉语意思，并对应给出四个选项，选择对应英文单词 -->
                <template v-else-if="item.type == 2">
                  <view class="wordScend">{{ getWordText(item, item.type) }}</view>
                </template>
                <!-- 给出英文语音，并对应给出四个选项，选择对应汉语意思 -->
                <!-- 给出英文语音，弹出对应输入法，输入英语单词 -->
                <template v-else>
                  <view class="wordThree" :style="{ paddingTop: vdata.isDetail ? '0px' : '130px' }">
                    <view class="word" v-if="vdata.isDetail">{{ getWordText(item, 1) }}</view>
                    <image
                      @tap="play(item)"
                      class="yp"
                      :src="
                        item.isListened
                          ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/416128c8818243e3960c10062f354439/lbGif.gif'
                          : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/cd3d35809c5349d68e578c6bf80ee0d0/yp.png'
                      "
                      mode="scaleToFill"
                    />
                  </view>
                </template>
              </view>
            </view>
            <template v-if="!vdata.isDetail">
              <view class="questList">
                <template v-if="item.type != 4">
                  <view
                    :class="[
                      'quest-item',
                      vdata.currentSelect === k && 'isError',
                      vdata.isRight === true && vtem.isRight && 'isRight',
                    ]"
                    v-for="(vtem, k) in item.shiYi"
                    :key="k"
                    @tap="chooseAnswer(vtem.isRight, k, item, i, vtem)"
                  >
                    <template v-if="item.type == 1">
                      {{ getAnswerText(vtem, item.type) }}
                      <image
                        v-if="vdata.isRight === vtem.isRight"
                        class="isAnswerImg"
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/eda34142df3d4c5aaed50dbe958e2a1d/right.png"
                        mode="scaleToFill"
                      />
                      <image
                        v-if="vdata.currentSelect === k"
                        class="isAnswerImg"
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/d9ae0dca2a954f07a117dc6affa69db1/error.png"
                        mode="scaleToFill"
                      />
                    </template>
                    <template v-else-if="item.type == 2">
                      {{ vtem.englishWord }}
                      <image
                        v-if="vdata.isRight === vtem.isRight"
                        class="isAnswerImg"
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/eda34142df3d4c5aaed50dbe958e2a1d/right.png"
                        mode="scaleToFill"
                      />
                      <image
                        v-if="vdata.currentSelect === k"
                        class="isAnswerImg"
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/d9ae0dca2a954f07a117dc6affa69db1/error.png"
                        mode="scaleToFill"
                      />
                    </template>
                    <template v-else-if="item.type == 3">
                      {{ getAnswerText(vtem, 1) }}
                      <image
                        v-if="vdata.isRight === vtem.isRight"
                        class="isAnswerImg"
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/eda34142df3d4c5aaed50dbe958e2a1d/right.png"
                        mode="scaleToFill"
                      />
                      <image
                        v-if="vdata.currentSelect === k"
                        class="isAnswerImg"
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/d9ae0dca2a954f07a117dc6affa69db1/error.png"
                        mode="scaleToFill"
                      />
                    </template>
                  </view>
                </template>
                <template v-else>
                  <view class="inputInfo">
                    <input
                      placeholder="请输入听到的单词"
                      type="text"
                      :value="vdata.answer"
                      :auto-focus="true"
                      @input="getText"
                      :selectionStart="100"
                      :selectionEnd="100"
                    />
                  </view>
                  <view class="submitAnswer" @tap="submitAnswer(item)">提交</view>
                </template>
              </view>
            </template>
            <template v-else>
              <view class="errorInfo">
                <view>
                  <view class="title">释义 </view>
                  <view>
                    <template v-for="(sy, key) in getRight(item.shiYi)" :key="key">
                      <text>{{ sy.terms }}</text>
                      <text>{{ sy.interpretationContent }}</text>
                    </template>
                  </view>
                </view>
              </view>
              <view class="example" v-if="vdata.detailInfo?.liJu">
                <view class="title">
                  <text class="lj">例句</text>
                </view>
                <view class="exampleList">
                  <view
                    class="exampleItem"
                    v-for="item in vdata.detailInfo.liJu.wordExampleSentenceDTOList"
                    :key="item"
                  >
                    <view class="englishText">{{ item.englishContent }}</view>
                    <!-- <view class="chineseText">{{ item.chineseContent }}</view> -->
                  </view>
                </view>
              </view>
            </template>
          </view>
        </template>
        <view class="footer" v-if="vdata.isDetail">
          <view class="footerBtn" v-if="vdata.isDetail" @tap="next">下一个</view>
        </view>
      </view>
    </scroll-view>
    <view v-else>
      <scroll-view
        class="scrollInfo"
        :scroll-y="true"
        :style="{
          height: `calc(100vh - ${navBarHeight + 93}px)`,
        }"
      >
        <view class="studyText">一小结的单词学完啦，休息下看看这些单词，你都记住了吗？</view>
        <view v-for="(item, i) in vdata.currentList" :key="i" class="scroll-item">
          <view class="word">{{ getWordText(item, 1) }}</view>
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
                    : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/d899a708a89e42f09c8a361d8d289a5d/bf.png'
                "
                mode="scaleToFill"
              />
            </view>
          </view>
          <view class="interpretation">
            <template v-if="!item.isSelected">
              <view class="bg" @tap="look(item)"></view>
            </template>
            <view class="interMain" v-else>
              <view class="unit">释义 </view>
              <view>
                <template v-for="(sy, key) in getRight(item.shiYi)" :key="key">
                  <text>{{ sy.terms }}</text>
                  <text>{{ sy.interpretationContent }}</text>
                </template>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="footer">
        <view class="nextBtn" @tap="nextGrop" v-if="vdata.currentGroup !== vdata.groupList.length"
          >下一组</view
        >
        <view class="nextBtn" @tap="returnHome" v-else>返回首页</view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { getWordInfo, getWordDetail } from '@/api/reciteWords'
import { useSystem, useRecite } from '@/stores'
const system = useSystem()
const recite = useRecite()
const { navBarHeight } = system.navBarInfo
import { reactive, computed } from 'vue'

const vdata: any = reactive({
  fixedStyle: {
    color: '#fff',
  },
  tabType: 1,
  status: '',
  bookId: '',
  unitKey: '',
  groupList: [],
  currentGroup: 1,
  current: 0,
  currentList: [],
  isRight: '', //是否正确
  currentSelect: '', //当前选择的
  isDetail: false, //是否展示详情
  detailInfo: {},
  already: false, //是否学完一组
  step: 0,
  currentInfo: null,
  answer: '',
  isSubmit: true,
})
//tab切换
const tabChange = (num) => {
  vdata.tabType = num
}
// 计算进度条
const getStep = computed(() => {
  let width = Math.round((vdata.step / vdata.currentList.length) * 100)
  return {
    width: `${width}%`,
  }
})
//获取单词
const getWordText = (item, type) => {
  let str = ''
  let flagList = item.shiYi.filter((item: any) => item.isRight)
  if (flagList.length) {
    if (type == 1) {
      str = flagList[0].englishWord
    } else if (type == 2) {
      // flagList[0].shiYiDTO.wordInterpretationDTOList.forEach((vtem) => {
      //   let text = `${vtem.terms} ${vtem.interpretationContent};`
      //   str += text
      // })
      let text = flagList[0].shiYiDTO.wordInterpretationDTOList[0].terms
        ? `${flagList[0].shiYiDTO.wordInterpretationDTOList[0].terms} ${flagList[0].shiYiDTO.wordInterpretationDTOList[0].interpretationContent};`
        : `${flagList[0].shiYiDTO.wordInterpretationDTOList[0].interpretationContent}`
      str += text
    } else if (type == 3) {
      let text = flagList[0].shiYiDTO.wordInterpretationDTOList[0].terms
        ? `${flagList[0].shiYiDTO.wordInterpretationDTOList[0].terms} ${flagList[0].shiYiDTO.wordInterpretationDTOList[0].interpretationContent} ;`
        : `${flagList[0].shiYiDTO.wordInterpretationDTOList[0].interpretationContent}`
      str += text
    }
  }
  return str
}
//获取选项
const getAnswerText = (item, type) => {
  let str = ''
  if (item?.shiYiDTO?.wordInterpretationDTOList) {
    if (type == 1) {
      let text = item.shiYiDTO.wordInterpretationDTOList[0].terms
        ? `${item.shiYiDTO.wordInterpretationDTOList[0].terms} ${item.shiYiDTO.wordInterpretationDTOList[0].interpretationContent}`
        : `${item.shiYiDTO.wordInterpretationDTOList[0].interpretationContent}`
      str += text
    }
  }
  return str
}
//获取详情
const getRight = (item) => {
  let arrList = []
  let flagList = item.filter((item: any) => item.isRight)
  if (flagList.length) {
    arrList = flagList[0].shiYiDTO.wordInterpretationDTOList
  }
  return arrList
}
//查看单词
const look = (item) => {
  item.isSelected = true
}
// 选择答案
const chooseAnswer = (flag, i, first, key, vtem) => {
  if (vdata.isRight !== '') return
  //回答正确
  if (flag) {
    vdata.isRight = true
    vdata.step += 1

    if (recite.seting.sound) {
      const innerAudioContext = Taro.createInnerAudioContext()
      innerAudioContext.src =
        'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/6d14210d9ae84cc2b0535bbbeb47e2e7/success.mp3'
      innerAudioContext.play() // 播放
    }
    //提交
    if (!first.isPush) {
      let params = {
        bookId: vdata.bookId,
        unitKey: vdata.unitKey,
        contentId: first.contentId,
        isRight: true,
      }
      getWordInfo('submitResult', params).then((res) => {})
    }

    setTimeout(() => {
      if (vdata.current === vdata.currentList.length - 1) {
        // if (vdata.currentGroup === vdata.groupList.length) {
        // } else {
        // }
        vdata.already = true
      } else {
        vdata.current += 1
        play(vdata.currentList[vdata.current])
      }
      resetStatus()
    }, 1000)
  } else {
    //回答错误
    if (recite.seting.sound) {
      const innerAudioContext = Taro.createInnerAudioContext()
      innerAudioContext.src =
        'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/8d0f9f5de9ee4f8c9ec50fc1ee9ef489/error.mp3'
      innerAudioContext.play() // 播放
    }
    vdata.currentSelect = i
    vdata.isRight = true
    if (!first.isPush) {
      let params = {
        bookId: vdata.bookId,
        unitKey: vdata.unitKey,
        contentId: first.contentId,
        isRight: false,
      }
      getWordInfo('submitResult', params).then((res) => {})
    }
    setTimeout(() => {
      getWordDetail({ content: getWordText(first, 1) }).then((res) => {
        vdata.isDetail = true
        vdata.currentInfo = first
        vdata.detailInfo = res
        resetStatus()
      })
    }, 1000)
  }
}
const getText = (e) => {
  const { value } = e.detail
  vdata.answer = value
}
const submitAnswer = (item) => {
  if (!vdata.answer) {
    Taro.showToast({
      title: '请输入单词',
      icon: 'none',
      duration: 2000,
    })
    return
  }
  if (!vdata.isSubmit) {
    return
  }
  vdata.isSubmit = false
  let answerText = getWordText(item, 1).toLowerCase()
  let anserText = vdata.answer.toLowerCase()
  if (answerText === anserText) {
    vdata.step += 1
    //提交
    if (!item.isPush) {
      let params = {
        bookId: vdata.bookId,
        unitKey: vdata.unitKey,
        contentId: item.contentId,
        isRight: true,
      }
      getWordInfo('submitResult', params).then((res) => {})
    }
    if (recite.seting.sound) {
      const innerAudioContext = Taro.createInnerAudioContext()
      innerAudioContext.src =
        'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/6d14210d9ae84cc2b0535bbbeb47e2e7/success.mp3'
      innerAudioContext.play() // 播放
    }
    setTimeout(() => {
      vdata.answer = ''
      if (vdata.current === vdata.currentList.length - 1) {
        // if (vdata.currentGroup === vdata.groupList.length) {
        // } else {
        // }
        vdata.already = true
      } else {
        vdata.current += 1
        play(vdata.currentList[vdata.current])
      }
      vdata.isSubmit = true
    }, 1000)
  } else {
    //提交
    if (!item.isPush) {
      let params = {
        bookId: vdata.bookId,
        unitKey: vdata.unitKey,
        contentId: item.contentId,
        isRight: false,
      }
      getWordInfo('submitResult', params).then((res) => {})
    }
    if (recite.seting.sound) {
      const innerAudioContext = Taro.createInnerAudioContext()
      innerAudioContext.src =
        'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/8d0f9f5de9ee4f8c9ec50fc1ee9ef489/error.mp3'
      innerAudioContext.play() // 播放
    }
    setTimeout(() => {
      getWordDetail({ content: getWordText(item, 1) }).then((res) => {
        vdata.isDetail = true
        vdata.currentInfo = item
        vdata.detailInfo = res
        vdata.answer = ''
      })
      vdata.isSubmit = true
    }, 1000)
  }
}
// 下一组
const nextGrop = () => {
  vdata.currentList = vdata.groupList[vdata.currentGroup]
  vdata.currentGroup += 1
  vdata.already = false
  vdata.step = 0
  vdata.current = 0
  vdata.isDetail = false
  vdata.currentSelect = ''
  vdata.isRight = ''
  play(vdata.currentList[vdata.current])
}
const returnHome = () => {
  Taro.navigateBack({ delta: 1 })
}
// 下一个
const next = () => {
  resetStatus()
  vdata.isDetail = false
  vdata.currentList.splice(vdata.current, 1)
  vdata.currentInfo.isPush = true
  vdata.currentList.push(vdata.currentInfo)
  play(vdata.currentList[vdata.current])
}
//重置状态
const resetStatus = () => {
  vdata.isRight = ''
  vdata.currentSelect = ''
}
//音频相关
let audioCtx: any = null
const play = (item) => {
  audioReset()
  item.isListened = true
  audioCtx = Taro.createInnerAudioContext()
  let src = null
  if (recite.seting?.pronunciation == 1) {
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
  if (item.type == 2) {
    return
  }
  audioCtx.src = src
  audioCtx.play()
  audioCtx.onEnded(() => {
    item.isListened = false
    audioCtx.stop()
  })
}
const audioReset = () => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  vdata.currentList.map((item) => {
    item.isListened = false
  })
}
const queryList = () => {
  let params = {
    bookId: vdata.bookId,
    unitKey: vdata.unitKey,
    status: vdata.status,
  }
  getWordInfo('pushWords', params).then((res: any) => {
    if (res && res.northWordDTOList) {
      let arrList = res.northWordDTOList
      let index = 10
      let length = Math.ceil(arrList.length / 10)
      for (var i = 0; i < length; i++) {
        let list = arrList.slice(i * index, (i + 1) * index)
        list.forEach((item, i) => {
          item.shiYi = randomSort(item.shiYi)
          if (!item?.faYin?.pronunciationAm?.otherUrl && !item?.faYin?.pronunciationEn?.otherUrl) {
            item.type = 2
          } else if (i < 2) {
            item.type = 1
          } else if (i >= 2 && i < 4) {
            item.type = 2
          } else if (i >= 4 && i < 7) {
            item.type = 3
          } else {
            item.type = 4
          }
        })
        let random = randomSort(list)
        vdata.groupList.push(random)
      }
      // vdata.groupList = randomSort(questionList)
      vdata.currentList = vdata.groupList[0]
      play(vdata.currentList[0])
    }
  })
}
const randomSort = (arr) => {
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
useDidShow(() => {
  let currentBook = JSON.parse(JSON.stringify(recite.currentBook))
  vdata.bookId = currentBook.bookId
  vdata.unitKey = currentBook.unitKey
  vdata.status = currentBook.status
  queryList()
})
</script>
<style lang="scss">
.learningWordMain {
  height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/460e28cdddcb4e62b1752511362a4a48/bdcBg.png')
    no-repeat top;
  background-size: 100%;
  box-sizing: border-box;
  .scrollInfo {
    box-sizing: border-box;
    .stepInfo {
      position: absolute;
      top: 15px;
      left: 22px;
      right: 22px;
      .stepBg {
        height: 6px;
        border-radius: 3px;
        background: #daeaff;
        .step {
          height: 6px;
          background: #2f5de7;
          border-radius: 3px;
          width: 10%;
        }
      }
      .group {
        margin-top: 9px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #343434;
      }
    }
    .topInfo {
      min-height: 239px;
      // position: relative;
      .wordInfo {
        // text-align: center;
        padding: 0 22px;
        box-sizing: border-box;
        .wordFirst {
          text-align: center;
        }
        .word {
          font-family: SourceHanSansCN-Bold;
          font-size: 38px;
          font-weight: bold;
          color: #343434;
          padding-top: 65px;
          margin-bottom: 33px;
        }
        .pronunciation {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #343434;
          margin-bottom: 17px;
        }
        .yp {
          width: 36px;
          height: 29px;
        }
        .wordScend {
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 1;
          padding-top: 110px;
        }
        .wordThree {
          text-align: center;
          padding-top: 130px;
        }
      }
    }
    .questList {
      padding: 36px 36px 0;
      .inputInfo {
        height: 60px;
        border-radius: 8px;
        box-sizing: border-box;
        border: 1px solid #daecff;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .input-placeholder {
          color: #ccc;
        }
        .h5-input {
          width: 100%;
        }
      }
      .submitAnswer {
        height: 44px;
        border-radius: 23px;
        background: #2f5de7;
        text-align: center;
        line-height: 44px;
        margin-top: 45px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #f9f9f9;
      }
      .quest-item {
        background: #ffffff;
        box-sizing: border-box;
        border: 1px solid #eef2f6;
        // box-shadow: 0px 2px 4px 0px rgba(219, 226, 231, 0.3);
        // height: 60px;
        margin-bottom: 14px;
        border-radius: 14px;
        display: flex;
        padding: 20px 18px;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #343434;
        position: relative;
      }
      .isRight {
        background: #d2f9e1;
        padding: 20px 38px 20px 18px;
        border: none;
      }
      .isError {
        background: #ffdbd8;
        padding: 20px 38px 20px 18px;
        border: none;
      }
      .isAnswerImg {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .errorInfo {
      padding: 0 21px;
      color: #343434;
      font-family: PingFangSC-Semibold;
      .title {
        font-size: 12px;
        font-weight: 600;
        line-height: 14px;
        letter-spacing: 0px;
        margin-bottom: 5px;
      }
      text {
        font-size: 12px;
        line-height: 18px;
      }
      // .syList {
      //   display: flex;
      //   align-items: center;
      // }
    }
    .example {
      .title {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0px;
        margin: 50px 0 20px;
        width: 70px;
        height: 14px;
        line-height: -30px;
        position: relative;
        background: linear-gradient(270deg, rgba(185, 214, 255, 0.42) 0%, #ecf4ff 100%);
        .lj {
          position: relative;
          top: -7px;
          left: 5px;
        }
      }
      padding: 0 21px;
      .exampleList {
        .exampleItem {
          margin-bottom: 15px;
          background: rgba(236, 241, 249, 0.43);
          border-radius: 4px;
          padding: 10px 6px;
          .englishText {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            line-height: 30px;
            color: #343434;
            margin-bottom: 8px;
          }
          // .chineseText {
          //   color: rgba(52, 52, 52, 0.5);
          //   font-size: 14px;
          //   line-height: 20px;
          // }
        }
      }
    }
    .studyText {
      // height: 30px;
      border-radius: 19.5px;
      background: #e0eaff;
      // line-height: 30px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #343434;
      margin: 0 18px;
      padding: 7px 0 10px 7px;
      box-sizing: border-box;
    }
    .scroll-item {
      padding: 10px 0;
      margin: 0 18px;
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
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 93px;
    background: #fff;
    padding-top: 15px;
    box-sizing: border-box;
    z-index: 10;
    .footerBtn {
      width: 190px;
      height: 44px;
      border-radius: 23px;
      box-sizing: border-box;
      border: 1px solid #4a89ff;
      text-align: center;
      line-height: 44px;
      margin: 0 auto;
      color: #4a89ff;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
    }
    .nextBtn {
      background: #2f5de7;
      height: 44px;
      border-radius: 23px;
      text-align: center;
      line-height: 44px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #f9f9f9;
      margin: 0 25px;
    }
  }
}
</style>
