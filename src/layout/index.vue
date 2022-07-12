<script setup lang="ts">

</script>

<template>
<div class="layout">
  <div class="nav">
    <div class="avatar">
      <div class="img">
        <img src="@/assets/images/logo.png" alt="">
      </div>
    </div>
    <ul>
      <li><el-icon><ChatDotRound /></el-icon></li>
      <li><el-icon><User /></el-icon></li>
    </ul>
    <div class="tool">
      设置
    </div>
  </div>
  <div class="content">
    <RouterView></RouterView>
  </div>
</div>
</template>

<style scoped lang="less">
.layout{
  display: flex;
  width: 100%;
  height: 100%;
  .nav{
    width: 60px;
    height: 100%;
    background-color: var(--nav-color);
    .avatar{
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      padding: 3px;
      background-color: #afb5fa;
      box-sizing: border-box;
      margin: 10px 5px;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .content{
    flex: 1;
    height: 100%;
    background-color: var(--content-color);
  }
}
</style>
