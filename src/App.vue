<script setup lang="ts">
import { mainStore } from './store';
const store = mainStore()

</script>

<template>
<div class="main" :class="store.themeSelect">
  <RouterView></RouterView>
</div>
</template>

<style lang="less">
@import '@/assets/css/index.less';
body{
  background-color: @mainColor;
  .main{
    position: absolute;
    width: 1200px;
    height: 700px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 5px;
  }
}
</style>
