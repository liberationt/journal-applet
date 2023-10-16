<template>
  <view class="mainContent" :style="{ paddingTop: `${navBarHeight + 24}px` }">
    <NavBar :title="'我的'" />
    <view class="myContent">
      <view class="headers">
        <view class="topInfo">
          <image
            class="headerImg"
            @tap.stop="goPersonal"
            :src="user.userInfo.portraitUrl ? user.userInfo.portraitUrl : vdata.headerImg"
          />
          <image
            class="memberIs"
            :src="
              user.vip
                ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/3f011b12b21942caa56c75f38db2a670/hy.png'
                : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/02a56e2f0caf46e1993dd421b78fc9e3/fhy.png'
            "
          />
          <view class="sign">
            <image
              :src="
                user.userInfo.isDailyFirstSign
                  ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/0b883ee425834551b345d52483010b41/yqd.png'
                  : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/317514d8ecdc406c91d6dad0575c8f40/wqd.png'
              "
              mode="scaleToFill"
            />
            <text v-if="user.userInfo.isDailyFirstSign" class="study"
              >累计学习{{ user.userInfo.realSignDays }}天</text
            >
            <text v-else class="signBtn" @tap="sign">每日签到</text>
          </view>
        </view>
        <view class="nickInfo" @tap="goPersonal">
          <view>{{ getNickName() }}</view>
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/83de29736d994fe8b592850b79bcc7de/bj.png"
          />
        </view>
      </view>
      <view class="memberContent" @tap="goMember">
        <!-- <view class="gread">{{ vdata.memberInfo.termTxt }}</view> -->
        <view class="memberContet">
          <view class="displayFlex">
            <image
              class="tb"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/bdd6726ebdbe48fcb8aa3c7957da1f6d/kt.png"
              alt=""
            />
            <view class="displayFlex">
              <text class="memberName">{{ vdata.memberInfo.vipName || '教育周报会员' }}</text>
              <view class="timeOut" v-if="vdata.memberInfo.vipState === 2">已过期</view>
            </view>
          </view>
          <view class="cx">
            <text v-if="!user.vip || vdata.memberInfo.vipState === 2"
              >·畅学教育周报全部精品资源·</text
            >
            <text v-else>·{{ vdata.memberInfo.termExpiryEnd }} 到期·</text>
          </view>

          <view class="listItem">
            <view v-for="(item, i) in vdata.itemList" :key="i" class="list-item">
              <view>
                <image :src="item.url" class="iconUrl" />
              </view>
              <text class="text">{{ item.text }}</text>
            </view>
          </view>
        </view>
        <view class="isMember" v-if="user.vip">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/7279e139296c4bff91170ed87cdf5be2/hubs.png"
          />
        </view>
        <view class="isNoMember" :class="[!hasOnlineVip ? 'coming-soon' : '']" v-else>
          {{ !hasOnlineVip ? '敬请期待' : '开通会员' }}
        </view>
      </view>
    </view>
    <view class="option">
      <view class="option-list" @tap="optionBtn(1)">
        <view class="list-left">
          <image
            class="imgUrl"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/c92b0ee9d6e7484c992376100f638e02/jhhy.png"
          />
          <text>会员激活码</text>
        </view>
        <view>
          <image
            class="jbUrl"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/7361e0295b0d462fa5480244dfe2fe16/yjt.png"
          />
        </view>
      </view>
      <!-- <view class="option-list">
        <view class="list-left">
          <image
            class="imgUrl"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/258955cfb19b4791a954a3b4d3508c94/lxkf.png"
          />
          <text>在线客服</text>
        </view>
        <view>
          <image
            class="jbUrl"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/7361e0295b0d462fa5480244dfe2fe16/yjt.png"
          />
        </view>
      </view> -->
    </view>
    <nut-overlay
      v-model:visible="vdata.sign"
      :lock-scroll="true"
      :close-on-click-overlay="false"
      :overlay-style="vdata.overlayStyle"
    >
      <view class="signMain">
        <view class="successSign">
          <view class="success">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/38ca02d0fa964952a0d7e4f95a5eba5e/success.png"
              mode="scaleToFill"
            />
          </view>
          <view class="successTitle">打卡成功</view>
          <view>您已累计打卡{{ user.userInfo.realSignDays }}天</view>
        </view>
      </view>
    </nut-overlay>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { reactive, computed } from 'vue'
