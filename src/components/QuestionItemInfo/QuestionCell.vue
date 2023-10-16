<template>
  <view>
    <view v-if="level === 1 || quesStructPm != '23'">
      <view v-if="vdata.rule.s && checkStem">
        <view class="ques-topic clearfix">
          <rich-text class="ques-type" :nodes="getStem(ques)"></rich-text>
        </view>
      </view>
      <view class="ques-option" v-if="vdata.rule.o && checkStem && getOptions(ques)">
        <view
          v-for="(suboption, index) in getOptions(ques)"
          :key="index"
          :class="['answer-item', getAnswerSelect(ques.answerList, index) && 'answer-item-select']"
          @tap="chooseAnswerInfo(index, ques, level)"
        >
          <view class="answer-word">{{ optionTag(index) }}</view>
          <rich-text class="answer-item-choose" :nodes="getAnswerStem(suboption)"></rich-text>
        </view>
      </view>
      <view class="analysisInfo">
        <answer-analysis v-if="ques.showExplain" :ques="ques"> </answer-analysis>
      </view>
      <template
        v-if="
          (level === 1 && !ques.children.length && getQuestionType(ques.quesType.name)) ||
          (level != 1 && getQuestionType(ques?.quesStruct?.name))
        "
      >
        <template v-if="!ques?.isAnswer">
          <view class="computed">本题需在纸上答题，做完核对答案</view>
          <view class="computedBtn" @tap="changeAnswer(ques)">已做完，核对答案</view>
        </template>
        <template v-else>
          <view class="handAnswer">
            <view v-if="ques.isRightAnswer === null" class="noAnswer">
              <image
                @tap="chooseAnswer(ques, true)"
                class="noAnswerImg"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/368657d7bd5b474cb05e16ae5e4bd3b2/noRight.png"
                mode="scaleToFill"
              />
              <image
                @tap="chooseAnswer(ques, false)"
                class="noAnswerImg"
                src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/2f6a42d431bc4170a70585ab695e9a6f/noError.png"
                mode="scaleToFill"
              />
            </view>
            <view v-else class="yesAnswer">
              <template v-if="ques.isRightAnswer">
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/190c39844c8e43368db055962702fc06/yesRight.png"
                  mode="scaleToFill"
                  class="yesRightImg"
                />
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/2f6a42d431bc4170a70585ab695e9a6f/noError.png"
                  mode="scaleToFill"
                  class="noAnswerImg"
                  @tap="chooseAnswer(ques, false)"
                />
              </template>

              <template v-else>
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/368657d7bd5b474cb05e16ae5e4bd3b2/noRight.png"
                  mode="scaleToFill"
                  class="noAnswerImg"
                  @tap="chooseAnswer(ques, true)"
                />
                <image
                  src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/znst/387a1a0f3a354ea3b5c848706fda0616/yewError.png"
                  mode="scaleToFill"
                  class="yesRightImg"
                />
              </template>
            </view>
          </view>
        </template>
      </template>
    </view>
    <!-- <view v-else>
      <view class="nostem-ques-topic">
        <view class="nostem-no">
          <rich-text class="ques-type" :nodes="getStem()"></rich-text>
        </view>
        <view class="nostem-ques-option" v-if="rule.o && getOptions(ques)">
          <span v-for="(suboption, index) in getOptions(ques)" :key="index">
            <rich-text class="ques-content" :nodes="combinedOption(suboption, index)"></rich-text>
          </span>
        </view>
      </view>
    </view> -->
    <!-- 有子集题干展示区 -->
    <view v-if="vdata.rule.c && ques.children && ques.children.length > 0">
      <!-- <slot name="child" :list="ques.children"></slot> -->
      <question-cell
        v-for="(child, index) in ques.children"
        :key="index"
        :childIndex="index"
        :showExplain="showExplain"
        :showAttr="showAttr"
        :level="level + 1"
        :quesStructPm="quesStructPm"
        :ques="child"
      ></question-cell>
    </view>
  </view>
