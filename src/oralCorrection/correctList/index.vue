<template>
  <scroll-view
    class="scroll-view_H"
    :style="{ height: '100vh', paddingTop: '36px' }"
    :scroll-y="true"
    @scrolltolower="lower"
  >
    <view :class="['correctionResult', vdata.showDelelte && 'correctionResults']">
      <view class="pgRecord" v-if="vdata.recordList.length">
        <view> 可查看最近90天的拍照批改记录 </view>
        <view>
          <view class="del" @tap="showDelelte" v-if="!vdata.showDelelte">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9726f5abdd644438be7161f4216ff353/delete.png"
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
          <text>你还没有拍照批改过 </text>
          <text>快去拍一张吧</text>
          <view class="photoInfo" @tap="toPhoto">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kspg/6548f7edc15948d19a4dba9f98070858/pzicon.png"
              mode="scaleToFill"
            />
            <text>拍照批改</text>
          </view>
        </view>
        <view class="noDataBom"> </view>
      </view>
      <view class="recordList" v-else>
        <view v-for="(item, i) in vdata.recordList" :key="i">
          <view class="timer">{{ item.time }}</view>
          <view class="list-item">
            <view v-for="(items, k) in item.list" :key="k" class="item-info">
              <view class="imageInfo">
                <image @tap="toDetail(items.id, items.imageUrl)" :src="items.imageUrl">
                  <template v-if="items.result.questionVos">
                    <view class="" v-for="(bg, v) in items.result.questionVos" :key="v">
                      <view
                        class="xt"
                        v-if="!bg.isRight"
                        :style="
                          handlePosition(
                            items.result.imgWidth,
                            items.result.imgHeight,
                            bg.point2dXYDtoList
                          )
                        "
                      ></view>
                      <view
                        v-else
                        class="right-item"
                        :style="
                          handleRight(
                            items.result.imgWidth,
                            items.result.imgHeight,
                            bg.point2dXYDtoList
                          )
                        "
                      >
                        <image
                          class="rightImg"
                          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kspg/c8b3625b9ff9414bb946eb09850aa7a1/dg.png"
                          mode="scaleToFill"
                        />
                      </view>
                    </view>
                  </template>
                </image>
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
                <view class="right">正确:<text>items.rightCount</text>题</view>
                <view class="error">错误:<text>items.errorCount</text>题</view>
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
      <view
        class="photoInfo photoInfos"
        @tap="toPhoto"
        v-if="!vdata.showDelelte && vdata.recordList.length"
      >
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kspg/6548f7edc15948d19a4dba9f98070858/pzicon.png"
          mode="scaleToFill"
        />
        <text>拍照批改</text>
      </view>
      <nut-dialog
        teleport="#app"
        title="确定删除？"
        content="删除后不可恢复"
        v-model:visible="vdata.showDialog"
        :lock-scroll="true"
        okText="确定"
        @Ok="config"
        @Cancel="cancel"
      >
      </nut-dialog>
    </view>
  </scroll-view>
</template>
<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { reactive, computed, onMounted } from 'vue'
import { getOralCorrentList, deleteCorrect } from '@/api/oralCorrection'
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

//显示
const showDelelte = () => {
  vdata.showDelelte = true
}
const closeDelelte = () => {
  vdata.showDelelte = false
  vdata.checkAll = false
  vdata.recordList.map((item) => {
    item.isRight = false
  })
}
const toDetail = (correctRecordId, imgUrl) => {
  if (vdata.showDelelte) {
    return
  }
  Taro.navigateTo({
    url: `../correctionResults/index?correctRecordId=${correctRecordId}&tempFilePath=${imgUrl}`,
  })
}
const handlePosition = (orgWidth, orgHeight, list) => {
  // Width原始图片宽度
  // Height原始图片高度
  let left = ((list[0].x / orgWidth) * 100).toFixed(2)
  let top = ((list[0].y / orgHeight) * 100).toFixed(2)
  let width = (((list[2].x - list[0].x) / orgWidth) * 100).toFixed(2)
  let height = (((list[2].y - list[0].y) / orgHeight) * 100).toFixed(2)
  console.log(orgWidth, orgHeight, list)
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
  }
}
const handleRight = (orgWidth, orgHeight, list) => {
  let left = ((list[0].x / orgWidth) * 100).toFixed(2)
  let top = ((list[0].y / orgHeight) * 100).toFixed(2)
  let width = (((list[2].x - list[0].x) / orgWidth) * 100).toFixed(2)
  let height = (((list[2].y - list[0].y) / orgHeight) * 100).toFixed(2)

  console.log(width, height, left, top, 777)
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
  }
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
const toPhoto = () => {
  Taro.navigateTo({
    url: '../photographPage/index',
  })
}
//确认删除
const config = () => {
  let deleteIdList = []
  vdata.recordList.forEach((item: any) => {
    if (item.list && item.list.length) {
      item.list.forEach((v) => {
        if (v.checked) {
          deleteIdList.push(v.id)
        }
      })
    }
  })
  let params = {
    deleteIdList,
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
  // let params: any = vdata.reqInfo
  getOralCorrentList().then((res: any) => {
    if (res && res.length) {
      let timerList = []
      let newList = []
      res.forEach((element) => {
        timerList = [...new Set(timerList.concat(element.timeName))]
      })
      timerList.forEach((item, i) => {
        newList.push({
          list: [],
          time: item,
        })
        res.forEach((items) => {
          if (item == items.timeName) {
            newList[i].list.push(items)
          }
        })
      })
      console.log(newList, 999)
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
.correctionResult {
  padding: 16px 15px 0px;
  box-sizing: border-box;
  .pgRecord {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFang SC;
    font-size: 13px;
    color: #999999;
    margin-bottom: 20px;
    background: #fff;
    // box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
    height: 36px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 0 15px;
    .del {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: normal;
      color: #333333;
      image {
        width: 12px;
        height: 12px;
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
      .photoInfo {
        margin-top: 36px;
        image {
          width: 22px;
          height: 22px;
          margin-right: 3px;
          margin-bottom: 0;
        }
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
      width: 150px;
      height: 150px;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 10px;
      position: relative;
      image {
        width: 150px;
        height: 150px;
      }
      .xt {
        position: absolute;
        z-index: 100;
        background: rgba(254, 125, 125, 0.2);
        border: 1px solid #fe7d7d;
      }
      .right-item {
        position: absolute;
        left: 0;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.16);
        box-sizing: border-box;
      }
      .rightImg {
        width: 14px;
        height: 14px;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
    .list-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item-info {
        margin-bottom: 16px;
        padding: 8px;
        border-radius: 16px;
        box-shadow: 0px 1px 6px 0px rgba(209, 209, 209, 0.5);
        box-sizing: border-box;
        width: 166px;
      }
    }
    .bottom-item {
      display: flex;
      align-items: center;
      image {
        width: 16px;
        height: 16px;
        margin-right: 6px;
        flex-shrink: 0;
      }
      .right {
        margin-right: 8px;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        text {
          color: #36b92a;
          margin: 0 3px;
        }
      }
      .error {
        display: flex;
        align-items: center;
        flex-shrink: 0;
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
    z-index: 100;
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
      width: 271px;
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
  .photoInfo {
    width: 195px;
    height: 45px;
    border-radius: 23px;
    background: #4f94ff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    image {
      width: 22px;
      height: 22px;
      margin-right: 3px;
    }
  }
  .photoInfos {
    position: fixed;
    bottom: 40px;
    z-index: 100;
    left: 50%;
    transform: translateX(-50%);
  }
}
.correctionResults {
  padding-bottom: 90px;
}
</style>
