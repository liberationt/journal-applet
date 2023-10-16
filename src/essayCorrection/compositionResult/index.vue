<template>
  <view class="compositionResult">
    <view class="topInfo">
      <view class="fraction">
        <text class="course">{{ vdata.essayInfo.totalScore }}</text>
        <text class="dw">分</text>
      </view>
      <view class="title">
        <text v-if="vdata.essayInfo?.totalScore >= 80">作文写得很棒，继续加油哦</text>
        <text v-else-if="vdata.essayInfo?.totalScore > 60">作文写得真不错，但还需多加练习哦</text>
        <text v-else-if="vdata.essayInfo?.totalScore > 0">作文写作还需努力练习哦</text>
      </view>
      <view class="info"
        >作者年级:{{ getList[vdata.grade] }} 作文字数：{{ vdata.essayInfo.totalWordNum }}字</view
      >
    </view>
    <scroll-view
      class="scroll-content"
      scroll-y="true"
      scroll-with-animation="true"
      :style="{
        height: `calc(100vh - 200px)`,
      }"
    >
      <view class="swiper">
        <nut-tabs v-model="vdata.tabValue">
          <nut-tabpane title="评分详情">
            <template v-if="vdata.essayInfo.scoreDetailVo && vdata.essayInfo.scoreDetailVo.length">
              <view class="itemInfo" v-for="(item, i) in vdata.essayInfo.scoreDetailVo" :key="i">
                <view class="topTitle">
                  <view class="topTitleLeft">
                    <view><image :src="item.icon" mode="scaleToFill" /></view>
                    <view>{{ item.name }}</view>
                  </view>
                  <view
                    ><nut-rate
                      :active-color="item.starColor"
                      allow-half
                      readonly
                      v-model="item.score"
                  /></view>
                </view>
                <view class="bottomTitle">
                  <template v-if="item.list && item.list.length">
                    <view class="bottom-list-item" v-for="(vtem, key) in item.list" :key="key">
                      <view class="title">{{ vtem.id }}</view>
                      <view class="jdt"
                        ><nut-progress
                          :percentage="vtem.value"
                          :show-text="true"
                          :is-show-percentage="false"
                          stroke-width="6"
                          :text-color="item.color"
                          :stroke-color="item.color"
                      /></view>
                    </view>
                  </template>
                </view>
              </view>
            </template>
          </nut-tabpane>
          <nut-tabpane title="AI老师点评">
            <view class="teach">
              <view class="teach-item">
                <view class="ld">作文亮点</view>
                <view class="content">{{ vdata.essayInfo.aiEvaluationsVo?.advantage }}</view>
              </view>
            </view>
            <view class="teach">
              <view class="teach-item">
                <view class="ld">建议提升</view>
                <view class="content">{{ vdata.essayInfo.aiEvaluationsVo?.disadvantage }}</view>
              </view>
            </view>
          </nut-tabpane>
          <nut-tabpane title="原文点评">
            <template v-if="vdata.tabValue == 2">
              <view
                v-for="(item, i) in vdata.essayInfo.originalCommentVo"
                :key="i"
                class="evaluate-item"
              >
                <view class="content">
                  <!-- {{ item.paragraphContent }} -->
                  <rich-text :nodes="handleContent(item, i)"></rich-text>
                </view>
                <template v-if="item.commentVos && item.commentVos.length">
                  <view v-for="(vtem, k) in item.commentVos" :key="k" class="commentVos">
                    <view class="title">{{ vtem.title }}</view>
                    <view
                      v-if="vtem.commentContent && vtem.commentContent.length"
                      class="commenContent"
                    >
                      <view>{{ handleComment(vtem.commentContent) }}</view>
                      <view
                        v-if="vtem.endIndex === null || vtem.endIndex === null"
                        class="contentText"
                        >{{ vtem.content }}</view
                      >
                    </view>
                  </view>
                </template>
              </view>
            </template>
          </nut-tabpane>
        </nut-tabs>
      </view>
    </scroll-view>
  </view>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import Taro, { useRouter } from '@tarojs/taro'
