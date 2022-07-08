<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <p>123456</p>
  <h1>{{ count }}</h1>
</template>

<style scoped lang="less">
.test{
  width: 100%;
  color: red;
  background-color: var(--theme-bgColor);
  p{
    font-size: 16px;
  }
}

</style>