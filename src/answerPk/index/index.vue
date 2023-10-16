<template>
  <view class="answerPkMain" :style="{ paddingTop: `${navBarHeight + 50}px` }">
    <NavBar title="答题乐园" :fixedStyle="vdata.fixedStyle" :onClickBack="returnOrClose" />
    <view class="tabInfo">
      <view class="left">
        <view :class="['firstSelect', vdata.subject == 1 && 'selectTab']" @tap="tabChange(1)"
          >语文</view
        >
        <view :class="['firstSelect', vdata.subject == 2 && 'selectTab']" @tap="tabChange(2)"
          >数学</view
        >
        <view :class="vdata.subject == 3 && 'selectTab'" @tap="tabChange(3)">英语</view>
      </view>
      <view class="right" @tap="changeGrand">
        <view v-if="vdata.grade">
          <text>{{ vdata.versionName }}</text>
          <text>{{ vdata.grandName }}</text>
        </view>
        <view v-else>请选择年级</view>
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9400a5cb55b541adb59ef9050345fe1c/close-circle-fill.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="setUp">
      <view class="flexRight flexRightOne" v-if="vdata.isMusic" @tap="setMusic(false)">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/98148da7ddaa4a49a1e6815c58b309a8/muick.png"
          mode="scaleToFill"
        />
        <view>音乐开关</view>
      </view>
      <view class="flexRight flexRightOne" v-else @tap="setMusic(true)">
        <image
          class="closeImg"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/48fd5938d0974326ba7be01143cd2118/closeMuick.png"
          mode="scaleToFill"
        />
        <view>音乐开关</view>
      </view>
      <view class="flexRight" @tap="toRank">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/4f6d8e279b5449a9be3daaebdc37e8aa/phb.png"
          mode="scaleToFill"
        />
        <view>排行榜</view>
      </view>
    </view>
    <view class="dtpk">
      <view class="km">
        <image
          v-show="vdata.subject == 1"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/da97386822d14b299c7ec4249d7de9e2/yw.png"
          mode="scaleToFill"
        />
        <image
          v-show="vdata.subject == 2"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/9b5391cec53c4c86b3a8ed8f3fea95ba/sx.png"
          mode="scaleToFill"
        />
        <image
          v-show="vdata.subject == 3"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/76ea0353cbad43bdbc95cb9b28a3d73a/yy.png"
          mode="scaleToFill"
        />
      </view>
      <view class="pkImg">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/a74aa2a0eac14b4d81c152922cdc830c/dtpk.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="operate" @tap="begin">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/0fb59061fb004c50a277572730050524/sjpp.png"
        mode="scaleToFill"
      />
      <text>随机匹配</text>
    </view>
    <nut-popup position="bottom" closeable round v-model:visible="vdata.showRound">
      <view class="seeting-list">
        <view class="study-seeting">学习设置</view>
        <view class="seeting-item">
          <view>单词发音</view>
          <view>
            <nut-radiogroup v-model="vdata.pronunciation" direction="horizontal">
              <nut-radio label="1">美音</nut-radio>
              <nut-radio label="2">英音</nut-radio>
            </nut-radiogroup>
          </view>
        </view>
        <view class="seeting-item">
          <view>背单词操作音效</view>
          <view>
            <nut-switch v-model="vdata.sound" />
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup
      round
      position="bottom"
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
          <image
            @tap="vdata.grandShow = false"
            class="closeIcon"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/47bed41528a3418b9111e5199de4ab61/icon1.png"
          />
        </view>
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
              <view
                :class="['grandDetailItem', vdata.gradeCode == item.gradeCode && 'selectGrandItem']"
                @tap="chooseBook(item)"
                >{{ item.gradeName }}</view
              >
              <!-- </template> -->
            </view>
          </view>
        </view>
      </view>
    </nut-popup>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useRouter, useDidHide } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, useAnswerPk, useUser } from '@/stores'
import { chapterInfo } from '@/api/intelligentQuestion'

