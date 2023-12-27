<template>
    <div class="ai-message">
      AI: 
      <span v-for="(segment, i) in segments" :key="i">
        <span v-if="segment.type === 'text'">{{ segment.value }}</span>
        <CodeHighlight v-else :code="segment.value" />
      </span>
    </div>
  </template>
  
  <script setup>
  import CodeHighlight from './CodeHighlight.vue';
  
  // Props
  const props = defineProps({
    segments: Array
  });
  </script>