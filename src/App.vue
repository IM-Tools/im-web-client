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
  background-color: @mainColor;
  .main{
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
}
</style>
