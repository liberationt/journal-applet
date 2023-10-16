<template>
  <view class="essayCorrectionMain">
    <!-- <view class="balance">
      <view class="order"
        >本月还有剩余 <text>5</text> 次 免费批改
        <image
          @tap="vdata.showTitle = true"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/3c5d2c2ad23148c1b1a1f5929c8514ca/prompt.png"
          mode="scaleToFill"
      /></view>
      <view class="busy">
        <view @tap="vdata.showBusy = true">购买次数</view>
      </view>
    </view> -->
    <view class="contentInfo">
      <view class="photo">
        <image
          @tap="toPhoto"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/8d05e67f6e374a9ca57607e4361e60a2/photo.png"
          mode="scaleToFill"
        />
        <view>上传作文</view>
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
      <view class="noData" v-if="!vdata.recordList.length">
        <view class="topNoData">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
          />
          <text>暂无批改记录</text>
        </view>
        <view class="noDataBom">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/d4bd6d6b81c948e28ce3846f3d4f8ba2/nodatebg.png"
          />
        </view>
      </view>
      <view :class="['recordList', vdata.showDelelte && 'recordLists']" v-else>
        <view v-for="(item, i) in vdata.recordList" :key="i">
          <view class="timer">{{ item.time }}</view>
          <view class="list-item">
            <view v-for="(items, k) in item.list" :key="k" class="item-info">
              <view class="imageInfo" @tap="!vdata.showDelelte && toDetail(items.essayId)">
                <image :src="items.essayImageUrls" />
                <view class="grand">{{ items.essayTotalScore }}分</view>
              </view>
              <view class="bottom-item">
                <image
                  v-if="vdata.showDelelte"
                  @tap="itemChange(i, k)"
                  :src="
                    items.checked
                      ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/e3bdf60b4da94180b5e67e918be7994c/checked.png'
                      : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/33934d01a03d47df852944826735310e/nocheck.png'
                  "
                  mode="scaleToFill"
                />
                <view class="right"> {{ items.essayTitle }} </view>
              </view>
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
              ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/e3bdf60b4da94180b5e67e918be7994c/checked.png'
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
    <!-- 提示框 -->
    <nut-overlay v-model:visible="vdata.showTitle" :close-on-click-overlay="false">
      <view class="wrapper">
        <view class="title">批改次数使用说明</view>
        <view>1、伴学VIP用户享受限时福利——每月5次作文批改（若未使用，下月将会重置清零）</view>
        <view>2、作文批改次数用完后可单独购买，购买一次1.9元且无失效时间</view>
        <image
          @tap="vdata.showTitle = false"
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/721ebdcae00a48d7892f6b353cc3f762/closeBlack.png"
          mode="scaleToFill"
        />
      </view>
    </nut-overlay>
    <!-- 购买次数 -->
    <nut-overlay v-model:visible="vdata.showBusy" :close-on-click-overlay="false">
      <view class="busyInfo">
        <view class="title">批改次数已用完</view>
        <view>本月免费批改次数已用完，如需使用批改功能需购买批改次数</view>
        <view class="operation">
          <view class="calc" @tap="vdata.showBusy = false">取消</view>
          <view class="config" @tap="payOrder">购买次数</view>
        </view>
      </view>
    </nut-overlay>
    <!-- 支付购买 -->
    <nut-popup
      position="bottom"
      :close-on-click-overlay="false"
      closeable
      round
      v-model:visible="vdata.showPay"
      @close="closePay"
    >
      <view class="payInfo">
        <view class="title">作文批改次数购买</view>
        <view class="flexItem">
          <view class="itemLeft">
            <image
              @tap="changeTc(1)"
              :src="
                vdata.payType == 1
                  ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/e3bdf60b4da94180b5e67e918be7994c/checked.png'
                  : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/33934d01a03d47df852944826735310e/nocheck.png'
              "
              mode="scaleToFill"
            />
            <view>单次购买</view>
            <text>¥1.9元/1次</text>
          </view>
          <view class="itemRight">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/ef95a47671ca4252a44d460b1071a9da/jj.png"
              mode="scaleToFill"
              @tap="buyNumber(-1)"
            />
            <text>{{ vdata.busyNumber }} 次</text>
            <image
              @tap="buyNumber(1)"
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/1aba22a4b59b4f8f8c1ee87e726beefb/j.png"
              mode="scaleToFill"
            />
          </view>
        </view>
        <view class="flexItem">
          <view class="itemLeft">
            <image
              @tap="changeTc(2)"
              :src="
                vdata.payType == 2
                  ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/e3bdf60b4da94180b5e67e918be7994c/checked.png'
                  : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pzpg/33934d01a03d47df852944826735310e/nocheck.png'
              "
              mode="scaleToFill"
            />
            特惠套餐
          </view>
          <view class="itemRight"> 5次 ¥6.8元 </view>
        </view>
        <view @tap="toPay" class="pay">立即支付元</view>
      </view>
    </nut-popup>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro'
