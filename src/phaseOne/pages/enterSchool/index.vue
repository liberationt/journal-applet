<template>
  <view class="enterSchool" :style="{ paddingTop: `${navBarHeight + 15}px` }">
    <NavBar :title="'录入学校'" />
    <view class="identityContent">
      <view class="inputInfo">
        <input
          placeholder="请输入你的学校"
          type="text"
          v-model.trim="vdata.userSchoolName"
          :selectionStart="100"
          :selectionEnd="100"
          :maxlength="50"
        />
        <view class="rightBtn">
          <image
            v-if="vdata.userSchoolName"
            @tap="clearInput"
            class="close-img"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/41cde43ac6eb4dae99fe55bf5f889baf/close.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="inputInfo inputInfo-area" @click="showArea">
        <view class="area-box">
          <view class="area-select area-has-select" v-if="vdata.schoolAddress">
            {{ vdata.schoolAddress }}
          </view>
          <view class="area-select" v-else> 请选择学校所在地区 </view>
        </view>

        <view class="rightBtn">
          <image
            class="select-img"
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/northern/select-fill.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view
        :class="['operatBtn', vdata.userSchoolName && vdata.schoolAddress && 'nextBtn']"
        @tap="vdata.userSchoolName && vdata.schoolAddress && next()"
        >确定</view
      >
    </view>
    <Address ref="addressRef" @handleChange="addressChange" />
  </view>
</template>
<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro'
import { reactive, onMounted, ref } from 'vue'
import { useSystem, usePerson } from '@/stores'
import NavBar from '@/components/NavBar.vue'
import Address from '@/components/address.vue'
import { loggingSchool } from '@/api/user'
const system = useSystem()
const router = useRouter()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
const addressRef = ref()
const vdata = reactive({
  userSchoolName: '',
  schoolAddress: '',
  type: '',
})
// const getName = (e) => {
//   vdata.userSchoolName = e.detail.value
// }
const clearInput = () => {
  vdata.userSchoolName = ''
}

const showArea = () => {
  addressRef.value.addressShow()
}
const next = async () => {
  const areas = vdata.schoolAddress.split('/')
  const res: any = await loggingSchool({
    schoolName: vdata.userSchoolName,
    province: areas[0],
    city: areas[1],
    district: areas[2],
  })
  if (vdata.type) {
    personInfo.setUserKey('userSchoolName', vdata.userSchoolName)
    personInfo.setUserKey('userSchoolId', res.userSchoolId)
  } else {
    personInfo.setSchoolName(vdata.userSchoolName)
    personInfo.setSchoolId(res.userSchoolId)
  }

  Taro.navigateBack({ delta: 2 })
}

const addressChange = (val) => {
  if (val) {
    vdata.schoolAddress = val.join('/')
  }
}
onMounted(() => {
  if (router.params.user) {
    vdata.type = router.params.user
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
