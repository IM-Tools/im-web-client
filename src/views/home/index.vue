<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <div class="home"></div>
</template>

<style scoped lang="less">
.home{
  width: 100%;
  height: 100%;
  background-color: var(--theme-bgColor);
  border-radius: 3px;
}
</style>