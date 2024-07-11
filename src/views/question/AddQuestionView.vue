<template>
  <div id="addQuestionView">
    <div style="font-size: 28px; font-weight: bold; margin-bottom: 30px">
      {{ pageHeader }}
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
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";

const route = useRoute();
const updatePage = route.path.includes("update");
const pageHeader = ref("");

const form = ref({
  title: "",
  answer: "",
  content: "",
  tags: [],
  judgeConfig: {
    memoryLimit: 0,
    stackLimit: 0,
    timeLimit: 0,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败" + res.message);
  }
};

onMounted(async () => {
  // 如果是更新题目，则加载题目数据
  if (updatePage) {
    pageHeader.value = "更新题目";
    await loadData();
  } else {
    pageHeader.value = "创建题目";
  }
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
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};
const onAnswerChange = (value: string) => {
  form.value.answer = value;
};

const handleSubmit = async () => {
  if (updatePage) {
    message.loading({
      content: "更新中...",
      duration: 10000,
    });
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.clear();
      message.success("更新成功");
    } else {
      message.clear();
      message.error("更新失败," + res.message);
    }
  } else {
    message.loading({
      content: "创建中...",
      duration: 10000,
    });
    //console.log(form);
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.clear();
      message.success("创建成功");
    } else {
      message.clear();
      message.error("创建失败," + res.message);
    }
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
