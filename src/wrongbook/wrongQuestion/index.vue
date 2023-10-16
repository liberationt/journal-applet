<template>
  <view class="photographResult" :style="{ paddingTop: `${navBarHeight + 12}px` }">
    <NavBar @vipclick="changeVip" :onClickBack="returnOrClose" :type="vdata.memberType" />
    <view class="topTitle" v-if="vdata.selectBox">已为您自动框选题目，请点击选择，支持多选</view>
    <view v-if="vdata.selectBox" class="photographMain">
      <view class="swiperMain">
        <view class="handelImg" v-if="!vdata.imgList.length">
          <nut-button loading type="warning"></nut-button>
          <view>图片处理中</view>
        </view>

        <swiper
          v-else
          @change="getCurrent"
          class="swiper"
          indicator-color="#999"
          indicator-active-color="#333"
          :circular="false"
          :indicator-dots="false"
          :current="vdata.current - 1"
        >
          <swiper-item v-for="(item, i) in vdata.imgList" :key="i">
            <view class="list-item">
              <image
                :src="vdata.memberType == 2 ? item.removeHandWriteUrl : item.originUrl"
                class="imageContent"
                :mode="computedFixed"
              >
                <view class="mc">
                  <template v-if="item.contentListInfoList && item.contentListInfoList.length">
                    <view
                      class="mc-item"
                      v-for="(bg, key) in item.contentListInfoList"
                      :style="handlePosition(item, bg.point2dXYList)"
                      :key="key"
                    >
                      <view class="bj" @tap="editBox(item, bg.point2dXYList, bg)">编辑</view>
                      <view class="jj" v-show="!bg.isCheck">
                        <image
                          @tap="changeIsCheck(i, key, true)"
                          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/69ddc2a38118419eb6815bb37f6fee70/addPot.png"
                          mode="scaleToFill"
                        />
                      </view>
                      <view class="jy" v-show="bg.isCheck">
                        <image
                          @tap="changeIsCheck(i, key, false)"
                          src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/5fb2d6d087aa44b1b42c405f364610ca/commit.png"
                          mode="scaleToFill"
                        />
                      </view>
                    </view>
                  </template>
                </view>
              </image>
            </view>
          </swiper-item>
        </swiper>
        <view class="current"> {{ vdata.current }}/{{ vdata.imgUrl.length }} </view>
      </view>
    </view>
    <view v-else class="welMain">
      <cropper v-if="phoneType()" @cropdown="cropdown" :cropperOptions="vdata.cropperOptions" />
      <welCropper v-else @cropdown="cropdown" :cropperOptions="vdata.cropperOptions" />
    </view>
    <view class="footer">
      <view v-if="vdata.selectBox" class="kxFooter">
        <view class="kx" @tap="boxSelection">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/e7bc939a21e946a8914a78ed05b41622/kx.png"
            mode="scaleToFill"
          />
          <text>框选错题</text>
        </view>
        <view :class="['saveText', 'blackText']" @tap="bookSubmit">
          <text>{{ getSelectList }}</text>
          保存错题
        </view>
      </view>
      <view v-else class="saveFooter">
        <view class="leftContent" @tap="addAnswer">
          <view class="jj">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/8c002ffc31b744aa8c60cc912b9ab1c6/add.png"
            />
          </view>
          <view class="tj">添加答案</view>
          <view class="xt">(选填)</view>
        </view>
        <view class="del" @tap="removeSelectBox">删除</view>
        <view class="saveSelect" @click="saveSelectBox">保存</view>
      </view>
    </view>
    <view class="answerDetail">
      <nut-popup
        position="bottom"
        round
        :close-on-click-overlay="false"
        v-model:visible="vdata.showAnswer"
      >
        <view>答案</view>
        <view class="close" @tap="closePopup">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/721ebdcae00a48d7892f6b353cc3f762/closeBlack.png"
            mode="scaleToFill"
          />
        </view>
        <view class="answerInfo">
          <view class="anserText" @tap="addShowAnswer">
            <view v-if="vdata.answerText">{{ vdata.answerText }}</view>
            <view v-else style="color: #bababa">请输入参考答案...</view>
          </view>
          <view class="answerBg">
            <view class="answerNo" v-if="!vdata.answerImg" @tap="toAnswerGraph">
              <image
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/ctb/8a6e853a76664bf08c22d248fdc83c6e/add.png"
                mode="scaleToFill"
              />
              <view>拍照添加</view>
            </view>
            <view class="answerImg" v-else @tap="lookAnswerImg">
              <image :src="vdata.answerImg" mode="scaleToFill" />
            </view>
          </view>
        </view>
        <view>
          <nut-button block type="primary" @tap="comfigSubmitAnswer">完成并保存</nut-button>
        </view>
      </nut-popup>
    </view>
    <view class="mcBg" v-if="vdata.showBg">
      <nut-overlay v-model:visible="vdata.showBg" :lock-scroll="true">
        <view class="content" :style="handleStyle">
          <textarea
            class="inputs"
            v-model="vdata.answer"
            :focus="true"
            :border="false"
            @focus="inputBindFocus"
            :show-confirm-bar="false"
            placeholder="输入正确答案"
          />
          <view class="operatBtn">
            <view class="calc" @tap="calc">取消</view>
            <view class="submit" @tap="submitAnswer">确认添加</view>
          </view>
        </view>
      </nut-overlay>
    </view>
    <grade-subjects
      @saveBook="saveBook"
      @closeBook="vdata.saveBook = false"
      v-if="vdata.saveBook"
    />
  </view>
