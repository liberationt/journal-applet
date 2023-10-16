<template>
  <nut-popup
    @close="closePopup"
    round
    position="bottom"
    closeable
    :style="{ height: '575px' }"
    v-model:visible="vdata.showRound"
  >
    <view>
      <view class="popupBox">
        <view class="popupContent">
          <view class="addWeekly">添加周报</view>
          <view class="grade" @tap="gradeShow">{{ vdata.gradeName }}</view>
          <nut-icon name="rect-down" color="#333333"></nut-icon>
          <!-- <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/6f0884987be549e485056b2600497b65/openIcon.png"
          ></image> -->
        </view>
        <view class="weeklyBox" v-if="vdata.list.length">
          <view
            class="item"
            :class="{ selectBox: item.id == vdata.selectId }"
            v-for="(item, index) in vdata.list"
            :key="index"
            @tap="selectChange(item, index)"
          >
            <view v-if="item.isSelect" class="recently">当前在学</view>
            <view class="left">
              <image :src="item.journalCoverUrl"></image>
            </view>
            <view class="right">
              <view class="title">{{ item.journalName }}</view>
              <text class="detail">
                {{ item.journalFirm }}
              </text>
              <text class="detail"> {{ item.journalGrade }}{{ item.journalTerm }} </text>
            </view>
          </view>
        </view>
        <!-- 暂无周报 -->
        <view class="noData" v-else>
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/2e9d54fd01124007ab8f3d092bc580d8/noWeeklyReport.png"
          ></image>
          <view>暂无周报</view>
        </view>
      </view>
      <view class="confirmBox">
        <view @tap="confirm" class="btn">确定</view>
      </view>
      <GradePopup
        :grande="vdata.userClassGrade"
        @handleChange="handleChange"
        ref="gradeShowPopup"
      ></GradePopup>
    </view>
  </nut-popup>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro'
