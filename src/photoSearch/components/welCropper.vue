<!--components/welCropper.wxml-->
<template>
  <scroll-view :class="['cropper_main_container', data.cropperData.hidden ? 'hidden' : '']">
    <view
      class="cropper_container"
      :style="{
        width: data.cropperData.W + 'px',
        height: data.cropperData.H - 100 + 'px',
        maxHeight: data.cropperData.H - 100 + 'px',
      }"
    >
      <canvas
        class="original_canvas"
        canvas-id="originalCanvas"
        :style="{
          width: data.changableData.originalSize.width + 'px',
          height: data.changableData.originalSize.height + 'px',
        }"
      ></canvas>

      <image
        :src="data.cropperData.imageInfo.path"
        class="scale-image cropper_canvas_container_item"
        mode="scaleToFill"
        :style="{
          left: data.changableData.previewImageInfo.x + 'px',
          top: data.changableData.previewImageInfo.y + 'px',
          width: data.changableData.previewImageInfo.w - 40 + 'px',
          height: data.changableData.previewImageInfo.h - 100 + 'px',
          maxHeight: data.changableData.previewImageInfo.h - 100 + 'px',
          marginLeft: 20 + 'px',
          // transform: `rotate(${data.changableData.rotateDegree}deg)`,
        }"
      ></image>
      <!-- transform:rotate() -->
      <view
        :class="['cropper_canvas_container', data.cropperData.canvasType ? 'isOpacity' : '']"
        :style="{
          width: data.changableData.scaleSize.width - 40 + 'px',
          height: data.changableData.scaleSize.height - 100 + 'px',
          maxHeight: data.changableData.scaleSize.height - 100 + 'px',
        }"
      >
        <canvas
          :type="data.cropperData.canvasType || ''"
          canvas-id="moveCanvas"
          class="move_canvas cropper_canvas_container_item"
        ></canvas>

        <template v-if="data.cropperData.drawSign == 1">
          <movable-area
            class="cropper_movable_area_container"
            :style="{
              width: data.changableData.scaleSize.width + 'px',
              height: data.changableData.scaleSize.height + 'px',
            }"
          >
            <template v-if="data.moveItems">
              <template v-for="(item, i) in data.moveItems" :key="i">
                <movable-view
                  class="move_item"
                  :style="{
                    width: data.cropperData.itemLength + 'px',
                    height: data.cropperData.itemLength + 'px',
                  }"
                  direction="all"
                  :x="item.x - data.cropperData.itemLength / 2"
                  :y="item.y - data.cropperData.itemLength / 2"
                  @touchmove="moveEvent"
                  @touchend="endEvent"
                  @touchcancel="touchcancelEvent"
                  :data-key="i"
                ></movable-view>
              </template>
            </template>
          </movable-area>
        </template>
        <template v-else>
          <movable-area
            class="cropper_movable_area_container"
            :style="{
              width: data.changableData.scaleSize.width + 'px',
              height: data.changableData.scaleSize.height + 'px',
            }"
          >
            <template v-if="data.moveItems">
              <template v-for="(item, i) in data.moveItems" :key="i">
                <movable-view
                  class="move_item"
                  style="width:{{data.cropperData.itemLength}}px; height:{{data.cropperData.itemLength}}px;"
                  direction="all"
                  :x="item.x - data.cropperData.itemLength / 2"
                  :y="item.y - data.cropperData.itemLength / 2"
                  @touchmove="moveEvent"
                  @touchend="endEvent"
                  @touchcancel="touchcancelEvent"
                  data-key="{{index}}"
                ></movable-view>
              </template>
            </template>
          </movable-area>
        </template>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { reactive, watch, defineProps, onMounted, defineEmits } from 'vue'
import Taro from '@tarojs/taro'
const props = defineProps({
  cropperOptions: {},
})
const emit = defineEmits('cropdown')
// const cropperData: any = reactive({
//   hidden: true,
//   src: '',
//   mode: 'rectangle',
//   sizeType: ['original'],
// })

