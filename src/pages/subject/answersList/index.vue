<template>
  <view>
    <view v-if="vdata.dataList.length">
      <view class="answersList" v-for="(item, index) in vdata.dataList" :key="index">
        <view :class="{ disabled: !item.resourceUrl || item.deleteFlag == '1' }">{{
          getPeriodsNum(item.resourceIssue)
        }}</view>
        <view class="rightBtn" @tap="toDetail(item)">
          <nut-icon
            v-if="!item.resourceUrl || item.deleteFlag == '1'"
            name="rect-right"
            color="#999999"
          ></nut-icon>
          <nut-icon v-else name="rect-right"></nut-icon>
        </view>
      </view>
    </view>
    <view v-else class="noData">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/263553eae12b4f9ea0b70ee43d48c28d/resourceUpload.png"
      ></image>
      <view class="detail">正在加紧上传中...</view>
    </view>
    <member-toast ref="memberToast" @handleFree="handleFree"></member-toast>
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import { onMounted, reactive, ref } from 'vue'
import { getNorthJournalResourceCheckList } from '@/api/index'
import { getPeriodsNum, debounce } from '@/utils/index'
import { useUser } from '@/stores'
import { getTryCount } from '@/api/index'
import MemberToast from '@/components/memberToast.vue'

const memberToast = ref()
const user = useUser()
const props = defineProps({
  propsDataObj: {},
  selectId: '',
})
const vdata = reactive({
  journalResourceId: '',
  resourceType: '1',
  dataList: [],
  termItemInfo: null,
})
const toDetail = debounce(async (item) => {
  if (!item.imgUrls?.length || item.deleteFlag == '1') {
    return Taro.showToast({
      title: '资源紧急上传中...',
      icon: 'none',
      duration: 2000,
    })
  }
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '答案解析', funCourseName: null })
    vdata.termItemInfo = item
    if (memberInfo.vipState == 1) {
      if (memberInfo.tryFlag == 1) {
        if (memberInfo.configCount <= memberInfo.hasTryCount) {
          memberToast.value.showToast(false)
        } else {
          memberToast.value.showToast(true, memberInfo.configCount, memberInfo.hasTryCount)
        }
      } else {
        memberToast.value.showToast(false)
      }
    } else {
      handleJeep(item)
    }
  } else {
    handleJeep(item)
  }
})
const handleFree = () => {
  handleJeep(vdata.termItemInfo)
}
const handleJeep = (item) => {
  let params = {
    resourceIssue: item.resourceIssue,
    imgUrls: item.imgUrls,
    resourceSupportId: vdata.journalResourceId || '',
  }
  let obj = JSON.stringify(params)
  Taro.navigateTo({
    url: `/pages/subject/previewPdf/index?obj=${obj}`,
  })
}
const getList = async () => {
  let req = {
    journalResourceId: vdata.journalResourceId,
    resourceType: vdata.resourceType,
  }
  const res = await getNorthJournalResourceCheckList(req)
  vdata.dataList = res || []
}
onMounted(() => {
  setTimeout(() => {
    vdata.journalResourceId = props.propsDataObj.id || ''
    if (props.selectId === '0') {
      vdata.resourceType = '1'
    } else {
      vdata.resourceType = '2'
    }
    if (!vdata.journalResourceId) return
    getList()
  }, 200)
})
</script>
<style lang="scss">
.answersList {
  width: 100%;
  height: 56px;
  border-radius: 8px;
  background: #fff;
  padding: 0 16px;
  line-height: 56px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  view {
    display: inline-block;
    vertical-align: middle;
    align-items: center;
    font-size: 16px;
    color: #333333;
  }
  .rightBtn {
    flex: 1;
    text-align: right;
  }
  .nut-icon {
    vertical-align: middle;
  }
  .disabled {
    font-size: 16px;
    color: #999999;
  }
}
.noData {
  text-align: center;
  padding-top: 70px;
  image {
    margin-bottom: 24px;
    width: 160px;
    height: 130px;
  }
  .detail {
    font-size: 14px;
    text-align: center;
    color: #999999;
  }
}
</style>
