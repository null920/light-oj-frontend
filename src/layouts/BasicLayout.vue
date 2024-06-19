<template>
  <div id="basicLayout">
    <a-layout class="aLayout" style="height: 400px">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-divider />
      <a-layout-footer class="footer">
        <a class="copyright" href="https://github.com/null920" target="_blank">
          数字灯塔-OJ判题系统 by null920
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>

<style scoped>
#basicLayout {
  height: 100%;
}

#basicLayout .aLayout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

#basicLayout .header {
  margin-bottom: 8px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .content {
  //background: linear-gradient(to right, #aaa, #fff);
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayout .footer {
  background-color: #f7f8fa;
  padding: 20px;
  margin-top: auto;
  text-align: center;
}

.footer .copyright {
  color: #86909c;
  font-size: 14px;
}
</style>
