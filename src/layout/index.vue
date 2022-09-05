<script setup lang="ts">
import { User, ChatDotRound,Setting } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { mainStore } from '@/store';
import { initWebsocket } from '@/utils/socket'
// 获取用户信息
const store = mainStore()
const userInfo = store.userInfo
const router = useRouter()
// 路由跳转
const navClick = (path: string) => {
  router.push({
    path: path
  })
}
// 退出登录
const logOutClick = () => {
  store.logOut()
  router.push({
    path: '/login'
  })
}
// websocket 链接
initWebsocket(() => {
  console.log('连接成功');
},() => {
  console.log('连接失败');
})
</script>

<template>
<div class="layout">
  <div class="nav">
    <div class="avatar">
      <div class="img">
        <img :src="userInfo.avatar" alt="">
      </div>
    </div>
    <ul>
      <li title="聊天" @click="navClick('/session')" :class="{select: $route.path === '/session'}"><el-icon><ChatDotRound /></el-icon></li>
      <li title="通讯录" @click="navClick('/address')" :class="{select: $route.path === '/address'}"><el-icon><User /></el-icon></li>
    </ul>
    <div class="tool" title="退出登录" @click="logOutClick">
      <el-icon><Setting /></el-icon>
    </div>
  </div>
  <div class="content">
    <RouterView></RouterView>
  </div>
</div>
</template>

<style scoped lang="less">
.layout{
  display: flex;
  width: 100%;
  height: 100%;
  .nav{
    width: 55px;
    height: 100%;
    background-color: var(--nav-color);
    position: relative;
    .avatar{
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      padding: 3px;
      background-color: #afb5fa;
      box-sizing: border-box;
      margin: 10px auto;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    ul{
      li{
        width: 40px;
        height: 40px;
        // background-color: #cccff5;
        font-size: 26px;
        margin: 5px auto;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--icon-color);
        cursor: pointer;
      }
      .select{
        color: var(--icon-select-color);
      }
    }
    .tool{
      position: absolute;
      left: 50%;
      bottom: 5px;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      font-size: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--icon-color);
      cursor: pointer;
      &:hover{
        color: var(--icon-select-color);
      }
    }
  }
  .content{
    flex: 1;
    height: 100%;
    background-color: var(--content-color);
  }
}
</style>
