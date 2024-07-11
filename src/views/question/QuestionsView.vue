<template>
  <div id="questionsView">
    <div style="font-size: 28px; font-weight: bold; margin-bottom: 30px">
      题目列表
    </div>
    <a-space direction="vertical" size="large">
      <a-form :model="searchParams" layout="inline">
        <a-form-item field="title" label="标题">
          <a-input
            style="width: 250px"
            v-model="searchParams.title"
            placeholder="请输入标题"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="tags" label="标签">
          <a-input-tag
            style="width: 280px"
            v-model="searchParams.tags"
            placeholder="请输入标签"
            allow-clear
          />
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
      <template #title="{ record }">
        <a-link @click="toQuestionPage(record)">{{ record.title }}</a-link>
      </template>
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag
            v-for="(tag, index) in record.tags"
            :key="index"
            color="green"
            bordered
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${
            record.submitNum ? record.acceptedNum / record.submitNum : "0"
          } % (${record.acceptedNum}/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ record.createTime }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button status="success" @click="toQuestionPage(record)"
            >做题
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const router = useRouter();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});
/**
 * 搜索
 */
const onSearch = () => {
  if (searchParams.value.title == "" && searchParams.value.tags.length == 0) {
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
  if (searchParams.value.title == "" && searchParams.value.tags.length == 0) {
    return;
  }
  searchParams.value = {
    title: "",
    tags: [],
    pageSize: 10,
    current: 1,
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
  try {
    const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
      searchParams.value
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
      message.error("加载失败" + res.message);
    }
  } catch (e) {
    message.clear();
    message.error("加载失败" + e);
  }
};

// 监听搜索参数变化
watchEffect(() => {
  loadData();
});

// /**
//  * 页面加载时请求数据
//  */
// onMounted(() => {
//   loadData();
// });

const columns = [
  {
    title: "题号",
    slotName: "id",
  },
  {
    title: "标题",
    slotName: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};
</script>
<style scoped>
#questionsView {
  max-width: 1420px;
  margin: 0 auto;
}
</style>
