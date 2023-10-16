<template>
  <view class="wrongMain">
    <swiper
      class="swiper"
      indicator-color="#999"
      indicator-active-color="#333"
      :circular="false"
      :indicator-dots="false"
      :current="vdata.current"
      @change="changeCurrent"
    >
      <swiper-item v-for="(item, i) in vdata.dataList" class="list-item" :key="i">
        <view class="timer">
          <text>{{ item.exerciseTime }}</text>
          <view class="remove" @tap="remove(item, i)">移出错题本</view>
        </view>
        <!-- 原始逻辑 -->
        <!-- <view class="image" v-if="item.bookType == 1">
          <image :src="item.topicImageUrl" mode="widthFix" />
        </view>
        <view v-else class="textNode">
          <view style="margin-bottom: 10px">
            <rich-text :nodes="getNodesText(item.topicContent)"></rich-text>
          </view>
          <view v-if="item.questionType && item.questionType != 4">
            <view v-for="(items, i) in handleRich" :key="i" class="richText">
              <text class="engLish">{{ handleEng(items.ids) }} : </text>
              <rich-text :nodes="getNodesText(items.stem)"></rich-text>
            </view>
          </view>
        </view> -->
        <!-- 现在逻辑 -->
        <view class="image">
          <image
            v-if="item.bookType !== 4 && item.bookType !== 5"
            :src="item.topicImageUrl"
            mode="widthFix"
            :style="{ width: vdata.imgSize[i + '_' + 'index'] || 0 }"
            @load="(e) => getImgSize(e, i + '_' + 'index')"
          />
          <view v-else>
            <question-item-info
              :ques="getItemQuestion(item.topicContent)"
              :showExplain="true"
            ></question-item-info>
          </view>
        </view>
        <template v-if="item.bookType !== 4 && item.bookType !== 5">
          <view class="answer">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/ef80ec8c7335409c838d2ed66e4aa048/answerIcon.png"
              class="titleIcon"
            ></image>
            <view class="titleAnswer">答案</view>
          </view>
          <view class="answerInfo">
            <view v-if="item.bookType == 1">
              <view class="imageBg" v-if="item.answerImageUrl" @tap="resetImg(item)">
                <image
                  :src="item.answerImageUrl"
                  mode="widthFix"
                  :style="{ width: vdata.imgSize[i + '_' + 'index' + '_' + 'answer'] || 0 }"
                  @load="(e) => getImgSize(e, i + '_' + 'index' + '_' + 'answer')"
                />
              </view>
              <view class="pzadd" @tap="getScreen(item)" v-else>
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/4a33b8c4fa874881b6579caf559bf35d/pzadd.png"
                  mode="scaleToFill"
                />
              </view>
            </view>
            <!-- 之前逻辑 -->
            <!-- <view class="answerInput" @tap="item.bookType == 1 && showText(item)">
            <view v-if="item.bookType == 1">
              <view v-if="item.answerContent" class="content">{{ item.answerContent }}</view>
              <view v-else>请输入正确答案</view>
            </view>
            <view v-else>
              <view v-if="item.questionType && item.questionType != 4"> {{ getAnswerDetail }}</view>
              <view v-else>
                <view v-for="(items, i) in handleRich" :key="i" class="richText">
                  <text class="engLish">{{ items.ids }} : </text>
                  <text>{{ items.stem }}</text>
                </view>
              </view>
            </view>
          </view> -->
            <!-- 现在逻辑 -->
            <view
              class="answerInput"
              v-if="item.bookType == 1"
              @tap="item.bookType == 1 && showText(item)"
            >
              <view>
                <view v-if="item.answerContent" class="content">{{ item.answerContent }}</view>
                <view v-else>请输入正确答案</view>
              </view>
            </view>
            <view v-else>
              <view class="img" v-if="item.answerImageUrl">
                <image
                  :src="vtem"
                  mode="widthFix"
                  :key="key"
                  v-for="(vtem, key) in getAnswerImgList(item.answerImageUrl)"
                  :style="{ width: vdata.imgSize[i + '_' + 'index' + '_' + key + 'key'] || 0 }"
                  @load="(e) => getImgSize(e, i + '_' + 'index' + '_' + key + 'key')"
                />
              </view>
              <view v-else-if="item.questionOcrAnswer">{{ item.questionOcrAnswer }}</view>
            </view>

            <!-- 现在逻辑结束位置 -->
            <view v-if="item.bookProcess">
              <view class="answer answers">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/303cfe9068024919b15ec50f833c829c/analysisIcon.png"
                  class="titleIcon"
                ></image>
                <view class="titleAnswer">解析</view>
              </view>
              <view class="content">
                <rich-text :nodes="getNodesText(item.bookProcess)"></rich-text>
              </view>
            </view>
          </view>
        </template>
      </swiper-item>
    </swiper>
    <view class="mcBg" v-if="vdata.showBg">
      <nut-overlay v-model:visible="vdata.showBg">
        <view class="content" :style="handleStyle">
          <textarea
            class="inputs"
            v-model="vdata.answer"
            :border="false"
            :focus="true"
            @focus="inputBindFocus"
            :show-confirm-bar="false"
            placeholder="输入正确答案"
          />
          <view class="operatBtn">
            <view class="calc" @tap="calc">取消</view>
            <view class="submit" @tap="submitAnswer">确认添加</view>
          </view>
        </view>
      </nut-overlay>
    </view>
  </view>
  <!-- </view> -->
  <!-- </scroll-view> -->
