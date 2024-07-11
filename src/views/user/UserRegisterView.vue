<template>
  <div class="userRegisterView">
    <a-space class="registerText">
      <div>用户</div>
      <div>注册</div>
    </a-space>
    <a-form
      class="registerForm"
      label-align="left"
      :model="form"
      :rules="rules"
      @submit-success="handleSubmit"
      :auto-label-width="true"
    >
      <a-form-item
        field="userAccount"
        label="用户名"
        tooltip="用户名不能少于4个字符"
        :validate-trigger="['change', 'input']"
        :hide-asterisk="true"
      >
        <a-input v-model="form.userAccount" placeholder="请输入用户名">
          <template #prefix>
            <IconUser />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="userPassword"
        label="密码"
        tooltip="密码不能少于8个字符"
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
      <a-form-item
        field="checkPassword"
        label="确认密码"
        tooltip="确认密码不能少于8个字符"
        :validate-trigger="['change', 'input']"
        :hide-asterisk="true"
        style="margin-bottom: 10px"
      >
        <a-input-password
          v-model="form.checkPassword"
          allow-clear
          placeholder="请输入确认密码"
        >
          <template #prefix>
            <IconLock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-link class="loginLink" href="/user/login" :hoverable="false"
        >已有账号？去登录
      </a-link>
      <a-form-item>
        <a-space class="registerButton" direction="vertical">
          <a-button type="primary" shape="round" html-type="submit" long
            >注册
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { IconUser, IconLock } from "@arco-design/web-vue/es/icon";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const regx = /[^a-zA-Z0-9_]/g;
const rules = {
  userAccount: [
    {
      required: true,
      message: "用户名为必填项",
    },
    {
      validator: (value, cb) => {
        if (value?.length < 4) {
          cb("用户名不能少于4位哦");
        } else {
          cb();
        }
      },
    },
  ],
  userPassword: [
    {
      required: true,
      message: "密码为必填项",
    },
    {
      validator: (value, cb) => {
        if (value?.length < 8) {
          cb("密码不能少于8位哦");
        } else if (regx.test(value)) {
          cb("不能包含特殊字符哦");
        } else {
          cb();
        }
      },
    },
  ],
  checkPassword: [
    {
      required: true,
      message: "确认密码为必填项",
    },
    {
      validator: (value, cb) => {
        if (value !== form.userPassword) {
          cb("两次密码不一致哦");
        } else {
          cb();
        }
      },
    },
  ],
};

const router = useRouter();
/**
 * 提交表单
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  if (res.code === 0) {
    message.success("注册成功");
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    message.error("注册失败," + res.message);
  }
  //console.log(form);
};
</script>

<style>
.registerForm {
  max-width: 340px;
  margin: 0 auto;
}

.userRegisterView .registerText {
  margin-bottom: 60px;
  font-size: 28px;
  font-weight: bold;
}

.registerForm .loginLink {
  text-align: left;
  display: block;
  margin-left: 90px;
  margin-right: auto;
}

.registerButton {
  width: 400px;
  padding: 10px;
  border: 1px solid var(~"--color-border");
  border-radius: 4px;
}
</style>
