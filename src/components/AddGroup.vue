<script setup lang="ts">
import { Close, Search } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { friendList } from '@/api/friend'
import { computed } from '@vue/reactivity'
// 关闭添加窗口
const emit = defineEmits(['closeAddGroup'])
const closeAddGroup = () => {
  emit('closeAddGroup')
}
// 搜索用户名
const searchName = ref('')
function checkboxChange() {
  console.log(userList.value)
}
// 获得用户列表
const userList = ref()
function getUserList() {
  friendList().then((res) => {
    console.log(res)
    userList.value = res.map((item: any) => {
      item.checkType = false
      return item
    })
  })
}
// 选择用户列表
const selectUser = computed(() => {
  if (!userList.value) {
    return []
  }
  return userList.value.filter((item: any) => {
    return item.checkType
  })
})
onMounted(() => {
  getUserList()
})
// 创建
const password = ref('')
</script>

<template>
  <div class="group">
    <div class="close" @click="closeAddGroup">
      <el-icon><Close /></el-icon>
    </div>
    <div class="left">
      <div class="search">
        <el-input
          v-model="searchName"
          placeholder="请输入用户名"
          :prefix-icon="Search"
        />
      </div>
      <div class="user-list">
        <ul>
          <li v-for="user in userList" :key="user.id">
            <div class="user">
              <div class="avatar">
                <img :src="user.Users.avatar" alt="" />
              </div>
              <div class="name">{{ user.Users.name }}</div>
            </div>
            <div class="select">
              <el-checkbox
                v-model="user.checkType"
                @change="checkboxChange"
                size="large"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <p>
          {{
            selectUser.length > 0
              ? `您已选择${selectUser.length}位用户`
              : '请勾选需要添加的用户'
          }}
        </p>
      </div>
      <div class="select-users">
        <ul>
          <li v-for="user in selectUser" :key="user.id">
            <div class="user">
              <div class="avatar">
                <img :src="user.Users.avatar" alt="" />
              </div>
              <div class="name">{{ user.Users.name }}</div>
            </div>
            <div class="close"></div>
          </li>
        </ul>
      </div>
      <div class="tool">
        <div class="password">
          <div class="label">密码：</div>
          <div class="input">
            <el-input v-model="password" placeholder="加入群聊是否需要密码，选填" type="password" />
          </div>
        </div>
        <div class="btn">
          <el-button type="primary">确认</el-button>
          <el-button type="primary" plain @click="closeAddGroup">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.group {
  width: 880px;
  height: 570px;
  border-radius: 3px;
  overflow: hidden;
  background-color: #fff;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 10px 0px;
  .close {
    width: 35px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    font-size: 20px;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 99;
    cursor: pointer;
    &:hover {
      color: #eb1f1f;
    }
  }
  .left {
    flex: 2;
    overflow: hidden;
    box-sizing: border-box;
    padding: 5px 0;
    .search {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      margin-bottom: 10px;
      padding: 0px 20px;
    }
    .user-list {
      width: 100%;
      height: calc(100% - 50px);
      overflow-y: auto;
      box-sizing: border-box;
      padding: 10px 0;
      ul {
        width: 100%;
        li {
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding: 0px 20px;
          &:hover {
            background-color: #f5f5f5;
          }
          .user {
            display: flex;
            align-items: center;
            .avatar {
              width: 40px;
              height: 40px;
              overflow: hidden;
              img {
                width: 100%;
              }
            }
            .name {
              font-size: 14px;
              color: #333;
              margin-left: 5px;
            }
          }
          .select {
            .checkbox {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 1px solid #eee;
            }
          }
        }
      }
    }
  }
  .right {
    flex: 3;
    overflow: hidden;
    box-sizing: border-box;
    padding: 5px 20px;
    .top {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .select-users {
      height: calc(100% - 125px);
      overflow-y: auto;
      ul {
        width: 100%;
        li {
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding: 0px 20px;
          .user {
            display: flex;
            align-items: center;
            .avatar {
              width: 40px;
              height: 40px;
              overflow: hidden;
              img {
                width: 100%;
              }
            }
            .name {
              font-size: 14px;
              color: #333;
              margin-left: 5px;
            }
          }
          .select {
            .checkbox {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 1px solid #eee;
            }
          }
        }
      }
    }
    .tool {
      width: 100%;
      height: 80px;
      .password {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label{
          width: 60px;
        }
        .input{
          flex: 1;
        }
      }
      .btn {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
}
</style>