</template>
<script lang="ts" setup>
import AnswerAnalysis from './AnswerAnalysis.vue'
import CTS from './common/constant'
import { reactive, computed, watch, onMounted } from 'vue'
const vdata = reactive({
  rule: {
    h: false, // 听力
    s: true, // 题干
    o: true, // 选项
    c: false, // 子集
    a: true, // 答案
    ay: true, // 解析
    at: true, // 属性
  },
  ant: 1,
  fillchoice: false,
  questionShowPart: CTS.cfgDict.questionShowPart,
})
const tinyNumlist = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'
const smallLetterlist = 'abcdefghijklmnopqrstuvwxyz'
const props = defineProps({
  ques: {
    type: Object,
    default() {
      return {}
    },
  },
  level: {
    type: Number,
    default: 1,
  },
  childIndex: {
    type: Number,
    default: 0,
  },
  quesStructPm: {
    type: String,
    default: '-1',
  },
  questionNum: {
    type: Number,
    default: 1,
  },
  showQuestionNum: {
    // 是否显示题号
    type: Boolean,
    default: false,
  },
  showExplain: {
    type: Boolean,
    default: false,
  },
  showAttr: {
    type: Boolean,
    default: false,
  },
  questionWidth: {
    type: Number,
    default: 832,
  },
})
const checkStem = computed(() => {
  if (props.level === 1) return true
  if (props.quesStructPm) {
    if ('24,25'.indexOf(props.quesStructPm) != -1) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
})
const changeAnswer = (item) => {
  item.isAnswer = true
  item.showExplain = true
}
const chooseAnswer = (item, val) => {
  item.isRightAnswer = val
}
//选中答案
const chooseAnswerInfo = (index, ques, level) => {
  if (
    (level == 1 && !ques.children.length && getQuestionTypeDx(ques.quesType.name)) ||
    (level != 1 && getQuestionTypeDx(ques.quesStruct.name))
  ) {
    let answerList = [optionTag(index)]
    ques.answerList = answerList
  } else if (
    (level == 1 && !ques.children.length && getQuestionTypeMoreDx(ques.quesType.name)) ||
    (level != 1 && getQuestionTypeMoreDx(ques.quesStruct.name))
  ) {
    if (ques.answerList.indexOf(optionTag(index)) == -1) {
      ques.answerList = ques.answerList.concat(optionTag(index))
      ques.answerList = ques.answerList.sort((a, b) => {
        return a - b
      })
    } else {
      let currentIndex = ques.answerList.findIndex((item) => item == optionTag(index))
      ques.answerList.splice(currentIndex, 1)
      ques.answerList = ques.answerList.sort((a, b) => {
        return a - b
      })
    }

    console.log(ques.answerList)
  }
}
//是否选中
const getAnswerSelect = (list, index) => {
  if (!list.length) return false
  if (list.includes(optionTag(index))) {
    return true
  } else {
    return false
  }
}
const combinedOption = (suboption, index) => {
  //   return this.$cp_filter.optionTag(index) + '.&nbsp;' + suboption
  return optionTag(index) + '|&nbsp;' + suboption
}
const optionTag = (i) => {
  const optionlist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return optionlist.charAt(i)
}
//非单选题
const getQuestionType = (str) => {
  let flag = false
  if (
    str.indexOf('单选') == -1 &&
    str.indexOf('多选') == -1 &&
    str.indexOf('选择题') == -1 &&
    str.indexOf('单项选择') == -1
  ) {
    flag = true
  }
  return flag
}
// 选出单选题
const getQuestionTypeDx = (str) => {
  let flag = false
  if (str.indexOf('单选') != -1 || str.indexOf('选择题') != -1 || str.indexOf('单项选择') != -1) {
    flag = true
  }
  return flag
}
const getQuestionTypeMoreDx = (str) => {
  let flag = false
  if (str.indexOf('多选') != -1) {
    flag = true
  }
  return flag
}
// 获取题干
const getStem = (ques) => {
  let stem = ''
  if (ques && ques.context) {
    stem = formatRichTextInfo(ques.context.stem, 330) || ''
    // stem = formatRichText(ques.context.stem) || ''
  } else {
    stem = ''
  }
  if (props.level === 1) {
    // if (this.showQuestionNum && this.quesStructPm != '19') {
    if (props.showQuestionNum) {
      return `${props.questionNum}. ${stem}`
    } else {
      return stem
    }
  } else {
    if (ques.questionNum) {
      return `${ques.questionNum} ${stem}`
    } else {
      return getQuestionSuffixNO(props.level, props.childIndex + 1) + ' ' + stem
    }
  }
}
const getAnswerStem = (ques) => {
  let stem = ''
  stem = formatRichTextInfo(ques, 210) || ''
  return stem
}
const formatRichTextInfo = (str, width) => {
  // var reg1 = new RegExp('(i?)(<img)(?!(.*?style=[\'"](.*)[\'"])[^>]+>)', 'gmi')
  // let result = ''
  // str = str.replace(/<table[^>]*>/gi, '<table max-width="100%"  style="max-width:100%;"')
  // if (reg1.test(str)) {
  //   result = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  // } else {
  //   // let srcReg = /(?<=(<img[^>]style="))[^"]*/g
  //   let srcReg = new RegExp('(?<=(<img[^>]style="))[^"]', 'gmi')
  //   let videoList = str.match(srcReg) || []
  //   if (videoList && videoList.length) {
  //     if (videoList[0].indexOf('width') != -1) {
  //       result = str.replace(
  //         /(<img[^>]*style="[^"]*?)(\bwidth\s*:\s*\d+[^;"]*?px;)(\s?height\s*:\s*\d+[^;"]*?px;)([^<]*\/>)/gi,
  //         function (match, p1, p2, p3, p4) {
  //           var widthValue = parseInt(p2.match(/\d+/)[0])
  //           // var heightValue = parseInt(p3.match(/\d+/)[0])
  //           if (widthValue > width) {
  //             return p1 + `width: ${width}px; height: auto;` + p4
  //           }
  //           return match // 如果width小于等于375，则不做替换，保持原样
  //         }
  //       )
  //     } else if (videoList[0].indexOf('height') != -1) {
  //       result = str.replace(
  //         /(<img[^>]*style="[^"]*?)(\s?height\s*:\s*\d+[^;"]*?px;)([^<]*\/>)/gi,
  //         function (match, p1, p2, p3) {
  //           var widthValue = parseInt(p2.match(/\d+/)[0])
  //           if (widthValue > width) {
  //             return p1 + `width: ${width}px;` + p3
  //           }
  //           return match // 如果width小于等于375，则不做替换，保持原样
  //         }
  //       )
  //     } else {
  //       result = str.replace(/<img[^>]*>/gi, function (match, capture) {
  //         match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
  //         return match
  //       })
  //       result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  //       result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  //     }
  //   } else {
  //     result = str.replace(/<img[^>]*>/gi, function (match, capture) {
  //       match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
  //       return match
  //     })
  //     //再设置新的样式
  //     result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  //     result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  //   }
  // }
  // return result

  let result = ''
  let reg1 = /<img[^>]style="[^"]*/g
  str = str.replace(/<table[^>]*>/gi, '<table max-width="100%"  style="max-width:100%;"')
  if (!reg1.test(str)) {
    result = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
  } else {
    // let srcReg = /(?<=(<img[^>]style="))[^"]*/g
    // let srcReg = new RegExp('(?<=(<img[^>]style="))[^"]', 'gmi')
    let srcReg = /<img[^>]style="[^"]*/g
    let videoList = str.match(srcReg) || []
    if (videoList && videoList.length) {
      if (videoList[0].indexOf('width') != -1) {
        result = str.replace(
          /(<img[^>]*style="[^"]*?)(\bwidth\s*:\s*\d+[^;"]*?px;)(\s?height\s*:\s*\d+[^;"]*?px;)([^<]*\/>)/gi,
          function (match, p1, p2, p3, p4) {
            var widthValue = parseInt(p2.match(/\d+/)[0])
            // var heightValue = parseInt(p3.match(/\d+/)[0])
            if (widthValue > width) {
              return p1 + `width: ${width}px; height: auto;` + p4
            }
            return match // 如果width小于等于375，则不做替换，保持原样
          }
        )
      } else if (videoList[0].indexOf('height') != -1) {
        result = str.replace(
          /(<img[^>]*style="[^"]*?)(\s?height\s*:\s*\d+[^;"]*?px;)([^<]*\/>)/gi,
          function (match, p1, p2, p3) {
            var widthValue = parseInt(p2.match(/\d+/)[0])
            if (widthValue > width) {
              return p1 + `width: ${width}px;` + p3
            }
            return match // 如果width小于等于375，则不做替换，保持原样
          }
        )
      } else {
        result = str.replace(/<img[^>]*>/gi, function (match, capture) {
          match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
          return match
        })
        result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
        result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
      }
    } else {
      result = str.replace(/<img[^>]*>/gi, function (match, capture) {
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
        return match
      })
      //再设置新的样式
      result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
      result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"')
    }
  }
  return result
}
// 获取选项
const getOptions = (ques) => {
  if (ques && ques.context) {
    return ques.context.options
  } else {
    return null
  }
}
const getQuestionSuffixNO = (level, index) => {
  // 一级 1  二级 （1） 三级 ①  四级 1) 五级 a. 六级 a)
  switch (level) {
    case 2:
      return '(' + index + ')'
    case 3:
      return tinyNumlist[index - 1] || tinyNumlist[0]
    case 4:
      return smallLetterlist[index - 1] || smallLetterlist[0] + '.'
    case 5:
      return smallLetterlist[index - 1] || smallLetterlist[0] + ')'
    default:
      return index + '.'
  }
}
// 渲染 显示规则 rule
const renderRule = () => {
  if (props.ques.quesStruct) {
    let qstruct = parseInt(props.ques.quesStruct.code)
    let item = vdata.questionShowPart[qstruct]
    vdata.fillchoice = qstruct == 27
    if (item) {
      vdata.rule.h = getRuleAttribute('h', item)
      vdata.rule.s = getRuleAttribute('s', item)
      vdata.rule.o = getRuleAttribute('o', item)
      vdata.rule.c = getRuleAttribute('c', item)
      vdata.rule.a = getRuleAttribute('a', item)
      vdata.rule.ay = getRuleAttribute('ay', item)
      vdata.rule.at = getRuleAttribute('at', item)
      if (item.ant) {
        vdata.ant = item.ant
        // console.log(this.ant, 'ant')
      }
      if (qstruct == 19 && props.ques.quesType && props.ques.quesType.code == 15) {
        vdata.rule.c = 0
      }
    }
  }
  // { name: '单选题', h: 0, s: 1, o: 1, c: 0, a: 1, ay: 1, at: 1 }
}
const getRuleAttribute = (ckey, c) => {
  let state = c[ckey]
  switch (state) {
    case 0:
      return false
    case 1:
      return true
    case 2:
      return props.level === 1
    case 3:
      return props.level !== 1
  }
  return false
}
watch(
  () => props.ques,
  () => {
    renderRule()
  },
  {
    deep: true,
  }
)
onMounted(() => {
  if (props.ques) {
    renderRule()
  }
})
</script>
<style lang="scss">
.ques-topic {
  font-size: 15px;
}
.ques-option {
  margin: 15px 0;
  .answer-item {
    padding: 10px 0;
    background: #f2f2f2;
    margin-bottom: 15px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    .answer-word {
      width: 45px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      border-right: 1px solid #e8e8e8;
      flex-shrink: 0;
      font-size: 16px;
      color: #333333;
    }
    .answer-item-choose {
      flex: 1;
      // background: #fff;
      padding-left: 20px;
      box-sizing: border-box;
    }
  }
  .answer-item-select {
    background: #e0eaff;
    .answer-word {
      color: #2f5de7;
      border-right: 1px solid #cdddff;
    }
  }
}
</style>
