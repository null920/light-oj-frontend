<template>
  <div id="userLayout">
    <a-layout style="height: 400px">
      <a-layout-header class="header">
        <a-space class="title-bar">
          <img src="@/assets/logo.svg" class="title-bar-logo" />
          <div class="title-bar-text">数字灯塔-OJ</div>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a-divider />
        <a class="copyright" href="https://github.com/null920" target="_blank">
          数字灯塔-OJ判题系统 by null920
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#userLayout {
  text-align: center;
}

#userLayout .header {
  margin-top: 16px;
  margin-bottom: 20px;
}

#userLayout .title-bar {
  padding: 14px;
}

#userLayout .title-bar-logo {
  height: 64px;
}

#userLayout .title-bar-text {
  font-size: 33px;
  font-weight: bolder;
  color: #000;
  margin-left: 8px;
}

#userLayout .content {
  margin-top: 20px;
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  padding: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

.footer .copyright {
  color: #86909c;
  font-size: 14px;
}
</style>
