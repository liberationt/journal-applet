<template>
  <view class="intelligentMain" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="智能刷题" :onClickBack="returnClose"></NavBar>
    <view class="tabInfo">
      <view
        v-for="(item, i) in vdata.classList"
        :key="i"
        @tap="tabChange(i + 1)"
        :class="['tap-item-info', vdata.subject == i + 1 && 'selectTab']"
        >{{ item.lable }}</view
      >
    </view>
    <scroll-view
      class="scrollInfo"
      :scroll-y="true"
      :style="{ height: `calc(100vh - ${navBarHeight + 65}px)` }"
    >
      <view class="intelligen" @tap="begin">
        <view class="gradeAndClass" @tap.stop="changeGrand">
          <text>{{ vdata.dataInfo?.questionBrushVersionDTO?.name }}</text>
          <text
            >{{ vdata.dataInfo?.questionBrushGradeDTO?.name
            }}{{ vdata.dataInfo?.questionTermDTO?.name }}</text
          >
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/779e5b1ee2804b699ed0252e250e3e8c/sjx.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="practice">
        <view class="practiceTitle">同步练习</view>
        <view>一课一练 夯实基础</view>
      </view>
      <!-- <scroll-view
      class="scrollInfo"
      :scroll-y="true"
      :style="{ height: `calc(100vh - ${navBarHeight + 265}px)` }"
    > -->
      <template v-if="vdata.dataInfo?.questionBrushChapterDTO?.length">
        <nut-collapse
          v-model:active="activeNames"
          icon="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/115d975449894276bc44e3841f4abc61/bottomRow.png"
          :accordion="true"
          icon-size="12px"
          @change="change"
        >
          <nut-collapse-item
            :name="item.parentChapterCode"
            :title="item.parentChapterName"
            v-for="(item, i) in vdata.dataInfo?.questionBrushChapterDTO"
            :key="item.parentChapterCode"
          >
            <template #sTitle>
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/56671dff136341b89d92b7133aa5cffc/icon.png"
              />
            </template>
            <view v-for="(vtem, key) in item.questionBrushSonChapterDTOList" :key="key">
              <view class="scend-item" @tap="study(vtem.chapterCode, vtem.chapterName, vtem.count)">
                <view class="chapter-name">{{ vtem.chapterName }}</view>
                <view class="study" v-if="vtem.count">去练习</view>
                <view class="study studyDis" v-else> 去练习 </view>
              </view>
            </view>
          </nut-collapse-item>
        </nut-collapse>
      </template>

      <view class="noData" v-else>
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
        />
        <view>暂无内容，切换版本年级学习吧</view>
      </view>
    </scroll-view>
    <!-- <view class="noData" v-else>
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
      />
      <view>暂无内容，切换版本年级学习吧</view>
    </view> -->
    <!-- <nut-overlay v-model:visible="vdata.memberShow" :close-on-click-overlay="false">
      <view class="memberMain">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/d9c0a4e7a65a47319462301fa3df5d6d/icon.png"
          mode="scaleToFill"
          class="closeImg"
          @tap="vdata.memberShow = false"
        />
        <image
          class="qy"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/e0fddd2f62dc432284d3824e1d56dfd2/qy.png"
          mode="scaleToFill"
        />
        <image
          class="qy"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/76d596eaa2674f25b3e7a51debc4bb93/yq1.png"
          mode="scaleToFill"
        />

        <view class="operation" v-if="!vdata.isFirst">
          <view class="toMember" @tap="toMember">开通教育周报会员</view>
        </view>
        <view class="operation" v-else>
          <view class="free" @tap="toBegin">免费练习(1/1)</view>
          <view class="member" @tap="toMember">开通教育周报会员</view>
        </view>
      </view>
    </nut-overlay> -->
    <nut-popup
      position="bottom"
      round
      :style="{ height: '525px' }"
      v-model:visible="vdata.grandShow"
    >
      <view class="versionContent">
        <view class="title">
          <view
            v-for="(item, i) in vdata.questionPeriodDTOList"
            :key="i"
            @tap="grandChange(item, i)"
            :class="['titleItem', vdata.grandType == item.periodCode && 'titleSelect']"
          >
            {{ item.periodName }}
          </view>
        </view>
        <image
          @tap="vdata.grandShow = false"
          class="closeIcon"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/47bed41528a3418b9111e5199de4ab61/icon1.png"
        />
        <view class="versionInfoList">
          <view class="versionList">
            <view
              v-for="(item, key) in vdata.questionPeriodDTOList[vdata.grandCurrent]
                ?.questionVersionDTOList"
              :key="key"
              :class="['version-item', vdata.versionCurrent == key && 'version-select']"
              @tap="versionChange(item, key)"
            >
              {{ item.versionName }}
            </view>
          </view>
          <view class="grandDetail">
            <view
              v-for="(item, i) in vdata.questionPeriodDTOList[vdata.grandCurrent]
                ?.questionVersionDTOList[vdata.versionCurrent]?.questionGradeDTOList"
              class="grandDetailList"
              :key="i"
            >
              <template v-if="item.termDTO">
                <view
                  v-for="(vtem, v) in item.termDTO"
                  @tap="chooseBook(item, vtem)"
                  :class="['grandDetailItem', vdata.termCode == vtem.code && 'selectGrandItem']"
                  :key="v"
                  >{{ item.gradeName }}{{ vtem.name }}</view
                >
              </template>
              <template v-else>
                <view
                  :class="[
                    'grandDetailItem',
                    vdata.gradeCode == item.gradeCode && 'selectGrandItem',
                  ]"
                  @tap="chooseBook(item)"
                  >{{ item.gradeName }}</view
                >
              </template>
            </view>
          </view>
        </view>
      </view>
    </nut-popup>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { chapterInfo, currentDayFirstUse } from '@/api/intelligentQuestion'
