<template>
  <!-- <web-view src="https://journal.dev.dcrayssh.cn/abcd.pdf" @message="handleMessage" /> -->
  <!-- <iframe width="100%" height="100%" src="https://journal.dev.dcrayssh.cn/abcd.pdf"></iframe> -->

  <view class="previewPdf" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar :fixedStyle="vdata.fixedStyle">
      <template #left>
        <view @tap="onBack" class="leftInfo">
          <nut-icon name="rect-left" :size="`${menuHeight / 1.8}px`"></nut-icon>
          <view class="titleFont">{{ getPeriodsNum(vdata.resourceIssue) }}</view>
        </view>
      </template>
      <template #center>
        <view class="centerInfo">
          <view
            @tap="vdata.type = 1"
            :class="[
              'itemFont',
              vdata.analysisList.length <= 5 && 'itemXyFont',
              vdata.analysisList.length > 5 && vdata.type == 1 && 'selectFont',
            ]"
            >答案</view
          >
          <view
            @tap="vdata.type = 2"
            :class="[
              'itemFont',
              'itemRight',
              vdata.analysisList.length > 5 && vdata.type == 2 && 'selectFont',
            ]"
            v-if="vdata.analysisList.length > 5"
            >答案解析</view
          >
        </view>
      </template>
    </NavBar>
    <template v-if="vdata.type == 1">
      <scroll-view :scroll-y="true" style="height: 100%">
        <view v-for="(item, index) in vdata.imgUrls" :key="index">
          <image mode="widthFix" :src="item" @tap="showTap(index)"></image>
        </view>
      </scroll-view>
    </template>
    <template v-else>
      <view class="answerInfo" :style="{ height: `calc(100vh - ${navBarHeight}px)` }">
        <view class="topInfo" :style="{ top: `${navBarHeight}px` }">
          <scroll-view
            class="scroll-view_H"
            :scroll-x="true"
            :show-scrollbar="false"
            :scroll-left="getSignLeft"
          >
            <view class="scrollList">
              <view
                :class="['scrollItem', i == vdata.current && 'selectScroll']"
                v-for="(item, i) in vdata.analysisList"
                @tap="changeItem(i)"
                :key="item"
                >{{ i + 1 }}</view
              >
            </view>
          </scroll-view>
        </view>
        <view :style="{ top: `${navBarHeight + 70}px` }" class="swiperMain">
          <swiper
            class="swiperInfo"
            indicator-color="#999"
            indicator-active-color="#333"
            :circular="false"
            :indicator-dots="false"
            :current="vdata.current"
            next-margin="12px"
            previous-margin="12px"
            @change="changeCurrent"
          >
            <swiper-item v-for="(item, i) in vdata.analysisList" class="list-item" :key="i">
              <view class="list-item-info">
                <view class="topAdd">
                  <text class="sy"> 第{{ i + 1 }} 题 </text>
                  <view
                    class="rightInfo"
                    @tap="addWrong(item.questionId, item.isError, item.wrongQuestionId)"
                  >
                    <image
                      :src="
                        item.isError
                          ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/adc2b0a17bd640c58b9ee7527e32c99c/ctb.png'
                          : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/adc2b0a17bd640c58b9ee7527e32c99c/ctb.png'
                      "
                    />
                    <view>{{ item.isError ? '移除错题本' : '加入错题本' }}</view>
                  </view>
                </view>
                <view class="topImg">
                  <image
                    :src="item.topicUrl"
                    mode="widthFix"
                    :style="{ width: vdata.imgSize[i + '_index'] || 0 }"
                    @load="(e) => getImgSize(e, i + '_index')"
                    @tap="previewImg(1, [item.topicUrl], 0)"
                  />
                </view>
                <view
                  class="answer"
                  v-if="(item.answerUrl && item.answerUrl.length) || item.questionAnswerOcrStr"
                >
                  <view class="answerText">
                    <image
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/ef80ec8c7335409c838d2ed66e4aa048/answerIcon.png"
                      class="titleIcon"
                    ></image>
                    <view class="titleAnswer">正确答案</view>
                  </view>
                  <view v-if="item.answerUrl && item.answerUrl.length">
                    <image
                      :key="key"
                      v-for="(vtem, key) in item.answerUrl"
                      :src="vtem"
                      @tap="previewImg(2, item.answerUrl, key)"
                      mode="widthFix"
                      :style="{ width: vdata.imgSize[i + '_index' + key + '_index'] || 0 }"
                      @load="(e) => getImgSize(e, i + '_index' + key + '_index')"
                    />
                  </view>
                  <view v-else-if="item.questionAnswerOcrStr">
                    {{ item.questionAnswerOcrStr }}
                  </view>
                </view>
                <view class="answer" v-if="item.vadioList && item.vadioList.length">
                  <view class="answerText">
                    <image
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/spjj/e0132700b2f24b9eabdee5a5c9aea612/spicon.png"
                      class="titleIcon"
                    ></image>
                    <view class="titleAnswer">视频讲解</view>
                  </view>
                  <view v-for="(vtem, j) in item.vadioList" :key="j">
                    <video
                      style="width: 100%; height: 164px; border-radius: 8px"
                      :src="vtem"
                      :show-fullscreen-btn="false"
                    ></video>
                  </view>
                </view>
                <view
                  class="answer"
                  v-if="(item.processUrl && item.processUrl.length) || item.process"
                >
                  <view class="answerText">
                    <image
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/303cfe9068024919b15ec50f833c829c/analysisIcon.png"
                      class="titleIcon"
                    ></image>
                    <view class="titleAnswer">解析</view>
                  </view>
                  <view>
                    <image
                      :key="key"
                      v-for="(vtem, key) in item.processUrl"
                      :src="vtem"
                      mode="widthFix"
                      :style="{ width: vdata.imgSize[i + '_index' + key + 'analysis'] || 0 }"
                      @load="(e) => getImgSize(e, i + '_index' + key + 'analysis')"
                      @tap="previewImg(3, item.processUrl, key)"
                    />
                    <view class="richTextInfo">
                      <rich-text :nodes="item.process"></rich-text>
                    </view>
                  </view>
                </view>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </template>
    <grade-subjects
      @saveBook="saveBook"
      @closeBook="vdata.saveBook = false"
      v-if="vdata.saveBook"
    />
  </view>