import { reactive, ref, defineEmits } from 'vue'
import GradePopup from './GradePopup.vue'
import { useUser } from '@/stores'
import { getNorthJournalResourceList, geTtoggle } from '@/api/index'
const emit = defineEmits(['weeklyChangeChange'])
const gradeShowPopup = ref('')
const vdata = reactive({
  course: '',
  userClassGrade: '',
  grandeCount: '',
  gradeName: '选择年级',
  selectId: '0',
  list: [
    {
      studyingNow: true,
      id: '0',
      image:
        'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/4c2aca26cd1a4a01947227780da00b08/english.png',
      title: '《教育周报》2023-2024上学期小学数学北师大版三年级第1-24期',
      labelList: [
        {
          name: '三年级',
        },
        {
          name: '北师大版',
        },
      ],
    },
    {
      id: '1',
      image:
        'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/4c2aca26cd1a4a01947227780da00b08/english.png',
      title: '《教育周报》2023-2024上学期小学数学北师大版三年级第1-24期',
      labelList: [
        {
          name: '三年级',
        },
        {
          name: '北师大版',
        },
      ],
    },
    {
      id: '2',
      image:
        'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/4c2aca26cd1a4a01947227780da00b08/english.png',
      title: '《教育周报》2023-2024上学期小学数学北师大版三年级第1-24期',
      labelList: [
        {
          name: '三年级',
        },
        {
          name: '北师大版',
        },
      ],
    },
    {
      id: '3',
      image:
        'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/4c2aca26cd1a4a01947227780da00b08/english.png',
      title: '《教育周报》2023-2024上学期小学数学北师大版三年级第1-24期',
      labelList: [
        {
          name: '三年级',
        },
        {
          name: '北师大版',
        },
      ],
    },
  ],
  showRound: false,
})
//  选中周报
const selectChange = (item: any, index: any) => {
  vdata.selectId = item.id
}
const popupShow = async (val) => {
  vdata.selectId = ''
  let id = val.subjectId
  Taro.hideTabBar()
  // let grade = useUser().userInfo.userClassGrade || ''
  vdata.userClassGrade = val.journalGradeInt || useUser().userInfo.userClassGrade || ''
  vdata.gradeName = getgradeName(vdata.userClassGrade)
  vdata.course = id
  await getList(vdata.course, vdata.userClassGrade)
  vdata.showRound = true
}
const getList = async (course, classGrade) => {
  let req = {
    classGrade: classGrade,
    course: course,
  }
  const res = await getNorthJournalResourceList(req)
  vdata.list = res || []
  console.log(res, 'res======')
}
const getgradeName = (val) => {
  let flag = '选择年级'
  if (val == 1) {
    flag = '一年级'
  } else if (val == 2) {
    flag = '二年级'
  } else if (val == 3) {
    flag = '三年级'
  } else if (val == 4) {
    flag = '四年级'
  } else if (val == 5) {
    flag = '五年级'
  } else if (val == 6) {
    flag = '六年级'
  } else if (val == 7) {
    flag = '七年级'
  } else if (val == 8) {
    flag = '八年级'
  } else if (val == 9) {
    flag = '九年级'
  } else if (val == 10) {
    flag = '高一'
  } else if (val == 11) {
    flag = '高二'
  } else if (val == 12) {
    flag = '高三'
  }
  return flag
}
const closePopup = () => {
  Taro.showTabBar()
}
const confirm = async () => {
  if (!vdata.selectId)
    return Taro.showToast({
      title: '请选择周报',
      icon: 'none',
      duration: 2000,
    })
  Taro.showTabBar()
  let req = {
    course: vdata.course,
    journalResourceId: vdata.selectId,
    grade: vdata.userClassGrade,
  }
  const res = await geTtoggle(req)
  emit('weeklyChangeChange')
  console.log(res, '==========')
  vdata.showRound = false
}
//  选择年级弹框
const gradeShow = () => {
  gradeShowPopup.value.popupShow(vdata.userClassGrade)
}
//  选中年级
const handleChange = async (value) => {
  vdata.selectId = ''
  console.log(value, 'value')
  vdata.userClassGrade = value[0]
  vdata.gradeName = getgradeName(value[0])
  await getList(vdata.course, vdata.userClassGrade)
}
defineExpose({
  popupShow,
})
</script>
<style lang="scss">
.popupBox {
  padding: 20px 16px;
  .popupContent {
    margin-bottom: 27px;
    .addWeekly {
      display: inline-block;
      font-size: 18px;
      font-weight: 500;
      color: #06080d;
      margin-right: 12px;
      vertical-align: middle;
    }
    .grade {
      display: inline-block;
      opacity: 0.9;
      font-size: 16px;
      color: #333333;
      vertical-align: middle;
    }
    .nut-icon {
      font-size: 8px;
      vertical-align: middle;
      color: #333333;
      font-weight: 600;
    }
    image {
      width: 8px;
      height: 8px;
      margin-left: 6px;
      vertical-align: middle;
    }
  }
  .weeklyBox {
    height: 380px;
    padding-bottom: 30px;
    overflow-y: auto;
    .item {
      padding: 24px 18px 0;
      border: 2px solid #e1e8ff;
      height: 120px;
      border-radius: 12px;
      box-sizing: border-box;
      opacity: 1;
      margin-bottom: 16px;
      position: relative;
      .recently {
        width: 58px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/63790aa42a6d4fab876fe378b789f763/recently.png')
          no-repeat top;
        background-size: 100% 100%;
        position: absolute;
        bottom: 0px;
        right: 0px;
        font-size: 12px;
        color: #ffffff;
      }
      .left {
        width: 68px;
        height: 68px;
        // background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/c51259c2124f494590d9fd57e43ec020/languageIcon.png')
        //   no-repeat top;
        // background-size: 100% 100%;
        margin-right: 19px;
        display: inline-block;
        vertical-align: middle;
        margin-top: 2px;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        display: inline-block;
        // height: 46px;
        vertical-align: middle;
        width: 215px;
        .title {
          // display: inline-block;
          height: 46px;
          line-height: 23px;
          margin-bottom: 5px;
          opacity: 0.9;
          font-size: 14px;
          color: #333333;
        }
        .detail {
          opacity: 0.7;
          font-size: 12px;
          line-height: 14px;
          color: #0887ff;
          padding: 3px 6px;
          border-radius: 4px;
          background: #edf8ff;
          margin-right: 12px;
        }
      }
    }
    .selectBox {
      border: 2px solid #2f5de7;
      box-sizing: border-box;
    }
  }
  .noData {
    text-align: center;
    padding-top: 72px;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 30px;
    }
    view {
      font-size: 14px;
      text-align: center;
      color: #414141;
    }
  }
}
.confirmBox {
  width: 100%;
  height: 110px;
  background: #fff;
  position: fixed;
  bottom: 0;
  padding: 0 16px;
  border: 1px solid #f0f0f0;
  .btn {
    height: 40px;
    margin-top: 21px;
    line-height: 40px;
    border-radius: 20px;
    background: #2f5de7;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
  }
}
.nut-icon {
  font-weight: 700;
  color: #000;
}
</style>
