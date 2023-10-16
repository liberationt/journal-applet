<template>
  <view class="authoritativeMain">
    <NavBar title="权威资料" />
    <view class="topImg">
      <image
        src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwzl/dd66c533ac8743b98e7a78084a3f0ca2/zlbg.png"
        mode="scaleToFill"
      />
    </view>
    <view class="authMain" :style="{ top: `${navBarHeight + 38}px` }">
      <view class="topInfo">
        <view class="kmList">
          <view
            v-for="(item, i) in vdata.grandList"
            :key="i"
            @tap="subjectChange(item)"
            :class="['kmItem', vdata.subject == item.value && 'kmItemSelect']"
            >{{ item.label }}</view
          >
        </view>
        <view class="rightInfo" @tap="chooseGrand">
          <text>{{ grandeKey[vdata.grade] }}</text>
          <text>·</text>
          <text>{{ vdata.area }}</text>
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwzl/de17a9c32abb426185880e4253a9bf48/arrow.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <scroll-view
        class="scroll-content"
        scroll-y="true"
        :style="{ height: `calc(100vh - ${navBarHeight + 110}px)` }"
        @scrolltolower="lower"
        v-if="vdata.paperList.length"
      >
        <view class="paperList">
          <view
            class="paperItem"
            v-for="(item, i) in vdata.paperList"
            :key="i"
            @tap="toDetail(item)"
            >{{ item.pdfTitle }}</view
          >
        </view>
      </scroll-view>
      <view class="noData" v-else>
        <image
          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/hyzd/acbca4a9b9a7438bbaa498a206f70d9d/noData.png"
          mode="scaleToFill"
        />
        <view>没有找到相关资料</view>
      </view>
    </view>
    <view class="gradePopupMain">
      <nut-popup
        round
        position="bottom"
        closeable
        :close-on-click-overlay="false"
        v-model:visible="vdata.showRound"
      >
        <view>
          <view class="gradePopup">
            <view class="gradeTop">
              <view class="bt">选择年级</view>
              <view class="city" @tap="showCity">
                <text>{{ vdata.area }}</text>
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwzl/de17a9c32abb426185880e4253a9bf48/arrow.png"
                  mode="scaleToFill"
                />
              </view>
            </view>
            <view class="grade">
              <view class="item" v-for="(item, i) in vdata.gradeList" :key="i">
                <view class="gradeTitle">{{ item.title }}</view>
                <nut-radiogroup
                  v-model="vdata.grade"
                  direction="horizontal"
                  @change="(value) => handleChange(value, item, i)"
                >
                  <nut-radio
                    shape="button"
                    :label="key.value"
                    v-for="(key, k) in item.grade"
                    :key="k"
                    >{{ key.text }}</nut-radio
                  >
                </nut-radiogroup>
              </view>
            </view>
          </view>
        </view>
      </nut-popup>

      <nut-popup
        round
        position="bottom"
        closeable
        :style="{ height: '80%' }"
        :close-on-click-overlay="false"
        v-model:visible="vdata.showCity"
      >
        <view class="gradePopup">
          <view class="gradeTop">
            <view class="bt">选择省份</view>
            <view class="city"> 选择省份,更好为您推荐本地试卷 </view>
          </view>
          <view class="cityInfo">
            <view
              :class="['cityItem', item.label == vdata.area && 'citySelect']"
              v-for="(item, i) in areaList"
              :key="i"
              @tap="chooseCity(item)"
            >
              <view>{{ item.label }}</view>
              <image
                v-if="item.label == vdata.area"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/qwzl/db1b457c4b764740abf68262d7470667/select.png"
                mode="scaleToFill"
              />
            </view>
          </view>
        </view>
      </nut-popup>
    </view>
    <member-toast ref="memberToast" @handleFree="handleNavigate"></member-toast>
  </view>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { useSystem, useAuthoritative } from '@/stores'
