<template>
  <view class="schoolMain" :style="{ paddingTop: `${navBarHeight}px` }">
    <NavBar :title="'学校'" background="#fff" />
    <view class="searchTop" :style="{ top: `${navBarHeight}px` }">
      <view class="searchInfo">
        <view class="leftSear">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/9fb99b302f124a168e6c41b1c9ad01ed/fdj.png"
            mode="scaleToFill"
          />
          <view class="inputInfo">
            <input
              placeholder="请输入学校名称"
              type="text"
              :value="queryInfo.schoolName"
              @input="getName"
              @focus="vdata.focus = true"
              @blur="focusBlur"
              :selectionStart="100"
              :selectionEnd="100"
            />
            <view class="rightBtn" @tap="clearInput" v-if="queryInfo.schoolName && vdata.focus">
              <image
                class="close-img"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/41cde43ac6eb4dae99fe55bf5f889baf/close.png"
                mode="scaleToFill"
              />
            </view>
          </view>
        </view>
        <text class="searText" @tap="resetSchool">取消</text>
      </view>
      <view class="city">
        <text class="city-address">{{ vdata.userAddress }}</text>
        <view class="edit" @tap="showAddress">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/41bdb4399786411e88f329de0be5d2cf/edit.png"
            mode="scaleToFill"
          />
          <text>手动修改</text>
        </view>
      </view>
    </view>
    <view
      class="schoolList"
      :style="{ height: `calc(100vh - ${navBarHeight + 128}px)`, top: ` ${navBarHeight + 128}px` }"
    >
      <view class="noData" v-if="!vdata.schoolList.length">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
        />
        <text class="noText">没有搜索到相关学校</text>
        <view class="noSchool">
          <text>没有找到你的学校？</text>
          <text class="readSchool" @tap="enterShcool">录入学校></text>
        </view>
      </view>
      <template v-else>
        <scroll-view
          class="scroll-view_H"
          :scroll-y="true"
          @scrolltolower="lower"
          v-if="vdata.search"
        >
          <view class="title">{{ vdata.search ? '全部学校' : '搜索结果' }}</view>
          <view class="school-info">
            <view
              v-for="(item, i) in vdata.schoolList"
              :key="i"
              class="school-item"
              @tap="chooseSchool(item.schoolNameOrigan, item.id)"
            >
              <view class="topInfo">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/415a206444cd486dae3b533ab6894ab8/position.png"
                  mode="scaleToFill"
                />
                <text class="topInfo-text">{{ item.schoolName }}</text>
              </view>
              <!-- <view class="bottomInfo" v-if="item.addressDetail">
                ( {{ item.addressDetail }})
              </view> -->
            </view>
          </view>
          <view class="noSchool">
            <text>没有找到你的学校？</text>
            <text class="readSchool" @tap="enterShcool">录入学校></text>
          </view>
        </scroll-view>
        <scroll-view class="scroll-view_H" v-else :scroll-y="true">
          <view class="title">搜索结果</view>
          <view class="school-info">
            <view
              v-for="(item, i) in vdata.schoolList"
              :key="i"
              class="school-item"
              @tap="chooseSchool(item.schoolNameOrigan, item.id)"
            >
              <view class="topInfo">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/415a206444cd486dae3b533ab6894ab8/position.png"
                  mode="scaleToFill"
                />
                <!-- <text>{{ item.schoolName }}</text> -->
                <rich-text :nodes="item.schoolName" class="topInfo-text"></rich-text>
              </view>
              <!-- <view class="bottomInfo" v-if="item.addressDetail">
                ( {{ item.addressDetail }})
              </view> -->
            </view>
          </view>
          <view class="noSchool">
            <text>没有找到你的学校？</text>
            <text class="readSchool" @tap="enterShcool">录入学校></text>
          </view>
        </scroll-view>
      </template>
    </view>
    <Address
      ref="address"
      @handleChange="addressChange"
      :areas="vdata.areas"
      v-if="vdata.addressShow"
    />
  </view>
