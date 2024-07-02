<template>
  <div id="submitQuestionView">
    <div style="font-size: 28px; font-weight: bold; margin-bottom: 30px">
      题目列表
    </div>
    <a-space direction="vertical" size="large">
      <a-form :model="searchParams" layout="inline">
        <a-form-item field="questionId" label="题目id">
          <a-input
            style="width: 250px"
            v-model="searchParams.questionId"
            placeholder="请输入题目id"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="language" label="编程语言">
          <a-select
            v-model="searchParams.language"
            :style="{ width: '100px' }"
            placeholder="编程语言"
            :trigger-props="{ autoFitPopupMinWidth: true }"
          >
            <a-option disabled>c</a-option>
            <a-option disabled>cpp</a-option>
            <a-option>java</a-option>
            <a-option disabled>python</a-option>
            <a-option disabled>go</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onSearch">搜索</a-button>
          <a-button style="margin-left: 20px" @click="resetSearch"
            >重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-space>
    <a-divider size="0" />
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total: total,
      }"
      @page-change="onPageChange"
    >
      <template #id="{ record }">
        {{ record.id.toString().slice(-5) }}
      </template>
      <template #status="{ record }">
        {{ getQuestionStatus(record.status) }}
      </template>
      <template #message="{ record }">
        {{ record.judgeInfo.message }}
      </template>
      <template #memory="{ record }">
        {{ `${record.judgeInfo.memory} KB` }}
      </template>
      <template #time="{ record }">
        {{ `${record.judgeInfo.time} ms` }}
      </template>
      <template #questionTitle="{ record }">
        <a-link @click="toQuestionPage(record.questionVO)"
          >{{ record.questionVO.title }}
        </a-link>
      </template>
      <template #userName="{ record }">
        {{ record.submitterUserVO.userName }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitQueryRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const router = useRouter();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  pageSize: 10,
  current: 1,
  language: "java",
  questionId: undefined,
});
/**
 * 搜索
 */
const onSearch = () => {
  if (
    searchParams.value.questionId === undefined &&
    searchParams.value.language === ""
  ) {
    return;
  }
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
/**
 * 重置搜索
 */
const resetSearch = () => {
  if (
    searchParams.value.questionId === undefined &&
    searchParams.value.language === ""
  ) {
    return;
  }
  searchParams.value = {
    pageSize: 10,
    current: 1,
    language: "java",
    questionId: undefined,
  };
};
/**
 * 分页
 * @param current
 */
const onPageChange = (current: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: current,
  };
};

/**
 * 加载数据
 */
const loadData = async () => {
  message.loading({
    content: "加载中...",
    duration: 10000,
  });
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "create_time",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    message.clear();
    message.success({
      content: "加载完成",
      duration: 1000,
    });
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.clear();
    message.error("加载失败，" + res.message);
  }
};

// 监听搜索参数变化
watchEffect(() => {
  loadData();
});

const getQuestionStatus = (status: number) => {
  if (status === 0) {
    return "等待中";
  } else if (status === 1) {
    return "判题中";
  } else if (status === 2) {
    return "成功";
  } else if (status === 3) {
    return "失败";
  }
};

// /**
//  * 页面加载时请求数据
//  */
// onMounted(() => {
//   loadData();
// });

const columns = [
  {
    title: "提交id",
    slotName: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    children: [
      { title: "消息", slotName: "message" },
      { title: "内存", slotName: "memory" },
      { title: "耗时", slotName: "time" },
    ],
  },
  {
    title: "判题状态",
    slotName: "status",
  },
  {
    title: "题目id",
    dataIndex: "questionId",
  },
  {
    title: "题目名",
    slotName: "questionTitle",
  },
  {
    title: "提交者",
    slotName: "userName",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
];

const toQuestionPage = (questionVO: QuestionVO) => {
  router.push({
    path: `/view/question/${questionVO.id}`,
  });
};
</script>

<style scoped>
#submitQuestionView {
  max-width: 1420px;
  margin: 0 auto;
}
</style>
