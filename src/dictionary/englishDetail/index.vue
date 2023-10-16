<template>
  <view class="englishMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar title="单词详情" :fixedStyle="vdata.fixedStyle" />
    <template v-if="vdata.detailInfo.englishWord">
      <scroll-view
        class="scroll-content"
        scroll-y="true"
        scroll-with-animation="true"
        :scroll-top="vdata.scrollTop"
        :style="{ height: `calc(100vh - ${navBarHeight}px)` }"
      >
        <view class="introduce">
          <view class="textInfo">
            <text class="english">{{ vdata.detailInfo?.englishWord }}</text>
            <!-- <text class="chinese">你好</text> -->
            <image
              class="sc"
              @tap="favorite"
              :src="
                vdata.detailInfo.favoriteId
                  ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/365c7f6acaa64ad898abd3609004152d/choosecollect.png'
                  : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/9a3816dd6c704aada4e48f0cb10432d2/sc.png'
              "
              mode="scaleToFill"
            />
          </view>
          <view class="fyInfo">
            <view
              class="fy fyr"
              v-if="vdata.detailInfo?.faYin?.pronunciationEn"
              @tap="
                play(
                  1,
                  vdata.detailInfo?.faYin?.pronunciationEn?.phoneticSymbolUrl ||
                    vdata.detailInfo?.faYin?.pronunciationAm.phoneticSymbolUrl,
                  vdata.detailInfo?.faYin?.pronunciationEn?.otherUrl ||
                    vdata.detailInfo?.faYin?.pronunciationAm.otherUrl
                )
              "
            >
              <text>英</text>
              <text class="fyText">{{
                vdata.detailInfo?.faYin?.pronunciationEn?.phoneticSymbol
              }}</text>
              <image
                :src="
                  vdata.isPlayY
                    ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hzyd/f0f5c244d00a46f086117eea200dcc20/bfGif.gif'
                    : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/93cd386e54c04da787106016d0c66742/bf.png'
                "
                mode="scaleToFill"
              />
            </view>
            <view
              class="fy"
              v-if="vdata.detailInfo?.faYin?.pronunciationAm"
              @tap="
                play(
                  2,
                  vdata.detailInfo?.faYin?.pronunciationAm.phoneticSymbolUrl ||
                    vdata.detailInfo?.faYin?.pronunciationEn?.phoneticSymbolUrl,
                  vdata.detailInfo?.faYin?.pronunciationAm.otherUrl ||
                    vdata.detailInfo?.faYin?.pronunciationEn?.otherUrl
                )
              "
            >
              <text>美</text>
              <text class="fyText">{{
                vdata.detailInfo?.faYin?.pronunciationAm.phoneticSymbol
              }}</text>
              <image
                :src="
                  vdata.isPlayM
                    ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hzyd/f0f5c244d00a46f086117eea200dcc20/bfGif.gif'
                    : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/93cd386e54c04da787106016d0c66742/bf.png'
                "
                mode="scaleToFill"
              />
            </view>
          </view>
          <view class="interpretationInfo" v-if="vdata.detailInfo?.shiYi">
            <view class="title">释义</view>
            <view class="interpretationList">
              <view
                class="interpretationItem"
                v-for="item in vdata.detailInfo.shiYi.wordInterpretationDTOList"
                :key="item"
              >
                <view class="dw">{{ item.terms }}</view>
                <view class="ms">{{ item.interpretationContent }}</view>
              </view>
            </view>
          </view>
        </view>
        <view
          class="deformation"
          v-if="vdata.detailInfo?.deformation?.wordDeformationDTOList.length"
        >
          <view class="title">单词变形</view>
          <view class="bxList">
            <view class="leftImg"
              ><image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/tlxl/4b83d835c5a3497781354e4252c4aa9d/bx.png"
                mode="scaleToFill"
            /></view>
            <view class="exampleList">
              <view class="word">{{ vdata.detailInfo?.englishWord }}</view>
              <view
                class="exampleItem"
                v-for="(item, i) in vdata.detailInfo.deformation.wordDeformationDTOList"
                :key="i"
              >
                <template v-if="i === 0">
                  <text class="titleText">{{ item.title }}</text>
                  <text class="deformationContent">{{ item.deformationContent }}</text>
                </template>
              </view>
            </view>
          </view>
        </view>
        <view class="example" v-if="vdata.detailInfo?.liJu">
          <view class="title">例句</view>
          <view class="exampleList">
            <view
              class="exampleItem"
              v-for="item in vdata.detailInfo.liJu.wordExampleSentenceDTOList"
              :key="item"
            >
              <view class="englishText">{{ item.englishContent }}</view>
              <view class="chineseText">{{ item.chineseContent }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </template>
    <template v-else>
      <view class="noData">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/acbca4a9b9a7438bbaa498a206f70d9d/noData.png"
          mode="scaleToFill"
        />
        <view>没有找到相关单词，换个单词试试吧</view>
      </view>
    </template>
  </view>
</template>
<script lang="ts" setup>
import { useSystem } from '@/stores'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { getWordTextDetail, addFavorite } from '@/api/dictionary'
const system = useSystem()
const router = useRouter()
const { navBarHeight } = system.navBarInfo
import NavBar from '@/components/NavBar.vue'
import { reactive, onMounted } from 'vue'
const vdata: any = reactive({
  fixedStyle: {
    background: '#fff',
  },
  detailInfo: {},
  isPlayY: false,
  isPlayM: false,
  wordContent: '',
})
const favorite = () => {
  let params: any = null
  if (vdata.detailInfo.favoriteId) {
    params = {
      englishDictionaryId: vdata.detailInfo.id,
      favoriteId: vdata.detailInfo.favoriteId,
      status: 0,
    }
  } else {
    params = {
      englishDictionaryId: vdata.detailInfo.id,
      favoriteId: vdata.detailInfo.favoriteId,
      status: 1,
    }
  }
  addFavorite(params, false).then((res) => {
    if (vdata.detailInfo.favoriteId) {
      vdata.detailInfo.favoriteId = null
      setTimeout(() => {
        Taro.showToast({
          title: '已取消收藏',
          icon: 'none',
          duration: 2000,
        })
      }, 0)
    } else {
      vdata.detailInfo.favoriteId = res
      setTimeout(() => {
        Taro.showToast({
          title: '收藏成功',
          icon: 'none',
          duration: 2000,
        })
      }, 0)
    }
  })
}
//播放
let audioCtx: any = null
const play = (type, url, urls, isPlay = false) => {
  reset()
  if (!url && !urls) return
  if (type == 1) {
    vdata.isPlayY = true
    if (isPlay) vdata.isPlayM = true
  } else {
    vdata.isPlayM = true
  }
  audioCtx = Taro.createInnerAudioContext()
  audioCtx.src = url || urls
  audioCtx.play()
  audioCtx.onEnded(() => {
    if (type == 1) {
      vdata.isPlayY = false
      if (isPlay) vdata.isPlayM = false
    } else {
      vdata.isPlayM = false
    }
    audioCtx.stop()
  })
}
const reset = () => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  vdata.isPlayY = false
  vdata.isPlayM = false
}
//获取详情
const getDetail = () => {
  let params = {
    content: vdata.wordContent,
  }
  getWordTextDetail(params).then((res: any) => {
    if (res) {
      vdata.detailInfo = res
      play(
        1,
        vdata.detailInfo?.faYin?.pronunciationEn?.phoneticSymbolUrl ||
          vdata.detailInfo?.faYin?.pronunciationAm.phoneticSymbolUrl,
        vdata.detailInfo?.faYin?.pronunciationEn?.otherUrl ||
          vdata.detailInfo?.faYin?.pronunciationAm.otherUrl,
        !vdata.detailInfo?.faYin?.pronunciationEn?.otherUrl ||
          !vdata.detailInfo?.faYin?.pronunciationAm
      )
    } else {
      vdata.detailInfo = null
    }
  })
}
onMounted(() => {
  const { wordContent } = router.params
  vdata.wordContent = wordContent
  getDetail()
})
</script>