</template>
<script setup lang="ts">
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { reactive, onMounted, ref } from 'vue'
import { useSystem, usePerson } from '@/stores'
import Address from '@/components/address.vue'
import { getSchool, getSchoolList } from '@/api/index'
const system = useSystem()
const router = useRouter()
const personInfo = usePerson()
const address = ref()
const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  addressShow: false, // 控制组件渲染
  userAddress: '',
  userSchoolName: '',
  schoolList: [],
  type: '',
  search: true,
  total: 0,
  timer: '',
  areas: [],
  focus: true,
})
const queryInfo = reactive({
  city: '',
  district: '',
  province: '',
  schoolName: '',
})
const reqInfo = reactive({
  condition: {
    province: '',
    city: '',
    district: '',
  },
  current: 1,
  orders: [
    {
      asc: true,
      column: '',
    },
  ],
  size: 10,
})
const getName = (e) => {
  queryInfo.schoolName = e.detail.value
  vdata.search = false
  clearTimeout(vdata.timer) //清除定时器
  vdata.timer = setTimeout(() => {
    querySchool()
  }, 1000)
}
const focusBlur = () => {
  setTimeout(() => {
    vdata.focus = false
  }, 200)
}
const resetSchool = () => {
  vdata.search = true
  queryInfo.schoolName = ''
  vdata.schoolList = []
  reqInfo.current = 1
  querySchoolList()
}
const clearInput = () => {
  queryInfo.schoolName = ''
  querySchool()
}
const showAddress = () => {
  address.value.addressShow()
}
const addressChange = (val) => {
  vdata.userAddress = val.join('/')
  if (vdata.search) {
    resetSchool()
  } else {
    querySchool()
  }
}
const chooseSchool = (schoolName, id) => {
  if (vdata.type) {
    personInfo.setUserKey('userSchoolName', schoolName)
    personInfo.setUserKey('userSchoolId', id)
  } else {
    personInfo.setSchoolName(schoolName)
    personInfo.setSchoolId(id)
  }
  Taro.navigateBack({ delta: 1 })
}
const enterShcool = () => {
  Taro.navigateTo({
    url: `../enterSchool/index?user=${vdata.type}`,
  })
}
//分页
const lower = () => {
  if (hasNext()) {
    querySchoolList()
  }
}
const hasNext = () => {
  // if (reqInfo.current * reqInfo.size < vdata.total) {
  //   reqInfo.current = reqInfo.current + 1
  //   return true
  // } else {
  //   return false
  // }
  reqInfo.current = reqInfo.current + 1
  return true
}

// const next = () => {
// personInfo.setAddress(vdata.address)
// personInfo.setClassGrade(vdata.grade)
// Taro.navigateTo({
//   url: '/pages/index/index',
// })
// const params = {
//   userType: vdata.type,
//   classGrade: vdata.grade,
// }
// saveFirstUserInfo(params).then((res: any) => {
//   if (res == '更新成功') {
//     user.setUserInfo()
//     Taro.switchTab({
//       url: '/pages/index/index',
//     })
//   }
// })
// }
const querySchool = async () => {
  if (vdata.userAddress) {
    let address = vdata.userAddress.split('/')
    queryInfo.province = address[0] || ''
    queryInfo.city = address[1] || ''
    queryInfo.district = address[2] || ''
  }
  let res: any = await getSchool(queryInfo)
  // vdata.schoolList = res
  if (res) {
    res.forEach((item) => {
      item.schoolNameOrigan = item.schoolName
      item.schoolName = item.schoolName.replace(
        queryInfo.schoolName,
        `<span style='color:#2F5DE7'>${queryInfo.schoolName}</span>`
      )
    })
    vdata.schoolList = res
  }
}
const querySchoolList = () => {
  let address = vdata.userAddress.split('/')
  reqInfo.condition.province = address[0] || ''
  reqInfo.condition.city = address[1] || ''
  reqInfo.condition.district = address[2] || ''
  getSchoolList(reqInfo).then((res: any) => {
    if (res.records) {
      res.records.forEach((item) => {
        item.schoolNameOrigan = item.schoolName
      })
      vdata.schoolList = vdata.schoolList.concat(res.records)
    }
  })
}
onMounted(() => {
  let userAddress = personInfo.userInfo?.userAddress || personInfo.userAddress
  vdata.userAddress = userAddress
  vdata.areas = userAddress.split('/')
  // querySchool()
  querySchoolList()
  // vdata.userAddress = personInfo.userInfo?.userAddress
  //   personInfo.userAddress && personInfo.userAddress.length ? personInfo.userAddress.join(' ') : ''
  if (router.params.user) {
    vdata.type = router.params.user
  }
})
useDidShow(() => {
  setTimeout(() => {
    vdata.addressShow = true
  }, 500)
})
</script>

