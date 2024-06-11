<template>
  <div class="globalHeader">
    <a-menu
      mode="horizontal"
      :selected-keys="selectedKey"
      @menu-item-click="doMenuClick"
    >
      <a-menu-item
        key="0"
        :style="{ padding: 0, marginRight: '38px' }"
        disabled
      >
        <div class="title-bar">
          <img class="title-bar-icon" src="../assets/logo.svg" />
          <div class="title-bar-text">数字灯塔-OJ</div>
        </div>
      </a-menu-item>
      <a-menu-item
        v-for="item in routes"
        :key="item.path"
        class="menu-item-text"
      >
        {{ item.name }}
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const selectedKey = ref(["/"]);

router.afterEach((to) => {
  selectedKey.value = [to.path];
});

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title-bar .title-bar-icon {
  height: 50px;
}

.title-bar .title-bar-text {
  font-size: large;
  font-weight: bolder;
  color: #000;
  margin-left: 16px;
}

.menu-item-text {
  font-size: 16px;
}
</style>
