<template>
  <NavBar :title="'错题本'" :fixedStyle="vdata.fixedStyle" />

  <!-- <scroll-view class="scroll-view_H" :scroll-y="true" style="height: 100vh" @scroll="scroll"> -->
  <view
    class="mainContent"
    :style="{ marginTop: `${navBarHeight}px`, height: `calc(${vdata.height} - ${navBarHeight}px)` }"
  >
    <view class="lrContent" @tap="getScreen">
      <!-- <image
        class="vip"
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/137a706e021e48c99319184a1cb705f1/vipzx.png"
      /> -->
      <view class="title">录错题 </view>
      <view class="text">自动清除笔记 自动框选题目</view>
    </view>
    <view class="textContet">
      <view class="scrollContent" v-if="vdata.recordList && vdata.recordList.length">
        <view class="displayFlexCenter">
          <view class="title">组卷记录</view>
          <view class="displayFlexCenter">
            <text class="text" @tap="lookMore">查看更多</text>
            <text class="ybjt"></text>
          </view>
        </view>
        <scroll-view class="scroll-view_H" :scroll-x="true" style="height: 80px">
          <view class="scrollList">
            <view
              class="scroll-item"
              v-for="(item, i) in vdata.recordList"
              :key="i"
              @tap="toDetail(item)"
            >
              <image :src="item.icon" />
              <view>
                <view class="title">{{ item.exercisePaperName }}</view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="grandList">
        <view class="displayFlexCenter">
          <view class="title">错题本</view>
          <view class="displayFlexCenter" @tap="showPupClass">
            <text class="text"> {{ vdata.text }}</text>
            <text class="xbjt"></text>
          </view>
        </view>
        <view class="listInfo">
          <view
            class="item-list"
            v-for="(item, i) in vdata.grandList"
            :key="i"
            @tap="toList(i + 1)"
          >
            <image :src="item.courseIcon" />
            <text class="title">{{ item.course }}</text>
            <text class="number" v-if="item.exerciseBookCount">{{ item.exerciseBookCount }}题</text>
            <text class="number" v-else>0题</text>
          </view>
        </view>
      </view>
    </view>
    <class-popup
      :visible="vdata.visible"
      :value="vdata.value"
      @handleChange="getClassGrop"
      @close="close"
    ></class-popup>
    <!-- :close-on-click-overlay="false" -->
    <nut-overlay
      v-model:visible="vdata.camera"
      :lock-scroll="true"
      :overlay-style="vdata.overlayStyle"
    >
      <view class="cameraMain">
        <view class="title">相机权限</view>
        <view>请在「设置」选项中</view>
        <view>允许小程序访问您的摄像头</view>
        <view class="authSetting" @tap="setCamera">去开启摄像头权限</view>
      </view>
    </nut-overlay>
  </view>
  <!-- <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast> -->

  <!-- </scroll-view> -->
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import ClassPopup from '@/components/ClassPopup.vue'
import { wrongbookList, getPaperList } from '@/api/wrongbook'
import { reactive, ref } from 'vue'
import { useSystem, useUser } from '@/stores'
import { debounce } from '@/utils/index'
import { getTryCount } from '@/api/index'
// import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const user = useUser()
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  height: '100vh',
  isVip: false,
  overlayStyle: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  recordList: [],
  grandList: [],
  visible: false,
  camera: false,
  value: [],
  text: '全部',
  fixedStyle: {
    color: '#333',
    background: '#fff',
  },
})
const toDetail = (item) => {
  let info = JSON.stringify(item)
  Taro.navigateTo({
    url: `/wrongbook/paperDetails/index?info=${info}`,
  })
}
const getScreen = debounce(() => {
  Taro.getSetting({
    success: function (res) {
      if (!res.authSetting['scope.camera']) {
        if (!Taro.getStorageSync('camera')) {
          Taro.authorize({
            scope: 'scope.camera',
            success: function () {
              Taro.setStorageSync('camera', 1)
              Taro.navigateTo({
                url: '../photograph/index',
              })
              // handleJeep()
            },
            fail: function () {
              Taro.setStorageSync('camera', 1)
            },
          })
        } else {
          vdata.camera = true
        }
      } else {
        Taro.navigateTo({
          url: '../photograph/index',
        })
        // handleJeep()
      }
    },
  })
})
const handleJeep = async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '错题本', funCourseName: null })
    // vdata.termItemInfo = item
    if (memberInfo.vipState === 1) {
      if (memberInfo.tryFlag === 1) {
        if (memberInfo.configCount <= memberInfo.hasTryCount) {
          memberToast.value.showToast(false)
        } else {
          memberToast.value.showToast(true, memberInfo.configCount, memberInfo.hasTryCount)
        }
      } else {
        memberToast.value.showToast(false)
      }
    } else {
      handleNavigate()
    }
  } else {
    handleNavigate()
  }
}
const handleNavigate = () => {
  Taro.navigateTo({
    url: '../photograph/index',
  })
}
// 打开授权
const setCamera = () => {
  Taro.openSetting({
    success: function (res) {
      console.log(res.authSetting)
      res.authSetting = {
        'scope.userInfo': true,
        'scope.userLocation': true,
      }
    },
  })
}
//错题本列表
const toList = (type) => {
  let branch = vdata.value.length ? (vdata.value[0] == 0 ? '' : vdata.value[0]) : ''
  let term = vdata.value.length ? (vdata.value[1] == 0 ? '' : vdata.value[1]) : ''
  Taro.navigateTo({
    url: `../wrongList/index?grand=${type}&branch=${branch}&term=${term}`,
  })
}
const getPageList = () => {
  let params = {
    condition: {
      course: '',
      timeLimit: 0,
    },
    current: 0,
    orders: [
      {
        asc: true,
        column: '',
      },
    ],
    size: 3,
  }
  getPaperList(params).then((res: any) => {
    vdata.recordList = res.records
  })
}
const showPupClass = () => {
  vdata.visible = true
}
//开通会员
const getMember = () => {
  vdata.isVip = false
  Taro.navigateTo({
    url: '/phaseOne/pages/memberPurchase/index',
  })
}
//获取年级
const getClassGrop = (value, item) => {
  vdata.value = value
  vdata.text = item[0].text + item[1].label
  vdata.visible = false
  getList()
}
const close = () => {
  vdata.visible = false
}
const lookMore = () => {
  Taro.navigateTo({
    url: '../record/index',
  })
}
//获取科目错题
const getList = () => {
  let params = {
    grade: vdata.value[0] || '',
    term: vdata.value[1] || '',
  }
  wrongbookList(params).then((res: any) => {
    vdata.grandList = res
  })
}
useDidShow(() => {
  getList()
  getPageList()
})
</script>

