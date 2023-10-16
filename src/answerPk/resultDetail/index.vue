<template>
  <view class="resultMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar title="" />
    <view class="topScroll">
      <scroll-view
        class="scroll-view_H"
        :scroll-x="true"
        :show-scrollbar="false"
        :scroll-left="getSignLeft()"
      >
        <view class="scrollList">
          <view
            @tap="chooseItem(i)"
            :class="['scrollItem', vdata.current == i && 'scrollItemSelect']"
            v-for="(item, i) in vdata.questionList.length"
            :key="i"
            >{{ item }}</view
          >
        </view>
      </scroll-view>
      <view class="rightQuestion">
        <text>共{{ vdata.questionList.length }}题</text>
        <!-- <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/c523d1186a234c3ea028145625e32400/iconzk.png"
        /> -->
      </view>
    </view>
    <swiper
      class="swiper"
      :style="{ height: `calc(100vh - ${navBarHeight + 52}px)` }"
      indicator-color="#999"
      indicator-active-color="#333"
      :circular="false"
      :indicator-dots="false"
      :current="vdata.current"
      @change="changeCurrent"
      next-margin="15px"
      previous-margin="15px"
    >
      <swiper-item v-for="(item, i) in vdata.questionList" class="list-item" :key="i">
        <view class="list-item-info">
          <view class="timer">
            <view class="currentNum">第{{ i + 1 }}题</view>
            <view class="rightInfo" @tap="addWrong(item, i)" v-if="vdata.questionRightList[i]">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/adc2b0a17bd640c58b9ee7527e32c99c/ctb.png"
              />
              <text>加入错题本</text>
            </view>
            <view class="rightInfo" @tap="removeWrong(item, i)" v-else>
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/adc2b0a17bd640c58b9ee7527e32c99c/ctb.png"
              />
              <text>移除错题本</text>
            </view>
          </view>
          <view class="topPic">
            <view class="ques-topic clearfix">
              <rich-text class="ques-type" :nodes="getStem(item)"></rich-text>
            </view>
            <view class="questionList">
              <view
                v-for="(suboption, index) in getOptions(item)"
                :key="index"
                class="questionItem"
              >
                <view class="answer-word">{{ optionTag(index) }} </view>
                <rich-text class="answer-item-choose" :nodes="getAnswerStem(suboption)"></rich-text>
              </view>
            </view>
          </view>
          <view class="analysisInfo">
            <answer-analysis :ques="item"> </answer-analysis>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
  <!-- </view> -->
  <!-- </scroll-view> -->
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { onMounted, reactive } from 'vue'
import { useSystem, usePerson, useAnswerPk } from '@/stores'
import AnswerAnalysis from '@/components/QuestionItemAnalysis/AnswerAnalysis.vue'
import { addWrongInfo } from '@/api/intelligentQuestion'
import { removeWrobook } from '@/api/wrongbook'
const system = useSystem()
const answerPk = useAnswerPk()
const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  answer: '请输入正确答案...',
  dataList: [],
  showBg: false,
  current: 0,
  questionList: [],
  questionRightList: [],
})
// 获取题干
const getStem = (ques) => {
  let stem = ''
  if (ques && ques.context) {
    stem = formatRichTextInfo(ques.context.stem, 260) || ''
  } else {
    stem = ''
  }
  return stem
}
//答案
const getAnswerStem = (ques) => {
  let stem = ''
  stem = formatRichTextInfo(ques, 210)
  return stem
}
const addWrong = (item, i) => {
  let params = {
    id: item.questionCode,
    bookOriginType: '4',
    subject: answerPk.saveInfo?.subject,
    grade: answerPk.saveInfo?.grade,
    term: answerPk.saveInfo?.term,
  }
  addWrongInfo(params).then((res) => {
    Taro.showToast({
      title: '已加入错题本',
      icon: 'none',
      duration: 2000,
    })
    vdata.questionRightList[i] = !vdata.questionRightList[i]
  })
}
const removeWrong = (item, i) => {
  let params = {
    exerciseBookIds: [item.questionCode],
  }
  removeWrobook(params).then((res) => {
    setTimeout(() => {
      Taro.showToast({
        title: '移除成功',
        icon: 'none',
        duration: 2000,
      })
    }, 100)
    vdata.questionRightList[i] = !vdata.questionRightList[i]
  })
}
const formatRichTextInfo = (str, width) => {
  // var reg1 = new RegExp('(i?)(<img)(?!(.*?style=[\'"](.*)[\'"])[^>]+>)', 'gmi')
  // let result = ''
  // str = str.replace(/<table[^>]*>/gi, '<table max-width="100%"  style="max-width:100%;"')
  // if (reg1.test(str)) {
  //   result = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  // } else {
  //   // let srcReg = /(?<=(<img[^>]style="))[^"]*/g
  //   let srcReg = new RegExp('(?<=(<img[^>]style="))[^"]', 'gmi')
  //   let videoList = str.match(srcReg) || []
  //   if (videoList && videoList.length) {
  //     if (videoList[0].indexOf('width') != -1) {
  //       result = str.replace(
  //         /(<img[^>]*style="[^"]*?)(\bwidth\s*:\s*\d+[^;"]*?px;)(\s?height\s*:\s*\d+[^;"]*?px;)([^<]*\/>)/gi,
  //         function (match, p1, p2, p3, p4) {
  //           var widthValue = parseInt(p2.match(/\d+/)[0])
  //           // var heightValue = parseInt(p3.match(/\d+/)[0])
  //           if (widthValue > width) {
  //             return p1 + `width: ${width}px; height: auto;` + p4
  //           }
  //           return match // 如果width小于等于375，则不做替换，保持原样
  //         }
  //       )
  //     } else {
  //       result = str.replace(/<img[^>]*>/gi, function (match, capture) {
  //         match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
  //         return match
  //       })
  //       result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  //       result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  //     }
  //   } else {
  //     result = str.replace(/<img[^>]*>/gi, function (match, capture) {
  //       match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
  //       return match
  //     })
  //     //再设置新的样式
  //     result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  //     result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  //   }
  // }
  // return result
  let result = ''
  let reg1 = /<img[^>]style="[^"]*/g
  str = str.replace(/<table[^>]*>/gi, '<table max-width="100%"  style="max-width:100%;"')
  if (!reg1.test(str)) {
    result = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  } else {
    // let srcReg = /(?<=(<img[^>]style="))[^"]*/g
    // let srcReg = new RegExp('(?<=(<img[^>]style="))[^"]', 'gmi')
    let srcReg = /<img[^>]style="[^"]*/g
    let videoList = str.match(srcReg) || []
    if (videoList && videoList.length) {
      if (videoList[0].indexOf('width') != -1) {
        result = str.replace(
          /(<img[^>]*style="[^"]*?)(\bwidth\s*:\s*\d+[^;"]*?px;)(\s?height\s*:\s*\d+[^;"]*?px;)([^<]*\/>)/gi,
          function (match, p1, p2, p3, p4) {
            var widthValue = parseInt(p2.match(/\d+/)[0])
            // var heightValue = parseInt(p3.match(/\d+/)[0])
            if (widthValue > width) {
              return p1 + `width: ${width}px; height: auto;` + p4
            }
            return match // 如果width小于等于375，则不做替换，保持原样
          }
        )
      } else if (videoList[0].indexOf('height') != -1) {
        result = str.replace(
          /(<img[^>]*style="[^"]*?)(\s?height\s*:\s*\d+[^;"]*?px;)([^<]*\/>)/gi,
          function (match, p1, p2, p3) {
            var widthValue = parseInt(p2.match(/\d+/)[0])
            if (widthValue > width) {
              return p1 + `width: ${width}px;` + p3
            }
            return match // 如果width小于等于375，则不做替换，保持原样
          }
        )
      } else {
        result = str.replace(/<img[^>]*>/gi, function (match, capture) {
          match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
          return match
        })
        result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
        result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
      }
    } else {
      result = str.replace(/<img[^>]*>/gi, function (match, capture) {
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
        return match
      })
      //再设置新的样式
      result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
      result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
    }
  }
  return result
}
const chooseItem = (num) => {
  vdata.current = num
}
const getSignLeft = () => {
  let scroll = 0
  if (vdata.current >= 6) {
    scroll = 335
  } else {
    scroll = 0
  }
  return scroll
}
// 获取选项
const getOptions = (ques) => {
  if (ques && ques.context) {
    return ques.context.options
  } else {
    return null
  }
}
const optionTag = (i) => {
  const optionlist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return optionlist.charAt(i)
}
const remove = (item, i) => {
  let params = {
    exerciseBookIds: [item.exerciseBookId],
  }
  removeWrobook(params).then((res) => {
    vdata.deleteList.push(item.exerciseBookId)
    Taro.setStorageSync('deleteList', vdata.deleteList)
    vdata.dataList.splice(i, 1)
    if (!vdata.dataList.length) {
      Taro.navigateBack({ delta: 1 })
      return
    }
    if (i > 0) {
      vdata.current = i >= vdata.dataList.length - 1 ? vdata.dataList.length - 1 : i
    } else {
      vdata.current = 0
    }
  })
}
const changeCurrent = (e) => {
  vdata.current = e.detail.current
}
useDidShow(() => {})
onMounted(() => {
  vdata.questionList = answerPk?.questionInfo.questionList
  answerPk?.answerInfo?.answerList.forEach((item: any) => {
    vdata.questionRightList.push(item.northSubmitResult == 1)
  })
})
</script>