import { useSystem, useUser, usePerson } from '@/stores'
import { getMemberDetail, getOnlineMember } from '@/api/index'
// import moment from 'moment'
import { dailySign } from '@/api/index'

const system = useSystem()
const user = useUser()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  headerImg:
    'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/b2c0d521a4444e64ae6a91fb452532dc/defaultImg.png',
  member: false,
  sign: false,
  itemList: [
    {
      url: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/eda7a01352b24cc5b8bc805791de9295/icon1.png',
      text: '拍照批改',
    },
    {
      url: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/01cc41280abc46fa9db4469a32e46222/icon2.png',
      text: '拍照搜题',
    },
    {
      url: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/e4d944d2b6e045af8d947360da86cfaf/icon3.png',
      text: '错题本',
    },
    {
      url: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/a601d45618174f15aac5d92e18cc597b/icon4.png',
      text: '英语听力',
    },
    {
      url: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/2863964e4fc24598bf87b37f3b738ace/icon5.png',
      text: '配套答案',
    },
  ],
  memberInfo: {},
  onlineVipInfo: {}, // 线上会员信息
})

// 有没有线上会员信息 true表示有
const hasOnlineVip = computed(() => {
  return vdata.onlineVipInfo.vipName
})

//获取昵称
const getNickName = () => {
  if (user.userInfo.nickName?.length > 6) {
    return user.userInfo.nickName.substring(0, 6) + '...'
  } else {
    return user.userInfo.nickName
  }
}
//激活会员
const optionBtn = (type: number) => {
  if (type === 1) {
    Taro.navigateTo({ url: `/phaseOne/pages/activateMember/index?isNot=true` })
  }
}
//签到
const sign = () => {
  Taro.hideTabBar()
  dailySign()
    .then(() => {
      vdata.sign = true
      user.setUserInfo()
      setTimeout(() => {
        vdata.sign = false
        Taro.showTabBar()
      }, 2000)
    })
    .catch(() => {
      Taro.showTabBar()
    })
}
//个人信息
const goPersonal = () => {
  personInfo.setUserInfo(JSON.parse(JSON.stringify(user.userInfo)))
  Taro.navigateTo({
    url: '/pages/personal/index',
  })
}
//开通会员
const goMember = () => {
  // 没有线上会员不让跳
  if (!hasOnlineVip.value) return
  Taro.navigateTo({
    url: '/phaseOne/pages/memberPurchase/index',
  })
}
//会员状态
// const checkMember = () => {
//   if (vdata.memberInfo?.termExpiryEnd) {
//     return (
//       moment(moment().format('YYYY-MM-DD')).valueOf() >
//       moment(vdata.memberInfo.termExpiryEnd).valueOf()
//     )
//   } else {
//     return false
//   }
// }
useDidShow(async () => {
  user.fetchAndSetVip()
  //获取卡片详情
  const res: any = await getMemberDetail()
  vdata.memberInfo = res || {}
  // 查有没有线上会员信息
  const onlineRes: any = await getOnlineMember()
  vdata.onlineVipInfo = onlineRes || {}
})
</script>