import { classInfo, termKeys, courseKey } from '@/utils/common'
import { useSystem, useIntelligentQuestion, useUser } from '@/stores'
import { getTryCount } from '@/api/index'
import { debounce } from '@/utils/index'
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const system = useSystem()
const user = useUser()
const router = useRouter()
const intelligentQuestion = useIntelligentQuestion()
const { navBarHeight } = system.navBarInfo
import { reactive, onMounted, ref, nextTick } from 'vue'
const activeNames = ref(0)
const vdata = reactive({
  subject: 1,

  grade: '',
  term: '',
  version: '',
  gradeCode: '',
  termCode: '',
  dataInfo: {},
  memberShow: false,
  questionPeriodDTOList: [],
  versionCurrent: 0,
  grandShow: false,
  grandType: '',
  grandCurrent: 0,
  chapterCode: '',
  isFirst: true,
  bookVersionList: [],
  versionKey: '',
  bookList: [],
  searchType: 1,
  isMounted: false,
  classList: [
    {
      lable: '语文',
      value: 1,
    },
    {
      lable: '数学',
      value: 2,
    },
    {
      lable: '英语',
      value: 3,
    },
  ],
  chapterName: '',
})
const change = (val) => {
  console.log(val, 999)
}
//tab切换
const tabChange = (num) => {
  vdata.subject = num
  getChapterInfo()
}
const toMember = () => {
  vdata.memberShow = false
  Taro.navigateTo({
    url: '/phaseOne/pages/memberPurchase/index',
  })
}
const toBegin = () => {
  vdata.memberShow = false
  newGrade()
  if (vdata.searchType == 1) {
    setSearchInfo()
    intelligentQuestion.setUniTitle(null)
    Taro.navigateTo({ url: `../questionList/index` })
  } else {
    intelligentQuestion.setUniTitle(vdata.chapterName)
    Taro.navigateTo({ url: `../questionList/index?chapterCode=${vdata.chapterCode}` })
  }
}
const begin = debounce(async () => {
  if (!vdata.dataInfo?.canClick) {
    return
  }
  vdata.searchType = 1
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '智能刷题', funCourseName: null })
    // vdata.termItemInfo = item
    if (memberInfo.vipState == 1) {
      if (memberInfo.tryFlag == 1) {
        if (memberInfo.configCount <= memberInfo.hasTryCount) {
          memberToast.value.showToast(false)
        } else {
          memberToast.value.showToast(true, memberInfo.configCount, memberInfo.hasTryCount)
        }
      } else {
        memberToast.value.showToast(false)
      }
    } else {
      handleNavigate()
    }
  } else {
    handleNavigate()
  }
})
const setSearchInfo = () => {
  let params = {
    gradeCode: vdata.dataInfo?.questionBrushGradeDTO?.code,
    periodCode: getPeriodCode(),
    subjectCode: getCode(),
    termCode: vdata.dataInfo?.questionTermDTO?.code,
    versionCode: vdata.dataInfo?.questionBrushVersionDTO?.code,
  }
  intelligentQuestion.setSearchOra(params)
}
const getPeriodCode = () => {
  let code = null
  if (classInfo[vdata.dataInfo?.questionBrushGradeDTO?.name]) {
    if (classInfo[vdata.dataInfo?.questionBrushGradeDTO?.name] > 6) {
      code = '12'
    } else {
      code = '11'
    }
  } else {
    code = '13'
  }
  return code
}
const study = debounce(async (chapterCode, chapterName, count) => {
  if (!count) {
    return
  }
  vdata.searchType = 2
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '智能刷题', funCourseName: null })
    if (memberInfo.vipState == 1) {
      if (memberInfo.tryFlag == 1) {
        if (memberInfo.configCount <= memberInfo.hasTryCount) {
          memberToast.value.showToast(false)
        } else {
          memberToast.value.showToast(
            true,
            memberInfo.configCount,
            memberInfo.hasTryCount,
            chapterCode,
            chapterName
          )
        }
      } else {
        memberToast.value.showToast(false)
      }
    } else {
      handleNavigate(chapterCode, chapterName)
    }
  } else {
    handleNavigate(chapterCode, chapterName)
  }
})