</template>

<script setup lang="ts">
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import { wrongList, updateAnswer, removeWrobook } from '@/api/wrongbook'
import { onMounted, reactive, computed, nextTick } from 'vue'
import { useSystem } from '@/stores'
import { debounce } from '@/utils'
import QuestionItemInfo from '@/components/QuestionItemInfoWrong/QuestionItem.vue'

const system = useSystem()
const { windowHeight } = system.navBarInfo

const router = useRouter()

const vdata: any = reactive({
  answer: '请输入正确答案...',
  dataList: [],
  showBg: false,
  bottomVal: '310px',
  current: 0,
  searchInfo: {
    condition: {
      course: '',
      grade: '',
      sourceType: '',
      term: '',
      timeLimit: 0,
    },
    current: 1,
    size: 10,
  },
  exerciseBookId: '',
  answerUrl: '',
  answerContent: '',
  deleteList: [],
  imgSize: {},
})
const handleStyle = computed(() => {
  return {
    bottom: vdata.bottomVal,
  }
})
const getImgSize = (e, index, type?: Number) => {
  let maxWidth = 350
  const { width } = e.detail

  if (width > maxWidth) {
    vdata.imgSize[index] = `${maxWidth}px`
  } else {
    vdata.imgSize[index] = `${width}px`
  }
}
const getItemQuestion = (topicContent) => {
  if (!topicContent) {
    return ''
  }
  let item = JSON.parse(topicContent)
  return item.data
}
const remove = debounce((item, i) => {
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
})
const changeCurrent = (e) => {
  vdata.current = e.detail.current
}
//1234-ABCD
const handleEng = (val) => {
  return String.fromCharCode(64 + parseInt(val))
}
//1的时候 转化为数组
const handleRich = computed(() => {
  let arrList = []
  if (vdata.dataList[vdata.current].answerContent && vdata.dataList[vdata.current].bookType != 1) {
    arrList = JSON.parse(vdata.dataList[vdata.current].answerContent)
  }
  return arrList
})
const getAnswerImgList = (url) => {
  let arrList = []
  arrList = url.split(';')
  return arrList
}
const getAnswerDetail = computed(() => {
  let arrList = []
  let str = ''
  if (vdata.dataList[vdata.current].answerContent && vdata.dataList[vdata.current].bookType != 1) {
    let filterList = []
    let strList = []
    arrList = JSON.parse(vdata.dataList[vdata.current].answerContent)
    filterList = arrList.filter((item) => item.flag === true)
    if (filterList && filterList.length) {
      filterList.forEach((item) => {
        strList.push(handleEng(item.ids))
      })
      str = strList.join()
    }
  }
  return str
})
//拍照
const getScreen = debounce((item) => {
  Taro.setStorageSync('exerciseBookId', item.exerciseBookId)
  Taro.setStorageSync('recordList', vdata.dataList)

  Taro.navigateTo({
    url: '../answerGraph/index',
  })
})
const getNodesText = (text) => {
  return text ? text.replace('<img', '<img style="width:100%;height:auto"') : ''
}
// 重拍
const resetImg = debounce((item) => {
  Taro.setStorageSync('exerciseBookId', item.exerciseBookId)
  Taro.setStorageSync('recordList', vdata.dataList)
  Taro.navigateTo({
    url: `../answer/index?imgUrl=${item.answerImageUrl}`,
  })
})
const inputBindFocus = (e) => {
  // 获取手机键盘的高度，赋值给input 所在盒子的 bottom 值
  // 注意!!! 这里的 px 至关重要!!! 我搜到的很多解决方案都没有说这里要添加 px
  vdata.bottomVal = e.detail.height + 'px'
}
//添加
const submitAnswer = debounce(() => {
  let params = {
    answerContent: vdata.answer,
    answerUrl: vdata.answerUrl,
    exerciseBookId: vdata.exerciseBookId,
  }
  updateAnswer(params).then((res) => {
    if (res) {
      vdata.dataList[vdata.current].answerContent = vdata.answer
    }
  })
})
//取消
const calc = () => {
  vdata.showBg = false
  // vdata.answer = ''
}
// 触发事件
const showText = (item) => {
  vdata.showBg = true
  vdata.answer = item.answerContent
  vdata.exerciseBookId = item.exerciseBookId
  vdata.answerUrl = item.answerImageUrl
}
//获取列表
const getWrongList = (url) => {
  let condition = JSON.parse(Taro.getStorageSync('searchInfo'))
  let params = {
    condition: condition,
    current: 1,
    size: Taro.getStorageSync('total') || 100,
  }
  wrongList(params).then((res: any) => {
    Taro.setStorageSync('recordList', res.records)
    handleInfo(res.records, url)
  })
}
const handleInfo = (recordList, params) => {
  Taro.showLoading({
    title: '加载中...',
    mask: true,
  })
  // let recordList = Taro.getStorageSync('recordList')
  let exerciseBookId = Taro.getStorageSync('exerciseBookId')
  let index = recordList.findIndex((item) => item.exerciseBookId === exerciseBookId)
  if (index > 0) {
    vdata.current = index
  }
  vdata.dataList = recordList
  if (params?.imgUrl) {
    vdata.dataList[index].answerImageUrl = params.imgUrl
  }
  setTimeout(() => {
    Taro.hideLoading()
  }, 600)
}
useDidShow(() => {
  // const { params } = router
  // getWrongList(params)
  if (Taro.getStorageSync('imageUrl')) {
    let params = {
      answerContent: vdata.dataList[vdata.current].answerContent || '',
      answerUrl: Taro.getStorageSync('imageUrl') || '',
      exerciseBookId: vdata.exerciseBookId || Taro.getStorageSync('exerciseBookId'),
    }
    updateAnswer(params).then((res) => {
      if (res) {
        vdata.dataList[vdata.current].answerImageUrl = Taro.getStorageSync('imageUrl')
        Taro.removeStorageSync('imageUrl')
      }
    })
  }
})
onMounted(() => {
  const { params } = router
  getWrongList(params)
})
</script>

