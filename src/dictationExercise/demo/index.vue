<template>
  <view class="dictationExercise" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="" />
    <view class="bg" :animation="vdata.animation">测试</view>
    <view @tap="create" style="margin-top: 50px">事件</view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { reactive, ref, onMounted } from 'vue'
const activeNames = reactive([1])
const versionBook = ref()
const vdata = reactive({
  animation: {},
  isShow: false,
})
const create = () => {
  Taro.navigateTo({
    url: '../webView/index',
  })
}
onMounted(() => {})
</script>
<style lang="scss">
.bg {
  background: red;
  width: 100px;
  height: 100px;
}
</style>
