<template>
  <view class="mainContent">
    <NavBar :title="vdata.showLabel ? '修改标签' : '错题本'" :background="'#fff'" />
    <view class="search-content" :style="{ top: `${navBarHeight}px` }">
      <search-info
        @grand-change="grandChange"
        :close="vdata.close"
        :grand="vdata.grand"
        @timer-change="timerChange"
      >
        <template #right>
          <view @tap="showPup" class="rightText">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/34be384ce4744ffc9d758b42e69276ac/shaixuan.png"
            />
            <text>筛选</text>
          </view>
        </template>
      </search-info>
    </view>

    <view
      class="recordContent"
      :style="{
        marginTop: `${navBarHeight + 40}px`,
        height: `calc(100vh - ${navBarHeight + 40}px)`,
      }"
    >
      <view class="noData" v-if="!vdata.recordList.length && vdata.isLoading">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
        />
        <text>本学科暂无错题</text>
        <text class="xg">养成整理错题的好习惯，复习巩固可以更方便</text>
        <view class="lr" @click="goRecord">去录入</view>
      </view>
      <scroll-view class="scroll-view_H" :scroll-y="true" v-else @scrolltolower="lower">
        <view class="scrollList" v-show="vdata.text">
          <view
            class="scroll-item"
            @tap="toDetail(item)"
            v-for="(item, i) in vdata.recordList"
            :key="i"
          >
            <view class="rightInfo">
              <view class="topTimer">
                <view class="labelInfo">
                  <template v-if="item.errorTagList && item.errorTagList.length">
                    <view
                      v-for="(label, index) in item?.errorTagList"
                      :key="index"
                      class="labelItem"
                    >
                      {{ label.tagName }}
                    </view>
                  </template>
                </view>
                <view class="timer">{{ item.exerciseTime }}</view>
              </view>
              <view class="image" v-if="item.bookType !== 4 && item.bookType !== 5">
                <!-- <image :src="item.topicImageUrl" mode="widthFix" v-if="item.bookType == 1" />
                <rich-text v-else :nodes="getNodesText(item.topicContent)"></rich-text> -->
                <image
                  :src="item.topicImageUrl"
                  mode="widthFix"
                  :style="{ width: vdata.imgSize[i + '_' + 'index'] || 0 }"
                  @load="(e) => getImgSize(e, i + '_' + 'index')"
                />
              </view>
              <view v-else>
                <question-item-info
                  :ques="getItemQuestion(item.topicContent)"
                  :showExplain="false"
                ></question-item-info>
              </view>
              <!-- <view class="title">
                <view>{{ item.exerciseTime }}</view>
                <view>{{ item.errorCount }}次</view>
              </view> -->
            </view>
          </view>
        </view>
        <view class="checkboxMian" v-show="!vdata.text">
          <nut-checkboxgroup v-model="vdata.selectOption" ref="group2" @change="itemChange">
            <nut-checkbox
              :label="item.exerciseBookId"
              v-for="(item, i) in vdata.recordList"
              :key="i"
            >
              <view class="scroll-item scroll-items">
                <view class="rightInfo">
                  <view class="topTimer">
                    <view class="labelInfo">
                      <template v-if="item.errorTagList && item.errorTagList.length">
                        <view
                          v-for="(label, index) in item?.errorTagList"
                          :key="index"
                          class="labelItem"
                        >
                          {{ label.tagName }}
                        </view>
                      </template>
                    </view>
                    <view class="timer">{{ item.exerciseTime }}</view>
                  </view>
                  <view class="image" v-if="item.bookType !== 4 && item.bookType !== 5">
                    <!-- <image :src="item.topicImageUrl" v-if="item.bookType == 1" mode="widthFix" />
                    <rich-text v-else :nodes="getNodesText(item.topicContent)"></rich-text> -->
                    <image
                      :src="item.topicImageUrl"
                      mode="widthFix"
                      :style="{ width: vdata.imgSize[i + '_' + 'index'] || 0 }"
                      @load="(e) => getImgSize(e, i + '_' + 'index')"
                    />
                  </view>
                  <view v-else>
                    <question-item-info
                      :ques="getItemQuestion(item.topicContent)"
                      :showExplain="false"
                    ></question-item-info>
                  </view>
                  <!-- <view class="title">
                    <view>{{ item.exerciseTime }}</view>
                    <view>{{ item.errorCount }}次</view>
                  </view> -->
                </view>
              </view>
            </nut-checkbox>
          </nut-checkboxgroup>
        </view>
      </scroll-view>
    </view>
    <view class="options" v-show="vdata.text && vdata.recordList.length">
      <view class="zj" @tap="changeText">
        组卷重练
        <image
          v-if="vipImageShow"
          class="vip-image"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/21d3a47572084773a12a80d25a9f3a22/vip.png"
      /></view>
      <text v-if="freeTextShow">免费试用</text>
      <view class="rightBtn">
        <view class="zl" @tap="showDarkTheme">整理错题</view>
        <view class="rightPop">
          <nut-popover
            :duration="0.1"
            v-model:visible="vdata.darkTheme"
            theme="dark"
            location="top-end"
            @choose="chooseOperat"
            :list="vdata.iconItemList"
          >
          </nut-popover>
        </view>
      </view>
    </view>
    <view class="options" v-show="!vdata.text">
      <view>
        <nut-checkbox
          v-model="vdata.checkboxAll"
          :indeterminate="vdata.indeterminate"
          @change="checkAll"
          >全选</nut-checkbox
        >
      </view>
      <view :class="['delete', getSelectNumber == 0 && 'noDelete']">
        <view v-if="vdata.btnText == 1" @tap="handelOperat(1)">
          <text>组卷</text>
          <text v-if="getSelectNumber > 0">({{ getSelectNumber }})</text>
        </view>
        <view v-else-if="vdata.btnText == 2" @tap="handelOperat(2)">
          <text>移除错题本</text>
          <text v-if="getSelectNumber > 0">({{ getSelectNumber }})</text>
        </view>
        <view v-else @tap="handelOperat(3)">
          <text>修改标签</text>
          <text v-if="getSelectNumber > 0">({{ getSelectNumber }})</text>
        </view>
      </view>
      <view @tap="resetText">取消</view>
    </view>

    <nut-dialog
      title="确定移出错题本吗？"
      content="移出后不可恢复"
      v-model:visible="vdata.showDelete"
      :onOk="deleteList"
      okText="确定移出"
    >
    </nut-dialog>
    <!-- 筛选 -->
    <grade-semester
      @handleChange="brushSction"
      :term="vdata.term"
      :grande="vdata.branch"
      ref="gradeSeame"
    />
    <!-- 标签 -->
    <view class="labelPup" v-if="vdata.showLabel">
      <nut-popup
        :style="{ height: `calc(100vh - ${navBarHeight}px)` }"
        position="bottom"
        v-model:visible="vdata.showLabel"
      >
        <LabelPopup
          @label-change="getLabelValue"
          :current-subject="vdata.currentSubject"
          :current-term="vdata.currentTerm"
          :current-grade="vdata.currentGrade"
          :labelList="vdata.labelList"
        />
      </nut-popup>
    </view>
    <!-- 组卷 -->
    <view>
      <nut-overlay
        v-model:visible="vdata.showPapers"
        :lock-scroll="true"
        :close-on-click-overlay="false"
      >
        <view class="paperInfo">
          <view class="close" @tap="closePapers">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/721ebdcae00a48d7892f6b353cc3f762/closeBlack.png"
              mode="scaleToFill"
            />
          </view>
          <view class="title">组卷名称</view>
          <view>
            <view class="inputInfo">
              <input
                placeholder="请输入组卷名称"
                type="text"
                :value="vdata.paperName"
                @input="getVal"
                :selectionStart="100"
                :selectionEnd="100"
              />
              <view class="rightBtn">
                <image
                  v-if="vdata.paperName"
                  @tap="clearInput"
                  class="close-img"
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/41cde43ac6eb4dae99fe55bf5f889baf/close.png"
                  mode="scaleToFill"
                />
              </view>
            </view>
            <view class="errorMsg" v-if="vdata.error && vdata.paperName">{{
              vdata.errorMessage
            }}</view>
            <!-- <nut-input
              v-model="vdata.paperName"
              clearable
              @clear="clearPaperName"
              @update:model-value="paperChange"
              placeholder="请输入组卷名称"
            />
            <view class="errorMsg" v-if="vdata.error">{{ vdata.errorMessage }}</view> -->
          </view>
          <view class="btn">
            <nut-button
              block
              :type="vdata.paperName ? 'primary' : 'default'"
              @tap="vdata.paperName && submitPaper()"
              >确定</nut-button
            >
          </view>
        </view>
      </nut-overlay>
    </view>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script setup lang="ts">
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import SearchInfo from '@/components/SearchInfo.vue'
import NavBar from '@/components/NavBar.vue'
import {
  wrongList,
  removeWrobook,
  updateTag,
  getPaperName,
  combinePaper,
  combinePaperV2,
} from '@/api/wrongbook'
import { getTryCount } from '@/api/index'
import GradeSemester from '@/components/GradeSemester.vue'
import LabelPopup from '@/components/LabelPopup.vue'
import { reactive, ref, onMounted, computed } from 'vue'
import { debounce } from '@/utils'
import { useSystem, useUser } from '@/stores'
import QuestionItemInfo from '@/components/QuestionItemInfoWrong/QuestionItem.vue'
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const system = useSystem()
const user = useUser()
const { navBarHeight } = system.navBarInfo
const group2 = ref()
const router = useRouter()
const gradeSeame = ref()
const vdata: any = reactive({
  grand: '',
  close: false,
  text: true,
  errorMessage: '测试',
  error: false,
  showPoput: true,
  showLabel: false,
  showPapers: false,
  paperName: '',
  checkboxAll: false,
  deleteNumber: 0,
  darkTheme: false,
  showDelete: false,
  selectOption: [],
  indeterminate: false,
  recordList: [],
  branch: '',
  isLoading: false,
  term: '',
  total: 0,
  iconItemList: [{ name: '移除错题本' }, { name: '修改标签' }],
  btnText: 1,
  searchInfo: {
    condition: {
      course: '',
      grade: '',
      sourceType: '',
      term: '',
      timeLimit: 0,
      tagList: [],
    },
    current: 1,
    size: 10,
  },
  imgSize: {},
  questionList: [],
  docRefCurrent: '',
  currentGrade: '',
  currentSubject: '',
  currentTerm: '',
  labelList: [],
  vipBtnFunInfo: null, // vip功能信息
})