const data: any = reactive({
  deg: 0,
  ready: false,
  cropperData: {
    drawSign: 0,
    hidden: true,
    left: 0,
    top: 0,
    width: 0, // W,
    height: 0, // H,
    W: 0, // W,
    H: 100, // H,
    itemLength: 50,
    imageInfo: {
      path: '',
      width: 0,
      height: 0,
    },
    scaleInfo: {
      x: 1,
      y: 1,
    },
    cropCallback: null,
    sizeType: ['original', 'compressed'], //'original'(default) | 'compressed'
    original: false, // 默认压缩，压缩比例为截图的0.4
    mode: 'rectangle', //默认矩形
  },
  moveItems: {
    topleft: {
      x: 50,
      y: 50,
    },
    topright: {
      x: 50, // W - 50,
      y: 50,
    },
    bottomleft: {
      x: 50,
      y: 50, // H - 50
    },
    bottomright: {
      x: 50, // W - 50,
      y: 50, // H - 50
    },
  },
  changableData: {
    canCrop: true,
    shapeEnable: false,
    rotateDegree: 0,
    originalSize: {
      width: 0,
      height: 0,
    },
    scaleSize: {
      width: 0,
      height: 0,
    },
    shape: {
      x: 1.0,
      y: 1.0,
    },
    previewImageInfo: {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    },
  },
})
watch(
  () => props.cropperOptions,
  (newVal: any) => {
    console.log(newVal, 'newVal')
    if (data.ready) {
      showCropper({
        src: newVal.src,
        mode: newVal.mode,
        sizeType: newVal.sizeType, //'original'(default) | 'compressed'
        callback: function (res) {
          cropDone(res)
        },
      })
    }
  },
  {
    deep: true,
  }
)
onMounted(() => {
  const device = Taro.getSystemInfoSync()

  const { boxQuestionHeight = '' } = props.cropperOptions
  const bottomHeight = (192 * device.screenWidth) / 750
  const W = device.windowWidth
  const H = boxQuestionHeight ? boxQuestionHeight : device.windowHeight - bottomHeight
  data.W = W
  data.H = H
  const { cropperData, moveItems } = data
  data.cropperData = Object.assign(cropperData, {
    width: W,
    height: H,
    W: W,
    H: H,
  })
  data.moveItems = Object.assign(moveItems, {
    topright: { x: 50, y: H - 50 },
    bottomleft: { x: 50, y: H - 50 },
    bottomright: { x: W - 50, y: H - 50 },
  })
  setTimeout(() => {
    data.ready = true
    const { src, mode, sizeType } = props.cropperOptions
    showCropper({
      src,
      mode,
      sizeType,
      callback: (res) => cropDone(res),
    })
  }, 100)
})
//  旋转
const getRevolve = () => {
  // data.deg += 90
  // data.changableData.previewImageInfo.w = 404
  // data.changableData.previewImageInfo.h = 535
  // data.changableData.rotateDegree = data.deg
  // width: data.changableData.previewImageInfo.w - 40 + 'px',
  // height: data.changableData.previewImageInfo.h + 'px',
}