const handleNavigate = (chapterCode = null, chapterName = null) => {
  newGrade()
  if (vdata.searchType == 1) {
    setSearchInfo()
    intelligentQuestion.setUniTitle(null)
    Taro.navigateTo({ url: `../questionList/index` })
  } else {
    intelligentQuestion.setUniTitle(chapterName)
    Taro.navigateTo({ url: `../questionList/index?chapterCode=${chapterCode}` })
  }
}

const chooseBook = (item, vtem?: Object) => {
  vdata.gradeCode = item.gradeCode
  vdata.termCode = vtem ? vtem.code : ''
  let params = {
    gradeCode: item.gradeCode,
    periodCode: vdata.grandType,
    termCode: vtem ? vtem.code : '',
    versionCode: vdata.versionKey,
    subject: vdata.subject,
    subjectCode: getCode(),
  }
  chapterInfo('changeChapter', params).then((res) => {
    nextTick(() => {
      vdata.isMounted = true
      vdata.dataInfo = res
      vdata.grandShow = false
      activeNames.value =
        vdata.dataInfo.parentChapterCode ||
        vdata.dataInfo?.questionBrushChapterDTO[0]?.parentChapterCode
    })
  })
}
const getCode = () => {
  let code = ''
  if (vdata.subject == 1) {
    code =
      vdata.dataInfo.questionSubjectDTOList.filter((item) => item.subjectName == '语文')[0]
        .subjectCode || ''
    // code = '1111'
  } else if (vdata.subject == 2) {
    // code = '1112'
    code = code =
      vdata.dataInfo.questionSubjectDTOList.filter((item) => item.subjectName == '数学')[0]
        .subjectCode || ''
  } else if (vdata.subject == 3) {
    // code = '1113'
    code = code =
      vdata.dataInfo.questionSubjectDTOList.filter((item) => item.subjectName == '英语')[0]
        .subjectCode || ''
  }
  return code
}
//版本弹框相关
const changeGrand = () => {
  let params = {
    subject: vdata.subject,
  }
  chapterInfo('getBookInfo', params).then((res) => {
    vdata.grandCurrent = 0
    vdata.questionPeriodDTOList = res.questionPeriodDTOList
    vdata.grandType = vdata.questionPeriodDTOList[0]?.periodCode
    vdata.grandShow = true
    vdata.versionKey = vdata.isMounted
      ? vdata.versionKey
      : vdata.questionPeriodDTOList[0]?.questionVersionDTOList[0]?.versionCode
  })
}
const grandChange = (item, i) => {
  vdata.grandType = item.periodCode
  vdata.grandCurrent = i
  vdata.versionCurrent = 0
  vdata.versionKey = item?.questionVersionDTOList[0]?.versionCode
}
const versionChange = (item, i) => {
  vdata.versionKey = item.versionCode
  vdata.versionCurrent = i
}
const getChapterInfo = () => {
  let params = {
    grade: vdata.grade,
    subject: vdata.subject,
    term: vdata.term,
    version: vdata.version,
  }
  chapterInfo('getChapterInfo', params).then((res) => {
    vdata.dataInfo = res
    activeNames.value =
      vdata.dataInfo.parentChapterCode ||
      vdata.dataInfo?.questionBrushChapterDTO[0]?.parentChapterCode
  })
}
const newGrade = () => {
  let params = {
    subject: courseKey[vdata.subject],
    grade: vdata.dataInfo?.questionBrushGradeDTO
      ? classInfo[vdata.dataInfo.questionBrushGradeDTO?.name] || 10
      : 10,
    term: vdata.dataInfo?.questionTermDTO ? termKeys[vdata.dataInfo.questionTermDTO?.name] || 1 : 1,
  }
  intelligentQuestion.setSaveInfo(params)
}
const returnClose = () => {
  let page = router.params.type ? Number(router.params.type) : 1
  Taro.navigateBack({ delta: page })
}
useDidShow(() => {})
onMounted(() => {
  const { grade, subject, term, version } = intelligentQuestion.versionInfo
  vdata.subject = subject
  vdata.grade = grade
  vdata.term = term
  vdata.version = version
  getChapterInfo()
})
</script>
<style lang="scss">
.intelligentMain {
  height: 100vh;
  background-image: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/460e28cdddcb4e62b1752511362a4a48/bdcBg.png');
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100%;
  box-sizing: border-box;
  background-color: #f7f7f7;
  .tabInfo {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: normal;
    color: #333333;
    font-weight: 500;
    margin-bottom: 17px;
    view {
      margin: 0 15px;
    }
    .selectTab {
      position: relative;
    }
    .selectTab::after {
      position: absolute;
      content: '';
      width: 12px;
      height: 4px;
      bottom: -10px;
      left: 50%;
      right: 0;
      background: #0256ff;
      display: inline-block;
      border-radius: 2px;
      transform: translateX(-50%);
    }
  }
  .intelligen {
    margin: 0 15px;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/daa07c0f26514e169df5f8231f5e647a/intelllBg.png')
      no-repeat center;
    background-size: 100% 100%;
    height: 168px;
    position: relative;
    .gradeAndClass {
      position: absolute;
      top: 10px;
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background: #f2f2f2;
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
      image {
        width: 8px;
        height: 6px;
        margin-left: 5px;
      }
    }
  }
  .practice {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    height: 43px;
    margin: 0 15px;
    .practiceTitle {
      font-family: PingFangSC-Medium;
      font-size: 15px;
      font-weight: 500;
      margin-right: 10px;
    }
  }
  .scrollInfo {
    box-sizing: border-box;
    .scend-item {
      font-family: PingFang SC;
      font-size: 14px;
      color: #666666;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 0;
      // border-bottom: 1px solid #ecf0f6;
      .chapter-name {
        flex: 1;
        padding-right: 2px;
      }
      .study {
        width: 60px;
        height: 28px;
        background: #f4f8ff;
        text-align: center;
        line-height: 28px;
        font-size: 12px;
        color: #2f5de7;
        border-radius: 20px;
        font-weight: 600;
      }
      .studyDis {
        background: #eeeeee;
        color: #cbcbcb;
      }
    }
    .nut-collapse-item {
      margin: 0 15px 12px;
      border-radius: 8px;
      overflow: hidden;
      .collapse-item {
        padding: 17px 16px;
        .collapse-title-value {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          /* 个人/正文#333333 */
          color: #333333;
          .collapse-icon-title {
            width: 280px;
            position: relative;
            top: 3.5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .nut-collapse-item .collapse-wrapper .collapse-content {
      padding: 0 16px;
    }
    .nut-collapse-item .collapse-item .collapse-title-value {
      text-indent: 8px;
    }
    .nut-collapse-item .collapse-item::after {
      border: none;
    }
    .nut-collapse-item .collapse-item .subTitle {
      left: 14px;
      image {
        width: 10px;
        height: 10px;
      }
    }
    .collapse-item .collapse-icon {
      top: 58%;
    }
  }
  .noData {
    // position: absolute;
    // top: 50%;
    // left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // transform: translate(-50%, -50%);
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #414141;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 20px;
    }
  }
  .memberMain {
    position: absolute;
    left: 50%;
    top: 50%;
    padding-top: 100px;
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    width: 342px;
    height: 356px;
    text-align: center;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/320c432205d6469d9216b633c486f465/mb.png')
      no-repeat center;
    background-size: 100% 100%;
    .closeImg {
      width: 18px;
      height: 18px;
      position: absolute;
      right: 0;
      top: -22px;
    }
    .qy {
      width: 226px;
      height: 72px;
      margin-bottom: 16px;
    }
    .operation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 20px;
      view {
        height: 44px;
        text-align: center;
        border-radius: 30px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
      }
      .free {
        box-sizing: border-box;
        border: 1px solid #893500;
        color: #893500;
        line-height: 42px;
        width: 132px;
      }
      .member {
        background: linear-gradient(90deg, #ff6b00 -1%, #ff3429 100%);
        box-shadow: 0px 3px 22px 0px rgba(155, 82, 58, 0.2);
        line-height: 44px;
        color: #fff;
        width: 154px;
      }
      .toMember {
        background: linear-gradient(90deg, #ff6b00 -1%, #ff3429 100%);
        width: 100%;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #ffffff;
        line-height: 44px;
      }
    }
  }
  .popup-bottom {
    height: 100%;
  }
  .versionContent {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .closeIcon {
    position: absolute;
    right: 15px;
    width: 24px;
    height: 24px;
    top: 20px;
  }
  .title {
    font-size: 16px;
    padding: 20px;
    border-bottom: 0.5px solid #f0f0f0;
    display: flex;
    color: #666666;
    align-items: center;
    .titleItem {
      color: #333333;
      margin-right: 25px;
    }
    .titleSelect {
      font-family: PingFangSC-Semibold;
      position: relative;
      font-size: 18px;
      color: #333;
    }
    .titleSelect::after {
      position: absolute;
      content: '';
      width: 19px;
      height: 3px;
      bottom: -5px;
      left: 50%;
      background: #2f5de7;
      display: inline-block;
      border-radius: 2px;
      transform: translateX(-50%);
    }
  }
  .versionInfoList {
    flex: 1;
    display: flex;
    height: 100%;
    overflow: hidden;
    .versionList {
      flex-shrink: 0;
      width: 110px;
      overflow-y: scroll;
      background: #f6f9fd;
      padding-bottom: 10px;
      .version-item {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: normal;
        line-height: 18px;
        color: #333333;
        margin-top: 22px;
        position: relative;
        text-align: center;
        padding: 0 8px;
      }
      .version-select {
        font-family: PingFangSC-Medium;
        font-weight: 800;
      }
      .version-select::after {
        position: absolute;
        content: '';
        width: 3px;
        height: 13px;
        left: 0;
        background: #516aff;
        display: inline-block;
        border-radius: 2px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    // .grandDetail {
    //   display: flex;
    //   // flex-wrap: wrap;
    //   align-items: flex-start;
    // }
    .grandDetail {
      display: flex;
      flex-wrap: wrap;
      overflow-y: scroll;
      padding: 18px 0 0 20px;
      box-sizing: border-box;
      align-content: flex-start;
      flex: 1;
      .grandDetailList {
        display: flex;
      }
      .grandDetailItem {
        // width: 90px;
        padding: 0 15px;
        text-align: center;
        font-family: PingFang SC;
        font-size: 14px;
        height: 35px;
        margin-right: 20px;
        border-radius: 20px;
        background: #f5f5f5;
        line-height: 35px;
        margin-bottom: 20px;
      }
      .selectGrandItem {
        background: #e0eaff;
        color: #0256ff;
      }
    }
  }
  .popup-bottom.round {
    border-radius: 18px 18px 0 0;
  }
}
</style>
