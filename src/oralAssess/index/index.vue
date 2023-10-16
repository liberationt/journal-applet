<template>
  <view class="oralAssessMain" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="口语测评" :fixedStyle="vdata.fixedStyle" />
    <view class="bookInfo">
      <view class="leftImg">
        <image :src="vdata.versionInfo.coverImage" alt="" />
      </view>
      <view>
        <view class="bookTitle"
          >{{ vdata.versionInfo?.version }}·{{ vdata.versionInfo?.grade
          }}{{ vdata.versionInfo?.term }}</view
        >
        <view class="bookChange" @tap="changeBook">
          <img
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/37d35ec7409d43208ce84095b616b5cd/bookChange.png"
            alt=""
          />
          <text>切换教材</text>
        </view>
      </view>
      <view class="collectInfo" @click="toCollect">
        <img
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/528eab68f33e4fc0b1913d83e2fa53e5/collect.png"
          alt=""
        />
        <text>我的收藏</text>
      </view>
    </view>
    <view class="cardInfo" :style="{ height: `calc(100vh - ${navBarHeight + 150}px)` }">
      <template v-if="!vdata.bookList.length">
        <view class="noData">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/2e9d54fd01124007ab8f3d092bc580d8/noWeeklyReport.png"
          ></image>
          <view>暂无教材内容</view>
        </view>
      </template>
      <template v-else>
        <nut-collapse :active="activeNames" @update:active="onUpdateActive" icon="down-arrow">
          <nut-collapse-item
            :name="i + 1"
            :title="item.unitValue"
            v-for="(item, i) in vdata.bookList"
            :key="i"
          >
            <view
              v-for="(vtem, key) in item.sectionInfoDtoList"
              :key="key"
              class="scend-item"
              @tap="toStudy(item, vtem)"
            >
              <view>{{ vtem.sectionName }}</view>
              <view v-if="vtem.score !== null">
                <view class="good" v-if="vtem.score >= 80">{{ gerScore(vtem.score) }}分</view>
                <view class="fail" v-else-if="vtem.score < 60">{{ gerScore(vtem.score) }}分</view>
                <view class="center" v-else>{{ gerScore(vtem.score) }}分</view>
              </view>
              <view class="study" v-else>去学习</view>
            </view>
          </nut-collapse-item>
        </nut-collapse>
      </template>
    </view>
    <bookVersion ref="versionBook" @chooseBook="bookChange" />
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, usePerson, useUser } from '@/stores'
import bookVersion from '@/components/bookVersion.vue'
import { termInfo, classInfo, grandeKey, termKey } from '@/utils/common'
import { getOralInfo } from '@/api/oralAssess'
import { getLastRecord } from '@/api/index'

import { getTryCount } from '@/api/index'
import { debounce } from '@/utils/index'
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const user = useUser()

const system = useSystem()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
import { reactive, ref, onMounted } from 'vue'
const activeNames = ref([1])
const versionBook = ref()
const vdata: any = reactive({
  bookId: '',
  versionSearch: {
    grade: '',
    version: '',
    term: '',
  },
  versionInfo: {
    term: '',
    grade: '',
    version: '',
    bookId: '',
    coverImage: '',
  },
  bookList: [],
})