const system = useSystem()
const authoritative: any = useAuthoritative()
const { navBarHeight } = system.navBarInfo
import { reactive, onMounted, ref } from 'vue'
import { getAuthority, getTryCount, testPaper } from '@/api/index'
import { grandeKey, areaList } from '@/utils/common'
import { useUser } from '@/stores'
import { debounce } from '@/utils/index'
import MemberToast from '@/components/memberToast.vue'
const memberToast = ref()
const user = useUser()
const vdata = reactive({
  directory: true,
  showRound: false,
  showCity: false,
  area: '',
  subject: '',
  grade: '',
  grandList: [
    {
      label: '全部',
      value: '',
    },
    {
      label: '语文',
      value: 1,
    },
    {
      label: '数学',
      value: 2,
    },
    {
      label: '英语',
      value: 3,
    },
  ],
  gradeList: [
    {
      title: '小学',
      grade: [
        {
          text: '一年级',
          value: 1,
        },
        {
          text: '二年级',
          value: 2,
        },
        {
          text: '三年级',
          value: 3,
        },
        {
          text: '四年级',
          value: 4,
        },
        {
          text: '五年级',
          value: 5,
        },
        {
          text: '六年级',
          value: 6,
        },
      ],
    },
    {
      title: '中学',
      grade: [
        {
          text: '七年级',
          value: 7,
        },
        {
          text: '八年级',
          value: 8,
        },
        {
          text: '九年级',
          value: 9,
        },
      ],
    },
    {
      title: '高中',
      grade: [
        {
          text: '高一',
          value: 10,
        },
        {
          text: '高二',
          value: 11,
        },
        {
          text: '高三',
          value: 12,
        },
      ],
    },
  ],
  searchInfo: {
    condition: {
      paperArea: '',
      paperGrade: '',
      paperSubject: '',
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
  total: 0,
  paperList: [],
})
const chooseGrand = () => {
  vdata.showRound = true
}
const toDetail = debounce(async (item) => {
  if (!user.vip) {
    let memberInfo: any = await getTryCount({ funName: '权威资料', funCourseName: null })
    // vdata.termItemInfo = item
    if (memberInfo.vipState == 1) {
      if (memberInfo.tryFlag == 1) {
        if (memberInfo.configCount <= memberInfo.hasTryCount) {
          memberToast.value.showToast(false)
        } else {
          memberToast.value.showToast(true, memberInfo.configCount, memberInfo.hasTryCount, item)
        }
      } else {
        memberToast.value.showToast(false)
      }
    } else {
      handleNavigate(item)
    }
  } else {
    handleNavigate(item)
  }
})
const handleNavigate = async (item) => {
  const parer: any = await testPaper()
  authoritative.setPaperInfo(item)
  Taro.navigateTo({
    url: '../paperDetail/index',
  })
}
//选择年级
const handleChange = (value: any, item: any, i: Number) => {
  const grand = item.grade.filter((v) => v.value === value)
  if (grand && grand.length) {
    vdata.grade = grand[0].value
    vdata.showRound = false
    authoritative.setUseKey('grade', vdata.grade)
    queryList()
  }
}
//显示城市
const showCity = () => {
  vdata.showCity = true
}
//选择城市
const chooseCity = (item) => {
  vdata.showCity = false
  vdata.showRound = false
  authoritative.setUseKey('area', item.label)
  vdata.area = item.label
  queryList()
}
// 学科改变
const subjectChange = (item) => {
  vdata.subject = item.value
  queryList()
}
//重置查询
const queryList = () => {
  vdata.searchInfo.current = 1
  vdata.paperList = []
  getList()
}
const lower = () => {
  if (hasNext()) {
    getList()
  }
}
const hasNext = () => {
  if (vdata.searchInfo.current * vdata.searchInfo.size < vdata.total) {
    vdata.searchInfo.current = vdata.searchInfo.current + 1
    return true
  } else {
    return false
  }
}
//获取列表
const getList = () => {
  let params = JSON.parse(JSON.stringify(vdata.searchInfo))
  params.condition = {
    paperArea: vdata.area,
    paperGrade: vdata.grade,
    paperSubject: vdata.subject,
  }
  getAuthority(params).then((res: any) => {
    if (res) {
      vdata.paperList = vdata.paperList.concat(res.records)
      vdata.total = res.total
    }
  })
}
onMounted(() => {
  vdata.subject = authoritative.useInfo.subject
  vdata.grade = authoritative.useInfo.grade
  vdata.area = authoritative.useInfo.area
})
</script>
<style lang="scss">
.authoritativeMain {
  // background-image: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwzl/dd66c533ac8743b98e7a78084a3f0ca2/zlbg.png');
  // background-repeat: no-repeat;
  // background-size: 100%;
  // background-position: top;
  // box-sizing: border-box;
  // height: 100vh;
  .topImg {
    position: fixed;
    top: 0;
    image {
      height: 143px;
      width: 100vw;
    }
  }
  .authMain {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    border-radius: 16px 16px 0px 0px;
    box-sizing: border-box;
    padding-top: 17px;
    .topInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 18px;
      margin-bottom: 30px;
      .kmList {
        display: flex;
        font-size: 14px;
        align-items: center;
        font-family: PingFangSC-Regular;
        color: #333333;
        .kmItem {
          margin-right: 20px;
        }
        .kmItemSelect {
          position: relative;
          font-size: 18px;
          font-weight: 600;
          font-family: PingFangSC-Semibold;
        }
        .kmItemSelect:after {
          position: absolute;
          content: '';
          width: 24px;
          height: 4px;
          top: 28px;
          left: 50%;
          transform: translate(-50%);
          background: #ffae66;
          display: inline-block;
          border-radius: 2px;
        }
      }
      .rightInfo {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #333333;
        display: flex;
        align-items: center;
        image {
          width: 7px;
          height: 7px;
          margin-left: 3px;
        }
      }
    }
    .scroll-content {
      box-sizing: border-box;
      padding-bottom: 10px;
      .paperList {
        margin: 0 24px;
        .paperItem {
          padding: 23px 16px 13px;
          margin-bottom: 12px;
          background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/zwzl/868ebe074cc5453096b7f27ef2c4fbc2/zlitem.png')
            no-repeat center;
          background-size: 100% 100%;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          line-height: 20px;
          color: #333333;
        }
      }
    }
  }
  .gradePopup {
    height: 100%;
    display: flex;
    flex-direction: column;
    .gradeTop {
      padding: 18px 20px;
      display: flex;
      align-items: center;
      .bt {
        font-family: PingFangSC-Medium;
        font-size: 15px;
        font-weight: 600;
        line-height: 18px;
        color: #333333;
        margin-right: 12px;
      }
      .city {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #333333;
        display: flex;
        align-items: center;
        image {
          width: 8px;
          height: 8px;
          margin-left: 8px;
        }
      }
    }

    .grade {
      padding: 20px 25px;
      .gradeTitle {
        font-family: PingFangSC-Medium;
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 20px;
      }
      .item {
        margin-bottom: 7px;
      }
      .nut-radiogroup--horizontal {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .nut-radio {
          margin-right: 0;
        }
        .nut-radio__button {
          height: 35px;
          background: #f5f5f5;
          font-size: 13px;
          border-radius: 18px;
          color: #333333;
          font-family: PingFangSC-Regular;
          margin-bottom: 15px;
          width: 93px;
          align-items: center;
          justify-content: center;
        }
        .nut-radio__button--active {
          background: #e0eaff;
          border: 0px solid transparent;
          font-size: 13px;
          color: #0256ff;
        }
      }
    }
    .cityInfo {
      padding: 20px 25px;
      flex: 1;
      overflow-y: scroll;
      .cityItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e6e6e6;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #343434;
        padding: 16px 0;
        image {
          width: 18px;
          height: 18px;
        }
      }
      .citySelect {
        color: #2f5de7;
      }
      .cityItem:nth-last-child(1) {
        border: none;
      }
    }
  }
  .gradePopupMain {
    .nut-icon {
      font-weight: 700;
      color: #000;
    }
    .nut-overlay {
      background: rgba(0, 0, 0, 0.3);
    }
  }
  .noData {
    margin-top: 125px;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
    image {
      width: 160px;
      height: 130px;
      margin-bottom: 10px;
    }
  }
}
</style>
