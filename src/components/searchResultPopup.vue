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
                  <view class="production" v-if="props.correct">
                    <view>查看解析</view>
                    <view class="rightText">
                      <view>
                        <image
                          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/33d548ad971142d3914e0a53e76c0f59/right.png"
                          class="rightImg"
                          mode="scaleToFill"
                        />
                        <text>正确</text>
                      </view>
                      <view>
                        <image
                          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/12d09fbae00247aab794ac5fd1287142/error.png"
                          class="errorImg"
                          mode="scaleToFill"
                        />
                        <text>错误</text>
                      </view>
                    </view>
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
                        selectquestionNo: vdata.questionNo == item.searchResultSerialNo - 1,
                        displayNone: vdata.dataList.length <= 1 && !item.show,
                      }"
                      v-for="(item, index) in vdata.dataList"
                      :key="index"
                    >
                      <view class="label" @tap="questionNoChange(item, index)">{{
                        Number(item.searchResultSerialNo)
                      }}</view>
                    </view>
                  </scroll-view>
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
                  <view class="resultListBox">
                    <!-- 结果一 -->
                    <!-- <view v-if="props.correct">
                        <image :src="vdata.imgUrl" class="imgUrl" mode="widthFix" />
                      </view> -->
                    <!-- <view class="resultTitle" v-for="(element, i) in item.resultList" :key="i">
                      <view @tap="resultTitleChange(item, index, i)">{{ element.label }}</view>
                      <view v-if="item.resultId == element.id" class="colorBlock"></view>
                    </view> -->
                    <view class="conterBox" :style="handleConter">
                      <view class="imgWidth">
                        <image
                          :src="vdata.imgUrl"
                          class="imgUrl"
                          mode="widthFix"
                          :style="{ width: vdata.imgSize[index + '_' + 'index'] || 0 }"
                          @load="(e) => getImgSize(e, index + '_' + 'index')"
                        />
                      </view>
                      <!-- 题目 -->
                      <view v-if="!item.show" class="conterBoxContent">
                        <view class="resultTitle" v-for="(element, i) in item.resultList" :key="i">
                          <view @tap="resultTitleChange(item, index, i)">{{ element.label }}</view>
                          <view v-if="item.resultId == element.id" class="colorBlock"></view>
                        </view>
                        <view class="subject">
                          <view class="title">题目</view>
                          <!-- 题目类型 -->
                          <!-- <rich-text
                            :nodes="item.searchResultsContentResponseList[item.resultId].topic"
                          ></rich-text>
                          <view class="type">
                            <view class="selectSub">
                              <view
                                class="questionAnswer"
                                v-for="(option, i) in item.searchResultsContentResponseList[
                                  item.resultId
                                ].questionAnswer"
                                :key="i"
                                ><view>
                                  <view
                                    v-if="
                                      item.searchResultsContentResponseList[item.resultId]
                                        .questionType != 4
                                    "
                                    :style="{ display: 'flex' }"
                                  >
                                    <text v-if="option.stem" :style="{ marginRight: '10px' }"
                                      >{{ getOption(option.ids) }}：</text
                                    >
                                    <rich-text :nodes="option.stem"></rich-text>
                                  </view>
                                </view>
                              </view>
                            </view>
                          </view> -->
                          <view
                            class="newTopIcUrl"
                            v-if="item.searchResultsContentResponseList[item.resultId].topicUrl"
                          >
                            <image
                              mode="widthFix"
                              class="img"
                              :src="item.searchResultsContentResponseList[item.resultId].topicUrl"
                            ></image>
                          </view>
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
                            <!-- <view class="">
                              <view
                                v-if="
                                  item.searchResultsContentResponseList[item.resultId]
                                    .questionType != 4
                                "
                              >
                                <view :style="{ fontSize: '14px', display: 'inline-block' }"
                                  >正确答案</view
                                >
                                <view
                                  v-for="(option, i) in item.searchResultsContentResponseList[
                                    item.resultId
                                  ].answerList"
                                  :key="i"
                                  :style="{ paddingTop: '10px', display: 'inline-block' }"
                                  ><view>
                                    <text
                                      v-if="option.stem"
                                      :style="{ marginRight: '10px', fontSize: '14px' }"
                                      >{{ getOption(option.ids) }}</text
                                    >
                                  </view>
                                </view>
                              </view>
                              <view
                                v-else
                                class="questionAnswer"
                                v-for="(option, i) in item.searchResultsContentResponseList[
                                  item.resultId
                                ].questionAnswer"
                                :key="i"
                                ><view>
                                  <view v-if="option.stem">{{ i + 1 }}：{{ option.stem }}</view>
                                </view>
                              </view>
                            </view> -->
                            <view
                              class="newTopIcUrl"
                              v-if="item.searchResultsContentResponseList[item.resultId].answerUrl"
                            >
                              <image
                                class="img"
                                :src="vtem"
                                v-for="(vtem, v) in item.searchResultsContentResponseList[
                                  item.resultId
                                ].answerUrl"
                                :key="v"
                                mode="widthFix"
                              />
                            </view>
                            <view
                              v-else-if="
                                item.searchResultsContentResponseList[item.resultId]
                                  .questionOrcAnswer
                              "
                            >
                              {{
                                item.searchResultsContentResponseList[item.resultId]
                                  .questionOrcAnswer
                              }}
                            </view>
                          </view>
                          <!-- 视频讲解 -->
                          <!-- <view class="answer">
                          <image
                            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/0a99ce516b5b4febad087d25f0516de7/videoExplanation.png"
                            class="titleIcon"
                          ></image>
                          <view class="titleAnswer">视频讲解</view>
                        </view> -->
                          <!-- <view class="videoBox"></view> -->
                          <!-- 解析 -->
                          <view class="answer">
                            <image
                              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/303cfe9068024919b15ec50f833c829c/analysisIcon.png"
                              class="titleIcon"
                            ></image>
                            <view class="titleAnswer">解析</view>
                          </view>
                          <!-- <view class="correctAnswer">
                            <rich-text
                              :nodes="item.searchResultsContentResponseList[item.resultId].process"
                            ></rich-text>
                          </view> -->
                          <view class="correctAnswer">
                            <rich-text
                              :nodes="item.searchResultsContentResponseList[item.resultId].process"
                            ></rich-text>
                            <view
                              class="newTopIcUrl"
                              v-if="item.searchResultsContentResponseList[item.resultId].processUrl"
                            >
                              <image
                                class="img"
                                :src="img"
                                v-for="(img, v) in item.searchResultsContentResponseList[
                                  item.resultId
                                ].processUrl"
                                mode="widthFix"
                                :key="v"
                              />
                            </view>
                          </view>
                        </view>
                        <!-- 手动批改 -->
                        <view
                          class="selfCorrect"
                          v-if="props.correct && !item.correctRecordAnswerResponses"
                        >
                          <view class="title">自行批改</view>
                          <view class="describe"
                            >抱歉！当前未能成功批改该题对错，你可以根据上方的答案解析自行批改当前习题的对错</view
                          >
                          <view class="correctBox">
                            <view
                              @tap="handleRight(item, true)"
                              :class="{ yesJudge: item.correctResult === true }"
                              >正确</view
                            >
                            <view
                              class="error"
                              @tap="handleRight(item, false)"
                              :class="{ noJudge: item.correctResult === false }"
                              >错误</view
                            >
                          </view>
                          <view
                            class="judge"
                            v-if="item.correctResult === false || item.correctResult === true"
                          >
                            <view
                              v-show="item.correctResult"
                              :style="{ color: '#44C863', fontSize: '14px', textAlign: 'center' }"
                            >
                              太棒了，习题做对啦！
                            </view>
                            <view
                              v-show="!item.correctResult"
                              :style="{ color: '#F24E3E', fontSize: '14px', textAlign: 'center' }"
                            >
                              错了没有关系，下次继续努力！
                            </view>
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
                    </view>
                  </view>
                </nut-swiper-item>
              </nut-swiper>
            </view>
          </view>
        </movable-area>

        <view class="flooter" v-if="!props.correct">
          <!-- vdata.addOrdelFlag ? '移出错题本' : '加入错题本' -->
          <view @tap="againGo" v-if="vdata.dataList[vdata.index].show" class="wrongQuestionBtn"
            >重新搜题</view
          >
          <view
            @tap="wrongQuestionBtn"
            class="wrongQuestionBtn"
            v-else
            :class="{
              deleteQuestionBtn:
                vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId]
                  .addOrdelFlag,
            }"
            >{{
              vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId]
                .addOrdelFlag
                ? '移出错题本'
                : '加入错题本'
            }}</view
          >
        </view>
        <view class="flooter" v-else-if="!vdata.dataList[vdata.index].show">
          <!-- vdata.addOrdelFlag ? '移出错题本' : '加入错题本' -->
          <view
            @tap="wrongQuestionBtn"
            class="wrongQuestionBtn"
            :class="{
              deleteQuestionBtn:
                vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId]
                  .addOrdelFlag,
            }"
            >{{
              vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId]
                .addOrdelFlag
                ? '移出错题本'
                : '加入错题本'
            }}</view
          >
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
import { defineProps, withDefaults, reactive, ref, defineEmits, computed } from 'vue'
//taro
import { Swiper, SwiperItem } from '@nutui/nutui-taro'
import GradeSubjects from '@/components/GradeSubjects.vue'
import { getAddWrong, removeWrobook, textToImage } from '@/api/photoSearch'
import { handCorrect } from '@/api/photoCorrect'

