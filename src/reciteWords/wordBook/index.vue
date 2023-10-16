<template>
  <view class="wordBookMain" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="选择词书" :fixedStyle="vdata.fixedStyle"></NavBar>
    <view class="setInfo">
      <view class="plan">
        <view class="bg">1</view>
        <text>选择学习词书</text>
      </view>
      <image
        class="jtInfo"
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/b33a283c57974eb283a30481b60cdf60/bdcjt.png"
        mode="scaleToFill"
      />
      <view class="set">
        <view class="bg">2</view>
        <text>设置学习计划</text>
      </view>
    </view>
    <view class="gradeList">
      <view
        :class="['grade-item', vdata.gradeType == i + 1 && 'grade-items']"
        v-for="(item, i) in vdata.gradeList"
        :key="i"
        @tap="gradeChange(item, i)"
        >{{ item.text }}</view
      >
    </view>
    <scroll-view class="versionInfo" :scroll-x="true" style="height: 45px">
      <view class="version-list">
        <view
          :class="['version-item', vdata.versionType === item.value && 'version-items']"
          v-for="(item, i) in vdata.versionList"
          :key="i"
          @tap="versionChange(item, i)"
          >{{ item.text }}
        </view>
      </view>
    </scroll-view>
    <scroll-view
      class="scrollInfo"
      :scroll-y="true"
      :style="{ height: `calc(100vh - ${navBarHeight + 288}px)` }"
    >
      <view class="scroll-list">
        <view
          class="scroll-item"
          v-for="(item, i) in vdata.versionList"
          :key="i"
          @tap="bookChange(item, i)"
        >
          <view :class="['list-item', vdata.bookType === item.value && 'list-items']">
            <view class="left">
              <image
                class="left-bg"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/446d8803ee0d48b4b2be1899549ce266/dcs.png"
                mode="scaleToFill"
              >
              </image>
            </view>
            <view class="right">
              <view class="right-title">单词书名称单词书名称 单词大声道</view>
              <view class="right-bottom">
                <text>2222词</text>
                <text>3234242人正在背</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="footer">
      <view :class="['footerBtn', vdata.bookType && 'footerBtns']" @tap="next">下一步</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
import { reactive } from 'vue'

const vdata = reactive({
  fixedStyle: {
    color: '#fff',
  },
  showRound: false,
  pronunciation: '',
  sound: '',
  gradeList: [
    {
      text: '少儿',
      value: 1,
    },
    {
      text: '小学',
      value: 2,
    },
    {
      text: '初中',
      value: 3,
    },
    {
      text: '高中',
      value: 4,
    },
    {
      text: '大学',
      value: 5,
    },
  ],
  gradeType: 1,
  versionList: [
    {
      text: '外研社',
      value: 1,
    },
    {
      text: '外研社',
      value: 2,
    },
    {
      text: '北大师',
      value: 3,
    },
    {
      text: '热门',
      value: 4,
    },
    {
      text: '测试的样式',
      value: 5,
    },
  ],
  versionType: 1,
  bookType: 1,
})
//年级改变
const gradeChange = (item, i) => {
  vdata.gradeType = i + 1
}
//版本改变
const versionChange = (item, i) => {
  vdata.versionType = item.value
}
//下一步
const next = () => {
  Taro.navigateTo({
    url: '../studyPlan/index',
  })
}
const bookChange = (item, i) => {
  vdata.bookType = item.value
}

useDidShow(() => {})
</script>
<style lang="scss">
.wordBookMain {
  height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/460e28cdddcb4e62b1752511362a4a48/bdcBg.png')
    no-repeat top;
  background-size: 100%;
  box-sizing: border-box;
  // display: flex;
  // flex-direction: column;

  .setInfo {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #343434;
    margin-bottom: 26px;
    .plan,
    .set {
      display: flex;
      flex-direction: column;
      align-items: center;
      .bg {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        text-align: center;
        line-height: 25px;
        margin-bottom: 6px;
        background: #fff;
        color: #4a89ff;
        font-weight: 500;
      }
    }
    .plan {
      margin-right: 57px;
      text {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        font-weight: 500;
        color: #4a89ff;
      }
      .bg {
        background: #4a89ff;
        color: #fff;
      }
    }
    .jtInfo {
      position: absolute;
      width: 73px;
      height: 6px;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .gradeList {
    padding: 0 22px;
    display: flex;
    justify-content: space-between;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #343434;
  }
  .grade-items {
    color: #0476ff;
    position: relative;
  }
  .grade-items::after {
    position: absolute;
    content: '';
    width: 100%;
    height: 4px;
    // top: 5px;
    bottom: -7px;
    left: 0;
    right: 0;
    background: #4a89ff;
    display: inline-block;
    border-radius: 2px;
  }
  .versionInfo {
    padding: 0 22px;
    margin-top: 26px;
    margin-bottom: 13px;
    .version-list {
      display: flex;
      .version-item {
        padding: 5px 17px;
        flex-shrink: 0;
        background: rgba(74, 137, 255, 0.1);
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #343434;
        margin-right: 10px;
        border-radius: 15px;
      }
      .version-items {
        background: #4a89ff;
        color: #fff;
      }
    }
  }
  .scrollInfo {
    // flex: 1;
    // height: 100%;
    padding-bottom: 10px;
    .scroll-item {
      padding: 16px 22px;
      border-top: 1px solid #efefef;

      .list-item {
        display: flex;
        padding: 14px 10px;
        border-radius: 10px;
        box-sizing: border-box;
        border: 1px solid #fff;
      }
      .list-items {
        border: 1px solid #4a89ff;
      }
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
        .right-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #343434;
        }
      }
    }
  }
  .footer {
    height: 110px;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    right: 0;
    display: flex;
    justify-content: center;
    background: #fff;
    .footerBtn {
      width: 285px;
      margin-top: 25px;
      height: 46px;
      border-radius: 23px;
      background: #c3c3c3;
      text-align: center;
      line-height: 46px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #f9f9f9;
    }
    .footerBtns {
      background: #4a89ff;
    }
  }
}
</style>
