<template>
  <cover-view
    class="nav-bar"
    :class="{ 'nav-bar-fixed': props.fixed }"
    :style="{
      height: `${navBarHeight}px`,
      paddingTop: `${statusBarHeight}px`,
      background: props.background,
      ...props.fixedStyle,
    }"
  >
    <cover-view class="nav-bar-content">
      <cover-view class="nav-bar-left">
        <slot name="left"> </slot>
      </cover-view>

      <cover-view class="nav-bar-center">
        <slot name="center"> </slot>
      </cover-view>

      <cover-view class="nav-bar-right">
        <slot name="right"> </slot>
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script lang="ts" setup>
import Taro, { useRouter } from '@tarojs/taro'
import { defineProps, withDefaults, reactive, defineEmits, computed } from 'vue'
import { useSystem } from '@/stores'
const system = useSystem()
const pageLength = Taro.getCurrentPages().length // 页面栈长度
const { navBarHeight, statusBarHeight, menuHeight } = system.navBarInfo
const props = withDefaults(
  defineProps<{
    background?: string // 背景色
    iconSize?: Number // 图标大小
    onClickBack?: Function // 点击返回事件
    title?: string // 标题
    fixed?: boolean
    search?: boolean
    placeholder?: string
    showHome?: boolean // 展示home按钮
    fixedStyle?: Object
    white?: String
  }>(),
  {
    background: '',
    fixed: true,
    search: false,
    placeholder: '请输入',
    showHome: false,
    fixedStyle: {},
    white: '',
  }
)

const state = reactive({
  text: '',
})

// 展示home按钮
const homeShow = computed(() => {
  return pageLength > 1 && props.showHome
})
const emit = defineEmits(['click:filter', 'click:search'])

const { params } = useRouter()
</script>

<style lang="scss">
.nav-bar {
  box-sizing: border-box;
  // border-bottom: 1rpx solid #f8f8f8;
  &.nav-bar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
  }
}
.nav-bar-content {
  display: flex;
  position: relative;
  height: 100%;
}
.nav-bar-left {
  padding: 0 10px 0 10px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  align-items: center;
}
.nav-bar-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  font-size: 16px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .slPng {
    width: 70px;
    height: 32px;
  }
}
.left {
  .closeImg {
    width: 30px;
    height: 30px;
  }
}
// .center {
//   position: absolute;
//   left: 50%;
//   transform: translateX(-50%);
//   .slPng {
//     width: 70px;
//     height: 35px;
//     z-index: 100;
//   }
// }
</style>
