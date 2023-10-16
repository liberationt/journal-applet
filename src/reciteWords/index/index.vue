<template>
  <view class="reciteWordsMain" :style="{ paddingTop: `${navBarHeight + 35}px` }">
    <NavBar title="背单词" :fixedStyle="vdata.fixedStyle" />
    <view>
      <view class="seeting">
        <view>背单词</view>
        <view class="rightBtn">
          <text @tap="seeting">学习设置</text>
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/31aa3b0e9194408a90a1ba7ea7fd3dda/yjt.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="studyInfo">
        <view class="topInfo">
          <view class="topLeft">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/6837a3ac7c834068b21ddaa0401a09d4/wardsIcon.png"
              mode="scaleToFill"
            />
            <view>{{ vdata.bookInfo.bookTitle }}</view>
          </view>
          <view class="topRight">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/7c4bea420d074ff5b8881e794b1e2920/xxjh.png"
              mode="scaleToFill"
            />
            <text @tap="editPlan">更换词书</text>
          </view>
        </view>
        <view class="progress">
          <view class="progressMain" :style="getProgress"></view>
        </view>
        <view class="residue">
          <view> {{ vdata.bookInfo.hasStudyCount }}/{{ vdata.bookInfo.totalCount }} </view>
          <view @tap="toWord">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/7cf81aede15a4720a7c5c6fb602c111c/dcIcon.png"
              mode="scaleToFill"
            />
            <text>单词表</text>
          </view>
        </view>
        <view class="uniKeyInfo" @tap="changeUnitKey">
          <view class="uniKey">
            <text>{{ vdata.bookInfo.unitValue }}</text>
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/779e5b1ee2804b699ed0252e250e3e8c/sjx.png"
              mode="scaleToFill"
            />
          </view>
        </view>
        <template v-if="vdata.bookInfo.status == 1 || vdata.bookInfo.status == 2">
          <view class="plan">
            <view class="dayPlan">学习计划</view>
          </view>
          <view class="wordInfo">
            <view class="wordLeft">
              <view class="wordText">需新学</view>
              <view class="wordRight">
                <view>{{ vdata.bookInfo.needStudyCount }}</view>
                <text>词</text>
              </view>
            </view>
            <view class="sx"></view>
            <view class="wordLeft">
              <view class="wordText">需复习</view>
              <view class="wordRight">
                <view>{{ vdata.bookInfo.needRecoverCount }}</view>
                <text>词</text>
              </view>
            </view>
          </view>
          <view class="studyBottom">
            <view class="continueStudy" @tap="beginStudy">
              {{ vdata.bookInfo.status == 1 ? '开始学习吧' : '继续学习' }}
            </view>
          </view>
        </template>
        <view v-else>
          <view class="allComplete">恭喜你，已全部学完这本词书单词！</view>
          <view class="fxStudy" @tap="beginStudy">
            <view class="learning">开始复习</view>
          </view>
        </view>
      </view>
    </view>
    <nut-popup position="bottom" round v-model:visible="vdata.showRound">
      <view class="seeting-list">
        <view class="study-seeting">
          <text>学习设置</text>
          <image
            @tap="vdata.showRound = false"
            class="closeIcon"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/47bed41528a3418b9111e5199de4ab61/icon1.png"
          />
        </view>
        <view class="seeting-item">
          <view>单词发音</view>
          <view>
            <nut-radiogroup
              v-model="vdata.pronunciation"
              @change="pronunChange"
              direction="horizontal"
            >
              <nut-radio :label="1">美音</nut-radio>
              <nut-radio :label="2">英音</nut-radio>
            </nut-radiogroup>
          </view>
        </view>
        <view class="seeting-item">
          <view>背单词操作音效</view>
          <view>
            <nut-switch v-model="vdata.sound" @change="soundChange" />
          </view>
        </view>
      </view>
    </nut-popup>
    <nut-popup
      position="bottom"
      :style="{ maxHeight: '80%' }"
      lock-scroll
      round
      v-model:visible="vdata.directory"
    >
      <view class="directory">
        <view class="topTitInfo">
          <view class="directoryTitle">目录</view>
          <image
            @tap="vdata.directory = false"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/47bed41528a3418b9111e5199de4ab61/icon1.png"
            mode="scaleToFill"
          />
        </view>
        <view class="directoryList">
          <view
            class="directoryItem"
            v-for="(item, i) in vdata.northWordChapterDTOList"
            :key="i"
            @tap="chooseUnit(item)"
          >
            <view class="direLeft">
              <text>{{ item.unitValue }}</text>
              <text class="oraStudy" v-if="item.hasCompleted">已学</text>
            </view>
            <view> 总词汇（ {{ item.wordCount || 0 }} ） </view>
          </view>
        </view>
      </view>
    </nut-popup>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { termInfo, classInfo } from '@/utils/common'
