<template>
  <!-- <scroll-view class="scroll-view_H" style="height: 100vh" :scroll-y="true" @scroll="scroll"> -->
  <scroll-view class="scroll-view_H" :scroll-y="true" style="height: 100vh" @scroll="scroll">
    <view class="mainContent" :style="{ paddingTop: `${navBarHeight + 15}px` }">
      <NavBar :title="'北方期刊会员'" :fixedStyle="vdata.fixedStyle" />
      <view class="userInfo">
        <view class="userLeft">
          <view class="defaultImg">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/b2c0d521a4444e64ae6a91fb452532dc/defaultImg.png"
            />
          </view>
          <view class="leftRight">
            <view class="textInfo">
              <view>{{ getNickName() }}</view>
              <view class="phone" v-if="user.userInfo.userPhone">{{ getUserNumber() }}</view>
              <nut-button
                v-else
                size="large"
                block
                type="default"
                openType="getPhoneNumber"
                @getphonenumber="(e) => getPhoneNumber(e)"
                >(手机号未授权)</nut-button
              >
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
        </view>
        <view class="rq" @tap="toTransactions">交易记录</view>
      </view>
      <view class="vipCard">
        <!-- <view class="gread">{{ vdata.onlineVipInfo.termTxt }}</view> -->
        <view class="memberContet">
          <view class="displayFlex">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/3b2917f465944f5da059d7f8e258930d/bt.png"
              alt=""
            />
            <text class="vip-name">{{ vdata.onlineVipInfo.vipName || '教育周报会员' }}</text>
          </view>
          <view class="memberIn">
            <view>
              <view>畅学教育周报全部精品资源</view>
              <view class="cx" v-if="hasOnlineVip"
                >本期周报会员有效期至{{ vdata.onlineVipInfo.termExpiryEnd }}</view
              >
            </view>
            <view class="moneyInfo" v-if="hasOnlineVip">
              <text class="number">{{ vdata.onlineVipInfo.salePrice }}</text>
              <text>元</text>
            </view>
          </view>
        </view>
      </view>
      <view class="imgInfo">
        <image
          class="img1"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/69b4f67ee950482d96589364b085cad1/quanyi.png"
        />
        <image
          class="img2"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/7b39480b8a9a4bd7a2483e1a1b8409d3/ty.png"
        />
        <image
          class="img3"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/509cba9bcc14411a8b25fa39715ed76f/rq.png"
        />
      </view>
      <view class="bottomBtn" v-if="!user.vip">
        <view class="isIos" v-if="!hasOnlineVip">敬请期待</view>
        <view class="btn" v-else-if="phoneType() && user.userInfo.userPhone" @tap="goPay">
          <view class="money">
            <text>{{ vdata.onlineVipInfo.salePrice }}</text>
            <text class="dw">元</text>
          </view>
          <text>立即开通</text>
        </view>
        <nut-button
          v-else-if="phoneType() && !user.userInfo.userPhone"
          size="large"
          class="btn"
          block
          type="default"
          openType="getPhoneNumber"
          @getphonenumber="(e) => getPhoneNumber(e, 1)"
        >
          <text class="money">
            <text>{{ vdata.onlineVipInfo.salePrice }}</text>
            <text class="dw">元</text>
          </text>
          <text>立即开通</text>
        </nut-button>
        <view class="isIos" v-else> 因政策要求，iOS暂不支持购买 </view>
      </view>
    </view>
  </scroll-view>
</template>
<script lang="ts" setup>
import Taro, { useDidHide } from '@tarojs/taro'
// import { ScrollView } from '@tarojs/components'
import NavBar from '@/components/NavBar.vue'
import { payMoney, queryPay, getOnlineMember } from '@/api/index'
import { getUserPhone, getMember } from '@/api/user'
import { onMounted, reactive, onBeforeUnmount, computed } from 'vue'
import { useSystem, useUser } from '@/stores'
import { phoneType } from '@/utils/index'
import { debounce } from '@/utils'
const system = useSystem()
const user = useUser()
const { navBarHeight } = system.navBarInfo

const vdata: any = reactive({
  digit: '',
  fixedStyle: {
    color: '#fff',
  },
  memberInfo: {},
  onlineVipInfo: {}, // 线上会员信息
  orderNumber: '',
  timer: null,
})

// 有没有线上会员信息 true表示有
const hasOnlineVip = computed(() => {
  return vdata.onlineVipInfo.vipName
})

