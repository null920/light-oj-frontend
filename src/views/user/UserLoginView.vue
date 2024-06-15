<template>
  <div class="userLoginView">
    <a-space class="loginText">
      <div>用户</div>
      <div>登录</div>
    </a-space>
    <a-form
      class="loginForm"
      :model="form"
      :rules="rules"
      @submit-success="handleSubmit"
      :auto-label-width="true"
    >
      <a-form-item
        field="userAccount"
        :validate-trigger="['change', 'input']"
        :hide-asterisk="true"
        label-component=""
      >
        <a-input v-model="form.userAccount" placeholder="请输入用户名">
          <template #prefix>
            <IconUser />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="userPassword"
        :validate-trigger="['change', 'input']"
        :hide-asterisk="true"
      >
        <a-input-password
          v-model="form.userPassword"
          allow-clear
          placeholder="请输入密码"
        >
          <template #prefix>
            <IconLock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-space class="loginViewButton" direction="vertical">
          <a-button
            class="loginButton"
            type="primary"
            shape="round"
            html-type="submit"
            long
            >登录
          </a-button>
          <a-button
            type="dashed"
            shape="round"
            long
            html-type="button"
            @click="toRegister"
            >注册
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>
<style>
.userLoginView .loginText {
  margin-bottom: 60px;
  font-size: 28px;
  font-weight: bold;
}

.loginForm {
  max-width: 340px;
  margin: 0 auto;
}

.loginViewButton {
  width: 400px;
  padding: 10px;
  border: 1px solid var(~"--color-border");
  border-radius: 4px;
}

.loginViewButton .loginButton {
  margin-bottom: 5px;
}
</style>

<script setup lang="ts">
import { reactive } from "vue";
import { IconUser, IconLock } from "@arco-design/web-vue/es/icon";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const rules = {
  userAccount: [
    {
      required: true,
      message: "用户名为必填项",
    },
  ],
  userPassword: [
    {
      required: true,
      message: "密码为必填项",
    },
  ],
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
  message.loading({
    content: "登录中...",
    duration: 10000,
  });
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    message.clear();
    message.success("登录成功");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("登录失败," + res.message);
  }
  console.log(form);
};
/**
 * 跳转到注册页面
 */
const toRegister = () => {
  router.push({
    path: "/user/register",
  });
};
</script>
