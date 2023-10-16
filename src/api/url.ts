// https://github.com/Yill625/express-demo 接口项目地址
export const mockUrl = 'https://test.yiliangliang.cn'

export const getBaseUrl = (): string => {
  let url = ''
  console.log('🚀 ~ file: url.ts:16 ~ getBaseUrl ~ process.env.NODE_ENV:', process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
    url = 'https://journal.dev.dcrayssh.cn/northern-journal'
    // 滕皆敏ip
    // url = 'http://10.21.10.127:8191/northern-journal'
    // 杨春涛ip
    // url = 'http://10.21.10.234:8191/northern-journal'
  } else if (process.env.NODE_ENV === 'stage') {
    url = 'https://journal.dev.dcrayssh.cn/northern-journal'
  } else {
    url = 'https://journal.dcrayssh.cn/northern-journal'
  }
  return url
}

/**
 * @description 获取webviewH5域名
 */

export function getWebviewDomain() {
  let url = ''

  if (process.env.NODE_ENV === 'development') {
    url = 'https://journal.h5.dcrayssh.cn'
  } else if (process.env.NODE_ENV === 'stage') {
    url = 'https://journal.pro.dcrayssh.cn'
  } else {
    url = 'https://journal.pro.dcrayssh.cn'
  }
  return url
}
