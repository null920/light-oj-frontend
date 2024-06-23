<template>
  <div id="doQuestionView">
    <a-split
      :style="{
        height: '70vh',
        width: '100%',
        minWidth: '500px',
        border: '1px solid var(--color-border)',
      }"
      min="450px"
    >
      <template #resize-trigger></template>
      <template #first>
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ `${question.judgeConfig.timeLimit ?? 0} ms` }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ `${question.judgeConfig.memoryLimit ?? 0} MB` }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ `${question.judgeConfig.stackLimit ?? 0} MB` }}
                </a-descriptions-item>
              </a-descriptions>
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) in question.tags"
                    :key="index"
                    color="green"
                    bordered
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
              <MdViewer :value="question.content || ''" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="answer" title="题解"> 暂时没有答案</a-tab-pane>
          <a-tab-pane key="comment" title="评论" disabled>
            评论区待开发
          </a-tab-pane>
        </a-tabs>
      </template>
      <template #second>
        <div>
          <a-split
            direction="vertical"
            :style="{ height: '70vh', minWidth: '100px' }"
          >
            <template #first>
              <a-card :bordered="false">
                <template #title>
                  <a-space
                    direction="vertical"
                    size="large"
                    style="margin-top: 10px"
                  >
                    <a-form :model="form" layout="inline">
                      <a-form-item field="language" label="编程语言">
                        <a-select
                          v-model="form.language"
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
                    </a-form>
                  </a-space>
                </template>
                <template #extra>
                  <a-space>
                    <a-button
                      type="primary"
                      status="success"
                      :loading="submitLoading"
                      @click="onSubmit"
                      shape="round"
                    >
                      <template #icon>
                        <icon-upload
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </template>
                      <!-- Use the default slot to avoid extra spaces -->
                      提交
                    </a-button>
                  </a-space>
                </template>
                <CodeEditor
                  :value="form.code"
                  :language="form.language"
                  :handleChange="codeHandleChange"
                />
              </a-card>
            </template>
            <template #second>
              <a-typography-paragraph>Bottom</a-typography-paragraph>
            </template>
          </a-split>
        </div>
      </template>
    </a-split>
  </div>
</template>
<script setup lang="ts">
import { ref, withDefaults, defineProps, onMounted } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import MdViewer from "@/components/MdViewer.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import { IconUpload } from "@arco-design/web-vue/es/icon";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();
const submitLoading = ref(false);
const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const codeHandleChange = (v: string) => {
  form.value.code = v;
};

const onSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  submitLoading.value = !submitLoading.value;
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
    submitLoading.value = !submitLoading.value;
  } else {
    message.error("提交失败，" + res.message);
    submitLoading.value = !submitLoading.value;
  }
};
</script>

<style scoped>
#doQuestionView {
}

.arco-card-size-medium.arco-card-body {
  padding: 16px 0;
}
</style>
