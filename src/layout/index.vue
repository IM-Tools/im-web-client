<script setup lang="ts">
import { User, ChatDotRound } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { mainStore } from '@/store';
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
      <li @click="navClick('session')" :class="{select: $route.path === '/session'}"><el-icon><ChatDotRound /></el-icon></li>
      <li @click="navClick('address')" :class="{select: $route.path === '/address'}"><el-icon><User /></el-icon></li>
    </ul>
    <!-- <div class="tool">
      设置
    </div> -->
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
      }
      .select{
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
