// https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html

import Taro from '@tarojs/taro'

// taro上扩展企业微信
declare module '@tarojs/taro' {
  interface TaroStatic {
    qy: any
  }
}

declare const wx: object