// 获取选中区域的(x, y, w, h)
const getCropRect = (cropperMovableItems) => {
  let maxX = 0,
    maxY = 0
  for (let key in cropperMovableItems) {
    let item = cropperMovableItems[key]
    maxX = Math.max(item.x, maxX)
    maxY = Math.max(item.y, maxY)
  }

  let minX = maxX,
    minY = maxY
  for (let key in cropperMovableItems) {
    let item = cropperMovableItems[key]
    minX = Math.min(item.x, minX)
    minY = Math.min(item.y, minY)
  }

  return {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY,
  }
}
function cropDone(res) {
  var myEventDetail = {
    res: res,
  } // detail对象，提供给事件监听函数
  // var myEventOption = {} // 触发事件的选项
  emit('cropdown', myEventDetail)
}
// 显示cropper，如果有图片则载入
function showCropper(options) {
  let cropperData = data.cropperData
  cropperData.canvasType = props.cropperOptions.canvasType || ''
  let { src, callback, sizeType, mode } = options

  let filterType = []
  if (sizeType.indexOf('original') > -1) {
    filterType.push('original')
  }
  if (sizeType.indexOf('compressed') > -1) {
    filterType.push('compressed')
  }
  if (filterType.length == 1 && filterType.indexOf('original') > -1) {
    cropperData.original = true
  }

  if (mode) {
    cropperData.mode = mode
  }
  cropperData.hidden = false
  cropperData.hash = Math.random()
  cropperData.cropCallback = callback
  cropperData.sizeType = filterType

  if (src) {
    Taro.getImageInfo({
      src: src,
      success: function (res) {
        var w = res.width,
          h = res.height

        cropperData.imageInfo = {
          path: res.path,
          width: w,
          height: h,
        }
        data.cropperData = cropperData
        data.moveItems = {
          topleft: {
            x: 0,
            y: 0,
          },
          topright: {
            x: 0,
            y: 0,
          },
          bottomleft: {
            x: 0,
            y: 0,
          },
          bottomright: {
            x: 0,
            y: 0,
          },
        }
        // setTimeout(() => {
        //   loadImage(res.path, w, h, false)
        // }, 100)
        loadImage(res.path, w, h, false)
      },
    })
  }
}

// 截取选中图片，如果有回调，则调用
function cropImage() {
  let z = this
  let cropperData = data.cropperData
  let mode = cropperData.mode
  let scaleInfo = cropperData.scaleInfo
  let width = cropperData.width
  let height = cropperData.height

  let moveItems = data.moveItems
  // let moveItems = Object.values(z.data.moveItems)

  if (mode == 'rectangle') {
    let maxX = 0,
      maxY = 0
    for (let key in moveItems) {
      let item = moveItems[key]

      maxX = Math.max(item.x, maxX)
      maxY = Math.max(item.y, maxY)
    }

    let minX = maxX,
      minY = maxY
    for (let key in moveItems) {
      let item = moveItems[key]

      minX = Math.min(item.x, minX)
      minY = Math.min(item.y, minY)
    }

    const _w = maxX - minX,
      _h = maxY - minY
    let w = _w * scaleInfo.x,
      h = _h * scaleInfo.y

    let x = minX * scaleInfo.x,
      y = minY * scaleInfo.y

    let tempCount = 0
    function getTempFile(args, callback) {
      if (tempCount > 10) return
      tempCount++
      Taro.canvasToTempFilePath(
        {
          ...args,
          success: function (res) {
            let { tempFilePath } = res
            console.log(tempFilePath, 'tempFilePath=========386')
            if (data.cropperData.cropCallback) {
              data.cropperData.cropCallback({
                tempFilePath,
                originFilePath: props.cropperOptions.src,
                rectInfo: {
                  // 以图片展示的宽度为基准的数据
                  baseWidth: width,
                  baseHeight: height,
                  x: minX,
                  y: minY,
                  width: maxX - minX,
                  height: maxY - minY,
                },
              })
            }
          },
          fail(res) {
            setTimeout(() => {
              getTempFile(args, callback)
            }, 100)
          },
        },
        z
      )
    }

    const getFileArgs = {
      x: x,
      y: y,
      width: w,
      height: h,
      destWidth: w,
      destHeight: h,
      canvasId: 'originalCanvas',
    }
    getTempFile(getFileArgs)
  } else {
    let res = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ]
    let points = []
    for (let key in moveItems) {
      let x = Math.ceil(moveItems[key].x * scaleInfo.x)
      let y = Math.ceil(moveItems[key].y * scaleInfo.y)

      let index = 0
      if (key == 'topleft') {
        index = 0
      } else if (key == 'bottomleft') {
        index = 1
      } else if (key == 'bottomright') {
        index = 2
      } else if (key == 'topright') {
        index = 3
      }
      res[index] = [x, y]

      points.push({
        x,
        y,
      })
    }
    convexHull(points, points.length)

    if (data.cropperData.cropCallback) {
      data.cropperData.cropCallback(res)
    }
  }
}

