<template>
  <view class="dictationExercise" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar title="" />
    <view class="bookInfo">
      <view class="leftImg">
        <image
          :src="
            vdata.versionInfo?.coverImage
              ? vdata.versionInfo?.coverImage
              : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/5e8f4847e2fc42df9ec0e3d73f47e5e3/classBg.png'
          "
          alt=""
        />
      </view>
      <view>
        <view class="bookTitle"
          >{{ vdata.versionInfo?.version }}·{{ vdata.versionInfo?.grade
          }}{{ vdata.versionInfo?.term }}</view
        >
        <view class="bookChange" @tap="changeBook">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/37d35ec7409d43208ce84095b616b5cd/bookChange.png"
            alt=""
          />
          <text>切换教材</text>
        </view>
      </view>
    </view>
    <view class="noData" v-if="!vdata.bookList.length">
      <view class="topNoData">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
        />
        <text>暂无课程</text>
      </view>
    </view>
    <view v-else class="cardInfo" :style="{ height: `calc(100vh - ${navBarHeight + 150}px)` }">
      <nut-collapse :active="activeNames" @update:active="onUpdateActive" icon="down-arrow">
        <nut-collapse-item
          :name="i + 1"
          :title="item.unitValue"
          v-for="(item, i) in vdata.bookList"
          :key="i"
        >
          <view v-for="(vtem, key) in item.sectionInfoDtoList" :key="key">
            <view class="scend-item">
              <view>{{ vtem.sectionName }}</view>
              <view class="study" @tap="study(item, vtem)">去听写</view>
            </view>
          </view>
        </nut-collapse-item>
      </nut-collapse>
    </view>
    <bookVersion ref="versionBook" @chooseBook="bookChange" />
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, usePerson, useUser } from '@/stores'
import { termInfo, classInfo, termKey, grandeKey } from '@/utils/common'
import { getDicExeInfo } from '@/api/dictationExercise'
import bookVersion from '@/components/bookVersion.vue'
import { getLastRecord, getTryCount } from '@/api/index'
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
const vdata = reactive({
  activeNames: [1],
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
  bookId: '',
})
//版本切换
const changeBook = () => {
  versionBook.value.popupShow(2, '/dicExe/bookList', vdata.versionInfo?.version)
}
//选择版本回调
const bookChange = () => {
  getQueryInfo()
}

const onUpdateActive = (val) => {
  console.log(val, 99999)
  activeNames.value = val
}
//
const study = debounce(async (item, vtem) => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '听写训练', funCourseName: null })
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
  let params = {
    unitKey: item.unitKey,
    sectionKey: vtem.sectionKey,
    bookId: vdata.bookId,
  }
  personInfo.setSearchDic(params)
  Taro.navigateTo({
    url: '../traninSelect/index',
  })
}
const queryList = () => {
  vdata.bookList = []
  activeNames.value = [1]
  getDicExeInfo('bookDetail', vdata.versionSearch).then((res: any) => {
    if (res) {
      vdata.bookList = res.unitInfoDtoList || []
      vdata.bookId = res.bookId || ''
    }
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
    subject: 1,
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
onMounted(() => {
  queryRecord()
})
</script>
<style lang="scss">
.dictationExercise {
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
      image {
        width: 14px;
        height: 14px;
        margin-right: 3px;
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
    margin-top: 100px;
    .topNoData {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #999999;
      image {
        width: 160px;
        height: 130px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