const getNickName = () => {
  if (user.userInfo.nickName?.length > 6) {
    return user.userInfo.nickName.substring(0, 6) + '...'
  } else {
    return user.userInfo.nickName
  }
}
const getUserNumber = () => {
  let phone = ''
  if (user.userInfo?.userPhone) {
    let pho = /(\d{3})\d*(\d{4})/
    phone = user.userInfo.userPhone.replace(pho, '$1****$2')
  }
  return phone
}
const goPay = debounce(() => {
  const params = {
    body: '测试商品',
    orderMoney: vdata.onlineVipInfo.salePrice,
    subject: vdata.onlineVipInfo.vipName,
    termPriceId: vdata.onlineVipInfo.id,
    termExpiryStart: vdata.onlineVipInfo.termPriceExpiryStart,
    termExpiryEnd: vdata.onlineVipInfo.termPriceExpiryEnd,
  }
  payMoney(params).then((res: any) => {
    vdata.orderNumber = res.orderNumber
    const data: any = JSON.parse(res.payData)
    Taro.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: () => {
        vdata.timer = setInterval(() => {
          orderPay(vdata.orderNumber)
        }, 1000)
      },
      fail: () => {
        // console.log('支付失败', fail)
      },
    })
  })
})
const orderPay = (orderId) => {
  queryPay({ orderId }).then(async (res: any) => {
    // 成功
    if (res?.orderStatus === 2) {
      clearInterval(vdata.timer)
      vdata.timer = null
      await getMember().then((res: any) => {
        user.setVip(res)
      })
      await user.setUserInfo()
      Taro.redirectTo({
        url: '../payResults/index?payStatus=1',
      })
      //失败
    } else if (res?.orderStatus === 3) {
      clearInterval(vdata.timer)
      vdata.timer = null
      Taro.redirectTo({
        url: '../payResults/index?payStatus=2',
      })
    }
  })
}
//交易记录
const toTransactions = () => {
  Taro.navigateTo({
    url: '../transactions/index',
  })
}
//获取手机号
const getPhoneNumber = (e: any, type?: Number) => {
  if (e.detail.code) {
    getUserPhone({ code: e.detail.code, type: 1 }).then(() => {
      user.setUserInfo()
      if (type) {
        goPay()
      }
    })
  }
}
//滚动条
const scroll = ({ detail }) => {
  if (detail.scrollTop > 80) {
    vdata.fixedStyle = {
      background: '#fff',
      color: '#333',
    }
  } else {
    vdata.fixedStyle = {
      color: '#fff',
    }
  }
}
onMounted(() => {
  //获取卡片详情
  getOnlineMember().then((res: any) => {
    vdata.onlineVipInfo = res || {}
  })
})
useDidHide(() => {})
onBeforeUnmount(() => {
  clearInterval(vdata.timer)
  vdata.timer = null
})
</script>
<style lang="scss">
.mainContent {
  background-image: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/588d7f6bc042431c80676b1006a55290/memberBgs.png');
  background-repeat: no-repeat;
  background-position: top;
  background-size: 100%;
  box-sizing: border-box;
  padding-bottom: 92px;
  background-color: #f3f4f6;
}
.userInfo {
  height: 40px;
  margin: 0 16px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .nut-button {
    width: 100px;
    font-size: 12px;
    background: none;
    color: #fff;
    border: none;
    height: 20px;
  }
  .userLeft {
    display: flex;
    align-items: center;
    .leftRight {
      // display: flex;
      font-family: PingFangSC-Regular;
      .textInfo {
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: 14px;
        .name {
          width: 84px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .phone {
          margin: 0 5px;
          font-size: 12px;
        }
        .jb {
          image {
            width: 14px;
            height: 13px;
          }
        }
      }
      .memberTime {
        font-size: 12px;
        color: #999;
        margin-top: 2px;
      }
    }
  }
  .rq {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
  }
  .defaultImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    image {
      width: 40px;
      height: 40px;
    }
  }
}
.vipCard {
  margin: 0 16px 16px;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/northern/vip_bg.png')
    no-repeat center;
  height: 162px;
  background-size: 100% 100%;
  position: relative;
  padding: 42px 20px 0;
  .gread {
    position: absolute;
    top: 12px;
    left: 0;
    width: 84px;
    height: 20px;
    line-height: 22px;
    text-align: center;
    font-size: 11px;
    color: #fff;
  }
  .memberContet {
    .displayFlex {
      width: 222px;
      display: flex;
      align-items: center;
      font-family: PingFang SC;
      font-size: 20px;
      font-weight: 600;
      line-height: 26px;
      color: #d04900;
      margin-bottom: 35px;
    }
    image {
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    .vip-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .memberIn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #893500;
      font-size: 14px;
      .cx {
        color: #ba7245;
        font-size: 12px;
        margin-top: 13px;
      }
      .moneyInfo {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        font-weight: 500;
        color: #893500;
        .number {
          font-size: 34px;
          font-weight: 600;
        }
      }
    }
  }
}
.imgInfo {
  margin: 0 16px;
  image {
    // box-shadow: 0px 4px 14px 12px rgba(59, 55, 148, 0.03);
    margin-bottom: 16px;
  }
  .img1 {
    width: 100%;
    height: 304px;
  }
  .img2 {
    width: 100%;
    height: 372px;
  }
  .img3 {
    width: 100%;
    height: 342px;
  }
}
.bottomBtn {
  // background:url("")
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 92px;
  border-radius: 20px 20px 0px 0px;
  background: #ffffff;
  box-shadow: 0px -2px 6px 3px rgba(59, 55, 148, 0.03);
  padding: 22px;
  box-sizing: border-box;
  .btn {
    height: 48px;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/a2da3f0ebd334ffcbe71b958b2dbdd1c/icon-bg.png')
      no-repeat center;
    display: flex;
    background-size: 100% 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 34px 0 27px;
    color: #fff;
    .nut-button__warp {
      view {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .money {
      font-size: 26px;
      font-family: DIN Alternate;
    }
    .dw {
      font-size: 12px;
      margin-left: 3px;
    }
  }
  .isIos {
    height: 48px;
    text-align: center;
    line-height: 48px;
    color: #ffffff;
    font-size: 14px;
    border-radius: 24px;
    background: #bcbcbc;
  }
  .nut-button--default {
    border: none;
  }
  // https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/a2da3f0ebd334ffcbe71b958b2dbdd1c/icon-bg.png
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
