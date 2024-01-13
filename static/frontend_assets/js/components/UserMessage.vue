<template>
  <v-col class="user-message" :cols="deletionMode ? '11' : '12'">
    You: 
    <div v-html="segments"></div>
  </v-col>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/github-dark.css';

const props = defineProps({
  message: String,
  segments: String
});

const store = useStore();
const deletionMode = computed(() => store.state.deletionMode);
const processedMessage = ref('');

// watch(() => props.segments, (newSegments) => {
//   console.log('inwatcher')
//   const combinedSegments = newSegments.map(segment => {
//     if (segment.type === 'text') {
//       console.log(`text: ${segment.value}`)
//       return segment.value;
//     } else if (segment.type === 'code') {
//       console.log(`code: ${segment.value}`)
//       // Create a container for the code segment
//       const codeContainer = document.createElement('div');
//       const preElement = document.createElement('pre');
//       const codeElement = document.createElement('code');
//       preElement.appendChild(codeElement);
//       codeElement.textContent = segment.value;
//       codeContainer.appendChild(preElement);

//       // Apply syntax highlighting
//       hljs.highlightElement(codeElement);

//       // Return the outerHTML of the container
//       return codeContainer.innerHTML;
//     }
//   }).join('\n');

//   processedMessage.value = combinedSegments;
// }, { immediate: true });


</script>
