<template>
  <v-col
    class="user-message pa-0"
    :class="{'ml-0': deletionMode, 'pl-0': deletionMode}">
    You: 
    <div v-html="$markdown.render(segments)"></div>
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


</script>
