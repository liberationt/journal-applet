<template>
  <scroll-view class="scroll-view_H" :scroll-y="true" style="height: 100vh" @scroll="scroll">
    <view class="mainContent" :style="{ paddingTop: `${navBarHeight + 15}px` }">
      <view></view>
      <NavBar :title="'教育期刊'" :fixedStyle="vdata.fixedStyle" />
      <view class="userInfo" :class="{ margin50: vdata.scrollTop }" v-show="user.userInfo.nickName">
        <view class="userLeft" @tap="toMember">
          <view class="defaultImg">
            <image
              v-if="!user.userInfo.portraitUrl"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/b2c0d521a4444e64ae6a91fb452532dc/defaultImg.png"
            />
            <image v-else :src="user.userInfo.portraitUrl" />
          </view>
          <view class="leftRight">
            <view class="textInfo">
              <view v-if="user.userInfo.nickName">{{ getNickName() }}</view>
              <view class="jb">
                <image
                  :src="
                    user.vip
                      ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/bdd6726ebdbe48fcb8aa3c7957da1f6d/kt.png'
                      : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/b82cc93d1c884ca487a0a36e780d56fd/wkt.png'
                  "
                />
              </view>
            </view>
            <view class="memberTime">
              <text>{{ user.userInfo.vipHint }}</text>
            </view>
          </view>
          <view v-if="!user.vip" @tap.stop="toTransactions" class="openMember">
            <view class="openTitle">开通会员</view>
          </view>
          <view v-else @tap="toMember" class="toMember">
            <nut-icon name="rect-right" color="#666666"></nut-icon>
          </view>
        </view>
      </view>

      <view class="subjectBox" :class="{ fixedScroll: vdata.scrollTop }">
        <view class="box" v-for="(item, index) in vdata.subjectList" :key="index">
          <view @tap="subjectChange(item)">{{ item.name }}</view>
          <image
            v-show="vdata.subjectId == index + 1"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/ddf92e5ebec94a98bc79ef361d664588/subjectSelect.png"
          ></image>
        </view>
      </view>
      <language
        @getSetting="getSetting"
        :dataInfoObj="vdata.dataInfoObj"
        @weeklyChange="weeklyChange"
      ></language>
      <nut-overlay
        v-model:visible="vdata.camera"
        :lock-scroll="true"
        @click="hideOverlay"
        :overlay-style="vdata.overlayStyle"
      >
        <view class="cameraMain">
          <view class="title">相机权限</view>
          <view>请在「设置」选项中</view>
          <view>允许小程序访问您的摄像头</view>
          <view class="authSetting" @tap="setCamera">去开启摄像头权限</view>
        </view>
      </nut-overlay>

      <nut-overlay
        v-model:visible="vdata.sign"
        :lock-scroll="true"
        :close-on-click-overlay="false"
        :overlay-style="vdata.overlayStyle"
      >
        <view class="signMain">
          <view class="brand card1" :animation="vdata.animation1">
            <view class="closeBg" @click="closeSign">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/09422f521fdd4f3bbd31f1a9a62bd6ee/close.png"
                mode="scaleToFill"
              />
            </view>
            <view class="signToast">
              <view class="signTop">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/01ac9e5c40bb410e8bc9cbd7358573ce/sign.png"
                  mode="scaleToFill"
                />
              </view>
              <view class="title">学习打卡</view>
              <view class="timer"
                >期刊已陪伴您{{ user.userInfo.accompanyDays || 0 }}天，快来学习打卡吧</view
              >
              <view class="submit" @tap="signConfig">立即打卡</view>
            </view>
          </view>
          <view class="brand card2" :animation="vdata.animation2">
            <view class="successSign">
              <view class="success">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/38ca02d0fa964952a0d7e4f95a5eba5e/success.png"
                  mode="scaleToFill"
                />
              </view>
              <view class="successTitle">打卡成功</view>
              <view>您已累计打卡{{ user.userInfo.realSignDays || 0 }}天</view>
            </view>
          </view>
        </view>
      </nut-overlay>

      <nut-overlay
        v-model:visible="vdata.upgradeShow"
        :lock-scroll="true"
        :close-on-click-overlay="false"
        :overlay-style="vdata.overlayStyle"
      >
        <view class="upgrade-info">
          <view class="upgrade-text"
            >已自动为你升级到{{
              user.userInfo.userClassGrade ? getList[user.userInfo.userClassGrade] : ''
            }}哦～</view
          >
          <view class="upgrade-btn-box">
            <view class="begin-learn" @click="onUpgradeClose">开始学习</view>
            <view class="change-upgrade" @click="changeGrade">切换年级</view>
          </view>
          <view class="close-box">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/northern/close-btn.png"
              class="close-img"
              mode="widthFix"
              @tap="onUpgradeClose"
            />
          </view>
        </view>
      </nut-overlay>
      <member-toast
        ref="memberToast"
        @handleFree="handleFree"
        :hiddenNavBar="true"
        @handleNav="handleNav"
      ></member-toast>
    </view>
  </scroll-view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import NavBar from '@/components/NavBar.vue'
