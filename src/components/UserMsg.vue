<script setup lang="ts">
defineProps<{
  userMsg?: {
    avatar: string
    name: string
    email: string
    note?: string
    source?: string
  }
  point?: {
    x: string
    y: string
  }
  isShowMsg: boolean
}>()
</script>

<template>
  <div
    class="user-message"
    :style="{ top: point?.y, left: point?.x }"
    v-if="isShowMsg"
  >
    <div class="message">
      <div class="avatar">
        <img :src="userMsg?.avatar" alt="" />
      </div>
      <div class="msg">
        <div class="name">
          <div class="label">昵称：</div>
          <div class="cnt">{{ userMsg?.name }}</div>
        </div>
        <div class="email">
          <div class="label">邮箱：</div>
          <div class="cnt">{{ userMsg?.email }}</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="note">
        <div class="label">备注名：</div>
        <div class="cnt">{{ userMsg?.note || '暂无' }}</div>
      </div>
      <div class="source">
        <div class="label">来源：</div>
        <div class="cnt">{{ userMsg?.source || '未知' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.user-message {
  position: fixed;
  width: 300px;
  box-sizing: border-box;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #eee;
  .message {
    display: flex;
    justify-content: space-between;
    .avatar {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
      }
    }
    .msg {
      flex: 1;
      line-height: 25px;
      font-size: 14px;
      color: #666;
      box-sizing: border-box;
      padding-left: 10px;
      .name,
      .email {
        display: flex;
        .label {
          width: 50px;
        }
        .cnt {
          flex: 1;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    margin-top: 20px;
    border-top: 1px solid #eee;
    padding-top: 20px;
    .note,
    .source {
      display: flex;
      line-height: 24px;
      font-size: 14px;
      color: #333;
      .label{
        width: 60px;
      }
    }
  }
}
</style>
