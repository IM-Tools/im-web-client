<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { getUserList, recordFriend } from '@/api/friend'
import type { noFriendType } from '@/api/friend/type'
import { ElMessage, ElMessageBox } from 'element-plus'
const friendMsg = ref('')
// 获取非好友列表
const otherUserList = ref<noFriendType[]>([])
const getOtherUserList = () => {
  getUserList({
    email: friendMsg.value
  }).then((res) => {
    console.log(res)
    otherUserList.value = res
  })
}
onMounted(() => {
  getOtherUserList()
})
// 查询用户
const searchClick = () => {
  getOtherUserList()
}
// 关闭添加好友窗口
const emit = defineEmits(['closeAddFriend'])
const closeAddFriend = () => {
  console.log(222)
  emit('closeAddFriend')
}
// 添加好友
const addFriendClick = (user: noFriendType) => {
  ElMessageBox.prompt('请求描述', '添加好友', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      console.log(value)
      recordFriend({
        to_id: user.id,
        information: value ? value : '添加好友',
      }).then((res) => {
        console.log(res)
        ElMessage({
          type: 'success',
          message: '发送好友请求成功',
        })
      })
    })
    .catch(() => {})
}
</script>

<template>
  <div class="add-friend">
    <div class="head-title">
      <h3>添加好友</h3>
      <span @click="closeAddFriend"
        ><el-icon><Close /></el-icon
      ></span>
    </div>
    <div class="top">
      <div class="search-warp">
        <div class="search">
          <el-input v-model="friendMsg" placeholder="请输入用户邮箱" />
        </div>
        <div class="btn">
          <el-button type="primary" @click="searchClick">查询</el-button>
        </div>
      </div>
    </div>
    <div class="list">
      <p>好友推荐</p>
      <div class="friend-list">
        <ul>
          <li v-for="item in otherUserList" :key="item.id">
            <div class="img">
              <img :src="item.avatar" alt="" />
            </div>
            <div class="right">
              <div class="title">{{ item.name }}</div>
              <div class="msg">性别：{{ ['未知', '男', '女'][item.sex] }}</div>
              <div class="add" @click="addFriendClick(item)">+好友</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.add-friend {
  width: 900px;
  height: 600px;
  border-radius: 3px;
  overflow: hidden;
  background-color: var(--theme-bgColor);
  .head-title {
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: #4f6fc7;
    color: var(--size-color);
    position: relative;
    span {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 12px;
      right: 10px;
      font-size: 26px;
      cursor: pointer;
      &:hover {
        color: #ec6363;
      }
    }
  }
  .top {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    .search-warp {
      display: flex;
      width: 100%;
      .search {
        width: 490px;
        margin-right: 20px;
      }
    }
  }
  .list {
    margin-top: 10px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    p {
      width: 100%;
      font-size: 16px;
      color: var(--size-color);
    }
    .friend-list {
      width: 100%;
      height: 430px;
      overflow: hidden;
      overflow-y: auto;
      margin-top: 15px;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 25%;
          margin-bottom: 15px;
          display: flex;
          font-size: 14px;
          overflow: hidden;
          .img {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            background-color: var(--theme-bgColor);
            margin-right: 10px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .right {
            margin-top: -3px;
            width: calc(100% - 75px);
            box-sizing: border-box;
            padding-right: 15px;
            .title {
              color: var(--size-color);
              line-height: 24px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: no-warp;
            }
            .msg {
              color: var(--size-color);
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: no-warp;
            }
            .add {
              background-color: #70a8f7;
              padding: 4px 0;
              width: 56px;
              text-align: center;
              color: #fff;
              font-size: 12px;
              border-radius: 3px;
              margin-top: 5px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