// 根据图片大小设置canvas大小，并绘制图片
function loadImage(src, width, height, isRotate) {
  let size = getAdjustSize(data.W, data.H, width, height)
  const { boxQuestionTop = 0, editImgInfo, isMax = 50 } = props.cropperOptions
  // 适应屏幕的位置
  let left = (data.W - size.width) / 2
  let top = (data.H - size.height) / 2 + boxQuestionTop
  // 默认切图框离四边的距离 isMax
  // set data
  let updateData = {}
  let cropperData = data.cropperData
  cropperData.drawSign = !cropperData.drawSign
  if (!isRotate) {
    cropperData.imageInfo = {
      path: src,
      width: width,
      height: height,
    }
  }
  cropperData.left = left
  cropperData.top = top
  cropperData.width = size.width
  cropperData.height = size.height

  let compressedScale = data.cropperData.original ? 1.0 : 0.4
  // let scaleSize = cropperUtil.getAdjustSize(W, H, width, height)

  cropperData.scaleInfo = {
    x: (width * compressedScale) / (size.width - 40),
    y: (height * compressedScale) / (size.height - 100),
  }

  updateData.cropperData = cropperData

  // 数值回填
  if (editImgInfo?.originalImgUrl && editImgInfo?.posLeftTopX) {
    updateData.moveItems = {
      topleft: {
        x: (editImgInfo?.posLeftTopX * size.width).toFixed(0) || 10,
        y: (editImgInfo.posLeftTopY * size.height).toFixed(0) || 10,
      },
      topright: {
        x: (editImgInfo?.posRightBottomX * size.width).toFixed(0) || 20,
        y: (editImgInfo?.posLeftTopY * size.height).toFixed(0) || 10,
      },
      bottomleft: {
        x: (editImgInfo?.posLeftTopX * size.width).toFixed(0) || 10,
        y: (editImgInfo.posRightBottomY * size.height).toFixed(0) || 20,
      },
      bottomright: {
        x: (editImgInfo?.posRightBottomX * size.width).toFixed(0) || 20,
        y: (editImgInfo?.posRightBottomY * size.height).toFixed(0) || 20,
      },
    }
  } else {
    updateData.moveItems = {
      topleft: {
        x: isMax,
        y: isMax,
      },
      topright: {
        x: size.width - isMax - 40,
        y: isMax,
      },
      bottomleft: {
        x: isMax,
        y: size.height - 100 - isMax,
      },
      bottomright: {
        x: size.width - isMax - 40,
        y: size.height - 100 - isMax,
      },
      //data.cropperData.H - 100 - isMax,
    }
  }

  let changableData = data.changableData
  let rotateDegree = changableData.rotateDegree

  // 判断是否为垂直方向
  let isVertical = rotateDegree % 180 > 0
  let rotateWidth = isVertical ? size.height : size.width
  let rotateHeight = isVertical ? size.width : size.height

  console.log('rotateWidth:' + rotateWidth + ', rotateHeight:' + rotateHeight)

  changableData.previewImageInfo.x = (data.W - rotateWidth) / 2
  changableData.previewImageInfo.y = (data.H - rotateHeight) / 2
  changableData.previewImageInfo.w = rotateWidth
  changableData.previewImageInfo.h = rotateHeight

  changableData.originalSize = {
    width: width,
    height: height,
  }
  changableData.scaleSize = {
    width: size.width,
    height: size.height,
  }

  updateData.changableData = changableData

  //   z.setData(updateData);
  for (let key in updateData) {
    data[key] = updateData[key]
  }
  // data.updateData = updateData
  // console.log("loadImage size:" + width + "*" + height)
  drawImage({
    path: data.cropperData.imageInfo.path,
    width: width,
    height: height,
  })
  // that.drawImage(that.data.cropperData.imageInfo)
  drawLines(data.moveItems, data.cropperData.imageInfo, changableData.rotateDegree)
}

