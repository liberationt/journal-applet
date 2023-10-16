<template>
  <!-- <view class="swiperInfo" :style="{ paddingTop: `${navBarHeight + 12}px` }">
    <view @tap="showText">测试</view>
    <rich-text :nodes="handleNodes()"></rich-text>
  </view> -->
  <view>
    <view class="list">
      <view @tap="chageTab('list0')" :class="[vdata.type == 'list0' && 'blue']" id="list0"
        >list0</view
      >
      <view @tap="chageTab('list1')" :class="[vdata.type == 'list1' && 'blue']" id="list1"
        >list11</view
      >
      <view @tap="chageTab('list2')" :class="[vdata.type == 'list2' && 'blue']" id="list2"
        >list29</view
      >
    </view>
    <scroll-view
      :scroll-into-view="vdata.toView"
      class="scroll-content"
      scroll-y="true"
      scroll-with-animation="true"
      @scroll="scrollChange"
    >
      <view class="mainContent">
        <view
          v-for="(item, i) in vdata.list"
          @tap="changeView(item)"
          :id="item"
          class="test"
          :key="i"
        >
          {{ item }}
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script setup lang="ts">
import parse from '@rojer/katex-mini'
import welCropper from '@/components/cropper.vue'
import { reactive, computed, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { useSystem } from '@/stores'
import Taro from '@tarojs/taro'
import { tap } from 'lodash'

const system = useSystem()
const { navBarHeight } = system.navBarInfo
const changeView = (item) => {
  vdata.toView = item
}
const chageTab = (item) => {
  vdata.toView = item
  vdata.type = item
}
const vdata: any = reactive({
  nodes: '',
  type: 'list0',
  // latex: '\\frac { 2 } { 3 } \\times \\frac { 9 } { 1 0 } = \\frac { 3 } { 5 }',
  // latex: '\\sqrt{x} + \\sqrt{x^{2}+\\sqrt{y}} = \\sqrt[3]{k_{i}} - \\frac{x}{m}',
  latex: 'x+2-3*4/6=4/y + x\\cdot y',
  list: ['list0', 'list1', 'list2'],
  toView: '',
  anchorArray: [],
})
const scrollChange = (e) => {
  let scrollTop = e.detail.scrollTop
  let scrollArr = vdata.anchorArray
  if (scrollTop >= scrollArr[scrollArr.length - 1]) {
    return
  } else {
    for (let i = 0; i < scrollArr.length; i++) {
      if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
        // selectFloorIndex控制筛选块高亮显示
        vdata.type = vdata.toView = vdata.list[0]
      } else if (scrollTop >= scrollArr[i - 1] && scrollTop < scrollArr[i]) {
        vdata.type = vdata.toView = vdata.list[i]
      }
    }
  }
}
const handleNodes = () => {
  return parse(vdata.latex)
}
const showText = () => {
  vdata.nodes = parse(vdata.latex)
  // Taro.request({
  //   url: 'https://katex-api.eqistu.cn',
  //   data: {
  //     latex: vdata.latex,
  //   },
  //   dataType: 'json',
  //   success(res) {
  //     // setNodes(res.data)
  //     console.log(res.data, 999)
  //   },
  // })
}
const end = () => {}
const cropdown = ({ res }) => {
  if (res?.rectInfo) {
    vdata.rectInfo = res.rectInfo
  }
}
onMounted(() => {
  let timer = setInterval(() => {
    let query = Taro.createSelectorQuery()
    let heightArr = []
    let h = 0
    query
      .selectAll('.test')
      .boundingClientRect((react) => {
        if (react) {
          react.forEach((res) => {
            h += res.height
            heightArr.push(h)
          })
          vdata.anchorArray = heightArr
          clearInterval(timer)
          timer = null
          console.log(heightArr)
        }
      })
      .exec()
  }, 1000)
})
</script>
<style lang="scss">
.mainContent {
  height: 300px;
  flex-wrap: nowrap;
  .test {
    height: 300px;
  }
}
.scroll-content {
  background: blue;
}
.list {
  height: 50px;
  background: red;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  view {
    height: 100%;
  }
  .blue {
    color: yellow;
  }
}
.swiperInfo {
  height: 100vh;
  background: red;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .mainContent {
    background: yellow;
    flex: 1;
    position: relative;
  }
}
</style>
