<template>
  <view class="bg_searchResultPopup">
    <view class="searchResultPopup">
      <view
        :style="{
          height: `${vdata.popupHeight}px`,
        }"
        v-if="vdata.popupShow"
      >
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
                  class="questionNo"
                  :class="{ selectquestionNo: vdata.questionNo == item.id }"
                  v-for="(item, index) in vdata.dataList"
                  :key="index"
                >
                  <view class="label" @tap="questionNoChange(item, index)">{{
                    Number(item.id) + 1
                  }}</view>
                </view>
              </view>
              <nut-swiper
                v-if="vdata.popupShow"
                ref="swipe"
                :is-prevent-default="false"
                :init-page="vdata.page3"
                :loop="false"
                @change="pageChange"
              >
                <nut-swiper-item v-for="(item, index) in vdata.dataList" :key="index">
                  <view class="resultListBox" v-if="item.resultList.length">
                    <!-- 结果一 -->
                    <view class="resultTitle" v-for="(element, i) in item.resultList" :key="i">
                      <view @tap="resultTitleChange(item, index, element.id)">{{
                        element.label
                      }}</view>
                      <view v-if="item.resultId == element.id" class="colorBlock"></view>
                    </view>
                    <!-- :style="{
                      height: `${vdata.conterBoxHeight}px`,
                    }" -->
                    <view
                      class="conterBox"
                      :style="{
                        height: `${vdata.popupHeight - 200}px`,
                      }"
                    >
                      <!-- 题目 -->
                      <view class="subject">
                        <view class="title">题目</view>
                        <!-- 题目类型 -->
                        <view class="type">
                          <view>{{ item.title }}</view>
                          <view class="selectSub">
                            <view>{{ item.subject.a }}</view>
                            <view>{{ item.subject.b }}</view>
                            <view>{{ item.subject.c }}</view>
                            <view>{{ item.subject.d }}</view>
                          </view>
                        </view>
                        <!-- <view class="type">
                    <image :style="{ width: '100%' }" src=""></image>
                  </view> -->
                      </view>
                      <!-- 题目解答 -->
                      <view class="answerBox">
                        <view class="title">题目解答</view>
                        <view class="answer">
                          <image
                            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/ef80ec8c7335409c838d2ed66e4aa048/answerIcon.png"
                            class="titleIcon"
                          ></image>
                          <view class="titleAnswer">答案</view>
                        </view>
                        <view class="correctAnswer">{{ item.answer }}</view>
                        <!-- 视频讲解 -->
                        <!-- <view class="answer">
                        <image
                          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/0a99ce516b5b4febad087d25f0516de7/videoExplanation.png"
                          class="titleIcon"
                        ></image>
                        <view class="titleAnswer">视频讲解</view>
                      </view>
                      <view class="videoBox"></view> -->
                        <!-- 解析 -->
                        <!-- <view class="answer">
                        <image
                          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/303cfe9068024919b15ec50f833c829c/analysisIcon.png"
                          class="titleIcon"
                        ></image>
                        <view class="titleAnswer">解析</view>
                      </view>
                      <view class="correctAnswer"
                        >这里是解析内容文案，这里是解析内容文案这里是解析内容文案，这里是解析内容文案这里是解析内容文案这里是解析内容文案，这里是解析内容文案这里是解析内容文案这里是解析内容文案。</view
                      > -->
                      </view>
                    </view>
                  </view>
                  <view class="box" v-else>
                    <view>
                      <image
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/db44470f5fd946ef8d93daf1ff5745fb/noResultBg.png"
                      ></image>
                      <view>暂未搜索到结果</view>
                    </view>
                  </view>
                </nut-swiper-item>
              </nut-swiper>
            </view>
          </view>
        </movable-area>

        <view class="flooter">
          <view @click="wrongQuestionBtn" class="wrongQuestionBtn">体验完毕，立即拍照</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro'
