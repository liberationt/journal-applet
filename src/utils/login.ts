import Taro from '@tarojs/taro'
import { ISLOGINING } from '@/utils/constants'

// 设置正在登录缓存表示
export const setIsLogining = () => {
  Taro.setStorageSync(ISLOGINING, 1)
}

export const removeIsLogining = () => {
  Taro.removeStorageSync(ISLOGINING)
}

export const getIsLogining = () => {
  return Taro.getStorageSync(ISLOGINING)
}
