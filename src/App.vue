<script setup lang="ts">
import Layout from '@/layout/index.vue'
import { mainStore } from './store';
const store = mainStore()
</script>

<template>
<div class="main" :class="store.themeSelect">
  <Layout v-if="$route.meta.isNav"></Layout>
  <RouterView v-else></RouterView>
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
