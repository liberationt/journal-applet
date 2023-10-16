<template>
  <view class="wordBookMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar title="我的单词本" />
    <scroll-view
      class="scroll-view_H"
      v-if="vdata.wordList.length"
      :scroll-y="true"
      @scrolltolower="lower"
      :style="{
        height: `calc(100vh - ${navBarHeight}px)`,
      }"
    >
      <view class="wordList">
        <view
          class="wordItem"
          v-for="(item, i) in vdata.wordList"
          :key="i"
          @tap="toDetail(item.englishWord)"
        >
          <view class="engLishText">{{ item.englishWord }}</view>
          <view class="chinesText" v-if="item.interpretationDTOList">
            <text v-for="(vtem, key) in item.interpretationDTOList" :key="key">
              <text>{{ vtem.terms }}</text>
              <text>{{ vtem.interpretationContent }}</text>
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="noData" v-else>
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/acbca4a9b9a7438bbaa498a206f70d9d/noData.png"
        mode="scaleToFill"
      />
      <view class="noTopText">还没有收藏的单词哦</view>
      <view>可将不认识的单词收藏进单词本方便回顾～</view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { useSystem } from '@/stores'
import Taro from '@tarojs/taro'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
import NavBar from '@/components/NavBar.vue'
import { reactive, onMounted } from 'vue'
import { getFavoriteList } from '@/api/dictionary'
const vdata = reactive({
  wordList: [],
  searchInfo: {
    condition: {},
    current: 1,
    orders: [
      {
        asc: true,
        column: '',
      },
    ],
    size: 20,
  },
  total: 0,
})
// 分页
const lower = () => {
  if (hasNext()) {
    getPageList()
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
const getPageList = () => {
  getFavoriteList(vdata.searchInfo).then((res: any) => {
    if (res) {
      vdata.wordList = vdata.wordList.concat(res.records)
      vdata.total = res.total
    }
  })
}
const toDetail = (wordContent) => {
  Taro.navigateTo({
    url: `../englishDetail/index?wordContent=${wordContent}`,
  })
}
onMounted(() => {
  getPageList()
})
</script>
<style lang="scss">
.wordBookMain {
  box-sizing: border-box;
  .scroll-view_H {
    box-sizing: border-box;
  }
  .wordList {
    padding: 15px 16px 30px;
    .wordItem {
      padding: 12px 0;
      border-bottom: 1px solid #e6e6e6;
      .engLishText {
        font-family: PingFangSC-Medium;
        font-size: 15px;
        color: #343434;
      }
      .chinesText {
        color: rgba(52, 52, 52, 0.4);
        font-family: PingFangSC-Regular;
        font-size: 13px;
        margin-top: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .noData {
    text-align: center;
    padding-top: 140px;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 10px;
    }
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
    .noTopText {
      font-family: PingFangSC-Medium;
      color: #3d3d3d;
      margin-bottom: 10px;
      font-size: 16px;
    }
  }
}
</style>
