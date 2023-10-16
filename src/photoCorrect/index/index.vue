<template>
  <scroll-view class="scroll-view_H" style="height: 100vh" :scroll-y="true" @scrolltolower="lower">
    <view class="mainContent">
      <view class="photoCorrectTop">
        <image
          class="vip"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/137a706e021e48c99319184a1cb705f1/vipzx.png"
        />
        <image
          @tap="getScreen"
          class="ps"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pz/c0017bc0b8b145c09dea185dccb2c0b8/ps.png"
        />
        <text>拍照批改</text>
      </view>

      <view class="pgRecord">
        <view> 批改记录 </view>
        <view v-show="vdata.recordList.length">
          <view class="del" @tap="showDelelte" v-if="!vdata.showDelelte">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pz/2e2de71bbd9a4186b0e194ab368d06b0/del.png"
            />
            <text>批量删除</text>
          </view>
          <text v-else @tap="closeDelelte" class="del">取消</text>
        </view>
      </view>
      <view class="listContent"> </view>
      <view class="noData" v-if="!vdata.recordList.length">
        <view class="topNoData">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
          />
          <text>暂无批改记录</text>
        </view>
        <view class="noDataBom">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pz/47c09c113cd44deaa30447852617d48e/xt.png"
          />
          <view class="noDataRight">
            <view class="no-list">
              <view class="title">拍照批改对错</view>
              <view>小学语文/英语，作业试卷，拍照批改</view>
            </view>
            <view class="no-list">
              <view class="title">题目讲解学习</view>
              <view>题目分析、解答思路、答案推导</view>
            </view>
          </view>
        </view>
      </view>
      <view class="recordList" v-else>
        <view v-for="(item, i) in vdata.recordList" :key="i">
          <view class="timer">{{ item.time }}</view>
          <view class="list-item">
            <view v-for="(items, k) in item.list" :key="k" class="item-info">
              <view class="imageInfo">
                <image @tap="toDetail(items.recordId, items.imgUrl)" :src="items.imgUrl" />
              </view>
              <view class="bottom-item">
                <image
                  v-if="vdata.showDelelte"
                  @tap="itemChange(i, k)"
                  :src="
                    items.checked
                      ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/ec5240eb81704251b0cce36b418df57e/check.png'
                      : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/33934d01a03d47df852944826735310e/nocheck.png'
                  "
                  mode="scaleToFill"
                />
                <view class="right"
                  >正确:<text>{{ items.rightCount }}</text
                  >题</view
                >
                <view class="error"
                  >错误:<text>{{ items.errorCount }}</text
                  >题</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="operatBtn" v-if="vdata.showDelelte">
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
        <view
          :class="['deleteBtn', getDeleteNumber > 0 && 'blueColor']"
          @tap="getDeleteNumber > 0 && showDialog()"
          >删除({{ getDeleteNumber }})</view
        >
      </view>
      <nut-dialog
        teleport="#app"
        title="确定删除批改记录吗？"
        content="删除后不可恢复"
        v-model:visible="vdata.showDialog"
        :lock-scroll="true"
        okText="确定删除"
        @Ok="config"
        @Cancel="cancel"
      >
      </nut-dialog>
    </view>
    <member-toast ref="memberToast" @handleFree="handleJeep"></member-toast>
  </scroll-view>
