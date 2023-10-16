<template>
  <view class="swiperInfo">
    <Calendar :signedList="vdata.signedList" @change="handleChangeMonth" />
  </view>
</template>
<script setup lang="ts">
import Calendar from '@/components/Calendar.vue'
import { reactive, computed, onMounted } from 'vue'
import { singRecords } from '@/api/index'
const vdata: any = reactive({
  signedList: [],
})
const handleChangeMonth = (event) => {
  // 传过来的日期格式为 2022/6
  //   let yearMonth = event.detail.date
  // let list = []
  // vdata.signedList = list
  // this.setData({
  //   signedList: list,
  // })
}
const getList = () => {
  singRecords().then((res) => {
    if (res.signDate) {
      vdata.signedList = res.signDate
      console.log(res.signDate, 99)
    }
  })
}
onMounted(() => {
  getList()
})
</script>
<style lang="scss">
.swiperInfo {
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
