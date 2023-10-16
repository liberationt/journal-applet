<template>
  <view class="personContent" :style="{ paddingTop: `${navBarHeight + 24}px` }">
    <NavBar :title="'个人资料'" />
    <view
      class="personScroll"
      :style="{
        height: `calc(100vh - ${navBarHeight + 30}px)`,
      }"
    >
      <view class="headers">
        <button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image
            class="headerImg"
            :src="vdata.userInfo.portraitUrl ? vdata.userInfo.portraitUrl : vdata.defaultImg"
          />
          <text class="nickInfo">更换头像</text>
        </button>
      </view>

      <view class="indentList">
        <view class="indentItem">
          <view class="itemInfo">
            <view class="label">昵称</view>
            <view class="rightInfo" @tap="toNickName(1)">{{ nickNameText }}</view>
            <view class="jt">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9400a5cb55b541adb59ef9050345fe1c/close-circle-fill.png"
              />
            </view>
            <view class="border-bottom"></view>
          </view>
        </view>
        <view class="indentItem mb12">
          <view class="itemInfo">
            <view class="label">绑定手机号</view>
            <view class="rightInfo" style="color: #ccc" v-if="vdata.userInfo.userPhone">
              {{ vdata.userInfo.userPhone }}
            </view>
            <view class="rightInfo" v-else>
              <nut-button
                openType="getPhoneNumber"
                @getphonenumber="getPhoneNumber"
                type="default"
                >{{
                  vdata.userInfo.userPhone ? vdata.userInfo.userPhone : '授权手机号'
                }}</nut-button
              >
            </view>
            <view class="jt" v-if="!vdata.userInfo.userPhone">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9400a5cb55b541adb59ef9050345fe1c/close-circle-fill.png"
              />
            </view>
            <!-- <view class="jts" v-else>
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/my/b3d70c9c656e4a918c1b0ebdb0f2b195/arrar.png"
              />
            </view> -->
          </view>
        </view>
        <view class="indentItem">
          <view class="itemInfo">
            <view class="label">真实姓名</view>
            <view class="rightInfo" @tap="toNickName(2)">{{ realNameText }}</view>
            <view class="jt">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9400a5cb55b541adb59ef9050345fe1c/close-circle-fill.png"
              />
            </view>
            <view class="border-bottom"></view>
          </view>
        </view>
        <view class="indentItem">
          <view class="itemInfo">
            <view class="label">地区</view>
            <view class="rightInfo" @tap="showAddress">{{
              vdata.userInfo.userAddress ? vdata.userInfo.userAddress : '请选择地区'
            }}</view>
            <view class="jt">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9400a5cb55b541adb59ef9050345fe1c/close-circle-fill.png"
              />
            </view>
            <view class="border-bottom"></view>
          </view>
        </view>
        <view class="indentItem">
          <view class="itemInfo">
            <view class="label"
              >学校
              <view
                :class="[
                  'shcool-tag',
                  vdata.schoolSts === '审核中' ? 'audit' : '',
                  vdata.schoolSts === '审核驳回' ? 'reject' : '',
                ]"
                v-if="shcoolTagShow"
                >{{ vdata.schoolSts }}</view
              ></view
            >
            <view
              :class="[
                'rightInfo',
                vdata.schoolSts === '审核中' ? 'audit' : '',
                vdata.schoolSts === '审核驳回' ? 'reject' : '',
              ]"
              @tap="toSchool"
              >{{
                vdata.userInfo.userSchoolName ? vdata.userInfo.userSchoolName : '请选择学校'
              }}</view
            >
            <view class="jt">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9400a5cb55b541adb59ef9050345fe1c/close-circle-fill.png"
              />
            </view>
            <view class="border-bottom"></view>
          </view>
        </view>
        <view class="indentItem">
          <view class="itemInfo">
            <view class="label">年级</view>
            <view class="rightInfo" @tap="showPup">{{
              vdata.userInfo.userType ? getList[vdata.userInfo.userClassGrade] : '请选择年级'
            }}</view>
            <view class="jt">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9400a5cb55b541adb59ef9050345fe1c/close-circle-fill.png"
              />
            </view>
            <view class="border-bottom"></view>
          </view>
        </view>
        <view class="indentItem mb12 auto-upgrade">
          <view class="itemInfo">
            <view class="label">自动升年级</view>
            <view class="rightInfo">
              <nut-switch
                v-model="vdata.userInfo.automaticUpGrades"
                active-color="#516AFF"
                inactive-color="#999"
              />
            </view>
          </view>
        </view>
        <view class="indentItem">
          <view class="itemInfo">
            <view class="label">身份</view>
            <view class="rightInfo" @tap="showIndent">{{
              vdata.userInfo.userType ? getIndent[vdata.userInfo.userType] : '请选择身份'
            }}</view>
            <view class="jt">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/9400a5cb55b541adb59ef9050345fe1c/close-circle-fill.png"
              />
            </view>
          </view>
        </view>
        <!-- <view class="indentInfo mb12">
          <view
            :class="['indent-item', vdata.userInfo.userType === i + 1 && 'activeBb']"
            v-for="(item, i) in vdata.indentList"
            :key="i"
            @click="chooseIndent(i + 1)"
          >
            <image :src="item.url" />
            <text>{{ item.text }}</text>
          </view>
        </view> -->
        <view :class="['operation', checkSubmit() && 'submitBtn']" @tap="checkSubmit() && submit()"
          >保存</view
        >
      </view>
    </view>

    <grade-popup
      ref="gradeShowPopup"
      @handleChange="getGrade"
      :grande="vdata.userInfo.userClassGrade"
    />
    <Address ref="address" @handleChange="addressChange" />
    <nut-popup
      round
      position="bottom"
      :close-on-click-overlay="false"
      v-model:visible="vdata.indent"
    >
      <!-- :style="{ height: '464px' }" -->
      <view class="indentDialog">
        <view class="title">
          <text>选择身份</text>
          <image
            @tap="vdata.indent = false"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/c6950d75d230402c8baf893a2f019f22/icon1.png"
          />
        </view>

        <view
          @tap="chooseIndent(i + 1)"
          v-for="(item, i) in vdata.indentList"
          :key="i"
          :class="['item-indent', vdata.indentType === i + 1 && 'item-indent-select']"
        >
          <view>{{ item.text }}</view>
          <view>
            <image :src="item.url" />
          </view>
        </view>
        <view class="confirmBox">
          <view class="btn" @tap="determine">确定</view>
        </view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
