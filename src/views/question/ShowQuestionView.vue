<template>
  <div id="showQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
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
      </a-col>
      <a-col :md="12" :xs="24">
        <a-card>
          <template #extra>
            <a-link>More</a-link>
          </template>
          <CodeEditor />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { ref, withDefaults, defineProps, onMounted } from "vue";
import { QuestionControllerService, QuestionVO } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import MdViewer from "@/components/MdViewer.vue";
import CodeEditor from "@/components/CodeEditor.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败" + res.message);
  }
};

onMounted(() => {
  loadData();
});
</script>
<style scoped>
#showQuestionView {
}

.arco-card-size-medium.arco-card-body {
  padding: 16px 0px;
}
</style>