// vip图片信息显示
const vipImageShow = computed(() => {
  if (!vdata.vipBtnFunInfo) return false
  const { vipState, tryFlag, configCount, hasTryCount } = vdata.vipBtnFunInfo
  if (user.vip) {
    if (vipState === 1) return true
  } else {
    if (vipState === 1) {
      if (tryFlag === 1) {
        if (hasTryCount >= configCount) {
          return true
        }
      } else {
        return true
      }
    }
  }
  return false
})
// 免费试用显示

const freeTextShow = computed(() => {
  if (!vdata.vipBtnFunInfo) return false
  const { vipState, tryFlag, configCount, hasTryCount } = vdata.vipBtnFunInfo
  if (!user.vip && vipState === 1 && tryFlag === 1 && hasTryCount < configCount) return true
  return false
})

const getItemQuestion = (topicContent) => {
  if (!topicContent) {
    return ''
  }
  let item = JSON.parse(topicContent)
  return item.data
}
const getNodesText = (text) => {
  return text ? text.replace('<img', '<img style="width:100%;height:auto"') : ''
}
const getSelectNumber = computed(() => {
  return vdata.selectOption.length
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
//获取修改标签项
const getLabelValue = (val1, val2, val3, tagList) => {
  if (!val1) {
    return Taro.showToast({
      title: '请选择学科',
      icon: 'none',
      duration: 2000,
    })
  }
  if (!val2) {
    return Taro.showToast({
      title: '请选择年级',
      icon: 'none',
      duration: 2000,
    })
  }
  if (!val3) {
    return Taro.showToast({
      title: '请选择学期',
      icon: 'none',
      duration: 2000,
    })
  }
  let params = {
    course: val1,
    exerciseBookIds: vdata.selectOption,
    grade: val2,
    term: val3,
    tagList: tagList,
  }
  updateTag(params).then((res) => {
    setTimeout(() => {
      Taro.showToast({
        title: '操作成功',
        icon: 'none',
        duration: 2000,
      })
    }, 100)
    vdata.recordList = []
    getWrongList()
    vdata.showLabel = false
    resetText()
  })
  // vdata.showLabel = false
}
const toDetail = (item) => {
  // Taro.removeStorageSync()
  if (Taro.getStorageSync('deleteList')) {
    Taro.removeStorageSync('deleteList')
  }
  let searchInfo = JSON.stringify(vdata.searchInfo.condition)
  // Taro.setStorageSync('recordList', vdata.recordList)
  Taro.setStorageSync('searchInfo', searchInfo)
  Taro.setStorageSync('total', vdata.total)
  Taro.setStorageSync('exerciseBookId', item.exerciseBookId)
  Taro.navigateTo({
    url: `../wrongDetails/index`,
  })
}
//分页
const lower = () => {
  if (hasNext()) {
    getWrongList()
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
const clearInput = () => {
  vdata.paperName = ''
  vdata.error = false
  vdata.errorMessage = ''
}
const getVal = (e) => {
  vdata.paperName = e.detail.value
  if (!e.detail.value) {
    vdata.error = false
  }
}
//弹出筛选年级弹框
const showPup = () => {
  vdata.close = true
  gradeSeame.value.popupShow()
}
const showDarkTheme = () => {
  vdata.darkTheme = !vdata.darkTheme
}
// 筛选确认
const brushSction = debounce((value1, value2, idList) => {
  vdata.searchInfo.condition.grade = value1
  vdata.searchInfo.condition.term = value2
  vdata.searchInfo.condition.tagList = idList
  vdata.searchInfo.current = 1
  vdata.recordList = []
  vdata.checkboxAll = false
  vdata.selectOption = []
  vdata.close = false
  getWrongList()
})
// 去录入
const goRecord = () => {
  Taro.navigateTo({
    url: '../photograph/index',
  })
}
//获取学科
const grandChange = (value) => {
  vdata.searchInfo.condition.course = value
  vdata.searchInfo.current = 1
  vdata.recordList = []
  vdata.checkboxAll = false
  vdata.selectOption = []
  getWrongList()
}
// 获取时间
const timerChange = (value) => {
  vdata.searchInfo.condition.timeLimit = value
  vdata.searchInfo.current = 1
  vdata.recordList = []
  vdata.checkboxAll = false
  vdata.selectOption = []
  getWrongList()
}
//文字变更
const changeText = () => {
  // 组卷重练
  const { vipState, tryFlag, configCount, hasTryCount } = vdata.vipBtnFunInfo
  if (!user.vip) {
    if (vipState === 1) {
      // 无可用次数
      if (tryFlag === 1) {
        if (hasTryCount >= configCount) {
          memberToast.value.showToast(true, configCount, hasTryCount)
          return true
        }
      } else {
        memberToast.value.showToast(true, 0, 0)
        return true
      }
    }
  }
  resetText()
}

const handleNavigate = () => {
  resetText()
}

const resetText = () => {
  vdata.text = !vdata.text
  vdata.btnText = 1
  vdata.checkboxAll = false
  vdata.selectOption = []
}
//全选
const checkAll = (value: boolean) => {
  if (vdata.recordList && vdata.recordList.length) {
    group2.value.toggleAll(value)
  }
}
//选择每一项
const itemChange = (label: string[]) => {
  vdata.indeterminate = false
  vdata.deleteNumber = label.length
  vdata.indeterminate = false
  if (label.length === vdata.recordList.length) {
    vdata.indeterminate = false
    vdata.checkboxAll = true
  } else if (label.length && label.length < vdata.recordList.length) {
    vdata.indeterminate = true
    // vdata.checkboxAll = true
  } else {
    vdata.checkboxAll = false
  }
}
// 错题本及标签选择
const chooseOperat = (value) => {
  const { name } = value
  if (name == '移除错题本') {
    vdata.btnText = 2
  } else {
    vdata.btnText = 3
  }
  vdata.text = !vdata.text
}
//功能操作
const handelOperat = (type: number) => {
  if (getSelectNumber.value == 0) return
  if (type == 1) {
    vdata.paperName = ''
    let params = {
      paperCourse: vdata.searchInfo.condition.course,
    }
    getPaperName(params).then((res) => {
      vdata.showPapers = true
      vdata.paperName = res.name
    })
  } else if (type == 2) {
    vdata.showDelete = true
  } else {
    vdata.labelList = []
    if (getSelectNumber.value == 1) {
      let currentList = vdata.recordList.filter(
        (item) => item.exerciseBookId == vdata.selectOption[0]
      )
      if (currentList && currentList.length) {
        vdata.currentGrade = currentList[0].grade || ''
        vdata.currentSubject = currentList[0].subject || ''
        vdata.currentTerm = currentList[0].term || ''
        if (currentList[0].errorTagList && currentList[0].errorTagList.length) {
          // vdata.labelList =
          currentList[0].errorTagList.forEach((item: any) => {
            vdata.labelList.push(item.tagId)
          })
        } else {
          vdata.labelList = []
        }
      }
    } else {
      vdata.currentGrade = ''
      vdata.currentSubject = ''
      vdata.currentTerm = ''
      vdata.labelList = []
    }
    vdata.showLabel = true
  }
}
//获取列表
const getWrongList = () => {
  wrongList(vdata.searchInfo).then((res: any) => {
    if (res.records) {
      let newList = vdata.recordList.concat(res.records)
      vdata.recordList = [...new Set(newList)]
      vdata.total = res.total
      vdata.isLoading = res.records.length ? false : true
    }
  })
}
//清除
const clearPaperName = () => {
  vdata.paperName = ''
  vdata.error = false
  vdata.errorMessage = ''
}
const paperChange = (val) => {
  if (!val) {
    vdata.error = false
    vdata.errorMessage = ''
  }
}
//关闭
const closePapers = () => {
  vdata.paperName = ''
  vdata.showPapers = false
  vdata.error = false
  vdata.errorMessage = ''
}
//组卷
const submitPaper = debounce(() => {
  vdata.questionList = vdata.recordList.filter(
    (item) => vdata.selectOption.indexOf(item.exerciseBookId) != -1
  )
  let contentHtml = readerCreatePaper() || ''
  let params = {
    exerciseBookIds: vdata.selectOption,
    paperCourse: vdata.searchInfo.condition.course,
    paperName: vdata.paperName,
    contentHtml,
  }
  combinePaperV2(params).then((res: any) => {
    if (res.pdfUrl) {
      let origan = {
        exercisePaperName: vdata.paperName,
        questionIdList: vdata.selectOption,
        pdfPreviewUrl: res.pdfUrl,
      }
      let info = JSON.stringify(origan)
      closePapers()
      resetText()
      Taro.navigateTo({
        url: `../paperDetails/index?info=${info}`,
      })
    } else {
      vdata.error = true
      vdata.errorMessage = res.msg
    }
  })
})
function readerCreatePaper() {
  const imgs = []
  let doc = `
  <!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <style>
      body,
      html {
        font-family: 微软雅黑;
      }
      img {
        max-width: 100%;
      }
      .wave {
        padding-bottom: 8px;
        background: url(https://oss.5rs.me/oss/uploadfe/png/0c4d7191fd4c384fe520d25c72a29b50.png)
          no-repeat center bottom;
        word-break: break-word;
      }
      .point2 {
        padding-bottom: 4px;
        background: url(https://oss.5rs.me/oss/uploadfe/png/141a9bca9885f598cca7bb7335254d46.png)
          no-repeat center bottom;
        word-break: break-word;
      }
      .main {
        font-size: 15px;
        line-height: 25px;
        color: #333;
        margin-bottom: 20px;
        text-align: left;
        position: relative;
        width: 100%;
      }
      .isListen {
        width: 80%;
      }
      .toWord {
        padding: 0 0px;
        font-size: 12px;
      }
      .toWord .main {
        font-size: 12px;
        line-height: 22px;
      }
      .toPdf {
        padding: 10px 50px;
      }
      .your-name {
        text-align: right;
      }
      .sorts {
        height: 25px;
        display: flex;
      }
      .sortItem {
        margin-top: 4px;
        display: inline-block;
        text-align: center;
        border-radius: 2px;
        padding: 0 5px;
        height: 17px;
        background: #efefef;
        font-size: 14px;
        color: #333;
        line-height: 17px;
      }
      .toWord .sortItem {
        font-size: 11px;
      }
      .toWord pdfItem {
        fon-size: 11px;
      }
      .qtitle {
        padding-bottom: 5px;
      }
      .toPdf .options {
        display: flex;
        flex-wrap: wrap;
        line-height: 40px;
      }
      .toWord .option {
        line-height: 24px;
      }
      .date {
        width: 50%;
        text-align: right;
      }
      .header {
        height: 46px;
        margin-bottom: 21px;
        width: 100%;
        border-bottom: #333 1px solid;
      }
      .header td {
        line-height: 46px;
      }
      .title {
        line-height: 55px;
        font-size: 17px;
        color: #333333;
        font-weight: 500;
        text-align: center;
        margin-bottom: 10px;
      }
      .toWord .title {
        font-size: 14px;
        lien-height: 40px;
      }
      .options {
        text-align: left;
      }
      .tfill {
        text-align: center;
        margin-bottom: 19px;
        width: 100%;
      }
      .middle {
        width: 114px;
        height: 1px;
        display: inline-block;
      }
      .empty {
        width: 20px;
      }
      .fill1 {
        width: 60px;
      }
      .fill2 {
        height: 15px;
        width: 76px;
        color: #333;
        border-bottom: 1px solid #333333;
      }
      .tip {
        font-size: 20px;
        width: 122px;
        text-align: center;
        line-height: 36px;
        height: 36px;
        background: #efefef;
        color: #333333;
      }
      .qrcode {
        width: 110px;
        height: 110px;
        margin-left: 12px;
        position: absolute;
      }
      .fill,
      .underline,
      .fill,
      fill {
        display: inline-block;
        width: 75px;
        height: 20px;
      }
      .longFill {
        display: inline-block;
        width: 100px;
        height: 20px;
      }
      .listen {
        width: 20%;
      }
      .listen-contains {
        position: relative;
      }
      .listen-tip {
        width: 80px;
      }
      .listen-qrcode-box {
        position: absolute;
        width: 250px;
        right: 0;
        top: 0;
      }
      .listen-qrcode {
        width: 110px;
      }
      .listen-table {
        width: 100%;
        border: #fff 1px solid;
      }
      .listen-table td {
        vertical-align: top;
        border: #fff 1px solid;
      }
      .tip {
        font-size: 10px;
        width: 66px;
        text-align: center;
        line-height: 18px;
        height: 18px;
        background: #efefef;
        color: #333333;
      }
      .fillFormat {
        text-decoration: underline;
        margin-right: 0;
        display: inline;
      }
      .paper-header {
        width: 100%;
        border: #fff 1px solid;
      }
      .tab {
        padding: 0 10px;
      }
      .l {
        text-align: center;
        font-size: 12px;
        width: 20%;
        border: #fff 1px solid;
      }
      .m {
        width: 60%;
        border: #fff 1px solid;
      }
    </style>
  </head>
  <body>
    <div class="toPdf">
      <table class="paper-header">
        <tr>
          <td>
            <div class="index">
              <div class="title">${vdata.paperName}</div>
            </div>
            <div class="your-name">
              <span>班级：</span>
              <span class="longFill">&nbsp;&nbsp;</span>
              <span>姓名：</span>
              <span class="longFill"
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
              >
            </div>
          </td>
        </tr>
      </table>
      ${vdata.questionList.map((item, index) => renderQuestion(item, index)).join('')}
    </div>
  </body>
</html>

  `

  function renderSort(sort, type) {
    return `<div class='sorts'>
    <span class='sortItem'>第${sort + 1}题</span>
    <span class='question-type'>&nbsp;${type}</span>
  </div>`
  }

  function loadImage(url) {
    imgs.push({ url })
    Taro.getImageInfo({
      src: url,
      success(res) {
        if (res) {
          let { width, height } = res
          const size = 600
          if (width > size) {
            height = (size / width) * height
            width = size
          }
          vdata.docRefCurrent = vdata.docRefCurrent.replace(
            `src="${url}"`,
            `src="${url}" width="${width}" height="${height}"`
          )
          // pdfRef.current = pdfRef.current.replace(
          //   `src="${url}"`,
          //   `src="${url}" width="${width * 1.22}" height="${height * 1.22}"`
          // )
        }
      },
    })
  }

  function renderQuestion(item, index, isChildren = false, isListen = false) {
    const { bookType } = item
    let content = ''
    let options = []
    let children = []
    let questionType = ''
    if (isChildren) {
      content = item?.context?.stem
      options = item?.context.options || []
    } else {
      if (bookType !== 4 && bookType !== 5) {
        const url = item?.topicImageUrl
        content = `<img src="${url}" />`
        loadImage(url)
      } else {
        const vo = JSON.parse(item?.topicContent).data
        content = vo?.context?.stem
        options = vo?.context?.options || []
        children = vo?.children || []
        // questionType = vo?.questionType?.name || ''
      }
    }
    const miniAppQr = ''
    return `<div class='main'>
    ${isChildren ? '' : renderSort(index, questionType)}
    ${`<div class='qtitle'>${isChildren && content ? index + 1 + '、' : ''}${content || ''}</div>`}
    <div
      class='options'
    >
      ${
        options.length
          ? options
              .map((item2, index2) => {
                const __title = isChildren && !index2 && !content ? index + 1 + '、' : ''
                const __html = __title + 'ABCDEFG'[index2] + '、' + item2 || ''
                let tag = 'span'
                if (!__html.includes('<img')) {
                  const txt = __html.replace(/<[^<]+?>/g, '').replace(/&nbsp;/g, ' ')
                  if (txt.length > 15) tag = 'div'
                }
                return `<${tag} class='optionItem'>${__html}</${tag}>${
                  tag === 'span' ? '&nbsp;&nbsp;&nbsp;' : ''
                }`
              })
              .join('')
          : ''
      }
      ${
        children.length
          ? children
              .map((item2, index2) => {
                return renderQuestion(item2, index2, true, !!miniAppQr)
              })
              .join('')
          : ''
      }
    </div>
  </div>`
  }
  doc = doc.replace(
    new RegExp('<span class="fill">&nbsp;</span>', 'g'),
    '<u>' + Array(10).fill('&nbsp;').join('') + '</u>'
  )
  doc = doc.replace(
    new RegExp('<span class="longFill">&nbsp;</span>', 'g'),
    '<u>' + Array(20).fill('&nbsp;').join('') + '</u>'
  )
  doc = doc.replace(
    new RegExp('<fill>&nbsp;</fill>', 'g'),
    '<u>' + Array(10).fill('&nbsp;').join('') + '</u>'
  )
  doc = doc.replace(/\u200B/g, '')
  vdata.docRefCurrent = doc
  // pdfRef.current = doc
  return vdata.docRefCurrent
}
//移除
const deleteList = debounce(() => {
  let params = {
    exerciseBookIds: vdata.selectOption,
  }
  removeWrobook(params).then((res) => {
    resetText()
    setTimeout(() => {
      Taro.showToast({
        title: '移除成功',
        icon: 'none',
        duration: 2000,
      })
    }, 100)
    vdata.searchInfo.current = 1
    vdata.recordList = []
    getWrongList()
  })
})

const fetchVipFunInfo = async () => {
  let res: any = await getTryCount({ funName: '错题本', funCourseName: null })
  vdata.vipBtnFunInfo = res

  return res
}

useDidShow(() => {
  fetchVipFunInfo()
  if (Taro.getStorageSync('deleteList')) {
    Taro.getStorageSync('deleteList').forEach((item) => {
      let index = vdata.recordList.findIndex((key: any) => key.exerciseBookId === item)
      if (index > -1) {
        vdata.recordList.splice(index, 1)
      }
    })
  }
})
onMounted(() => {
  const { params } = router
  if (params?.grand) {
    vdata.grand = params.grand
    vdata.branch = params.branch
    vdata.term = params.term
    vdata.searchInfo.condition.course = params.grand
    vdata.searchInfo.condition.grade = params.branch ? Number(params.branch) : ''
    vdata.searchInfo.condition.term = params.term ? Number(params.term) : ''
  }
})
</script>
<style lang="scss">
.mainContent {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // padding-top: 40px;
  .rightText {
    display: flex;
    align-items: center;
    image {
      width: 12px;
      height: 11px;
      margin-right: 3px;
    }
  }
  .recordContent {
    background: #f6f6f6;
    padding-bottom: 90px;
    box-sizing: border-box;
    overflow: scroll;
    // flex: 1;
  }
  .scroll-view_H {
    // padding: 0 15px;
    height: 100%;
    // height: 300px;
  }
  .checkboxMian {
    // padding: 0 15px;
    padding-left: 15px;
    box-sizing: border-box;
  }
  .scroll-item {
    opacity: 1;
    box-sizing: border-box;
    border: 1px solid #f3f3f3;
    margin-top: 15px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    border-radius: 6px;
    .rightInfo {
      background: #ffffff;
      width: 100vw;
      padding: 12px 12px 0;
      box-sizing: border-box;
      border-radius: 8px;
      .topTimer {
        display: flex;
        margin-bottom: 16px;
        .labelInfo {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          .labelItem {
            padding: 0 6px;
            height: 20px;
            background: #f3f6ff;
            border-radius: 2px;
            font-family: PingFangSC-Regular;
            font-size: 11px;
            /* 文本色/二级 */
            color: #666666;
            line-height: 20px;
            margin-right: 10px;
            margin-bottom: 5px;
          }
        }
        .timer {
          width: 100px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          text-align: right;
          color: #999999;
          flex-shrink: 0;
        }
      }
    }
    .title {
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
    }
    .image {
      box-sizing: border-box;
      image {
        max-width: 100vw;
        width: 100%;
      }
    }
  }
  .scroll-items {
    margin-left: 15px;
    width: 100%;
  }
  .noData {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    flex-direction: column;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    font-weight: normal;
    line-height: 18px;
    color: #333333;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 30px;
    }
    .xg {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      font-weight: normal;
      color: #999999;
      margin: 10px 0 50px;
    }
    .lr {
      width: 104px;
      height: 40px;
      border-radius: 25px;
      background: #0256ff;
      text-align: center;
      line-height: 40px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
    }
  }
  .options {
    height: 85px;
    background: #fff;
    width: 100%;
    padding: 0 15px;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    box-sizing: border-box;
    .rightBtn {
      // position: absolute;
      // position: relative;
      width: 122px;
      display: flex;
      align-items: center;
      position: relative;
      .rightPop {
        position: absolute;
        top: -80px;
        right: 0;
      }
    }
    .nut-popover-content {
      // position: absolute;
      // z-index: 999999;
      // // position: static;
      // top: -80px;
    }
    .delete {
      width: 155px;
      height: 44px;
      border-radius: 22px;
      background: #2f5de7;
      line-height: 44px;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
    }
    .noDelete {
      background: #eeeeee;
      color: #999;
    }

    .zj {
      width: 211px;
      border-radius: 25px;
      height: 40px;
      line-height: 40px;
      color: #ffffff;
      text-align: center;
      background: #0256ff;
      position: relative;
      .vip-image {
        width: 28px;
        height: 13px;
        position: absolute;
        right: 0;
        top: -6px;
      }
    }
    .zl {
      width: 122px;
      height: 44px;
      border: 1px solid #c8c8c8;
      border-radius: 25px;
      text-align: center;
      line-height: 40px;
    }
    .nut-popover-content {
      width: 122px;
      text-align: center;
    }
    .nut-popover-content .nut-popover-menu-item .nut-popover-menu-item-name {
      font-size: 12px;
    }
    .nut-popover-content .nut-popover-menu-item {
      border-bottom: 0.5px solid rgba(255, 255, 255, 0.12);
    }
  }
  .labelPup {
    .popup-bottom {
      // background: rgba(0, 0, 0, 0.1);
      z-index: 1000 !important;
      // padding: 10px 15px 0;
      box-sizing: border-box;
    }
    .nut-overlay {
      position: static;
    }
  }
}
.search-content {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  z-index: 10;
}
.paperInfo {
  position: absolute;
  top: 40%;
  left: 22px;
  right: 22px;
  border-radius: 18px;
  padding: 20px 21px 27px;
  background: #fff;
  .title {
    text-align: center;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .nut-input.nut-input-border {
    border: none;
  }
  .nut-input {
    background: rgba(196, 196, 196, 0.1);
    border-radius: 10px;
    padding-left: 10px;
  }
  .errorMsg {
    font-size: 12px;
    color: #e76767;
    font-family: PingFangSC-Regular;
    margin-top: 5px;
  }
  .btn {
    margin-top: 20px;
  }
  .close {
    width: 16px;
    height: 16px;
    position: absolute;
    right: 21px;
    top: 22px;
    image {
      width: 16px;
      height: 16px;
    }
  }
}
.inputInfo {
  height: 50px;
  background: #f8f8f8;
  border-radius: 90px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  margin-top: 15px;
  input {
    height: 50px;
    width: 100%;
    font-size: 14px;
  }

  .input-placeholder {
    font-family: PingFang SC;
    font-size: 14px;
    color: #c8c8c8;
  }
}
.errorBorder .inputInfo {
  border: 1px solid red !important;
}
.rightBtn {
  display: flex;
  align-items: center;
}
.errorMsg {
  font-family: PingFang SC;
  color: #e76262;
  font-size: 12px;
  margin-top: 5px;
}
.sm-img {
  width: 18px;
  height: 18px;
}
.close-img {
  width: 17.5px;
  height: 17.5px;
  margin-right: 0px;
}
</style>
