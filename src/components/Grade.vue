<template>
  <view class="grade">
    <view v-for="(item, i) in vdata.gradeList" :key="i">
      <view class="gradeTitle">{{ item.title }}</view>
      <nut-radiogroup
        v-model="vdata.grande"
        direction="horizontal"
        @change="(value) => handleChange(value, item, i)"
      >
        <nut-radio shape="button" :label="key.value" v-for="(key, k) in item.grade" :key="k">{{
          key.text
        }}</nut-radio>
      </nut-radiogroup>
    </view>
  </view>
</template>
<script setup lang="ts">
// import { Radio, RadioGroup, Icon } from '@nutui/nutui-taro'
import { reactive, defineEmits, onMounted, watch } from 'vue'
const emit = defineEmits(['handleChange'])
const props = defineProps({
  grande: '',
})
const vdata = reactive({
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
  grande: '',
})
const handleChange = (value: any, item: any) => {
  console.log(12345)
  const grand = item.grade.filter((v) => v.value === value)
  if (grand && grand.length) {
    const grand = item.grade.filter((v) => v.value === value)
    vdata.grande = value
    emit('handleChange', [value, grand[0].text])
  }
}
watch(
  () => props.grande,
  (newVal) => {
    vdata.grande = props.grande
  }
)
onMounted(() => {
  vdata.grande = props.grande
})
</script>
<style lang="scss">
.gradeTitle {
  font-family: PingFangSC-Medium;
  font-size: 15px;
  font-weight: 800;
  color: #333333;
  margin-bottom: 20px;
}
.grade .nut-radiogroup--horizontal {
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
    color: #fff;
    background: #2f5de7;
  }
}
</style>
