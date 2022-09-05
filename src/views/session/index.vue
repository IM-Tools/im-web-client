<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue'
import { sessionStore } from '@/store/session'
import { mainStore } from '@/store'
// icon图标
import { Search, Plus, Picture,Folder } from '@element-plus/icons-vue'
import { computed } from '@vue/reactivity'
import { sendChatMessage, uploadFile } from '@/api/chat'
import type { userType, sessionType } from '@/api/session/type'
import { timestampChange } from '@/utils'
const store = sessionStore()
const baseStore = mainStore()
// 搜索内容
const searchCnt = ref<string>()
// 阻止input默认行为
const handleKeyDown = (e: any) => {
  e.preventDefault()
  sendMsg()
}
// 用户信息
const userInfo = baseStore.userInfo
const isMore = ref<boolean>(false)
// 获得会话列表
store.setSessionList()
const sessionList = computed(() => store.sessionList)
// 选中的会话
const selectSession = computed(() => store.selectSession)
// 获得聊天信息
const chattingRecords = computed(() => store.chattingRecords)

// 会话点击事件
const sessionClick = (session: sessionType<userType>) => {
  isMore.value = false
  // 获取点击会话
  store.setSelectSession(session)
  // 获取聊天记录
  const result = store.setChattingRecords(session)
  result.then( () => {
    onScrollMsg()
  })
}
onMounted( () => {
  onScrollMsg()
})
// 查看更多聊天记录
const moreRecord = () => {
  isMore.value = true
  const id = chattingRecords.value.list[0].id
  store.moreRecord(selectSession.value, id)
}
// 发送图片或文件
function fileChange(file: any){
  console.log(file);
  const formData = new FormData()
  formData.append('file', file.target.files[0])
  uploadFile({file: file.target.files[0]}).then( res => {
    console.log(res);
    
  })
}
// 发送聊天内容
const sendContent = ref<string>()
const sendMsg = (msgType: number = 1) => {
  console.log(sendContent.value)
  if (!sendContent.value) {
    return
  }
  const time = new Date()
  sendChatMessage({
    msg_client_id: time.getTime(),
    msg_type: msgType,
    to_id: selectSession.value?.to_id,
    channel_type: 1,
    message: sendContent.value,
  }).then((res) => {
    // 聊天记录
    const chatMsg = {
      Users: {
        avatar: selectSession.value.Users.avatar,
        email: selectSession.value.Users.email,
        id: selectSession.value.Users.id,
        name: selectSession.value.Users.name,
      },
      created_at: res.send_time,
      data: res.data,
      form_id: res.form_id,
      id: time.getTime() + 1,
      is_read: 0,
      msg: res.message,
      msg_type: res.msg_type,
      to_id: res.to_id,
      status: 1,
    }
    const result = store.changeChattingRecords(chatMsg)
    result.then( () => {
      onScrollMsg()
    })
    // 会话列表记录
    const sessionMsg = Object.assign(selectSession.value, {
      last_message: {
        content: res.message,
        time: timestampChange(time, 'HH:mm'),
      },
    })
    store.changeSessionList(sessionMsg, 'send')
    sendContent.value = ''
  })
}


