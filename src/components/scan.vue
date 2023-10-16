<template>
  <view class="scan"></view>
</template>
<style lang="scss">
@keyframes scan {
  0% {
    left: 0px;
    top: 0;
  }
  to {
    left: 0px;
    top: 100vh;
  }
}
.scan {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 1;
  border-bottom: 3px solid #fff;
  -webkit-animation: scan 1.5s infinite;
  -moz-animation: scan 1.5s infinite;
  animation: scan 1.5s infinite;
  background: -webkit-gradient(linear, left top, left bottom, from(transparent), to(#fff));
  background: -webkit-linear-gradient(top, transparent, #fff);
  background: -moz-linear-gradient(top, transparent, #fff);
  background: linear-gradient(180deg, transparent, #fff);
}
</style>
