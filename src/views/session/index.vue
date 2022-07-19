<script setup lang="ts">
import { ref, reactive } from "vue";
import { sessionList } from "@/api/session";
import { mainStore } from "@/store";
// icon图标
import { Search, Plus, Picture } from "@element-plus/icons-vue";
import { onMounted } from "@vue/runtime-core";
const store = mainStore();
const data = reactive({
  sessionList: store.sessionInfo,
});
// 搜索内容
const searchCnt = ref<string>();
// 阻止input默认行为
const handleKeyDown = (e: any) => {
  e.preventDefault();
};
onMounted(async () => {
  //getSessions()
});
const getSessions = () => {
  sessionList({}).then((response) => {
    console.log(response.data);
    data.sessionList = response.data;
  });
};
</script>

<template>
  <div class="session">
    <div class="session-list">
      <div class="search">
        <div class="cnt">
          <el-input
            v-model="searchCnt"
            class="w-50 m-2"
            placeholder="Type something"
            :prefix-icon="Search"
          />
        </div>
        <div class="add">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
      <ul>
        <li
          v-for="(item, key) in data.sessionList"
          :key="key"
          :class="item.top_status == 1 ? 'select' : ''"
        >
          <div class="img">
            <img :src="item.Users.avatar" alt="" />
            <span class="online"></span>
          </div>
          <div class="user">
            <div class="name">
              {{ item.Users.name }}
              <div class="time">15:11</div>
            </div>
            <div class="message">你吗喊你回家吃饭了你吗喊你回家吃饭了</div>
          </div>
        </li>
    </ul>
    </div>
    <div class="session-cnt">
      <div class="chat-top"></div>
      <ul>
        <li>
          <div class="avatar">
            <img src="@/assets/images/logo.png" alt="" />
          </div>
          <div class="chat-msg">
            <div class="chat-name">张三</div>
            <div class="chat-cnt">
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
            </div>
          </div>
        </li>
        <li>
          <div class="avatar">
            <img src="@/assets/images/logo.png" alt="" />
          </div>
          <div class="chat-msg">
            <div class="chat-name">
              <span>张三</span>
            </div>
            <div class="chat-cnt">
              的可能每个看到你可是个看到过开始了麻烦的可能每
            </div>
          </div>
        </li>
        <li>
          <div class="avatar">
            <img src="@/assets/images/logo.png" alt="" />
          </div>
          <div class="chat-msg">
            <div class="chat-name">张三</div>
            <div class="chat-img">
              <img src="@/assets/images/login.png" alt="" />
            </div>
          </div>
        </li>
        <li class="own">
          <div class="avatar">
            <img src="@/assets/images/logo.png" alt="" />
          </div>
          <div class="chat-msg">
            <div class="chat-name">张三</div>
            <div class="chat-cnt">
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
              的可能每个看到你可是个看到过开始了麻烦的可能每个看到你可是个看到过开始了麻烦
            </div>
          </div>
        </li>
        <li class="own">
          <div class="avatar">
            <img src="@/assets/images/logo.png" alt="" />
          </div>
          <div class="chat-msg">
            <div class="chat-name">张三</div>
            <div class="chat-cnt">的可能每个看的可能每个看到你可是个看</div>
          </div>
        </li>
        <li class="own">
          <div class="avatar">
            <img src="@/assets/images/logo.png" alt="" />
          </div>
          <div class="chat-msg">
            <div class="chat-name">张三</div>
            <div class="chat-img">
              <img src="@/assets/images/login.png" alt="" />
            </div>
          </div>
        </li>
      </ul>
      <div class="send">
        <div class="tool">
          <ul>
            <li>
              <el-icon><Picture /></el-icon>
            </li>
            <li>
              <el-icon><Picture /></el-icon>
            </li>
            <li>
              <el-icon><Picture /></el-icon>
            </li>
          </ul>
        </div>
        <div class="chat-content">
          <textarea id="textarea" @keydown.enter="handleKeyDown"></textarea>
        </div>
        <div class="btn">
          <span>发送</span>
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
        background-color: #dad8d8;
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
          }
        }
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
    & > ul {
      width: 100%;
      height: calc(100% - 220px);
      padding: 20px 10px;
      box-sizing: border-box;
      overflow-y: auto;
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
          }
        }
      }
      .chat-content {
        width: 100%;
        height: 95px;
        background-color: pink;
        textarea {
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
        align-items: center;
        span {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          padding: 0 20px;
          font-size: 14px;
          border-radius: 3px;
          box-sizing: border-box;
          background-color: #d1daf3;
          margin-right: 30px;
          color: #0139d3;
        }
      }
    }
  }
}
</style>