</template>
<script setup lang="ts">
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useSystem } from '@/stores'
import NavBar from '@/components/VipNavBar.vue'
import { reactive, onMounted, computed } from 'vue'
import GradeSubjects from '@/components/GradeSubjects.vue'
import { processImage, saveSegment } from '@/api/wrongbook'
import welCropper from '@/components/welCropper.vue'
import cropper from '@/components/cropper.vue'

import { phoneType, debounce } from '@/utils/index'

const system = useSystem()
const { navBarHeight } = system.navBarInfo
const router: any = useRouter()
const vdata: any = reactive({
  showHandleImg: true,
  saveBook: false,
  selectBox: true,
  showBg: false,
  bottomVal: '310px',
  showBoxSelection: true,
  memberType: 2,
  imgList: [],
  current: 1,
  mainWidth: '',
  mainHeight: '',
  showAnswer: false,
  answerText: '',
  answerImg: '',
  answer: '',
  posId: '',
  imgUrl: [],
  cropperOptions: {
    hidden: true,
    src: '',
    mode: 'rectangle',
    sizeType: ['original'],
    type: false,
  },
  rectInfo: {},
  totalList: [],
})

const handleStyle = computed(() => {
  return {
    bottom: vdata.bottomVal,
  }
})

const handlePosition = (item, list) => {
  if (vdata.mainWidth) {
    // orgWidth原始图片宽度
    // orgHeight原始图片高度
    let left = ((list[0].x / item.orgWidth) * 100).toFixed(2)
    let top = ((list[0].y / item.orgHeight) * 100).toFixed(2)
    let width = (((list[1].x - list[0].x) / item.orgWidth) * 100).toFixed(2)
    let height = (((list[2].y - list[1].y) / item.orgHeight) * 100).toFixed(2)
    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`,
    }
  }
}
const getSelectList = computed(() => {
  // let selectList = vdata.imgList
  let selectList = []
  if (vdata.imgList.length) {
    vdata.imgList.forEach((item) => {
      if (item.contentListInfoList && item.contentListInfoList.length) {
        item.contentListInfoList.forEach((items) => {
          if (items.isCheck) {
            selectList.push(items)
          }
        })
      }
    })
  }

  return selectList.length
})

const computedFixed = computed(() => {
  let str = 'heightFix'
  if (vdata.memberType == 2) {
    let scal =
      vdata.imgList[vdata.current - 1].rhwWidth / vdata.imgList[vdata.current - 1].rhwHeight
    str = scal > 1 ? 'widthFix' : 'heightFix'
  } else {
    let scal =
      vdata.imgList[vdata.current - 1].orgWidth / vdata.imgList[vdata.current - 1].orgHeight
    str = scal > 1 ? 'widthFix' : 'heightFix'
  }
  return str
})
const getCurrent = (e) => {
  vdata.current = e.detail.current + 1
}
const changeVip = (val) => {
  if (!vdata.selectBox) return
  vdata.memberType = val
  if (val == 1) {
    vdata.cropperOptions.src = vdata.imgList[vdata.current - 1].originUrl
  } else {
    vdata.cropperOptions.src = vdata.imgList[vdata.current - 1].removeHandWriteUrl
  }
}
//添加答案
const addAnswer = () => {
  if (Taro.getStorageSync('imageUrl')) {
    Taro.removeStorageSync('imageUrl')
    // vdata.answerImg = ''
  }
  vdata.showAnswer = true
  // vdata.selectBox = true
  vdata.cropperOptions.canvasType = true

  //新增  防止添加是 框选值被默认值代替情况
  let currentWidth = vdata.imgList[vdata.current - 1].orgWidth
  let currentHeight = vdata.imgList[vdata.current - 1].orgHeight

  let point2dXYList = [
    {
      x: (vdata.rectInfo.x / vdata.rectInfo.baseWidth) * currentWidth,
      y: (vdata.rectInfo.y / vdata.rectInfo.baseHeight) * currentHeight,
    },
    {
      x: ((vdata.rectInfo.x + vdata.rectInfo.width) / vdata.rectInfo.baseWidth) * currentWidth,
      y: (vdata.rectInfo.y / vdata.rectInfo.baseHeight) * currentHeight,
    },
    {
      x: ((vdata.rectInfo.x + vdata.rectInfo.width) / vdata.rectInfo.baseWidth) * currentWidth,
      y: ((vdata.rectInfo.y + vdata.rectInfo.height) / vdata.rectInfo.baseHeight) * currentHeight,
    },
    {
      x: (vdata.rectInfo.x / vdata.rectInfo.baseWidth) * currentWidth,
      y: ((vdata.rectInfo.y + vdata.rectInfo.height) / vdata.rectInfo.baseHeight) * currentHeight,
    },
  ]

  let editImgInfo = {
    originalImgUrl:
      vdata.memberType == 1
        ? vdata.imgList[vdata.current - 1].originUrl
        : vdata.imgList[vdata.current - 1].removeHandWriteUrl,
    posLeftTopX: point2dXYList[0].x / currentWidth,
    posLeftTopY: point2dXYList[0].y / currentHeight,
    posRightBottomX: point2dXYList[2].x / currentWidth,
    posRightBottomY: point2dXYList[2].y / currentHeight,
  }
  vdata.cropperOptions.editImgInfo = editImgInfo
}
const closePopup = () => {
  vdata.showAnswer = false
  vdata.cropperOptions.canvasType = false
}
//显示添加答案
const addShowAnswer = () => {
  vdata.showBg = true
  vdata.showAnswer = false
  vdata.answer = vdata.answerText
  // vdata.answer = item.answerContent
  // vdata.exerciseBookId = item.exerciseBookId
  // vdata.answerUrl = item.answerImageUrl
}
//键盘抬起时间
const inputBindFocus = (e) => {
  // 获取手机键盘的高度，赋值给input 所在盒子的 bottom 值
  // 注意!!! 这里的 px 至关重要!!! 我搜到的很多解决方案都没有说这里要添加 px
  vdata.bottomVal = e.detail.height + 'px'
}
//确认添加
const submitAnswer = () => {
  vdata.answerText = vdata.answer
  vdata.showBg = false
  vdata.showAnswer = true
}
//取消
const calc = () => {
  vdata.showAnswer = true
  vdata.showBg = false
}
//去拍照
const toAnswerGraph = () => {
  Taro.navigateTo({
    url: '../answerGraph/index',
  })
}
//查看图片
const lookAnswerImg = () => [
  Taro.navigateTo({
    url: `../answer/index?imgUrl=${vdata.answerImg}`,
  }),
]
//确认添加答案框
const comfigSubmitAnswer = () => {
  //新增  防止添加是 框选值被默认值代替情况
  let currentWidth = vdata.imgList[vdata.current - 1].orgWidth
  let currentHeight = vdata.imgList[vdata.current - 1].orgHeight

  let point2dXYList = [
    {
      x: (vdata.rectInfo.x / vdata.rectInfo.baseWidth) * currentWidth,
      y: (vdata.rectInfo.y / vdata.rectInfo.baseHeight) * currentHeight,
    },
    {
      x: ((vdata.rectInfo.x + vdata.rectInfo.width) / vdata.rectInfo.baseWidth) * currentWidth,
      y: (vdata.rectInfo.y / vdata.rectInfo.baseHeight) * currentHeight,
    },
    {
      x: ((vdata.rectInfo.x + vdata.rectInfo.width) / vdata.rectInfo.baseWidth) * currentWidth,
      y: ((vdata.rectInfo.y + vdata.rectInfo.height) / vdata.rectInfo.baseHeight) * currentHeight,
    },
    {
      x: (vdata.rectInfo.x / vdata.rectInfo.baseWidth) * currentWidth,
      y: ((vdata.rectInfo.y + vdata.rectInfo.height) / vdata.rectInfo.baseHeight) * currentHeight,
    },
  ]
  //上面很重要
  let index = vdata.imgList[vdata.current - 1].contentListInfoList.findIndex(
    (item) => item.posId === vdata.posId
  )
  if (index > -1) {
    vdata.imgList[vdata.current - 1].contentListInfoList[index].answerInfoDto.answerContent =
      vdata.answerText
    vdata.imgList[vdata.current - 1].contentListInfoList[index].answerInfoDto.answerImageUrl =
      vdata.answerImg
    vdata.imgList[vdata.current - 1].contentListInfoList[index].isCheck = true
    vdata.imgList[vdata.current - 1].contentListInfoList[index].type = vdata.memberType == 2 ? 1 : 0

    vdata.imgList[vdata.current - 1].contentListInfoList[
      vdata.imgList[vdata.current - 1].contentListInfoList.length - 1
    ].point2dXYList = point2dXYList
  } else {
    vdata.imgList[vdata.current - 1].contentListInfoList[
      vdata.imgList[vdata.current - 1].contentListInfoList.length - 1
    ].answerInfoDto.answerContent = vdata.answerText
    vdata.imgList[vdata.current - 1].contentListInfoList[
      vdata.imgList[vdata.current - 1].contentListInfoList.length - 1
    ].answerInfoDto.answerImageUrl = vdata.answerImg
    vdata.imgList[vdata.current - 1].contentListInfoList[
      vdata.imgList[vdata.current - 1].contentListInfoList.length - 1
    ].isCheck = true
    vdata.imgList[vdata.current - 1].contentListInfoList[
      vdata.imgList[vdata.current - 1].contentListInfoList.length - 1
    ].type = vdata.memberType == 2 ? 1 : 0

    vdata.imgList[vdata.current - 1].contentListInfoList[
      vdata.imgList[vdata.current - 1].contentListInfoList.length - 1
    ].point2dXYList = point2dXYList
  }
  vdata.showAnswer = false
  vdata.selectBox = true

  // let editImgInfo = {
  //   originalImgUrl:
  //     vdata.memberType == 1
  //       ? vdata.imgList[vdata.current - 1].originUrl
  //       : vdata.imgList[vdata.current - 1].removeHandWriteUrl,
  //   posLeftTopX: point2dXYList[0].x / currentWidth,
  //   posLeftTopY: point2dXYList[0].y / currentHeight,
  //   posRightBottomX: point2dXYList[2].x / currentWidth,
  //   posRightBottomY: point2dXYList[2].y / currentHeight,
  // }
  // vdata.cropperOptions.editImgInfo = editImgInfo

  // console.log(vdata.cropperOptions.editImgInfo, editImgInfo, 123123, vdata.rectInfo)
  // vdata.cropperOptions.canvasType = false
}
//获取裁剪图片
const cropdown = ({ res }) => {
  if (res?.rectInfo) {
    vdata.rectInfo = res.rectInfo
    console.log(vdata.rectInfo, 'vvvvv')
  }
}
//点击框选错题 此时往数组里面push  不然无法添加答案
const boxSelection = () => {
  const cropperOptions = Object.assign(
    {
      hidden: true,
      src: '',
      mode: 'rectangle',
      sizeType: ['original'],
    },
    {
      boxQuestionHeight: vdata.mainHeight + 40,
      boxQuestionTop: 0,
      canvasType: false,
      src:
        vdata.memberType == 1
          ? vdata.imgList[vdata.current - 1].originUrl
          : vdata.imgList[vdata.current - 1].removeHandWriteUrl,
      type: vdata.memberType == 2 ? true : false,
    }
  )
  vdata.cropperOptions = cropperOptions
  setTimeout(() => {
    let currentWidth = vdata.imgList[vdata.current - 1].orgWidth
    let currentHeight = vdata.imgList[vdata.current - 1].orgHeight
    let point2dXYList = [
      {
        x: (vdata.rectInfo.x / vdata.rectInfo.baseWidth) * currentWidth,
        y: (vdata.rectInfo.y / vdata.rectInfo.baseHeight) * currentHeight,
      },
      {
        x: ((vdata.rectInfo.x + vdata.rectInfo.width) / vdata.rectInfo.baseWidth) * currentWidth,
        y: (vdata.rectInfo.y / vdata.rectInfo.baseHeight) * currentHeight,
      },
      {
        x: ((vdata.rectInfo.x + vdata.rectInfo.width) / vdata.rectInfo.baseWidth) * currentWidth,
        y: ((vdata.rectInfo.y + vdata.rectInfo.height) / vdata.rectInfo.baseHeight) * currentHeight,
      },
      {
        x: (vdata.rectInfo.x / vdata.rectInfo.baseWidth) * currentWidth,
        y: ((vdata.rectInfo.y + vdata.rectInfo.height) / vdata.rectInfo.baseHeight) * currentHeight,
      },
    ]
    let params = {
      isCheck: true,
      point2dXYList: point2dXYList,
      posId: vdata.totalList[vdata.current - 1] + 1,
      answerInfoDto: {
        answerContent: '',
        answerImageUrl: '',
        posId: vdata.totalList[vdata.current - 1] + 1,
      },
    }
    vdata.totalList[vdata.current - 1] = vdata.totalList[vdata.current - 1]++
    vdata.imgList[vdata.current - 1].contentListInfoList.push(params)
  }, 1500)
  vdata.selectBox = false
}
//保存框选错题
const saveSelectBox = () => {
  let currentWidth = vdata.imgList[vdata.current - 1].orgWidth
  let currentHeight = vdata.imgList[vdata.current - 1].orgHeight

  let point2dXYList = [
    {
      x: (vdata.rectInfo.x / vdata.rectInfo.baseWidth) * currentWidth,
      y: (vdata.rectInfo.y / vdata.rectInfo.baseHeight) * currentHeight,
    },
    {
      x: ((vdata.rectInfo.x + vdata.rectInfo.width) / vdata.rectInfo.baseWidth) * currentWidth,
      y: (vdata.rectInfo.y / vdata.rectInfo.baseHeight) * currentHeight,
    },
    {
      x: ((vdata.rectInfo.x + vdata.rectInfo.width) / vdata.rectInfo.baseWidth) * currentWidth,
      y: ((vdata.rectInfo.y + vdata.rectInfo.height) / vdata.rectInfo.baseHeight) * currentHeight,
    },
    {
      x: (vdata.rectInfo.x / vdata.rectInfo.baseWidth) * currentWidth,
      y: ((vdata.rectInfo.y + vdata.rectInfo.height) / vdata.rectInfo.baseHeight) * currentHeight,
    },
  ]
  let index = vdata.imgList[vdata.current - 1].contentListInfoList.findIndex(
    (item) => item.posId === vdata.posId
  )
  if (index > -1) {
    vdata.imgList[vdata.current - 1].contentListInfoList[index].isCheck = true
    vdata.imgList[vdata.current - 1].contentListInfoList[index].type = vdata.memberType == 2 ? 1 : 0

    vdata.imgList[vdata.current - 1].contentListInfoList[index].point2dXYList = point2dXYList
  } else {
    vdata.imgList[vdata.current - 1].contentListInfoList[
      vdata.imgList[vdata.current - 1].contentListInfoList.length - 1
    ].isCheck = true
    vdata.imgList[vdata.current - 1].contentListInfoList[
      vdata.imgList[vdata.current - 1].contentListInfoList.length - 1
    ].point2dXYList = point2dXYList
    vdata.imgList[vdata.current - 1].contentListInfoList[
      vdata.imgList[vdata.current - 1].contentListInfoList.length - 1
    ].type = vdata.memberType == 2 ? 1 : 0
  }
  vdata.selectBox = true
}
//编辑框选
const editBox = (item, list, bg) => {
  vdata.selectBox = false
  vdata.posId = bg.posId
  vdata.answerText = bg.answerInfoDto.answerContent
  vdata.answerImg = bg.answerInfoDto.answerImageUrl
  let editImgInfo = {
    originalImgUrl: vdata.memberType == 1 ? item.originUrl : item.removeHandWriteUrl,
    posLeftTopX: list[0].x / item.width,
    posLeftTopY: list[0].y / item.height,
    posRightBottomX: list[2].x / item.width,
    posRightBottomY: list[2].y / item.height,
  }
  const cropperOptions = Object.assign(
    { hidden: true, src: '', mode: 'rectangle', sizeType: ['original'] },
    {
      boxQuestionHeight: vdata.mainHeight + 40,
      boxQuestionTop: 0,
      canvasType: false,
      src:
        vdata.memberType == 1
          ? vdata.imgList[vdata.current - 1].originUrl
          : vdata.imgList[vdata.current - 1].removeHandWriteUrl,
      type: vdata.memberType == 2 ? true : false,
    }
  )
  cropperOptions.editImgInfo = editImgInfo
  vdata.cropperOptions = cropperOptions
}
//删除框选错题
const removeSelectBox = () => {
  let index = vdata.imgList[vdata.current - 1].contentListInfoList.findIndex(
    (item) => item.posId === vdata.posId
  )
  if (index > -1) {
    vdata.imgList[vdata.current - 1].contentListInfoList.splice(index, 1)
  } else {
    vdata.imgList[vdata.current - 1].contentListInfoList.splice(
      vdata.imgList[vdata.current - 1].contentListInfoList.length - 1,
      1
    )
  }
  vdata.selectBox = true
}
const changeIsCheck = (i, key, flag) => {
  vdata.imgList[i].contentListInfoList[key].isCheck = flag
  vdata.imgList[i].contentListInfoList[key].type = vdata.memberType == 2 ? 1 : 0
}
//保存错题
const saveBook = debounce((val, text, tagList) => {
  let selectList = []
  vdata.imgList.forEach((item) => {
    let itemObject: any = {
      imageUrl: '',
      contentListInfoList: [],
      answerInfoDtoList: [],
      width: item.width,
      height: item.height,
      rmhHeight: item.rhwHeight,
      rmhWidth: item.rhwWidth,
    }
    // if (vdata.memberType == 1) {
    itemObject.imageUrl = item.originUrl
    // } else {
    itemObject.rmhImageUrl = item.removeHandWriteUrl
    // }
    item.contentListInfoList.forEach((items) => {
      if (items.isCheck) {
        itemObject.contentListInfoList.push(items)
      }
      if (items.answerInfoDto.answerContent || items.answerInfoDto.answerImageUrl) {
        itemObject.answerInfoDtoList.push(items.answerInfoDto)
      }
    })
    selectList.push(itemObject)
  })
  let params = {
    saveSegmentPhotoRequestList: selectList,
    course: val[1],
    grade: val[0],
    term: val[2],
    tagIdList: tagList,
    // imageUrl: imageUrl[0],
  }
  saveSegment(params).then((res: any) => {
    Taro.redirectTo({
      url: `/wrongbook/success/index?grand=${val[1]}&branch=${val[0]}&term=${val[2]}`,
    })
  })
})
//处理图片
const handelImage = () => {
  let params = {
    imageUrl: vdata.imgUrl,
    courseType: Taro.getStorageSync('courseType'),
  }
  processImage(params).then((res: any) => {
    vdata.showHandleImg = false
    if (res) {
      res.forEach((item: any, i) => {
        vdata.totalList[i] =
          item.contentListInfoList && item.contentListInfoList.length
            ? item.contentListInfoList.length
            : 0
        if (item.contentListInfoList && item.contentListInfoList.length) {
          item.contentListInfoList.forEach((key) => {
            key.answerInfoDto = {
              answerContent: '',
              answerImageUrl: '',
              posId: key.posId,
            }
          })
        } else {
          item.contentListInfoList = []
        }
      })
      vdata.imgList = res
    }
  })
}
//保存错题弹框
const bookSubmit = debounce(() => {
  if (getSelectList.value > 0) {
    vdata.saveBook = true
  } else {
    Taro.showToast({
      title: '请选择错题',
      icon: 'none',
      duration: 2000,
    })
  }
})
//关闭
const returnOrClose = () => {
  if (vdata.selectBox) {
    Taro.navigateBack({ delta: 1 })
  } else {
    let index = vdata.imgList[vdata.current - 1].contentListInfoList.findIndex(
      (item) => item.posId === vdata.posId
    )
    if (index == -1) {
      vdata.imgList[vdata.current - 1].contentListInfoList.splice(
        vdata.imgList[vdata.current - 1].contentListInfoList.length - 1,
        1
      )
    }
    vdata.selectBox = true
  }
}
useDidShow(() => {
  if (Taro.getStorageSync('imageUrl')) {
    vdata.answerImg = Taro.getStorageSync('imageUrl')
  }
})
onMounted(() => {
  // vdata.imgUrl = router.params.imgUrl.split(',')
  vdata.imgUrl = Taro.getStorageSync('photoImgList')
  handelImage()
  let timer = setInterval(() => {
    Taro.createSelectorQuery()
      .select('.list-item')
      .boundingClientRect((rec) => {
        if (rec) {
          vdata.mainWidth = rec.width
          vdata.mainHeight = rec.height
          clearInterval(timer)
        }
      })
      .exec()
  }, 1000)
})
</script>
<style lang="scss">
.photographResult {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 115px;
}
.photographMain {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.welMain {
  flex: 1;
  position: relative;
}
.swiperMain {
  flex: 1;
  background: #f8f8f8;
  position: relative;
  box-sizing: border-box;
  // padding: 20px 20px 0;
  // padding-top: 20px;
  display: flex;
  flex-direction: column;
  .swiper {
    // height: 100%;
    flex: 1;
    .list-item {
      // padding: 0 20px;
      height: 100%;
      box-sizing: border-box;
      .imageContent {
        width: 100%;
        position: relative;
        height: 100%;
        left: 50%;
        transform: translateX(-50%);
      }
      .mc {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        top: 0;
        overflow: hidden;
        // background: rgba(0, 0, 0, 0.1);
        .mc-item {
          position: absolute;
          left: 0;
          top: 0;
          border: 1px solid #2f5de7;
          box-sizing: border-box;
          background: rgba(47, 93, 230, 0.1);
          .bj {
            position: absolute;
            right: 0;
            width: 32px;
            height: 19px;
            font-size: 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 0 0 0 10px;
            text-align: center;
            line-height: 19px;
            color: #fff;
            z-index: 100;
          }
          .jj,
          .jy {
            width: 24px;
            height: 24px;
            line-height: 10px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;
            image {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
  }
  .current {
    text-align: center;
    height: 50px;
    line-height: 40px;
  }
  .handelImg {
    width: 100%;
    height: 100%;
    background: #333;
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 14px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
    .nut-button--warning {
      background: #333;
    }
  }
}
.topTitle {
  height: 40px;
  font-family: PingFang SC;
  font-size: 13px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  background: #eff3ff;
  color: #333333;
  line-height: 40px;
  padding-left: 14px;
  position: relative;
  z-index: 10;
}
.footer {
  position: fixed;
  bottom: 0;
  height: 115px;
  z-index: 10;
  background: #fff;
  width: 100%;
  .kxFooter {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 22px;
    padding-right: 26px;
    box-sizing: border-box;
    .kx {
      width: 145px;
      height: 40px;
      background: #2f5de7;
      border-radius: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #fff;
      margin-right: 25px;

      image {
        width: 14px;
        height: 14px;
        margin-right: 5px;
      }
    }
    .saveText {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #cbcbcb;
      position: relative;
      text {
        width: 14px;
        height: 14px;
        background: #ff4040;
        border-radius: 50%;
        font-size: 12px;
        text-align: center;
        line-height: 14px;
        position: absolute;
        top: -10px;
        right: -10px;
        color: #fff;
      }
    }
    .blackText {
      color: #333;
    }
  }
  .saveFooter {
    display: flex;
    font-family: PingFangSC-Regular;
    justify-content: space-between;
    font-size: 16px;
    box-sizing: border-box;
    padding: 20px 15px 0 15px;
    .leftContent {
      display: flex;
      align-items: center;
      justify-content: center;
      .jj {
        width: 15px;
        height: 15px;
        flex-shrink: 0;
        image {
          width: 15px;
          height: 15px;
        }
      }
      .tj {
        margin: 0 5px;
      }
      .xt {
        font-size: 12px;
        color: #999999;
      }
    }
    .saveSelect,
    .del {
      width: 95px;
      height: 40px;
      border-radius: 25px;
      text-align: center;
      line-height: 40px;
    }
    .del {
      box-sizing: border-box;
      border: 1px solid #c8c8c8;
    }
    .saveSelect {
      background: #2f5de7;
      color: #fff;
    }
  }
}
.answerDetail {
  .nut-popup {
    padding: 10px 15px 36px;
    .nut-icon {
      position: absolute;
      color: #333;
      right: 0;
    }
  }
  .close {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 10px;
    right: 10px;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .answerInfo {
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 85px;
    .anserText {
      background: #ececec;
      height: 85px !important;
      padding: 4px 9px;
      box-sizing: border-box;
      overflow-y: scroll;
      flex: 1;
    }
    // .nut-textarea {
    //   padding: 0;
    // }
    // .nut-textarea__textarea {
    //   background: #ececec;
    //   height: 85px !important;
    //   padding: 4px 9px;
    //   box-sizing: border-box;
    // }
    .answerBg {
      width: 110px;
      height: 85px;
      box-sizing: border-box;
      border: 1px solid #eeeeee;
      flex-shrink: 0;
      margin-left: 15px;
      .answerNo {
        display: flex;
        height: 100%;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        font-weight: normal;
        image {
          width: 23px;
          height: 23px;
          margin-bottom: 5px;
        }
      }
      .answerImg {
        image {
          width: 110px;
          height: 85px;
        }
      }
    }
  }
}
.mcBg {
  height: 100%;
  .content {
    background: #fff;
    position: absolute;
    right: 0;
    left: 0;
    padding: 10px 14px;
  }
  .inputs {
    height: 100px;
  }
  .operatBtn {
    display: flex;
    justify-content: flex-end;
    view {
      width: 75px;
      font-size: 12px;
      height: 28px;
      line-height: 28px;
      font-family: PingFangSC-Regular;
      border-radius: 25px;
      text-align: center;
    }
    .calc {
      border: 0.5px solid #c8c8c8;
      background: #fff;
      margin-right: 15px;
    }
    .submit {
      background: #2f5de7;
      color: #fff;
    }
  }
}
</style>
