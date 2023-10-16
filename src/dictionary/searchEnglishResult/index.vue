<template>
  <view class="chineseMain" :style="{ paddingTop: `${navBarHeight + 20}px` }">
    <NavBar title="查询" :fixedStyle="vdata.fixedStyle" />
    <view class="searchInfo">
      <view class="leftSear">
        <image
          class="searchIcon"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/9fb99b302f124a168e6c41b1c9ad01ed/fdj.png"
          mode="scaleToFill"
        />
        <view class="inputInfo">
          <input
            placeholder="请输入要翻译的单词"
            type="text"
            :value="vdata.searchInfo.condition.content"
            @input="getText"
            :focus="vdata.focus"
            :selectionStart="100"
            :selectionEnd="100"
            confirm-type="search"
            @confirm="confirm"
          />
          <view class="rightBtn" @tap="clearInput">
            <image
              v-if="vdata.searchInfo.condition.content"
              class="close-img"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/41cde43ac6eb4dae99fe55bf5f889baf/close.png"
              mode="scaleToFill"
            />
          </view>
        </view>
      </view>
      <text class="searText" @tap="resetText">取消</text>
    </view>
    <scroll-view
      v-if="vdata.resultList.length"
      scroll-y="true"
      @scrolltolower="lower"
      scroll-with-animation="true"
      :style="{ height: `calc(100vh - ${navBarHeight + 80}px)` }"
    >
      <view class="wordList">
        <view
          class="wordItem"
          v-for="(item, i) in vdata.resultList"
          :key="i"
          @tap="toDetail(item.englishWord)"
        >
          <view class="engLishText">{{ item.englishWord }}</view>
          <view class="chinesText" v-if="item.interpretationDTOList">
            <!-- <text v-for="(vtem, key) in item.interpretationDTOList" :key="key">
              <text>{{ vtem.terms }}</text>
              
            </text> -->
            <rich-text :nodes="getNode(item.interpretationDTOList)">{{}}</rich-text>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="noData" v-else>
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/acbca4a9b9a7438bbaa498a206f70d9d/noData.png"
        mode="scaleToFill"
      />
      <view>没有找到相关单词，换个单词试试吧</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useRouter } from '@tarojs/taro'

import { useSystem, useDictionary } from '@/stores'
const dictionary: any = useDictionary()
const system = useSystem()
const router = useRouter()
const { navBarHeight } = system.navBarInfo
import NavBar from '@/components/NavBar.vue'
import { reactive, onMounted } from 'vue'
import { getEnglishList } from '@/api/dictionary'
import { View } from '@tarojs/components'
const vdata = reactive({
  searText: '',
  resultList: [],
  fixedStyle: {
    background: '#fff',
  },
  focus: false,
  searchInfo: {
    condition: {
      content: '',
    },
    current: 1,
    orders: [
      {
        asc: true,
        column: '',
      },
    ],
    size: 10,
  },
  total: 0,
})
// 分页
const lower = () => {
  if (hasNext()) {
    getWordList()
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
const toSearch = () => {
  Taro.navigateTo({
    url: '../searchChinese/index',
  })
}
const getNode = (list) => {
  let str = ''
  list.forEach((item) => {
    let vtemStr = item.interpretationContent.replace(
      vdata.searchInfo.condition.content,
      `<span style='color:#062FFC'>${vdata.searchInfo.condition.content}</span>`
    )
    str = str + `${item.terms}${vtemStr}`
  })
  let stiView = `<div class="overflow">${str}</div>`
  return stiView
}
const toDetail = (text) => {
  Taro.navigateTo({
    url: `../englishDetail/index?wordContent=${text}`,
  })
}
//清空
const clearInput = () => {
  vdata.searchInfo.condition.content = ''
  vdata.focus = false
  setTimeout(() => {
    vdata.focus = true
  }, 100)
}
//文本输入
const getText = (e) => {
  const { value } = e.detail
  if (!value) {
    return
  } else {
    // vdata.searText = value
    vdata.searchInfo.condition.content = value
  }
}
//取消
const resetText = () => {
  Taro.navigateBack({ delta: 1 })
}
//请求列表
const getWordList = () => {
  getEnglishList(vdata.searchInfo).then((res: any) => {
    if (res?.englishDictionaryList) {
      vdata.resultList = vdata.resultList.concat(res.englishDictionaryList)
      vdata.total = res.total
    } else {
      vdata.resultList = []
    }
  })
}
//搜索
const confirm = (e) => {
  const { value } = e.detail
  if (!value) {
    return
  } else {
    dictionary.setEngHistory(value)
    vdata.searchInfo.current = 1
    vdata.resultList = []
    getWordList()
  }
}
onMounted(() => {
  if (router.params.searchText) {
    vdata.searchInfo.condition.content = router.params.searchText
    getWordList()
  }
})
</script>

<style lang="scss">
.chineseMain {
  background-color: #fff;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .searchInfo {
    height: 40px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    .leftSear {
      background: #f7f7f7;
      display: flex;
      align-items: center;
      border-radius: 22px;
      height: 40px;
      flex: 1;
      padding: 0 38px 0 15px;
      margin-right: 15px;
      display: flex;
      position: relative;
      .searchIcon {
        width: 16px;
        height: 16px;
        margin-right: 12px;
        flex-shrink: 0;
      }
      .inputInfo {
        flex: 1;
      }
      .rightBtn {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        .close-img {
          width: 16px;
          height: 16px;
        }
      }
    }
    .searText {
      font-family: PingFangSC-Regular;
      font-size: 15px;
      /* 文本色/一级 */
      color: #333333;
      flex-shrink: 0;
    }
  }
  .wordList {
    padding: 15px 16px 30px;
    .wordItem {
      padding: 12px 0;
      border-bottom: 1px solid #ecf0f6;
      .engLishText {
        font-family: PingFangSC-Medium;
        font-size: 15px;
        color: #343434;
      }
      .chinesText {
        color: rgba(52, 52, 52, 0.6);
        font-family: PingFangSC-Regular;
        font-size: 13px;
        margin-top: 5px;
        color: #c3c3c3;
        .overflow {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .noData {
    margin-top: 125px;
    text-align: center;
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
</style>
