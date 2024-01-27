<template>
  <v-col
    class="user-message pa-0"
    :class="{'ml-0': selectMode, 'pl-0': selectMode}">
    You: 
    <div v-html="$markdown.render(segments)"></div>
  </v-col>
</template>


<script setup>
import { computed} from 'vue';
import { useStore } from 'vuex';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/github-dark.css';

const props = defineProps({
  message: String,
  segments: String
});

const store = useStore();
const selectMode = computed(() => store.state.selectMode);


</script>
