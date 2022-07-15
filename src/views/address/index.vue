<script setup lang="ts">
import { ref } from 'vue'
// icon图标
import { Search, Plus, Picture } from '@element-plus/icons-vue'
// 搜索内容
const searchCnt = ref<string>()
// 阻止input默认行为
const handleKeyDown = (e: any) => {
  e.preventDefault()
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
            placeholder="Type something"
            :prefix-icon="Search"
          />
        </div>
        <div class="add">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
      <div class="list">
        <ul>
          <li class="select">
            <div class="img">
              <img src="@/assets/images/logo.png" alt="" />
            </div>
            <div class="user">
              <div class="name">张三</div>
            </div>
          </li>
          <li>
            <div class="img">
              <img src="@/assets/images/logo.png" alt="" />
            </div>
            <div class="user">
              <div class="name">张三</div>
            </div>
          </li>
          <li>
            <div class="img">
              <img src="@/assets/images/logo.png" alt="" />
            </div>
            <div class="user">
              <div class="name">张三</div>
            </div>
          </li>
          <li>
            <div class="img">
              <img src="@/assets/images/logo.png" alt="" />
            </div>
            <div class="user">
              <div class="name">张三</div>
            </div>
          </li>
          <li>
            <div class="img">
              <img src="@/assets/images/logo.png" alt="" />
            </div>
            <div class="user">
              <div class="name">张三</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="session-cnt">
      <div class="chat-top"></div>
      <div class="user-message">
        <div class="box">
          <div class="message">
            <div class="avatar">
              <img src="@/assets/images/logo.png" alt="" />
            </div>
            <div class="user-info">
              <div class="name">张三</div>
              <div class="account">账号:123456789</div>
              <div class="address">所在地</div>
            </div>
          </div>
          <ul>
            <li>备注: 123456</li>
            <li>来源: 123456</li>
          </ul>
          <div class="send">
            <el-button type="primary">发消息</el-button>
          </div>
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
    .list {
      height: calc(100% - 50px);
      overflow: hidden;
      overflow-y: auto;
      padding: 0 0 10px;
      box-sizing: border-box;
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
        .message{
          display: flex;
          .avatar{
            width: 70px;
            height: 70px;
            background-color: #e8eaec;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .user-info{
            flex: 1;
            padding-left: 10px;
            line-height: 22px;
            font-size: 14px;
            color: #333;
            .name{
              font-size: 16px;
              line-height: 26px;
              font-weight: 700;
              color: #333;
            }
          }
        }
        ul{
          line-height: 30px;
          font-size: 14px;
          color: #555;
          padding: 10px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          margin-top: 15px;
        }
        .send{
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
