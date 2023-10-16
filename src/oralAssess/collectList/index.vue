<template>
  <view class="mainContent">
    <NavBar :title="'我的收藏'" :background="'#fff'" />
    <view class="search-content" :style="{ top: `${navBarHeight}px` }">
      <oral-search @grand-change="grandChange" @timer-change="timerChange">
        <template #right>
          <text @tap="changeText">{{ vdata.text ? '整理' : '取消' }}</text>
        </template>
      </oral-search>
    </view>
    <view
      class="recordContent"
      :style="{
        marginTop: `${navBarHeight + 40}px`,
        height: `calc(100vh - ${navBarHeight + (vdata.text ? 40 : 130)}px)`,
      }"
    >
      <view class="noData" v-if="!vdata.recordList.length">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
        />
        <text>暂无收藏</text>
      </view>
      <scroll-view class="scroll-view_H" :scroll-y="true" v-else @scrolltolower="lower">
        <view class="scrollList">
          <view
            class="scroll-item"
            v-for="(item, i) in vdata.recordList"
            :key="i"
            @tap="itemChange(item)"
          >
            <image
              v-if="!vdata.text"
              :src="
                item.isCheck
                  ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/ec5240eb81704251b0cce36b418df57e/check.png'
                  : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/33934d01a03d47df852944826735310e/nocheck.png'
              "
              mode="scaleToFill"
            />
            <view class="wordText">
              <view class="title">{{ item.englishContent }}</view>
              <view class="chinese">{{ item.chineseContent }}</view>
            </view>
            <view class="vadioImg" v-if="vdata.text">
              <img
                @tap="play(1, item)"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kspg/b65ab4ba6762483a92fc0e15b1f2a741/vadio.png"
                alt=""
                v-if="!item.isPlay"
              />
              <img
                v-else
                @tap="play(2, item)"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kyxl/7f223a621ff440119894c238f15c4649/bf.gif"
                alt=""
              />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="optionDel" v-show="!vdata.text">
      <view class="checkBtn" @tap="allChange">
        <image
          :src="
            vdata.checkAll
              ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/ec5240eb81704251b0cce36b418df57e/check.png'
              : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/33934d01a03d47df852944826735310e/nocheck.png'
          "
          mode="scaleToFill"
        />
        全选
      </view>
      <view class="delete" @tap="deleteNumber > 0 && deletePage()"
        >删除 <text v-if="deleteNumber > 0">({{ deleteNumber }})</text></view
      >
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import NavBar from '@/components/NavBar.vue'
import OralSearch from '@/components/OralSearch.vue'
import { reactive, ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue'
import { useSystem } from '@/stores'
import { northOralFavorite } from '@/api/oralAssess'

const system = useSystem()
const { navBarHeight } = system.navBarInfo
const group2 = ref()
const vdata: any = reactive({
  text: true,
  checkAll: false,
  recordList: [],
  total: 10,
  searchInfo: {
    condition: {
      type: '',
      dateInt: 0,
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
  checkboxAll: false,
})
//播放
let audioCtx: any = null
const play = (type, item) => {
  if (type == 1) {
    audioPlay(1, item)
    item.isPlay = true
  } else {
    audioCtx.stop()
    item.isPlay = false
  }
}
const audioPlay = (type, item) => {
  nextTick(() => {
    if (!audioCtx) {
      audioCtx = Taro.createInnerAudioContext()
    }
    audioCtx.src = item.englishMp3
    audioCtx.play()
    audioCtx.onEnded(() => {
      item.isPlay = false
      audioCtx.stop()
    })
  })
}
const resetAudio = () => {
  if (audioCtx) {
    vdata.recordList.map((item) => (item.isPlay = false))
    audioCtx.stop()
  }
}
// 分页
const lower = () => {
  if (hasNext()) {
    getPageList()
  }
}
const deleteNumber = computed(() => {
  let list = vdata.recordList.filter((item) => item.isCheck)
  return list.length
})
const hasNext = () => {
  if (vdata.searchInfo.current * vdata.searchInfo.size < vdata.total) {
    vdata.searchInfo.current = vdata.searchInfo.current + 1
    return true
  } else {
    return false
  }
}

//type类型
const grandChange = (value) => {
  vdata.recordList = []
  vdata.searchInfo.condition.type = value
  vdata.searchInfo.current = 1
  vdata.checkboxAll = false
  vdata.text = true
  getPageList()
}
//时间
const timerChange = (value) => {
  vdata.recordList = []
  vdata.searchInfo.current = 1
  vdata.searchInfo.condition.dateInt = value
  vdata.checkboxAll = false
  vdata.text = true
  getPageList()
}
//文字改变
const changeText = () => {
  resetAudio()
  vdata.text = !vdata.text
  vdata.checkboxAll = false
}
// 全选
const allChange = (value: boolean) => {
  vdata.checkAll = !vdata.checkAll
  if (vdata.checkAll) {
    vdata.recordList.map((item) => (item.isCheck = true))
  } else {
    vdata.recordList.map((item) => (item.isCheck = false))
  }
}
//每一项改变
const itemChange = (item) => {
  item.isCheck = !item.isCheck
  let checkList = vdata.recordList.filter((item) => item.isCheck)
  if (checkList && checkList.length) {
    if (checkList.length == vdata.recordList.length) {
      vdata.checkAll = true
    } else {
      vdata.checkAll = false
    }
  } else {
    vdata.checkAll = false
  }
}
//删除
const deletePage = () => {
  let selectOption = vdata.recordList.filter((item) => item.isCheck)
  let favoriteIdList = []
  selectOption.forEach((item: any) => {
    favoriteIdList.push(item.favoriteId)
  })
  let params = {
    favoriteIdList,
  }
  northOralFavorite('delete', params).then((res) => {
    vdata.searchInfo.current = 1
    vdata.recordList = []
    changeText()
    getPageList()
  })
}
//获取列表
const getPageList = () => {
  resetAudio()
  if (!vdata.text) return
  northOralFavorite('favoriteList', vdata.searchInfo).then((res: any) => {
    if (res) {
      vdata.recordList = vdata.recordList.concat(res.records || [])
      vdata.total = res.total
    }
  })
}
useDidHide(() => {
  resetAudio()
})
onBeforeUnmount(() => {
  resetAudio()
})
onMounted(() => {
  getPageList()
})
</script>
<style lang="scss">
.mainContent {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .search-content {
    position: fixed;
    width: 100%;
    left: 0;
    right: 0;
    z-index: 10;
  }
  .recordContent {
    background: #fff;
    box-sizing: border-box;
    overflow: scroll;
  }
  .scroll-view_H {
    height: 100%;
    box-sizing: border-box;
  }
  .scrollList {
    padding: 0 16px;
  }
  .scroll-item {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    position: relative;
    image {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .wordText {
      padding: 10px;
      border-bottom: 1px solid #f3f3f3;
      flex: 1;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      line-height: 16px;
      color: #343434;
      padding-right: 22px;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 15px;
        font-weight: normal;
        line-height: 18px;
        letter-spacing: 0px;
        margin-bottom: 8px;
        color: #343434;

        word-break: break-all;
        box-sizing: border-box;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .chinese {
        word-break: break-all;
        box-sizing: border-box;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .vadioImg {
      position: absolute;
      right: 0;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .noData {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    flex-direction: column;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    font-weight: normal;
    line-height: 18px;
    color: #333333;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 30px;
    }
  }
  .optionDel {
    height: 93px;
    width: 100%;
    padding: 15px 15px 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    image {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
    .checkBtn {
      display: flex;
      font-size: 14px;
      align-items: center;
      height: 44px;
    }
    .delete {
      width: 206px;
      height: 44px;
      border-radius: 22px;
      background: #2f5de7;
      line-height: 44px;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>
