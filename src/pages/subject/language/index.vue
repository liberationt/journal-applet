<template>
  <view class="container">
    <view class="weekly">
      <view class="atSchool">在学周报</view>
      <view v-if="props.dataInfoObj.journalCoverUrl">
        <view class="weeklyRight" @tap="changeWeekly">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/b38bcae5cc1e47a6954efca0c4d84c26/refresh.png"
          ></image>
          <view>切换周报</view>
        </view>
        <view class="weeklyContent">
          <view class="journalName">{{ props.dataInfoObj.journalName }}</view>
          <view class="labelItem">
            <view v-if="props.dataInfoObj.journalGrade">{{ props.dataInfoObj.journalGrade }}</view>
            <view v-if="props.dataInfoObj.journalCourse">{{
              props.dataInfoObj.journalCourse
            }}</view>
            <view v-if="props.dataInfoObj.journalTerm">{{ props.dataInfoObj.journalTerm }}</view>
            <view v-if="props.dataInfoObj.journalFirm">{{ props.dataInfoObj.journalFirm }}</view>
          </view>
        </view>
      </view>
      <view class="addWeekly" v-else>
        <view class="">你还没有添加周报，</view>
        <view class="goAdd" @tap="addWeekly">去添加</view>
        <!-- <view class="rightJt"></view> -->
        <nut-icon name="rect-right" color="#6781ff"></nut-icon>
      </view>
      <view class="operate">
        <view class="left" @tap="goDeatil('check')"> </view>
        <view class="right" @tap="goOption('/wrongbook/index/index')"> </view>
      </view>
    </view>
    <view class="learningHelper">
      <view class="title">学习帮手</view>
      <view>
        <view class="learningBox">
          <view class="item" @tap="goOptionSubject('/photoSearch/index/index')">
            <view class="leftBox">
              <view class="searchQuestions">拍照搜题</view>
              <view class="detail">海量题库</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/e39d491eb6614079b491ee3c82d26e56/searchQuestions.png"
              ></image>
            </view>
          </view>
          <view
            class="item"
            v-if="props.dataInfoObj.subjectId !== '2'"
            @tap="goOptionSubject('/photoCorrect/index/index', 1)"
          >
            <view class="leftBox">
              <view class="searchQuestions">拍照批改</view>
              <view class="detail">辨别正误</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/289d6a38f09d46ac996f8dbbd6c9eec5/correcting.png"
              ></image>
            </view>
          </view>
          <view
            class="item"
            @tap="goOption('/oralAssess/index/index')"
            v-if="props.dataInfoObj.subjectId == 3"
          >
            <view class="leftBox">
              <view class="searchQuestions">口语测评</view>
              <view class="detail">同步教材</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/752199a14f3e444cba14d7505c7fe156/kycp.png"
              ></image>
            </view>
          </view>

          <view
            class="item"
            @tap="goOption('/dictationExercise/index/index')"
            v-if="props.dataInfoObj.subjectId == 1"
          >
            <view class="leftBox">
              <view class="searchQuestions">听写训练</view>
              <view class="detail">同步练习</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ksbp/fdf26feccdc1457490ba6844f8a4975f/txxl.png"
              ></image>
            </view>
          </view>

          <view class="item" @tap="goIntellOption('/intelligentQuestion/index/index')">
            <view class="leftBox">
              <view class="searchQuestions">智能刷题</view>
              <view class="detail">定制你的练习题</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/5c9a6f38db904f949ca54eff33c36ffa/znst.png"
              ></image>
            </view>
          </view>

          <view
            class="item"
            @tap="goOptionSubject('/oralCorrection/index/index', 1)"
            v-if="props.dataInfoObj.subjectId == 2"
          >
            <view class="leftBox">
              <view class="searchQuestions">口算批改</view>
              <view class="detail">拍照秒知对错</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ksbp/d3f00e0084f345caa896f4eafe00dfc5/kspg.png"
              ></image>
            </view>
          </view>

          <view
            class="item"
            @tap="goReciteWords('/reciteWords/index/index')"
            v-if="props.dataInfoObj.subjectId == 3"
          >
            <view class="leftBox">
              <view class="searchQuestions">背单词</view>
              <view class="detail">单词同步背诵</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/a724d66b2a1d48c08eff6ef22cae687a/bdc.png"
              ></image>
            </view>
          </view>

          <view
            class="item"
            @tap="goOptionSubject('/essayCorrection/index/index', 1)"
            v-if="props.dataInfoObj.subjectId == 1"
          >
            <view class="leftBox">
              <view class="searchQuestions">作文批改</view>
              <view class="detail">AI智能批改</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/0216d5893cf84c709126a455cfc64ea4/zwpg.png"
              ></image>
            </view>
          </view>

          <view
            class="item"
            @tap="goOption('/dictionary/chineseIndex/index')"
            v-if="props.dataInfoObj.subjectId == 1"
          >
            <view class="leftBox">
              <view class="searchQuestions">汉语字典</view>
              <view class="detail">汉语解释</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/7c2c3bac97a0408cb1942f7f870b7afe/hyzd.png"
              ></image>
            </view>
          </view>

          <view
            class="item"
            @tap="goOption('/dictionary/englishIndex/index')"
            v-if="props.dataInfoObj.subjectId == 3"
          >
            <view class="leftBox">
              <view class="searchQuestions">英汉词典</view>
              <view class="detail">中英互译</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/feaa63f8b8c040e5b148b71af1d38763/yhcd.png"
              ></image>
            </view>
          </view>

          <view class="item" @tap="authority('/authoritative/index/index')">
            <view class="leftBox">
              <view class="searchQuestions">权威资料</view>
              <view class="detail">真题试卷</view>
            </view>
            <view class="picture">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwzl/c4bb3ded2a1c4f7b9e71c193ca2cc399/zl.png"
              ></image>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="paradise">
      <view class="title">答题乐园</view>
      <view class="opera">
        <!-- <image @tap="toThirdParty" :src="props.dataInfoObj.paradiseBg"></image> -->
        <image
          @tap="toAnswerPk"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/941af611ba3d418f8256d719a59ce8e7/dtpk.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <PopupBox @weeklyChangeChange="weeklyChangeChange" ref="popupShow"></PopupBox>
  </view>
