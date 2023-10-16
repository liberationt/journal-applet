<template>
  <nut-cascader
    title="地址选择"
    v-model:visible="state.visible"
    v-model="state.value"
    text-key="text"
    value-key="text"
    @change="change"
    :options="dataList"
  ></nut-cascader>
  <!-- <nut-picker
    v-model:visible="state.visible"
    v-model="state.value"
    :columns="dataList"
    title="城市选择"
    @confirm="confirm"
    @change="change"
  ></nut-picker> -->
</template>
<script lang="ts" setup>
import { reactive, defineEmits, defineExpose, onMounted, defineProps, watch } from 'vue'
import { dataList } from '@/assets/address/index'
const emit = defineEmits('handleChange')
const props = defineProps({
  areas: [],
})
const state = reactive({
  visible: false,
  value: [],
})
const addressShow = () => {
  state.visible = true
}
const change = (val) => {
  if (val && val.length) {
    state.value = val
    emit('handleChange', val)
  }
}
onMounted(() => {})
watch(
  () => props.areas,
  (val: any) => {
    if (val.length) {
      state.value = val
    }
  }
)
defineExpose({
  addressShow,
})
</script>
<style lang="scss">
.nut-cascader__popup {
  .nut-popup__close-icon {
    text {
      width: 24px !important;
      height: 24px !important;
      color: #333;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
