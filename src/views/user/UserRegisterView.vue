<template>
  <div class="userRegisterView">
    <h2 class="registerText">用户注册</h2>
    <a-form
      class="registerForm"
      label-align="left"
      :model="form"
      :rules="rules"
      @submit="handleSubmit"
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
      <a-form-item>
        <a-space class="registerButton" direction="vertical">
          <a-button type="primary" shape="round" html-type="submit" long
            >登录
          </a-button>
          <a-button type="dashed" shape="round" long>注册</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>
<style>
.registerForm {
  max-width: 340px;
  margin: 0 auto;
}

.userRegisterView .registerText {
  margin-bottom: 40px;
}

.registerButton {
  width: 400px;
  padding: 10px;
  border: 1px solid var(~"--color-border");
  border-radius: 4px;
}
</style>

<script setup lang="ts">
import { reactive } from "vue";
import { IconUser, IconLock } from "@arco-design/web-vue/es/icon";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

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
  checkPassword: [
    {
      required: true,
      message: "确认密码为必填项",
    },
    {
      validator: (value, cb) => {
        if (value !== form.userPassword) {
          cb("two passwords do not match");
        } else {
          cb();
        }
      },
    },
  ],
};

const router = useRouter();
const store = useStore();
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
  console.log(form);
};
</script>