const onUpdateActive = (val) => {
  activeNames.value = val
}
// 去学习
const toStudy = debounce(async (item, vtem) => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '口语测评', funCourseName: null })
    // vdata.termItemInfo = item
    if (memberInfo.vipState == 1) {
      if (memberInfo.tryFlag == 1) {
        if (memberInfo.configCount <= memberInfo.hasTryCount) {
          memberToast.value.showToast(false)
        } else {
          memberToast.value.showToast(
            true,
            memberInfo.configCount,
            memberInfo.hasTryCount,
            item,
            vtem
          )
        }
      } else {
        memberToast.value.showToast(false)
      }
    } else {
      handleNavigate(item, vtem)
    }
  } else {
    handleNavigate(item, vtem)
  }
})
const handleNavigate = (item, vtem) => {
  const params = {
    unitKey: item.unitKey,
    type: vtem.type,
    sectionKey: vtem.sectionKey,
    bookId: vdata.bookId,
  }
  personInfo.setSearchOra(params)
  if (vtem.score === null) {
    Taro.navigateTo({
      url: '../beginStudy/index',
    })
  } else {
    Taro.navigateTo({
      url: '../assessResult/index',
    })
  }
}
const gerScore = (val) => {
  if (val) {
    val = Math.round(val)
  }
  return val
}
// const toDetail = (item, vtem) => {
//   const params = {
//     unitKey: item.unitKey,
//     type: vtem.type,
//     sectionKey: vtem.sectionKey,
//     bookId: vdata.bookId,
//   }
//   personInfo.setSearchOra(params)
//   Taro.navigateTo({
//     url: '../assessResult/index',
//   })
// }
//版本切换
const changeBook = () => {
  versionBook.value.popupShow(1, '/oral/bookList', vdata.versionInfo?.version)
}
//选择版本回调
const bookChange = () => {
  getQueryInfo()
}
//收藏
const toCollect = () => {
  Taro.navigateTo({
    url: '../collectList/index',
  })
}
const queryList = () => {
  getOralInfo('bookDetail', vdata.versionSearch).then((res: any) => {
    vdata.bookList = res.unitInfoDtoList || []
    vdata.bookId = res.bookId || ''
  })
}
const getQueryInfo = () => {
  let versionSearch = JSON.parse(JSON.stringify(personInfo.versionInfo))
  vdata.versionSearch = {
    grade: classInfo[versionSearch.grade],
    version: versionSearch.version,
    term: termInfo[versionSearch.term],
  }
  vdata.versionInfo = {
    term: versionSearch.term,
    grade: versionSearch.grade,
    version: versionSearch.version,
    bookId: versionSearch.bookId,
    coverImage: versionSearch.coverImage,
  }
  queryList()
}
const queryRecord = () => {
  let params = {
    subject: 3,
  }
  getLastRecord(params).then((res: any) => {
    if (res.version) {
      vdata.versionSearch = {
        grade: res.grade,
        version: res.version,
        term: res.term,
      }
      vdata.versionInfo = {
        term: termKey[res.term],
        grade: grandeKey[res.grade],
        version: res.version,
        bookId: res.bookId || '',
        coverImage: res.coverImageUrl || '',
      }
      queryList()
    } else {
      getQueryInfo()
    }
  })
}
// onMounted(() => {
//   queryRecord()
//   // getQueryInfo()
// })
useDidShow(() => {
  queryRecord()
})
</script>
<style lang="scss">
.oralAssessMain {
  height: 100vh;
  background-image: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/d40085b77a134864893f8c504ffce819/bg.png');
  background-size: 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
  background-color: #f3f4f6;
  .bookInfo {
    display: flex;
    position: relative;
    margin-bottom: 28px;
    padding: 0 16px;
    box-sizing: border-box;
    .leftImg {
      width: 71px;
      height: 106px;
      margin-right: 12px;
      image {
        width: 71px;
        height: 106px;
      }
    }
    .bookTitle {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: normal;
      color: #333333;
      margin-bottom: 15px;
    }
    .bookChange {
      display: flex;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      align-items: center;
      img {
        width: 14px;
        height: 14px;
        margin-right: 3px;
      }
    }
    .collectInfo {
      display: flex;
      position: absolute;
      bottom: 0;
      align-items: center;
      justify-content: center;
      right: 0px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      background: #f6f9fd;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.08);
      width: 92px;
      height: 28px;
      text-align: center;
      border-radius: 20px 0 0 20px;
      img {
        width: 14px;
        height: 14px;
      }
    }
  }
  .cardInfo {
    overflow-y: scroll;
    padding: 0 16px;
    box-sizing: border-box;

    .nut-collapse-item {
      margin-bottom: 12px;
      border-radius: 8px;
      overflow: hidden;
      .collapse-item {
        padding: 17px 16px;
        .collapse-title-value {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          /* 个人/正文#333333 */
          color: #333333;
        }
      }
    }
    .scend-item {
      font-family: PingFang SC;
      font-size: 14px;
      color: #666666;
      display: flex;
      align-content: center;
      justify-content: space-between;
      padding: 17px 0;
      border-bottom: 1px solid #ecf0f6;
      .study {
        width: 60px;
        height: 28px;
        background: #2f5de7;
        text-align: center;
        line-height: 28px;
        font-size: 12px;
        font-weight: normal;
        color: #ffffff;
        border-radius: 20px;
      }
      .good {
        color: #5db75d;
      }
      .center {
        color: #ffb81a;
      }
      .fail {
        color: #ff230a;
      }
    }
  }
  .noData {
    text-align: center;
    padding-top: 72px;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 30px;
    }
    view {
      font-size: 14px;
      text-align: center;
      color: #414141;
    }
  }
}
</style>
