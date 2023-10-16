<template>
  <view class="heightPosition">
    <nut-popup
      round
      position="bottom"
      closeable
      :style="{ height: '70%' }"
      v-model:visible="vdata.showRound"
    >
      <view class="gradePopup">
        <view class="title">筛选</view>
        <view class="grade">
          <view class="item">
            <view class="gradeTitle">年级</view>
            <view class="checkbox">
              <nut-radiogroup v-model="vdata.grande" direction="horizontal">
                <nut-radio
                  shape="button"
                  :label="key.value"
                  v-for="(key, k) in vdata.gradeList"
                  :key="k"
                  >{{ key.text }}</nut-radio
                >
              </nut-radiogroup>
            </view>
          </view>
          <view class="item">
            <view class="gradeTitle">学期</view>
            <view class="checkboxs">
              <nut-radiogroup v-model="vdata.semester" direction="horizontal">
                <nut-radio
                  shape="button"
                  :label="key.value"
                  v-for="(key, k) in vdata.semesterList"
                  :key="k"
                  >{{ key.text }}</nut-radio
                >
              </nut-radiogroup>
            </view>
          </view>
          <view class="item items">
            <view class="gradeTitle">标签</view>
            <view class="labelListInfo">
              <view
                v-for="(item, i) in vdata.labelList"
                :key="i"
                :class="['labelItem', checkActive(item.tagId) && 'activeLabel']"
                @tap="optionsClick(item.tagId)"
              >
                {{ item.tagName }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="confirmBoxs">
        <view class="btn" @click="determine">确定</view>
      </view>
    </nut-popup>
  </view>
</template>
<script lang="ts" setup>
import { defineProps, reactive, defineEmits, watch, onMounted, defineExpose } from 'vue'
import Taro, { setNavigationBarTitle } from '@tarojs/taro'
import { tagList } from '@/api/wrongbook'

const emit = defineEmits(['handleChange'])
const props = defineProps({
  grande: '',
  term: '',
})
const vdata = reactive({
  showRound: false,
  semester: '',
  selectId: '',
  gradeList: [
    {
      text: '全部',
      value: '',
    },
    {
      text: '一年级',
      value: 1,
    },
    {
      text: '二年级',
      value: 2,
    },
    {
      text: '三年级',
      value: 3,
    },
    {
      text: '四年级',
      value: 4,
    },
    {
      text: '五年级',
      value: 5,
    },
    {
      text: '六年级',
      value: 6,
    },
    {
      text: '七年级',
      value: 7,
    },
    {
      text: '八年级',
      value: 8,
    },
    {
      text: '九年级',
      value: 9,
    },
    {
      text: '高一',
      value: 10,
    },
    {
      text: '高二',
      value: 11,
    },
    {
      text: '高三',
      value: 12,
    },
  ],
  semesterList: [
    {
      text: '全部',
      value: '',
    },
    {
      text: '上学期',
      value: 1,
    },
    {
      text: '下学期',
      value: 2,
    },
  ],
  grande: 1,
  labelList: [],
  chooseLabelList: [],
})

const determine = () => {
  emit('handleChange', vdata.grande, vdata.semester, vdata.chooseLabelList)
  vdata.showRound = false
}
const optionsClick = (value) => {
  if (vdata.chooseLabelList.indexOf(value) === -1) {
    // 当前数组中没有该值则push到数组
    vdata.chooseLabelList.push(value)
  } else {
    //当前数组中有该值，找到该值下标并删除
    vdata.chooseLabelList.splice(vdata.chooseLabelList.indexOf(value), 1)
  }
}
const checkActive = (value) => {
  return vdata.chooseLabelList.indexOf(value) !== -1
}
onMounted(() => {
  vdata.grande = props.grande
})
const popupShow = () => {
  getTagList()
  vdata.showRound = true
}
const getTagList = () => {
  tagList().then((res: any) => {
    if (res?.wrongQuestionTagDtoList && res?.wrongQuestionTagDtoList.length) {
      vdata.labelList = res.wrongQuestionTagDtoList
    }
  })
}
watch(
  () => props.grande,
  (val) => {
    vdata.grande = val == 0 ? '' : Number(val)
  }
)
watch(
  () => props.term,
  (val) => {
    vdata.semester = val == 0 ? '' : Number(val)
  }
)
defineExpose({
  popupShow,
})
</script>
<style lang="scss">
.heightPosition {
  .nut-overlay {
    // background: rgba(0, 0, 0, 0.1);
    z-index: 9999 !important;
  }
  .popup-bottom {
    // background: rgba(0, 0, 0, 0.1);
    z-index: 10000 !important;
  }
  //   position: relative;
  .gradePopup {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-bottom: 80px;
    box-sizing: border-box;
    .title {
      font-family: PingFangSC-Medium;
      font-size: 15px;
      font-weight: 600;
      line-height: 18px;
      color: #333333;
      padding: 20px 16px;
      border-bottom: 1px solid #efefef;
    }
    .grade {
      flex: 1;
      overflow-y: scroll;
      padding: 20px 15px;
      // height: 100%;
      .gradeTitle {
        font-family: PingFangSC-Medium;
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 20px;
      }
      .item {
        margin-bottom: 7px;
        overflow: hidden;
      }
      .items {
        margin-top: 24px;
        position: relative;
        .labelListInfo {
          margin-right: -18px;
          display: flex;
          flex-wrap: wrap;
          .labelItem {
            min-width: 70px;
            text-align: center;
            border-radius: 18px;
            background: #f5f5f5;
            height: 33px;
            line-height: 33px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #333333;
            margin-bottom: 14px;
            margin-right: 17px;
            box-sizing: border-box;
            padding: 0 10px;
          }
          .activeLabel {
            background: #e0eaff;
            color: #0256ff;
          }
        }
      }
      .checkbox {
        height: 210px;
        margin-right: -18px;
      }
      .nut-radiogroup--horizontal {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        height: 35px;
        .nut-radio {
          margin-right: 17px;
        }
        .nut-radio__button {
          height: 35px;
          background: #f5f5f5;
          font-size: 12px;
          border-radius: 18px;
          color: #333333;
          font-family: PingFangSC-Regular;
          // margin-bottom: 15px;
          width: 73px;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .nut-radio__button--active {
          background: #e0eaff;
          border: 0px solid transparent;
          font-size: 12px;
          // color: #1193ff;
          color: #0256ff;
        }
      }
    }
  }
  .confirmBoxs {
    left: 15px;
    right: 15px;
    height: 80px;
    background: #fff;
    position: fixed;
    bottom: 0;
    // padding: 0 16px;
    .btn {
      height: 40px;
      margin-top: 21px;
      line-height: 40px;
      border-radius: 20px;
      background: #0256ff;
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
}
</style>