import language from '@/pages/subject/language/index.vue'
import { onMounted, reactive, ref } from 'vue'
import { usePerson, useSystem, useUser } from '@/stores'
import { getLearningList, dailySign, scanEnterBookId, getTryCount } from '@/api/index'
import { getList } from '@/utils/index'
import { updateDisplayed } from '@/api/user'
import MemberToast from '@/components/memberToast.vue'
import dayjs from 'dayjs'

const system = useSystem()
const { navBarHeight } = system.navBarInfo
const user = useUser()
const personInfo = usePerson()
const memberToast = ref()
const vdata: any = reactive({
  sign: false,
  upgradeShow: false,
  camera: false,
  signStatus: true,
  paradiseBgList: [
    'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/068747aed657486480d684bbe0eaa953/scpk.png',
    'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/e252737e862d4f6f8b1c63253d25c883/okpk.png',
    'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/4c7c006ef6f34d24b039c674c8845f91/dcpk.png',
  ],
  resultList: {},
  subjectId: '1',
  animation1: {},
  animation2: {},
  subjectList: [
    {
      name: '语文',
      id: '1',
    },
    {
      name: '数学',
      id: '2',
    },
    {
      name: '英语',
      id: '3',
    },
  ],
  dataInfoObj: {
    path: 'pages/poetryPkTool/poetryPk/poetryPk/index',
    addShow: false,
    subjectId: '1',
    subjectPic:
      'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/efe521613e754a9e880c889448900ce8/languageIcon.png',
    title: '《教育周报》2023-2024上学期小学数学北师大版三年级第1-24期',
    labelList: [
      {
        name: '三年级',
      },
      {
        name: '北师大版',
      },
    ],
    paradiseBg:
      'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/b6524083292f49a4932903f5af9d31a1/paradiseBg.png',
  },
  digit: '',
  showError: false,
  name: '教育周报读者',
  member: false,
  fixedStyle: {
    color: '',
  },
  scrollTop: false,
})

const onUpgradeClose = () => {
  vdata.upgradeShow = false
  Taro.showTabBar()
  updateDisplayed({
    id: user.userInfo.id,
    isDisplayed: true,
  })
}

const changeGrade = () => {
  personInfo.setUserInfo(JSON.parse(JSON.stringify(user.userInfo)))
  onUpgradeClose()
  Taro.navigateTo({
    url: '/pages/personal/index?showUpgrade=1',
  })
}
const toTransactions = () => {
  Taro.navigateTo({
    url: '/phaseOne/pages/memberPurchase/index',
  })
}
//获取昵称
const getNickName = () => {
  if (user.userInfo.nickName?.length > 6) {
    return user.userInfo.nickName.substring(0, 6) + '...'
  } else {
    return user.userInfo.nickName
  }
}
const hideOverlay = () => {
  Taro.showTabBar()
}
// const wxLogin = () => {}
// const goMember = () => {}
const scroll = ({ detail }) => {
  if (detail.scrollTop > 60) {
    vdata.scrollTop = true
    const fixedScrollElements: any = document.getElementsByClassName('fixedScroll')
    if (fixedScrollElements.length) {
      fixedScrollElements[0].style.top = navBarHeight + `px`
    }
  } else {
    vdata.scrollTop = false
  }
  if (detail.scrollTop > 20) {
    vdata.fixedStyle = {
      background: '#fff',
      color: '#333',
    }
  } else {
    vdata.fixedStyle = {
      color: '#333',
    }
  }
}
const subjectChange = (item) => {
  if (item.id === '2') {
    //  数学
    let obj = {
      subjectId: '2',
      path: 'pages/oralPkTool/oralPk/oralPk/index',
      paradiseBg: vdata.paradiseBgList[Number(item.id) - 1],
    }
    vdata.dataInfoObj = { ...vdata.resultList[2], ...obj }
  } else if (item.id === '3') {
    //  英语
    let obj = {
      subjectId: '3',
      path: 'pages/pkToolapps/wordsPk/wordPk/index',
      paradiseBg: vdata.paradiseBgList[Number(item.id) - 1],
    }
    vdata.dataInfoObj = { ...vdata.resultList[3], ...obj }
    console.log(vdata.dataInfoObj, 888)
  } else {
    //  语文
    let obj = {
      subjectId: '1',
      path: 'pages/poetryPkTool/poetryPk/poetryPk/index',
      paradiseBg: vdata.paradiseBgList[Number(item.id) - 1],
    }
    vdata.dataInfoObj = { ...vdata.resultList[1], ...obj }
  }
  vdata.subjectId = item.id
}
const weeklyChange = () => {
  getSubject()
}
// 打开授权
const setCamera = () => {
  Taro.openSetting({
    success: function (res) {
      Taro.showTabBar()
      res.authSetting = {
        'scope.camera': true,
      }
    },
  })
}
//签到相关
const closeSign = () => {
  vdata.sign = false
  Taro.showTabBar()
}
const signConfig = () => {
  dailySign().then(() => {
    setTimeout(() => {
      user.setUserInfo()
    }, 100)
    let animation1: any = Taro.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
    animation1.rotateY(180).step()
    let animation2: any = Taro.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
    animation2.rotateY(0).step()

    vdata.animation1 = animation1.export()
    vdata.animation2 = animation2.export()
    setTimeout(() => {
      let closeAnimation: any = Taro.createAnimation({
        duration: 1000,
        timingFunction: 'ease-in',
        delay: 1000,
      })
      closeAnimation
        .translate(20, 200)
        .scale(0.5, 0.5)
        .translate(30, 250)
        .scale(0.4, 0.4)
        .translate(40, 300)
        .scale(0.3, 0.3)
        .translate(60, 400)
        .scale(0.2, 0.2)
        .translate(70, 450)
        .scale(0.1, 0.1)
        .skew(20, 20)
        .step({ duration: 500 })
      vdata.animation2 = closeAnimation.export()
      setTimeout(() => {
        closeSign()
      }, 2000)
    }, 2000)
  })
}

