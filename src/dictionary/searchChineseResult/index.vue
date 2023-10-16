<template>
  <view class="chineseMain" :style="{ paddingTop: `${navBarHeight + 20}px` }">
    <NavBar title="搜索汉字" :fixedStyle="vdata.fixedStyle" />
    <view class="searchInfo">
      <view class="leftSear">
        <image
          class="searchIcon"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/9fb99b302f124a168e6c41b1c9ad01ed/fdj.png"
          mode="scaleToFill"
        />
        <view class="inputInfo">
          <input
            placeholder="请输入汉字、拼音"
            type="text"
            :value="vdata.searText"
            @input="getText"
            :selectionStart="100"
            :selectionEnd="100"
            confirm-type="search"
            :focus="vdata.focus"
            @confirm="confirm"
          />
          <view class="rightBtn" @tap="clearInput">
            <image
              v-if="vdata.searText"
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
      v-if="vdata.isShow"
      scroll-y="true"
      scroll-with-animation="true"
      :style="{ height: `calc(100vh - ${navBarHeight + 80}px)` }"
    >
      <view class="chinesList">
        <view
          class="chinesItem"
          v-for="(item, i) in vdata.resultList"
          :key="i"
          @tap="toDetail(item.character, item.characterPy)"
        >
          <view class="textLeft">{{ item.character }}</view>
          <view class="textRight">
            <view>{{ item.characterPy }}</view>
            <view class="sy">
              <text v-for="(vtem, key) in item.commonExplain" :key="i">{{ vtem.explain }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="noData" v-else>
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/acbca4a9b9a7438bbaa498a206f70d9d/noData.png"
        mode="scaleToFill"
      />
      <view>没有找到相关汉字，换个汉字试试吧</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { useSystem, useDictionary } from '@/stores'
import Taro, { useRouter } from '@tarojs/taro'
const system = useSystem()
const router = useRouter()
const dictionary: any = useDictionary()
const { navBarHeight } = system.navBarInfo
import NavBar from '@/components/NavBar.vue'
import { reactive, onMounted } from 'vue'
import { getChineseList } from '@/api/dictionary'
const vdata = reactive({
  searText: '',
  resultList: [],
  fixedStyle: {
    background: '#fff',
  },
  focus: true,
  isShow: true,
})
const toDetail = (character, characterPy) => {
  Taro.navigateTo({
    url: `../chineseDetail/index?character=${character}&characterPy=${characterPy}`,
  })
}
//清空
const clearInput = () => {
  vdata.searText = ''
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
    vdata.searText = value
  }
}
//取消
const resetText = () => {
  Taro.navigateBack({ delta: 1 })
}
//请求列表
const getList = () => {
  let params = {
    content: vdata.searText.toLowerCase().replace(/\s+/g, ''),
  }
  getChineseList(params).then((res: any) => {
    vdata.resultList = res?.charListDtoList || []
    vdata.isShow = vdata.resultList && vdata.resultList.length
  })
}
//搜索
const confirm = (e) => {
  const { value } = e.detail
  if (!value) {
    return
  } else {
    dictionary.setHistory(value)
    getList()
  }
}
onMounted(() => {
  if (router.params.searchText) {
    vdata.searText = router.params.searchText
    getList()
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
  .chinesList {
    padding: 0 18px;
    .chinesItem {
      display: flex;
      padding: 15px 0;
      align-items: center;
      border-bottom: 0.5px solid #ecf0f6;
      .textLeft {
        width: 36px;
        height: 36px;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/55e91cae18ca449dac5297cba8593d2d/textBg.png')
          no-repeat center;
        background-size: 100% 100%;
        border-radius: 3px;
        text-align: center;
        line-height: 36px;
        font-size: 18px;
        color: #343434;
        font-family: PingFangSC-Regular;
        margin-right: 16px;
      }
      .textRight {
        flex: 1;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #343434;
        overflow-y: scroll;
        .sy {
          color: #c3c3c3;
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
