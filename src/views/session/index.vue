<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { sessionStore } from '@/store/session'
import { mainStore } from '@/store'
// icon图标
import { Search, Plus, Picture, Folder, Close } from '@element-plus/icons-vue'
import { computed } from '@vue/reactivity'
import { sendChatMessage, uploadFile } from '@/api/chat'
import type { userType, groupType, sessionType } from '@/api/session/type'
import { timestampChange } from '@/utils'
import Emoji from '@/components/emoji/Emoji.vue'
import { ElMessage } from 'element-plus'
import { getFileType } from '@/utils/session'
import Voice from '@/components/Voice.vue'
import AddGroup from '@/components/AddGroup.vue'
import { getGroupUserInfo } from '@/api/group'
const store = sessionStore()
const baseStore = mainStore()
// 搜索内容
const searchCnt = ref<string>('')
// 阻止input默认行为
const handleKeyDown = (e: any) => {
  e.preventDefault()
  sendMsg()
}
// 是否创建群聊
const isAddGroup = ref(false)
const addBtnClick = () => {
  isAddGroup.value = true
}
const closeAddGroup = () => {
  isAddGroup.value = false
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
const chattingRecordsList = computed(() => store.chattingRecordsList)

// 会话点击事件
const sessionClick = (session: sessionType<userType, groupType>) => {
  console.log(session)

  isMore.value = false
  searchCnt.value = ''
  sendContent.value = ''
  cancleSearch()
  // 获取点击会话
  store.setSelectSession(session)
  // 获取聊天记录
  const result = store.setChattingRecords(session)
  result.then(() => {
    onScrollMsg()
  })
}
const scrollType = computed(() => store.scrollType)
watch(scrollType, () => {
  console.log('滚动')
  onScrollMsg()
})
// 查看更多聊天记录
const isShowMoreBtn = computed(() => store.isShowMoreBtn)
const isShowLoading = ref<boolean>(false)
const moreRecord = () => {
  isMore.value = true
  if (!chattingRecordsList.value) {
    return
  }
  isShowLoading.value = true
  const id = chattingRecordsList.value.list[0].id
  if (selectSession.value) {
    const res = store.moreRecord(selectSession.value, id)
    res.then(() => {
      isShowLoading.value = false
    })
  }
}

// 发送聊天内容
const sendContent = ref<string>()
const sendMsg = (msgType: number = 1, message?: string) => {
  if (!selectSession.value) {
    ElMessage({
      type: 'warning',
      message: '暂无聊天对象',
    })
    return
  }
  console.log(sendContent.value)
  if (!sendContent.value && msgType === 1) {
    return
  }
  console.log(selectSession.value)
  const time = new Date()
  sendChatMessage({
    msg_client_id: time.getTime(),
    msg_type: msgType,
    to_id:
      selectSession.value.channel_type === 1
        ? selectSession.value.to_id
        : selectSession.value.group_id || -1,
    channel_type: selectSession.value.channel_type || 1,
    message: (msgType === 1 ? sendContent.value : message) || '',
  }).then((res) => {
    console.log(res)

    if (!selectSession.value) {
      return
    }
    // 聊天记录
    const Users = {
      avatar: selectSession.value.Users?.avatar || '',
      email: selectSession.value.Users?.email || '',
      id: selectSession.value.Users?.id || -1,
      name: selectSession.value.Users?.name || '',
    }
    const chatMsg = {
      Users: Users,
      channel_type: selectSession.value.channel_type,
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
    result.then(() => {
      onScrollMsg()
    })
    sendContent.value = ''
  })
}
// 获取消息提示时间
function getChatPotinTime(time: string) {
  const times = time.split(' ')
  const timeData = times[0].split('-')
  const newTime = new Date()
  if (parseInt(timeData[0]) < newTime.getFullYear()) {
    return time
  }
  if (
    parseInt(timeData[0]) === newTime.getFullYear() &&
    parseInt(timeData[1]) < newTime.getMonth() + 1
  ) {
    return time
  }
  if (
    parseInt(timeData[0]) === newTime.getFullYear() &&
    parseInt(timeData[1]) === newTime.getMonth() + 1 &&
    parseInt(timeData[2]) < newTime.getDate()
  ) {
    return time
  } else {
    return times[1]
  }
}
// 发送图片或文件
const fileRef = ref<any>(null)
function fileChange(file: any) {
  if (!selectSession.value) {
    ElMessage({
      type: 'warning',
      message: '暂无聊天对象',
    })
    return
  }
  const formData = new FormData()
  formData.append('file', file.target.files[0])
  uploadFile({ file: file.target.files[0] }).then((res) => {
    sendMsg(3, res.file_url)
    // 清空选中的文件
    fileRef.value.value = ''
  })
}
// 表情
const isShowEmoji = ref<boolean>(false)
const textarea = ref<any>(null)
function onSelectEmoji(emo: string) {
  sendContent.value = sendContent.value ? sendContent.value + emo : emo
  isShowEmoji.value = false
  textarea.value && textarea.value.focus()
}
// 语音
const isShowVoice = ref<boolean>(false)
function sendVoiceMsg(url: string) {
  sendMsg(2, url)
}
onMounted(() => {
  onScrollMsg()
  textarea.value && textarea.value.focus()
})

// 获取文件名
function getFileName(url: string) {
  return url.substring(url.lastIndexOf('/') + 1)
}
// 下载文件
function downloadFile(url: string) {
  const a = document.createElement('a')
  //  target="_blank"
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('download', getFileName(url))
  a.click()
}
// 修改滚动距离
const chatWarp = ref<any>(null)
const chatContent = ref<any>(null)
function onScrollMsg() {
  if (isMore.value) {
    return
  }
  const height = chatContent.value && chatContent.value.clientHeight
  if (!chatWarp.value) {
    return
  }
  chatWarp.value.scrollTop = height
}
// 移除会话
function handleRemoveSession(session: sessionType<userType, groupType>) {
  const result = store.changeSessionList(session, 'delete')
  result.then(() => {
    onScrollMsg()
  })
}
const defaultTime = ref<string>('')
const time = new Date()
defaultTime.value = timestampChange(time, 'mm:ss')
// 搜索
const isSearch = ref(false)
const querySessionList = computed(() => store.querySessionList)
function cancleSearch() {
  if (searchCnt.value !== '') {
    return
  }
  isSearch.value = false
  store.getQuerySessionList('', true)
}
function clearSearch() {
  isSearch.value = false
  store.getQuerySessionList('', true)
}
function startSearch() {
  isSearch.value = true
}
function searchClick() {
  if (!searchCnt.value) {
    return
  }
  store.getQuerySessionList(searchCnt.value)
}
// 聊天信息展示
const showMessage = ref<boolean>(false)
function showMessageClick(){
  showMessage.value = !showMessage.value
  if(selectSession.value?.channel_type === 2){
    getGroupUserInfo({id: selectSession.value.group_id || selectSession.value.id}).then( res => {
      console.log(res);
      
    })
  }
}
// 音频时间
function getAudioTime(url: string){
  const audio = document.createElement('audio')
  audio.src = url
  console.dir(audio);
  return audio.duration
}
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
            @focus="startSearch"
            @blur="cancleSearch"
            @change="searchClick"
            @clear="clearSearch"
            :prefix-icon="Search"
            clearable
          />
        </div>
        <div class="add" @click="addBtnClick">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
      <ul v-show="!isSearch">
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
            <!-- <span :class="{ online: item.top_status != 1 }"></span> -->
            <span :class="{ point: item.last_message?.isPoint }">
              <i>{{
                item.last_message?.num == 0 ? '' : item.last_message?.num
              }}</i></span
            >
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
          <div class="close" @click.stop="handleRemoveSession(item)">
            <el-icon><Close /></el-icon>
          </div>
        </li>
      </ul>
      <ul v-show="isSearch">
        <li
          v-for="item in querySessionList"
          :key="item.id"
          @click="sessionClick(item)"
          :class="{
            select: item.id === selectSession?.id,
            sessionTop: item.top_status == 1,
          }"
        >
          <div class="img">
            <img :src="item.avatar" alt="" />
            <!-- <span :class="{ online: item.top_status != 1 }"></span> -->
            <span :class="{ point: item.last_message?.isPoint }">
              <i>{{
                item.last_message?.num == 0 ? '' : item.last_message?.num
              }}</i></span
            >
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
          <div class="close" @click.stop="handleRemoveSession(item)">
            <el-icon><Close /></el-icon>
          </div>
        </li>
      </ul>
    </div>
    <div class="session-cnt">
      <div class="chat-top">
        {{ selectSession?.name }}
        <span class="tool" @click="showMessageClick">···</span>
      </div>
      <div class="chat-msg-warp" ref="chatWarp">
        <ul
          v-if="
            chattingRecordsList &&
            chattingRecordsList.list &&
            chattingRecordsList.list.length > 0
          "
          ref="chatContent"
        >
          <p v-show="isShowMoreBtn || isShowLoading">
            <span @click="moreRecord" v-if="isShowMoreBtn && !isShowLoading"
              >查看更多消息</span
            >
            <span class="loading spin" v-if="isShowLoading">加载中</span>
          </p>
          <li v-for="item in chattingRecordsList.list" :key="item.id">
            <p v-if="item.isShowTime">
              <span>{{ getChatPotinTime(item.created_at) }}</span>
            </p>
            <div class="box" :class="{ own: item.form_id === userInfo.id }">
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
                <div class="voice" v-if="item.msg_type === 2">
                  <audio :src="item.msg" controls></audio>
                  <!-- <div class="icon">音频</div>
                  <div class="time">{{getAudioTime(item.msg)}}</div> -->
                </div>
                <div
                  class="chat-img"
                  v-if="
                    item.msg_type === 3 && getFileType(item.msg)[0] === 'image'
                  "
                >
                  <!-- <img :src="item.msg" alt="" @load="onScrollMsg" /> -->
                  <el-image
                    :src="item.msg"
                    :preview-src-list="[item.msg]"
                    :initial-index="4"
                    @load="onScrollMsg"
                    fit="cover"
                  />
                </div>
                <div
                  class="chat-file"
                  v-if="
                    item.msg_type === 3 && getFileType(item.msg)[0] === 'other'
                  "
                  @click="downloadFile(item.msg)"
                >
                  <div class="file">
                    <div class="file-name">{{ getFileName(item.msg) }}</div>
                    <div class="icon">
                      <svg-icon name="file" color="#eee" />
                      <span>{{ getFileType(item.msg)[1] }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <template v-if="item.channel_type === 1">
              
            </template> -->
          </li>
        </ul>
        <ul
          v-show="
            !chattingRecordsList ||
            !chattingRecordsList.list ||
            chattingRecordsList.list.length <= 0
          "
        >
          <li class="none">暂无聊天</li>
        </ul>
      </div>
      <div class="send">
        <div class="tool">
          <ul>
            <li>
              <el-icon><Folder /></el-icon>
              <input
                type="file"
                class="file"
                name="file"
                @change="fileChange"
                ref="fileRef"
              />
            </li>
            <li>
              <el-icon><Picture /></el-icon>
              <input
                type="file"
                class="file"
                name="file"
                @change="fileChange"
                ref="fileRef"
                accept="image/*"
              />
            </li>
            <li @click="isShowEmoji = !isShowEmoji">
              <svg-icon name="smile" color="#666" />
            </li>
            <li @click="isShowVoice = true">
              <svg-icon name="audio" color="#666" />
            </li>
          </ul>
        </div>
        <div class="chat-content">
          <textarea
            id="textarea"
            v-model="sendContent"
            @keydown.enter="handleKeyDown"
            ref="textarea"
          ></textarea>
        </div>
        <div class="btn">
          <span @click="sendMsg(1)">发送</span>
        </div>
        <div class="emoji" v-if="isShowEmoji">
          <Emoji @onSelectEmoji="onSelectEmoji"></Emoji>
        </div>
      </div>
      <div class="message" :class="{ 'show-message': showMessage }">
        <div class="user-list">
          <div class="user">
            <div class="avatar">
              <img :src="selectSession?.avatar" alt="" />
            </div>
            <div class="name">{{ selectSession?.name }}</div>
          </div>
          <div class="user" @click="addBtnClick">
            <div class="avatar"><Plus /></div>
            <div class="name">添加</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="voice" v-if="isShowVoice">
    <Voice @closeVoice="isShowVoice = false" @sendVoice="sendVoiceMsg"></Voice>
  </div>
  <div class="add-group-box" v-if="isAddGroup">
    <AddGroup @closeAddGroup="closeAddGroup"></AddGroup>
  </div>
  <div class="mask" v-if="isAddGroup"></div>
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
        position: relative;
        cursor: pointer;
        &:hover {
          background-color: #e2e2e2;
        }
        .img {
          width: 50px;
          height: 50px;
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
            border-radius: 50%;
            border: solid 2px #fff;
            bottom: 0px;
            right: 0px;
            background-color: #3bd821;
          }
          .point {
            width: 16px;
            height: 16px;
            display: block;
            position: absolute;
            text-align: center;
            border-radius: 50%;
            color: #fff;
            font-size: 12px;
            top: -3px;
            right: -5px;
            background-color: #ff1100;
            line-height: 16px;
            text-align: center;
            i {
              display: inline-block;
              font-style: normal;
              transform: scale(0.8);
            }
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
            background-color: #ccced1;
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
        .close {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #eee;
          position: absolute;
          top: 23px;
          right: 15px;
          align-items: center;
          justify-content: center;
          display: none;
          &:hover {
            background-color: #eb2d2d;
            color: #fff;
          }
        }
        &:hover {
          .close {
            display: flex;
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
    position: relative;
    .chat-top {
      height: 50px;
      width: 100%;
      border-bottom: 1px solid #e8eaec;
      box-sizing: border-box;
      line-height: 50px;
      text-align: center;
      position: relative;
      .tool {
        position: absolute;
        top: 0;
        right: 10px;
        letter-spacing: 1px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        color: #555;
        &:hover {
          color: #222;
        }
      }
    }
    & > .chat-msg-warp {
      width: 100%;
      height: calc(100% - 220px);
      padding: 0px 10px 20px;
      box-sizing: border-box;
      overflow-y: auto;
      ul {
        padding: 15px 0 0;
      }
      ul > p {
        width: 100%;
        font-size: 12px;
        text-align: center;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          color: #6084e7;
          cursor: pointer;
          &:hover {
            color: #2a57d3;
          }
        }
        .loading {
          display: inline-block;
          width: 3px;
          height: 3px;
          border-radius: 100%; /* 圆角 */
          text-indent: -9999px;
          box-shadow: 0 -7px 0 1px #333, /* 上, 1px 扩展 */ 7px 0px #333,
            /* 右 */ 0 7px #333, /* 下 */ -7px 0 #333,
            /* 左 */ -5px -5px 0 0.5px #333,
            /* 左上, 0.5px扩展 */ 5px -5px 0 1.5px #333,
            /* 右上, 1.5px扩展 */ 5px 5px #333, /* 右下 */ -5px 5px #333;
        }
      }
      li {
        margin-bottom: 15px;
        p {
          width: 100%;
          font-size: 12px;
          text-align: center;
          line-height: 30px;
          span {
            padding: 4px 15px;
            background-color: #eee;
            cursor: pointer;
            color: #a7a7a7;
          }
        }
        .box {
          display: flex;
        }
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
          .chat-file {
            cursor: pointer;
            max-width: 230px;
            .file {
              display: flex;
              justify-content: space-between;
              padding: 10px 15px;
              background-color: #fff;
              align-items: center;
              border-radius: 5px;
              color: #333;
              &:hover {
                background-color: #f0efef;
              }
              .file-name {
                max-height: 50px;
                flex: 1;
                line-height: 25px;
                font-size: 14px;
                margin-right: 10px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              .icon {
                width: 43px;
                height: 43px;
                position: relative;
                .svg-icon {
                  width: 100%;
                  height: 100%;
                }
                span {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 12px;
                }
              }
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
      position: relative;
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
            .file {
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
      .emoji {
        position: absolute;
        bottom: 190px;
        left: 20px;
        width: 300px;
        min-height: 200px;
      }
    }
    & > .message {
      width: 0;
      background-color: #fff;
      position: absolute;
      top: 50px;
      right: 0;
      bottom: 0;
      overflow: hidden;
      transition: all 0.3s;
      .user-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding: 20px;
        .user {
          width: 60px;
          height: 60px;
          cursor: pointer;
          .avatar {
            width: 45px;
            height: 45px;
            margin: 0 auto;
            box-sizing: border-box;
            border: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            img {
              width: 100%;
            }
            svg{
              width: 24px;
            }
          }
          .name {
            font-size: 14px;
            width: 100%;
            text-align: center;
            margin-top: 5px;
          }
        }
      }
    }
    .show-message {
      width: 300px;
    }
  }
}
.spin {
  animation: spin 1s steps(8) infinite;
}
.add-group-box {
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
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
