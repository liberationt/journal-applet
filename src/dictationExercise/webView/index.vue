<template>
  <view>
    <web-view :src="vdate.url"></web-view>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import { reactive, ref, onMounted } from 'vue'
import { useSystem, usePerson } from '@/stores'
import { getWebviewDomain } from '@/api/url'
const personInfo = usePerson()
const vdate = reactive({
  url: '',
})
onMounted(() => {
  let textList = []
  personInfo.dicExerciseList.forEach((item) => {
    textList.push(item.chineseContent)
  })
  let textContent = textList.toString()
  // vdate.url = `https://journal.pro.dcrayssh.cn?textContent=${textContent}&vconsole=1`
  vdate.url = `${getWebviewDomain()}?textContent=${textContent}`
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
