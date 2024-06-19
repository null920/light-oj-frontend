<template>
  <div id="addQuestionView">
    <div style="font-size: 28px; font-weight: bold; margin-bottom: 30px">
      创建题目
    </div>
    <a-form
      class="addQuestionForm"
      :model="form"
      label-align="left"
      :auto-label-width="true"
      :rules="rules"
      @submit-success="handleSubmit"
    >
      <a-form-item
        field="title"
        label="标题"
        :validate-trigger="['change', 'input', 'blur']"
        :hide-asterisk="true"
      >
        <a-input
          class="judgeCaseInput"
          v-model="form.title"
          placeholder="请输入标题"
          allow-clear
        ></a-input>
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          style="width: 500px"
          v-model="form.tags"
          placeholder="请输入标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        field="content"
        label="题目内容"
        :validate-trigger="['change', 'input']"
        :hide-asterisk="true"
      >
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item
        field="answer"
        label="参考答案"
        :validate-trigger="['change', 'input']"
        :hide-asterisk="true"
      >
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>

      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              class="input-demo"
              :default-value="1000"
              :min="0"
              :formatter="formatter"
              :parser="parser"
            >
              <template #append>ms</template>
            </a-input-number>
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              class="input-demo"
              :default-value="1000"
              :min="0"
              :formatter="formatter"
              :parser="parser"
            >
              <template #append>KB</template>
            </a-input-number>
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              class="input-demo"
              :default-value="1000"
              :min="0"
              :formatter="formatter"
              :parser="parser"
            >
              <template #append>KB</template>
            </a-input-number>
          </a-form-item>
        </a-space>
      </a-form-item>

      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
        :validate-trigger="['change', 'input']"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space
            direction="vertical"
            style="min-width: 450px; margin-bottom: 20px"
          >
            <a-form-item
              :field="`judgeCase[${index}].input`"
              :label="`输入参数 ${index + 1}`"
              :key="index"
            >
              <a-input
                class="judgeCaseInput"
                v-model="judgeCaseItem.input"
                placeholder="请输入参数"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              :field="`judgeCase[${index}].output`"
              :label="`输出结果 ${index + 1}`"
              :key="index"
            >
              <a-input
                class="judgeCaseInput"
                v-model="judgeCaseItem.output"
                placeholder="请输入结果"
                allow-clear
              />
            </a-form-item>
            <a-button @click="handleDelete(index)" status="danger"
              >删除用例
            </a-button>
          </a-space>
        </a-form-item>
        <div>
          <a-button @click="handleAdd" type="outline" status="success"
            >添加用例
          </a-button>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          style="min-width: 200px"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";

const route = useRoute();

const form = reactive({
  title: "",
  answer: "",
  content: "",
  tags: ["栈", "简单"],
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "1 2",
      output: "3 4",
    },
  ],
});

const rules = {
  title: [
    {
      required: true,
      message: "标题为必填项",
    },
  ],
  answer: [
    {
      required: true,
      message: "答案为必填项",
    },
  ],
  content: [
    {
      required: true,
      message: "内容为必填项",
    },
  ],
  judgeCase: [
    {
      required: true,
      message: "测试用例为必填项",
    },
  ],
};

const formatter = (value: string) => {
  const values = value.split(".");
  values[0] = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return values.join(".");
};

const parser = (value: string) => {
  return value.replace(/,/g, "");
};

const handleAdd = () => {
  form.judgeCase.push({
    input: "",
    output: "",
  });
};
const handleDelete = (index: number) => {
  form.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.content = value;
};
const onAnswerChange = (value: string) => {
  form.answer = value;
};

const handleSubmit = async () => {
  message.loading({
    content: "登录中...",
    duration: 10000,
  });
  console.log(form);
  const res = await QuestionControllerService.addQuestionUsingPost(form);
  if (res.code === 0) {
    message.clear();
    message.success("添加成功");
  } else {
    message.clear();
    message.error("添加失败," + res.message);
  }
};
</script>
<style scoped>
#addQuestionView {
}

.judgeCaseInput {
  width: 300px;
}
</style>
