import { createApp } from 'vue'
import setNutUi from './nutui'
import { setupStore, useSystem, useUser } from '@/stores'
import { getMember, firstEntry } from '@/api/user'
import './app.scss'
// import { removeIsLogining } from '@/utils/login'
import { getNavInfo } from '@/utils/index'
import Taro from '@tarojs/taro'
const App = createApp({
  // 可以使用所有的 Vue 生命周期方法
  mounted() {},

  // 对应 onLaunch
  async onLaunch(options) {
    Taro.setStorageSync('isPdfBack', false)
    const system = useSystem()
    const navInfo = getNavInfo()
    system.init(options, navInfo)
    const user = useUser()
    user.removeIsLogining()
    await user.beginLogin()

    // if (process.env.NODE_ENV !== 'development') {
    // 不是发环境直接跳过
    await getMember().then((res: any) => {
      user.setVip(res)
      if (res) {
        if (user.userInfo?.userType) {
          Taro.switchTab({
            url: '/pages/index/index',
          })
        } else {
          Taro.redirectTo({
            url: '/phaseOne/pages/identity/index',
          })
        }
      } else {
        Taro.redirectTo({
          url: '/phaseOne/pages/activateMember/index',
        })
      }
    })
    // }
  },

  // 对应 onShow
  onShow() {
    Taro.setStorageSync('camera', 1)
    if (Taro.getStorageSync('camera')) {
      Taro.removeStorageSync('camera')
    }
    // if (Taro.getStorageSync('isPdfBack')) return
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        // 请求完新版本信息的回调
        updateManager.onUpdateReady(function () {
          Taro.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',

            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            },
          })
        })

        updateManager.onUpdateFailed(function () {
          Taro.showModal({
            // 新的版本下载失败

            title: '已经有新版本了哟~',

            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
          })
        })
      }
    })

    // const user = useUser()
    // if (user.userInfo?.id) {
    //   return
    // }
    // user.removeIsLogining()
    // await user.beginLogin()
    // await getMember().then((res: any) => {
    //   user.setVip(res)
    //   if (res) {
    //     if (user.userInfo?.userType) {
    //       Taro.switchTab({
    //         url: '/pages/index/index',
    //       })
    //     } else {
    //       Taro.redirectTo({
    //         url: '/phaseOne/pages/identity/index',
    //       })
    //     }
    //   } else {
    //     Taro.redirectTo({
    //       url: '/phaseOne/pages/activateMember/index',
    //     })
    //   }
    // })

    // const user = useUser()
    // user.removeIsLogining()
    // const user = useUser()
    // user.removeIsLogining()
    // await user.beginLogin()
    // await getMember().then((res: any) => {
    //   user.setVip(res)
    //   if (res) {
    //     if (user.userInfo?.userType) {
    //       Taro.switchTab({
    //         url: '/pages/index/index',
    //       })
    //     } else {
    //       Taro.redirectTo({
    //         url: '/phaseOne/pages/identity/index',
    //       })
    //     }
    //   } else {
    //     Taro.redirectTo({
    //       url: '/phaseOne/pages/activateMember/index',
    //     })
    //   }
    // })
  },

  // 对应 onHide
  onHide() {
    // Taro.setStorageSync('isPdfBack', false)
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
setNutUi(App)
setupStore(App)
export default App