<style lang="scss">
.wrongMain {
  height: 100vh;
}
// .scroll-view_H {
//   background: #fff;
//   height: 100vh;
//   padding: 15px;
//   overflow: scroll;
//   box-sizing: border-box;
.swiper {
  height: 100vh;
  width: 100%;
  .list-item {
    margin-right: 20px;
    height: 100%;
    overflow: scroll;
    padding: 15px;
    background: #fff;
    box-sizing: border-box;
  }
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
  .answers {
    margin: 15px 0;
    .content {
      margin-top: 15px;
    }
  }
  .answerInput {
    background: #f4f4f4;
    box-sizing: border-box;
    border-radius: 4px;
    min-height: 80px;
    box-sizing: border-box;
    padding: 8px 12px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    color: #c8c8c8;
    margin-top: 13px;
    .content {
      color: #333;
    }
  }
}
.timer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-family: PingFang SC;
  font-size: 13px;
  color: #999999;
  .remove {
    width: 95px;
    height: 28px;
    border-radius: 25px;
    border: 0.5px solid #c8c8c8;
    font-family: PingFang SC;
    line-height: 28px;
    color: #333333;
    text-align: center;
  }
}
.image {
  // border: 1px solid #e2e2e2;
  width: 100%;
  margin-bottom: 26px;
  image {
    width: 100%;
  }
}
.textNode {
  border: 1px solid #e2e2e2;
  width: 100%;
  margin-bottom: 26px;
  padding: 10px;
  box-sizing: border-box;
  .richText {
    display: flex;
    align-items: center;
    font-size: 14px;
    .engLish {
      width: 25px;
      flex-shrink: 0;
    }
  }
}
.answerInfo {
  margin-bottom: 12px;
  .imageBg {
    width: 100%;
    image {
      width: 100%;
    }
  }
}
.pzadd {
  height: 74px;
  background: #f4f4f4;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 13px;
  image {
    width: 88px;
    height: 28px;
  }
}
.nut-textarea {
  padding: 0;
  box-sizing: border-box;
}
.nut-textarea__textarea {
  background: #f4f4f4;
  padding: 10px;
}
// }
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
  overflow: auto;
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
.mcBg {
  height: 100%;
  .content {
    background: #fff;
    position: absolute;
    right: 0;
    left: 0;
    padding: 10px 14px;
  }
  .inputs {
    height: 100px;
  }
  .operatBtn {
    display: flex;
    justify-content: flex-end;
    view {
      width: 75px;
      font-size: 12px;
      height: 28px;
      line-height: 28px;
      font-family: PingFangSC-Regular;
      border-radius: 25px;
      text-align: center;
    }
    .calc {
      border: 0.5px solid #c8c8c8;
      background: #fff;
      margin-right: 15px;
    }
    .submit {
      background: #2f5de7;
      color: #fff;
    }
  }
}
</style>
