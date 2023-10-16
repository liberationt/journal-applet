import Taro from '@tarojs/taro'
import { INavBarInfo } from '@/types/system'
export function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]'
}

// 获取导航栏的高度等信息
export const getNavInfo = (): INavBarInfo => {
  // 获取系统状态栏高度

  const { statusBarHeight, screenHeight, windowHeight } = Taro.getSystemInfoSync()

  // 获取小程序右上角胶囊的大小

  const { height, top, right, width, left } = Taro.getMenuButtonBoundingClientRect()

  const navBarHeight =
    height + (top - (statusBarHeight as number)) * 2 + (statusBarHeight as number)

  return {
    navBarHeight,
    menuTop: top,
    menuRight: right,
    menuHeight: height,
    menuWidth: width,
    statusBarHeight,
    windowHeight,
    screenHeight,
  }
}
export const phoneType = () => {
  const { system } = Taro.getSystemInfoSync()
  if (system.indexOf('Android') > -1) {
    return true
  } else {
    return false
  }
}
export const getList = {
  1: '一年级',
  2: '二年级',
  3: '三年级',
  4: '四年级',
  5: '五年级',
  6: '六年级',
  7: '七年级',
  8: '八年级',
  9: '九年级',
  10: '高一',
  11: '高二',
  12: '高三',
}
export const getPeriodsNum = (val) => {
  let periods = ''
  if (val === 1) {
    periods = '第一期'
  } else if (val === 2) {
    periods = '第二期'
  } else if (val === 3) {
    periods = '第三期'
  } else if (val === 4) {
    periods = '第四期'
  } else if (val === 5) {
    periods = '第五期'
  } else if (val === 6) {
    periods = '第六期'
  } else if (val === 7) {
    periods = '第七期'
  } else if (val === 8) {
    periods = '第八期'
  } else if (val === 9) {
    periods = '第九期'
  } else if (val === 10) {
    periods = '第十期'
  } else if (val === 11) {
    periods = '第十一期'
  } else if (val === 12) {
    periods = '第十二期'
  } else if (val === 13) {
    periods = '第十三期'
  } else if (val === 14) {
    periods = '第十四期'
  } else if (val === 15) {
    periods = '第十五期'
  } else if (val === 16) {
    periods = '第十六期'
  } else if (val === 17) {
    periods = '第十七期'
  } else if (val === 18) {
    periods = '第十八期'
  } else if (val === 19) {
    periods = '第十九期'
  } else if (val === 20) {
    periods = '第二十期'
  } else if (val === 21) {
    periods = '第二十一期'
  } else if (val === 22) {
    periods = '第二十二期'
  } else if (val === 23) {
    periods = '第二十三期'
  } else if (val === 24) {
    periods = '第二十四期'
  }
  return periods
}
export function debounce(func: any, delay = 1000) {
  let timer: any = null
  return function (...args: any) {
    if (!timer) {
      func.apply(this, args)
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
    }, delay)
  }
}
