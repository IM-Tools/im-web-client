<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <div class="session">
    <div class="session-list">
      <ul>
        <li>会话一</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
.session{
  width: 100%;
  height: 100%;
  background-color: pink;
}
</style>