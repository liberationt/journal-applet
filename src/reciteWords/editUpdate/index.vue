<template>
  <view class="editUpdateMain" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="" :fixedStyle="vdata.fixedStyle"></NavBar>
    <view class="tabInfo">
      <view :class="vdata.tabType == 1 && 'selectTab'" @tap="tabChange(1)">修改计划</view>
      <view :class="vdata.tabType == 2 && 'selectTab'" @tap="tabChange(2)">更换词书</view>
    </view>
    <template v-if="vdata.tabType == 1">
      <view class="bookInfo">
        <view class="left">
          <image
            class="left-bg"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/446d8803ee0d48b4b2be1899549ce266/dcs.png"
            mode="scaleToFill"
          >
          </image>
        </view>
        <view class="right">
          <view class="right-title">
            <view>单词书名称单词书名称 单词大声道</view>
          </view>
          <view>
            <view class="schedule">
              <view class="percentage"></view>
            </view>
            <view class="right-bottom">
              <view class="already">
                <text>已学习</text>
                <text class="alreadyStudy">123/1234</text>
              </view>
              <view class="reset" @tap="reset">重置进度</view>
            </view>
          </view>
        </view>
      </view>
      <view class="studyPlan">
        <view class="studyText">
          <view>每天学习</view>
          <view>学习天数</view>
        </view>
        <view class="pickerInfo">
          <picker-view
            indicator-style="height: 30px;"
            style="width: 100%; height: 170px"
            :value="value"
            indicatorClass="selected-item"
            @change="onChange"
          >
            <picker-view-column class="left-column">
              <view class="picker-item" v-for="(item, index) in vdata.dayList" :key="index"
                >{{ item }}个</view
              >
            </picker-view-column>
            <picker-view-column class="right-column">
              <view v-for="(item, index) in vdata.timeList" class="picker-item'" :key="index"
                >{{ item }}天</view
              >
            </picker-view-column>
          </picker-view>
          <view class="icon">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/c22584771ddb4f849a4d72bad6c1fcae/icon.png"
              mode="scaleToFill"
            />
          </view>
        </view>
      </view>
      <view class="expect">
        预计每天学<text>10</text>分钟，<text>100</text> 天学完(2022年12月12日)
      </view>
      <view class="footer" @tap="beginStudy">开始学习该计划！</view>
    </template>
    <template v-else>
      <scroll-view
        class="scrollInfo"
        :scroll-y="true"
        :style="{ height: `calc(100vh - ${navBarHeight + 184}px)` }"
      >
        <view class="scroll-item" v-for="item in 8" :key="item">
          <view class="bookInfo list-item" @tap="changeBook(item)">
            <view class="left">
              <image
                class="left-bg"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/446d8803ee0d48b4b2be1899549ce266/dcs.png"
                mode="scaleToFill"
              >
              </image>
            </view>
            <view class="right">
              <view class="right-title">
                <view>单词书名称单词书名称 单词大声道</view>
              </view>
              <view>
                <view class="right-bottom">
                  <view class="already">
                    <text>已学习</text>
                    <text class="alreadyStudy">123/1234</text>
                  </view>
                  <view class="reset"></view>
                </view>
                <view class="footerSched">
                  <view class="schedule">
                    <view class="percentage"></view>
                  </view>
                  <view class="rightText">
                    <view v-if="false">当前在学</view>
                    <view v-else class="delInfo" @tap.stop="removeBook(item)">
                      <image
                        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/46d7c20a1cef4f9c868e2370f53a1dce/del.png"
                        mode="scaleToFill"
                      />
                      <view>移除</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="addBtn">
        <view @tap="addBook">添加词书</view>
      </view>
    </template>
    <nut-overlay v-model:visible="vdata.showTitle" :close-on-click-overlay="false">
      <view class="toastInfo">
        <view class="contentTitle">{{ vdata.title }}</view>
        <view class="contentText">
          <view v-if="vdata.operaType == 1">
            <view>你已学习该计划的15个单词,重置后将</view>
            <view>无法撤销，是否确认重置？</view>
          </view>
          <view v-if="vdata.operaType == 2">
            <view>你已经学习了该计划的24个单词,</view>
            <view> 删除后将无法撤销，确定删除计划？</view>
          </view>
          <view v-if="vdata.operaType == 3">
            <view>是否确认切换至 </view>
            <view>“人教版小学英语三年级下册”</view>
          </view>
        </view>
        <view class="contentBtn">
          <view class="cancel" @tap="cancel">取消</view>
          <view class="confirm"> 确认{{ vdata.contentBtn }} </view>
        </view>
      </view>
    </nut-overlay>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import { PickerView, PickerViewColumn } from '@tarojs/components'

import NavBar from '@/components/NavBar.vue'
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
import { reactive } from 'vue'

