<template>
  <view class="rankMain" :style="{ paddingTop: `${navBarHeight + 10}px` }">
    <NavBar title="PK排行榜" :fixedStyle="vdata.fixedStyle" />
    <view class="topInfo">
      <view class="phb" @tap="vdata.showRule = true"
        ><image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/984731c3a7fc4f8db6f8e64e52787d6e/info.png"
          mode="scaleToFill"
        />
        <text>排行规则</text></view
      >
    </view>
    <view class="rankText">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/dbe6118453e64b31ba0a01628d7eda15/text.png"
        mode="scaleToFill"
      />
    </view>
    <view class="viewMain" :style="{ top: `${navBarHeight + 170}px` }">
      <template v-if="vdata.rankList.length">
        <view class="myGrand">
          <view class="leftInfo">
            <view class="leftText">
              <text>我的</text>
              <text>成绩</text>
            </view>
            <view class="myImg">
              <image
                :src="
                  vdata.myInfo?.portraitUrl
                    ? vdata.myInfo.portraitUrl
                    : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/ad4fecc900cf4bfe896d9261c7c8e2b8/defaultImg.png'
                "
                mode="scaleToFill"
              />
            </view>
            <view class="nc">{{ vdata.myInfo?.name }}</view>
          </view>
          <view class="pm">{{
            vdata.myInfo?.rank > 100 ? '暂未上榜' : `第${vdata.myInfo?.rank}名`
          }}</view>
          <view class="grand">{{ vdata.myInfo?.score || 0 }}分</view>
        </view>
        <view class="listTitle">
          <view class="left">
            <text>排名</text>
            <text>昵称</text>
          </view>
          <view class="right">得分</view>
        </view>
        <scroll-view
          class="scroll-content"
          :scroll-y="true"
          @scrolltolower="lower"
          :style="{ height: `calc(100vh - ${navBarHeight + 284}px)` }"
        >
          <view class="scrollList">
            <view
              v-for="(item, i) in vdata.rankList"
              :class="['scrollItem', i < 3 && 'fontScroll']"
              :key="i"
            >
              <view class="leftInfo">
                <view class="pmNumber">
                  <template v-if="i === 0">
                    <image
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/9fb0ace8a3f84e84af5e6715dca41365/first.png"
                      mode="scaleToFill"
                    />
                  </template>
                  <template v-else-if="i === 1">
                    <image
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/e493d78ddbe44d79bc4617f04e4315c7/scend.png"
                      mode="scaleToFill"
                    />
                  </template>
                  <template v-else-if="i === 2">
                    <image
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/14813f09c0764515b0c63827a465e5cf/three.png"
                      mode="scaleToFill"
                    />
                  </template>
                  <template v-else>
                    {{ i + 1 }}
                  </template>
                </view>
                <view>
                  <image
                    :src="
                      item.userPortraitUrl
                        ? item.userPortraitUrl
                        : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/ad4fecc900cf4bfe896d9261c7c8e2b8/defaultImg.png'
                    "
                    mode="scaleToFill"
                  />
                </view>
                <view class="nickName">{{ item.userName }}</view>
              </view>
              <view class="rightInfo"> {{ item.totalScore }}分 </view>
            </view>
          </view>
        </scroll-view>
      </template>
      <template v-else>
        <view class="noData">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/c45ddf6632c547edbaccf7373208881d/noPm.png"
            mode="scaleToFill"
          />
          <view>暂无排名</view>
        </view>
      </template>
    </view>
    <nut-overlay v-model:visible="vdata.showRule" :close-on-click-overlay="false">
      <view class="toastInfo">
        <view class="contentText">
          <view class="title">排行榜规则</view>
          <view class="rules">
            <view>1.统计用户本月所有PK场次里累计的得分进行排行（仅统计前100名）</view>
            <view>2.排行榜每小时更新一次最新排行</view>
            <view>3.每月初零点清除上月排行，重新进行新一月的统计</view>
          </view>
        </view>
        <view class="contentBtn">
          <view class="handleWidth" @tap="vdata.showRule = false">知道了</view>
        </view>
      </view>
    </nut-overlay>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
import { reactive, onMounted } from 'vue'
import { queryMyScore, questionAnswerPk } from '@/api/intelligentQuestion'
const vdata: any = reactive({
  searchInfo: {
    condition: {},
    current: 1,
    orders: [
      {
        asc: true,
        column: '',
      },
    ],
    size: 10,
  },
  myInfo: null,
  rankList: [],
  total: 0,
  fixedStyle: {
    color: '#fff',
  },
  showRule: false,
})

