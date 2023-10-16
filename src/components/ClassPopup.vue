<template>
  <view>
    <nut-picker
      v-model="vdata.value"
      v-model:visible="vdata.visible"
      :columns="multipleColumns"
      :title="props.title"
      @confirm="confirm"
      @change="change"
      @close="close"
    >
    </nut-picker>
  </view>
</template>
<script setup lang="ts">
import { reactive, defineEmits, withDefaults, ref, onMounted, watch } from 'vue'
const emit = defineEmits(['handleChange', 'close'])
const props = defineProps({
  value: [],
  visible: '',
})
const vdata = reactive({
  visible: false,
  value: [],
  selectedValue: [],
  selectedOptions: [],
})
const multipleColumns = ref([
  [
    {
      text: '全部',
      value: 0,
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
  [
    { text: '全部', value: 0, label: '' },
    { text: '上学期', value: 1, label: '上' },
    { text: '下学期', value: 2, label: '下' },
  ],
])
const change = () => {}
const confirm = ({ selectedValue, selectedOptions }) => {
  vdata.selectedValue = selectedValue
  vdata.selectedOptions = selectedOptions
  vdata.value = selectedValue
  vdata.visible = false
  emit('handleChange', vdata.selectedValue, vdata.selectedOptions)
}
const close = () => {
  emit('close')
}
// 监听属性
watch(
  () => props.visible,
  (newVal) => {
    vdata.visible = props.visible
  }
)
// 监听属性
watch(
  () => props.value,
  (newVal) => {
    vdata.value = props.value
  }
)
</script>
<style lang="scss"></style>
