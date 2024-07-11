<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="height: 100%; min-height: 40vh"
  ></div>
  <!--  <a-button @click="fillValue">填充值</a-button>-->
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { defineProps, onMounted, ref, toRaw, watch, withDefaults } from "vue";

interface Props {
  value: string;
  language?: string;
  handleChange: (v: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  language: "java",
  handleChange: (v: string) => {
    //console.log(v);
  },
});

const codeEditorRef = ref();
const codeEditor = ref();

const value = ref("Hello World");
// const fillValue = () => {
//   if (!codeEditor.value) {
//     return;
//   }
//   toRaw(codeEditor.value).setValue("new World");
// };

watch(
  () => props.language,
  () => {
    if (codeEditor.value) {
      monaco.editor.setModelLanguage(
        toRaw(codeEditor.value).getModel(),
        props.language
      );
    }
  }
);

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: "java",
    folding: true,
    foldingHighlight: true,
    showFoldingControls: "always",
    automaticLayout: true,
    lineNumbers: "on",
  });

  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>
<style>
.arco-tabs-nav-tab {
  margin-bottom: 5px;
}
</style>
