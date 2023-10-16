<template>
  <view class="bookVersion">
    <nut-popup
      @close="closePopup"
      round
      position="bottom"
      closeable
      :style="{ height: '80%' }"
      v-model:visible="vdata.showRound"
    >
      <view class="versionContent">
        <view class="title">选择教材</view>
        <view class="versionInfo">
          <view class="versionList">
            <view
              v-for="(item, key) in vdata.bookVersionList"
              :key="key"
              :class="['version-item', vdata.versionKey == key && 'version-select']"
              @click="versionChange(item, key)"
            >
              {{ key }}
            </view>
          </view>
          <view class="bookInfoList">
            <view
              v-for="(item, i) in vdata.bookList"
              :key="i"
              class="bookInfoList-item"
              @tap="chooseBook(item)"
            >
              <view>
                <image :src="item.coverImage" alt="" />
              </view>
              <view>{{ grandeKey[item.grade] }}{{ termKey[item.term] }}</view>
            </view>
          </view>
        </view>
      </view>
    </nut-popup>
  </view>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro'
import { reactive, ref, defineEmits } from 'vue'
import { getVersionList } from '@/api/oralAssess'
import { getChineseVersionList } from '@/api/dictationExercise'
import { grandeKey, termKey } from '@/utils/common'
import { usePerson } from '@/stores'
const emit = defineEmits(['chooseBook'])
const personInfo = usePerson()
const vdata: any = reactive({
  versionKey: '',
  showRound: false,
  bookVersionList: {},
  bookList: [],
})
//教材版本切换
const versionChange = (item, key) => {
  vdata.versionKey = key
  vdata.bookList = item.bookInfoVoList
}
const getVersionInfo = async (type, url, versionKey) => {
  vdata.versionKey = versionKey
  if (type == 1) {
    let res: any = await getVersionList(url)
    if (res) {
      vdata.bookVersionList = res.bookVersionMap
      vdata.bookList = vdata.bookVersionList[versionKey]?.bookInfoVoList
    }
  } else {
    let res: any = await getChineseVersionList(url)
    if (res) {
      vdata.bookVersionList = res.bookVersionMap
      vdata.bookList = vdata.bookVersionList[versionKey]?.bookInfoVoList
    }
  }
  vdata.showRound = true
}
//打开弹框
const popupShow = async (type, url, versionKey) => {
  getVersionInfo(type, url, versionKey)
}
//关闭弹框
const closePopup = () => {
  vdata.showRound = false
}
const chooseBook = (item) => {
  let params = {
    bookId: item.bookId,
    coverImage: item.coverImage || '',
    grade: grandeKey[item.grade] || '',
    term: termKey[item.term] || '',
    version: vdata.versionKey,
  }
  personInfo.setVersion(params)
  emit('chooseBook')
  vdata.showRound = false
}
defineExpose({
  popupShow,
})
</script>
<style lang="scss">
.bookVersion {
  .popup-bottom {
    height: 100%;
  }
  .versionContent {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .title {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    padding: 20px;
    border-bottom: 0.5px solid #f0f0f0;
  }
  .versionInfo {
    flex: 1;
    display: flex;
    height: 100%;
    overflow: hidden;
    .versionList {
      flex-shrink: 0;
      width: 110px;
      overflow-y: scroll;
      background: #f6f9fd;
      padding-bottom: 10px;
      .version-item {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: normal;
        line-height: 18px;
        color: #333333;
        margin-top: 22px;
        position: relative;
        text-align: center;
      }
      .version-select {
        font-family: PingFangSC-Medium;
        font-weight: 800;
      }
      .version-select::after {
        position: absolute;
        content: '';
        width: 3px;
        height: 13px;
        left: 0;
        background: #516aff;
        display: inline-block;
        border-radius: 2px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .bookInfoList {
      display: flex;
      flex-wrap: wrap;
      overflow-y: scroll;
      padding: 10px 0;
      box-sizing: border-box;
      flex: 1;
      image {
        width: 71px;
        height: 107px;
        margin-bottom: 8px;
      }
      .bookInfoList-item {
        width: 50%;
        text-align: center;
        margin-bottom: 16px;
        font-family: PingFang SC;
        font-size: 14px;
      }
    }
  }
}
</style>
