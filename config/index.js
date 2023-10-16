const path = require('path')
const args = process.argv
const isOpenDevTools = args.includes('--devtools')
console.log('🚀 ~ file: index.js:5 ~ process.env.NODE_ENV:', process.env.NODE_ENV)
const { version = '1.0.0', robot = 1 } = getEnvParams(args)
// const plugins = isOpenDevTools
//   ? ['@tarojs/plugin-html', '@tarojs/plugin-vue-devtools', 'taro-plugin-pinia']
//   : ['@tarojs/plugin-html', 'taro-plugin-pinia']
/**
 * 获取node命令行参数
 * @param {array} options 命令行数组
 */

function getEnvParams(options) {
  let envParams = {}

  // 从第三个参数开始,是自定义参数

  for (let i = 2, len = options.length; i < len; i++) {
    let arg = options[i].split('=')

    envParams[arg[0]] = arg[1]
  }
  return envParams
}

const CIPluginOpt = {
  weapp: {
    appid: 'wxe352f5ac707711e1',
    privateKeyPath: 'key/private.wxe352f5ac707711e1.key',
    robot,
  },
  // 版本号
  version,
  // 版本发布描述
  desc: `于${+new Date()}更新版本为${version}`,
}
const plugins = [
  '@tarojs/plugin-html',
  ['@tarojs/plugin-mini-ci', CIPluginOpt],
  'taro-plugin-pinia',
]
if (isOpenDevTools) {
  plugins.push('@tarojs/plugin-vue-devtools')
}

const config = {
  compiler: 'webpack5',
  cache: {
    enable: false,
  },
  projectName: 'SalesManagementSystem',
  date: '2023-01-30',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins,
  sass: {
    // 默认京东 APP 10.0主题 > @import "@nutui/nutui/dist/styles/variables.scss";
    // 京东科技主题 > @import "@nutui/nutui/dist/styles/variables-jdt.scss";
    // additionalData: `@import "@/assets/theme.scss";`
    resource: [
      path.resolve(__dirname, '..', 'src/styles/theme.scss'), // 预加载自定义的主题scss
    ],
    data: `@import "@nutui/nutui-taro/dist/styles/variables-jdt.scss";`,
  },

  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'vue3',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  } else if (process.env.NODE_ENV === 'stage') {
    return merge({}, config, require('./stage'))
  }
  return merge({}, config, require('./prod'))
}
