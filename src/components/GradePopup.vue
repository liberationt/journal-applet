<template>
  <view class="gradePopupMain">
    <nut-popup
      round
      position="bottom"
      closeable
      :style="{ height: '610px' }"
      :close-on-click-overlay="false"
      v-model:visible="vdata.showRound"
    >
      <view>
        <view class="gradePopup">
          <view class="title">选择年级</view>
          <view class="grade">
            <view class="item" v-for="(item, i) in vdata.gradeList" :key="i">
              <view class="gradeTitle">{{ item.title }}</view>
              <nut-radiogroup
                v-model="vdata.grande"
                direction="horizontal"
                @change="(value) => handleChange(value, item, i)"
              >
                <nut-radio
                  shape="button"
                  :label="key.value"
                  v-for="(key, k) in item.grade"
                  :key="k"
                  >{{ key.text }}</nut-radio
                >
              </nut-radiogroup>
            </view>
          </view>
        </view>
        <view class="confirmBox">
          <view class="btn" @click="determine">确定</view>
        </view>
      </view>
    </nut-popup>
  </view>
</template>
<script lang="ts" setup>
import { defineProps, reactive, defineEmits, onMounted } from 'vue'
import Taro, { setNavigationBarTitle } from '@tarojs/taro'

const emit = defineEmits(['handleChange'])
const props = defineProps({
  grande: '',
})
const vdata = reactive({
  showRound: false,
  selectId: '',
  gradeList: [
    {
      title: '小学',
      grade: [
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
      ],
    },
    {
      title: '中学',
      grade: [
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
      ],
    },
    {
      title: '高中',
      grade: [
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
    },
  ],
  grande: 1,
})
const handleChange = (value: any, item: any, i: Number) => {
  const grand = item.grade.filter((v) => v.value === value)
  if (grand && grand.length) {
    const grand = item.grade.filter((v) => v.value === value)
    vdata.selectId = value
  }
}
const determine = () => {
  if (!vdata.selectId)
    return Taro.showToast({
      title: '',
      icon: 'none',
      duration: 1000,
    })
  emit('handleChange', [vdata.selectId])

  vdata.showRound = false
}
onMounted(() => {
  vdata.grande = props.grande
})
const popupShow = (code) => {
  vdata.grande = code
  vdata.showRound = true
}
defineExpose({
  popupShow,
})
</script>
<style lang="scss">
.gradePopup {
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
    padding: 20px 25px;
    .gradeTitle {
      font-family: PingFangSC-Medium;
      font-size: 15px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 20px;
    }
    .item {
      margin-bottom: 7px;
    }
    .nut-radiogroup--horizontal {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .nut-radio {
        margin-right: 0;
      }
      .nut-radio__button {
        height: 35px;
        background: #f5f5f5;
        font-size: 13px;
        border-radius: 18px;
        color: #333333;
        font-family: PingFangSC-Regular;
        margin-bottom: 15px;
        width: 93px;
        align-items: center;
        justify-content: center;
      }
      .nut-radio__button--active {
        background: #e0eaff;
        border: 0px solid transparent;
        font-size: 13px;
        color: #0256ff;
      }
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

.gradePopupMain {
  .nut-icon {
    font-weight: 700;
    color: #000;
  }
  .nut-overlay {
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
