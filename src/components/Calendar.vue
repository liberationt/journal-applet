<template>
  <view>
    <view class="calendar-header">
      <view class="icon-operate icon-pre" @tap="handlePreMonth">◀</view>
      <view class="calender-header-date"
        >{{ vdata.currentYear }}/{{ formatZero(vdata.currentMonth) }}</view
      >
      <view
        :class="['icon-operate', 'icon-next', currentMonth() && 'disabled']"
        @tap="handleNextMonth"
        >▶</view
      >
    </view>
    <view class="calendar-body">
      <view class="calendar-week flex-wrap">
        <view v-for="(item, index) in vdata.weekList" :key="index" class="days-col">{{
          item
        }}</view>
      </view>

      <view class="calendar-days flex-wrap">
        <!-- is-today: 是否今日，is-signed: 是否选中，is-signed: 是否签到 -->
        <view
          v-for="(item, index) in vdata.monthDayList"
          :key="index"
          :class="[
            'days-col',
            item && item.date == vdata.today && 'is-today',
            item && item.date == vdata.selectedDate && 'is-checked',
            item && isSigned(item.date, vdata.formatSignedList) && 'is-signed',
          ]"
          :data-item="item"
          @tap="handleSelectDate"
        >
          <view class="days-col-text">{{ item ? item.day : '' }} </view>
          <view class="icon-signed">{{
            item && isSigned(item.date, vdata.formatSignedList) ? '✔' : ''
          }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, onMounted, defineProps, watch, defineEmits, computed } from 'vue'
const emit = defineEmits(['change'])
const props = defineProps({
  signedList: Array,
})
const vdata: any = reactive({
  weekList: ['日', '一', '二', '三', '四', '五', '六'], // 周列表
  monthDayList: [], // 当月的日列表
  currentYear: '', // 当前年
  currentMonth: '', // 当前月
  currentDay: '', // 当前日
  today: '', // 今日
  selectedDate: '',
  formatSignedList: [], // 将签到日期格式化
  isDisabledNextMonth: true, // 是否能跳转下一个月
})
const isSigned = (date, list) => {
  if (date && list.indexOf(date) > -1) {
    return true
  }
  return false
}
// 格式化为兼容ios的格式
const formatIosDate = (date) => {
  return date.replace(/\-/g, '/')
}
// 格式化时间
const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = formatZero(date.getDate())
  return [year, month, day].join('/')
}
// 十位数补0
const formatZero = (number) => {
  if (number < 10 && number > 0) {
    number = '0' + number
  }
  return number
}
// 初始化当前时间
const initCurrentDate = (date = null) => {
  let currentDate = new Date()
  let currentYear = currentDate.getFullYear()
  let currentMonth = currentDate.getMonth() + 1
  let currentDay = formatZero(currentDate.getDate())

  // 传的日期为空默认今日
  if (!date) {
    const today = `${currentYear}/${formatZero(currentMonth)}/${currentDay}`
    vdata.today = today
  }
  vdata.currentYear = currentYear
  vdata.currentMonth = currentMonth
  vdata.currentDay = currentDay
  initMonthDayList()
}
// 初始化当前月的日期列表
const initMonthDayList = () => {
  // 获取当月1号是周几
  let weekList = [0, 1, 2, 3, 4, 5, 6]
  // let date = new Date(vdata.currentYear, vdata.currentMonth, 1)
  // let weekDay = date.getDay() + 1

  let date = new Date(vdata.currentMonth + '/' + 1 + '/' + vdata.currentYear)
  let weekDay = weekList[date.getDay()] //获取当前月1号是星期几

  // 获取当月的总天数
  let monthFirstDay = new Date(vdata.currentYear, vdata.currentMonth, 0)
  let monthDay = monthFirstDay.getDate()
  let list = []
  for (let index = 0; index < weekDay; index++) {
    list.push(null)
  }
  for (let index = 1; index <= monthDay; index++) {
    const itemDate = `${vdata.currentYear}/${vdata.currentMonth}/${
      index < 10 ? '0' + index : index
    }`
    let item: any = {
      day: index < 10 ? '0' + index : index,
      date: itemDate, // 具体日期
    }
    list.push(item)
  }
  vdata.monthDayList = list
  console.log(vdata.monthDayList, 'LLLL')
}
// 选中当前日期
const handleSelectDate = (event) => {
  const item = event.currentTarget.dataset.item
  if (item) {
    vdata.selectedDate = item.date
  }
}
// 上一月
const handlePreMonth = () => {
  handleToggleMonth(-1)
}
// 下一月
const handleNextMonth = () => {
  if (!vdata.isDisabledNextMonth) {
    handleToggleMonth(1)
  }
}
// 切换月
const handleToggleMonth = (data) => {
  let month = (vdata.currentMonth += data)
  let year = vdata.currentYear
  if (month <= 0) {
    month = 12
    year--
  } else if (month > 12) {
    month = 1
    year++
  }
  vdata.currentYear = year
  vdata.currentMonth = month
  initMonthDayList()
  emit('change', { date: `${year}/${month}` })
}
const currentMonth = () => {
  let str
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth() + 1
  if (
    vdata.currentYear > todayYear ||
    (vdata.currentYear == todayYear && vdata.currentMonth >= todayMonth)
  ) {
    vdata.isDisabledNextMonth = true
    str = true
  } else {
    vdata.isDisabledNextMonth = false
    str = false
  }
  return str
}
watch(
  () => props.signedList,
  (newData) => {
    if (newData && newData.length) {
      let list = []
      for (let index = 0; index < newData.length; index++) {
        let element = newData[index]
        element = new Date(formatIosDate(element))
        element = formatTime(element)
        list.push(element)
      }
      vdata.formatSignedList = list
    }
  },
  {
    deep: true,
  }
)
onMounted(() => {
  initCurrentDate()
})
</script>
<style>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}
.calendar-header {
  text-align: center;
}
.icon-operate {
  display: inline-block;
  /* font-size: 40rpx; */
  color: #666666;
}
.disabled {
  color: #999999;
}
.calender-header-date {
  display: inline-block;
  margin: 0 40rpx;
}

/* calendar-body */
.calendar-body {
  margin: 40rpx;
}
.days-col {
  margin: 10rpx 0;
  width: 14.28%;
  text-align: center;
}
.days-col-text {
  display: block;
  margin: auto;
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 50%;
  font-size: 28rpx;
}
.is-signed .days-col-text {
  background-color: rgb(233, 236, 15);
  color: #ffffff;
}
.is-today .days-col-text {
  background-color: rgb(25, 212, 151, 0.2);
  color: rgb(25, 212, 151);
}
.is-checked .days-col-text {
  background-color: rgb(25, 212, 151);
  color: #ffffff;
}
.icon-signed {
  margin: -14rpx auto 0;
  width: 30rpx;
  height: 30rpx;
  line-height: 30rpx;
  text-align: center;
  border-radius: 50%;
  font-size: 22rpx;
}
.is-signed .icon-signed {
  color: #ffffff;
  background-color: rgb(25, 212, 151);
}
</style>
