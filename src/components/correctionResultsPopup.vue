<template>
  <view class="bg_searchResultPopup">
    <view class="searchResultPopup">
      <view :style="handlePoput" v-if="vdata.popupShow">
        <movable-area
          class="movableArea"
          :style="{
            height: `${vdata.popupHeight}px`,
          }"
        >
          <view class="contentSearch">
            <view class="questionNoBox">
              <view class="top">
                <movable-view
                  class="blockBox"
                  @touchstart="start"
                  @touchmove="move"
                  @touchend="end"
                >
                  <view class="block"></view>
                </movable-view>
                <view
                  :style="{
                    marginTop: '20px',
                  }"
                >
                  <view class="production">
                    <view class="textInfo">
                      <view>
                        正确：<text class="successText">{{ numberInfo.correctNum }}</text
                        >题</view
                      >
                      <view>
                        错误：<text class="errorText">{{ numberInfo.wrongNum }}</text
                        >题</view
                      >
                    </view>
                    <view class="rightText"> 共{{ numberInfo.questionNum }}题 </view>
                  </view>
                  <scroll-view
                    class="scroll-view_H"
                    :scroll-x="true"
                    @scroll="scroll"
                    :enhanced="true"
                    :show-scrollbar="false"
                    :scroll-left="getSignTop()"
                  >
                    <view
                      class="questionNo"
                      :class="{
                        selectquestionNo: vdata.questionNo == item.questionNo,
                        displayNone: vdata.dataList.length <= 1 && !item.show,
                      }"
                      v-for="(item, index) in vdata.dataList"
                      :key="index"
                    >
                      <view class="label" @tap="questionNoChange(item, item.questionNo)">{{
                        Number(item.questionNo)
                      }}</view>
                    </view>
                  </scroll-view>
                </view>
              </view>
              <template v-if="!vdata.isAllRight">
                <nut-swiper
                  v-if="vdata.popupShow"
                  ref="swipe"
                  :is-prevent-default="false"
                  :init-page="vdata.page3"
                  :loop="false"
                  @change="pageChange"
                >
                  <nut-swiper-item v-for="(item, index) in vdata.dataList" :key="index">
                    <view class="resultListBox">
                      <view class="conterBox" :style="handleConter">
                        <!-- 题目 -->
                        <view class="conterBoxContent">
                          <view class="subject">
                            <view class="title">识别结果</view>
                            <rich-text :nodes="parse(item.text)"></rich-text>
                          </view>
                          <!-- 题目解答 -->
                          <view class="answerBox">
                            <view class="title">正确答案</view>
                            <rich-text :nodes="parse(item.rightText)"></rich-text>
                          </view>
                        </view>
                      </view>
                    </view>
                  </nut-swiper-item>
                </nut-swiper>
              </template>
              <view class="allRight" v-else>
                <view class="isRight">全对 ！</view>
                <view>你可太棒了～</view>
                <view class="rightImg">
                  <image
                    src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ksbp/91bcd0b8159247dab444c46713bada55/allright.png"
                    mode="scaleToFill"
                  />
                </view>
              </view>
            </view>
          </view>
        </movable-area>

        <view class="flooter">
          <view @tap="wrongQuestionBtn" class="wrongQuestionBtn"> 再拍一张 </view>
        </view>
      </view>
    </view>
    <grade-subjects
      @saveBook="saveBook"
      @closeBook="vdata.saveBook = false"
      v-if="vdata.saveBook"
    />
  </view>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro'
import parse from '@rojer/katex-mini'

