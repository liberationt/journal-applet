<template>
  <NavBar search @click:filter="onClickFliter" />
  <view
    class="list"
    :style="{ marginTop: `${navBarHeight + 46}px`, '--navBarHeight': `${navBarHeight}px` }"
  >
    <nut-tabs v-model="state.tabvalue">
      <nut-tabpane v-for="(item, index) in state.tabs" :title="item" :key="index">
        <view
          class="tab-item"
          v-for="item in state.list"
          :key="`tab-item${item}${index}`"
          @click="onTabItemClick(item)"
        >
          <view class="tab-item-title">
            <view class="text">2022年Q4</view>
            <view class="tab-right">
              <nut-tag type="danger" @click="onClaimClick(item)">待认领</nut-tag>
              <nut-tag type="primary">已认领</nut-tag>
            </view>
          </view>
          <view class="tab-item-content">
            <view class="content-item">
              <view class="content-item-left">团队名称：</view>
              <view class="content-item-right">啊啊</view>
            </view>
            <view class="content-item">
              <view class="content-item-left">团队负责人：</view>
              <view class="content-item-right">啊啊</view>
            </view>
            <view class="content-item">
              <view class="content-item-left">目标销售金额：</view>
              <view class="content-item-right">啊啊</view>
            </view>

            <view class="content-item">
              <view class="content-item-left">实际销售情况：</view>
              <view class="content-item-right">啊啊</view>
            </view>
            <view class="content-item">
              <view class="content-item-left">目标完成情况：</view>
              <view class="content-item-right">
                <nut-progress percentage="60" :text-inside="true"
              /></view>
            </view>
          </view>
        </view>
      </nut-tabpane>
    </nut-tabs>
    <nut-popup
      class="filter-popup"
      position="bottom"
      v-model:visible="state.showFilter"
      closeable
      round
      safe-area-inset-bottom
    >
      <view class="filter-popup-content">
        <view class="content-item">
          <view class="content-item-title">目标归属:</view>
          <view class="content-item-con">
            <nut-input
              class="content-item-con-input"
              v-model="state.year"
              placeholder="目标归属年份"
              readonly
              disabled
              :border="false"
              @click="onClickInput(1)"
            />
            &nbsp;-&nbsp;
            <nut-input
              class="content-item-con-input"
              v-model="state.month"
              placeholder="目标归属季度"
              readonly
              disabled
              :border="false"
              @click="onClickInput(2)"
            />
          </view>
        </view>
        <view class="content-item">
          <view class="content-item-title">目标状态:</view>
          <view class="content-item-con">
            <nut-radiogroup v-model="state.radioValue" direction="horizontal">
              <nut-radio
                shape="button"
                :label="item.value"
                v-for="(item, index) in targetRadios"
                :key="`targetradio${index}`"
                >{{ item.text }}</nut-radio
              >
            </nut-radiogroup>
          </view>
        </view>
        <view class="self-popup-bottom filter-popup-bottom">
          <nut-button plain type="primary">重置</nut-button>
          <nut-button type="primary">确认</nut-button>
        </view>
      </view>
    </nut-popup>
    <nut-popup
      class="claim-popup"
      v-model:visible="state.showClaim"
      round
      :style="{
        width: '70%',
      }"
    >
      <view class="claim-popup-content">
        <view class="claim-popup-content-title">
          <nut-icon name="tips" color="#FFA500" style="margin-right: 5px"></nut-icon>
          是否认领个人目标</view
        >
        <nut-form>
          <nut-form-item label="团队名称：" label-align="right" label-width="100px"
            >销售一组</nut-form-item
          >
          <nut-form-item label="目标销售金额：" label-align="right" label-width="100px">
            500000元</nut-form-item
          >
          <nut-form-item label="目标归属：" label-align="right" label-width="100px">
            2022年Q4</nut-form-item
          >
        </nut-form>
        <view class="self-popup-bottom">
          <nut-button plain type="primary">取消</nut-button>
          <nut-button type="primary">确认</nut-button>
        </view>
      </view>
    </nut-popup>
    <nut-picker
      v-model:visible="state.pickerYearSHow"
      :columns="state.columns"
      title="目标归属年份选择"
      @confirm="onPickerConfirm"
    >
    </nut-picker>
    <nut-picker
      v-model:visible="state.pickQuarterShow"
      :columns="state.columns1"
      title="目标归属季度选择"
      @confirm="onPickerConfirm"
    >
    </nut-picker>
  </view>
</template>
<script lang="ts" setup>
import { useReachBottom, navigateTo } from '@tarojs/taro'
import { reactive, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getNavInfo } from '@/utils/index'
import { PickerOption } from '@nutui/nutui-taro/dist/types/__VUE/picker/types'

const { navBarHeight } = getNavInfo()

const targetRadios = [
  {
    text: '待认领',
    value: 0,
  },
  {
    text: '已认领',
    value: 1,
  },
]

const state = reactive<{
  tabs: string[]
  tabvalue: string
  list: any[]
  showFilter: boolean
  columns: PickerOption[]
  columns1: PickerOption[]
  pickerYearSHow: boolean
  pickQuarterShow: boolean
  year: string
  month: string
  pickType: number // 选择的类型 1 年份 | 2 季度
  pickerValue: string[]
  radioValue: string
  showClaim: boolean
}>({
  tabs: ['销售目标', '团队目标', '个人目标'],
  tabvalue: '0',
  list: new Array(10),
  showFilter: true,
  columns: [],
  columns1: [],
  year: '',
  month: '',
  pickerYearSHow: false,
  pickQuarterShow: false,
  pickType: 1,
  pickerValue: [],
  radioValue: '',
  showClaim: false,
})

// 当点击筛选按钮
const onClickFliter = () => {
  state.showFilter = !state.showFilter
}

const onPickerConfirm = ({ selectedValue }) => {
  if (state.pickType === 1) {
    state.year = selectedValue
  } else {
    state.month = selectedValue
  }
}

// 处理年份
const dealYear = () => {
  const currentYear = new Date().getFullYear()

  for (let i = currentYear - 2; i < currentYear + 10; i++) {
    state.columns.push({
      text: String(i),
      value: String(i),
    })
  }
}
// 处理季度
const dealQuarter = () => {
  for (let i = 1; i <= 4; i++) {
    state.columns1.push({
      text: `Q${i}`,
      value: `Q${i}`,
    })
  }
}

const onClickInput = (type) => {
  state.pickType = type
  if (type === 1) {
    state.pickerYearSHow = true
  } else {
    state.pickQuarterShow = true
  }
}

// 展示认领弹窗
const onClaimClick = (item) => {
  state.showClaim = true
}

// tabItem点击
const onTabItemClick = (item) => {
  navigateTo({ url: '/pages/sale/detail/index' })
}
// onMounted
onMounted(() => {
  dealQuarter()
  dealYear()
})

// 触底
useReachBottom(() => {
  console.log('🚀 ~ file: index.vue:59 ~ useReachBottom ~ useReachBottom', useReachBottom)
})
</script>
<style lang="scss">
@import './index.scss';
</style>
