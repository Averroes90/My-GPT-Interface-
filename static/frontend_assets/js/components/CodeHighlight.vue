<template>
    <pre class="code-container">
      <code ref="codeBlock" class="hljs">{{ code }}</code>
    </pre>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue';
  import hljs from 'highlight.js';
  
  const props = defineProps({
    code: String
  });
  
  const codeBlock = ref(null);
  
  nextTick(() => {
    if (codeBlock.value) {
      hljs.highlightElement(codeBlock.value);
    }
  });
  </script>