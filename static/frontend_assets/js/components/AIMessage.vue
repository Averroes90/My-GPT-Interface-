<template>
  <v-col class="ai-message " :cols="deletionMode ? '11' : '12'">
    AI:
    <span v-for="(segment, index) in segments" :key="index">
      <template v-if="segment.type === 'text'">
        {{ segment.value }}
      </template>
      <template v-else>
        <pre class="code-container">
          <code v-highlight>{{ segment.value }}</code>
        </pre>
      </template>
    </span>
  </v-col>
</template>

<script setup>
import { computed, onUpdated, ref, nextTick, onMounted } from 'vue';
import { useStore } from 'vuex';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/github-dark.css';

const props = defineProps({ segments: Array });
const codeBlocks = ref([]);
const store = useStore();
const deletionMode = computed(() => store.state.deletionMode);

function highlightCodeBlocks() {
  nextTick(() => {
    if (codeBlocks.value) {
      codeBlocks.value.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  });
}
onMounted(() => {
  highlightCodeBlocks();
});
onUpdated(() => {
  highlightCodeBlocks();
});
</script>
<style scoped>
.ai-message {
  color: #85c1e9;  /* This is a light blue shade which complements the existing dark theme */
}
</style>