<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <p>123456</p>
  <h1>{{ count }}</h1>
  <img src="@/assets/images/logo.png" alt="">
  <div class="test">
    <p>123</p>
  </div>
</template>

<style scoped lang="less">
.test{
  width: 100%;
  color: red;
  p{
    font-size: 16px;
  }
}
</style>