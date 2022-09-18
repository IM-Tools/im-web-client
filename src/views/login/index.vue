<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import { checkEmail } from "@/utils";
// icon图标
import { User, Unlock, FolderOpened, EditPen } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { mainStore } from "@/store";
// router
import { useRouter } from "vue-router";
// 接口
import { login, registerede, sendEmailCode, oauthGithub } from "@/api/login";
// 主题切换
import useTheme from "@/hooks/useTheme";
const { themeList, changeThemeColor } = useTheme();
const router = useRouter();
const store = mainStore();
// 用户账号密码
const userInfo = reactive({
  account: "1752837807@qq.com",
  password: "123456",
});
onMounted(() => {
  githubLogin("login");
});
// 是否注册
const isReverse = ref<Boolean>(false);
const reverseClick = () => {
  isReverse.value = !isReverse.value;
};

// 登录效验规则
const ruleFormRef = ref<FormInstance>();
const validateAccount = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入邮箱"));
  } else {
    if (!checkEmail(userInfo.account)) {
      if (!ruleFormRef.value) return;
      callback(new Error("请输入正确的邮箱"));
    }
    callback();
  }
};
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};
const rules = reactive({
  account: [{ validator: validateAccount, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
});
// 注册账号信息
const registerInfo = reactive({
  email: "",
  name: "",
  password: "",
  password_repeat: "",
  code: "",
});
const registerRef = ref<FormInstance>();
// 注册效验规则
const validateEmail = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入邮箱"));
  } else {
    if (!checkEmail(registerInfo.email)) {
      if (!ruleFormRef.value) return;
      callback(new Error("请输入正确的邮箱"));
    }
    callback();
  }
};
const validateName = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else {
    callback();
  }
};
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (registerInfo.password.length < 6 || registerInfo.password.length > 20) {
      if (!ruleFormRef.value) return;
      callback(new Error("密码长度应为6-20位"));
    }
    callback();
  }
};
const validateCheck = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请确认密码"));
  } else {
    if (registerInfo.password !== registerInfo.password_repeat) {
      if (!ruleFormRef.value) return;
      callback(new Error("输入密码不一致请重新输入"));
    }
    callback();
  }
};
const validateCode = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入验证码"));
  } else {
    callback();
  }
};
const registerRules = reactive({
  email: [{ validator: validateEmail, trigger: "blur" }],
  name: [{ validator: validateName, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  password_repeat: [{ validator: validateCheck, trigger: "blur" }],
  code: [{ validator: validateCode, trigger: "blur" }],
});
// github 登录
const githubLogin = (action: any) => {
  if (action === "authorize") {
    let url = "https://github.com/login/oauth/authorize?client_id="+import.meta.env.VITE_APP_CLIENT_ID+"&redirect_uri="+import.meta.env.VITE_APP_REDIRECT_URL
    window.location.href =url
  } else if (router.currentRoute.value.query.code != undefined) {
    oauthGithub({ code: router.currentRoute.value.query.code }).then(
      (res: any) => {
        console.log(res);
        store.setToken(res.token);
        const info = {
          avatar: res.avatar,
          name: res.name,
          email: res.email,
          uid: res.uid,
          id: res.id,
          expire_time: res.expire_time,
        };
        store.setUserInfo(info);
        // store.getSessionInfo()
        router.push({
          path: "/",
        });
      }
    );
  }
};
// 登录
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      login({
        email: userInfo.account,
        password: userInfo.password,
      }).then((res: any) => {
        console.log(res);
        store.setToken(res.token);
        const info = {
          avatar: res.avatar,
          name: res.name,
          email: res.email,
          uid: res.uid,
          id: res.id,
          expire_time: res.expire_time,
        };
        store.setUserInfo(info);
        // store.getSessionInfo()
        router.push({
          path: "/",
        });
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
// 注册获取邮箱验证码
const getCodeClick = () => {
  sendEmailCode({
    email: registerInfo.email,
    email_type: 1,
  }).then((res) => {
    console.log(res);
    ElMessage({
      message: "验证码已发送至邮箱，请注意查收！",
      type: "success",
    });
  });
};
// 确认注册
const submitRegisterForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      registerede(registerInfo).then((res) => {
        console.log(res);
        ElMessage({
          message: "注册成功，点击直接登录！",
          type: "success",
        });
        isReverse.value = false;
        userInfo.account = registerInfo.email;
        userInfo.password = registerInfo.password;
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
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
          <div class="ouath-btn">
            <svg
              @click="githubLogin('authorize')"
              t="1663505060486"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="15272"
              width="20"
              height="20"
            >
              <path
                d="M511.968 73.152q119.424 0 220.288 58.848t159.712 159.712 58.848 220.288q0 143.424-83.712 258.016t-216.288 158.56q-15.424 2.848-22.848-4t-7.424-17.152q0-1.728 0.288-43.712t0.288-76.864q0-55.424-29.728-81.152 32.576-3.424 58.56-10.272t53.728-22.272 46.272-38.016 30.272-60 11.712-86.016q0-68-45.152-117.728 21.152-52-4.576-116.576-16-5.152-46.272 6.272t-52.576 25.152l-21.728 13.728q-53.152-14.848-109.728-14.848t-109.728 14.848q-9.152-6.272-24.288-15.424t-47.712-22.016-48.576-7.712q-25.728 64.576-4.576 116.576-45.152 49.728-45.152 117.728 0 48.576 11.712 85.728t30.016 60 46.016 38.272 53.728 22.272 58.56 10.272q-22.272 20.576-28 58.848-12 5.728-25.728 8.576t-32.576 2.848-37.44-12.288-31.712-35.712q-10.848-18.272-27.712-29.728t-28.288-13.728l-11.424-1.728q-12 0-16.576 2.56t-2.848 6.56 5.152 8 7.424 6.848l4 2.848q12.576 5.728 24.864 21.728t18.016 29.152l5.728 13.152q7.424 21.728 25.152 35.136t38.272 17.152 39.712 4 31.712-2.016l13.152-2.272q0 21.728 0.288 50.56t0.288 31.136q0 10.272-7.424 17.152t-22.848 4q-132.576-44-216.288-158.56t-83.712-258.016q0-119.424 58.848-220.288t159.712-159.712 220.288-58.848zM239.392 703.424q1.728-4-4-6.848-5.728-1.728-7.424 1.152-1.728 4 4 6.848 5.152 3.424 7.424-1.152zM257.12 722.848q4-2.848-1.152-9.152-5.728-5.152-9.152-1.728-4 2.848 1.152 9.152 5.728 5.728 9.152 1.728zM274.272 748.576q5.152-4 0-10.848-4.576-7.424-9.728-3.424-5.152 2.848 0 10.272t9.728 4zM298.272 772.576q4.576-4.576-2.272-10.848-6.848-6.848-11.424-1.728-5.152 4.576 2.272 10.848 6.848 6.848 11.424 1.728zM330.848 786.848q1.728-6.272-7.424-9.152-8.576-2.272-10.848 4t7.424 8.576q8.576 3.424 10.848-3.424zM366.848 789.728q0-7.424-9.728-6.272-9.152 0-9.152 6.272 0 7.424 9.728 6.272 9.152 0 9.152-6.272zM399.968 784q-1.152-6.272-10.272-5.152-9.152 1.728-8 8.576t10.272 4.576 8-8z"
                p-id="15273"
              ></path>
            </svg>
          </div>
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
          <div class="login-btn">
            <el-button
              color="#5865F2"
              type="primary"
              @click="submitRegisterForm(registerRef)"
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
@import "@/assets/css/index.less";
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
      .login-btn,
      .register-btn {
        width: 100%;
        display: flex;
        margin: 5px 0;
      }
    }
  }
  .right {
    .title {
      width: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--theme-color);
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
      .login-btn,
      .register-btn {
        width: 100%;
        display: flex;
        margin: 5px 0;
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