// import Grade from '@/components/Grade.vue'
import NavBar from '@/components/NavBar.vue'
import GradePopup from '@/components/GradePopup.vue'
import Address from '@/components/address.vue'
import { getToken } from '@/utils/token'

import Taro, { nextTick, useDidShow, useRouter } from '@tarojs/taro'
// import NavBar from '@/components/NavBar.vue'
import { getUserPhone, getShcoolDetail } from '@/api/user'
import { updateUserInfo } from '@/api/index'
import { reactive, ref, onMounted, computed } from 'vue'
import { useSystem, useUser, usePerson } from '@/stores'
import { getBaseUrl } from '@/api/url'
const system = useSystem()
const user = useUser()
const personInfo = usePerson()
const router = useRouter()
const gradeShowPopup = ref()
const address = ref()
const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  showRound: false,
  defaultImg:
    'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/b2c0d521a4444e64ae6a91fb452532dc/defaultImg.png',
  indentList: [
    {
      text: '我是家长',
      url: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/grzx/488218f8be1841a98532b8edc6a7c28d/jz.png',
    },
    {
      text: '我是学生',
      url: 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/grzx/1fded3ffa7e647d798d71d0b47e3b0d1/xs.png',
    },
  ],
  indent: false,
  schoolSts: '', // 学校的状态
  userInfo: {
    userType: '',
    nickName: '',
    userPhone: '',
    userClassGrade: '',
    portraitUrl: '',
    userSchoolName: '',
    userAddress: '',
    realNameSelf: '',
    automaticUpGrades: true,
  },
  grade: '',
  indentType: '',
})
const nickNameText = computed(() => {
  const nickName = vdata.userInfo.nickName?.trim() ?? ''
  return nickName ? nickName : '请输入昵称'
})

const realNameText = computed(() => {
  const realName = vdata.userInfo.realNameSelf?.trim() ?? ''
  return realName ? realName : '请输入真实姓名'
})