import GradePopup from '@/components/GradePopup.vue'
import { getList } from '@/utils/index'
import { usePerson } from '@/stores'
import { getEssayDetail } from '@/api/essayCorrection'
const router = useRouter()
const personInfo = usePerson()
const gradeShowPopup = ref()
const vdata: any = reactive({
  tabValue: 0,
  value: 3,
  essayInfo: {},
  grade: 1,
  id: '',
  baseInfo: [
    {
      color: '#A7F1D3',
      starColor: '#3DDB9B',
      icon: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/1b99db2c49fe44d5b477c89949d5d7a3/gf.png',
    },
    {
      color: '#FFCC6D',
      starColor: '#FFB413',
      icon: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/51e1bfb6bf904d68a391dc0245a029a2/nr.png',
    },
    {
      color: '#C1BFFF',
      starColor: '#9591FF',
      icon: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/e5d3269188b74e30b3d7b5adedc1971b/jg.png',
    },
    {
      color: '#A8C6FF',
      starColor: '#679BFF',
      icon: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/93e4b5c3e57a40afa24370c6f403aadd/bd.png',
    },
  ],
})
const handleComment = (val) => {
  if (!val) return
  return val.join(';')
}
const handleContent = (item, i) => {
  let str = JSON.parse(JSON.stringify(item.paragraphContent))
  if (item.commentVos && item.commentVos.length) {
    item.commentVos.forEach((element) => {
      if (element.content) {
        element.content = element.content.replace('，', ',')
        if (element.endIndex || element.startIndex) {
          str = str.replace(
            element.content,
            `<span style='color:red'>(${element.serialNo})${element.content}</span>`
          )
        } else {
          str = str.replace(
            element.content,
            `<span style='color:#5094d5'>(${element.serialNo})${element.content}</span>`
          )
        }
      }
    })
  }
  return str
}
const getdetail = () => {
  getEssayDetail({
    id: vdata.id,
  }).then((res) => {
    let essayInfo = res
    vdata.grade = res.grade
    essayInfo.scoreDetailVo.forEach((item, i) => {
      item.score = item.score / 20
      item.color = vdata.baseInfo[i].color
      item.icon = vdata.baseInfo[i].icon
      item.starColor = vdata.baseInfo[i].starColor
    })
    vdata.essayInfo = essayInfo
  })
}
onMounted(() => {
  if (router.params.id) {
    vdata.id = router.params.id
    getdetail()
  } else {
    vdata.grade = personInfo.grade
    let essayInfo = JSON.parse(Taro.getStorageSync('essayCorrect'))
    essayInfo.scoreDetailVo.forEach((item, i) => {
      item.score = item.score / 20
      item.color = vdata.baseInfo[i].color
      item.icon = vdata.baseInfo[i].icon
      item.starColor = vdata.baseInfo[i].starColor
    })
    vdata.essayInfo = essayInfo
  }
})
</script>
<style lang="scss">
.compositionResult {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .topInfo {
    height: 200px;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/a4d349225cd54f48842ada59279e10c4/pgjg.png')
      no-repeat center;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 25px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .fraction {
      display: flex;
      font-size: 14px;
      font-family: PingFangSC-Medium;
      color: #fff;
      justify-content: center;
      .course {
        font-size: 30px;
      }
      .dw {
        display: block;
        line-height: 50px;
      }
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #ffffff;
    }
    .info {
      height: 30px;
      border-radius: 15px;
      line-height: 30px;
      text-align: center;
      background: rgba(255, 255, 255, 0.4);
      font-size: 14px;
      font-family: PingFangSC-Regular;
      color: #bf7305;
      width: 100%;
    }
  }
  .swiper {
    .nut-tabs__titles-item.active .nut-tabs__titles-item__line {
      background: #fea81c;
      width: 24px;
    }
    .nut-tabpane {
      padding: 15px;
    }
    .itemInfo {
      padding: 13px 16px;
      border-radius: 6px;
      box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
      margin-bottom: 12px;
      .topTitle {
        display: flex;
        align-items: center;
        font-family: PingFang SC;
        font-size: 15px;
        font-weight: 600;
        color: #333;
        image {
          width: 27px;
          height: 27px;
          margin-right: 3px;
        }
        .topTitleLeft {
          width: 65px;
          margin-right: 5px;
          display: flex;
          align-items: center;
        }
      }

      .bottomTitle .bottom-list-item {
        display: flex;
        margin-top: 18px;

        align-items: center;
        .title {
          width: 65px;
          margin-right: 5px;
          flex-shrink: 0;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          line-height: 20px;
          color: #666666;
        }
        .jdt {
          flex: 1;
        }
      }
    }
    .teach {
      box-sizing: border-box;
      background: #f8f8f7;
      border-radius: 10px;
      margin-bottom: 15px;
    }
    .teach-item {
      padding: 20px;
      border-radius: 10px;
      opacity: 1;
      box-sizing: border-box;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      line-height: 20px;
      color: #333333;
      .ld {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
      }
    }
    .evaluate-item {
      margin-bottom: 15px;
      .content {
        font-size: 14px;
        font-family: 苹方-简;
        margin-bottom: 10px;
        padding: 0 10px;
      }
      .commentVos {
        margin-bottom: 10px;
        font-family: 苹方-简;
        font-size: 14px;
        .title {
          background: rgba(74, 137, 255, 0.08);
          padding: 0 15px;
          height: 32px;
          font-size: 15px;
          font-weight: 600;
          color: #333;
          line-height: 32px;
          border-radius: 4px 4px 0 0;
        }
        .commenContent {
          background: #f9f9f9;
          padding: 10px;
          .contentText {
            padding: 20px 0;
          }
        }
      }
    }
  }
}
</style>
