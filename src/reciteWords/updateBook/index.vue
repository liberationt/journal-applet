<template>
  <view class="editUpdateMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar title="更换词书" :onClickBack="returnOrClose"></NavBar>
    <scroll-view
      class="scrollInfo"
      :scroll-y="true"
      @scrolltolower="lower"
      :style="{ height: `calc(100vh - ${navBarHeight + 95}px)` }"
    >
      <view class="scroll-item" v-for="(item, i) in vdata.recordList" :key="i">
        <view class="bookInfo list-item" @tap="changeBook(item)">
          <view class="left">
            <image
              class="left-bg"
              :src="
                item.coverUrl
                  ? item.coverUrl
                  : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/446d8803ee0d48b4b2be1899549ce266/dcs.png'
              "
              mode="scaleToFill"
            >
            </image>
          </view>
          <view class="right">
            <view class="right-title">
              <view>{{ item.bookTitle }}</view>
            </view>
            <view>
              <view class="right-bottom">
                <view class="already">
                  <text>已学习</text>
                  <text class="alreadyStudy">{{ item.hasStudyCount }}/{{ item.totalCount }}</text>
                </view>
                <view class="reset"></view>
              </view>
              <view class="footerSched">
                <view class="schedule">
                  <view class="percentage" :style="getProgress(item)"></view>
                </view>
                <view class="rightText">
                  <view v-if="item.currentStudy">当前在学</view>
                  <view v-else class="delInfo" @tap.stop="removeBook(item, i)">
                    <image
                      src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/728b80f3be0d4f6cb6e951982cd587e5/delete.png"
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
      <view @tap="addBook">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/03975662acdc495eb2708d37f21c71a7/add.png"
          mode="scaleToFill"
        />
        <text>添加词书</text>
      </view>
    </view>
    <nut-overlay v-model:visible="vdata.showTitle" :close-on-click-overlay="false">
      <view class="toastInfo">
        <view class="contentTitle">{{ vdata.title }}</view>
        <view class="contentText">
          <view v-if="vdata.operaType == 2">
            <view v-if="vdata.hasStudyCount"
              >你已经学习了该词书的{{ vdata.hasStudyCount }}个单词,</view
            >
            <view> 删除后将无法撤销，确定删除词书？</view>
          </view>
          <view v-if="vdata.operaType == 3">
            <view>是否确认切换至 </view>
            <view>“{{ vdata.currentTitle }}”</view>
          </view>
        </view>
        <view class="contentBtn">
          <view class="cancel" @tap="cancel">取消</view>
          <view class="confirm" @tap="confirm">
            {{ vdata.operaType == 2 ? '删除词书' : '更换词书' }}
          </view>
        </view>
      </view>
    </nut-overlay>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { getRecordInfo } from '@/api/reciteWords'
import { useSystem, useRecite } from '@/stores'
import { grandeKey, termKey } from '@/utils/common'

const recite = useRecite()
const system = useSystem()
const router = useRouter()
const { navBarHeight } = system.navBarInfo
import { reactive, computed } from 'vue'

const vdata = reactive({
  fixedStyle: {
    color: '#fff',
  },
  showTitle: false,
  title: '',
  tabType: 1,
  operaType: 1,
  bookId: '',
  current: '',
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
  recordList: [],
  total: 0,
  currentStudyId: '',
  hasStudyCount: '',
  currentTitle: '',
})
const getProgress = (item) => {
  let width = Math.round((item.hasStudyCount / item.totalCount) * 100)
  return {
    width: `${width}%`,
  }
}
//取消操作
const cancel = () => {
  vdata.showTitle = false
}

