import { IUserState } from '@/types/user'
import { defineStore } from 'pinia'
import Taro from '@tarojs/taro'
import { getUserInfo, wxLogin, getMember } from '@/api/user'
import { setToken } from '@/utils/token'
const useUser = defineStore({
  /** 区分不通状态的唯一标识 */
  id: 'user',
  /** 状态 */
  state: (): IUserState => ({
    token: '', // token
    userInfo: {}, // 用户信息
    isLogining: 0, // 是否在登录
    vip: null,
    bookId: '',
    // roles: [], // 角色
  }),
  actions: {
    setVip(vip: Boolean) {
      this.vip = vip
    },
    setUserToken(token: string) {
      this.token = token
      setToken(token)
    },
    removeUserToken() {
      this.token = ''
      // removeToken()
    },
    setBookId(id) {
      this.bookId = id
    },
    async beginLogin() {
      if (this.token) {
        this.removeIsLogining()
        return await this.setUserInfo()
      }
      return new Promise<void>((resolve, reject) => {
        this.setIsLogining()
        Taro.login({
          success: (res: any) => {
            if (res.code) {
              wxLogin({ code: res.code })
                .then(async (data: any) => {
                  console.log(data)
                  this.setUserToken(data.token)
                  await this.setUserInfo()
                  resolve()
                })
                .catch((err) => {
                  this.removeIsLogining()
                  reject(err.msg)
                })
            } else {
              this.removeIsLogining()
              reject(res.errMsg)
            }
          },
        })
      })
    },
    // 获取用户信息
    async setUserInfo() {
      const userInfo: any = await getUserInfo()
      this.userInfo = userInfo
    },
    setIsLogining() {
      this.isLogining = 1
    },
    removeIsLogining() {
      this.isLogining = 0
    },
    // 查询并设置会员信息
    async fetchAndSetVip() {
      const res: any = await getMember()
      this.setVip(res)
    },
  },
})
export { useUser }