const getMyCount = () => {
  queryMyScore().then((res) => {
    if (res) {
      vdata.myInfo = res
    }
  })
}
const getRain = () => {
  questionAnswerPk('getRankingPage', vdata.searchInfo).then((res: any) => {
    if (res) {
      vdata.rankList = vdata.rankList.concat(res.records || [])
      vdata.total = res.total
    }
  })
}
// 分页
const lower = () => {
  if (hasNext()) {
    getRain()
  }
}
const hasNext = () => {
  if (vdata.searchInfo.current * vdata.searchInfo.size < vdata.total) {
    vdata.searchInfo.current = vdata.searchInfo.current + 1
    return true
  } else {
    return false
  }
}

onMounted(() => {
  getMyCount()
  getRain()
})
</script>
<style lang="scss">
.rankMain {
  height: 100vh;
  position: relative;
  box-sizing: border-box;
  background-image: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pk/c1efc96118c34bbe84f9a49bb25cdd92/phb.png');
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100%;
  box-sizing: border-box;
  .topInfo {
    padding-right: 10px;
    display: flex;
    justify-content: flex-end;
    .phb {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 22px;
      border-radius: 11px;
      background: rgba(0, 0, 0, 0.2);
      font-family: PingFangSC-Regular;
      font-size: 10px;
      color: #ffffff;
      image {
        width: 10px;
        height: 10px;
        margin-right: 2px;
      }
    }
  }
  .rankText {
    margin-top: 14px;
    padding-left: 37px;
    image {
      width: 131px;
      height: 48px;
    }
  }
  .viewMain {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px 20px 0 0;
    box-sizing: border-box;
    background: #fff;
    padding-top: 20px;
    .myGrand {
      margin: 0 10px 20px;
      background: #fff8ed;
      height: 54px;
      border-radius: 12px;
      box-sizing: border-box;
      border: 2px solid #ffe5c9;
      padding: 0 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #414141;
      .leftInfo {
        display: flex;
        flex: 1;
        align-items: center;
      }
      .leftText {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #ff6500;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
      }
      .nc {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 600;
      }
      .myImg {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        flex-shrink: 0;
        margin: 0 12px;
        image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .pm {
        width: 57px;
        text-align: center;
        flex-shrink: 0;
      }
      .grand {
        width: 80px;
        flex-shrink: 0;
        text-align: right;
      }
    }
    .listTitle {
      display: flex;
      justify-content: space-between;
      padding: 0 30px 0 22px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #999999;
      .left {
        display: flex;
        text {
          margin-right: 20px;
        }
      }
    }
    .scroll-content {
      .scrollList {
        padding: 10px;
        .scrollItem {
          height: 46px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #414141;
          padding-right: 20px;
          box-sizing: border-box;
          .leftInfo {
            display: flex;
            align-items: center;
            height: 100%;
            flex: 1;
            image {
              width: 36px;
              height: 36px;
              border-radius: 50%;
            }
            .pmNumber {
              width: 50px;
              text-align: center;
              flex-shrink: 0;
              image {
                width: 36px;
                height: 22px;
                flex-shrink: 0;
                margin-top: 3px;
              }
            }
            .nickName {
              margin-left: 5px;
              flex: 1;
              max-width: 150px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .rightInfo {
            width: 75px;
            text-align: right;
            flex-shrink: 0;
          }
        }
        .fontScroll {
          background: linear-gradient(270deg, #f6f9ff 0%, #e0eaff 100%);
          border-radius: 12px;
        }
      }
    }
  }
  .noData {
    position: absolute;
    top: 100px;
    // left: 50%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #414141;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 20px;
    }
  }
  .toastInfo {
    top: 50%;
    background: #fff;
    width: 280px;
    // height: 163px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 18px;
    padding: 22px 20px;
    .contentText {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #333333;
      margin-bottom: 24px;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #06080d;
        text-align: center;
        margin-bottom: 10px;
      }
      .rules {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        line-height: 20px;
        color: #666b6e;
      }
    }
    .contentBtn {
      .handleWidth {
        height: 40px;
        line-height: 40px;
        width: 236px;
        border-radius: 24.5px;
        background: #2f5de7;
        color: #f9f9f9;
        text-align: center;
        margin: 0 auto;
      }
    }
  }
}
</style>
