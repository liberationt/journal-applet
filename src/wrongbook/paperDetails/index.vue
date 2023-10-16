<template>
  <!-- <scroll-view class="scroll-view_H" :scroll-y="true" style="height: 100vh" @scroll="scroll"> -->
  <view class="mainContent" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar :title="vdata.title" background="#fff" />
    <scroll-view
      class="scroll-view_H"
      :style="{ height: `calc(100vh - ${navBarHeight + 120}px)` }"
      :scroll-y="true"
    >
      <view class="mainImg">
        <!-- <image v-for="(item, i) in vdata.info.imageUrls" :key="i" :src="item" mode="widthFix" /> -->
        <!-- <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/757e4e8f210b48d199365f84a1b913bd/zj.png"
          mode="widthFix"
        /> -->
        <view class="titleText">{{ vdata.info?.exercisePaperName }}</view>
        <view class="classInfo">
          <view class="classItem" style="margin-right: 20px">
            <text>班级：</text>
            <view className="fill"></view>
          </view>
          <view class="classItem">
            <text>姓名：</text>
            <view className="fill"></view>
          </view>
        </view>
        <view class="questionList">
          <view v-for="(item, index) in vdata.recordList" :key="index" class="questionItem">
            <template v-if="index <= 3">
              <view class="questionIndex">第{{ index + 1 }}题</view>
              <view v-if="item.bookType != 4 && item.bookType != 5">
                <image
                  :src="item.topicImageUrl"
                  mode="widthFix"
                  :style="{ width: vdata.imgSize[index + '_' + 'index'] || 0 }"
                  @load="(e) => getImgSize(e, index + '_' + 'index')"
                />
              </view>
              <view v-else>
                <question-item-info
                  :ques="getItemQuestion(item.topicContent)"
                  :showExplain="false"
                ></question-item-info>
              </view>
            </template>
          </view>
        </view>
        <view class="yl" v-if="vdata.recordList && vdata.recordList.length > 4"
          >当前为预览，只展示部分内容</view
        >
      </view>
    </scroll-view>
    <nut-overlay
      v-model:visible="vdata.showPapers"
      :lock-scroll="true"
      :close-on-click-overlay="false"
    >
      <view class="paperInfo">
        <view class="close" @tap="closePapers">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/721ebdcae00a48d7892f6b353cc3f762/closeBlack.png"
            mode="scaleToFill"
          />
        </view>
        <view class="title">接收邮箱</view>
        <view>
          <nut-input
            v-model="vdata.to"
            clearable
            @clear="clearPaperName"
            placeholder="请输入邮箱"
            @update:model-value="valChnage"
          />
          <view class="errorMsg" v-if="vdata.showMsg">{{ vdata.msg }}</view>
        </view>
        <view class="btn">
          <nut-button block type="primary" @tap="submitPaper">确定</nut-button>
        </view>
      </view>
    </nut-overlay>
    <view class="bottom">
      <view class="bottom-item" @tap="shareWx">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/93d2d57e04934660a12c7022f6b42203/wx.png"
        />
        <text>微信发送</text>
      </view>
      <view class="bottom-item" @tap="emitCommit">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/c27b67160e1b43929ff6e1c411b6468f/yx.png"
        />
        <text>邮箱发送</text>
      </view>
      <view class="bottom-item" @tap="copyUrl">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/93d2d57e04934660a12c7022f6b42203/wx.png"
        />
        <text>复制链接</text>
      </view>
    </view>
  </view>
  <!-- </scroll-view> -->
</template>

