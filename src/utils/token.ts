import Taro from '@tarojs/taro'
import { TOKEN } from './constants.js'
export function setToken(token) {
  return Taro.setStorageSync(TOKEN, token)
}

export function getToken() {
  return Taro.getStorageSync(TOKEN)
}
export function removeToken() {
  return Taro.removeStorageSync(TOKEN)
}
