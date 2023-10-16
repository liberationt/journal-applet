<template>
  <view class="photoSearch">
    <view class="mainContent" :style="{ paddingTop: `${navBarHeight + 12}px` }">
      <NavBar :title="'身份认证'" />
      <view class="colorBlock"></view>
    </view>
    <view class="contentBox">
      <input type="text" v-model.trim="vdata.inputName" placeholder="请输入姓名" />
      <input type="text" v-model.trim="vdata.idCode" placeholder="请输入身份证号码" />
      <view class="submit" @tap="submit" :class="{ canClick: vdata.idCode && vdata.inputName }"
        >提交</view
      >
      <view class="reason">
        <view class="left"
          ><image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/d4ae97cb9e434a91b6a0b418cbe67d1b/idCodeIcon.png"
          ></image
        ></view>
        <view class="right">
          <view class="title">为什么要认证身份？</view>
          <view class="detail"
            >认证是遵循国家双减政策的需要，我们希望未成年学生能在家长认同及监督下合理使用，以免惰化思维能力，身份认证主要是判断是否为成年人。</view
          >
        </view>
      </view>
      <view class="reason">
        <view class="left"
          ><image
            src="https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/a/d42ec10988dd4c73984b7904498943c8/guarantee.png"
          ></image
        ></view>
        <view class="right">
          <view class="title">能保障身份信息的安全吗？</view>
          <view class="detail"
            >家长认证由公安系统（阿里云身份认证系统https://market.aliyun.com）完成，北方期刊不会获取任何用户信息，请您放心填写。</view
          >
        </view>
      </view>
    </view>
    <searchResultPopup ref="popupShow"></searchResultPopup>
    <!-- <nut-overlay
      v-model:visible="vdata.camera"
      :lock-scroll="true"
      :overlay-style="vdata.overlayStyle"
    >
      <view class="cameraMain">
        <view class="title">相机权限</view>
        <view>请在「设置」选项中</view>
        <view>允许小程序访问您的摄像头</view>
        <view class="authSetting" @tap="setCamera">去开启摄像头权限</view>
      </view>
    </nut-overlay> -->
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import searchResultPopup from '@/components/searchResultPopup.vue'
import Taro from '@tarojs/taro'
import { getValidAuth } from '@/api/photoSearch'
// import { getUserInfo } from '@/api/user'
import { useUser } from '@/stores'
const user = useUser()
import { reactive, ref, onMounted } from 'vue'
import { useSystem } from '@/stores'
const system = useSystem()
const { navBarHeight } = system.navBarInfo
const popupShow = ref()
const vdata: any = reactive({
  overlayStyle: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  camera: false,
  inputName: '',
  idCode: '', //  433122197608089014
})
onMounted(() => {
  // popupShow.value.popupShow()
})
// 打开授权
// const setCamera = () => {
//   Taro.openSetting({
//     success: function (res) {
//       console.log(res.authSetting)
//       res.authSetting = {
//         'scope.userInfo': true,
//         'scope.userLocation': true,
//       }
//     },
//   })
// }
/**
 * 根据身份证号得到姓别和精确计算年龄
 */
const analyzeIDCard = (IDCard) => {
  //获取用户身份证号码
  var userCard = IDCard
  //获取出生年月日
  var yearBirth = userCard.substring(6, 10)
  var monthBirth = userCard.substring(10, 12)
  var dayBirth = userCard.substring(12, 14)
  //获取当前年月日并计算年龄
  var myDate = new Date()
  var monthNow = myDate.getMonth() + 1
  var dayNow = myDate.getDate()
  var age = myDate.getFullYear() - yearBirth
  if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
    age--
  }
  if (age >= 18) {
    return true
  }
  return false
}
//验证身份证的合法性

