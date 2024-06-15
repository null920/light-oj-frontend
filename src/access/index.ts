import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  const user = store.state.user;
  let currentUser = user.loginUser;
  // 之前用户没有登录，自动登录
  if (!currentUser || !currentUser.userRole) {
    // 等用户登录成功后，再执行后续的代码
    await store.dispatch("user/getLoginUser");
    console.log(user.loginUser);
  }
  currentUser = user.loginUser;

  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;

  // 如果要跳转的页面必须要用户登录
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果用户没登录，跳转到登录页
    if (!currentUser || !currentUser.userRole) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    if (!checkAccess(currentUser, needAccess)) {
      next("/403");
      return;
    }
  }
  next();
});