//绘制图片
function drawImage(imageInfo) {
  let z = this
  // let cropperData = z.data.cropperData;
  // let size = cropperUtil.getAdjustSize(W, H, imageInfo.width, imageInfo.height);

  if (imageInfo.path != '') {
    let path = imageInfo.path
    let compressedScale = data.cropperData.original ? 1.0 : 0.4
    let rotateDegree = data.changableData.rotateDegree

    console.log('draw=' + path)

    let originalCtx = Taro.createCanvasContext('originalCanvas', z)
    //绘制原图
    drawImageWithDegree(
      originalCtx,
      path,
      imageInfo.width * compressedScale,
      imageInfo.height * compressedScale,
      rotateDegree,
      function () {
        // 首次渲染完成,生成默认截图
        setTimeout(function () {
          cropImage()
        }, 100)
      }
    )
  }
}

//绘制选框
function drawLines(moveItems, imageInfo, rotateDegree, callback) {
  let that = this
  let isVertical = rotateDegree % 180 > 0
  let cropperData = data.cropperData
  let mode = cropperData.mode
  let size
  if (isVertical) {
    size = getAdjustSize(data.W, data.H, imageInfo.height, imageInfo.width)
  } else {
    size = getAdjustSize(data.W, data.H, imageInfo.width, imageInfo.height)
  }

  let convexDots = []
  let orderedDots = Object.values(moveItems)

  // 获取凸边形的点
  convexDots = convexHull(orderedDots, orderedDots.length)

  // 四个点组成的四边形是不是凸四边形
  let canCrop = convexDots.length == 4

  if (callback) {
    callback(canCrop)
  }

  let ctx = Taro.createCanvasContext('moveCanvas')

  //绘制高亮选中区域
  let rect = getCropRect(convexDots)
  console.log(rect, 999)
  // if(rect.w > rect.h) {
  //     rect.h = rect.w
  // }
  // else {
  //     rect.w = rect.h
  // }
  if (mode == 'rectangle') {
    // 绘制半透明遮罩
    ctx.setFillStyle('rgba(0,0,0,0.5)')
    ctx.fillRect(0, 0, size.width, size.height)

    // 清除选中区域的半透明遮罩，使选中区域高亮
    ctx.setFillStyle('rgba(0,0,0,0)')
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h)

    // console.log('rectange')
    // console.log(size)
    // console.log(rect)

    //绘制选中边框
    ctx.setStrokeStyle('#fff')
    ctx.setLineWidth(2)
    ctx.beginPath()
    ctx.moveTo(rect.x, rect.y)
    ctx.lineTo(rect.x + rect.w, rect.y)
    ctx.lineTo(rect.x + rect.w, rect.y + rect.h)
    ctx.lineTo(rect.x, rect.y + rect.h)
    ctx.lineTo(rect.x, rect.y)

    ctx.stroke()
    ctx.closePath()
  } else {
    //绘制选中边框
    // 如果四个点组成的四边形不是凸四边形，则显示红色，表示不可取
    let color = canCrop ? 'white' : 'red'

    ctx.setStrokeStyle(color)
    ctx.setLineWidth(2)
    ctx.beginPath()
    for (let i = 0, len = convexDots.length; i < len; i++) {
      let dot = convexDots[i]
      if (i == 0) {
        ctx.moveTo(dot.x, dot.y)
      } else {
        ctx.lineTo(dot.x, dot.y)
      }
    }
    let dot = convexDots[0]
    ctx.lineTo(dot.x, dot.y)

    ctx.stroke()
    // 绘制选中区域
    // ctx.setFillStyle('rgba(0,0,0,0.5)')
    // ctx.fillRect(0, 0, size.width, size.height)
    ctx.setFillStyle('rgba(0, 0, 0, 0.3)')
    ctx.fill()
    ctx.closePath()
  }

  //绘制四个角
  let cornerType = mode == 'rectangle' ? 'rect' : 'circle'
  // 四角的颜色
  ctx.setFillStyle('#fff')
  ctx.setStrokeStyle('#fff')
  console.log(orderedDots, 'orderedDots')
  // 绘制不同样式的角
  if (cornerType == 'circle') {
    for (let i = 0, len = orderedDots.length; i < len; i++) {
      let dot = orderedDots[i]

      ctx.beginPath()
      ctx.arc(dot.x, dot.y, 10, 0, 2 * Math.PI, true)
      ctx.fill()
      ctx.closePath()
    }
  } else if (cornerType == 'rect') {
    let len = 20,
      w = 3.0,
      offset = w / 2.0

    ctx.setLineWidth(w)
    ctx.beginPath()

    ctx.moveTo(rect.x - offset, rect.y - offset + len)
    ctx.lineTo(rect.x - offset, rect.y - offset)
    ctx.lineTo(rect.x - offset + len, rect.y - offset)

    ctx.moveTo(rect.x + offset + rect.w - len, rect.y - offset)
    ctx.lineTo(rect.x + offset + rect.w, rect.y - offset)
    ctx.lineTo(rect.x + offset + rect.w, rect.y - offset + len)

    ctx.moveTo(rect.x + offset + rect.w, rect.y + offset + rect.h - len)
    ctx.lineTo(rect.x + offset + rect.w, rect.y + offset + rect.h)
    ctx.lineTo(rect.x + offset + rect.w - len, rect.y + offset + rect.h)

    ctx.moveTo(rect.x - offset, rect.y + offset + rect.h - len)
    ctx.lineTo(rect.x - offset, rect.y + offset + rect.h)
    ctx.lineTo(rect.x - offset + len, rect.y + offset + rect.h)

    ctx.stroke()

    ctx.closePath()
  }

  ctx.draw()
}