function IdentityCodeValid(idCard) {
  var ret = false
  var w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  if (idCard.length == 18) {
    //身份证号码长度必须为18，只要校验位正确就算合法
    var crc = idCard.substring(17)
    var a = new Array()
    var sum = 0
    for (var i = 0; i < 17; i++) {
      a.push(idCard.substring(i, i + 1))
      sum += parseInt(a[i], 10) * parseInt(w[i], 10)
      //alert(a[i]);
    }
    sum %= 11
    var res = '-1'
    switch (sum) {
      case 0: {
        res = '1'
        break
      }
      case 1: {
        res = '0'
        break
      }
      case 2: {
        res = 'X'
        break
      }
      case 3: {
        res = '9'
        break
      }
      case 4: {
        res = '8'
        break
      }
      case 5: {
        res = '7'
        break
      }
      case 6: {
        res = '6'
        break
      }
      case 7: {
        res = '5'
        break
      }
      case 8: {
        res = '4'
        break
      }
      case 9: {
        res = '3'
        break
      }
      case 10: {
        res = '2'
        break
      }
    }
    if (crc.toLowerCase() == res.toLowerCase()) {
      ret = true
    }
    //ret=true;
  }
  /*
		   else if(idCard.length == 15){
		        //15位的身份证号，只验证是否全为数字
		        var pattern = /\d/;
		        ret=pattern.test(idCard);
		   }*/
  return ret
}
// const getNorthQuestionLibrary = async () => {
//   let
//   const getValidAuth = await getValidAuth()
// }
const submit = async () => {
  if (!vdata.inputName)
    return Taro.showToast({
      title: '请输入姓名',
      icon: 'none',
      duration: 1000,
    })
  if (!vdata.idCode)
    return Taro.showToast({
      title: '请输入身份证号',
      icon: 'none',
      duration: 1000,
    })
  console.log(IdentityCodeValid(vdata.idCode), 'vdata.idCode=====')
  // if (!IdentityCodeValid(vdata.idCode))
  //   return Taro.showToast({
  //     title: '身份信息不正确',
  //     icon: 'none',
  //     duration: 1000,
  //   })
  // if (!analyzeIDCard(vdata.idCode))
  //   return Taro.showToast({
  //     title: '请使用成年人身份证',
  //     icon: 'none',
  //     duration: 1000,
  //   })

  let req = {
    id: vdata.idCode,
    name: vdata.inputName,
  }
  console.log(req, '入参============')
  const res = await getValidAuth(req)
  console.log(res, '========res')
  if (res.code === 1) {
    return Taro.showToast({
      title: res.msg,
      icon: 'none',
      duration: 1000,
    })
  }
  user.setUserInfo()
  // Taro.getSetting({
  //   success: function (res) {
  //     if (!res.authSetting['scope.camera']) {
  //       if (!Taro.getStorageSync('camera')) {
  //         Taro.authorize({
  //           scope: 'scope.camera',
  //           success: function () {
  //             Taro.setStorageSync('camera', 1)
  //             Taro.redirectTo({
  //               url: '/photoSearch/photographPage/index',
  //             })
  //           },
  //           fail: function () {
  //             Taro.setStorageSync('camera', 1)
  //           },
  //         })
  //       } else {
  //         vdata.camera = true
  //       }
  //     } else {
  //       Taro.redirectTo({
  //         url: '/photoSearch/photographPage/index',
  //       })
  //     }
  //   },
  // })
  return Taro.redirectTo({
    url: '/photoSearch/photographPage/index',
  })
}
</script>

<style lang="scss">
.photoSearch {
  background: url('https://dcg-c-system.obs.cn-east-3.myhuaweicloud.com/mb/b49b51a395224737bc0cc35340739195/memberBg.png')
    no-repeat top;
  background-size: 100%;
  box-sizing: border-box;
  .cameraMain {
    background: #fff;
    width: 265px;
    height: 192px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: normal;
    color: #999999;
    .title {
      font-family: PingFang SC;
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 14px;
    }
    .authSetting {
      width: 162px;
      height: 40px;
      border-radius: 21px;
      background: #2f5de7;
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      line-height: 40px;
      margin-top: 22px;
    }
  }
  .mainContent {
    display: flex;
    box-sizing: border-box;
    height: 120px;
    position: relative;
    .colorBlock {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 20px;
      width: 100%;
      background: #fff;
      border-radius: 15px 15px 0 0;
    }
  }
  .contentBox {
    background: #fff;
    padding: 10px 26px 0 25px;
    input {
      height: 50px;
      border-radius: 90px;
      opacity: 1;
      padding-left: 20px;
      background: #f8f8f8;
      font-size: 15px;
      color: #333333;
      margin-bottom: 20px;
    }
    .input-placeholder {
      color: #c8c8c8;
    }
    .submit {
      margin-top: 30px;
      margin-bottom: 48px;
      height: 50px;
      border-radius: 90px;
      background: #d9d9d9;
      text-align: center;
      line-height: 50px;
      color: #ffffff;
    }
    .canClick {
      background: #2f5de7;
    }
    .reason {
      margin-bottom: 20px;
      height: 136px;
      border-radius: 10px;
      background: #fafafa;
      .left {
        width: 80px;
        height: 136px;
        line-height: 136px;
        padding-left: 15px;
        position: relative;
        display: inline-block;
        vertical-align: middle;
        image {
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          width: 40px;
          height: 33px;
        }
      }
      .right {
        vertical-align: middle;
        display: inline-block;
        width: 225px;
        height: 136px;
        .title {
          font-size: 15px;
          font-weight: 600;
          color: #333333;
          padding: 17px 0 10px;
        }
        .detail {
          font-size: 12px;
          line-height: 18px;
          color: #666666;
        }
      }
    }
  }
}
</style>