import { defineProps, withDefaults, reactive, ref, defineEmits, computed } from 'vue'
import { createApp } from 'vue'
//taro
import { Swiper, SwiperItem } from '@nutui/nutui-taro'
const emit = defineEmits(['handleChange', 'getPopupHeight', 'questionNoChangeEmit'])
const swipe = ref()
const vdata = reactive({
  y: 0,
  // initconterBoxHeight: 350,
  // conterBoxHeight: 350,
  popupHeight: 552,
  initHeight: 552,
  startNum: 0,
  endNum: 0,
  index: 0,
  addOrdelFlag: false,
  questionNo: '',
  dataList: [
    {
      id: '0',
      addOrdelFlag: false,
      resultId: '0',
      resultList: [
        { label: '结果一', id: '0' },
        { label: '结果二', id: '1' },
        { label: '结果三', id: '2' },
      ],
      type: 'pic',
      title: '一、看拼音，写词语',
      subject: {
        //  题目选项
        a: 'tian kong( )',
        b: 'yi jing( )',
        c: 'fei chang( )',
        d: 'jin xing( )',
      },
      answer: '天空 已经 非常 进行',
    },
    {
      id: '1',
      resultId: '0',
      addOrdelFlag: false,
      resultList: [{ label: '结果一', id: '0' }],
      type: 'pic',
      title: '二、写出带有下列偏旁的字，并组词',
      subject: {
        //  题目选项
        a: '氵____( )',
        b: '____( )',
        c: '亻____( )',
        d: ' ____( )',
      },
      answer: '汗（汗水）流（水流） 什（什么）仔（仔细）',
    },
    {
      id: '2',
      resultId: '0',
      resultList: [{ label: '结果一', id: '0' }],
      type: 'pic',
      title: '三、补全词语',
      subject: {
        //  题目选项
        a: '心（）（）和',
        b: '（）（）之众',
        c: '五（）六（）',
        d: '',
      },
      answer: '心（平）（气）和  （乌）（合）之众  五（颜）六（色）',
    },
    {
      id: '3',
      resultId: '0',
      resultList: [{ label: '结果一', id: '0' }],
      type: 'pic',
      title: '四、写出下列词语的近义词',
      subject: {
        //  题目选项
        a: '美丽——（ ）',
        b: '',
        c: '忙碌——（ ）',
        d: '',
      },
      answer: '美丽——（ 漂亮 ）  忙碌——（ 繁忙 ）',
    },
  ],
  popupShow: false,
  page3: 0,
  current: 1,
})
//  切换结果
const resultTitleChange = (item, index, id) => {
  vdata.dataList[index].resultId = id
  console.log(item, 'item')
  console.log(index, 'index')
  console.log(vdata.dataList, 'vdata.dataList')
}
const popupShow = () => {
  vdata.popupShow = true
}
const start = (e) => {
  e.stopPropagation()
  vdata.startNum = parseInt(e.touches[0].pageY)
  vdata.initHeight = vdata.popupHeight
  // vdata.initconterBoxHeight = vdata.conterBoxHeight
  console.log(e, '开始==========')
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
  vdata.questionNo = item.id || item.posId
  console.log(item, 'item')
  console.log(index, 'index')
  swipe.value.to(index)
  emit('questionNoChangeEmit', index + 1)
}
//  点击图片选框，切换题号
const changeNo = (val) => {
  vdata.questionNo = val
  swipe.value.to(val)
}
//  题目左右滑动切换
const pageChange = (index) => {
  console.log(index, '=======')
  vdata.index = index
  vdata.questionNo = String(index)
  emit('handleChange', vdata.index)
  emit('questionNoChangeEmit', index + 1)
}

//  体验完毕，立即拍照
const wrongQuestionBtn = () => {
  Taro.redirectTo({
    url: '../photographPage/index',
  })
}

defineExpose({
  popupShow,
  questionNoChange,
  changeNo,
})
</script>
<style lang="scss">
.bg_searchResultPopup {
  // width: 100vw;
  // height: 100vh;
  // overflow: hidden;
  // background: rgba(0, 0, 0, 0.3);
  // position: fixed;
  // bottom: 0;
  // left: 0;
  // position: fixed;
  // bottom: 0;
  // left: 0;
  // right: 0;
  // z-index: 999;
}

.searchResultPopup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
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
    border-radius: 10px;
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
        margin-top: 20px;
      }
      .label {
        display: inline-block;
      }
      .selectquestionNo {
        background: #0256ff;
        color: #fff;
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
        overflow: auto !important;
        // padding-right: 20px !important;
        width: 335px;
      }
      .subject {
        border-radius: 6px;
        padding: 15px;
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
            view {
              width: 50%;
              display: inline-block;
              margin-top: 12px;
            }
          }
        }
      }
      .answerBox {
        border-radius: 6px;
        padding: 15px;
        background: #ffffff;
        margin-bottom: 10px;
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
            display: inline-block;
            vertical-align: middle;
            font-size: 15px;
          }
        }
        .correctAnswer {
          font-size: 13px;
          line-height: 21px;
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
    }
    .resultListBox {
      padding: 0 20px;
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
  .flooter {
    width: 100%;
    height: 86px;
    opacity: 1;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    padding-top: 12px;
    .wrongQuestionBtn {
      text-align: center;
      margin: 0 auto;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      width: 345px;
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
</style>
