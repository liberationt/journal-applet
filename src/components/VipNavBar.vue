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
      <view class="nav-bar-centers">
        <slot name="center">
          <view :class="['yt', props.type == 1 && 'bg']" @tap="changeVip(1)">原图</view>
          <view :class="['vip', props.type == 2 && 'bg']" @tap="changeVip(2)">擦除笔迹</view>
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
    fixedStyle?: Object
    white: ''
    type?: Number
  }>(),
  {
    background: '',
    fixed: true,
    search: false,
    placeholder: '请输入',
    showHome: false,
    fixedStyle: {},
    white: '',
    type: 2,
  }
)

const state = reactive({
  text: '',
})

// 展示home按钮
const homeShow = computed(() => {
  return pageLength > 1 && props.showHome
})
const emit = defineEmits(['vipclick', 'click:search'])

const { params } = useRouter()

console.log('🚀 ~ file: NavBar.vue:41 ~ params', params)

const onGoHome = () => {
  Taro.navigateTo({ url: '/pages/index/index' })
}
const onBack = () => {
  if (props.onClickBack) return props.onClickBack()
  Taro.navigateBack({ delta: 1 })
}

const changeVip = (type) => {
  emit('vipclick', type)
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

.nav-bar-centers {
  display: flex;
  align-items: center;
  height: 100%;
  text-align: center;
  font-size: 16px;
  border-radius: 25px;
  background: #ededed;
  // width: 143px;
  height: 30px;
  box-sizing: border-box;
  padding: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .yt,
  .vip {
    padding: 0 14px;
    font-family: PingFangSC-Semibold;
    font-size: 13px;
    height: 100%;
    line-height: 24px;
    border-radius: 25px;
    color: #999999;
  }
  .bg {
    background: #fff;
    color: #333333;
  }
}
</style>