const shcoolTagShow = computed(() => {
  return vdata.schoolSts === '审核中' || vdata.schoolSts === '审核驳回'
})
const chooseIndent = (type: Number) => {
  // vdata.userInfo.userType = type
  vdata.indentType = type
}
const showIndent = () => {
  vdata.indentType = vdata.userInfo.userType
  vdata.indent = true
}
const determine = () => {
  vdata.userInfo.userType = vdata.indentType
  personInfo.setUserKey('userType', vdata.indentType)
  vdata.indent = false
}
//姓名昵称
const toNickName = (type) => {
  if (type === 1) {
    Taro.navigateTo({
      url: '/myPages/editNickName/index',
    })
  } else {
    Taro.navigateTo({
      url: '/myPages/editUserName/index',
    })
  }
}
const toSchool = () => {
  Taro.navigateTo({
    url: '/phaseOne/pages/school/index?user=1',
  })
}
//选择年级
const showPup = () => {
  gradeShowPopup.value.popupShow(vdata.userInfo.userClassGrade)

  // vdata.showRound = true
  // console.log(vdata.showRound, 8888)
}
//城市选择
const showAddress = () => {
  address.value.addressShow()
}
const addressChange = (val) => {
  if (val && val.length) {
    vdata.userInfo.userAddress = val.join('/')
    personInfo.setUserKey('userAddress', vdata.userInfo.userAddress)
  }
}
// let phoneNumber = computed(() => {
//   let phone = ''
//   if (user.userInfo?.userPhone || vdata.userInfo.userPhone) {
//     let pho = /(\d{3})\d*(\d{4})/
//     phone = vdata.userInfo.userPhone.replace(pho, '$1****$2') || user.userInfo.userPhone
//   }
//   return phone
// })

// const closePup = () => {
//   vdata.showRound = false
// }
const getPhoneNumber = (e) => {
  if (e.detail.code) {
    getUserPhone({ code: e.detail.code, type: 2 }).then((res: any) => {
      // user.setUserInfo()
      vdata.userInfo.userPhone = res
      personInfo.setUserKey('userPhone', res)
      Taro.showToast({
        title: '授权成功',
        icon: 'none',
        duration: 2000,
      })
    })
  }
}
const getGrade = (value) => {
  vdata.userInfo.userClassGrade = value[0]
}
const checkSubmit = () => {
  let flag = false
  for (let key in vdata.userInfo) {
    if (vdata.userInfo[key]) {
      flag = true
    }
  }
  return flag
}
//提交
const submit = () => {
  let params = {
    ...vdata.userInfo,
    id: user.userInfo.id,
  }
  updateUserInfo(params).then(() => {
    setTimeout(() => {
      Taro.showToast({
        title: '保存成功',
        icon: 'none',
        duration: 3000,
      })
    }, 100)
    Taro.switchTab({
      url: '../my/index',
    })
    user.setUserInfo()
  })
}
const onChooseAvatar = (e) => {
  const { avatarUrl } = e.detail
  const token = getToken()
  Taro.uploadFile({
    url: getBaseUrl() + '/file/upload', //仅为示例，非真实的接口地址
    filePath: avatarUrl,
    name: 'files',
    formData: {
      files: avatarUrl,
      moduleName: 'ctb',
    },
    header: {
      wxAccessToken: token,
    },
    success(res) {
      if (res.data) {
        const data = JSON.parse(res.data)
        if (data.code === 0) {
          vdata.userInfo.portraitUrl = data.data[0]
          personInfo.setUserKey('portraitUrl', data.data[0])
        }
      }
    },
  })
}
const getList = {
  1: '一年级',
  2: '二年级',
  3: '三年级',
  4: '四年级',
  5: '五年级',
  6: '六年级',
  7: '七年级',
  8: '八年级',
  9: '九年级',
  10: '高一',
  11: '高二',
  12: '高三',
}
const getIndent = {
  1: '家长',
  2: '学生',
}
useDidShow(() => {
  vdata.userInfo = JSON.parse(JSON.stringify(personInfo.userInfo))
  // 获取学校的审核状态 需要调取详情的接口
  if (vdata.userInfo?.userSchoolId) {
    getShcoolDetail({
      id: vdata.userInfo.userSchoolId,
    }).then((res: any) => {
      vdata.schoolSts = res.schoolSts
    })
  }
  const { showUpgrade } = router.params
  if (showUpgrade === '1') {
    nextTick(() => {
      showPup()
    })
  }

  Taro.setStorageSync('isPdfBack', true)
})
onMounted(() => {})
</script>

<style lang="scss">
@import './index.scss';
</style>
