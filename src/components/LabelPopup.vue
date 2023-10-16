<template>
  <view class="LabelPopup">
    <view class="item">
      <view class="title">学科<text class="redColor">(必选)</text></view>
      <view>
        <nut-radiogroup v-model="vdata.grande" direction="horizontal">
          <nut-radio
            shape="button"
            :label="key.value"
            v-for="(key, k) in vdata.grandeList"
            :key="k"
            >{{ key.text }}</nut-radio
          >
        </nut-radiogroup>
      </view>
    </view>
    <view class="item">
      <view class="title">年级<text class="redColor">(必选)</text></view>

      <view>
        <nut-radiogroup v-model="vdata.class" direction="horizontal">
          <nut-radio
            shape="button"
            :label="key.value"
            v-for="(key, k) in vdata.classList"
            :key="k"
            >{{ key.text }}</nut-radio
          >
        </nut-radiogroup>
      </view>
    </view>
    <view class="item">
      <view class="title">学期<text class="redColor">(必选)</text></view>
      <view>
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
      <view class="title">标签</view>
      <view class="labelListInfo">
        <view
          v-for="(item, i) in vdata.labelList"
          :key="i"
          :class="['labelItem', checkActive(item.tagId) && 'activeLabel']"
          @tap="optionsClick(item.tagId)"
        >
          {{ item.tagName }}
          <image
            v-if="i > 5"
            @tap.stop="removeTag(item.tagId)"
            class="closeImg"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/f4cab8dee5724e7080db5dc18837f569/navbar_search_clean.png"
          />
        </view>
        <view
          class="labelItem"
          @tap="showAddLable"
          v-if="vdata.labelList && vdata.labelList.length <= 16"
          >+添加标签</view
        >
      </view>
    </view>
    <view class="footerBtn">
      <view class="btn" @click="determine">确定</view>
    </view>
    <view v-if="vdata.showAddLable" class="toastBg">
      <view class="toastInfo">
        <view class="contentText">
          <view>新建标签</view>
          <image
            @tap="cancel"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/07cde7ced8204436a4031b97626eb555/close.png"
          />
        </view>
        <view class="inputText">
          <input
            placeholder="请输入标签"
            type="text"
            :value="vdata.labelText"
            :focus="true"
            @input="getText"
            :selectionStart="100"
            :selectionEnd="100"
            :maxlength="8"
          />
          <view class="textLen">{{ vdata.labelText.length || 0 }}/8</view>
        </view>
        <view class="contentBtn">
          <view class="cancel" @tap="cancel">取消</view>
          <view class="confirm" @tap="confirm"> 确认 </view>
        </view>
      </view>
    </view>
    <view v-if="vdata.showDelete" class="toastBg">
      <view class="toastInfoDelete">
        <view class="contentText"> 确认删除标签吗？ </view>
        <view class="deleteBtn">
          <view class="cancel" @tap="vdata.showDelete = false">取消</view>
          <view class="confirm" @tap="deleteList"> 确认 </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { reactive, defineEmits, onMounted } from 'vue'