<style lang="scss">
.mainContent {
  box-sizing: border-box;
  background: #f4f8fc;
  overflow: scroll;
  // height: 100vh;
}
.contentMain {
  overflow: scroll;
}
.lrContent {
  margin: 0 16px;
  padding: 50px 15px 70px;
  height: 160px;
  position: relative;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/030e5bf572d44b12a08c5464840fe898/ctCard.png')
    no-repeat center;
  border-radius: 20px;
  background-size: 100% 100%;
  box-shadow: 0px 4px 8px 0px rgba(231, 239, 247, 0.8);
  //   overflow: hidden;
  .vip {
    width: 96px;
    height: 41px;
    position: absolute;
    top: 14px;
    left: 0;
  }
  .title {
    font-size: 22px;
    font-weight: 900;
    color: #333;
  }
  .text {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    font-weight: normal;
    color: #666;
    margin-top: 16px;
  }
}
.textContet {
  flex: 1;
  background: #f4f8fc;
  padding: 0 16px 30px;
  margin-top: 28px;
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    color: #ffffff;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.1);
    border-radius: 0px;
    background-color: #ffffff;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 0px;
    -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.1);
    background-color: #39b54a;
  }
}

.scroll-view_H {
  margin-top: 15px;
  .scrollList {
    display: flex;
    width: 100%;
    height: 100%;
  }
  .scroll-item {
    width: 210px;
    flex-shrink: 0;
    background: #ffffff;
    box-shadow: 0px 6px 12px 0px #ebf4fc;
    border-radius: 14px;
    margin-right: 14px;
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: normal;
    padding-left: 16px;
    box-sizing: border-box;
    image {
      width: 56px;
      height: 54px;
      flex-shrink: 0;
      margin-right: 10px;
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: normal;
      line-height: 20px;
      color: #333333;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      // flex: 1;
      // width: 130px;
    }
  }
}
.grandList {
  margin-top: 28px;

  .listInfo {
    margin-top: 17px;
    display: flex;
    flex-wrap: wrap;
    // justify-content: flex-end;
    // justify-content: space-between;
  }
  .item-list {
    width: 108px;
    height: 108px;
    border-radius: 10px;
    background: #fff;
    margin-bottom: 10px;
    margin-right: 9px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .listInfo .item-list:nth-child(3n) {
    margin-right: 0;
  }
  image {
    width: 38px;
    height: 38px;
  }
  .title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    margin-top: 6px;
  }
  .number {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    height: 14px;
    display: flex;
    align-items: center;
    margin-top: 3px;
  }
}
.displayFlexCenter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .jb {
    width: 5px;
    height: 6px;
  }
  .title {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
  .text {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    font-weight: normal;
    color: #666666;
  }
}
.cameraMain {
  background: #fff;
  width: 265px;
  height: 192px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  color: #999999;
  .title {
    font-family: PingFang SC;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 14px;
  }
  .authSetting {
    width: 162px;
    height: 40px;
    border-radius: 21px;
    background: #2f5de7;
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    line-height: 40px;
    margin-top: 22px;
  }
}
</style>
