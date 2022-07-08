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
body{
  background-color: #828cf6;
  .main{
    position: absolute;
    width: 1200px;
    height: 700px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: yellow;
    border-radius: 5px;
  }
}
</style>
