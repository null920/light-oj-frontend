import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/ExampleView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import DoQuestionView from "@/views/question/DoQuestionView.vue";
import SubmitQuestionView from "@/views/question/SubmitQuestionView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
        meta: {
          title: "用户登录",
        },
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
        meta: {
          title: "用户注册",
        },
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  // {
  //   path: "/",
  //   name: "题库",
  //   component: HomeView,
  // },
  {
    path: "/",
    name: "浏览题目",
    component: QuestionsView,
  },
  {
    path: "/submit/question",
    name: "已提交题目",
    component: SubmitQuestionView,
  },
  {
    path: "/view/question/:id",
    name: "在线做题",
    component: DoQuestionView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/manage/question",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },

  // {
  //   path: "/admin",
  //   name: "管理员页面",
  //   component: AdminView,
  //   meta: {
  //     access: ACCESS_ENUM.ADMIN,
  //   },
  // },
  {
    path: "/403",
    name: "403",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
];
