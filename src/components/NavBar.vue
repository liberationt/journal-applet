<template>
  <view
    class="nav-bar"
    :class="{ 'nav-bar-fixed': props.fixed }"
    :style="{
      height: `${navBarHeight}px`,
      paddingTop: `${statusBarHeight}px`,
      background: props.background,
      ...props.fixedStyle,
    }"
  >
    <view class="nav-bar-content">
      <view class="nav-bar-left">
        <slot name="left">
          <view :class="['icon-box', props.white && 'whiteColor']">
            <nut-icon
              name="rect-left"
              :size="`${props.iconSize ?? menuHeight / 1.8}px`"
              @click="onBack"
              v-if="pageLength > 1"
            ></nut-icon>
          </view>
          <view class="icon-box">
            <nut-icon
              v-if="homeShow"
              name="home"
              :size="`${props.iconSize ?? menuHeight / 1.8}px`"
              @click="onGoHome"
            ></nut-icon>
          </view>
        </slot>
      </view>
      <view class="nav-bar-center">
        <slot name="center">
          <view class="nav-bar-center-search" v-if="props.search">
            <nut-icon
              font-class-name="iconfont"
              class-prefix="icon"
              name="shaixuan"
              :size="20"
              @click="onFilterClick"
            />
            <nut-input :placeholder="props.placeholder" v-model="state.text" class="search-input" />
            <nut-icon
              font-class-name="iconfont"
              class-prefix="icon"
              name="sousuo1"
              :size="20"
              @click="onSearchClick"
            />
          </view>

          <view class="nav-bar-center-text" v-else>{{ props.title ?? params.pageTitle }}</view>
        </slot>
      </view>
      <view class="nav-bar-right">
        <slot name="right"> </slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Taro, { useRouter } from '@tarojs/taro'
import { defineProps, withDefaults, reactive, defineEmits, computed } from 'vue'
import { useSystem } from '@/stores'
const system = useSystem()
console.log()

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
    fixedStyle?: any
    white?: boolean
  }>(),
  {
    background: '',
    fixed: true,
    search: false,
    placeholder: '请输入',
    showHome: false,
    fixedStyle: {},
    white: false,
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

console.log('🚀 ~ file: NavBar.vue:41 ~ params', params)

const onGoHome = () => {
  Taro.navigateTo({ url: '/pages/index/index' })
}
const onBack = () => {
  if (props.onClickBack) return props.onClickBack()
  Taro.navigateBack({ delta: 1 })
}

const onFilterClick = () => {
  emit('click:filter')
}
const onSearchClick = () => {
  emit('click:search')
}
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
  .icon-box {
    padding: 5px;
    display: flex;
    align-items: center;
  }
  .whiteColor .nut-icon::before {
    color: #fff;
  }
}

.nav-bar-center {
  display: flex;
  align-items: center;
  height: 100%;
  text-align: center;
  font-size: 16px;
  .nav-bar-center-search {
    margin-left: px;
    display: flex;
    align-items: center;
    background: #f2f2f2;
    padding: 0 10px;
    height: 30px;
    border-radius: 5px;
    width: 230px;
  }
  .search-input {
    padding: 0;
    padding-left: 10px;
    padding-top: 4px;
    background: #f2f2f2;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
  }
}
.nav-bar-center-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // min-width: $navbar-title-width;
  font-size: 17px;
  // font-weight: $navbar-title-font-weight;
  // color: $navbar-title-font-color;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  font-family: PingFangSC-Medium;
  -webkit-line-clamp: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
