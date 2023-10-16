<template>
  <view class="compositionMain">
    <view class="topSearch">
      <view class="searchInput">
        <nut-input placeholder="别忘记输入作文标题哦" v-model="vdata.title"
      /></view>
      <view class="grandText" @tap="showGrand">
        <text>{{ getList[vdata.grand] }}</text>
        <text class="jb"></text>
      </view>
    </view>
    <!-- <view class="compisitionContent">
      <view class="tapItem">
        <view
          v-for="(item, i) in vdata.imgList"
          :key="i"
          @tap="tabChange(i)"
          :class="['tap-item-info', vdata.type == i && 'tap-item-infos']"
          :id="`list${i}`"
          >第{{ i + 1 }}页</view
        >
      </view>
      <scroll-view
        :scroll-into-view="vdata.toView"
        class="scroll-content"
        scroll-y="true"
        scroll-with-animation="true"
        @scroll="scrollChange"
        :style="{
          height: `calc(100vh - 190px)`,
        }"
      >
        <view class="mainContent">
          <view
            v-for="(item, i) in vdata.imgList"
            @tap="changeView(item)"
            :id="`list${i}`"
            class="list-item"
            :key="i"
          >
            <view class="item-page">第{{ i + 1 }} 页</view>
            <view class="item-content">{{ vdata.contentList[i]?.content }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="textNumber"> {{ textNumber }}字 </view> -->
    <view class="imageList">
      <view v-for="(item, i) in vdata.imgList" :key="i" class="img-item">
        <image :src="item" mode="widthFix" />
      </view>
    </view>
    <view class="footer">
      <!-- <view
        :class="['again', vdata.imgList.length >= 5 && 'disagain']"
        @tap="vdata.imgList.length < 5 && reloadImg()"
        >未完善,继续传</view
      > -->
      <view class="begin" @tap="begin">开始批改</view>
    </view>
    <!-- 年级 -->
    <GradePopup
      :grande="vdata.grand"
      @handleChange="handleChange"
      ref="gradeShowPopup"
    ></GradePopup>
    <!-- 分析内容 -->
    <nut-overlay v-model:visible="vdata.result" :close-on-click-overlay="false">
      <view class="resultInfo">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/aa7749c80494492eb0ec18d7b42b03ea/fx.png"
          mode="scaleToFill"
        />
        <view class="content" v-if="vdata.showText1">
          正在分析
          <text>[内容] 维度...</text>
        </view>
        <div class="content" v-if="vdata.showText2">
          正在分析
          <text>[表达] 维度...</text>
        </div>
        <div class="content" v-if="vdata.showText3">
          正在分析
          <text>[结构] 维度...</text>
        </div>
        <div class="content" v-if="vdata.showText4">
          正在分析
          <text>[行文规范] 维度...</text>
        </div>
      </view>
    </nut-overlay>
  </view>
</template>
<script setup lang="ts">
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { reactive, ref, onMounted, computed } from 'vue'
import GradePopup from '@/components/GradePopup.vue'
import { usePerson } from '@/stores'
import { getList } from '@/utils/index'
import { getEssayContent, getEssayCorrectResult } from '@/api/essayCorrection'
const router = useRouter()
const personInfo = usePerson()
const gradeShowPopup = ref()
const vdata: any = reactive({
  title: '',
  grand: 1,
  result: false,
  type: 0,
  list: ['list0', 'list1', 'list2'],
  toView: '',
  imgList: [],
  contentList: [],
  anchorArray: [],
  showText1: false,
  showText2: false,
  showText3: false,
  showText4: false,
})
const showGrand = () => {
  gradeShowPopup.value.popupShow(vdata.grand)
}
const handleChange = (val) => {
  vdata.grand = val[0]
}
//开始批改
const begin = () => {
  if (!vdata.title) {
    Taro.showToast({
      title: '请输入作文标题',
      icon: 'none',
      duration: 2000,
    })
    return
  }
  vdata.result = true
  setTimeout(() => {
    vdata.showText1 = true
  }, 3000)
  setTimeout(() => {
    vdata.showText2 = true
  }, 8000)
  setTimeout(() => {
    vdata.showText3 = true
  }, 12000)
  setTimeout(() => {
    vdata.showText4 = true
  }, 20000)
  let params = {
    grade: vdata.grand,
    mode: 1,
    imageUrl: vdata.imgList,
    title: vdata.title,
  }
  getEssayCorrectResult(params)
    .then((res) => {
      personInfo.setEssay(res)
      personInfo.setGrade(vdata.grand)
      Taro.redirectTo({
        url: `../compositionResult/index`,
      })
      Taro.setStorageSync('essayCorrect', JSON.stringify(res))
    })
    .catch((err) => {
      vdata.result = false
    })
}
// 总字数
// const textNumber = computed(() => {
//   let textNumber = 0
//   vdata.contentList.forEach((item) => {
//     textNumber += item.textNumber
//   })
//   return textNumber
// })
//滚动条改变
// const scrollChange = (e) => {
//   let scrollTop = e.detail.scrollTop
//   let scrollArr = vdata.anchorArray
//   if (scrollTop >= scrollArr[scrollArr.length - 1]) {
//     vdata.type = scrollArr.length - 1
//     return
//   } else {
//     for (let i = 0; i < scrollArr.length; i++) {
//       if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
//         vdata.type = 0
//       } else if (scrollTop >= scrollArr[i - 1] && scrollTop < scrollArr[i]) {
//         vdata.type = i
//       } else {
//       }
//     }
//   }
// }
//tab改变
// const tabChange = (i) => {
//   vdata.type = i
//   vdata.toView = `list${i}`
// }
//再次上传
// const reloadImg = () => {
//   Taro.setStorageSync('essayImgList', JSON.stringify(vdata.imgList))
//   Taro.setStorageSync('contentList', JSON.stringify(vdata.contentList))
//   Taro.redirectTo({
//     url: '../photographPage/index',
//   })
// }
//获取每一项的高度
// const getSelectAll = () => {
//   let timer = setInterval(() => {
//     let query = Taro.createSelectorQuery()
//     let heightArr = []
//     let h = 10
//     query
//       .selectAll('.list-item')
//       .boundingClientRect((react) => {
//         if (react) {
//           react.forEach((res) => {
//             h += res.height
//             heightArr.push(h)
//           })
//           vdata.anchorArray = heightArr
//           clearInterval(timer)
//           timer = null
//         }
//       })
//       .exec()
//   }, 100)
// }
//获取图片内容
// const getEssayText = () => {
//   let params = {
//     title: vdata.title,
//     imageUrl: vdata.imgList[vdata.imgList.length - 1],
//   }
//   getEssayContent(params).then((res) => {
//     if (res) {
//       vdata.contentList.push({
//         content: res.text,
//         textNumber: res.num,
//         title: res.title,
//       })
//       vdata.title = vdata.title ? vdata.title : res.title
//     }
//   })
// }
useDidShow(() => {
  // vdata.imgList = Taro.getStorageSync('essayImgList')
  //   ? JSON.parse(Taro.getStorageSync('essayImgList'))
  //   : []
  // vdata.contentList = Taro.getStorageSync('contentList')
  //   ? JSON.parse(Taro.getStorageSync('contentList'))
  //   : []
  // vdata.title = vdata.contentList[0]?.title || ''
  // vdata.imgList.push(router.params.tempFilePath)
  // getEssayText()
})
onMounted(() => {
  vdata.imgList = Taro.getStorageSync('essayImgList')
  // getSelectAll()
})
</script>
<style lang="scss">
.compositionMain {
  padding-bottom: 90px;
  box-sizing: border-box;
  // padding: 15px;
  .topSearch {
    // position: absolute;
    margin: 10px 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .searchInput {
      width: 241px;
      height: 36px;
      box-sizing: border-box;
      .nut-input.nut-input-border {
        border: 1px solid #fea81c;
      }
      .nut-input {
        padding: 0;
        border-radius: 20px;
        padding: 0 20px;
        box-sizing: border-box;
        background: rgba(254, 168, 28, 0.05);
      }

      .nut-input .input-text,
      .nut-input__text--readonly {
        height: 36px;
        width: 100%;
        border-radius: 18px;
      }
    }
    .grandText {
      display: flex;
      align-items: center;
      // justify-content: center;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      font-weight: normal;
      color: #333333;
      .jb {
        border: 1px solid #333;
        width: 5px;
        height: 5px;
        border-left-color: transparent;
        border-top-color: transparent;
        transform: rotate(45deg); //上箭头
        margin-top: -2px;
        margin-left: 5px;
      }
    }
  }
  .imageList {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    image {
      width: 100%;
    }
  }
  .footer {
    height: 90px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 15px 20px;
    box-sizing: border-box;
    // view {
    //   height: 40px;
    //   width: 162px;
    //   font-family: PingFangSC-Medium;
    //   font-size: 16px;
    //   text-align: center;
    //   line-height: 40px;
    //   box-sizing: border-box;
    //   border-radius: 23px;
    // }
    // .again {
    //   border: 1px solid #fea81c;
    //   color: #fea81c;
    // }
    // .disagain {
    //   background: #eeeeee;
    //   border: none;
    //   color: #cbcbcb;
    // }
    .begin {
      background: #fea81c;
      color: #f9f9f9;
      height: 40px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      text-align: center;
      line-height: 40px;
      box-sizing: border-box;
      border-radius: 23px;
      width: 100%;
    }
  }
  .resultInfo {
    position: absolute;
    left: 50%;
    top: 30%;
    width: 265px;
    text-align: center;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 12px;
    box-sizing: border-box;
    padding: 30px 0;
    image {
      width: 49px;
      height: 42px;
    }
    .content {
      padding-left: 35px;
      line-height: 30px;
      display: flex;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      align-items: center;
      text {
        color: #fea81c;
        margin-left: 5px;
      }
    }
  }
  .compisitionContent {
    .tapItem {
      height: 60px;
      padding: 0 15px;
      display: flex;
      overflow-y: scroll;
      line-height: 50px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      align-items: center;
      .tap-item-info {
        margin-right: 25px;
        flex-shrink: 0;
        position: relative;
      }
      .tap-item-infos {
        position: relative;
        font-size: 16px;
        font-weight: 600;
        font-family: PingFangSC-Semibold;
        color: #333;
      }
      .tap-item-infos:after {
        position: absolute;
        content: '';
        width: 20px;
        height: 4px;
        top: 40px;
        left: 50%;
        transform: translate(-50%);
        background: #fea81c;
        display: inline-block;
        border-radius: 20px;
      }
    }
    .scroll-content {
      background: #f6f6f6;
      .mainContent {
        .list-item {
          padding: 20px 15px;
          background: #fff;
          margin-bottom: 10px;
          .item-page {
            font-family: PingFangSC-Semibold;
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 10px;
          }
          .item-content {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            font-weight: normal;
            line-height: 24px;
            color: #333333;
          }
        }
      }
    }
  }
  .textNumber {
    position: fixed;
    z-index: 10;
    height: 40px;
    line-height: 40px;
    right: 0;
    bottom: 120px;
    font-size: 13px;
    text-align: center;
    background: #ffffff;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    color: #fea81c;
    padding: 0 14px;
    border-radius: 20px 0 0 20px;
    box-shadow: 0px 2px 12px 0px rgba(199, 179, 147, 0.35), 0px 3px 6px 0px rgba(255, 158, 0, 0.32);
  }
}
</style>
