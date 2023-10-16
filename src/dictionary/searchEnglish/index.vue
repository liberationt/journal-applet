<template>
  <view class="chineseMain" :style="{ paddingTop: `${navBarHeight + 20}px` }">
    <NavBar title="查询" />
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
            :value="vdata.text"
            :focus="vdata.focus"
            @input="getText"
            :selectionStart="100"
            :selectionEnd="100"
            confirm-type="search"
            @confirm="confirm"
          />
          <view class="rightBtn" @tap="clearInput">
            <image
              v-if="vdata.text"
              class="close-img"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/41cde43ac6eb4dae99fe55bf5f889baf/close.png"
              mode="scaleToFill"
            />
          </view>
        </view>
      </view>
      <text class="searText" @tap="resetText">取消</text>
    </view>
    <template v-if="dictionary.hisEnglishList.length">
      <view class="searchList">
        <view>搜索历史</view>
        <view class="rightDetele" @tap="resetDic">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/sy/30b91cee77da4f7ebf5cdc2421f01d19/delete.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="dicList">
        <view
          v-for="(item, i) in dictionary.hisEnglishList"
          :key="i"
          class="dicItem"
          @tap="toResult(item)"
        >
          {{ getHisText(item) }}
        </view>
      </view>
    </template>
  </view>
</template>
<script lang="ts" setup>
import { useSystem, useDictionary } from '@/stores'
import Taro from '@tarojs/taro'
const system = useSystem()
const dictionary: any = useDictionary()
const { navBarHeight } = system.navBarInfo
import NavBar from '@/components/NavBar.vue'
import { reactive } from 'vue'
const vdata = reactive({
  wordList: ['汉', '语', '字', '典'],
  focus: true,
})
const toSearch = () => {
  Taro.navigateTo({
    url: '../searchChinese/index',
  })
}
const clearInput = () => {
  vdata.text = ''
  vdata.focus = false
  setTimeout(() => {
    vdata.focus = true
  }, 100)
}
const resetDic = () => {
  dictionary.setResetEng()
}
const getText = (e) => {
  const { value } = e.detail
  if (!value) {
    return
  } else {
    vdata.text = value
  }
}
const getHisText = (text) => {
  if (text && text.length > 8) text = text.substr(0, 8) + '...'
  return text
}
const resetText = () => {
  Taro.navigateBack({ delta: 1 })
}
const confirm = (e) => {
  const { value } = e.detail
  if (!value) {
    return
  } else {
    Taro.redirectTo({
      url: `../searchEnglishResult/index?searchText=${value}`,
    })
    setTimeout(() => {
      dictionary.setEngHistory(value)
    }, 500)
  }
}
// const toResult = (value) => {
//   Taro.redirectTo({
//     url: `../searchEnglishResult/index?searchText=${value}`,
//   })
//   setTimeout(() => {
//     dictionary.setEngHistory(value)
//   }, 500)
// }
const toResult = (value) => {
  let pattern = new RegExp('[\u4E00-\u9FA5]+')
  if (pattern.test(value)) {
    Taro.navigateTo({
      url: `../searchEnglishResult/index?searchText=${value}`,
    })
  } else {
    Taro.navigateTo({
      url: `../englishDetail/index?wordContent=${value}`,
    })
  }
  setTimeout(() => {
    dictionary.setEngHistory(value)
  }, 500)
}
</script>

<style lang="scss">
.chineseMain {
  background-color: #fff;
  height: 100vh;
  padding: 0 18px;
  box-sizing: border-box;
  .searchInfo {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

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
        .input-placeholder {
          color: #c8c8c8;
        }
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
  .searchList {
    margin: 22px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #666;
    .rightDetele {
      image {
        width: 24px;
        height: 24px;
      }
    }
  }
  .dicList {
    display: flex;
    flex-wrap: wrap;
    margin-top: 21px;
    .dicItem {
      height: 30px;
      line-height: 30px;
      padding: 0 12px;
      margin-right: 10px;
      margin-bottom: 10px;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #444444;
      border-radius: 18px;
      background: #f5f5f5;
    }
  }
}
</style>