import { addTag, tagList, deleteTag } from '@/api/wrongbook'
const emit = defineEmits(['labelChange'])
const props = defineProps({
  selectList: {
    type: Array,
    default() {
      return []
    },
  },
  labelList: {
    type: Array,
    default() {
      return []
    },
  },
  currentGrade: {
    type: [Number, String],
    default: '',
  },
  currentSubject: {
    type: [Number, String],
    default: '',
  },
  currentTerm: {
    type: [Number, String],
    default: '',
  },
})
const vdata: any = reactive({
  class: '',
  grande: '',
  semester: '',
  timer: '',
  showAddLable: false,
  labelText: '',
  showDelete: false,
  grandeList: [
    // {
    //   text: '全部',
    //   value: 0,
    // },
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
  classList: [
    // {
    //   text: '全部',
    //   value: 0,
    // },
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
    // {
    //   text: '全部',
    //   value: 0,
    // },
    {
      text: '上学期',
      value: 1,
    },
    {
      text: '下学期',
      value: 2,
    },
  ],
  labelList: [],
  chooseLabelList: [],
  tagId: '',
})
const showAddLable = () => {
  vdata.showAddLable = true
}
const determine = () => {
  emit('labelChange', vdata.grande, vdata.class, vdata.semester, vdata.chooseLabelList)
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
const getText = (e) => {
  if (e.detail.value) {
    vdata.labelText = e.detail.value.replace(/\s+/g, '')
  } else {
    vdata.labelText = ''
  }
}
const cancel = () => {
  vdata.labelText = ''
  vdata.showAddLable = ''
}
const confirm = () => {
  if (!vdata.labelText) return
  addTag({ tagName: vdata.labelText }).then((res) => {
    if (res) {
      cancel()
      getTagList()
    }
  })
}
const removeTag = (tagId) => {
  vdata.tagId = tagId
  vdata.showDelete = true
}
const deleteList = () => {
  deleteTag({ tagId: vdata.tagId }).then((res) => {
    vdata.showDelete = false
    vdata.chooseLabelList.splice(vdata.chooseLabelList.indexOf(vdata.tagId), 1)
    getTagList()
  })
}
const checkActive = (value) => {
  return vdata.chooseLabelList.indexOf(value) !== -1
}
const getTagList = () => {
  tagList().then((res: any) => {
    if (res?.wrongQuestionTagDtoList && res?.wrongQuestionTagDtoList.length) {
      vdata.labelList = res.wrongQuestionTagDtoList
    }
  })
}
onMounted(() => {
  if (props.selectList.length) {
    vdata.grande = props.selectList[1]
    vdata.class = props.selectList[0]
    vdata.semester = props.selectList[2]
  }
  if (props.labelList.length) {
    vdata.chooseLabelList = props.labelList
  }
  if (props.currentGrade) {
    vdata.class = props.currentGrade
    console.log(vdata.class, 999)
  }
  if (props.currentSubject) {
    vdata.grande = props.currentSubject
    console.log(vdata.grande, 999)
  }
  if (props.currentTerm) {
    vdata.semester = props.currentTerm
    console.log(vdata.semester, 999)
  }
  getTagList()
})
</script>
<style lang="scss">
.LabelPopup {
  padding: 20px 18px 80px;
  box-sizing: border-box;
  .item {
    overflow: hidden;
    .title {
      display: flex;
      align-items: center;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 16px;
      .redColor {
        color: #e76767;
        font-size: 12px;
        font-weight: normal;
        margin-left: 3px;
      }
    }
    .nut-radio {
      margin-bottom: 15px;
    }
    .nut-radiogroup--horizontal {
      width: 100%;
      display: flex;
      // justify-content: space-between;
      justify-content: flex-start;
      flex-wrap: wrap;
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
    .nut-radio:last-child {
      //   margin-bottom: 5px !important;
      //   margin-right: 10px !important;
      margin-bottom: 15px !important;
      margin-right: 10px !important;
    }
  }
  .items {
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
        position: relative;
        .closeImg {
          position: absolute;
          width: 16px;
          height: 16px;
          right: -4px;
          top: -3px;
        }
      }
      .activeLabel {
        background: #e0eaff;
        color: #0256ff;
      }
    }
  }
  // .btn {
  //   height: 44px;
  //   margin-top: 21px;
  //   line-height: 44px;
  //   border-radius: 20px;
  //   background: #0256ff;
  //   text-align: center;
  //   font-size: 16px;
  //   font-weight: 500;
  //   color: #ffffff;
  //   position: fixed;
  //   bottom: 25px;
  //   right: 15px;
  //   left: 15px;
  // }
  .footerBtn {
    position: fixed;
    bottom: 0px;
    right: 0px;
    left: 0px;
    height: 90px;
    background: #fff;
    .btn {
      height: 44px;
      margin: 21px 15px 0;
      line-height: 44px;
      border-radius: 20px;
      background: #0256ff;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
    }
  }
  .toastBg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999 !important;
    background: rgba(0, 0, 0, 0.6);
  }
  .toastInfo {
    top: 30%;
    background: #fff;
    width: 330px;
    // height: 163px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 18px;
    padding: 21px;
    // text-align: center;
    .contentText {
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      color: #333333;
      text-align: center;
      position: relative;
      image {
        width: 22px;
        height: 22px;
        position: absolute;
        right: 0;
        top: 2px;
      }
    }
    .inputText {
      width: 289px;
      height: 49px;
      border-radius: 10px;
      opacity: 1;
      background: #f4f7f9;
      margin: 16px 0 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      .h5-input {
        font-size: 14px;
      }
      .input-placeholder {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        font-weight: normal;
        color: #c7c7c7;
      }
      .textLen {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #cccccc;
      }
    }
    .contentBtn {
      display: flex;
      justify-content: space-between;
      view {
        width: 138px;
        height: 40px;
        box-sizing: border-box;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: #2f5de7;

        border-radius: 23px;
      }
      .cancel {
        border: 1px solid #2f5de7;
        line-height: 38px;
      }
      .confirm {
        background: #2f5de7;
        color: #fff;
        line-height: 40px;
      }
    }
  }
  .toastInfoDelete {
    top: 50%;
    background: #fff;
    width: 280px;
    // height: 163px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 18px;
    padding: 31px 22px 22px;
    .contentText {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      text-align: center;
      color: #333333;
      margin-bottom: 25px;
    }
    .deleteBtn {
      display: flex;
      justify-content: space-between;
      view {
        width: 112px;
        height: 40px;
        box-sizing: border-box;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: #2f5de7;

        border-radius: 20px;
      }
      .cancel {
        border: 1px solid #2f5de7;
        line-height: 38px;
      }
      .confirm {
        background: #2f5de7;
        color: #fff;
        line-height: 40px;
      }
    }
  }
}
</style>
