import { getBaseUrl } from '@/api/url'
import axios, { AxiosRequestConfig, AxiosResponse } from 'taro-axios'
import Taro from '@tarojs/taro'

import { useUser } from '@/stores'
import { getToken } from '@/utils/token'
const instance = axios.create({
  // 超时时间 1 分钟
  timeout: 20 * 1000,
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

interface IUnionConfig extends AxiosRequestConfig {
  // 自定义配置
  selfConfig?: {
    needLoding?: boolean // 是否需要loading
    needToast?: boolean // 是否需要Toast
  }
}

let lodingFlag = false // 为true 表明有toast

const hideLoading = () => {
  if (lodingFlag) {
    Taro.hideLoading()
    lodingFlag = false
  }
}
instance.interceptors.request.use((config: IUnionConfig) => {
  const { selfConfig = {} } = config
  const { needLoding = true } = selfConfig

  if (needLoding) {
    lodingFlag = true
    Taro.showLoading({
      title: '加载中...',
    })
  }
  const user = useUser()
  // console.log(user.token, 999)
  const token = user.token || getToken()
  config.headers = {
    wxAccessToken: token,
    ...config.headers,
  }
  return config
})
// else if (response?.status === 200 && response?.data?.code === 401) {
// const user = useUser()
// await user.removeUserToken()
// await user.beginLogin()
// await user.fetchAndSetVip()
// }
instance.interceptors.response.use(
  async (response: any) => {
    const { selfConfig = {} } = response.config
    const { needToast = true } = selfConfig
    const resData = response.data
    if (response?.status === 200 && response?.data?.code === 0) {
      hideLoading()
      return resData.data
    } else if (response?.status === 200 && response?.data?.code === 401) {
      const user = useUser()
      await user.removeUserToken()
      await user.beginLogin()
      await user.fetchAndSetVip()
    } else {
      hideLoading()
      showToast(resData.msg, needToast)
      return Promise.reject(resData)
    }
  },
  async (error: any) => {
    const user = useUser()

    const { response } = error
    const { selfConfig = {} } = response.config
    const { needToast = true } = selfConfig
    if (response?.status === 401 || response?.data?.code === 401) {
      if (!user.isLogining) {
        // 清除token重新登录
        user.removeUserToken()
        // 标记正在登录
        user.setIsLogining()
        await user.beginLogin()
        // Taro.redirectTo({
        //   url: '/pages/index/index',
        // })
      }
    } else {
      // 其他情况 code 非 0 情况 有 message 就显示
      showToast(error?.data?.msg ?? error?.msg, needToast)
    }
    hideLoading()
    return Promise.reject(response.data)
  }
)

const showToast = (title: string, needToast) => {
  if (!title) return
  if (!needToast) return
  Taro.showToast({
    title,
    icon: 'none',
    duration: 3000,
  })
}

export default (params: IUnionConfig) => instance(params)
