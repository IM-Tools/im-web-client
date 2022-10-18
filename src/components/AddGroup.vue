<script setup lang="ts">
import { Close, Search } from '@element-plus/icons-vue'
import { onMounted, ref, reactive, watch } from 'vue'
import { friendList } from '@/api/friend'
import { computed } from '@vue/reactivity'
import { createGroup } from '@/api/group'
import { drawAvatar } from '@/utils/index'
import { mainStore, sessionStore } from '@/store'
import { uploadFile } from '@/api/chat'
import { createGroupDataType } from '@/api/group/type'
import { createSession } from '@/api/session'
// 关闭添加窗口
const emit = defineEmits(['closeAddGroup'])
const closeAddGroup = () => {
  emit('closeAddGroup')
}
// 搜索用户名
const searchName = ref('')
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
function removeUser(id: number) {
  userList.value.map((user: any) => {
    if (user.id === id) {
      user.checkType = false
    }
  })
}
// 监听用户选择，生成头像
// 获取用户信息
const store = mainStore()
const userInfo = computed(() => store.userInfo)
const userAvatar = ref('')
const blobFile = ref()
function getImgUrl(url: string, blob: any) {
  blobFile.value = blob
  console.log(blobFile.value)

  userAvatar.value = url
}
watch(
  () => selectUser.value,
  () => {
    const avatarList: string[] = selectUser.value.map((item: any) => {
      return item.Users.avatar
    })
    drawAvatar([...avatarList, userInfo.value.avatar], getImgUrl)
  }
)
onMounted(() => {
  getUserList()
})
// 创建
const themeList = ref<string[]>([
  '电影',
  '程序人生',
  '读书',
  '游戏',
  '运动',
  '地区交友',
  '社团',
  '朋友家人',
  '圈子',
])
const selectTheme = ref<string[]>([])
const createInfo: createGroupDataType = reactive({
  name: '',
  info: '',
  avatar: '',
  password: '',
  is_pwd: 0,
  theme: '',
  select_user: [],
})
function selectThemeClick(theme: string) {
  if (selectTheme.value.indexOf(theme) !== -1) {
    const idx = selectTheme.value.indexOf(theme)
    selectTheme.value.splice(idx, 1)
    return
  }
  selectTheme.value.push(theme)
}
const mySessionStore = sessionStore()
const confirmAddGroup = async () => {
  const fileOfBlob = new File([blobFile.value], new Date().getTime() + '.png')
  const res = await uploadFile({ file: fileOfBlob })
  createInfo.avatar = res.file_url
  createInfo.is_pwd = !createInfo.password ? 0 : 1
  createInfo.theme = selectTheme.value.toString()
  createInfo.select_user = selectUser.value.map((item: any) => {
    return item.id
  })
  createGroup(createInfo).then((res: any) => {
    console.log(res)
    emit('closeAddGroup')
    // createSession({
    //   id: res.id,
    //   type: 2,
    // }).then((res) => {
    //   console.log(res)
    //   mySessionStore.changeSessionList(res, 'add')
    //   emit('closeAddGroup')
    // })
  })
}
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
              <el-checkbox v-model="user.checkType" size="large" />
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
      <div class="cnt">
        <div class="select-users">
          <ul>
            <li v-for="user in selectUser" :key="user.id">
              <div class="user">
                <div class="avatar">
                  <img :src="user.Users.avatar" alt="" />
                </div>
                <div class="name">{{ user.Users.name }}</div>
              </div>
              <div class="remove" @click="removeUser(user.id)">
                <el-icon><Close /></el-icon>
              </div>
            </li>
          </ul>
        </div>
        <div class="message">
          <div class="option">
            <div class="label">群头像：</div>
            <div class="input">
              <div class="img" v-show="userAvatar">
                <img :src="userAvatar" alt="" />
              </div>
            </div>
          </div>
          <div class="option">
            <div class="label">群名称：</div>
            <div class="input">
              <el-input v-model="createInfo.name" placeholder="请输入群名称" />
            </div>
          </div>
          <div class="option">
            <div class="label">描述：</div>
            <div class="input">
              <el-input
                v-model="createInfo.info"
                type="textarea"
                placeholder="请输入群描述"
                :rows="5"
              />
            </div>
          </div>
          <div class="option">
            <div class="label">标签：</div>
            <div class="input">
              <ul>
                <li
                  v-for="(item, index) in themeList"
                  @click="selectThemeClick(item)"
                  :class="{ active: selectTheme.indexOf(item) !== -1 }"
                  :key="index"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
          <div class="option">
            <div class="label">群密码：</div>
            <div class="input">
              <el-input
                v-model="createInfo.password"
                placeholder="加入群聊密码，选填"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="tool">
        <div class="btn">
          <el-button
            type="primary"
            :disabled="selectUser.length <= 0"
            @click="confirmAddGroup"
            >创建</el-button
          >
          <el-button type="primary" plain @click="closeAddGroup"
            >取消</el-button
          >
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
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 9999;
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
    border-right: 1px solid #eee;
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
    .cnt {
      width: 100%;
      display: flex;
      height: calc(100% - 85px);
    }
    .select-users {
      height: 100%;
      width: 280px;
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
          .remove {
            width: 20px;
            height: 20px;
            background-color: #dfdfdf;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            &:hover {
              background-color: #d4d4d4;
            }
          }
        }
      }
    }
    .message {
      flex: 1;
      width: 100%;
      border-left: 1px solid #eee;
      box-sizing: border-box;
      padding-left: 10px;
      .option {
        width: 100%;
        display: flex;
        justify-content: space-between;
        color: #333;
        margin-bottom: 10px;
        .label {
          width: 60px;
          font-size: 14px;
          line-height: 30px;
        }
        .input {
          flex: 1;
          font-size: 14px;
          ul {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            li {
              margin: 5px;
              padding: 3px 5px;
              border-radius: 3px;
              border: 1px solid #76c1ff;
              color: #76c1ff;
              cursor: pointer;
            }
            .active {
              background-color: #76c1ff;
              color: #fff;
            }
          }
          .img {
            width: 60px;
            height: 60px;
            padding: 3px;
            box-sizing: border-box;
            background-color: #e3e4e6;
            img {
              width: 100%;
            }
          }
        }
      }
    }
    .tool {
      width: 100%;
      height: 40px;

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
