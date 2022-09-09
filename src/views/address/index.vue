<script setup lang="ts">
import { ref } from 'vue'
// icon图标
import { Search, Plus } from '@element-plus/icons-vue'
import { friendRecordList, friendRecord } from '@/api/friend'
import { createSession } from '@/api/session'
import { sessionStore } from '@/store/session'
import { mainStore, userStore } from '@/store'
import { computed } from '@vue/reactivity'
import type { requestListType, userType, friendType } from '@/api/friend/type'
import type { menuType } from '@/directive/type'
import AddFriend from '@/components/AddFriend.vue'
const usersStore = userStore()
// 获取用户信息
const baseStore = mainStore()
const userInfo = baseStore.userInfo
// 是否添加好友
const isAddFriend = ref(false)
const addBtnClick = () => {
  isAddFriend.value = true
}
// 关闭添加好友
const closeAddFriend = () => {
  isAddFriend.value = false
}
const store = sessionStore()
// 搜索内容
const searchCnt = ref<string>()

// 用户点击事件
const userClick = (user: friendType<userType>) => {
  console.log(user)

  usersStore.setSelectName('userList')
  usersStore.setSelectUser(user)
  // userMessage.value = user
  // console.log(user);
}
// 请求列表
const requestList = ref<requestListType<userType>[]>()
const newFriendClick = async () => {
  usersStore.setSelectName('newFriend')
  // 获得好友请求列表
  friendRecordList().then((res) => {
    console.log(res)
    requestList.value = res.filter((item) => {
      return item.form_id !== userInfo.id
    })
  })
}

// 获取请求列表
usersStore.setUserList()
// 获取选中名
const selectName = computed(() => usersStore.selectName)
// 获取选中好友
const userMessage = computed(() => usersStore.selectUser)
// 获取好友列表
const myFriendList = computed(() => usersStore.userList)
if (selectName.value === 'newFriend') {
  newFriendClick()
}

// 同意/拒绝好友请求
const friendRequestClick = (id: number, num: number) => {
  friendRecord({
    id: id,
    status: num,
  }).then((res) => {
    console.log(res);
    
    newFriendClick()
    // if (num === 1) {
    //   usersStore.changeUserList(res)
    // }
  })
}

// 创建会话
const cleartSession = () => {
  console.log('创建会话')
  if(!userMessage.value){
    return
  }
  createSession({
    id: userMessage.value.Users.id,
    type: 1,
  }).then((res) => {
    console.log(res)
    store.changeSessionList(res, 'add')
  })
}
// 右键菜单
const menuLists = ref<menuType[]>([
  {
    name: '置顶',
    method: (item: friendType<userType>) => {
      console.log(item)
    },
  },
  {
    name: '删除',
    method: (item: friendType<userType>) => {
      console.log(item)
      usersStore.changeUserList(item, 'delete')
    },
  },
])
</script>

