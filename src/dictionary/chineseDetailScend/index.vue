<template>
  <view class="chineseMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar title="汉字详情" :fixedStyle="vdata.fixedStyle" />
    <template v-if="vdata.detailInfo">
      <scroll-view
        class="scroll-content"
        scroll-y="true"
        :scroll-with-animation="false"
        :scroll-top="vdata.scrollTop"
        @scroll="scrollChange"
        :style="{ height: `calc(100vh - ${navBarHeight}px)`, top: `${navBarHeight}px` }"
      >
        <view class="detailMain">
          <view class="pyList" v-if="vdata.detailInfo.py && vdata.detailInfo.py.length > 1">
            <view
              :class="['pyItem', vdata.pyType === i && 'pyItemSelect']"
              v-for="(item, i) in vdata.detailInfo.py"
              :key="i"
              @tap="pyChange(item, i)"
              >{{ item.pinYin }}</view
            >
          </view>
          <view class="chainesText">
            <view class="topText">
              <view>{{ vdata.itemInfo?.pinYin }}</view>
              <view class="topBtn" v-if="!vdata.isPlay" @tap="play">
                <image
                  :src="
                    vdata.isPlay
                      ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hzyd/fe1163f6148d4b45926f802d6a16a872/bf.gif'
                      : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/47989afce8d0466d83cd0ae18eba5ff3/bf.png'
                  "
                  mode="scaleToFill"
                />
              </view>
              <view class="bfBtn" v-else>
                <image
                  :src="
                    vdata.isPlay
                      ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hzyd/fe1163f6148d4b45926f802d6a16a872/bf.gif'
                      : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/47989afce8d0466d83cd0ae18eba5ff3/bf.png'
                  "
                  mode="scaleToFill"
                />
              </view>
            </view>
            <view class="titleText">
              <image
                :src="vdata.detailInfo.gifImageUrl || vdata.detailInfo.svgImageUrl"
                mode="scaleToFill"
              />
              <view class="leftBtn"></view>
              <view class="bottomBtn"></view>
            </view>
            <view class="brief">
              <view class="display">
                <text class="label">笔画</text>
                <text>{{ vdata.detailInfo.biHua }}</text>
              </view>
              <view class="display">
                <text class="label">部首</text>
                <text>{{ vdata.detailInfo.buShou }}</text>
              </view>
              <view class="display">
                <text class="label">结构</text>
                <text>{{ vdata.detailInfo.jieGou }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="detailContent">
          <view class="compisitionContent">
            <view
              :class="['tapItem', vdata.isFixed && 'tapItemFixed']"
              :style="{ top: vdata.isFixed && `${navBarHeight}px` }"
            >
              <view
                v-for="(item, i) in vdata.contentList"
                :key="i"
                @tap="tabChange(i)"
                :class="['tap-item-info', vdata.type == i && 'tap-item-infos']"
                :id="`list${item.id}`"
                >{{ item.label }}</view
              >
            </view>
            <view class="mainContent">
              <view
                id="list0"
                class="list-item"
                v-if="vdata.itemInfo?.commonExplain && vdata.itemInfo?.commonExplain.length"
              >
                <view class="item-page">释义</view>
                <view class="syList">
                  <view v-for="(item, i) in vdata.itemInfo.commonExplain" :key="i" class="syItem">
                    <view v-if="item.type == 1">
                      {{ item.explain }}
                    </view>
                    <view v-else-if="item.type == 2"> 例子： {{ item.explain }} </view>
                  </view>
                </view>
              </view>
              <view
                id="list1"
                class="list-item"
                v-if="
                  (vdata.detailInfo.startZuCi && vdata.detailInfo.startZuCi.length) ||
                  (vdata.detailInfo?.jieWeiZuCi && vdata.detailInfo?.jieWeiZuCi.length) ||
                  (vdata.detailInfo?.middleZuCi && vdata.detailInfo?.middleZuCi.length)
                "
              >
                <view class="item-page">组词</view>
                <template v-if="vdata.detailInfo?.startZuCi && vdata.detailInfo?.startZuCi.length">
                  <view class="itemText">
                    <view class="title">{{ vdata.character }}开头的词语</view>
                    <view class="itemList">
                      <template v-for="(item, i) in vdata.detailInfo.startZuCi" :key="i">
                        <view class="item-word" v-if="i < 10">
                          <rich-text :nodes="getNodes(item)"></rich-text>
                        </view>
                      </template>
                    </view>
                  </view>
                </template>
                <template
                  v-if="vdata.detailInfo?.middleZuCi && vdata.detailInfo?.middleZuCi.length"
                >
                  <view class="itemText">
                    <view class="title">{{ vdata.character }}中间的词语</view>
                    <view class="itemList">
                      <template v-for="(item, i) in vdata.detailInfo.middleZuCi" :key="i">
                        <view class="item-word" v-if="i < 10">
                          <rich-text :nodes="getNodes(item)"></rich-text>
                        </view>
                      </template>
                    </view>
                  </view>
                </template>
                <template
                  v-if="vdata.detailInfo?.jieWeiZuCi && vdata.detailInfo?.jieWeiZuCi.length"
                >
                  <view class="itemText">
                    <view class="title">{{ vdata.character }}结尾的词语</view>
                    <view class="itemList">
                      <template v-for="(item, i) in vdata.detailInfo.jieWeiZuCi" :key="i">
                        <view class="item-word" v-if="i < 10">
                          <rich-text :nodes="getNodes(item)"></rich-text>
                        </view>
                      </template>
                    </view>
                  </view>
                </template>
              </view>
              <view
                id="list2"
                class="list-item"
                v-if="vdata.detailInfo?.tongYinZi && vdata.detailInfo?.tongYinZi.length"
              >
                <view class="item-page">同音字</view>
                <view class="flexBs">
                  <view
                    v-for="(item, i) in vdata.detailInfo.tongYinZi"
                    class="flexBsItem"
                    :key="i"
                    @tap="changeText(item)"
                  >
                    <image v-if="item.selfImageUrl" :src="item.selfImageUrl" />
                    <text v-else>{{ item.content }}</text>
                  </view>
                </view>
              </view>
              <view
                id="list3"
                class="list-item"
                v-if="vdata.detailInfo?.tongBuShou && vdata.detailInfo?.tongBuShou.length"
              >
                <view class="item-page">同部首</view>
                <view class="flexBs">
                  <view
                    v-for="(item, i) in vdata.detailInfo.tongBuShou"
                    class="flexBsItem"
                    :key="i"
                    @tap="changeText(item)"
                  >
                    <image v-if="item.selfImageUrl" :src="item.selfImageUrl" />
                    <text v-else>{{ item.content }}</text>
                  </view>
                </view>
              </view>
            </view>
            <!-- </scroll-view> -->
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
        <view>没有找到相关汉字，换个汉字试试吧</view>
      </view>
    </template>
  </view>
</template>
<script lang="ts" setup>
import { useSystem } from '@/stores'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { getCharDetail } from '@/api/dictionary'
const system = useSystem()
const router = useRouter()
const { navBarHeight } = system.navBarInfo
import NavBar from '@/components/NavBar.vue'
import { reactive, computed, onMounted } from 'vue'
const vdata: any = reactive({
  contentList: [
    // {
    //   label: '释义',
    //   id: 0,
    // },
    // {
    //   label: '组词',
    //   id: 1,
    // },
    // {
    //   label: '同音字',
    //   id: 2,
    // },
    // {
    //   label: '同部首',
    //   id: 3,
    // },
  ],
  type: 0,
  pyType: 0,
  fixedStyle: {
    background: '#f6f9fd',
  },
  detailInfo: {},
  character: '',
  characterPy: '',
  anchorArray: [],
  mainHeight: 0,
  toView: '',
  isFixed: false,
  isClick: false,
  scrollTop: 0,
  itemInfo: null,
  isPlay: false,
})
const getText = (item) => {
  let str = `\\u${item.charCodeAt().toString(16)}`
  let obj = JSON.stringify({
    str: str,
  })
  let res = JSON.parse(obj)
  return res.str
}
const getStyle = computed(() => {
  let object: any = null
  if (vdata.isFixed) {
    object = {
      position: 'fixed',
      top: `${navBarHeight}px`,
      background: '#fff',
      width: '100%',
      height: '68px',
    }
  }
  return object
})
//设置文字颜色
const getNodes = (item) => {
  for (let i in item) {
    if (item[i] == vdata.character) {
      item = item.replace(vdata.character, `<span style='color:#D07506'>${vdata.character}</span>`)
    }
  }
  return item
}
//拼音改变
const pyChange = (item, i) => {
  vdata.itemInfo = item
  vdata.pyType = i
  play()
}
const changeText = (item) => {
  if (item.hasDetail) {
    Taro.navigateTo({
      url: `../chineseDetail/index?character=${item.content}`,
    })
  }
}
//播放
let audioCtx: any = null
const play = () => {
  reset()
  if (!vdata.itemInfo.pinYinUrl) return
  vdata.isPlay = true
  audioCtx = Taro.createInnerAudioContext()
  audioCtx.src = vdata.itemInfo.pinYinUrl
  audioCtx.play()
  audioCtx.onEnded(() => {
    vdata.isPlay = false
    audioCtx.stop()
  })
}
const reset = () => {
  if (audioCtx) {
    audioCtx.destroy()
    audioCtx = null
  }
  vdata.isPlay = false
}

//获取详情
const getDetail = () => {
  let params = {
    character: vdata.character,
  }
  getCharDetail(params).then((res: any) => {
    if (res) {
      vdata.detailInfo = res
      if (vdata.detailInfo.py && vdata.detailInfo.py.length == 1) {
        vdata.itemInfo = vdata.detailInfo.py[0]
      } else {
        if (vdata.characterPy) {
          let index = vdata.detailInfo.py.findIndex((item) => item.pinYin == vdata.characterPy)
          vdata.pyType = index
          vdata.itemInfo = vdata.detailInfo.py[index] || vdata.detailInfo.py[0]
        } else {
          vdata.itemInfo = vdata.detailInfo.py[0]
          vdata.pyType = 0
        }
      }
      if (
        vdata.detailInfo.py &&
        vdata.detailInfo.py.length &&
        vdata.detailInfo.py[0].commonExplain &&
        vdata.detailInfo.py[0].commonExplain.length
      ) {
        vdata.contentList.push({
          label: '释义',
          id: 0,
        })
      }
      if (
        (vdata.detailInfo.startZuCi && vdata.detailInfo.startZuCi.length) ||
        (vdata.detailInfo.middleZuCi && vdata.detailInfo.middleZuCi.length) ||
        (vdata.detailInfo.jieWeiZuCi && vdata.detailInfo.jieWeiZuCi.length)
      ) {
        vdata.contentList.push({
          label: '组词',
          id: 1,
        })
      }
      if (vdata.detailInfo.tongYinZi && vdata.detailInfo.tongYinZi.length) {
        vdata.contentList.push({
          label: '同音字',
          id: 2,
        })
      }
      if (vdata.detailInfo.tongBuShou && vdata.detailInfo.tongBuShou.length) {
        vdata.contentList.push({
          label: '同部首',
          id: 3,
        })
      }
      play()
    } else {
      vdata.detailInfo = null
    }
    getSelectAll()
  })
}
//tab改变
const tabChange = (i) => {
  vdata.isClick = true
  let height = vdata.mainHeight - 24
  if (i > 0) {
    height += vdata.anchorArray[i - 1]
  } else {
    height = vdata.mainHeight + 24
  }
  vdata.type = i
  vdata.scrollTop = height
}
//滚动条改变
const scrollChange = (e: any) => {
  let TopHeight = vdata.mainHeight + 20
  let fixedTop = e.detail.scrollTop - TopHeight
  let scrollTop = e.detail.scrollTop - (vdata.mainHeight - 24)
  if (fixedTop > 0) {
    vdata.isFixed = true
    vdata.fixedStyle = {
      background: '#fff',
    }
  } else {
    vdata.isFixed = false
    vdata.isClick = false
    vdata.fixedStyle = {
      background: '#f6f9fd',
    }
  }
  let scrollArr = vdata.anchorArray
  if (scrollTop >= scrollArr[scrollArr.length - 1]) {
    vdata.type = scrollArr.length - 1
    return
  } else {
    for (let i = 0; i < scrollArr.length; i++) {
      if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
        vdata.type = 0
      } else if (scrollTop >= scrollArr[i - 1] && scrollTop < scrollArr[i]) {
        vdata.type = i
      } else if (scrollTop >= scrollArr[i]) {
        vdata.type = i + 1
      }
    }
  }
}

