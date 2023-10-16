<template>
  <view></view>
</template>
<script setup lang="ts">
import { setupStore, useSystem, useUser } from '@/stores'
import { getMember, firstEntry } from '@/api/user'
import { getNavInfo } from '@/utils/index'
import Taro, { useDidShow, useLoad } from '@tarojs/taro'
const user = useUser()
useDidShow(() => {
  if (user.token) {
    if (user.userInfo.hasAuth) {
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
  }

  // const system = useSystem()
  // const navInfo = getNavInfo()
  // system.init({}, navInfo)
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
})
useLoad((option) => {
  // if (options.hasOwnProperty('q') && options.q) {
  // 通过下面这步解码，可以拿到url的值
  if (option && option.q) {
    const url = decodeURIComponent(option.q)
    if (url) {
      let arrList = url.split('/')
      if (arrList.length) {
        let bookId = arrList[arrList.length - 1] || ''
        user.setBookId(bookId)
      }
    }
  }
})
</script>
