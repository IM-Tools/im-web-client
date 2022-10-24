<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { checkEmail } from '@/utils'
// icon图标
import { User, Unlock, FolderOpened, EditPen } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { mainStore, sessionStore } from '@/store'
// router
import { useRouter } from 'vue-router'
// 接口
import { login, registerede, sendEmailCode, oauthGithub } from '@/api/login'
// 主题切换
import useTheme from '@/hooks/useTheme'
const { themeList, changeThemeColor } = useTheme()
const router = useRouter()
const store = mainStore()
const mySessionStore = sessionStore()
// 用户账号密码
const userInfo = reactive({
  account: '',
  password: '',
})
onMounted(() => {
  githubLogin('login')
  initLogin()
})
// 是否注册
const isReverse = ref<Boolean>(false)
const reverseClick = () => {
  isReverse.value = !isReverse.value
}

// 登录效验规则
const ruleFormRef = ref<FormInstance>()
const validateAccount = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入邮箱'))
  } else {
    if (!checkEmail(userInfo.account)) {
      if (!ruleFormRef.value) return
      callback(new Error('请输入正确的邮箱'))
    }
    callback()
  }
}
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}
const rules = reactive({
  account: [{ validator: validateAccount, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
})
// 注册账号信息
const registerInfo = reactive({
  email: '',
  name: '',
  password: '',
  password_repeat: '',
  code: '',
})
const registerRef = ref<FormInstance>()
// 注册效验规则
const validateEmail = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入邮箱'))
  } else {
    if (!checkEmail(registerInfo.email)) {
      if (!ruleFormRef.value) return
      callback(new Error('请输入正确的邮箱'))
    }
    callback()
  }
}
const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (registerInfo.password.length < 6 || registerInfo.password.length > 20) {
      if (!ruleFormRef.value) return
      callback(new Error('密码长度应为6-20位'))
    }
    callback()
  }
}
const validateCheck = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else {
    if (registerInfo.password !== registerInfo.password_repeat) {
      if (!ruleFormRef.value) return
      callback(new Error('输入密码不一致请重新输入'))
    }
    callback()
  }
}
const validateCode = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入验证码'))
  } else {
    callback()
  }
}
const registerRules = reactive({
  email: [{ validator: validateEmail, trigger: 'blur' }],
  name: [{ validator: validateName, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  password_repeat: [{ validator: validateCheck, trigger: 'blur' }],
  code: [{ validator: validateCode, trigger: 'blur' }],
})
// github 登录

const initLogin = () => {
  if (router.currentRoute.value.query.login_type == 'github') {
    githubLogin('authorize')
  } else {
    console.log('未有登录类型')
  }
}

const githubLogin = (action: string) => {
  if (action === 'authorize') {
    let url =
      'https://github.com/login/oauth/authorize?client_id=' +
      import.meta.env.VITE_APP_CLIENT_ID +
      '&redirect_uri=' +
      import.meta.env.VITE_APP_REDIRECT_URL
    window.location.href = url
  } else if (router.currentRoute.value.query.code != undefined) {
    oauthGithub({ code: router.currentRoute.value.query.code }).then(
      (res: any) => {
        console.log(res)
        store.setToken(res.token)
        const info = {
          avatar: res.avatar,
          name: res.name,
          email: res.email,
          uid: res.uid,
          id: res.id,
          expire_time: res.expire_time,
        }
        store.setUserInfo(info)
        // store.getSessionInfo()
        router.push({
          path: '/',
        })
      }
    )
  }
}
// 登录
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      login({
        email: userInfo.account,
        password: userInfo.password,
      }).then(async (res: any) => {
        console.log(res)
        store.setToken(res.token)
        const info = {
          avatar: res.avatar,
          name: res.name,
          email: res.email,
          uid: res.uid,
          id: res.id,
          expire_time: res.expire_time,
        }
        store.setUserInfo(info)
        await mySessionStore.setSessionList()
        router.push({
          path: '/',
        })
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// 注册获取邮箱验证码
const getCodeClick = () => {
  sendEmailCode({
    email: registerInfo.email,
    email_type: 1,
  }).then((res) => {
    console.log(res)
    ElMessage({
      message: '验证码已发送至邮箱，请注意查收！',
      type: 'success',
    })
  })
}
// 确认注册
const submitRegisterForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      registerede(registerInfo).then((res) => {
        console.log(res)
        ElMessage({
          message: '注册成功，点击直接登录！',
          type: 'success',
        })
        isReverse.value = false
        userInfo.account = registerInfo.email
        userInfo.password = registerInfo.password
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<template>
  <div class="login">
    <div class="container" :class="{ reverse: isReverse }">
      <div class="left">
        <div class="logo">
          <img src="@/assets/images/logo.png" alt="" />
        </div>
        <div class="userInfo">
          <el-form
            ref="ruleFormRef"
            :model="userInfo"
            :rules="rules"
            label-width="0"
            class="demo-ruleForm"
          >
            <el-form-item prop="account">
              <el-input
                v-model="userInfo.account"
                type="text"
                :prefix-icon="User"
                placeholder="请输入邮箱"
                clearable
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="userInfo.password"
                type="password"
                :prefix-icon="Unlock"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="tool">
          <div class="login-btn">
            <el-button
              color="#5865F2"
              type="primary"
              @click="submitForm(ruleFormRef)"
              >登录</el-button
            >
          </div>
          <div class="register-btn">
            <el-button type="primary" plain @click="reverseClick"
              >注册</el-button
            >
          </div>
        </div>
        <div class="other">
          <p><span></span> 第三方登录<span></span></p>
          <div class="other-list">
            <div class="btn" @click="githubLogin('authorize')">
              <div class="icon">
                <svg-icon name="github" />
              </div>
              <p>GitHub</p>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <div class="img">
            <img src="@/assets/images/logo.png" alt="" />
          </div>
          <h2>注册账号</h2>
        </div>
        <div class="userInfo">
          <el-form
            ref="registerRef"
            :model="registerInfo"
            :rules="registerRules"
            label-width="0"
            class="demo-ruleForm"
          >
            <el-form-item prop="email">
              <el-input
                v-model="registerInfo.email"
                type="text"
                :prefix-icon="FolderOpened"
                placeholder="请输入邮箱"
                clearable
              />
            </el-form-item>
            <el-form-item prop="name">
              <el-input
                v-model="registerInfo.name"
                type="text"
                :prefix-icon="User"
                placeholder="请输入用户名"
                clearable
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="registerInfo.password"
                type="password"
                :prefix-icon="Unlock"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
            <el-form-item prop="password_repeat">
              <el-input
                v-model="registerInfo.password_repeat"
                type="password"
                :prefix-icon="Unlock"
                placeholder="请确认密码"
                show-password
              />
            </el-form-item>
            <el-form-item prop="code">
              <div class="code">
                <el-input
                  v-model="registerInfo.code"
                  type="text"
                  :prefix-icon="EditPen"
                  placeholder="请输入验证码"
                  clearable
                />
                <div class="btn">
                  <el-button type="primary" @click="getCodeClick"
                    >获取验证码</el-button
                  >
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="tool">
          <div class="register-btn">
            <el-button type="primary" plain @click="reverseClick"
              >返回登录</el-button
            >
          </div>
          <div class="login-btn">
            <el-button
              color="#5865F2"
              type="primary"
              @click="submitRegisterForm(registerRef)"
              >确认注册</el-button
            >
          </div>
        </div>
      </div>
      <div class="mask">
        <img src="@/assets/images/login.png" alt="" />
      </div>
      <div class="theme">
        <ul>
          <li
            v-for="item in themeList"
            :key="item.id"
            @click="changeThemeColor(item.class)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@/assets/css/index.less';
.login {
  width: 100%;
  height: 100%;
  background-color: var(--login-bgColor);
  position: relative;
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 900px;
    height: 430px;
    background-color: var(--theme-bgColor);
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
  }
  .left,
  .right {
    width: 380px;
    padding: 20px;
    box-sizing: border-box;
    .logo {
      width: 65px;
      height: 65px;
      margin: 5px auto 10px;
      border-radius: 90px;
      overflow: hidden;
      background-color: #d5d8f8;
      display: flex;
      align-items: center;
      img {
        width: 100%;
      }
    }
    .userInfo {
      width: 80%;
      margin: 30px auto 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .tool {
      width: 80%;
      margin: 10px auto 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      // justify-content: space-between;
      .login-btn,
      .register-btn {
        width: 100%;
        display: flex;
        margin: 5px 0;
      }
    }
  }
  .left {
    .userInfo {
      margin: 15px auto 0px;
    }
    .tool {
      margin: 5px auto 0;
    }
    .other {
      width: 80%;
      margin: 20px auto 0;
      p {
        width: 100%;
        font-size: 12px;
        color: #999;
        text-align: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          display: inline-block;
          width: 80px;
          height: 1px;
          background-color: #dfdfdf;
        }
      }
      .other-list {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        .btn {
          text-align: center;
          cursor: pointer;
          .icon {
            font-size: 32px;
          }
          p {
            font-size: 12px;
            margin-top: 3px;
          }
        }
      }
    }
  }
  .right {
    overflow: hidden;
    .title {
      width: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--theme-color);
      margin-top: 15px;
      .img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #fcedef;
        margin-right: 10px;
        img {
          width: 100%;
        }
      }
      h2 {
        font-size: 22px;
      }
    }
    .userInfo {
      width: 80%;
      margin: 20px auto 0px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .code {
      display: flex;
      .btn {
        margin-left: 10px;
      }
    }
    .tool {
      margin: 10px auto 0;
      flex-wrap: nowrap;
      justify-content: space-between;
      .login-btn,
      .register-btn {
        width: 100%;
        display: flex;
        margin: 5px 0;
      }
      .register-btn {
        margin-right: 20px;
      }
    }
  }
  .mask {
    position: absolute;
    width: 520px;
    top: 0;
    left: 380px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
    height: 100%;
    overflow: hidden;
    background-color: var(--theme-bgColor);
    border-radius: 10px;
    img {
      width: 100%;
    }
  }
  .theme {
    position: absolute;
    top: -20px;
    right: 0;
    ul {
      display: flex;
      li {
        margin: 0 5px;
        font-size: 12px;
        color: #e8e9fa;
        cursor: pointer;
        &:hover {
          color: #d5d8f8;
        }
      }
    }
  }
  .reverse .mask {
    left: 0;
  }
}
:deep(.el-form) {
  width: 100%;
}
:deep(.el-button) {
  width: 100%;
}
</style>