//获取每一项的高度
const getSelectAll = () => {
  let timer = setInterval(() => {
    let query = Taro.createSelectorQuery()
    let heightArr = []
    let h = 10
    query
      .selectAll('.list-item')
      .boundingClientRect((react: any) => {
        if (react) {
          react.forEach((res) => {
            h += res.height
            heightArr.push(h)
          })
          vdata.anchorArray = heightArr
          clearInterval(timer)
          timer = null
        }
      })
      .exec()
  }, 100)
}
//获取上面内容高度
const getTopHeight = () => {
  let timer = setInterval(() => {
    Taro.createSelectorQuery()
      .select('.detailMain')
      .boundingClientRect((rec) => {
        if (rec) {
          vdata.mainHeight = rec.height
          clearInterval(timer)
        }
      })
      .exec()
  }, 100)
}
onMounted(() => {
  // getSelectAll()
  getTopHeight()
  const { character } = router.params
  vdata.character = character
  vdata.characterPy = router.params.characterPy || ''
  getDetail()
})
</script>

<style lang="scss">
.chineseMain {
  background-color: #f6f9fd;
  height: 100vh;
  box-sizing: border-box;
  .scroll-content {
    // padding-top: 20px;
    position: fixed;
    left: 0;
    right: 0;
  }
  .detailMain {
    margin: 0 20px;
    padding-top: 20px;
    .pyList {
      display: flex;
      width: 100%;
      // margin: 26px 20px 16px;
      .pyItem {
        width: 56px;
        height: 30px;
        background: #faf1e6;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        text-align: center;
        /* 文本色/二级 */
        color: #666666;
        border-radius: 18px;
        text-align: center;
        line-height: 30px;
        margin-right: 15px;
      }
      .pyItemSelect {
        background: #d07506;
        color: #ffffff;
        font-family: PingFangSC-Semibold;
      }
    }
    .chainesText {
      margin: 16px 0;
      height: 354px;
      background: #fff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 0 20px;
      .topText {
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        font-family: PingFangSC-Semibold;
        font-size: 26px;
        color: #333333;
        font-weight: 700;
      }
      .topBtn {
        width: 36px;
        height: 30px;
        border-radius: 14px;
        background: linear-gradient(270deg, #ffddb9 -27%, #fff6ed 75%);
        position: absolute;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        image {
          width: 18px;
          height: 16px;
        }
      }
      .bfBtn {
        width: 36px;
        height: 30px;
        border-radius: 14px;
        position: absolute;
        right: 0;
        image {
          width: 36px;
          height: 30px;
        }
      }
      .titleText {
        width: 220px;
        height: 220px;
        // background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/91dfb15ccaac4717ba777557dd19cf94/textBg.png')
        //   no-repeat center;
        // background-size: 100% 100%;
        border: 3px solid #f9d1a6;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 18px;
        position: relative;
        image {
          width: 200px;
          height: 200px;
        }
        .leftBtn {
          width: 20px;
          height: 30px;
          position: absolute;
          top: 3px;
          left: 3px;
          background: #fff;
          border-radius: 10px 0 0 0;
        }
        .bottomBtn {
          position: absolute;
          right: 5px;
          bottom: 5px;
          width: 45px;
          height: 15px;
          background: #fff;
        }
      }
      .brief {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .display {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          font-family: PingFangSC-Regular;
          color: #333333;
          .label {
            color: #999999;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .detailContent {
    background: #fff;
    padding: 0 20px 30px;
    .compisitionContent {
      .tapItem {
        height: 40px;
        display: flex;
        margin-bottom: 25px;
        // overflow-y: scroll;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #666;
        z-index: 100;
        color: #666666;
        align-items: center;
        .tap-item-info {
          margin-right: 25px;
          flex-shrink: 0;
          position: relative;
        }
        .tap-item-infos {
          position: relative;
          font-size: 15px;
          font-weight: 600;
          font-family: PingFangSC-Semibold;
          color: #333;
        }
        .tap-item-infos:after {
          position: absolute;
          content: '';
          width: 20px;
          height: 4px;
          top: 25px;
          left: 50%;
          transform: translate(-50%);
          background: #d07506;
          display: inline-block;
          border-radius: 20px;
        }
      }
      .tapItemFixed {
        position: fixed;
        background: #fff;
        width: 100%;
        height: 68px;
        z-index: 100;
      }
      .fiexdTap {
        position: fixed;
        width: 100%;
        z-index: 100;
        background: #fff;
      }
      .mainContent {
        .list-item {
          padding: 5px 0;
          background: #fff;
          margin-bottom: 10px;
          .item-page {
            font-family: PingFangSC-Semibold;
            font-size: 15px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 10px;
          }
          .syList {
            .syItem {
              font-family: PingFangSC-Regular;
              font-size: 13px;
              line-height: 22px;
              color: #666666;
            }
          }
          .itemText {
            .title {
              font-family: PingFangSC-Regular;
              font-size: 13px;
              color: #666666;
              margin-bottom: 12px;
            }
            .itemList {
              display: flex;
              flex-wrap: wrap;
              .item-word {
                padding: 6px 14px;
                margin-right: 12px;
                margin-bottom: 12px;
                background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/bc88cb3bbc144e549a5dfe47f7801194/textCenter.png')
                  no-repeat center;
                background-size: 100% 100%;
                font-size: 13px;
                color: #666666;
              }
            }
          }
          .flexBs {
            display: flex;
            flex-wrap: wrap;
            .flexBsItem {
              width: 42px;
              height: 42px;
              background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/7f3a3189ee164211ba28741cf600428a/text.png')
                no-repeat center;
              background-size: 100% 100%;
              border-radius: 3px;
              text-align: center;
              line-height: 42px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #000;
              margin-right: 10px;
              margin-bottom: 10px;
              font-size: 20px;
              font-family: PingFangSC-Regular;
              image {
                width: 22px;
                height: 22px;
              }
            }
          }
          // .item-content {
          //   font-family: PingFangSC-Regular;
          //   font-size: 16px;
          //   font-weight: normal;
          //   line-height: 24px;
          //   color: #333333;
          // }
        }
      }
      // .scroll-content {
      //   background: #fff;
      //   .mainContent {
      //     .list-item {
      //       padding: 20px 15px;
      //       background: #fff;
      //       margin-bottom: 10px;
      //       .item-page {
      //         font-family: PingFangSC-Semibold;
      //         font-size: 15px;
      //         font-weight: 600;
      //         color: #333333;
      //         margin-bottom: 10px;
      //       }
      //       .item-content {
      //         font-family: PingFangSC-Regular;
      //         font-size: 16px;
      //         font-weight: normal;
      //         line-height: 24px;
      //         color: #333333;
      //       }
      //     }
      //     .textareaText {
      //       width: 100%;
      //     }
      //   }
      // }
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