const system = useSystem()
const answerPk = useAnswerPk()
const router = useRouter()
const user = useUser()
const { navBarHeight } = system.navBarInfo
import { classInfo, termKeys, courseKey } from '@/utils/common'
import { reactive, onMounted, onBeforeUnmount, ref } from 'vue'
import { getTryCount } from '@/api/index'
import { debounce } from '@/utils/index'
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const vdata = reactive({
  directory: false,
  fixedStyle: {
    color: '#fff',
  },
  subject: '',
  grade: '',
  term: '',
  version: '',
  dataInfo: {},
  grandShow: false,
  questionPeriodDTOList: [],
  grandType: '',
  versionKey: '',
  grandCurrent: 0,
  versionCurrent: 0,
  gradeCode: '',
  termCode: '',
  versionName: '',
  grandName: '',
  isMusic: '',
})
const begin = debounce(async () => {
  if (!vdata.grade) {
    return Taro.showToast({
      title: '请选择年级',
      icon: 'none',
      duration: 2000,
    })
  }
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '答题乐园', funCourseName: null })
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
const handleNavigate = () => {
  let grade = classInfo[vdata.grandName] || 10
  let params = {
    subject: vdata.subject,
    grade: grade,
  }
  answerPk.setSubjectInfo(params)
  newGrade()
  Taro.navigateTo({
    url: `../opponent/index`,
  })
}
const newGrade = () => {
  let params = {
    subject: courseKey[vdata.subject],
    grade: vdata.dataInfo?.questionBrushGradeDTO
      ? classInfo[vdata.dataInfo.questionBrushGradeDTO?.name]
      : '',
    term: vdata.dataInfo?.questionTermDTO ? termKeys[vdata.dataInfo.questionTermDTO?.name] : '',
  }
  answerPk.setSaveInfo(params)
}
const setMusic = (val) => {
  vdata.isMusic = val
  answerPk.setMusic(val)
  resetAudio()
  if (val) {
    createBgAudio()
  }
}
const tabChange = (val) => {
  vdata.subject = val
  getChapterInfo()
}
const toRank = () => {
  Taro.navigateTo({
    url: '../ranking/index',
  })
}
const returnOrClose = () => {
  Taro.navigateBack({ delta: router.params.delete ? 2 : 1 })
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
    vdata.versionKey = vdata.questionPeriodDTOList[0]?.questionVersionDTOList[0]?.versionCode
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
const chooseBook = (item, vtem?: Object) => {
  vdata.grandName = item.gradeName
  vdata.gradeCode = item.gradeCode
  vdata.versionName =
    vdata.questionPeriodDTOList[vdata.grandCurrent].questionVersionDTOList[
      vdata.versionCurrent
    ].versionName
  vdata.grandShow = false
  let grade = classInfo[vdata.grandName] || 10
  answerPk.setVersionKey('version', vdata.versionName)
  answerPk.setVersionKey('grade', grade)
}
const getCode = () => {
  let code = ''
  if (vdata.subject == 1) {
    code = '1111'
  } else if (vdata.subject == 2) {
    code = '1112'
  } else if (vdata.subject == 3) {
    code = '1113'
  }
  return code
}
// 获取版本信息
const getChapterInfo = () => {
  let params = {
    grade: vdata.grade,
    subject: vdata.subject,
    term: vdata.term,
    version: vdata.version,
  }
  chapterInfo('getChapterInfo', params).then((res) => {
    vdata.dataInfo = res
    vdata.versionName = vdata.dataInfo?.questionBrushVersionDTO?.name
    vdata.grandName = vdata.dataInfo?.questionBrushGradeDTO?.name
  })
}
let innerAudioContext: any = null
const createBgAudio = () => {
  innerAudioContext = Taro.createInnerAudioContext()
  innerAudioContext.src =
    'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/b536ce0985cd499ca366e676bbc35aca/bfbg.mp3'
  innerAudioContext.play() // 播放
  innerAudioContext.onEnded(() => {
    resetAudio()
    createBgAudio()
  })
}
const resetAudio = () => {
  if (innerAudioContext) {
    innerAudioContext.destroy()
    innerAudioContext = null
  }
}
useDidShow(() => {
  vdata.isMusic = answerPk.music
  if (vdata.isMusic) {
    createBgAudio()
  }
})
onBeforeUnmount(() => {
  resetAudio()
})
useDidHide(() => {
  resetAudio()
})
onMounted(() => {
  const { grade, subject, term, version } = answerPk.versionInfo
  vdata.subject = subject
  vdata.grade = grade
  vdata.term = term
  vdata.version = version || '人教版'
  getChapterInfo()
})
</script>
<style lang="scss">
.answerPkMain {
  height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/67f312972c1a4045b9bdf0bfa5a6904c/pkBg.png')
    no-repeat top;
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 0 16px;
  .tabInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 35px;
    .left {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #333333;
      .firstSelect {
        margin-right: 20px;
      }
      .selectTab {
        font-family: PingFangSC-Semibold;
        position: relative;
        font-weight: 700;
      }
      .selectTab::after {
        position: absolute;
        content: '';
        width: 16px;
        height: 4px;
        bottom: -9px;
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
      text-align: right;
    }

    image {
      width: 16px;
      height: 16px;
    }
  }
  .setUp {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    justify-content: center;
    .flexRight {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-family: PingFangSC-Medium;
      font-size: 11px;
      color: #4d4d4d;
    }
    image {
      width: 20px;
      height: 20px;
      margin-top: 3px;
    }
    .closeImg {
      width: 25px;
      height: 20px;
      margin-top: 3px;
    }
    .flexRightOne {
      margin-bottom: 24px;
    }
  }
  .dtpk {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    .km {
      position: relative;
      right: -20px;
      bottom: -8px;
      animation-name: beat;
      /*动画名称*/
      animation-duration: 0.4s;
      /*设置秒数*/
      animation-timing-function: linear;
      /*速度曲线*/
      animation-iteration-count: infinite;
      /*播放次数*/
      animation-direction: alternate;
      /*逆向播放*/
      animation-play-state: running;
      /*正在运行*/
      image {
        width: 76px;
        height: 34px;
      }
    }
    .pkImg {
      image {
        width: 246px;
        height: 64px;
      }
    }
  }
  .operate {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #f9f9f9;
    image {
      width: 18px;
      height: 18px;
    }
    background: #2f5de7;
    height: 46px;
    border-radius: 23px;
    box-shadow: 0px 6px 7px 0px rgba(0, 73, 255, 0.2);
    position: fixed;
    bottom: 110px;
    left: 50px;
    right: 50px;
  }
  .versionContent {
    display: flex;
    flex-direction: column;
    height: 100%;
    .title {
      font-size: 16px;
      padding: 20px;
      border-bottom: 0.5px solid #f0f0f0;
      display: flex;
      color: #666666;
      align-items: center;
      position: relative;
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
    .closeIcon {
      position: absolute;
      right: 15px;
      width: 24px;
      height: 24px;
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
          padding: 0 25px;
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
  }
  @keyframes beat {
    0% {
      bottom: -8px;
    }

    100% {
      bottom: 0px;
    }
  }
  .popup-bottom.round {
    border-radius: 18px 18px 0 0;
  }
}
</style>
