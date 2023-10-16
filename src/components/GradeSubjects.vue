<template>
  <view class="gradeSub" @tap="coloseMc">
    <view class="gradeMain" @tap.stop="!coloseMc">
      <view class="title">选择年级和科目</view>
      <view class="hsColor">错题将自动加入相应分类</view>
      <view class="grade" @tap="chooseGrade">
        <text v-if="vdata.selectText" class="blackColor">{{ vdata.selectText }}</text>
        <text v-else>请选择年级和科目</text>
        <text class="yjt"></text>
      </view>
      <view class="addLabel" @tap="addLabel" v-if="vdata.selectText">添加更多标签</view>
      <view
        :class="['submit', vdata.selectText && 'submitColor']"
        @tap="vdata.selectText && submit()"
        >确定</view
      >
    </view>
  </view>
  <nut-picker
    mode="multiSelector"
    v-model="vdata.selected"
    v-model:visible="vdata.showRound"
    :columns="vdata.selectList"
    @confirm="confirm"
  >
  </nut-picker>
  <!-- 标签 -->
  <view class="labelPup" v-if="vdata.showLabel">
    <nut-popup
      :style="{ height: `calc(100vh - ${navBarHeight}px)` }"
      position="bottom"
      v-model:visible="vdata.showLabel"
    >
      <LabelPopup
        @label-change="getLabelValue"
        :selectList="vdata.selected"
        :labelList="vdata.labelList"
      />
    </nut-popup>
  </view>
</template>

<script lang="ts" setup>
import { reactive, defineEmits } from 'vue'
import LabelPopup from '@/components/LabelPopup.vue'
import { courseKey, grandeKey, termKey } from '@/utils/common'
const emit = defineEmits(['saveBook', 'closeBook'])
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  showRound: false,
  selected: [],
  selectText: '',
  showLabel: false,
  selectList: [
    [
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
    [
      {
        text: '语文',
        value: 1,
      },
      {
        text: '数学',
        value: 2,
      },
      {
        text: '英语',
        value: 3,
      },
      {
        text: '物理',
        value: 4,
      },
      {
        text: '化学',
        value: 5,
      },
      {
        text: '生物',
        value: 6,
      },
      {
        text: '政治',
        value: 7,
      },
      {
        text: '历史',
        value: 8,
      },
      {
        text: '地理',
        value: 9,
      },
      {
        text: '科学',
        value: 10,
      },
      {
        text: '其它',
        value: 11,
      },
    ],

    [
      {
        text: '上学期',
        value: 1,
      },
      {
        text: '下学期',
        value: 2,
      },
    ],
  ],
  subjectText: '',
  labelList: [],
})
const confirm = (val) => {
  const { selectedOptions, selectedValue } = val
  vdata.selected = selectedValue
  vdata.selectText =
    selectedOptions[0].text + '/' + selectedOptions[1].text + '/' + selectedOptions[2].text
  vdata.subjectText = selectedOptions[1].text
}
const chooseGrade = () => {
  vdata.showRound = true
}
const submit = () => {
  emit('saveBook', vdata.selected, vdata.subjectText, vdata.labelList)
}
const addLabel = () => {
  vdata.showLabel = true
}
const getLabelValue = (val1, val2, val3, labelList) => {
  vdata.labelList = labelList
  vdata.showLabel = false
  vdata.selected = [val2, val1, val3]
  vdata.selectText = `${grandeKey[val2]}/${courseKey[val1]}/${termKey[val3]}`
}
const coloseMc = () => {
  emit('closeBook')
}
</script>
<style lang="scss">
.gradeSub {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  .gradeMain {
    position: absolute;
    left: 22px;
    right: 22px;
    border-radius: 18px;
    top: 240px;
    background: #fff;
    padding: 26px 22px;
    box-sizing: border-box;
    font-family: PingFangSC-Semibold;
    text-align: center;
    .title {
      font-size: 18px;
      margin-bottom: 8px;
    }
    .hsColor {
      color: #999999;
      font-weight: normal;
      margin-bottom: 19px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
    }
    .grade {
      height: 49px;
      border-radius: 10px;
      background: rgba(196, 196, 196, 0.1);
      line-height: 49px;
      margin-bottom: 20px;
      text-align: left;
      text-indent: 19px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      color: #c7c7c7;
      position: relative;
      .blackColor {
        font-size: 16px;
        color: #333;
      }
      .yjt {
        display: block;
        position: absolute;
        right: 22px;
        top: 50%;
        margin-top: -3px;
        width: 6px;
        height: 6px;
        background-color: transparent; /* 模块背景为透明 */
        border-color: #555;
        border-style: solid;
        border-width: 2px 2px 0 0;
        transform: rotate(135deg); /*箭头方向可以自由切换角度*/
      }
    }
    .addLabel {
      margin: 20px 0;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #0256ff;
    }
    .submit {
      height: 44px;
      border-radius: 26px;
      opacity: 1;
      background: #eeeeee;
      text-align: center;
      line-height: 44px;
      color: #999999;
    }
    .submitColor {
      background: #0256ff;
      color: #fff;
    }
  }
  .labelPup {
    .popup-bottom {
      // background: rgba(0, 0, 0, 0.1);
      z-index: 1000 !important;
      padding: 10px 15px 0;
      box-sizing: border-box;
    }
    .nut-overlay {
      position: static;
    }
  }
}
</style>
