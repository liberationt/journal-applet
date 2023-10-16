export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/index/index',
    'pages/my/index',
    'pages/personal/index',
    'pages/subject/supportingAnswers/index',
    'pages/subject/previewPdf/index',
  ],

  window: {
    backgroundColor: '#fff',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#000000',
    selectedColor: '#2c68ff',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        selectedIconPath: './assets/images/home1.png',
        iconPath: './assets/images/home.png',
        text: '首页',
      },
      {
        pagePath: 'pages/my/index',
        selectedIconPath: './assets/images/my1.png',
        iconPath: './assets/images/my.png',
        text: '我的',
      },
    ],
  },
  subpackages: [
    {
      root: 'phaseOne/pages',
      pages: [
        'index/index',
        'activateMember/index',
        'identity/index',
        'grade/index',
        'memberPurchase/index',
        'transactions/index',
        'payResults/index',
        'scanCode/index',
        'calend/index',
        'material/index',
        'school/index',
        'enterSchool/index',
      ],
    },
    {
      root: 'myPages',
      pages: ['editNickName/index', 'editUserName/index', 'hearAnswer/index', 'hearResult/index'],
    },
    {
      root: 'wrongbook',
      pages: [
        'index/index',
        'record/index',
        'wrongList/index',
        'paperDetails/index',
        'wrongDetails/index',
        'photograph/index',
        'wrongQuestion/index',
        'success/index',
        'answerGraph/index',
        'answer/index',
        'examples/index',
        'examplesPic/index',
      ],
    },
    {
      root: 'photoCorrect',
      pages: ['index/index', 'photographPage/index', 'photographResult/index', 'swiper/index'],
    },
    {
      root: 'photoSearch',
      pages: [
        'index/index',
        'photographPage/index',
        'photoTaking/index',
        'singlePhotographResult/index',
        'wholePhotographResult/index',
        'examplesResult/index',
      ],
    },
    {
      root: 'essayCorrection',
      pages: [
        'index/index',
        'photographPage/index',
        'composition/index',
        'compositionResult/index',
        'photoTaking/index',
        'photoGraph/index',
        'compositionPicture/index',
      ],
    },
    //智能刷题
    {
      root: 'intelligentQuestion',
      pages: ['index/index', 'questionList/index', 'reportAnswer/index', 'reportAnalysis/index'],
    },
    {
      root: 'oralCorrection',
      pages: [
        'index/index',
        'correctionResults/index',
        'photographPage/index',
        'correctList/index',
      ],
    },
    {
      root: 'reciteWords',
      pages: [
        'index/index',
        'wordBook/index',
        'studyPlan/index',
        'editUpdate/index',
        'wordList/index',
        'learningWord/index',
        'complete/index',
        'updateBook/index',
        'chooseBook/index',
      ],
    },
    //口语测评
    {
      root: 'oralAssess',
      pages: ['index/index', 'collectList/index', 'assessResult/index', 'beginStudy/index'],
    },
    //语文听写训练
    {
      root: 'dictationExercise',
      pages: [
        'index/index',
        'traninSelect/index',
        'dictationBegin/index',
        'dicComplete/index',
        'dicGrades/index',
        'photograph/index',
        'demo/index',
        'webView/index',
      ],
    },
    //英语汉语字典
    {
      root: 'dictionary',
      pages: [
        'chineseIndex/index',
        'englishIndex/index',
        'searchChinese/index',
        'searchChineseResult/index',
        'chineseDetail/index',
        'wordBook/index',
        'searchEnglish/index',
        'searchEnglishResult/index',
        'chineseDetailScend/index',
        'englishDetail/index',
        'demo/index',
      ],
    },
    //答题PK
    {
      root: 'answerPk',
      pages: [
        'index/index',
        'opponent/index',
        'transition/index',
        'answer/index',
        'result/index',
        'ranking/index',
        'resultDetail/index',
      ],
    },
    //权威资料
    {
      root: 'authoritative',
      pages: ['index/index', 'paperDetail/index'],
    },
  ],
  lazyCodeLoading: 'requiredComponents',
})