import { useSystem, useRecite, useUser } from '@/stores'
import { getReciteInfo } from '@/api/reciteWords'
import { reactive, computed, onMounted, ref } from 'vue'
import { getTryCount } from '@/api/index'
import { debounce } from '@/utils/index'
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const user = useUser()
const system = useSystem()
const recite = useRecite()
const { navBarHeight } = system.navBarInfo

const vdata = reactive({
  directory: false,
  fixedStyle: {
    color: '#fff',
  },
  versionSearch: null,
  width: '',
  showRound: false,
  pronunciation: '',
  sound: '',
  bookInfo: {},
  northWordChapterDTOList: [],
})
const getProgress = computed(() => {
  let width = Math.round((vdata.bookInfo.hasStudyCount / vdata.bookInfo.totalCount) * 100)
  return {
    width: `${width}%`,
  }
})
//设置
const seeting = () => {
  vdata.showRound = true
}
const beginStudy = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '背单词', funCourseName: null })
    // vdata.termItemInfo = item
    if (memberInfo.vipState == 1) {
      if (memberInfo.tryFlag == 1) {
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
})
const handleNavigate = () => {
  recite.setCurrentBook({
    bookId: vdata.bookInfo.bookId,
    unitKey: vdata.bookInfo.unitKey,
    unitValue: vdata.bookInfo.unitValue,
    status: vdata.bookInfo.status,
  })
  Taro.navigateTo({
    url: '../learningWord/index',
  })
}

// 修改学习计划
const editPlan = () => {
  Taro.navigateTo({
    url: '../updateBook/index',
  })
}
//修改单元
const changeUnitKey = () => {
  let params = {
    bookId: vdata.bookInfo.bookId || 1,
  }
  getReciteInfo('chapter', params).then((res) => {
    if (res) {
      vdata.northWordChapterDTOList = res.northWordChapterDTOList || []
      vdata.directory = true
    }
  })
}
//修改单元确定
const chooseUnit = (item) => {
  configUnit(item.unitKey)
  vdata.directory = false
}
//确认选择
const configUnit = (unitKey) => {
  // 九年级全一册
  let params = {
    bookId: vdata.bookInfo.bookId,
    unitKey,
    grade: vdata.versionSearch.grade == 1 ? 3 : vdata.versionSearch.grade,
    term: vdata.versionSearch.grade == 9 ? 5 : vdata.versionSearch.term,
  }
  getReciteInfo('unitToIndex', params).then((res) => {
    // vdata.bookInfo = {
    //   bookId: 0,
    //   bookTitle: '今天礼拜一今天礼拜一今天礼拜一',
    //   hasStudy: 0,
    //   needRecover: 10,
    //   newStudy: 10,
    //   status: 2,
    //   totalCount: 0,
    //   unitKey: '1',
    //   unitValue: 'unit 443qweq We love animals',
    // }
    if (res) {
      vdata.bookInfo = res
    }
  })
}
//单词表
const toWord = () => {
  recite.setCurrentBook({
    bookId: vdata.bookInfo.bookId,
    unitKey: vdata.bookInfo.unitKey,
    unitValue: vdata.bookInfo.unitValue,
  })
  Taro.navigateTo({
    url: '../wordList/index',
  })
}
// 获取首页相关信息
const getVersonInfo = () => {
  let params = JSON.parse(JSON.stringify(vdata.versionSearch))
  params.grade = params.grade == 1 ? 3 : params.grade
  // 九年级全一册
  params.term = params.grade == 9 ? 5 : params.term
  getReciteInfo('index', params).then((res) => {
    if (res) {
      vdata.bookInfo = res
    }
  })
}
// 音效
const soundChange = (val) => {
  recite.setSetKey('sound', val)
  vdata.showRound = false
}
// 语言
const pronunChange = (val) => {
  recite.setSetKey('pronunciation', val)
  vdata.showRound = false
}