const props: any = defineProps({
  correct: '',
  type: false,
  tempFilePath: '',
})
const emit = defineEmits(['handleChange', 'getPopupHeight'])
const swipe = ref()
const vdata = reactive({
  index: 0, //  题号下标
  resuId: 0, //  多个结果下标
  questionId: '', //  主键id
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
  imgSize: {},
})
const getImgSize = (e, index, type?: Number) => {
  let maxWidth = 335
  const { width } = e.detail

  if (width > maxWidth) {
    vdata.imgSize[index] = `${maxWidth}px`
  } else {
    vdata.imgSize[index] = `${width}px`
  }
}
//  切换结果
const resultTitleChange = (item, index, id) => {
  vdata.dataList[index].resultId = id
  vdata.index = index //  题号下标
  vdata.resuId = id //  (结果一结果二结果三)下标
  vdata.questionId = vdata.dataList[index].searchResultsContentResponseList[vdata.resuId].questionId
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
  if (props.correct) {
    return {
      height: `${vdata.popupHeight - 200}px`,
    }
  } else {
    let num = 200
    if (props.type) {
      num -= 48
    }
    return {
      height: `${vdata.popupHeight - num}px`,
    }
  }
})
//  显示弹框
const popupShow = (list, id?: Number) => {
  vdata.searchResultResponseList = list
  vdata.dataList = list
  if (id) {
    vdata.correctRecordId = id
  }
  vdata.questionId = vdata.dataList[0].searchResultsContentResponseList[0].questionId
  if (props.type) {
    vdata.imgUrl = props.tempFilePath
  } else {
    vdata.imgUrl = vdata.dataList[0].imgUrl
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
  vdata.questionNo = item.searchResultSerialNo - 1
  vdata.questionId =
    vdata.dataList[index].searchResultsContentResponseList[item.resultId].questionId
  vdata.imgUrl = vdata.dataList[index].imgUrl
  swipe.value.to(index)
}
//  题目左右滑动切换
const pageChange = (index) => {
  vdata.index = index
  vdata.questionNo = String(index)
  vdata.questionId =
    vdata.dataList[index].searchResultsContentResponseList[
      vdata.dataList[index].resultId
    ].questionId
  vdata.imgUrl = vdata.dataList[index].imgUrl

  emit('handleChange', vdata.index)
}
const handleRight = (item, flag) => {
  item.correctResult = flag
  let params = {
    isRight: flag,
    searchResultSerialNo: item.searchResultSerialNo,
    correctRecordId: vdata.correctRecordId,
  }
  handCorrect(params).then((res) => {})
}
//  重新搜题
const againGo = () => {
  Taro.redirectTo({
    url: '../photographPage/index?type=2',
  })
}
//  加入移出错题本
const wrongQuestionBtn = () => {
  let addOrdelFlag =
    vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId].addOrdelFlag
  if (!addOrdelFlag) {
    vdata.saveBook = true
  } else {
    let wrongQuestionId =
      vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId].wrongQuestionId
    let params = {
      exerciseBookIds: [wrongQuestionId],
    }
    removeWrobook(params).then((res) => {
      vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId].addOrdelFlag =
        !addOrdelFlag
      Taro.showToast({
        title: '已移出错题本',
        icon: 'none',
        duration: 2000,
      })
    })
  }
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
const saveBook = (val, subject, tagList) => {
  vdata.saveBook = false
  let addOrdelFlag =
    vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId].addOrdelFlag
  vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId].addOrdelFlag =
    !addOrdelFlag
  let params = {
    // questionId: vdata.questionId,
    id: vdata.questionId,
    grade: val[0],
    // course: val[1],
    subject: subject,
    term: val[2],
    bookOriginType: props.correct ? '3' : '2',
    tagList: tagList,
  }
  getAddWrong(params).then((res: any) => {
    if (res.wrongQuestionId) {
      vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId].wrongQuestionId =
        res.wrongQuestionId
      Taro.showToast({
        title: '已加入错题本',
        icon: 'none',
        duration: 2000,
      })
      // toImg(res.wrongQuestionId)
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    }
  })
}
const toImg = (wrongQuestionId) => {
  let dataInfo = vdata.dataList[vdata.index].searchResultsContentResponseList[vdata.resuId]

  let str = dataInfo.topic
  if (dataInfo.questionAnswer && dataInfo.questionAnswer.length) {
    dataInfo.questionAnswer.forEach((item) => {
      let text = item.stem.replace(/<(?!img).*?>/g, '')
      let itemText = ''
      if (dataInfo.questionType == 4) {
        itemText = `<p>${item.ids}、${text}</p>`
      } else if (dataInfo.questionType == 5) {
        itemText = `<p>${text}</p>`
      } else {
        itemText = `<p>${handleEng(item.ids)}、${text}</p>`
      }
      str = str + itemText
    })
  }
  let params = {
    wrongQuestionId: wrongQuestionId,
    questionType: dataInfo.questionType,
    htmlStr: str,
  }
  textToImage(params).then((res) => {})
}
const handleEng = (val) => {
  return String.fromCharCode(64 + parseInt(val))
}
defineExpose({
  popupShow,
  questionNoChange,
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
}
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
        .rightImg {
          width: 18px;
          height: 12px;
          margin-right: 4px;
        }
        .errorImg {
          width: 16px;
          height: 10px;
          margin-right: 4px;
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
        padding: 15px;
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
          .newTopIcUrl {
            width: 100%;
            .img {
              max-width: 100%;
              width: 100%;
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
      width: 178px;
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