const vdata = reactive({
  fixedStyle: {
    color: '#fff',
  },
  showTitle: false,
  title: '',
  contentBtn: '重置',
  tabType: 1,
  operaType: 1,
  dayList: [10, 20, 30, 40, 50],
  timeList: [10, 5, 3, 3, 2],
})
//tab切换
const tabChange = (num) => {
  vdata.tabType = num
}
// 重置
const reset = () => {
  vdata.showTitle = true
  vdata.tabType = 1
  vdata.title = '是否重置进度'
}
//取消操作
const cancel = () => {
  vdata.showTitle = false
}
//确认操作
const confirm = () => {
  vdata.showTitle = false
}
//添加词书
const addBook = () => {
  Taro.navigateTo({
    url: '../wordBook/index',
  })
}
const beginStudy = () => {
  Taro.navigateTo({
    url: '../index/index',
  })
}
//更换词书
const changeBook = () => {
  console.log(11)
}
//删除
const removeBook = () => {
  console.log(22)
}
useDidShow(() => {})
</script>
<style lang="scss">
.editUpdateMain {
  height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/460e28cdddcb4e62b1752511362a4a48/bdcBg.png')
    no-repeat top;
  background-size: 100%;
  box-sizing: border-box;
  // display: flex;
  // flex-direction: column;
  .tabInfo {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    font-weight: 500;
    color: #343434;
    margin-bottom: 27px;
    view {
      margin: 0 15px;
    }
    .selectTab {
      color: #4a89ff;
      position: relative;
    }
    .selectTab::after {
      position: absolute;
      content: '';
      width: 36px;
      height: 4px;
      bottom: -7px;
      left: 50%;
      right: 0;
      background: #4a89ff;
      display: inline-block;
      border-radius: 2px;
      transform: translateX(-50%);
    }
  }
  .bookInfo {
    margin: 0 10px;
    display: flex;
    padding: 12px;
    border-radius: 12px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0px 4px 8px 0px rgba(231, 239, 247, 0.9);

    .left {
      position: relative;
      flex-shrink: 0;
      margin-right: 13px;
      .left-bg {
        width: 80px;
        height: 106px;
      }
      .bdc {
        width: 54px;
        height: 22px;
        position: absolute;
        top: 26px;
        left: 13px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .right-title {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        line-height: 22px;
        color: #343434;
      }
      .schedule {
        height: 6px;
        background: #d9eaff;
        margin-bottom: 10px;
        border-radius: 3px;
        .percentage {
          width: 30%;
          background: #0476ff;
          height: 6px;
          border-radius: 3px;
        }
      }
      .right-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #343434;

        .alreadyStudy {
          color: rgba(52, 52, 52, 0.5);
        }
        .reset {
          color: #4a89ff;
        }
      }
    }
  }
  .studyPlan {
    padding: 0 52px;
    margin: 30px 0 40px;

    .studyText {
      display: flex;
      // justify-content: center;
      // align-items: center;
      border-bottom: 1px solid rgba(151, 151, 151, 0.3);
      padding: 13px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #343434;
      view {
        width: 50%;
        text-align: center;
      }
    }
    .pickerInfo {
      position: relative;
      .selected-item {
        text-align: center;
        background: rgba($color: #4989ff, $alpha: 0.1);
        position: relative;
      }
      .selected-item::before {
        content: '';
        position: absolute;
        top: 0px;
        border: none;
      }
      .selected-item::after {
        content: '';
        position: absolute;
        bottom: 0;
        border: none;
      }

      .picker-item {
        text-align: center;
        border: none !important;
        line-height: 30px;
      }
      .left-column .picker-item {
        border-radius: 15px 0 0 15px;
      }
      .right-column .picker-item {
        border-radius: 0px 15px 15px 0px;
      }
      .icon {
        position: absolute;
        width: 18px;
        height: 18px;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        image {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
  .expect {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    line-height: 14px;
    color: #343434;
    display: flex;
    align-items: center;
    justify-content: center;
    text {
      color: #4a89ff;
    }
  }
  .footer {
    border-radius: 23px;
    background: #4a89ff;
    height: 46px;
    line-height: 46px;
    text-align: center;
    margin: 19px 45px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
    color: #f9f9f9;
  }
  .scrollInfo {
    .scroll-item {
      padding: 0 10px;
      border-bottom: 1px solid rgba(155, 155, 155, 0.1);
    }
    .list-item {
      margin: 0;
      box-shadow: none;
      padding: 12px;
      border-radius: 0;
      background: none;
      // background: #fff;
      .footerSched {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .schedule {
          height: 6px;
          flex: 1;
          margin-right: 3px;
          margin-bottom: 0;
        }
        .rightText {
          width: 50px;
          flex-shrink: 0;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #5c81ff;
          .delInfo {
            display: flex;
            align-items: center;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #343434;
            image {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
  }
  .addBtn {
    height: 110px;
    padding: 25px 22px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    view {
      height: 46px;
      border-radius: 23px;
      background: #4a89ff;
      line-height: 46px;
      color: #fff;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      text-align: center;
      color: #ffffff;
    }
  }
  .toastInfo {
    top: 30%;
    background: #fff;
    width: 280px;
    height: 180px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 18px;
    padding: 20px;
    text-align: center;
    .contentTitle {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      font-weight: 500;
      color: #06080d;
      margin: 6px;
    }
    .contentText {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      line-height: 20px;
      color: #666b6e;
      margin-bottom: 25px;
    }
    .contentBtn {
      display: flex;
      justify-content: space-between;
      view {
        width: 100px;
        height: 40px;
        box-sizing: border-box;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: #4a89ff;
        line-height: 40px;
        border-radius: 23px;
      }
      .cancel {
        border: 1px solid #4a89ff;
      }
      .confirm {
        background: #4a89ff;
        color: #fff;
      }
    }
  }
}
</style>