<style lang="scss">
.schoolMain {
  background: #f4f8fc;
  height: 100vh;
  box-sizing: border-box;
  .searchTop {
    padding: 15px 15px 20px;
    margin-bottom: 12px;
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
  }
  .searchInfo {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 20px;
    .leftSear {
      background: #f7f7f7;
      display: flex;
      align-items: center;
      border-radius: 90px;
      padding: 0 15px;
      flex: 1;
      .inputInfo {
        height: 40px;
        background: #f8f8f8;

        width: 100%;
        display: flex;
        align-items: center;
        padding-left: 15px;
        input {
          height: 50px;
          width: 100%;
          font-size: 14px;
        }
        .input-placeholder {
          font-family: PingFang SC;
          font-size: 14px;
          color: #c8c8c8;
        }
        .rightBtn {
          display: flex;
          align-items: center;
          width: 40px;
          height: 100%;
          justify-content: center;
        }
        .close-img {
          width: 17.5px;
          height: 17.5px;
          margin-right: 0px;
        }
      }
    }
    image {
      width: 16px;
      height: 16px;
    }
    .searText {
      font-family: PingFangSC-Regular;
      font-size: 15px;
      /* 文本色/二级 */
      color: #666666;
      margin-left: 16px;
    }
  }
  .city {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #343434;
    image {
      width: 15px;
      height: 15px;
      margin-right: 3px;
    }
    .edit {
      display: flex;
      align-items: center;
      color: #2f5de7;
    }
    .city-address {
      flex: 1;
      padding-right: 18px;
    }
  }
  .schoolList {
    background: #fff;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    .noData {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      font-weight: normal;
      line-height: 18px;
      color: #333333;
      margin-top: 60px;
      image {
        width: 160px;
        height: 130px;
        margin-bottom: 30px;
      }
      .noText {
        margin-bottom: 120px;
      }
    }
    .scroll-view_H {
      box-sizing: border-box;
      height: 100%;
      padding-bottom: 34px;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #343434;
        margin-bottom: 10px;
        padding-left: 20px;
        padding-top: 20px;
      }
      .school-info {
        padding: 0 20px;
      }
      .school-item {
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #343434;
        // display: flex;
        // align-items: center;
        padding: 20px 0;
        border-bottom: 0.5px solid #e6e6e6;
        .topInfo {
          display: flex;
          align-items: center;
          .topInfo-text {
            flex: 1;
          }
        }
        .bottomInfo {
          font-size: 12px;
          color: #999;
          box-sizing: border-box;
          padding-left: 20px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          margin-top: 5px;
        }
        image {
          width: 14px;
          height: 14px;
          margin-right: 5px;
          flex-wrap: nowrap;
        }
      }
    }
  }
  .noSchool {
    width: 100%;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    line-height: 50px;
    padding-left: 20px;
    .readSchool {
      color: #2f5de7;
    }
  }
}
</style>
