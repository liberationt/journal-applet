<template>
  <view class="dicGrades" :style="{ paddingTop: `${navBarHeight + 30}px` }">
    <NavBar title="我的听写成绩" :fixedStyle="vdata.fixedStyle" />
    <view class="gradesInfo">
      <view class="progress">
        <nut-circleprogress :progress="progress" radius="60" color="#D4EAFF" strokeWidth="7">
        </nut-circleprogress>
        <view class="accuracy">
          <text class="percentage">{{ progress }}%</text>
          <text class="text">正确率</text>
        </view>
      </view>
      <view class="rightGrade">
        <view class="grade-item">
          <view class="item-left">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/ed2b4aeecb254566b3c546264724e570/tms.png"
              alt=""
            />
            <text>题目数</text>
          </view>
          <view class="number"> {{ vdata.hearList.length }}</view>
        </view>
        <view class="grade-item">
          <view class="item-left">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/57b918490a8a4624b6eb717641baf725/right.png"
              alt=""
            />
            <text>正确</text>
          </view>
          <view class="number"> {{ rightNumber }}</view>
        </view>
        <view class="grade-item">
          <view class="item-left">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/8b5afb14997f4248ae919149e25a5bd0/error.png"
              alt=""
            />
            <text>错误</text>
          </view>
          <view class="number"> {{ errorNumber }} </view>
        </view>
      </view>
    </view>
    <view class="wordInfo" :style="{ height: `calc(100vh - ${navBarHeight + 290}px)` }">
      <view class="item-word">
        <template v-for="(vtem, k) in vdata.hearList" :key="k">
          <view
            v-if="vtem.chineseContent && vtem.chineseContent.length == 1"
            :class="['text-item', isRight(vtem.chineseContent) && 'text-item-right']"
          >
            <text> {{ vtem.chineseContent }}</text>
            <view class="icon">
              <image
                class="img"
                :src="
                  isRight(vtem.chineseContent)
                    ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/txxl/855dc1b23d8f4156bd5b4d729653dde7/rig.png'
                    : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/txxl/fb0f9ec1d02f4a289c87cfc08ef8f968/err.png'
                "
                mode="scaleToFill"
              />
            </view>
          </view>
          <view v-else class="text-item-main">
            <view v-for="(text, textIndex) in vtem.chineseContent" :key="textIndex">
              <view
                :class="[
                  'text-item-item',
                  moreRight(vtem.chineseContent, text) && 'text-item-item-right',
                ]"
              >
                <text>{{ text }}</text>
                <view class="icon">
                  <image
                    class="img"
                    :src="
                      moreRight(vtem.chineseContent, text)
                        ? 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/txxl/855dc1b23d8f4156bd5b4d729653dde7/rig.png'
                        : 'https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/txxl/fb0f9ec1d02f4a289c87cfc08ef8f968/err.png'
                    "
                    mode="scaleToFill"
                  />
                </view>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>
    <view class="botOpera">
      <view class="again agains" @tap="again">在听一次</view>
      <view class="again" @tap="study">学习汉字</view>
    </view>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, usePerson, useUser } from '@/stores'
import { getDicExeInfo } from '@/api/dictationExercise'
import { debounce } from '@/utils'
import { getTryCount } from '@/api/index'
import MemberToast from '@/components/memberToast.vue'
import { reactive, ref, computed, onMounted } from 'vue'
const memberToast = ref()
const user = useUser()