<template>
  <div class="session">
    <div class="session-list">
      <div class="search">
        <div class="cnt">
          <el-input
            v-model="searchCnt"
            class="w-50 m-2"
            placeholder="搜索"
            :prefix-icon="Search"
          />
        </div>
        <div class="add" @click="addBtnClick">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
      <div class="list">
        <div class="new-friend" @click="newFriendClick">
          <p>新的朋友</p>
          <div
            class="add-friend"
            :class="{ select: selectName === 'newFriend' }"
          >
            <div class="icon">
              <svg-icon name="add" color="#fff" />
            </div>
            <p>新的朋友</p>
          </div>
        </div>
        <ul>
          <li
            v-for="item in myFriendList"
            :key="item.id"
            :class="{
              select: selectName !== 'newFriend' && userMessage?.id === item.id,
            }"
            @click="userClick(item)"
            v-customMenu="{ menuLists, val: item }"
          >
            <div class="img">
              <img :src="item.Users.avatar" alt="" />
            </div>
            <div class="user">
              <div class="name">{{ item.Users.name }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="session-cnt">
      <div class="chat-top"></div>
      <div class="user-message">
        <div class="box" v-if="selectName !== 'newFriend' && userMessage && userMessage.Users">
          <div class="message">
            <div class="avatar">
              <img :src="userMessage.Users.avatar" alt="" />
            </div>
            <div class="user-info">
              <div class="name">{{ userMessage.Users.name }}</div>
              <div class="account">邮箱：{{ userMessage.Users.email }}</div>
              <div class="address">
                性别：{{
                  ['未知', '男', '女'][userMessage.Users.sex as number]
                }}
              </div>
            </div>
          </div>
          <ul>
            <li><span>昵称:</span> {{ userMessage.note || '暂无' }}</li>
            <li>
              <span>最后登录时间:</span>
              {{ userMessage.Users.last_login_time }}
            </li>
          </ul>
          <div class="send">
            <el-button type="primary" @click="cleartSession">发消息</el-button>
          </div>
        </div>
        <div class="box" v-if="selectName !== 'newFriend' && !userMessage">
          <div class="message">
            <img src="@/assets/images/none.png" alt="">
          </div>
          <p style="text-align: center;font-size: 14px; color: #999;">暂无选择信息</p>
        </div>
        <div class="friend-request-list"  v-if="selectName === 'newFriend'">
          <div class="title">
            <h2>新的朋友</h2>
          </div>
          <ul>
            <li v-for="item in requestList" :key="item.id">
              <div class="img">
                <img :src="item.users.avatar" alt="" />
              </div>
              <div class="cnt">
                <div class="name">{{ item.users.name }}</div>
                <p class="desc">{{ item.information }}</p>
              </div>
              <div class="tool">
                <div
                  class="agree"
                  v-if="item.status === 0"
                  @click="friendRequestClick(item.id, 1)"
                >
                  接受
                </div>
                <div
                  class="cancel"
                  v-if="item.status === 0"
                  @click="friendRequestClick(item.id, 2)"
                >
                  拒绝
                </div>
                <p v-if="item.status === 1">已添加</p>
                <p v-if="item.status === 2">已拒绝</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="add-friend-box" v-if="isAddFriend">
    <AddFriend @closeAddFriend="closeAddFriend"></AddFriend>
  </div>
  <div class="mask" v-if="isAddFriend"></div>
</template>

<style scoped lang="less">
.session {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .session-list {
    width: 250px;
    height: 100%;
    .search {
      display: flex;
      height: 50px;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: 0 10px;
      background-color: #f9f9f9;
      .cnt {
        margin-right: 10px;
      }
      .add {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e6e6e6;
        cursor: pointer;
        &:hover {
          background-color: #dad8d8;
        }
      }
    }
    .list {
      height: calc(100% - 50px);
      overflow: hidden;
      overflow-y: auto;
      padding: 0 0 10px;
      box-sizing: border-box;
      .new-friend {
        width: 100%;
        height: 80px;
        margin-top: 10px;
        & > p {
          font-size: 12px;
          color: #999;
          line-height: 20px;
          box-sizing: border-box;
          padding: 0 15px;
        }
        .add-friend {
          display: flex;
          align-items: center;
          width: 100%;
          height: 55px;
          box-sizing: border-box;
          padding: 0 15px;
          cursor: pointer;
          &:hover {
            background-color: #e2e2e2;
          }
          .icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #cf7f23;
            border-radius: 3px;
          }
          p {
            font-size: 16px;
            color: #333;
            padding-left: 10px;
          }
        }
        .select {
          background-color: #cfcfcf !important;
        }
      }
      ul {
        li {
          width: 100%;
          display: flex;
          padding: 0 10px;
          box-sizing: border-box;
          height: 55px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:hover {
            background-color: #e2e2e2;
          }
          .img {
            width: 45px;
            height: 45px;
            overflow: hidden;
            background-color: #e3e4e6;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .user {
            width: 180px;
            line-height: 25px;
            box-sizing: border-box;
            padding: 0 10px;
            .name {
              font-size: 16px;
              font-weight: 700;
              display: flex;
              justify-content: space-between;
            }
          }
        }
        .select {
          background-color: #cfcfcf !important;
        }
      }
    }
  }
  .session-cnt {
    flex: 1;
    height: 100%;
    background-color: #f9f9f9;
    border-left: 1px solid #e8eaec;
    .chat-top {
      height: 50px;
      width: 100%;
      border-bottom: 1px solid #e8eaec;
      box-sizing: border-box;
    }
    .user-message {
      width: 100%;
      height: calc(100% - 50px);
      padding: 20px 10px;
      box-sizing: border-box;
      overflow-y: auto;
      position: relative;
      .box {
        width: 300px;
        min-height: 300px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .message {
          display: flex;
          .avatar {
            width: 70px;
            height: 70px;
            background-color: #e8eaec;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .user-info {
            flex: 1;
            padding-left: 10px;
            line-height: 22px;
            font-size: 14px;
            color: #333;
            .name {
              font-size: 16px;
              line-height: 26px;
              font-weight: 700;
              color: #333;
            }
          }
        }
        ul {
          line-height: 30px;
          font-size: 14px;
          color: #555;
          padding: 10px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          margin-top: 15px;
          li {
            width: 100%;
            span {
              display: inline-block;
              width: 100px;
            }
          }
        }
        .send {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
      }
      .friend-request-list {
        width: 100%;
        .title {
          width: 100%;
          border-bottom: 1px solid #eee;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          color: #333;
          h2 {
            font-weight: normal;
          }
        }
        ul {
          width: 100%;
          box-sizing: border-box;
          padding: 0 30px;
          li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 75px;
            border-bottom: 1px solid #eee;
            .img {
              width: 55px;
              height: 55px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background-color: #d1d4f5;
              border-radius: 3px;
              img {
                width: 100%;
              }
            }
            .cnt {
              flex: 1;
              margin: 0 10px;
              .name {
                width: 100%;
                font-size: 14px;
                color: #222;
                line-height: 25px;
              }
              .desc {
                font-size: 12px;
                color: #666;
                line-height: 20px;
              }
            }
            .tool {
              width: 80px;
              height: 60px;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: center;
              .agree,
              .cancel {
                width: 60px;
                height: 26px;
                text-align: center;
                line-height: 26px;
                font-size: 12px;
                background-color: #78d888;
                color: #fff;
                border-radius: 3px;
                cursor: pointer;
              }
              .cancel {
                background-color: #d3874a;
              }
              p {
                font-size: 14px;
                color: #555;
              }
            }
          }
        }
      }
    }
  }
}
.add-friend-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
