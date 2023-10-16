<template>
  <view class="questionInfoWrong">
    <question-cell
      :level="1"
      :quesStructPm="ques.quesStruct && ques.quesStruct.code ? ques.quesStruct.code : '-1'"
      :ques="ques"
      :showQuestionNum="showQuestionNum"
      :questionNum="questionIndex"
    >
    </question-cell>
    <!-- 试题解析答案 -->
    <view class="analysisInfo">
      <answer-analysis v-if="showExplain" :ques="ques"> </answer-analysis>
    </view>
  </view>
</template>
<script setup lang="ts">
import QuestionCell from './QuestionCell.vue'
import AnswerAnalysis from './AnswerAnalysis.vue'

import { onMounted, reactive } from 'vue'
const vdata = reactive({
  divide: 0,
  second: 0,
})
const props = defineProps({
  ques: {
    type: Object,
    default() {
      return {}
    },
  },
  showQuestionNum: {
    type: Boolean,
    default: false,
  },
  questionIndex: {
    type: Number,
    default: 0,
  },
  showExplain: {
    // 是否显示答案和解析
    type: Boolean,
    default: false,
  },
  showKnowledge: {
    // 是否 显示知识点
    type: Boolean,
    default: false,
  },
})
onMounted(() => {
  // console.log(1234,props.ques)
})
</script>

<style lang="scss">
.questionInfoWrong {
  .center {
    text-align: center !important;
  }
  .right {
    text-align: right !important;
  }
  .text-indent {
    text-indent: 28px;
  }
  .blank {
    display: inline-block;
    width: 0.5em;
  }
  .cloze,
  .fill,
  .longFill {
    display: inline-block;
    min-width: 2.5em;
    height: 1em;
    text-align: center;
    line-height: 1em;
    padding: 0 0.5em;
    border-bottom: 1px solid #333;
    vertical-align: bottom;
  }
  .longFill {
    min-width: 15em;
  }
  // .fill {
  //   border: 1px solid #333;
  //   height: 1.5em;
  //   line-height: 1.5em;
  //   /*margin: 0 0.5em;*/
  //   vertical-align: middle;
  // }
  .brack,
  .tab {
    display: inline-block;
    min-width: 2em;
    text-align: center;
  }
  .underline {
    text-decoration: underline;
  }

  .wave {
    /*display: inline-block;*/
    padding-bottom: 8px;
    background: url(./edit/wave.png) repeat-x center bottom;
    word-break: break-word;
  }
  .point2 {
    /*display: inline-block;*/
    padding-bottom: 4px;
    background: url(./edit/point.png) repeat-x center bottom;
    word-break: break-word;
  }

  .cp-ensigna {
    padding-bottom: 16px;
    position: relative;
    word-break: break-word;
  }
  .cp-ensignb {
    padding-bottom: 16px;
    position: relative;
    word-break: break-word;
  }

  .cp-ensignc {
    padding-bottom: 16px;
    position: relative;
    word-break: break-word;
  }

  .cp-ensignd {
    padding-bottom: 16px;
    position: relative;
    word-break: break-word;
  }

  .cp-ensigna::after,
  .cp-ensignb::after,
  .cp-ensignc::after,
  .cp-ensignd::after {
    content: ' ';
    width: 20px;
    height: 20px;
    position: absolute;
    top: 12px;
    left: 50%;
    margin-left: -10px;
  }
  .cp-ensigna::after {
    background: url('./edit/cp-ensigna.png') no-repeat center bottom;
  }
  .cp-ensignb::after {
    background: url('./edit/cp-ensignb.png') no-repeat center bottom;
  }

  .cp-ensignc::after {
    background: url('./edit/cp-ensignc.png') no-repeat center bottom;
  }

  .cp-ensignd::after {
    background: url('./edit/cp-ensignd.png') no-repeat center bottom;
  }
  .cpk-circlefill {
    display: inline-block;
    min-width: 35px;
    text-align: center;
    vertical-align: bottom;
    border: 1px solid #333;
    height: 35px;
    line-height: 35px;
    vertical-align: middle;
    border-radius: 18px;
  }
  .cpk-squarefill {
    display: inline-block;
    min-width: 35px;
    text-align: center;
    vertical-align: bottom;
    border: 1px solid #333;
    height: 35px;
    line-height: 35px;
    vertical-align: middle;
  }
}
.analysisInfo {
  .answerText {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
    margin-bottom: 10px;
    margin-top: 20px;
    image {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  }
}
</style>