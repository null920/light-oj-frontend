<template>
  <div id="exampleView">
    <CodeEditor :value="codeValue" :handle-change="codeHandleChange" />
    <MdEditor :value="mdValue" :handle-change="mdHandleChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue"; // @ is an alias to /src

const mdValue = ref("");
const codeValue = ref("");
const codeHandleChange = (v: string) => {
  codeValue.value = v;
};
const mdHandleChange = (v: string) => {
  mdValue.value = v;
};
</script>

<style scoped></style>
