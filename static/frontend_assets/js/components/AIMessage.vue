<template>
  <v-col class="ai-message pa-0">
    AI:
    <div  v-html="$markdown.render(response)"></div>
  </v-col>
</template>

<script setup>
import { computed, onUpdated, ref, nextTick, onMounted } from 'vue';
import { useStore } from 'vuex';
//import 'github-markdown-css';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/github-dark.css';

const props = defineProps({ response: String });
const store = useStore();
const selectMode = computed(() => store.state.selectMode);


</script>