</template>
<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { reactive, computed, ref } from 'vue'
import { getPhotoCorrentList, deleteCorrect } from '@/api/photoCorrect'
import { debounce } from '@/utils/index'
import { getTryCount } from '@/api/index'
import { useUser } from '@/stores'
const user = useUser()
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const vdata = reactive({
  checkAll: false,
  showDelelte: false,
  showDialog: false,
  recordList: [],
  reqInfo: {
    condition: {
      id: '',
    },
    current: 1,
    orders: [
      {
        asc: true,
        column: '',
      },
    ],
    size: 30,
  },
  total: 0,
})
const getScreen = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '拍照批改', funCourseName: null })
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
      handleJeep()
    }
  } else {
    handleJeep()
  }
})
const handleJeep = () => {
  Taro.navigateTo({ url: '/photoCorrect/photographPage/index' })
}
//显示
const showDelelte = () => {
  vdata.showDelelte = true
}
const closeDelelte = () => {
  vdata.showDelelte = false
}
const toDetail = (correctRecordId, imgUrl) => {
  Taro.navigateTo({
    url: `../photographResult/index?correctRecordId=${correctRecordId}&tempFilePath=${imgUrl}`,
  })
}
//获取delete number
const getDeleteNumber = computed(() => {
  let list = []
  vdata.recordList.forEach((item: any) => {
    if (item.list && item.list.length) {
      item.list.forEach((v) => {
        if (v.checked) {
          list.push(v)
        }
      })
    }
  })
  return list.length
})
// 全选 反选
const allChange = () => {
  vdata.checkAll = !vdata.checkAll
  if (vdata.checkAll) {
    vdata.recordList.forEach((item: any) => {
      if (item.list && item.list.length) {
        item.list.map((v) => (v.checked = true))
      }
    })
  } else {
    vdata.recordList.forEach((item: any) => {
      if (item.list && item.list.length) {
        item.list.map((v) => (v.checked = false))
      }
    })
  }
}
//确认删除
const config = () => {
  let correctRecordIdList = []
  vdata.recordList.forEach((item: any) => {
    if (item.list && item.list.length) {
      item.list.forEach((v) => {
        if (v.checked) {
          correctRecordIdList.push(v.recordId)
        }
      })
    }
  })
  let params = {
    correctRecordIdList,
  }
  deleteCorrect(params).then((res) => {
    if (res) {
      setTimeout(() => {
        Taro.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000,
        })
      }, 100)
      vdata.showDialog = false
      vdata.reqInfo.current = 1
      vdata.checkAll = false
      vdata.showDelelte = false
      vdata.recordList = []
      getList()
    }
  })
  // vdata.showDialog = false
}
const cancel = () => {
  vdata.showDialog = false
}
const showDialog = () => {
  vdata.showDialog = true
}
//每一项改变
const itemChange = (i, k) => {
  vdata.recordList[i].list[k].checked = !vdata.recordList[i].list[k].checked

  let list = []
  vdata.recordList.forEach((item: any) => {
    if (item.list && item.list.length) {
      item.list.forEach((v) => {
        if (v.checked) {
          list.push(v)
        }
      })
    }
  })

  if (list && list.length) {
    if (list.length == vdata.total) {
      vdata.checkAll = true
    } else {
      vdata.checkAll = false
    }
  }
}
//获取列表
const getList = () => {
  let params: any = vdata.reqInfo
  getPhotoCorrentList(params).then((res: any) => {
    if (res.records && res.records.length) {
      let timerList = []
      let newList = []
      res.records[0].list.forEach((element) => {
        timerList = [...new Set(timerList.concat(element.time))]
      })
      timerList.forEach((item, i) => {
        newList.push({
          list: [],
          time: item,
        })
        res.records[0].list.forEach((items) => {
          if (item == items.time) {
            newList[i].list.push(items)
          }
        })
      })
      vdata.recordList = newList
      // vdata.recordList = vdata.recordList.concat(res.records)
      // vdata.recordList = res.records
      // vdata.total = res.total
      // if (vdata.checkAll) {
      //   vdata.recordList.forEach((item: any) => {
      //     if (item.list && item.list.length) {
      //       item.list.map((v) => (v.checked = true))
      //     }
      //   })
      // }
    }
  })
}
//分页
const lower = () => {
  // if (hasNext()) {
  //   getList()
  // }
}
const hasNext = () => {
  if (vdata.reqInfo.current * vdata.reqInfo.size < vdata.total) {
    vdata.reqInfo.current = vdata.reqInfo.current + 1
    return true
  } else {
    return false
  }
}
useDidShow(() => {
  getList()
})
</script>
<style lang="scss">
.mainContent {
  padding: 22px 15px 90px;
  box-sizing: border-box;
  .photoCorrectTop {
    flex-shrink: 0;
    margin-bottom: 20px;
    height: 165px;
    background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pz/97c2227347c34c9c9869e750e8159e2f/psBg.png')
      no-repeat center;
    background-size: 100% 100%;
    position: relative;
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    text-shadow: 0px 0px 12px 0px #0386e5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .vip {
      position: absolute;
      left: 0px;
      top: 0;
      width: 96px;
      height: 41px;
    }
    .ps {
      width: 93px;
      height: 80px;
    }
  }
  .pgRecord {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 20px;
    .del {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: normal;
      color: #999999;
      image {
        width: 13.5px;
        height: 13.5px;
        margin-right: 3px;
      }
    }
  }
  .noData {
    margin-top: 3px;
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
    .noDataBom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 33px;
      image {
        width: 6px;
        height: 84px;
        margin: 0 5px;
      }
      .noDataRight {
        flex: 1;
        .no-list {
          height: 68px;
          background: #fafafa;
          border-radius: 10px;
          margin-bottom: 10px;
          box-sizing: border-box;
          padding-left: 15px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          line-height: 14px;
          color: #666666;
          .title {
            font-family: PingFangSC-Semibold;
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 6px;
          }
        }
      }
    }
  }
  .listContent {
    flex: 1;
    background: red;
  }
  .recordList {
    font-family: PingFang SC;
    font-size: 13px;
    .timer {
      font-size: 15px;
      margin-bottom: 13px;
    }
    .imageInfo {
      width: 166px;
      height: 166px;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 10px;
      image {
        width: 166px;
        height: 166px;
      }
    }
    .list-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item-info {
        margin-bottom: 16px;
      }
    }
    .bottom-item {
      display: flex;
      align-items: center;
      image {
        width: 16px;
        height: 16px;
        margin-right: 6px;
      }
      .right {
        margin-right: 8px;
        display: flex;
        align-items: center;
        text {
          color: #36b92a;
          margin: 0 3px;
        }
      }
      .error {
        display: flex;
        align-items: center;
        text {
          color: red;
          margin: 0 3px;
        }
      }
    }
  }
  .operatBtn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 90px;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    image {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
    .checkBtn {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
    .deleteBtn {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      width: 206px;
      height: 44px;
      border-radius: 22px;
      background: #eeeeee;
      text-align: center;
      line-height: 44px;
    }
    .blueColor {
      background: #2f5de7;
      color: #fff;
    }
  }
}
</style>
