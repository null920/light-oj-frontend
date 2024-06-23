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
      <a-dropdown>
        <a-avatar auto-fix-font-size trigger-type="mask">
          <div
            v-if="
              !store.state.user?.loginUser?.userRole ||
              store.state.user?.loginUser?.userRole === ACCESS_ENUM.NOT_LOGIN
            "
          >
            未登录
          </div>
          <div v-else>
            <IconUser size="32px" />
          </div>
          <template #trigger-icon></template>
        </a-avatar>
        <template #content>
          <a-doption
            v-if="
              !store.state.user?.loginUser?.userRole ||
              store.state.user?.loginUser?.userRole === ACCESS_ENUM.NOT_LOGIN
            "
            @click="doLogin"
          >
            <template #icon>
              <IconImport />
            </template>
            <template #default>登录</template>
          </a-doption>
          <a-doption
            v-if="
              store.state.user?.loginUser?.userRole &&
              store.state.user?.loginUser?.userRole !== ACCESS_ENUM.NOT_LOGIN
            "
            @click="doLogout"
          >
            <template #icon>
              <IconExport />
            </template>
            <template #default>退出登录</template>
          </a-doption>
        </template>
      </a-dropdown>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { IconUser, IconImport, IconExport } from "@arco-design/web-vue/es/icon";
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";
import message from "@arco-design/web-vue/es/message";

const router = useRouter();
const store = useStore();

// let user = ref(store.state.user);
// console.log(user.value.loginUser);

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
const doLogin = () => {
  router.push({
    path: `/user/login?redirect=${router.currentRoute.value.fullPath}`,
  });
};

const doLogout = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.code === 0) {
    store.commit("user/setLoginUser", {
      loginUser: {
        userName: "未登录",
      },
    });
    message.success("登出成功");
    window.location.reload();
  } else {
    message.error("登出失败," + res.message);
  }
};

// 切换菜单
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