<style lang="scss">
.resultMain {
  height: 100vh;
  box-sizing: border-box;
  .topScroll {
    height: 52px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .scroll-view_H {
      padding-left: 20px;
      flex: 1;
      box-sizing: border-box;
      flex-shrink: 0;
      width: calc(100vw - 100px);
    }
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
      display: none;
    }
    .scrollList {
      display: flex;
      width: 100%;
      .scrollItem {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        text-align: center;
        line-height: 28px;
        margin-right: 9px;
        background: #f6f6f6;
        flex-shrink: 0;
      }
      .scrollItemSelect {
        background: #2f5de7;
        color: #fff;
      }
    }
    .rightQuestion {
      width: 94px;
      text-align: center;
      line-height: 52px;
      background: #fff;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      image {
        width: 16px;
        height: 16px;
        margin-left: 4px;
      }
    }
  }
}
// .scroll-view_H {
//   background: #fff;
//   height: 100vh;
//   padding: 15px;
//   overflow: scroll;
//   box-sizing: border-box;
.swiper {
  background: #ebf4fc;
  background: #f6f9fd;
  height: 100%;
  box-sizing: border-box;
  .list-item {
    height: 100%;
    padding-right: 10px;
    box-sizing: border-box;
    padding: 16px 10px 16px 0;
    .list-item-info {
      background: #fff;
      height: 100%;
      overflow: scroll;
      box-sizing: border-box;
      padding: 16px;
      border-radius: 8px;
      .timer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .currentNum {
          padding: 3px 8px;
          border-radius: 8px;
          background: #f4f4f4;
          border-radius: 4px;
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: #666666;
        }
        .rightInfo {
          display: flex;
          align-items: center;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #333333;
          image {
            width: 12px;
            height: 12px;
            margin-right: 5px;
          }
        }
      }
      .topPic {
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid #ecf0f6;
        font-size: 14px;
        border-radius: 8px;
        .questionItem {
          padding: 10px 0;
          display: flex;
          align-items: center;
        }
        .answer-word {
          width: 20px;
          text-align: center;
          flex-shrink: 0;
          font-size: 14px;
          color: #333333;
        }
        .answer-item-choose {
          flex: 1;
          padding-left: 10px;
          box-sizing: border-box;
        }
      }
      .analysisInfo {
        .answerText {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #333333;
          margin-bottom: 10px;
          margin-top: 20px;
          image {
            width: 16px;
            height: 16px;
            margin-right: 8px;
          }
        }
      }
    }
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
      display: none;
    }
  }
}
</style>
