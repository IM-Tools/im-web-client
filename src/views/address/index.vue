<script setup lang="ts">
import { ref } from 'vue'
// icon图标
import { Search, Plus } from '@element-plus/icons-vue'
import { friendRecordList,friendList,recordFriend} from '@/api/friend'
// 搜索内容
const searchCnt = ref<string>()
const selectName = ref<string>('addFriend')
// 用户点击事件
const userClick = () => {
  selectName.value = 'userList'
}
const requestList = ref([])
const addFriendClick = () => {
  selectName.value = 'addFriend'
  // 获得好友请求列表
  friendRecordList().then( res => {
    console.log(res);
  })
}

// 获取好友列表
const getFriendList = () => {
  friendList().then( res => {
    console.log(res);
  })
}
getFriendList()
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
        <div class="new-friend" @click="addFriendClick">
          <p>新的朋友</p>
          <div class="add-friend" :class="{select: selectName === 'addFriend'}">
            <div class="icon">
              <svg
                t="1658910042098"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2307"
                width="200"
                height="200"
              >
                <path
                  d="M762.88 937.984q-43.008 0-81.408-16.384t-67.072-45.056-45.056-67.072-16.384-81.408 16.384-81.408 45.056-66.56 67.072-44.544 81.408-16.384 81.408 16.384 66.56 44.544 44.544 66.56 16.384 81.408-16.384 81.408-44.544 67.072-66.56 45.056-81.408 16.384zM866.304 694.272l-75.776 0 0-70.656q0-14.336-9.216-24.576t-23.552-10.24-22.528 10.24-8.192 24.576l0 70.656-66.56 0q-14.336 0-24.576 10.24t-10.24 24.576 10.24 21.504 24.576 7.168l66.56 0 0 72.704q0 14.336 8.192 24.576t22.528 10.24 23.552-10.24 9.216-24.576l0-72.704 75.776 0 0 2.048q14.336 0 24.576-8.192t10.24-22.528-10.24-24.576-24.576-10.24zM613.376 439.296q-4.096 16.384-8.192 29.696-4.096 11.264-10.24 23.04t-13.312 17.92q-9.216 7.168-12.8 15.36t-6.144 16.896-5.632 17.92-10.24 18.432q-23.552 30.72-35.328 59.392t-16.384 55.296-2.56 52.736 8.192 50.688q4.096 18.432 12.288 38.4t24.064 40.96 40.448 40.96 61.44 38.4q-24.576 5.12-57.344 9.216-27.648 3.072-68.096 5.632t-92.672 2.56q-26.624 0-61.952-2.048t-72.704-5.12-73.728-7.168-66.56-8.704-51.2-9.728-26.112-9.216q-9.216-8.192-14.336-45.568t3.072-97.792q5.12-33.792 27.136-51.712t51.712-28.16 61.952-18.944 56.832-24.064q19.456-12.288 29.696-23.04t14.336-22.016 4.096-23.552-1.024-26.624q-2.048-21.504-14.848-33.792t-27.136-24.576q-8.192-6.144-14.336-18.432t-10.24-23.552q-5.12-13.312-8.192-29.696-7.168-2.048-13.312-6.144-5.12-4.096-11.264-12.288t-11.264-24.576q-5.12-15.36-3.584-28.672t5.632-22.528q4.096-11.264 11.264-19.456 0-34.816 4.096-69.632 4.096-29.696 12.8-63.488t28.16-60.416q18.432-25.6 39.424-41.984t43.52-25.6 45.056-12.8 43.008-3.584q26.624 0 51.2 6.144t45.568 16.384 37.376 23.04 26.624 26.112q23.552 29.696 34.304 65.536t15.872 67.584q5.12 36.864 4.096 73.728 6.144 5.12 10.24 12.288 4.096 6.144 6.144 16.384t0 25.6q-2.048 19.456-8.192 30.72t-13.312 17.408q-8.192 7.168-17.408 10.24z"
                  p-id="2308"
                ></path>
              </svg>
            </div>
            <p>新的朋友</p>
          </div>
        </div>
        <ul>
          <li :class="{select: selectName !== 'addFriend'}" @click="userClick">
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
        <div class="box" v-if="selectName !== 'addFriend'">
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
        <div class="friend-request-list" v-else>
          <div class="title">
            <h2>新的朋友</h2>
          </div>
          <ul>
            <li>
              <div class="img">
                <img src="@/assets/images/logo.png" alt="">
              </div>
              <div class="cnt">
                <div class="name">这可是公司</div>
                <p class="desc">我是某某某</p>
              </div>
              <div class="tool">
                <div class="agree">接受</div>
                <div class="cancel">拒绝</div>
              </div>
            </li>
            <li>
              <div class="img">
                <img src="@/assets/images/logo.png" alt="">
              </div>
              <div class="cnt">
                <div class="name">这可是公司</div>
                <p class="desc">我是某某某</p>
              </div>
              <div class="tool">
                <p>已添加</p>
              </div>
            </li>
          </ul>
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
      .new-friend{
        width: 100%;
        height: 80px;
        margin-top: 10px;
        &>p{
          font-size: 12px;
          color: #999;
          line-height: 20px;
          box-sizing: border-box;
          padding: 0 15px;
        }
        .add-friend{
          display: flex;
          align-items: center;
          width: 100%;
          height: 55px;
          box-sizing: border-box;
          padding: 0 15px;
          cursor: pointer;
          &:hover{
            background-color: #e2e2e2;
          }
          .icon{
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #cf7f23;
            border-radius: 3px;
            svg{
              width: 30px;
              height: 30px;
              path{
                fill: #fff;
              }
            }
          }
          p{
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
        }
        .send {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
      }
      .friend-request-list{
        width: 100%;
        .title{
          width: 100%;
          border-bottom: 1px solid #eee;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          color: #333;
          h2{
            font-weight: normal;
          }
        }
        ul{
          width: 100%;
          box-sizing: border-box;
          padding: 0 30px;
          li{
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 75px;
            border-bottom: 1px solid #eee;
            .img{
              width: 55px;
              height: 55px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background-color: #d1d4f5;
              border-radius: 3px;
              img{
                width: 100%;
              }
            }
            .cnt{
              flex: 1;
              margin: 0 10px;
              .name{
                width: 100%;
                font-size: 14px;
                color: #222;
                line-height: 25px;
              }
              .desc{
                font-size: 12px;
                color: #666;
                line-height: 20px;
              }
            }
            .tool{
              width: 80px;
              height: 60px;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: center;
              .agree,.cancel{
                width: 60px;
                height: 26px;
                text-align: center;
                line-height: 26px;
                font-size: 12px;
                background-color: #78d888;
                color: #fff;
                border-radius: 3px;
              }
              .cancel{
                background-color: #d3874a;
              }
              p{
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
</style>
