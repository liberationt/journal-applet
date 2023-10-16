<template>
  <view>
    <view
      class="supportingAnswers"
      :style="{
        background: '#F3F4F6',
      }"
    >
      <NavBar :fixedStyle="vdata.fixedStyle"></NavBar>
      <view class="container" :style="{ paddingTop: `${navBarHeight + 15}px` }">
        <view class="main">
          <view class="weeklyContent">
            <view class="left">
              <image :src="vdata.propsDataObj.journalCoverUrl"></image>
            </view>
            <view class="right">
              <view class="title">{{ vdata.propsDataObj.journalName }}</view>
              <text class="detail">
                {{ vdata.propsDataObj.journalFirm }}
              </text>
              <text class="detail">|</text>
              <text class="detail">
                {{ vdata.propsDataObj.journalGrade }}{{ vdata.propsDataObj.journalTerm }}
              </text>
            </view>
          </view>
        </view>
      </view>
      <view class="answerBox">
        <!-- 语文、数学 -->
        <view class="box" v-if="vdata.propsDataObj.subjectId != '3'">
          <view class="colorBlock"></view>
          <view class="title">配套答案</view>
          <image
            v-if="!user.vip"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/0a8c12beb60f47828c89f073e09e5610/vipIcon.png"
          ></image>
        </view>
        <!-- 英语 -->
        <view class="boxEngish" v-else>
          <image
            v-if="!user.vip"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/0a8c12beb60f47828c89f073e09e5610/vipIcon.png"
          ></image>
          <view class="tabs" v-for="(item, index) in vdata.tabsList" :key="index">
            <view
              @tap="changeBtn(item)"
              :class="['label', vdata.selectId == index && 'selectLabel']"
              >{{ item.label }}</view
            >
            <view v-show="vdata.selectId == index" class="block"></view>
          </view>
        </view>
      </view>
      <view class="listBottom">
        <!-- 配套答案 -->
        <answersList
          :propsDataObj="vdata.propsDataObj"
          :selectId="vdata.selectId"
          v-if="vdata.selectId == '0'"
        ></answersList>
        <!-- 配套听力 -->
        <hearingList
          v-if="vdata.selectId == '1'"
          :propsDataObj="vdata.propsDataObj"
          :selectId="vdata.selectId"
        ></hearingList>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { getCurrentInstance } from '@tarojs/taro' //接收参数需引入这个路由
import { useSystem } from '@/stores'
import NavBar from '@/components/NavBar.vue'
import answersList from '../answersList/index.vue'
import hearingList from '../hearingList/index.vue'
import { onMounted, reactive } from 'vue'
import { useUser } from '@/stores'
const user = useUser()

const system = useSystem()
const { navBarHeight, statusBarHeight, menuHeight } = system.navBarInfo

const vdata = reactive({
  type: '',
  selectId: '1',
  propsDataObj: {},
  tabsList: [
    {
      label: '配套答案',
      id: '0',
    },
    {
      label: '配套听力',
      id: '1',
    },
  ],
  fixedStyle: {
    color: '',
  },
})
const changeBtn = (item) => {
  vdata.selectId = item.id
}
onMounted(() => {
  const { dataInfoObj, type } = getCurrentInstance().router.params
  vdata.type = type
  vdata.propsDataObj = JSON.parse(dataInfoObj)
  if (type == 'check') {
    vdata.selectId = '0'
  } else {
    vdata.selectId = '1'
  }
})
const scroll = ({ detail }) => {
  if (detail.scrollTop > 20) {
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
</script>
<style lang="scss">
.supportingAnswers {
  min-height: 100vh;
  .container {
    margin-bottom: 16px;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/b19a585a5b8c4f93b1cdc5d952b0f66d/supportingAnswers.png')
      no-repeat top;
    background-size: 100%;
    box-sizing: border-box;
    .main {
      padding: 0 16px;
      .weeklyContent {
        display: flex;
        .left {
          width: 70px;
          height: 70px;
          // background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/c51259c2124f494590d9fd57e43ec020/languageIcon.png')
          //   no-repeat top;
          // background-size: 100% 100%;
          margin-right: 15px;
          display: inline-block;
          vertical-align: middle;
          margin-top: 2px;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .right {
          display: inline-block;
          // height: 46px;
          vertical-align: middle;
          width: 260px;
          .title {
            // display: inline-block;
            height: 46px;
            line-height: 23px;
            margin-bottom: 9px;
            font-size: 16px;
            color: #333333;
            overflow: hidden;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            font-weight: 600;
          }
          .detail {
            margin-right: 8px;
            font-size: 12px;
            color: #999999;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .answerBox {
    padding: 0 16px;
    height: 54px;
    width: 100%;
    .box {
      height: 54px;
      line-height: 54px;
      position: relative;
      image {
        width: 28px;
        height: 13px;
        position: absolute;
        top: 8px;
        left: 75px;
      }
      .colorBlock {
        display: inline-block;
        width: 3px;
        height: 16px;
        border-radius: 308px;
        background: #4a89ff;
        vertical-align: middle;
        margin-right: 8px;
      }
      .title {
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        vertical-align: middle;
      }
    }
    .boxEngish {
      position: relative;
      image {
        width: 28px;
        height: 13px;
        position: absolute;
        top: 8px;
        left: 64px;
      }
      .tabs {
        padding-top: 16px;
        display: inline-block;
        margin-right: 32px;
        font-size: 16px;
        color: #333333;
        .label {
          margin-bottom: 13px;
        }
        .selectLabel {
          font-weight: 600;
        }
        .block {
          width: 32px;
          height: 3px;
          border-radius: 308px;
          margin: 0 auto;
          background: #4a89ff;
        }
      }
    }
  }
  .listBottom {
    max-height: 560px;
    padding: 16px;
    overflow-y: auto;
  }
}
</style>
