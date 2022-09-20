<script setup lang="ts">
import { User, ChatDotRound, Setting } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mainStore } from '@/store'
import { initWebsocket } from '@/utils/socket'
import UserInfo from './components/UserInfo.vue'
// 获取用户信息
const store = mainStore()
const pointType = computed(() => store.pointType)
const userInfo = computed(() => store.userInfo)
const router = useRouter()
// 路由跳转
const navClick = (path: string) => {
  store.changPoint(path, false)
  router.push({
    path: '/' + path,
  })
}
// 退出登录
const logOutClick = () => {
  store.logOut()
  router.push({
    path: '/login',
  })
}
const isShow = ref<boolean>(false)
function showInfoClick() {
  isShow.value = !isShow.value
}

// websocket 链接
initWebsocket(
  () => {
    console.log('连接成功')
  },
  () => {
    console.log('连接失败')
  }
)
</script>

<template>
  <div class="layout">
    <div class="nav">
      <div class="avatar" @click="showInfoClick">
        <div class="img">
          <img :src="userInfo.avatar" alt="" />
        </div>
        <div class="message" v-show="isShow">
          <UserInfo></UserInfo>
        </div>
      </div>
      <ul @click="isShow = false">
        <li
          title="聊天"
          @click="navClick('session')"
          :class="{ select: $route.path === '/session' }"
        >
          <el-icon><ChatDotRound /></el-icon>
          <div class="point" v-if="pointType.session"></div>
        </li>
        <li
          title="通讯录"
          @click="navClick('address')"
          :class="{ select: $route.path === '/address' }"
        >
          <el-icon><User /></el-icon>
          <div class="point" v-if="pointType.address"></div>
        </li>
      </ul>
      <div class="tool" title="退出登录" @click="logOutClick">
        <el-icon><Setting /></el-icon>
      </div>
    </div>
    <div class="content" @click="isShow = false">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped lang="less">
.layout {
  display: flex;
  width: 100%;
  height: 100%;
  .nav {
    width: 55px;
    height: 100%;
    background-color: var(--nav-color);
    position: relative;
    .avatar {
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
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .message {
      position: absolute;
      top: 10px;
      left: 60px;
      background-color: #fff;
      z-index: 999;
    }
    ul {
      li {
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
        position: relative;
        .point {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 10px;
          height: 10px;
          background-color: red;
          border-radius: 50%;
        }
      }
      .select {
        color: var(--icon-select-color);
      }
    }
    .tool {
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
      &:hover {
        color: var(--icon-select-color);
      }
    }
  }
  .content {
    flex: 1;
    height: 100%;
    background-color: var(--content-color);
  }
}
</style>
