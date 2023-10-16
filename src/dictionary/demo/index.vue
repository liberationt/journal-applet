<template>
  <view class="chineseMain" :style="{ paddingTop: `${navBarHeight + 40}px` }">
    <NavBar title="汉字详情" :fixedStyle="vdata.fixedStyle" />
    <!-- <scroll-view
      :scroll-into-view="vdata.toView"
      class="scroll-content"
      scroll-y="true"
      scroll-with-animation="true"
      @scroll="scrollChange"
      :style="{ height: `calc(100vh - ${navBarHeight}px)` }"
    > -->
    <view class="detailContent">
      <view class="compisitionContent">
        <view class="tapItem" :style="getStyle">
          <view
            v-for="(item, i) in vdata.contentList"
            :key="i"
            @tap="tabChange(i)"
            :class="['tap-item-info', vdata.type == i && 'tap-item-infos']"
            :id="`list${i}`"
            >{{ item }}</view
          >
        </view>
        <scroll-view
          :scroll-into-view="vdata.toView"
          class="scroll-content"
          scroll-y="true"
          scroll-with-animation="true"
          @scroll="scrollChange"
          :style="{ height: `calc(100vh - ${navBarHeight + 40}px)` }"
        >
          <view class="mainContent">
            <view
              :id="`list${i}`"
              class="list-item"
              v-for="(item, i) in vdata.contentList"
              :key="item"
            >
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <QuestionItem
      :ques="vdata.ques"
      :showQuestionNum="true"
      :questionIndex="1"
      :showKnowledge="true"
      :showExplain="true"
    ></QuestionItem>
    12345
    <!-- </scroll-view> -->
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
import { reactive, computed } from 'vue'
const vdata: any = reactive({
  contentList: ['释义', '组词', '同音字', '同部首'],
  type: 0,
  fixedStyle: {
    background: '#f6f9fd',
  },
  detailInfo: {},
  character: '乐',
  characterPy: '',
  anchorArray: [],
  mainHeight: 0,
  toView: '',
  isFixed: false,
  ques: {
    questionId: '8f06016e-3f7a-4e99-9d2e-3d5e41f595f4',
    source: 1,
    stageSubject: { code: '1313', name: '高中英语' },
    context: {
      stem: '题干内容',
      audio: null,
      original_text: null,
      options: null,
    },
    quesType: { code: '24', name: '阅读理解' },
    quesStruct: { code: '16', name: '多小题模板' },
    knowledge: [],
    children: [],
  },
})
const getStyle = computed(() => {
  let object: any = null
  object = {
    position: 'fixed',
    top: `${navBarHeight}px`,
    background: '#fff',
    width: '100%',
  }
  return object
})
const getNodes = (item) => {
  for (let i in item) {
    if (item[i] == vdata.character) {
      item = item.replace(vdata.character, `<span style='color:#D07506'>${vdata.character}</span>`)
    }
  }
  return item
}
const getDetail = () => {
  let params = {
    character: '乐' || vdata.character,
  }
  getCharDetail(params).then((res) => {
    if (res) {
      vdata.detailInfo = res
    }
  })
}
//tab改变
const tabChange = (i) => {
  vdata.type = i
  vdata.toView = `list${i}`
}
//滚动条改变
const scrollChange = (e: any) => {
  let scrollTop = e.detail.scrollTop
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
      } else {
        console.log(12345)
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
const getTopHeight = () => {
  let timer = setInterval(() => {
    Taro.createSelectorQuery()
      .select('.detailMain')
      .boundingClientRect((rec) => {
        if (rec) {
          vdata.mainHeight = rec.height
          console.log(vdata.mainHeight, 999)
          clearInterval(timer)
        }
      })
      .exec()
  }, 100)
}
useDidShow(() => {
  getSelectAll()
  getTopHeight()
  const { character, characterPy } = router.params
  // vdata.character = character
  // vdata.characterPy = characterPy
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
      .titleText {
        width: 220px;
        height: 220px;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/91dfb15ccaac4717ba777557dd19cf94/textBg.png')
          no-repeat center;
        background-size: 100% 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        image {
          width: 200px;
          height: 200px;
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
        overflow-y: scroll;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #666;
        /* 文本色/二级 */
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
          background: #fea81c;
          display: inline-block;
          border-radius: 20px;
        }
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
            margin-bottom: 12px;
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
              color: #666;
              font-weight: 600;
              margin-right: 10px;
              margin-bottom: 10px;
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
}
</style>