import { reactive, computed, ref } from 'vue'
import { getCorrectRecords, deleteCorrect } from '@/api/essayCorrection'
import { useUser } from '@/stores'
import { getTryCount } from '@/api/index'
import { debounce } from '@/utils/index'
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const user = useUser()
const vdata = reactive({
  checkAll: false,
  showDelelte: false,
  showDialog: false,
  showTitle: false,
  showBusy: false,
  showPay: false,
  payType: 1,
  busyNumber: 1,
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
const getScreen = () => {
  Taro.navigateTo({ url: '/photoCorrect/photographPage/index' })
}
// 提示
const infoText = () => {}
//显示
const showDelelte = () => {
  vdata.showDelelte = true
}
const closeDelelte = () => {
  vdata.showDelelte = false
}
const toDetail = (id) => {
  Taro.navigateTo({
    url: `../compositionResult/index?id=${id}`,
  })
}
//去拍照
const toPhoto = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '作文批改', funCourseName: null })
    // vdata.termItemInfo = item
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
      handleNavigate()
    }
  } else {
    handleNavigate()
  }
})
const handleNavigate = () => {
  if (Taro.getStorageSync('essayImgList')) {
    Taro.removeStorageSync('essayImgList')
    Taro.removeStorageSync('contentList')
  }
  Taro.navigateTo({
    url: '../photographPage/index',
  })
}
//套餐切换
const changeTc = (number) => {
  vdata.payType = number
}
//购买次数
const payOrder = () => {
  vdata.showPay = true
  vdata.showBusy = false
}
//购买数量
const buyNumber = (number) => {
  if (number < 0 && vdata.busyNumber < 2) {
    return
  }
  vdata.busyNumber += number
}
//关闭购买
const closePay = () => {
  vdata.busyNumber = 1
  vdata.payType = 1
}
// const toDetail = (correctRecordId, imgUrl) => {
//   Taro.navigateTo({
//     url: `../photographResult/index?correctRecordId=${correctRecordId}&tempFilePath=${imgUrl}`,
//   })
// }
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
          correctRecordIdList.push(v.essayId)
        }
      })
    }
  })
  let params = {
    ids: correctRecordIdList,
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
  getCorrectRecords(params).then((res: any) => {
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
          items.checked = false
          if (item == items.time) {
            newList[i].list.push(items)
          }
        })
      })
      vdata.recordList = newList
      console.log(vdata.recordList, 9999)
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
.essayCorrectionMain {
  height: 100vh;
  .balance {
    background: #fff3e6;
    height: 40px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    color: #3d3d3d;
    display: flex;
    padding: 0 15px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    .order {
      display: flex;
      align-items: center;
      image {
        width: 14px;
        height: 14px;
        margin-left: 3px;
      }
    }
    text {
      font-size: 18px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0.34px;
      color: #e55220;
    }
    .busy {
      width: 66px;
      height: 24px;
      border-radius: 30px;
      opacity: 1;
      font-family: PingFang SC;
      font-size: 12px;
      line-height: 24px;
      text-align: center;
      color: #ffffff;
      background: linear-gradient(267deg, #c3775b 0%, #e8caa1 160%);
    }
  }
  .contentInfo {
    padding: 16px;
    box-sizing: border-box;
    .photo {
      height: 165px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/3a47b93f61ae4757ab0a143f3c9e7789/bj.png')
        no-repeat center;
      background-size: 100% 100%;
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 20px;
      image {
        width: 100px;
        height: 87px;
        margin-bottom: 5px;
      }
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
        width: 100%;
        height: 224px;
      }
    }
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
      position: relative;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      image {
        width: 166px;
        height: 166px;
      }
      .grand {
        width: 55px;
        height: 22px;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwpg/d0aaf7a3ea4546348a4af1e6d9f2b082/grand.png')
          no-repeat center;
        background-size: 100% 100%;
        position: absolute;
        top: 0;
        left: 0;
        line-height: 22px;
        padding-left: 6px;
        box-sizing: border-box;
      }
    }
    .list-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      .item-info {
        margin-bottom: 16px;
        width: 166px;
      }
    }
    .bottom-item {
      display: flex;
      image {
        width: 16px;
        height: 16px;
        margin-right: 6px;
        flex-shrink: 0;
      }
    }
  }
  .recordLists {
    padding-bottom: 70px;
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
      background: #fea81c;
      color: #fff;
    }
  }
  .wrapper {
    width: 313px;
    height: 203px;
    border-radius: 14px;
    opacity: 1;
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 39px 20px 30px;
    transform: translate(-50%, -50%);
    background: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    letter-spacing: 0px;
    color: #666666;
    view {
      margin-bottom: 10px;
    }
    .title {
      font-family: PingFangSC-Medium;
      font-size: 17px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 14px;
    }
    image {
      width: 24px;
      height: 24px;
      position: absolute;
      right: 5px;
      top: 10px;
    }
  }
  .busyInfo {
    width: 280px;
    height: 203px;
    border-radius: 14px;
    opacity: 1;
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 20px;
    transform: translate(-50%, -50%);
    background: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0px;
    color: #666666;
    text-align: center;

    .title {
      font-family: PingFangSC-Medium;
      font-size: 17px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 14px;
    }
    .operation {
      display: flex;
      margin-top: 28px;
      justify-content: space-between;
      align-items: center;
      view {
        width: 107px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        box-sizing: border-box;
        border-radius: 20px;
        font-size: 16px;
      }
      .calc {
        border: 1px solid #fea81c;
        font-family: PingFangSC-Regular;
        color: #fea81c;
      }
      .config {
        background: #fea81c;
        color: #fff;
      }
    }
  }
  .payInfo {
    padding: 20px 20px 30px;
    .title {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      font-weight: 500;
      text-align: center;
      color: #000000;
      margin-bottom: 20px;
    }
    .flexItem {
      height: 60px;
      background: #f9f9f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding: 0 10px;
      border-radius: 10px;
      .itemLeft {
        display: flex;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        align-items: flex-end;
        image {
          width: 18px;
          height: 18px;
          margin-right: 3px;
        }
        text {
          font-size: 14px;
          color: #999999;
          margin-left: 5px;
        }
      }
      .itemRight {
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #333333;
        display: flex;
        align-items: center;
        image {
          width: 27px;
          height: 27px;
        }
        text {
          margin: 0 15px;
        }
      }
    }
    .pay {
      height: 50px;
      border-radius: 10px;
      margin-top: 30px;
      background: linear-gradient(84deg, #ff8b65 -7%, #ff432a 102%);
      font-family: PingFangSC-Regular;
      font-size: 17px;
      font-weight: normal;
      line-height: 50px;
      text-align: center;
      color: #ffffff;
    }
  }
}
</style>