useDidShow(() => {
  let versionSearch = JSON.parse(JSON.stringify(recite.versionInfo))
  vdata.versionSearch = {
    grade: classInfo[versionSearch.grade],
    version: versionSearch.version,
    term: termInfo[versionSearch.term],
  }
  getVersonInfo()
})
onMounted(() => {
  let seting = JSON.parse(JSON.stringify(recite.seting))
  vdata.pronunciation = seting.pronunciation
  vdata.sound = seting.sound
})
</script>
<style lang="scss">
.imageInfo {
  width: 100%;
  .img {
    max-width: 100%;
  }
}
.reciteWordsMain {
  height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/f7c1c4fff12542feba2eacee5c890011/reciteWordsBg.png')
    no-repeat center;
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 0 16px;
  .seeting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    margin-bottom: 12px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    padding: 0 9px;
    color: #ffffff;
    .rightBtn {
      display: flex;
      align-items: center;
      font-size: 14px;
      image {
        width: 5px;
        height: 9px;
        margin-left: 5px;
      }
    }
  }
  .studyInfo {
    padding: 20px 20px 26px;
    background: #fff;
    border-radius: 16px;
    .topInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .topLeft {
        display: flex;
        align-items: center;
        flex: 1;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        color: #2e2e2e;
        image {
          width: 22px;
          height: 27px;
          flex-shrink: 0;
          margin-right: 6px;
        }
        view {
          width: 0px;
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .topRight {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        width: 72px;
        image {
          width: 14px;
          height: 14px;
        }
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #787878;
      }
    }
  }
  .progress {
    width: 100%;
    height: 6px;
    background: #e0eaff;
    border-radius: 3px;
    margin: 16px 0 8px;
    position: relative;
    .progressMain {
      height: 6px;
      position: absolute;
      left: 0;
      border-radius: 3px;
      background: #2f5de7;
    }
  }
  .residue {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #787878;
    image {
      width: 10px;
      height: 12px;
      margin-right: 3px;
    }
    view {
      display: flex;
      align-items: center;
    }
  }
  .uniKeyInfo {
    position: relative;
    margin-top: 20px;
    .uniKey {
      position: absolute;
      border-radius: 12px;
      background: #f2f2f2;
      padding: 0 12px;
      height: 24px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
      display: flex;
      align-items: center;
      image {
        width: 8px;
        height: 6px;
        margin-left: 8px;
      }
    }
  }
  .plan {
    display: flex;
    align-items: center;
    margin-top: 72px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    margin-left: 10px;
  }
  .dayPlan {
    width: 67px;
    font-family: PingFangSC-Regular;
    color: #ffffff;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/6bcb8567ba3d43928286cf8aac58c053/jrjh.png')
      no-repeat center;
    text-align: center;
    background-size: 100% 100%;
  }
  .gxPlan {
    flex: 1;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/bdc/fc9c0a0bffe547829c0d89574869f34a/gxgx.png')
      no-repeat center;
    background-size: 100% 100%;
    text-indent: 18px;
  }
  .wordInfo {
    display: flex;
    align-items: center;
    margin: 14px 0 27px 15px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #4d4d4d;
    .wordText {
    }
    .wordRight {
      display: flex;
      align-items: flex-end;
      view {
        font-family: PingFangSC-Medium;
        font-size: 44px;
        font-weight: 500;
        line-height: 44px;
        color: #4d4d4d;
        margin-right: 4px;
      }
      text {
        margin-bottom: 3px;
      }
    }
  }
  .sx {
    height: 24px;
    width: 1px;
    background: rgba(134, 157, 179, 0.3);
    margin: 0 20px;
  }
  .continueStudy {
    width: 100%;
    height: 46px;
    line-height: 46px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    color: #f9f9f9;
    border-radius: 23px;
    background: #2f5de7;
  }
  .fxStudy {
    display: flex;
    align-self: center;
    justify-content: space-between;
    border-radius: 23px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    line-height: 16px;
    color: #4d4d4d;
    .share {
      display: flex;
      align-items: center;
      image {
        width: 15px;
        height: 15px;
        margin-right: 6px;
      }
    }
    .learning {
      width: 100%;
      height: 46px;
      line-height: 46px;
      background: #2f5de7;
      border-radius: 23px;
      color: #f9f9f9;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      text-align: center;
    }
  }
  .allComplete {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    margin: 62px 0 79px;
    color: #4d4d4d;
  }
}
.seeting-list {
  padding: 0 16px 50px;
  .study-seeting {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    font-weight: 500;
    color: #06080d;
    font-weight: 700;
    position: relative;
    .closeIcon {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 0;
      top: 20px;
    }
  }
  .seeting-item {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #414141;
    border-bottom: 0.5px solid #ecf0f6;
  }
}
.popup-bottom.round {
  border-radius: 18px 18px 0 0;
}
.directory {
  padding: 0 16px 10px;
  .topTitInfo {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .directoryTitle {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      font-weight: 500;
      color: #06080d;
      font-weight: 700;
    }
    image {
      width: 24px;
      height: 24px;
    }
  }
  .directoryList {
    .directoryItem {
      padding: 20px 0;
      border-bottom: 1px solid rgba(236, 240, 246, 1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #333333;
      .direLeft {
        display: flex;
        align-items: center;
        .oraStudy {
          box-sizing: border-box;
          height: 14px;
          width: 30px;
          text-align: center;
          line-height: 12px;
          font-family: PingFangSC-Medium;
          font-size: 10px;
          color: #ff5b45;
          border: 1px solid #ff5b45;
          border-radius: 3px;
          margin-left: 5px;
        }
      }
    }
    .directoryItem:nth-last-child(1) {
      border: none;
    }
  }
}
</style>