// move events
function setupMoveItem(key, changedTouches, imageInfo, callback) {
  let that = this
  let cropperData = data.cropperData
  let moveItems = data.moveItems
  let changableData = data.changableData
  let left = cropperData.left
  let top = cropperData.top
  let mode = cropperData.mode
  let size = getAdjustSize(data.W, data.H, imageInfo.width, imageInfo.height)
  if (changedTouches.length == 1) {
    let touch = changedTouches[0]
    let x = touch.clientX
    let y = touch.clientY
    // 相对画布的点
    x = x - left
    y = y - top

    moveItems[key].x = x
    moveItems[key].y = y
    // 边界检测，使截图不超出截图区域
    x = x < 0 ? 0 : x > size.width - 40 ? size.width - 40 : x
    y = y < 0 ? 0 : y > size.height - 100 ? size.height - 100 : y
    moveItems[key].x = x
    moveItems[key].y = y

    // 如果是在矩形模式下
    if (mode == 'rectangle') {
      // 同时设置相连两个点的位置，是相邻的两个点跟随着移动点动，保证选框为矩形
      if (changableData.shapeEnable) {
        // let convexDots = []
        // let orderedDots = Object.values(moveItems)

        // // 获取凸边形的点
        // convexDots = cropperUtil.convexHull(orderedDots, orderedDots.length)
        // //绘制高亮选中区域
        // let rect = cropperUtil.getCropRect(convexDots)

        let gapX, gapY
        let opKey = ''
        if (key == 'topleft') {
          opKey = 'bottomright'
        } else if (key == 'topright') {
          opKey = 'bottomleft'
        } else if (key == 'bottomleft') {
          opKey = 'topright'
        } else if (key == 'bottomright') {
          opKey = 'topleft'
        }

        gapX = x - moveItems[opKey].x
        gapY = y - moveItems[opKey].y
        // gapX = Math.abs(gapX)
        // gapY = Math.abs(gapY)
        // console.log(gapX, gapY)
        // let cx = gapX > 0 ? 1 : -1
        // let cy = gapY > 0 ? 1 : -1
        // console.log(cx, cy, gapX, gapY)
        if (Math.abs(gapX) > Math.abs(gapY)) {
          if (key == 'topleft' || key == 'bottomright') {
            moveItems[key].x = moveItems[opKey].x + gapY
            moveItems[key].y = moveItems[opKey].y + gapY
          } else {
            moveItems[key].x = moveItems[opKey].x - gapY
            moveItems[key].y = moveItems[opKey].y + gapY
          }
        } else {
          if (key == 'topleft' || key == 'bottomright') {
            moveItems[key].x = moveItems[opKey].x + gapX
            moveItems[key].y = moveItems[opKey].y + gapX
          } else {
            moveItems[key].x = moveItems[opKey].x + gapX
            moveItems[key].y = moveItems[opKey].y - gapX
          }
        }
      }
      if (key == 'topleft') {
        moveItems['bottomleft'].x = moveItems[key].x
        moveItems['topright'].y = moveItems[key].y
      } else if (key == 'topright') {
        moveItems['bottomright'].x = moveItems[key].x
        moveItems['topleft'].y = moveItems[key].y
      } else if (key == 'bottomleft') {
        moveItems['topleft'].x = moveItems[key].x
        moveItems['bottomright'].y = moveItems[key].y
      } else if (key == 'bottomright') {
        moveItems['topright'].x = moveItems[key].x
        moveItems['bottomleft'].y = moveItems[key].y
      }
    }

    drawLines(moveItems, imageInfo, changableData.rotateDegree, function (canCrop) {
      if (callback) {
        callback(moveItems, canCrop)
      }
    })
  }
}