//  获取相机是否授权
const getSetting = (url, type?: Number) => {
  let hasAuth = user.userInfo.hasAuth
  Taro.getSetting({
    success: function (res) {
      if (!res.authSetting['scope.camera']) {
        if (!Taro.getStorageSync('camera')) {
          Taro.authorize({
            scope: 'scope.camera',
            success: function () {
              Taro.setStorageSync('camera', 1)
              if (type) {
                Taro.navigateTo({
                  url: url,
                })
              } else {
                // if (!hasAuth) {
                //   Taro.navigateTo({
                //     url: url,
                //   })
                // } else {
                //   Taro.navigateTo({
                //     url: '/photoSearch/photographPage/index',
                //   })
                // }
                handleJeep(hasAuth, url)
              }
            },
            fail: function () {
              Taro.setStorageSync('camera', 1)
            },
          })
        } else {
          Taro.hideTabBar()
          vdata.camera = true
        }
      } else {
        if (type) {
          Taro.navigateTo({
            url: url,
          })
        } else {
          handleJeep(hasAuth, url)
        }
      }
    },
  })
}
const handleFree = (hasAuth, url) => {
  Taro.showTabBar()
  handleNavigate(hasAuth, url)
}
const handleNav = () => {
  Taro.showTabBar()
}
const handleJeep = async (hasAuth, url) => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '拍照搜题', funCourseName: null })
    // vdata.termItemInfo = item
    if (memberInfo.vipState == 1) {
      if (memberInfo.tryFlag == 1) {
        Taro.hideTabBar()
        if (memberInfo.configCount <= memberInfo.hasTryCount) {
          memberToast.value.showToast(false)
        } else {
          memberToast.value.showToast(
            true,
            memberInfo.configCount,
            memberInfo.hasTryCount,
            hasAuth,
            url
          )
        }
      } else {
        Taro.hideTabBar()
        memberToast.value.showToast(false)
      }
    } else {
      handleNavigate(hasAuth, url)
    }
  } else {
    handleNavigate(hasAuth, url)
  }
}
const handleNavigate = (hasAuth, url) => {
  if (!hasAuth) {
    Taro.navigateTo({
      url: url,
    })
  } else {
    Taro.navigateTo({
      url: '/photoSearch/photographPage/index',
    })
  }
}
const getSubject = async () => {
  const result = (await getLearningList()) || {}
  vdata.resultList = result
  let obj = {
    subjectId: vdata.subjectId,
    path: 'pages/poetryPkTool/poetryPk/poetryPk/index',
    paradiseBg: vdata.paradiseBgList[Number(vdata.subjectId) - 1],
  }
  vdata.dataInfoObj = { ...vdata.resultList[vdata.subjectId], ...obj }
}
const toMember = () => {
  Taro.navigateTo({
    url: '/phaseOne/pages/memberPurchase/index',
  })
}
const getBookId = () => {
  return new Promise((resolve, reject) => {
    if (user.bookId) {
      let bookId = user.bookId
      scanEnterBookId({ bookId: bookId })
        .then((res) => {
          if (res) {
            let arrList = vdata.subjectList.filter((item) => item.name === res) || []
            if (arrList.length) {
              vdata.subjectId = arrList[0].id
              subjectChange(arrList[0])
            }
          }
          user.setBookId('')
          resolve(true)
        })
        .catch(() => {
          reject()
        })
    } else {
      resolve(true)
    }
  })
}

// 签到每天只弹一次
const setSignStorage = () => {
  let signFlag = Taro.getStorageSync('signFlag') || ''
  const curDate = dayjs().format('YYYY-MM-DD')
  if (!signFlag || signFlag !== curDate) {
    vdata.sign = true
    Taro.setStorageSync('signFlag', curDate)
    Taro.hideTabBar()
  }
}

onMounted(async () => {
  if (!user.userInfo.id) {
    await user.setUserInfo()
  }
  if (!user.userInfo.isDisplayed) {
    Taro.hideTabBar()
    vdata.upgradeShow = true
  } else {
    //  !user.userInfo.isDailyFirstSign
    setSignStorage()
  }
})
useDidShow(async () => {
  user.fetchAndSetVip()
  await getBookId()
  await getSubject()
})
</script>
<style lang="scss">
@import './index.scss';
</style>