import { defineProps, withDefaults, reactive, ref, defineEmits, computed } from 'vue'
import GradeSubjects from '@/components/GradeSubjects.vue'
const props: any = defineProps({
  type: false,
  tempFilePath: '',
  numberInfo: {},
})
const emit = defineEmits(['handleChange', 'getPopupHeight'])
const swipe = ref()
const vdata = reactive({
  index: 0, //  题号下标
  resuId: 0, //  多个结果下标
  resultIndex: 0,
  imgUrl: '',
  saveBook: false,
  // initconterBoxHeight: 350,
  // conterBoxHeight: 350,
  popupHeight: 552,
  initHeight: 552,
  startNum: 0,
  endNum: 0,
  addOrdelFlag: false,
  questionNo: '0',
  searchResultResponseList: [],
  dataList: [],
  popupShow: false,
  page3: 0,
  current: 1,
  correctRecordId: '',
  isAllRight: false,
})
const wrongQuestionBtn = () => {
  Taro.redirectTo({
    url: '/oralCorrection/photographPage/index',
  })
}
//  获取选项
const getOption = (val) => {
  return String.fromCharCode(64 + parseInt(val))
}
const scroll = ({ detail }) => {
  console.log(detail, 'detail=====')
}
const handlePoput = computed(() => {
  return {
    height: `${vdata.popupHeight}px`,
  }
})
const handleConter = computed(() => {
  return {
    height: `${vdata.popupHeight - 200}px`,
  }
})
//  显示弹框
const popupShow = (list, id?: Number) => {
  if (list && list.length) {
    vdata.searchResultResponseList = list
    vdata.dataList = list
    vdata.isAllRight = false
    vdata.questionNo = id ? id : vdata.dataList[0].questionNo
  } else {
    vdata.isAllRight = true
  }

  vdata.popupShow = true
}
const start = (e) => {
  e.stopPropagation()
  vdata.startNum = parseInt(e.touches[0].pageY)
  vdata.initHeight = vdata.popupHeight
}
const move = (e) => {
  e.stopPropagation()
  vdata.endNum = parseInt(e.touches[0].pageY)
  let num = vdata.initHeight + (vdata.startNum - vdata.endNum)
  if (num > 750) {
    vdata.popupHeight = 750
  } else if (num < 170) {
    vdata.popupHeight = 170
  } else {
    vdata.popupHeight = num
  }
  emit('getPopupHeight', vdata.popupHeight)
}
const end = (e) => {}
const closePopup = () => {}
//  题号切换
const questionNoChange = (item, index) => {
  vdata.questionNo = item.questionNo
  swipe.value.to(index - 1)
}
//  题目左右滑动切换
const pageChange = (index) => {
  vdata.index = index
  vdata.questionNo = index + 1
  emit('handleChange', vdata.index)
}
const getSignTop = () => {
  let scroll = 0
  if (vdata.index >= 8 && vdata.index <= 17) {
    scroll = 335
  } else if (vdata.index > 17) {
    scroll = 670
  }
  return scroll
}
//保存错题
const saveBook = (val) => {}
const toImg = (wrongQuestionId) => {}
defineExpose({
  popupShow,
  questionNoChange,
})
</script>
<style lang="scss">
.searchResultPopup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  .movableArea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .contentSearch {
    padding: 0 !important;
    box-sizing: content-box;
    background: #fafafa;
    min-height: 100%;
    border-radius: 8px;
    .questionNoBox {
      padding-top: 10px !important;
      // position: relative;
      .top {
        padding-left: 20px;
        width: calc(100% - 20px);
      }
      .blockBox {
        // position: absolute;
        // top: 0px;
        // left: 0;
        // width: 335px !important;
        width: 100%;
        height: 40px;
        text-align: center;
      }
      .imgWidth {
        width: 100%;
      }
      .imgUrl {
        width: 100%;
      }
      .block {
        width: 28px;
        height: 4px;
        border-radius: 2px;
        background: #cecece;
        display: inline-block;
        // margin: 0 auto;
        // position: absolute;
        // top: 10px;
        // left: 50%;
        // transform: translateX(-50%);
      }
      .production {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        font-family: PingFang SC;
        font-size: 16px;
        color: #333;
        .textInfo {
          display: flex;
          align-items: center;
          font-size: 14px;
          view {
            display: flex;
            align-items: center;
            margin-right: 10px;
          }
          .successText {
            font-weight: 700;
            color: #34cf86;
          }
          .errorText {
            font-weight: 700;
            color: #ff4141;
          }
        }
        .rightText {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #3d3d3d;
          display: flex;
          view {
            display: flex;
            align-items: center;
            margin-left: 10px;
          }
        }
      }
      .questionNo {
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 28px;
        line-height: 28px;
        background: #fff;
        margin-right: 10px;
        text-align: center;
        margin-bottom: 20px;
      }
      .label {
        display: inline-block;
      }
      .selectquestionNo {
        background: #0256ff;
        color: #fff;
      }
      .displayNone {
        display: none;
      }
      .resultTitle {
        font-size: 14px;
        line-height: 17px;
        color: rgba(51, 51, 51, 0.6);
        margin-right: 40px;
        padding-bottom: 15px;
        display: inline-block;
        .colorBlock {
          width: 20px;
          height: 2px;
          border-radius: 4px;
          background: #0256ff;
          margin: 0 auto;
          margin-top: 5px;
        }
      }
      .conterBox {
        // overflow: auto !important;
        // padding-right: 20px !important;
        // width: 335px;
        width: 100%;
        height: 100%;
        // box-sizing: border-box;
        // padding-bottom: 10px;
      }
      .conterBoxContent {
        padding-bottom: 10px;
        box-sizing: border-box;
      }
      .subject {
        border-radius: 6px;
        padding: 15px 0;
        background: #ffffff;
        margin-bottom: 10px;
        .title {
          font-weight: 600;
          color: #333333;
          margin-bottom: 12px;
        }
        .type {
          font-size: 13px;
          line-height: 21px;
          color: #666666;
          .selectSub {
            .questionAnswer {
              width: 100%;
              // display: inline-block;
              margin-top: 5px;
              vertical-align: top;
            }
          }
        }
      }
      .answerBox {
        border-radius: 6px;
        padding: 15px 0;
        background: #ffffff;

        .answer {
          // display: flex;
          margin-bottom: 9px;

          image {
            width: 17px;
            display: inline-block;
            height: 17px;
            vertical-align: middle;
            margin-right: 6px;
          }
          view {
            // display: inline-block;
            // vertical-align: middle;
            font-size: 15px;
          }
          .titleAnswer {
            display: inline-block;
            vertical-align: middle;
          }
          .selectSub {
            view {
              // width: 50%;
              display: inline-block;
              margin-top: 5px;
              vertical-align: top;
            }
          }
        }
        .correctAnswer {
          font-size: 13px;
          color: #666666;
          margin-bottom: 30px;
        }
        .videoBox {
          width: 233px;
          height: 131px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.7);
          margin-bottom: 30px;
        }
      }
      .selfCorrect {
        border-radius: 6px;
        opacity: 1;
        background: #fff;
        // margin-bottom: 30px;
        margin-top: 10px;
        padding: 11px 15px 30px 15px;
        .title {
          font-family: PingFang SC;
          color: #333333;
          font-size: 15px;
        }
        .describe {
          font-family: PingFang SC;
          font-size: 14px;
          line-height: 21px;
          color: #999999;
          margin-bottom: 20px;
        }
        .correctBox {
          display: flex;
          justify-content: space-around;
          view {
            width: 70px;
            height: 70px;
            opacity: 1;
            box-sizing: border-box;
            border: 1px solid #44c863;
            border-radius: 100%;
            text-align: center;
            line-height: 70px;
            color: #44c863;
            font-size: 14px;
          }
          .error {
            border: 1px solid #f24e3e;
            color: #f24e3e;
          }
        }
        .judge {
          padding-top: 20px;
        }
        .yesJudge {
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/5728614a1deb4573abbde8f7dfe5404b/yesJudge.png')
            no-repeat top !important;
          background-size: 100% 100% !important;
          border: 0px solid transparent !important;
        }
        .noJudge {
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzst/71123317af884a8fa5093396af87fed2/noJudge.png')
            no-repeat top !important;
          background-size: 100% 100% !important;
          border: 0px solid transparent !important;
        }
      }
    }
    .resultListBox {
      padding: 0 20px;
      overflow-y: scroll;
      background: #fff;
    }
    .box {
      // padding: 0 20px;
      // width: calc(100% - 20px);
      text-align: center;
      padding-top: 60px;
      // background: #fff;
      image {
        width: 160px;
        height: 130px;
        margin-bottom: 11px;
      }
      view {
        font-size: 12px;
        line-height: 17px;
        color: #414141;
        margin-bottom: 6px;
      }
    }
  }
  .allRight {
    height: 223px;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ksbp/8db379ee75ce402ab6cb3e58c5ece516/all.png')
      no-repeat center;
    background-size: 100% 100%;
    width: 100%;
    padding-left: 50px;
    box-sizing: border-box;
    position: relative;

    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-family: 苹方-简;
    font-size: 20px;
    .isRight {
      font-family: AlimamaShuHeiTi-Bold;
      font-size: 36px;
    }
    .rightImg {
      position: absolute;
      top: 0;
      right: 50px;
      image {
        width: 112px;
        height: 185px;
      }
    }
  }
  .flooter {
    width: 100%;
    height: 86px;
    opacity: 1;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    padding: 12px 15px 0;
    .wrongQuestionBtn {
      text-align: center;
      margin: 0 auto;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      height: 44px;
      border-radius: 22px;
      background: #0256ff;
      line-height: 44px;
    }
    .deleteQuestionBtn {
      border-radius: 22px;
      box-sizing: border-box;
      border: 1px solid #0256ff;
      background: #fff;
      color: #0256ff;
    }
  }
}
.nut-swiper-inner {
  height: 100% !important;
  .title {
    font-weight: 600;
    color: #333333;
    margin-bottom: 12px;
  }
}
.nut-swiper-item {
  // width: 355px !important;
  // margin-right: 20px !important;
  box-sizing: none !important;
}
.page-section-spacing {
  margin-top: 60rpx;
}
.scroll-view_H {
  white-space: nowrap;
  width: calc(100% - 20px);
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  color: transparent !important;
}
</style>
