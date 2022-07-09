<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { checkEmail } from '@/utils'
// icon图标
import { User, Unlock } from '@element-plus/icons-vue'
// 用户账号密码
const userInfo = reactive({
  account: '',
  password: '',
})
// 是否注册
const isReverse = ref<Boolean>(true)
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
// 提交方法
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

// const resetForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   formEl.resetFields()
// }
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
                clearable
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="tool">
          <div class="login-btn">
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >登录</el-button
            >
          </div>
          <div class="register-btn">
            <el-button type="primary" plain @click="reverseClick"
              >注册</el-button
            >
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <img src="@/assets/images/logo.png" alt="" />
          <h2>注册账号</h2>
        </div>
        <div class="userInfo">
          <el-form
            ref="ruleFormRef"
            :model="registerInfo"
            :rules="rules"
            label-width="0"
            class="demo-ruleForm"
          >
            <el-form-item prop="email">
              <el-input
                v-model="registerInfo.email"
                type="text"
                :prefix-icon="User"
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
                clearable
              />
            </el-form-item>
            <el-form-item prop="password_repeat">
              <el-input
                v-model="registerInfo.password_repeat"
                type="password"
                :prefix-icon="Unlock"
                placeholder="请确认密码"
                clearable
              />
            </el-form-item>
            <el-form-item prop="code">
              <div class="code">
                <el-input
                  v-model="registerInfo.code"
                  type="text"
                  :prefix-icon="Unlock"
                  placeholder="请输入验证码"
                  clearable
                />
                <div class="btn">
                  <el-button type="primary" @click="submitForm(ruleFormRef)"
                    >获取验证码</el-button
                  >
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="tool">
          <div class="login-btn">
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >确认注册</el-button
            >
          </div>
          <div class="register-btn">
            <el-button type="primary" plain @click="reverseClick"
              >返回登录</el-button
            >
          </div>
        </div>
      </div>
      <div class="mask">
        <img src="@/assets/images/login.png" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@/assets/css/index.less';
.login {
  width: 100%;
  height: 100%;
  background-color: @mainColor;
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
    overflow: hidden;
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
      margin: 10px auto 10px;
      border-radius: 5px;
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
      margin: 50px auto 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .login-btn,
      .register-btn {
        width: 100%;
        display: flex;
        margin: 5px 0;
      }
    }
  }
  .right {
    .title{
      width: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
    .userInfo {
      width: 80%;
      margin: 20px auto 0px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .code{
      display: flex;
      .btn{
        margin-left: 10px;
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
    img {
      width: 100%;
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