const system = useSystem()
const router = useRouter()
const personInfo = usePerson()
const { navBarHeight } = system.navBarInfo
const vdata: any = reactive({
  fixedStyle: {
    color: '#fff',
  },
  progress: 0,
  hearList: [],
  contentList: [],
})
//是否正确
const isRight = (content) => {
  let flag = false
  vdata.contentList.forEach((item) => {
    if (item.length > 1) {
      let list = item.split(',')
      list.forEach((element) => {
        let isFlag = element.indexOf(content)
        if (isFlag != -1) {
          flag = true
        }
      })
    } else {
      if (item === content) {
        flag = true
      }
    }
  })

  return flag
}
//正确数量
const rightNumber = computed(() => {
  let arrList = []
  vdata.hearList.forEach((item) => {
    vdata.contentList.forEach((element) => {
      if (element.length > 1) {
        let list = element.split(',')
        list.forEach((vtem) => {
          let isFlag = vtem.indexOf(item.chineseContent)
          if (isFlag != -1) {
            arrList.push(item.chineseContent)
          }
        })
      } else {
        if (item.chineseContent === element) {
          arrList.push(item.chineseContent)
        }
      }
    })
  })
  let newArr = [...new Set(arrList)] || []
  return newArr.length
})
//错误数量
const errorNumber = computed(() => {
  return vdata.hearList.length - rightNumber.value
})
//多文字是否正确
const moreRight = (content, text) => {
  let flag = false
  vdata.contentList.forEach((item) => {
    if (item === content) {
      flag = true
    }
    if (item.length > 1) {
      let list = item.split(',')
      list.forEach((element) => {
        let isFlag = element.indexOf(text)
        if (isFlag != -1) {
          flag = true
        }
      })
    }
  })
  return flag
}
const again = debounce(async () => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '听写训练', funCourseName: null })
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
  Taro.redirectTo({
    url: '../dictationBegin/index',
  })
}
const study = debounce(() => {
  Taro.navigateTo({
    url: '../webView/index',
  })
})
//概率
const progress = computed(() => {
  return Math.round((rightNumber.value / vdata.hearList.length) * 100)
})
const getGrade = (imageUrl) => {
  let params = {
    imageUrl,
  }
  getDicExeInfo('hwContent', params, true).then((res) => {
    if (res) {
      vdata.contentList = res.wordList || []
    }
  })
}
onMounted(() => {
  vdata.hearList = personInfo.dicExerciseList
  if (router.params.tempImagePath) {
    getGrade(router.params.tempImagePath)
  }
})
</script>
<style lang="scss">
.dicGrades {
  height: 100vh;
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/kycp/e9032b853c1042f392b4a005237be9fd/bg.png')
    no-repeat top;
  background-size: 100%;

  .gradesInfo {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    height: 120px;
    .progress {
      margin-left: 55px;
      .nut-circleprogress-text {
        display: none;
      }
      .accuracy {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        .percentage {
          font-family: PingFangSC-Semibold;
          font-size: 30px;
          color: #ffffff;
        }
        .text {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }
      }
      position: relative;
    }

    .rightGrade {
      margin-left: 52px;
      height: 120px;
      padding: 10px 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .grade-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #ffffff;
        .item-left {
          display: flex;
          align-items: center;
        }
        .number {
          font-family: PingFangSC-Semibold;
          font-size: 18px;
          color: #ffffff;
          margin-left: 10px;
        }
        image {
          width: 14px;
          height: 14px;
          margin-right: 5px;
        }
      }
    }
  }
  .wordInfo {
    background: #fff;
    border-radius: 20px 20px 0 0;
    position: fixed;
    bottom: 95px;
    left: 0;
    right: 0;
    box-sizing: border-box;
    padding: 25px;
    overflow-y: scroll;
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #333333;
    }
    .item-word {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      margin: 16px 0;
      .text-item {
        height: 41px;
        width: 41px;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/txxl/eac6d4f90fe14a52bf513c2de8efc5a5/errBg.png')
          no-repeat center;
        font-family: PingFangSC-Regular;
        background-size: 100% 100%;
        font-size: 20px;
        color: #343434;
        text-align: center;
        line-height: 41px;
        margin-bottom: 20px;
        margin-right: 10px;
        position: relative;
        .icon {
          width: 14px;
          height: 14px;
          position: absolute;
          left: 50%;
          bottom: 7px;
          transform: translate(-50%);
          .img {
            width: 14px;
            height: 14px;
          }
        }
      }
      .text-item-right {
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/txxl/6b3d4472dee54c3e91616260d7e96e91/rightBg.png')
          no-repeat center;
      }
      .text-item-select {
        color: #0256ff;
      }
      .text-item-main {
        display: flex;
        margin-right: 10px;
      }
      .text-item-select-main {
        .text-item-item {
          color: #0256ff;
        }
      }
      .text-item-item {
        height: 41px;
        width: 41px;
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/txxl/eac6d4f90fe14a52bf513c2de8efc5a5/errBg.png')
          no-repeat center;
        font-family: PingFangSC-Regular;
        background-size: 100% 100%;
        font-size: 20px;
        color: #343434;
        text-align: center;
        line-height: 41px;
        margin-bottom: 20px;
        position: relative;
        .icon {
          width: 14px;
          height: 14px;
          position: absolute;
          left: 50%;
          bottom: 7px;
          transform: translate(-50%);
          .img {
            width: 14px;
            height: 14px;
          }
        }
      }
      .text-item-item-right {
        background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/txxl/6b3d4472dee54c3e91616260d7e96e91/rightBg.png')
          no-repeat center;
      }
    }
  }
  .botOpera {
    height: 88px;
    box-shadow: inset 0px 1px 1px 1px #ffffff;
    border-top: 1px solid #f0f0f0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 15px 25px 0;
    box-sizing: border-box;
    text-align: center;
    line-height: 44px;
    justify-content: space-between;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    .again {
      background: #2f5de7;
      color: #fff;
      width: 152px;
      height: 44px;
      border-radius: 20px;
    }
    .agains {
      background: #fff;
      border: 1px solid #0c61ff;
      box-sizing: border-box;
      color: #2f5de7;
      line-height: 42px;
    }
  }
}
</style>