//添加词书
const addBook = () => {
  Taro.navigateTo({
    url: `../chooseBook/index?currentStudyId=${vdata.currentStudyId}`,
  })
}
//更换词书
const changeBook = (item) => {
  if (vdata.currentStudyId == item.bookId) {
    Taro.navigateBack({ delta: router.params.isFlag ? 2 : 1 })
  } else {
    vdata.title = '更换词书'
    vdata.showTitle = true
    vdata.operaType = 3
    vdata.bookId = item.bookId
    vdata.currentTitle = item.bookTitle
  }
}
//删除
const removeBook = (item, i) => {
  vdata.bookId = item.bookId
  vdata.title = '删除词书'
  vdata.showTitle = true
  vdata.operaType = 2
  vdata.current = i
  vdata.currentTitle = item.bookTitle
  vdata.hasStudyCount = item.hasStudyCount
}
//确认
const confirm = () => {
  if (vdata.operaType == 2) {
    getRecordInfo('deleteStudyRecord', { bookId: vdata.bookId }).then((res) => {
      if (res) {
        Taro.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000,
        })
        vdata.recordList.splice(vdata.current, 1)
      }
      vdata.showTitle = false
    })
  } else {
    let params = {
      currentBookId: vdata.bookId,
      originCurrentBookId: vdata.currentStudyId,
    }

    getRecordInfo('update', params, true).then((res: any) => {
      if (res) {
        let version = {
          grade: grandeKey[res.grade],
          version: res.version,
          term: termKey[res.term],
        }
        recite.setVersion(version)
        Taro.showToast({
          title: '更换成功',
          icon: 'none',
          duration: 2000,
        })
        vdata.showTitle = false
        Taro.navigateBack({ delta: router.params.isFlag ? 2 : 1 })
      }
    })
  }
}
const returnOrClose = () => {
  Taro.navigateBack({ delta: router.params.isFlag ? 2 : 1 })
}
const getList = () => {
  getRecordInfo('bookRecord', vdata.searchInfo, true).then((res: any) => {
    if (res) {
      vdata.recordList = res.records
      vdata.total = res.total
      let currentList = vdata.recordList.filter((item: any) => item.currentStudy) || []
      if (currentList && currentList.length) {
        vdata.currentStudyId = currentList[0].bookId || ''
      }
    }
  })
}
// 分页
const lower = () => {
  if (hasNext()) {
    getList()
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
useDidShow(() => {
  if (router.params.currentStudyId) {
    vdata.currentStudyId = router.params.currentStudyId
  }
  getList()
})
</script>
<style lang="scss">
.editUpdateMain {
  height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/460e28cdddcb4e62b1752511362a4a48/bdcBg.png')
    no-repeat top;
  background-size: 100%;
  box-sizing: border-box;
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
        border-radius: 8px;
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
      flex: 1;
      .right-title {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        line-height: 22px;
        color: #343434;
      }
      .schedule {
        height: 6px;
        background: #e0eaff;
        margin-bottom: 10px;
        border-radius: 3px;
        margin-top: 2px;
        .percentage {
          width: 30%;
          background: #2f5de7;
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
          padding-left: 5px;
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
      // padding: 0 10px;
      border-bottom: 1px solid rgba(155, 155, 155, 0.1);
    }
    .list-item {
      margin: 0;
      box-shadow: none;
      padding: 16px 22px;
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
          margin-right: 10px;
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
              margin-right: 3px;
            }
          }
        }
      }
    }
  }
  .addBtn {
    height: 95px;
    padding: 15px 22px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    view {
      height: 46px;
      border-radius: 23px;
      background: #2f5de7;
      line-height: 46px;
      color: #fff;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      text-align: center;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        width: 16px;
        height: 16px;
        margin-right: 3px;
      }
    }
  }
  .toastInfo {
    top: 30%;
    background: #fff;
    width: 280px;
    // height: 180px;
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
      color: #666;
      margin-bottom: 25px;
    }
    .contentBtn {
      display: flex;
      justify-content: space-between;
      view {
        width: 110px;
        height: 40px;
        box-sizing: border-box;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: #2f5de7;
        line-height: 40px;
        border-radius: 23px;
      }
      .cancel {
        border: 1px solid #2f5de7;
      }
      .confirm {
        background: #2f5de7;
        color: #fff;
      }
    }
  }
}
</style>