<style lang="scss">
.mainContent {
  width: 100%;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/fa309aeb4f27412089234fb5462589a7/myTopBg.png')
    no-repeat top;
  background-size: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
}
.myContent {
  .headers {
    .topInfo {
      text-align: center;
      position: relative;
      .headerImg {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        overflow: hidden;
      }
      .memberIs {
        width: 23px;
        height: 21px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
      }
      .sign {
        height: 30px;
        position: absolute;
        right: 0;
        top: 10px;
        background: #fff;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-radius: 20px 0 0 20px;
        display: flex;
        align-items: center;
        image {
          width: 16px;
          height: 15px;
          margin-right: 5px;
        }
        text {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #333333;
        }
      }
    }
    .nickInfo {
      margin: 10px 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      image {
        width: 16px;
        height: 16px;
        margin-left: 5px;
      }
      .nickName {
        width: 98px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .memberContent {
    position: relative;
    padding: 18px 15px 0;
    margin: 29px 16px 0;
    height: 190px;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/myBg/6045f03a36674f449329e7ce3b34bf21/myCardBg.png')
      no-repeat center;
    background-size: 100% 100%;
    box-sizing: border-box;
    .gread {
      position: absolute;
      top: 0;
      border-radius: 18px 0 10px;
      left: 0;
      width: 86px;
      height: 20px;
      // background: linear-gradient(#f19f5c,rgba(239,165,90,.1));
      background: rgba(239, 165, 90, 0.7);
      // transform: rotate(180deg);
      opacity: 0.74;
      line-height: 20px;
      text-align: center;
      font-size: 12px;
      color: #fff;
    }
    .tb {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
    .displayFlex {
      display: flex;
      align-items: center;
    }
    .memberName {
      font-family: PingFang SC;
      font-size: 18px;
      color: #d04900;
      font-weight: 600;
    }
    .timeOut {
      width: 40px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      color: #fff;
      background: linear-gradient(92deg, #e99a4b -29%, #f1813b 156%);
      border-radius: 10px 10px 10px 0;
      font-size: 10px;
      font-family: PingFangSC-Regular;
      margin-left: 5px;
    }
    .cx {
      font-size: 12px;
      font-family: PingFangSC-Regular;
      color: #ba7245;
      margin-top: 5px;
    }
    .listItem {
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: 0px;

      color: #a45c2d;
      .list-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .iconUrl {
          width: 48px;
          height: 48px;
        }
        .text {
          margin-top: 6px;
        }
      }
    }
    .isMember {
      position: absolute;
      top: -12px;
      right: 0;
      image {
        width: 90px;
        height: 70px;
      }
    }
    .isNoMember {
      width: 95px;
      height: 34px;
      background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/northern/vip-btn1.png')
        no-repeat;
      background-size: 100%;
      position: absolute;
      top: 15px;
      right: 10px;
      padding-left: 16px;
      line-height: 34px;
      font-size: 14px;
      color: #fff;
      &.coming-soon {
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/northern/vip-btn2.png')
          no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
.option {
  background: #fff;
  position: relative;
  top: -18px;
  flex: 1;
  border-radius: 15px 15px 0 0;
  box-shadow: 0px -6px 12px 0px rgba(198, 211, 223, 0.2);
  padding: 9px 23px 0;
  box-sizing: border-box;
}
.option-list {
  display: flex;
  justify-content: space-between;
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: 0px;
  height: 54px;
  align-items: center;
  color: #333333;
  border-bottom: 1px solid rgba(200, 200, 200, 0.17);
  .list-left {
    display: flex;
    align-items: center;
  }
  .imgUrl {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }
  .jbUrl {
    width: 14px;
    height: 14px;
  }
}
.signMain {
  background: #fff;
  width: 310px;
  position: fixed;
  top: 50%;
  left: 50%;
  height: 234px;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: PingFangSC-Regular;
  padding-bottom: 20px;
  .successSign {
    text-align: center;
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #666666;
    .success {
      width: 104px;
      height: 104px;
      image {
        width: 104px;
        height: 104px;
      }
    }
    .successTitle {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #333333;
      margin: 20px 0 10px;
    }
  }
}
</style>