// moveable-view touchmove
function moveEvent(e) {
  console.log(111)
  let z = this
  let key = e.currentTarget.dataset.key
  let originalSize = data.changableData.originalSize
  setupMoveItem(key, e.changedTouches, {
    path: data.cropperData.imageInfo.path,
    width: originalSize.width,
    height: originalSize.height,
  })
}

// If move out of the scale, it will trigger bindtouchcancel Event.
function touchcancelEvent(e) {
  endEvent(e)
}

// moveable-view touchend，end的时候设置movable-view的位置，如果在move阶段设置位置，选中会不流畅
function endEvent(e) {
  let z = this
  let { cropperData, moveItems, changableData } = data
  let originalSize = changableData.originalSize
  let key = e.currentTarget.dataset.key

  setupMoveItem(
    key,
    e.changedTouches,
    {
      path: cropperData.imageInfo.path,
      width: originalSize.width,
      height: originalSize.height,
    },
    (_moveItems, canCrop) => {
      changableData.canCrop = canCrop
      // z.setData({
      //   changableData: changableData,
      //   moveItems: _moveItems
      // }, z.cropImage);
      data.changableData = changableData
      data.moveItems = _moveItems
      cropImage()
    }
  )
}
// 获取适应屏幕的图片显示大小
const getAdjustSize = (W, H, width, height) => {
  if (width > W) {
    height = (W / width) * height
    width = W
  }

  if (height > H) {
    width = (H / height) * width
    height = H
  }

  return {
    width: width,
    height: height,
  }
}
function orientation(p, q, r) {
  var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)

  if (val == 0) return 0 // collinear
  return val > 0 ? 1 : 2 // clock or counterclock wise
}
function convexHull(points, n) {
  if (n < 3) return
  var hull = []
  var l = 0
  for (var i = 1; i < n; i++) {
    if (points[i].x < points[l].x) {
      l = i
    }
  }
  var p = l,
    q
  do {
    hull.push(points[p])
    q = (p + 1) % n
    for (var i = 0; i < n; i++) {
      if (orientation(points[p], points[i], points[q]) == 2) q = i
    }
    p = q
  } while (p != l)
  return hull
}

