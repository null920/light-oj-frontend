<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
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
            <img class="title-bar-logo" src="../assets/logo.svg" />
            <div class="title-bar-text">数字灯塔-OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item
          v-for="item in visibleRoutes"
          :key="item.path"
          class="menu-item-text"
        >
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <a-space size="small">
        <a-avatar auto-fix-font-size trigger-type="mask">
          <div
            v-if="
              !store.state.user?.loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
            "
          >
            <IconUser />
          </div>
          <div v-else>未登录</div>
          <template #trigger-icon>
            <IconPlus
              v-if="
                store.state.user?.loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
              "
            />
          </template>
        </a-avatar>
        {{ store.state.user?.loginUser.userName }}
        {{ store.state.user?.loginUser.userRole }}
      </a-space>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { IconUser, IconPlus } from "@arco-design/web-vue/es/icon";
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";

const router = useRouter();
const store = useStore();
const loginUser = store.state.user?.loginUser;

const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    // 隐藏无需展示的菜单
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user?.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

const selectedKey = ref(["/"]);

router.afterEach((to) => {
  selectedKey.value = [to.path];
});

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "null92",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);
console.log(loginUser);

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

.title-bar .title-bar-logo {
  height: 64px;
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
