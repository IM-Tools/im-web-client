<script setup lang="ts">
import Layout from '@/layout/index.vue'
import { computed, onMounted } from 'vue'
import { mainStore } from './store'
import LogoutDialog from '@/components/LogoutDialog.vue'
import Push from 'push.js'
const store = mainStore()
const isLogout = computed(() => store.isLogout)
onMounted(() => {
  if (!Push.Permission.has()) {
    Push.Permission.request(
      () => {
        console.log('同意')
        store.changePermission(true)
      },
      () => {
        console.log('拒绝')
        store.changePermission(false)
      }
    )
  }
})
</script>

<template>
<div class="main" :class="store.themeSelect">
  <Layout v-if="$route.meta.isNav"></Layout>
  <RouterView v-else></RouterView>
  <LogoutDialog v-if="isLogout"></LogoutDialog>
</div>
</template>

<style lang="less">
@import '@/assets/css/index.less';
body{
  background-color: var(--theme-bgColor);
  .main{
    width: 100%;
    height: 100vh;
    overflow: hidden;
  
  }
  .el-input__wrapper{
  background-color: var(--input-bgColor) !important;
  box-shadow:none !important;
}
.is-focus{
    box-shadow: 0 0 0 1px var(--select-inputColor) inset !important;
  }
  .el-input__inner{
    background-color: var(--input-bgColor) !important;
  }
}
</style>
