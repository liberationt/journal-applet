<template>
  <view class="mainContent">
    <NavBar :title="'组卷记录'" :background="'#fff'" />
    <view class="search-content" :style="{ top: `${navBarHeight}px` }">
      <search-info @grand-change="grandChange" @timer-change="timerChange">
        <template #right>
          <text @tap="changeText">{{ vdata.text ? '整理' : '取消' }}</text>
        </template>
      </search-info>
    </view>
    <view
      class="recordContent"
      :style="{
        marginTop: `${navBarHeight + 40}px`,
        height: `calc(100vh - ${navBarHeight + 40}px)`,
      }"
    >
      <view class="noData" v-if="!vdata.recordList.length">
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/pay/fe624fe536e74fcc8a2ae0a182f49144/nodata.png"
        />
        <text>暂无组卷记录</text>
      </view>
      <scroll-view class="scroll-view_H" :scroll-y="true" v-else @scrolltolower="lower">
        <view class="scrollList" v-show="vdata.text">
          <view
            class="scroll-item"
            @tap="toDetail(item)"
            v-for="(item, i) in vdata.recordList"
            :key="i"
          >
            <image :src="item.icon" />
            <view>
              <view class="title">{{ item.exercisePaperName }}</view>
            </view>
          </view>
        </view>
        <view class="checkboxMian" v-show="!vdata.text">
          <nut-checkboxgroup v-model="vdata.selectOption" ref="group2" @change="itemChange">
            <nut-checkbox
              :label="item.exercisePaperId"
              v-for="(item, i) in vdata.recordList"
              :key="i"
            >
              <view class="scroll-item scroll-items">
                <image :src="item.icon" />
                <view>
                  <view class="title">{{ item.exercisePaperName }}</view>
                </view>
              </view>
            </nut-checkbox>
          </nut-checkboxgroup>
        </view>
      </scroll-view>
    </view>
    <view class="option" v-show="!vdata.text">
      <view>
        <nut-checkbox
          :indeterminate="vdata.indeterminate"
          v-model="vdata.checkboxAll"
          @change="checkAll"
          >全选</nut-checkbox
        >
      </view>
      <view class="delete" @tap="deleteNumber > 0 && deletePage()"
        >删除 <text v-if="deleteNumber > 0">({{ deleteNumber }})</text></view
      >
      <!-- <view @tap="changeText">取消</view> -->
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import NavBar from '@/components/NavBar.vue'
import { reactive, ref, onMounted, computed } from 'vue'
import { useSystem } from '@/stores'
import { getPaperList, deletePaper } from '@/api/wrongbook'
import { debounce } from '@/utils'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const group2 = ref()
const vdata = reactive({
  text: true,
  indeterminate: false,
  checkboxAll: false,
  deleteNumber: 0,
  selectOption: [],
  recordList: [],
  total: 10,
  searchInfo: {
    condition: {
      course: '',
      timeLimit: 0,
    },
    current: 1,
    orders: [
      {
        asc: true,
        column: '',
      },
    ],
    size: 10,
  },
})
//查看详情
const toDetail = (item) => {
  let info = JSON.stringify(item)
  Taro.navigateTo({
    url: `/wrongbook/paperDetails/index?info=${info}`,
  })
}
// 分页
const lower = () => {
  if (hasNext()) {
    getPageList()
  }
}
const deleteNumber = computed(() => {
  return vdata.selectOption.length
})
const hasNext = () => {
  if (vdata.searchInfo.current * vdata.searchInfo.size < vdata.total) {
    vdata.searchInfo.current = vdata.searchInfo.current + 1
    return true
  } else {
    return false
  }
}

//年级
const grandChange = (value) => {
  vdata.recordList = []
  vdata.searchInfo.condition.course = value
  vdata.searchInfo.current = 1
  vdata.checkboxAll = false
  vdata.selectOption = []
  getPageList()
}
//时间
const timerChange = (value) => {
  vdata.recordList = []
  vdata.searchInfo.current = 1
  vdata.searchInfo.condition.timeLimit = value
  vdata.checkboxAll = false
  vdata.selectOption = []
  getPageList()
}
//文字改变
const changeText = () => {
  vdata.text = !vdata.text
  vdata.checkboxAll = false
  vdata.selectOption = []
}
// 全选
const checkAll = (value: boolean) => {
  if (vdata.recordList.length) {
    group2.value.toggleAll(value)
  }
}
//每一项改变
const itemChange = (label: string[]) => {
  vdata.deleteNumber = label.length
  if (label.length === vdata.recordList.length) {
    vdata.indeterminate = false
    vdata.checkboxAll = true
  } else if (!label.length) {
    vdata.checkboxAll = false
  } else if (label.length && label.length < vdata.recordList.length) {
    vdata.indeterminate = true
  }
}
//删除
const deletePage = debounce(() => {
  let params = {
    exercisePaperIds: vdata.selectOption,
  }
  deletePaper(params).then((res) => {
    if (res) {
      setTimeout(() => {
        Taro.showToast({
          title: '移除试卷成功',
          icon: 'none',
          duration: 2000,
        })
      }, 100)
      vdata.searchInfo.current = 1
      vdata.recordList = []
      getPageList()
      changeText()
    }
  })
})
//获取列表
const getPageList = () => {
  getPaperList(vdata.searchInfo).then((res: any) => {
    if (res.records) {
      vdata.recordList = vdata.recordList.concat(res.records)
      vdata.total = res.total
    }
  })
}

onMounted(() => {
  // vdata.recordList = []
  getPageList()
})
</script>
<style lang="scss">
.mainContent {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .search-content {
    position: fixed;
    width: 100%;
    left: 0;
    right: 0;
    z-index: 10;
  }
  .recordContent {
    background: #f6f6f6;
    background: #f6f6f6;
    // padding-bottom: 90px;
    box-sizing: border-box;
    overflow: scroll;
  }
  .scroll-view_H {
    height: 100%;
  }
  .checkboxMian {
    // padding: 0 15px;
    padding-left: 15px;
    box-sizing: border-box;
  }
  .scroll-item {
    height: 77.5px;
    border-radius: 8px;
    opacity: 1;
    background: #ffffff;
    box-sizing: border-box;
    border: 1px solid #f3f3f3;
    display: flex;
    align-items: center;

    margin: 15px;
    padding-left: 10px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    image {
      width: 56px;
      height: 55px;
      margin-right: 10px;
    }
  }
  .scroll-items {
    margin: 15px 0 15px 10px;
  }
  .noData {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    flex-direction: column;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    font-weight: normal;
    line-height: 18px;
    color: #333333;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 30px;
    }
  }
  .option {
    height: 85px;
    background: #fff;
    width: 100%;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    .delete {
      // width: 155px;
      flex: 1;
      margin-left: 20px;
      height: 44px;
      border-radius: 22px;
      background: #2f5de7;
      line-height: 44px;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>
