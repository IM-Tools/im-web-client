<script setup lang="ts">
import { mainStore } from '@/store'
import { computed } from '@vue/reactivity'
// 获取用户信息
const store = mainStore()
const userInfo = computed(() => store.userInfo)
</script>

<template>
  <div class="user-info">
    <div class="img">
      <img :src="userInfo.avatar" alt="" />
    </div>
    <div class="msg">
      <div class="name">
        {{ userInfo.name }}
      </div>
      <div class="email">
        {{ userInfo.email }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.user-info {
  background-color: #fff;
  width: 250px;
  height: 100px;
  box-shadow: 0px 0px 3px #8c8c8c;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 15px 10px;
  .img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    border-radius: 5px;
    overflow: hidden;
    img{
      width: 100%;
    }
  }
  .msg {
    flex: 1;
    font-size: 14px;
    color: #666;
    line-height: 25px;
    .name {
      color: #333;
      font-weight: 700;
      margin: 5px 0;
    }
  }
}
</style>