<script setup lang="ts">
import Taro, { useRouter, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { wrongList } from '@/api/wrongbook'
import NavBar from '@/components/NavBar.vue'
import QuestionItemInfo from '@/components/QuestionItemInfoPaper/QuestionItem.vue'

import { reactive } from 'vue'
import { useSystem } from '@/stores'
import { sendEmail } from '@/api/wrongbook'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const router = useRouter()
const vdata: any = reactive({
  info: {},
  to: '',
  msg: '',
  showMsg: false,
  showPapers: false,
  title: '',
  recordList: [],
  imgSize: {},
})
const getItemQuestion = (topicContent) => {
  let item = JSON.parse(topicContent)
  return item.data
}
const closePapers = () => {
  vdata.showPapers = false
  reset()
}
const clearPaperName = () => {
  reset()
}
const copyUrl = () => {
  Taro.setClipboardData({
    data: vdata.info.pdfPreviewUrl,
    success(res) {
      console.log(res)
    },
  })
}
const valChnage = () => {
  if (!vdata.to) {
    vdata.msg = ''
    vdata.showMsg = false
  }
}
const getImgSize = (e, index, type?: Number) => {
  let maxWidth = 350
  const { width } = e.detail

  if (width > maxWidth) {
    vdata.imgSize[index] = `${maxWidth}px`
  } else {
    vdata.imgSize[index] = `${width}px`
  }
}
//发送邮箱
const submitPaper = () => {
  var reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
  if (reg.test(vdata.to)) {
    let params = {
      fileUrl: vdata.info.pdfPreviewUrl,
      paperCourse: vdata.info.courseType,
      paperName: vdata.info.exercisePaperName,
      to: vdata.to,
    }
    sendEmail(params).then((res) => {
      if (res) {
        Taro.showToast({
          title: '发送成功',
          icon: 'none',
          duration: 2000,
        })
        closePapers()
      }
    })
  } else {
    vdata.showMsg = true
    vdata.msg = '请输入正确邮箱'
  }
}
const emitCommit = () => {
  vdata.showPapers = true
  reset()
}
const reset = () => {
  vdata.to = ''
  vdata.showMsg = false
  vdata.msg = ''
}
const shareWx = () => {
  Taro.downloadFile({
    url: vdata.info.pdfPreviewUrl,
    success: function (res) {
      const filePath = res.tempFilePath
      Taro.shareFileMessage({
        filePath: filePath,
        fileName: `${vdata.info.exercisePaperName}.pdf`,
        fail() {
          Taro.showToast({
            title: '取消分享',
            icon: 'none',
            duration: 2000,
          })
        },
        success() {
          Taro.showToast({
            title: '分享成功',
            icon: 'none',
            duration: 2000,
          })
        },
      })
    },
  })
}
//获取列表
const getWrongList = (idList) => {
  let params = {
    condition: {
      course: '',
      grade: '',
      sourceType: '',
      term: '',
      timeLimit: 0,
      idList,
    },
    current: 1,
    size: 10,
  }
  wrongList(params).then((res: any) => {
    if (res.records) {
      vdata.recordList = res.records
    }
  })
}
useShareAppMessage((res) => {})
useDidShow(() => {
  const { params } = router
  vdata.info = JSON.parse(params.info)
  vdata.title = '错题本' || vdata.info.exercisePaperName
  getWrongList(vdata.info.questionIdList)
})
</script>

<style lang="scss">
.mainContent {
  box-sizing: border-box;
  // background: #f4f8fc;
  height: 100vh;
  padding-bottom: 120px;
  .bottom {
    height: 117px;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .bottom-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
    }
    image {
      width: 36px;
      height: 36px;
      margin-bottom: 5px;
    }
  }
}

.scroll-view_H {
  box-sizing: border-box;
  padding-bottom: 8px;
  .mainImg {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    height: 100%;
    image {
      width: 100%;
    }
    .titleText {
      margin: 20px auto;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 17px;
      color: #333333;
    }
    .classInfo {
      display: flex;
      justify-content: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      .classItem {
        display: flex;
      }
      .fill {
        width: 80px;
        border-bottom: 1px solid #333333;
      }
    }
    .questionList {
      .questionItem {
        margin: 20px 0;
      }
      .questionIndex {
        width: 33px;
        height: 17px;
        border-radius: 2px;
        background: #efefef;
        font-family: PingFangSC-Regular;
        font-size: 10px;
        font-weight: normal;
        color: #333333;
        line-height: 17px;
        text-align: center;
        margin-bottom: 10px;
      }
    }
    .yl {
      color: #999;
      font-size: 12px;
      text-align: center;
      line-height: 20px;
    }
  }
}
.paperInfo {
  position: absolute;
  top: 40%;
  left: 22px;
  right: 22px;
  border-radius: 18px;
  padding: 20px 21px 27px;
  background: #fff;
  .title {
    text-align: center;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .nut-input.nut-input-border {
    border: none;
  }
  .nut-input {
    background: rgba(196, 196, 196, 0.1);
    border-radius: 10px;
    padding-left: 10px;
  }
  .btn {
    margin-top: 20px;
  }
  .close {
    width: 16px;
    height: 16px;
    position: absolute;
    right: 21px;
    top: 22px;
    image {
      width: 16px;
      height: 16px;
    }
  }
  .errorMsg {
    color: #e76767;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    margin-top: 10px;
  }
}
</style>
