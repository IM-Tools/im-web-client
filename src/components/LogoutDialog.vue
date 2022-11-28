<template>
  <div class="box">
    <div class="title">安全提醒</div>
    <div class="point">你的账号在其他地方登录，请确定账号是否安全！</div>
    <div class="message">
      <div class="item">
        <div class="label">登录地址：</div>
        <div class="value">
          {{ logoutInfo && logoutInfo.pro }}-{{ logoutInfo && logoutInfo.city }}
        </div>
      </div>
      <div class="item">
        <div class="label">登录ip：</div>
        <div class="value">{{ logoutInfo && logoutInfo.ip }}</div>
      </div>
    </div>
    <div class="close">
      <div class="btn" @click="handleClose">确认</div>
    </div>
  </div>
  <div class="mask"></div>
</template>

<script lang="ts" setup>
import { mainStore } from '@/store'
import { computed } from '@vue/reactivity'
const store = mainStore()
const logoutInfo = computed(() => store.logoutInfo)
const handleClose = () => {
  store.clearMessage()
}
</script>
<style scoped lang="less">
.box {
  width: 400px;
  border-radius: 5px;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #e6a23c;
  z-index: 11;
  .title {
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    background-color: #e6a23c;
    color: #fff;
    line-height: 40px;
  }
  .point {
    color: #e6a23c;
    line-height: 30px;
    box-sizing: border-box;
    padding: 30px 15px;
  }
  .message {
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    padding: 0 15px;
    .item{
      display: flex;
      line-height: 30px;
      margin: 5px 0;
    }
  }
  .close {
    margin: 30px 0 20px;
    display: flex;
    justify-content: center;
    .btn {
      width: 100px;
      line-height: 35px;
      background-color: #e6a23c;
      color: #fff;
      text-align: center;
      border-radius: 5px;
      cursor: pointer;
      &:hover{
        background-color: #e69214;
      }
    }
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background-color: rgba(0,0,0,.5);
}
</style>