// 修改滚动距离
const chatWarp = ref<any>(null)
const chatContent = ref<any>(null)
function onScrollMsg() {
  if(isMore.value){
    return    
  }
  const height = chatContent.value && chatContent.value.clientHeight
  if (!chatWarp.value) {
    return
  }
  chatWarp.value.scrollTop = height
}
onUpdated(() => {
  
})
const defaultTime = ref<string>('')
const time = new Date()
defaultTime.value = timestampChange(time, 'mm:ss')

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
        <div class="add">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
      <ul>
        <li
          v-for="item in sessionList"
          :key="item.id"
          @click="sessionClick(item)"
          :class="{
            select: item.id === selectSession?.id,
            sessionTop: item.top_status == 1,
          }"
        >
          <div class="img">
            <img :src="item.avatar" alt="" />
            <span :class="{ online: item.top_status == 1 }"></span>
          </div>
          <div class="user">
            <div class="name">
              {{ item.note || item.name }}
              <div class="time">
                {{ item.last_message ? item.last_message.time : defaultTime }}
              </div>
            </div>
            <div class="message">
              {{ item.last_message ? item.last_message.content : '开始聊天' }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="session-cnt">
      <div class="chat-top"></div>
      <div class="chat-msg-warp" ref="chatWarp">
        <ul
          v-show="chattingRecords.list && chattingRecords.list.length > 0"
          ref="chatContent"
        >
          <p><span @click="moreRecord">查看更多消息</span></p>
          <li
            v-for="item in chattingRecords.list"
            :key="item.id"
            :class="{ own: item.form_id === userInfo.id }"
          >
            <div class="avatar">
              <img
                :src="item.Users.avatar"
                alt=""
                v-if="item.form_id !== userInfo.id"
              />
              <img :src="userInfo.avatar" alt="" v-else />
            </div>
            <div class="chat-msg">
              <div class="chat-name" v-if="item.form_id !== userInfo.id">
                {{ item.Users.name }}
              </div>
              <div class="chat-name" v-else>{{ userInfo.name }}</div>
              <div class="chat-cnt" v-if="item.msg_type === 1">
                {{ item.msg }}
              </div>
              <div class="chat-img" v-if="item.msg_type === 2">
                <img :src="item.msg" alt="" />
              </div>
            </div>
          </li>
        </ul>
        <ul v-show="!chattingRecords.list || chattingRecords.list.length <= 0">
          <li class="none">暂无聊天</li>
        </ul>
      </div>
      <div class="send">
        <div class="tool">
          <ul>
            <li>
              <el-icon><Folder /></el-icon>
              <input type="file" class="file" name="file" @change="fileChange" ref="imgFile" />
            </li>
            <li>
              <el-icon><Picture /></el-icon>
            </li>
            <li>
              <svg-icon name="smile" color="#666"/>
            </li>
          </ul>
        </div>
        <div class="chat-content">
          <textarea
            id="textarea"
            v-model="sendContent"
            @keydown.enter="handleKeyDown"
          ></textarea>
        </div>
        <div class="btn">
          <span @click="sendMsg(1)">发送</span>
        </div>
      </div>
    </div>
  </div>
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
    ul {
      height: calc(100% - 50px);
      overflow: hidden;
      overflow-y: auto;
      padding: 0 0 10px;
      box-sizing: border-box;
      li {
        width: 100%;
        display: flex;
        padding: 0 10px;
        box-sizing: border-box;
        height: 65px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &:hover {
          background-color: #e2e2e2;
        }
        .img {
          width: 50px;
          height: 50px;
          overflow: hidden;
          background-color: #e3e4e6;
          border-radius: 5px;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            position: absolute;
          }
          .online {
            width: 10px;
            height: 10px;
            display: block;
            position: absolute;
            text-align: center;
            border-radius: 90px;
            border: solid 2px #fff;
            bottom: 0px;
            right: 0px;
            background-color: #3bd821 !important;
          }
          .offline {
            width: 10px;
            height: 10px;
            display: block;
            position: absolute;
            text-align: center;
            border-radius: 90px;
            border: solid 2px #fff;
            bottom: 0px;
            right: 0px;
            background-color: #ccced1 !important;
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
            .time {
              font-size: 14px;
              color: #777;
              font-weight: 500;
            }
          }
          .message {
            font-size: 14px;
            color: #555;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            user-select: text;
          }
        }
      }
      .sessionTop {
        background-color: #eeeeee !important;
      }
      .select {
        background-color: #cfcfcf !important;
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
    & > .chat-msg-warp {
      width: 100%;
      height: calc(100% - 220px);
      padding: 0px 10px 20px;
      box-sizing: border-box;
      overflow-y: auto;
      p {
        width: 100%;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        span {
          color: #6084e7;
          cursor: pointer;
          &:hover{
            color: #2a57d3;
          }
        }
      }
      li {
        display: flex;
        margin-bottom: 15px;
        .avatar {
          width: 45px;
          height: 45px;
          border-radius: 3px;
          overflow: hidden;
          background-color: #eeecec;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .chat-msg {
          padding: 0 10px;
          width: 70%;
          // background-color: red;
          .chat-name {
            width: 100%;
            font-size: 14px;
            color: #555;
            line-height: 25px;
            margin-top: -10px;
            margin-bottom: 3px;
          }
          .chat-cnt {
            font-size: 16px;
            color: #333;
            line-height: 28px;
            background-color: #fff;
            padding: 10px 15px;
            border-radius: 5px;
            box-shadow: 0 0 5px #eee;
            display: inline-block;
            user-select: text;
          }
          .chat-img {
            width: 100%;
            overflow: hidden;
            img {
              max-width: 100%;
            }
          }
        }
      }
      .none {
        width: 100%;
        color: #999;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 100px;
      }
      .own {
        flex-direction: row-reverse;
        .chat-msg {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          .chat-cnt {
            font-size: 16px;
            color: #333;
            line-height: 28px;
            background-color: #6084e7;
            padding: 10px 15px;
            border-radius: 5px;
            box-shadow: 0 0 5px #89a3eb;
            display: inline-block;
            color: #fff;
          }
          .chat-name {
            display: flex;
            justify-content: flex-end;
          }
          .chat-img {
            display: flex;
            justify-content: flex-end;
          }
        }
      }
    }
    .send {
      width: 100%;
      height: 170px;
      box-sizing: border-box;
      border-top: 1px solid #e8eaec;
      background-color: #f9f9f9;
      .tool {
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
        height: 30px;
        display: flex;
        align-items: center;
        ul {
          display: flex;
          li {
            margin-top: 6px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #666;
            margin-right: 10px;
            position: relative;
            .file{
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              opacity: 0;
            }
          }
        }
      }
      .chat-content {
        width: 100%;
        height: 95px;
        background-color: pink;
        #textarea {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          box-sizing: border-box;
          padding: 10px 20px;
          color: #333;
          line-height: 26px;
          background-color: #f9f9f9;
        }
      }
      .btn {
        width: 100%;
        height: 45px;
        display: flex;
        justify-content: flex-end;
        span {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          padding: 0 20px;
          font-size: 14px;
          border-radius: 3px;
          box-sizing: border-box;
          background-color: #eaeefa;
          margin-right: 30px;
          color: #333;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
