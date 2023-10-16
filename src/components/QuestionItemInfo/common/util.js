const tinyNumlist = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'
const smallLetterlist = 'abcdefghijklmnopqrstuvwxyz'

export function getQuestionSuffixNO(level, index) {
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