</template>
<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import GradeSubjects from '@/components/GradeSubjects.vue'
import { useSystem } from '@/stores'
import { reactive, onMounted, computed } from 'vue'
import Taro, { useRouter, useDidHide, useUnload } from '@tarojs/taro'
import { getPeriodsNum } from '@/utils/index'
import { getAnswerAnalysis, analysisRecord } from '@/api/index'
import { getAddWrong } from '@/api/photoSearch'
import { removeWrobook } from '@/api/wrongbook'
const router = useRouter()
const system = useSystem()
const { navBarHeight, menuHeight } = system.navBarInfo
const vdata: any = reactive({
  fixedStyle: {
    background: '#fff',
    color: '#333',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  type: 1,
  resourceIssue: '',
  resourceSupportId: '',
  current: 0,
  imgUrls: [],
  imgSize: {},
  analysisList: [],
  saveBook: false,
})
const changeCurrent = (e) => {
  vdata.current = e.detail.current
}
const getImgSize = (e, index) => {
  let maxWidth = 300
  const { width } = e.detail
  if (width > maxWidth) {
    vdata.imgSize[index] = `${maxWidth}px`
  } else {
    vdata.imgSize[index] = `${width}px`
  }
}
const addWrong = (id, flag, wrongQuestionId) => {
  if (!flag) {
    vdata.questionId = id
    vdata.saveBook = true
  } else {
    let params = {
      exerciseBookIds: [wrongQuestionId],
    }
    removeWrobook(params).then((res) => {
      setTimeout(() => {
        Taro.showToast({
          title: '移除成功',
          icon: 'none',
          duration: 2000,
        })
        vdata.analysisList[vdata.current].isError = false
      }, 100)
    })
  }
}
const formatImg = (html) => {
  if (!html) return []
  let srcReg = /<source[^>]src="[^"]*/g
  let videoList = html.match(srcReg) || []
  let arrList = []
  if (videoList.length) {
    videoList.map((item: any) => {
      item = item.replace(/\<source src="/gi, '')
      arrList.push(item)
    })
  }
  return arrList
  // let videoList = []
  // let text = JSON.stringify(html)
  // text = text.replace(/\\/g, ``)
  // let videoReg = /<video.*<\/video>/ //匹配到字符串中的 video 标签
  // let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
  // let arr = text.match(videoReg) || []
  // console.log(arr, 'aaaaaaaaa')
  // if (arr.length) {
  //   arr.forEach((item) => {
  //     var src = item.match(srcReg)
  //     videoList.push(src[1]) //所要显示的字符串中 所有的video 标签 的路径
  //   })
  // }
}
const saveBook = (val, subject, tagList) => {
  let params = {
    // questionId: vdata.questionId,
    id: vdata.questionId,
    grade: val[0],
    // course: val[1],
    subject: subject,
    term: val[2],
    bookOriginType: '6',
    tagList: tagList,
  }
  getAddWrong(params).then((res: any) => {
    if (res.wrongQuestionId) {
      Taro.showToast({
        title: '已加入错题本',
        icon: 'none',
        duration: 2000,
      })
      vdata.analysisList[vdata.current].isError = true
      vdata.analysisList[vdata.current].wrongQuestionId = res.wrongQuestionId
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    }
    vdata.saveBook = false
  })
}
const getAnswerInfoList = () => {
  let params = {
    condition: {
      resourceIssue: vdata.resourceIssue,
      resourceSupportId: vdata.resourceSupportId,
    },
    current: 1,
    orders: [
      {
        asc: true,
        column: '',
      },
    ],
    size: 50,
  }
  getAnswerAnalysis(params).then((res: any) => {
    if (res) {
      vdata.analysisList = res.records
      vdata.analysisList.map((item) => {
        item.vadioList = formatImg(item.process)
        item.isError = false
        item.wrongQuestionId = null
      })
      let index = vdata.analysisList.findIndex((item) => item.isLastRecord)
      if (index != -1) {
        vdata.current = index
      }
    }
  })
}
const showTap = (index) => {
  Taro.previewImage({
    current: vdata.imgUrls[index], // 当前显示图片的http链接
    urls: vdata.imgUrls, // 需要预览的图片http链接列表
  })
}
//解析查看
const previewImg = (type, list, index) => {
  Taro.previewImage({
    current: index, // 当前显示图片的http链接
    urls: list, // 需要预览的图片http链接列表
  })
}
const onBack = () => {
  Taro.navigateBack({ delta: 1 })
}
const changeItem = (item) => {
  vdata.current = item
}
const getSignLeft = computed(() => {
  let scroll = 0
  if (vdata.current >= 8 && vdata.current <= 15) {
    scroll = 8 * 40
  } else if (vdata.current >= 16 && vdata.current <= 23) {
    scroll = 16 * 40
  } else if (vdata.current >= 24 && vdata.current <= 31) {
    scroll = 24 * 40
  } else if (vdata.current >= 32 && vdata.current <= 39) {
    scroll = 32 * 40
  }
  return scroll
})
onMounted(() => {
  const { resourceIssue, imgUrls, resourceSupportId } = JSON.parse(router.params.obj)
  vdata.resourceIssue = resourceIssue
  vdata.resourceSupportId = resourceSupportId
  vdata.imgUrls = imgUrls
  if (resourceSupportId) {
    getAnswerInfoList()
  }
})
//保留历史记录
const saveRecord = () => {
  if (vdata.analysisList.length) {
    let params = {
      resourceIssue: vdata.resourceIssue,
      resourceSupportId: vdata.resourceSupportId,
      answerSort: vdata.analysisList[vdata.current].sort,
    }
    analysisRecord(params).then((res) => {})
  }
}
useUnload(() => {
  saveRecord()
})
useDidHide(() => {})
</script>
<style lang="scss">
.previewPdf {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  image {
    width: 100%;
  }
  .leftInfo {
    display: flex;
    .titleFont {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #999999;
    }
  }
  .centerInfo {
    position: absolute;
    left: 50%;
    // top: 50%;
    transform: translate(-50%);
    height: 100%;
    font-size: 17px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    font-family: PingFangSC-Medium;
    -webkit-line-clamp: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    .itemFont {
      color: #999999;
    }
    .itemXyFont {
      color: #333333;
    }
    .selectFont {
      color: #333;
      position: relative;
    }
    .selectFont::after {
      position: absolute;
      content: '';
      width: 17px;
      height: 4px;
      bottom: -5px;
      left: 50%;
      transform: translate(-50%);
      background: #2f5de7;
      display: inline-block;
      border-radius: 2px;
    }
    .itemRight {
      margin-left: 24px;
    }
  }
  .answerInfo {
    background: #f6f9fd;
    box-sizing: border-box;
    .topInfo {
      height: 52px;
      position: fixed;
      left: 0;
      right: 0;
      .scroll-view_H {
        height: 100%;
        padding: 0 16px;
        background: #fff;
      }
      .scrollList {
        box-sizing: border-box;
        display: flex;
        height: 100%;
        align-items: center;
        .scrollItem {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f6f9fd;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          font-weight: normal;
          text-align: center;
          color: #666666;
          line-height: 28px;
          flex-shrink: 0;
          margin-right: 12px;
        }
        .selectScroll {
          background: #4a89ff;
          color: #fff;
        }
      }
    }
    .swiperMain {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 16px;
      .swiperInfo {
        background: #f6f9fd;
        height: 100%;
        .list-item {
          height: 100%;
          padding-right: 10px;
          box-sizing: border-box;
          .list-item-info {
            background: #fff;
            height: 100%;
            overflow: scroll;
            box-sizing: border-box;
            padding: 16px;
            border-radius: 8px;
            .topAdd {
              display: flex;
              align-items: center;
              justify-content: space-between;
              .rightInfo {
                display: flex;
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
            .sy {
              height: 22px;
              border-radius: 4px;
              padding: 2px 8px;
              background: #f4f4f4;
              text-align: center;
              list-style: 22px;
              font-family: PingFangSC-Medium;
              font-size: 12px;
              color: #666666;
            }
            .topImg {
              margin-top: 10px;
              padding-bottom: 20px;
              border-bottom: 1px solid #ecf0f6;
            }
            .answer {
              margin-top: 20px;
              .answerText {
                display: flex;
                align-items: center;
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #333333;
                margin-bottom: 10px;
                image {
                  width: 16px;
                  height: 16px;
                  margin-right: 8px;
                }
              }
              .richTextInfo {
                font-size: 14px;
                margin-top: 20px;
              }
            }
          }
        }
      }
    }
  }
  .wrongQuestionBtn {
    text-align: center;
    margin: 0 auto;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    width: 178px;
    height: 40px;
    border-radius: 22px;
    background: #0256ff;
    line-height: 40px;
    margin-top: 40px;
  }
}
</style>
