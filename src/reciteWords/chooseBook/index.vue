<template>
  <view class="wordBookMain" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="选择词书"></NavBar>
    <view class="gradeList">
      <view
        :class="['grade-item', vdata.gradeType === item.value && 'grade-items']"
        v-for="(item, i) in vdata.gradeList"
        :key="i"
        @tap="gradeChange(item)"
        >{{ item.text }}</view
      >
    </view>
    <scroll-view class="versionInfo" :scroll-x="true" style="height: 45px">
      <view class="version-list">
        <view
          :class="['version-item', vdata.versionType === item.versionId && 'version-items']"
          v-for="(item, i) in vdata.versionList"
          :key="i"
          @tap="versionChange(item, i)"
          >{{ item.versionValue }}
        </view>
      </view>
    </scroll-view>
    <scroll-view
      class="scrollInfo"
      :scroll-y="true"
      :style="{ height: `calc(100vh - ${navBarHeight + 195}px)` }"
      v-if="vdata.bookList.length"
    >
      <view class="scroll-list">
        <view
          class="scroll-item"
          v-for="(item, i) in vdata.bookList"
          :key="i"
          @tap="bookChange(item)"
        >
          <view :class="['list-item', vdata.bookType == item.bookId && 'list-items']">
            <view class="left">
              <image class="left-bg" :src="item.coverUrl" mode="scaleToFill"> </image>
            </view>
            <view class="right">
              <view class="right-title">{{ item.bookTitle }}</view>
              <view class="right-bottom">
                <text>{{ item.totalWordCount }}词</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="noData" v-else>
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
      />
      <view>暂无版本教材</view>
    </view>
    <view class="footer">
      <view :class="['footerBtn', vdata.bookType && 'footerBtns']" @tap="next">确定</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, useRecite } from '@/stores'
import { getRecordInfo, getVersionList } from '@/api/reciteWords'
import { grandeKey, termKey } from '@/utils/common'
const system = useSystem()
const router = useRouter()
const recite = useRecite()
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
      text: '小学',
      value: 1,
    },
    {
      text: '初中',
      value: 2,
    },
    {
      text: '高中',
      value: 3,
    },
  ],
  gradeType: 1,
  versionList: [],
  bookList: [],
  versionType: '',
  bookType: '',
  currentStudyId: '',
})
//年级改变
const gradeChange = (item) => {
  vdata.gradeType = item.value
  vdata.bookType = ''
  queryList()
}
//版本改变
const versionChange = (item) => {
  vdata.versionType = item.versionId
  vdata.bookType = ''
  queryList()
}
//下一步
const next = () => {
  let params = {
    currentBookId: vdata.bookType,
    originCurrentBookId: vdata.currentStudyId,
  }
  if (vdata.currentStudyId == vdata.bookType) {
    Taro.redirectTo({
      url: `../updateBook/index?isFlag=2`,
    })
  } else {
    getRecordInfo('update', params).then((res: any) => {
      if (res) {
        let version = {
          grade: grandeKey[res.grade],
          version: res.version,
          term: termKey[res.term],
        }
        recite.setVersion(version)
        Taro.redirectTo({
          url: `../updateBook/index?isFlag=2&currentStudyId=${vdata.currentStudyId}`,
        })
      }
    })
  }
}
const bookChange = (item) => {
  vdata.bookType = item.bookId
}
//获取版本
const queryVersionList = () => {
  getVersionList().then((res: any) => {
    if (res) {
      vdata.versionList = res.bookVersionDTOList || []
      vdata.versionType = vdata.versionList[0].versionId || ''
      queryList()
    }
  })
}
//获取列表
const queryList = () => {
  let params = {
    studyPeriod: vdata.gradeType,
    versionId: vdata.versionType,
  }
  getRecordInfo('page', params, true).then((res) => {
    if (res) {
      vdata.bookList = res || []
    }
  })
}
useDidShow(() => {
  if (router.params.currentStudyId) {
    vdata.currentStudyId = router.params.currentStudyId
  }
  queryVersionList()
})
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
    // justify-content: space-between;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #666666;
    .grade-item {
      margin-right: 42px;
    }
    .grade-items {
      color: #2f5de7;
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
      background: #2f5de7;
      display: inline-block;
      border-radius: 2px;
    }
  }

  .versionInfo {
    padding: 0 22px;
    margin-top: 26px;
    border-bottom: 1px solid #efefef;
    // margin-bottom: 13px;
    .version-list {
      display: flex;
      .version-item {
        padding: 5px 17px;
        flex-shrink: 0;
        background: #e0eaff;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #343434;
        margin-right: 10px;
        border-radius: 15px;
      }
      .version-items {
        background: #2f5de7;
        color: #fff;
        font-family: PingFangSC-Medium;
      }
    }
  }
  .scrollInfo {
    // flex: 1;
    // height: 100%;
    padding-bottom: 10px;
    .scroll-item {
      padding: 6px 13px;
      border-bottom: 1px solid #efefef;

      .list-item {
        display: flex;
        padding: 10px;
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
        padding: 5px 0 10px;
        .right-title {
          font-family: PingFangSC-Regular;
          font-size: 18px;
          line-height: 22px;
          color: #343434;
        }
        .right-bottom {
          // display: flex;
          // justify-content: space-between;
          // align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #343434;
        }
      }
    }
  }
  .footer {
    height: 93px;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    right: 0;
    display: flex;
    justify-content: center;
    background: #fff;
    padding: 15px 23px 0;
    .footerBtn {
      width: 100%;
      height: 46px;
      border-radius: 23px;
      background: #eee;
      text-align: center;
      line-height: 44px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #cbcbcb;
    }
    .footerBtns {
      background: #2f5de7;
      color: #ffffff;
    }
  }
  .noData {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transform: translate(-50%, -50%);
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #414141;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 20px;
    }
  }
}
</style>