function drawImageWithDegree(ctx, path, width, height, degree, callback) {
  let isVertical = degree % 180 > 0

  let drawWidth = isVertical ? height : width
  let drawHeight = isVertical ? width : height

  let centerX = width / 2
  let cneterY = height / 2

  let drawCenterX = drawWidth / 2
  let drawCneterY = drawHeight / 2

  let d = Math.abs(width - height) / 2

  // ctx.translate(drawCenterX, drawCneterY)
  // ctx.rotate(degree * Math.PI / 180)
  // ctx.translate(-drawCenterX, -drawCneterY)

  // ctx.translate(centerX, cneterY);
  // ctx.rotate(degree * Math.PI / 180);
  // ctx.translate(-centerX, -cneterY);

  // // ctx.translate(-d, d)
  // if (isVertical) {
  //   if (drawHeight > drawWidth) {
  //     ctx.drawImage(path, d, -d, drawWidth, drawHeight);
  //   }
  //   else {
  //     ctx.drawImage(path, -d, d, drawWidth, drawHeight);
  //   }
  // }
  // else {
  // }
  // ctx.rotate(90)
  // ctx.rotate(90)
  // path 需要传temp地址
  ctx.drawImage(path, 0, 0, drawWidth, drawHeight)

  ctx.draw(false, function (e) {
    callback && callback(e)
  })
}

// 查找topleft的点
function findTopLeft(items) {
  let x = items.topleft.x,
    y = items.topleft.y
  for (let i in items) {
    let item = items[i]
    if (x > item.x) {
      x = item.x
    }
    if (y > item.y) {
      y = item.y
    }
  }
  return {
    x,
    y,
  }
}
defineExpose({
  getRevolve,
})
</script>
<style lang="scss">
.cropper_main_container {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 750rpx;
  height: calc(100% - 140px);
  background: #f8f8f8;
  overflow: hidden;
  padding-top: 40px;
  box-sizing: content-box;
  background: #000;
}

.cropper_main_container.hidden {
  //   display: none;
}

.cropper_container {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* button */

.cropper_toolbar {
  position: absolute;
  z-index: 10;
  bottom: 0;
  height: 50px;
  background: black;
  width: 100%;
  line-height: 50px;
  font-size: 15px;
  text-align: center;
  color: white;
}

.cropper_toolbar .button_item {
  /* width: 70px; */
  float: left;
  width: 20%;
  /* width: 25%; */
  height: 50px;
}

.original_button .check_container {
  position: relative;
  float: left;
  margin-top: 14px;
  width: 18px;
  height: 18px;
  border: 1px solid white;
}

.button_item.checked {
  background: #26ab28;
}

/* crop_image_button */

.crop_image_button {
  color: #26ab28;
}

.crop_image_button.disable {
  /* color: #038905;  */
  color: rgba(0, 0, 0, 0);
}

/* canvas */

.cropper_movable_area_container {
  position: relative;
  /* background: salmon;
    border: 2px solid red; */
}

.cropper_canvas_container_item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.cropper_canvas_container {
  position: relative;
}

.cropper_canvas_container.isOpacity {
  width: 0 !important;
  display: none;
}

/* 移动的四个点的样式，如果不想显示四个圈，可以设置opacity为0 */
/* opacity:0隐藏，如果想看就设置为1，只能在测试机能看到，真机上canvas层级在最高层 */

.cropper_movable_area_container .move_item {
  z-index: 10;
  opacity: 0.7;
  /* opacity: 0;  */
  /* 不要显示大圆球 */
  /* background: white; */
  /* border-radius: 50%; */
}

.cropper_canvas_container .canvas {
  position: absolute;
  left: 0;
  top: 0;
  /* opacity: 0; */
}

/* 因为display:none在真机上会造成无法截取图片，所以这里是通过移到显示区域外来达到隐藏效果的 */

.original_canvas {
  position: absolute;
  left: 750rpx;
  top: 100vh;
  /* position: fixed;
    z-index: 9999999;
    left: 0;
    top: 0; */
}

.scale-image {
  position: absolute;
  left: 0;
  top: 0;
}

.move_canvas {
  /* border: 2px solid blue;  */
  /* background: red;  */
}
</style>