<style lang="scss">
.englishMain {
  height: 100vh;
  box-sizing: border-box;
  .scroll-content {
    background: #f6f9fd;
  }
  .introduce {
    background: #fff;
    padding: 20px;
    margin-bottom: 12px;
    .textInfo {
      position: relative;
      font-family: PingFangSC-Semibold;
      color: #343434;
      display: flex;
      align-items: center;
      .english {
        font-size: 26px;
        margin-right: 20px;
      }
      .chinese {
        font-size: 18px;
        color: #343434;
      }
      image {
        position: absolute;
        right: 0;
        width: 19px;
        height: 19px;
      }
    }
    .fyInfo {
      margin: 13px 0 25px;
      display: flex;
      align-items: center;
      .fy {
        padding: 0 8px;
        background: #ebefff;
        border-radius: 4px;
        height: 24px;
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #727488;
        .fyText {
          margin: 0 3px;
        }
      }
      .fyr {
        margin-right: 30px;
      }
      image {
        width: 16px;
        height: 16px;
      }
    }
    .interpretationInfo {
      .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #343434;
        margin-bottom: 18px;
      }
      .interpretationItem {
        display: flex;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        line-height: 18px;
        margin-bottom: 12px;
        .dw {
          width: 40px;
          flex-shrink: 0;
        }
        .ms {
          flex: 1;
        }
      }
    }
  }
  .deformation,
  .example {
    background: #fff;
    padding: 20px;
    margin-bottom: 12px;
    box-sizing: border-box;
    .title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #343434;
      margin-bottom: 18px;
    }
  }
  .deformation {
    .bxList {
      display: flex;
      .leftImg {
        width: 6.5px;
        flex-shrink: 0;
        position: relative;
        margin-right: 6px;
        margin-top: 10px;
      }
      image {
        width: 6.5px;
        height: 32px;
      }
      .exampleList {
        flex: 1;
        font-family: PingFangSC-Regular;
        .word {
          font-size: 14px;
          line-height: 17px;
          color: #343434;
          margin-bottom: 14px;
        }
        .exampleItem {
          display: flex;
        }
        .titleText {
          font-size: 13px;
          line-height: 16px;
          color: #bec3cc;
          margin-right: 10px;
          margin-bottom: 10px;
        }
        .deformationContent {
          font-size: 14px;
          line-height: 17px;
          color: #343434;
        }
      }
    }
  }
  .example {
    .exampleList {
      .exampleItem {
        margin-bottom: 16px;
        .englishText {
          font-family: PingFangSC-Regular;
          font-size: 15px;
          line-height: 20px;
          color: #343434;
          margin-bottom: 8px;
        }
        .chineseText {
          color: rgba(52, 52, 52, 0.5);
          font-size: 14px;
          line-height: 20px;
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