</template>
<script lang="ts" setup>
import Taro, { setNavigationBarTitle } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import NavBar from '@/components/NavBar.vue'
import PopupBox from '@/components/PopupBox.vue'
import { getList, debounce } from '@/utils/index'
import { onMounted, ref, reactive, withDefaults, defineProps, defineEmits } from 'vue'
import {
  usePerson,
  useUser,
  useIntelligentQuestion,
  useSystem,
  useRecite,
  useAuthoritative,
  useAnswerPk,
} from '@/stores'
import { classInfo, grandeKey, termInfo } from '@/utils/common'
const user = useUser()
const recite = useRecite()
const authoritative = useAuthoritative()
const personInfo = usePerson()
const emit = defineEmits(['weeklyChange', 'getSetting'])
const system = useSystem()
const answerPk = useAnswerPk()
const intelligentQuestion = useIntelligentQuestion()
const { navBarHeight } = system.navBarInfo
const props = withDefaults(
  defineProps<{
    dataInfoObj?: Object // 数据
  }>(),
  {
    dataInfoObj: {},
  }
)
const popupShow = ref('')

const vdata: any = reactive({
  popupShow: false,
})
//  切换周报
const weeklyChangeChange = () => {
  emit('weeklyChange')
}
const goDeatil = debounce((val) => {
  if (!props.dataInfoObj.journalName) {
    addWeekly()
  } else {
    let dataInfoObj = JSON.stringify(props.dataInfoObj)
    Taro.navigateTo({
      url: '/pages/subject/supportingAnswers/index?dataInfoObj=' + dataInfoObj + '&type=' + val,
    })
  }
})
const getSplice = () => {
  return (
    props.dataInfoObj.journalName +
    props.dataInfoObj.journalTerm +
    props.dataInfoObj.journalCourse +
    props.dataInfoObj.journalFirm +
    props.dataInfoObj.journalGrade
  )
}
//  拍照搜题、拍照批改
const goOptionSubject = debounce((path, type?: Number) => {
  // if (!user.vip) {
  //   return Taro.navigateTo({
  //     url: '/phaseOne/pages/memberPurchase/index',
  //   })
  // }
  Taro.setStorageSync('courseType', props.dataInfoObj.subjectId)
  let url = path
  emit('getSetting', url, type)
  // Taro.navigateTo({
  //   url: path,
  // })
})
const goOption = debounce((path) => {
  let grade = new Date().getMonth() + 1 > 7 ? '下学期' : '上学期'
  let params = {
    bookId: props.dataInfoObj.id || '',
    coverImage: props.dataInfoObj.journalCoverUrl || '',
    grade: props.dataInfoObj.journalGrade || getList[user.userInfo.userClassGrade],
    term: props.dataInfoObj.journalTerm || grade,
    version: props.dataInfoObj.journalFirm || '人教版',
  }
  personInfo.setVersion(params)
  if (path) {
    Taro.setStorageSync('courseType', props.dataInfoObj.subjectId)
    Taro.navigateTo({
      url: path,
    })
  }
})
const goIntellOption = debounce((path) => {
  let grade = new Date().getMonth() + 1 > 7 ? '下学期' : '上学期'
  let params = {
    subject: Number(props.dataInfoObj.subjectId),
    grade: props.dataInfoObj.journalGrade
      ? classInfo[props.dataInfoObj.journalGrade]
      : user.userInfo.userClassGrade || 1,
    term: props.dataInfoObj.journalTerm ? termInfo[props.dataInfoObj.journalTerm] : termInfo[grade],
    version: props.dataInfoObj.journalFirm || '',
  }
  intelligentQuestion.setVersionInfo(params)
  Taro.navigateTo({
    url: path,
  })
})
//权威资料
const authority = (path) => {
  // if(authoritative?.)
  // let params = {
  //   grade:authoritative.grade ? authoritative.grade: props.dataInfoObj.journalGrade
  // }
  let params: any = {
    subject: props.dataInfoObj.subjectId,
  }
  if (authoritative.useInfo?.grade) {
    params.grade = authoritative.useInfo.grade
  } else {
    if (props.dataInfoObj.journalGrade) {
      params.grade = classInfo[props.dataInfoObj.journalGrade]
    } else {
      params.grade = user.userInfo.userClassGrade
    }
  }
  if (authoritative.useInfo?.area) {
    params.area = authoritative.useInfo.area
  } else {
    let arr = user?.userInfo?.userAddress?.split('/') || ['河北省']
    params.area = arr[0]
  }
  authoritative.setUseInfo(params)
  Taro.navigateTo({
    url: path,
  })
}
//背单词相关
const goReciteWords = (path) => {
  let grade = new Date().getMonth() + 1 > 7 ? '下学期' : '上学期'
  let params = {
    grade: props.dataInfoObj.journalGrade || getList[user.userInfo.userClassGrade],
    term: props.dataInfoObj.journalTerm || grade,
    version: props.dataInfoObj.journalFirm || '人教PEP版',
  }
  recite.setVersion(params)
  Taro.navigateTo({
    url: path,
  })
}
onMounted(() => {})
//  切换周报
const changeWeekly = async () => {
  popupShow.value.popupShow(props.dataInfoObj)
  // let req = {
  //   course: props.dataInfoObj.id,
  //   journalResourceId: props.dataInfoObj.id,
  // }
  // const res = await geTtoggle(req)
  // console.log(res, '========')
}
//  添加周报
const addWeekly = () => {
  popupShow.value.popupShow(props.dataInfoObj)
}
//  跳转小程序
const toThirdParty = () => {
  Taro.navigateToMiniProgram({
    appId: 'wx180de5a9db184161',
    path: props.dataInfoObj.path,
  })
}
const toAnswerPk = () => {
  // let grade = new Date().getMonth() + 1 > 7 ? '下学期' : '上学期'
  let grade = answerPk.versionInfo?.grade
    ? answerPk.versionInfo?.grade
    : props.dataInfoObj.journalGrade
    ? classInfo[props.dataInfoObj.journalGrade]
    : user.userInfo.userClassGrade || 1
  let version = answerPk.versionInfo?.version
    ? answerPk.versionInfo.version
    : props.dataInfoObj.journalFirm || ''
  let params = {
    subject: Number(props.dataInfoObj.subjectId),
    grade: grade,
    // term: props.dataInfoObj.journalTerm ? termInfo[props.dataInfoObj.journalTerm] : termInfo[grade],
    version: version,
  }
  answerPk.setVersionInfo(params)
  Taro.navigateTo({
    url: '/answerPk/index/index',
  })
}
</script>
<style lang="scss">
.weekly {
  margin: 0 16px;
  border-radius: 18px;
  padding-bottom: 24px;
  background: #fff;
  position: relative;
  margin-bottom: 28px;
  min-height: 124px;
  .atSchool {
    position: absolute;
    top: -5px;
    width: 70px;
    height: 34px;
    line-height: 28px;
    text-align: center;
    font-size: 12px;
    color: #ffffff;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/6196ccdb78db416f92dc1892cb181f52/atSchool.png')
      no-repeat top;
    background-size: 100% 100%;
  }
  .weeklyRight {
    position: absolute;
    top: 12px;
    right: 17px;
    image {
      width: 14px;
      height: 14px;
      margin-right: 5px;
      vertical-align: middle;
    }
    view {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      line-height: 16px;
      color: #333333;
      opacity: 0.9;
    }
  }
  .addWeekly {
    // position: absolute;
    // top: 50%;
    // width: 100%;
    // transform: translateY(-50%);
    padding: 53px 0 20px;
    text-align: center;
    view {
      display: inline-block;
      opacity: 0.9;
      font-size: 16px;
      color: #333333;
      vertical-align: middle;
    }
    .goAdd {
      color: #6781ff;
      vertical-align: middle;
    }
    .nut-icon {
      font-size: 10px;
      vertical-align: middle;
      margin-top: 2px;
    }
    // .rightJt {
    //   margin-left: 2px;
    //   width: 8px;
    //   height: 8px;
    //   background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/41be140133ed447fab280f4838c4b5d5/addWeeklyRight.png')
    //     no-repeat top;
    //   background-size: 100% 100%;
    // }
  }
  .weeklyContent {
    padding: 46px 18px 0px;
    .journalName {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
      color: #333333;
    }
    .labelItem {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
      view {
        height: 20px;
        font-family: PingFangSC-Regular;
        font-size: 10px;
        font-weight: normal;
        color: #999999;
        line-height: 20px;
        padding: 0 6px;
        border-radius: 2px;
        background: #f3f6ff;
        margin-right: 5px;
      }
    }
  }
  .operate {
    display: flex;
    padding: 0 12px;
    margin-top: 30px;
    justify-content: space-between;
    .left {
      width: 155px;
      height: 96px;
      background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/d3d33cf8e6fd45ef92ffa6e1c2f4214e/dajxbg.png')
        no-repeat center;
      background-size: 100% 100%;
    }
    .right {
      width: 155px;
      height: 96px;
      background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/0a40fe563ef94afb9a65c2d1a7ec70a5/ctbbg.png')
        no-repeat center;
      background-size: 100% 100%;
    }
    .firstTitle {
      font-size: 18px;
    }
  }
}
.learningHelper {
  padding: 0 16px;
  margin-bottom: 12px;
  .title {
    opacity: 0.9;
    padding-left: 4px;
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
    color: #333333;
    margin-bottom: 12px;
  }
  .learningBox {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .item {
      width: 164px;
      height: 72px;
      border-radius: 14px;
      margin-bottom: 16px;
      opacity: 1;
      background: #ffffff;
      box-shadow: 0px 6px 12px 0px #ebf4fc;
      padding-top: 16px;
      padding-left: 16px;
      .leftBox {
        float: left;
        .searchQuestions {
          opacity: 0.9;
          font-size: 16px;
          font-weight: 600;
          line-height: 20px;
          color: #333333;
          margin-bottom: 4px;
        }
        .detail {
          font-size: 12px;
          line-height: 16px;
          color: #666666;
        }
      }
      .picture {
        float: right;
        width: 42px;
        height: 36px;
        margin: 2px 10px 0 0;
        // background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/e39d491eb6614079b491ee3c82d26e56/searchQuestions.png')
        //   no-repeat top;
        // background-size: 100% 100%;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.paradise {
  padding: 0 16px;
  // margin-bottom: 28px;
  .title {
    padding-left: 4px;
    opacity: 0.9;
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
    color: #333333;
    margin-bottom: 12px;
  }
  .opera {
    display: flex;
    justify-content: space-between;
  }
  image {
    width: 164px;
    height: 87px;
  }
}
</style>
