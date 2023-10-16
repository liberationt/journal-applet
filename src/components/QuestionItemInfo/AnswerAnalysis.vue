<!--
  答案 解析 渲染器
 -->
 <template>
  <view>
    <view class="answer-item-part">
      <view class="ques-answer clearfix">
        <view class="answerText">
          <image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/ef80ec8c7335409c838d2ed66e4aa048/answerIcon.png"
            class="titleIcon"
          ></image>
          <view class="titleAnswer">正确答案</view>
        </view>
        <view class="ques-content">
          <view class="clearfix" v-for="(sub, index) in quesAnswers" :key="index">
            <rich-text :nodes="sub"></rich-text>
          </view>
        </view>
      </view>
    </view>
    <!-- 听力题干展示区 -->
    <view v-if="rule.h" class="answer-item-part">
      <view class="ques-answer-original">
        <view class="ques-title ques-type">【听力原文】</view>
        <view class="ques-content">
          <view v-html="getHearing(ques)"></view>
        </view>
      </view>
    </view>

    <view>
      <view class="ques-answer clearfix">
        <view class="ques-title ques-type">
          <view class="answerText">
            <image
              src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/303cfe9068024919b15ec50f833c829c/analysisIcon.png"
              class="titleIcon"
            ></image>
            <view class="titleAnswer">文字解析</view>
          </view>
        </view>
        <view class="ques-content">
          <view class="clearfix" v-for="(sub, index) in quesAnalysis" :key="index">
            <rich-text :nodes="sub"></rich-text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
  <script>
import CTS from './common/constant'
import { getQuestionSuffixNO } from './common/util'
export default {
  props: {
    ques: {
      type: Object,
    },
    questionNum: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    ques(v) {
      if (v) {
        this.dealAnalysisAnswer()
      }
    },
  },
  data() {
    return {
      questionShowPart: CTS.cfgDict.questionShowPart,
      analysisQuesConfig: CTS.cfgDict.analysisQuesConfig,
      quesAnswers: [],
      quesAnalysis: [],
      quesComment: [],
      quesAnalysisContent: '',
      rule: {
        h: false, // 听力
      },
    }
  },
  mounted() {
    if (this.ques) {
      this.dealAnalysisAnswer()
    }
  },
  methods: {
    // 获取听力题干
    getHearing(ques) {
      let original_text = ''
      if (ques && ques.context) {
        original_text = ques.context.original_text || ''
      } else {
        original_text = ''
      }
      return original_text
    },
    // 渲染 显示规则 rule
    renderRule() {
      let item = this.getQstructItem(this.ques)
      if (item) {
        this.rule.h = item.h
      }
      // { name: '单选题', h: 0, s: 1, o: 1, c: 0, a: 1, ay: 1, at: 1 }
    },
    getQuesAnalysisContent() {
      let cques = this.ques
      if (cques && cques.quesStruct && cques.quesStruct.code) {
        let qstruct = parseInt(cques.quesStruct.code)
        if (this.analysisQuesConfig.indexOf(qstruct) != -1) {
          let explain = cques.explain
          return this.getAnalysis(explain, '')
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    // 遍历 显示 答案和解析
    dealAnalysisAnswer() {
      // 显示 分析
      this.renderRule()
      this.quesAnalysisContent = this.getQuesAnalysisContent()
      console.log(this.quesAnalysisContent, 9999)
      console.log('开始 显示Analysis')
      let answerlist = []
      let analysislist = []
      let commentlist = []
      let stack = [this.ques]
      this.ques.level = 1
      while (stack.length) {
        let cques = stack.shift()
        // 判断 是否有子集
        let item = this.getQstructItem(cques)
        if (item.c && cques.children && cques.children.length) {
          cques.children.forEach((sques, index) => {
            sques.level = cques.level + 1
            sques.no_index = index + 1
          })
          stack.unshift(...cques.children)
        }

        // 判断是 是否 有解析 和 答案
        let explain = cques.explain
        if (item.a) {
          let answerItem =
            getQuestionSuffixNO(cques.level, cques.no_index) +
            ' ' +
            this.getCheckAnswers(explain, item.ant)
          if (cques.level === 1) {
            answerItem = this.getCheckAnswers(explain, item.ant)
          }
          answerlist.push(answerItem)
        } else if (item.c && cques.level > 1) {
          let answerItem = getQuestionSuffixNO(cques.level, cques.no_index)
          answerlist.push(answerItem)
        }

        if (item.ay) {
          let analysisItem =
            getQuestionSuffixNO(cques.level, cques.no_index) + ' ' + this.getAnalysis(explain)
          if (cques.level === 1) {
            if (item.c) {
              analysisItem = this.getAnalysis(explain, '')
            } else {
              analysisItem = this.getAnalysis(explain)
            }
          }
          analysislist.push(analysisItem)
        } else if (item.c && cques.level > 1) {
          let analysisItem = getQuestionSuffixNO(cques.level, cques.no_index)
          analysislist.push(analysisItem)
        }
        // 是否 有点评
        let commentItem = this.getComment(explain)
        if (commentItem) {
          if (cques.level > 1) {
            commentItem = getQuestionSuffixNO(cques.level, cques.no_index) + ' ' + commentItem
          }

          commentlist.push(commentItem)
        }
      }
      console.log(answerlist, 999)
      this.quesAnswers = answerlist
      this.quesAnalysis = analysislist
      this.quesComment = commentlist
      this.$nextTick(() => {
        console.log('显示Analysis')
      })
    },
    getQstructItem(cques) {
      let defaultItem = {
        h: false, // 听力
        s: true, // 题干
        o: true, // 选项
        c: false, // 子集
        a: true, // 答案
        ay: true, // 解析
        at: true, // 属性
        ant: 1,
      }
      if (cques && cques.quesStruct && cques.quesStruct.code) {
        let qstruct = parseInt(cques.quesStruct.code)
        let item = this.questionShowPart[qstruct] || defaultItem
        return item
      } else {
        return defaultItem
      }
    },
    getCheckAnswers(value, ant) {
      if (!(value && value[0] && value[0].answers && value[0].answers[0])) {
        return ''
      } else {
        if (ant === 3) {
          let jval = value[0].answers[0][0]
          if (jval === '1') {
            return '对'
          } else if (jval === '0') {
            return '错'
          } else {
            return ''
          }
        } else if (ant !== 0) {
          let answers = value[0].answers
          let answerlist = []
          for (let sub of answers) {
            let html = ''
            if (sub && sub.length > 0) {
              html += sub[0]
              let arr = sub.slice(1)
              if (arr.length > 0) {
                html += '[' + arr.join(',') + ']'
              }
            }
            answerlist.push(html)
          }
          return answerlist.join(' ； ')
        } else {
          return value[0].answers[0][0]
        }
      }
    },
    getAnalysis(value, defaulttext = '略') {
      if (value && value[0]) {
        return value[0].analysis || defaulttext
      } else {
        return defaulttext
      }
    },
    getComment(value) {
      if (value && value[0] && value[0].comment != 'NULL') {
        return value[0].comment || ''
      } else {
        return ''
      }
    },
    checkAnalysis(value) {
      if (!(value && value[0])) {
        return false
      }
      value = value[0].analysis
      if (!value) return false
      let v = value.trim()
      if (v === '' || v === '略') {
        return false
      } else {
        return true
      }
    },
  },
}
</script>
  
<style lang="scss" scoped>
</style>
  