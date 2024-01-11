<template>
  <v-col class="ai-message" :cols="deletionMode ? '11' : '12'">
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
const deletionMode = computed(() => store.state.deletionMode);


</script>
<style>
.ai-message {
  color: #85c1e9;  /* This is a light blue shade which complements the existing dark theme */
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: bold;
}
h1 { font-size: 2em; }
h2 { font-size: 1.75em; }
h3 { font-size: 1.5em; }
/* Continue for h4, h5, h6 as needed */
ul, ol {
  margin-left: 2em;
  list-style-position: outside;
}
li {
  margin-bottom: 0.5em;
}
p {
  margin-top: 2em;
  margin-bottom: 2em;
}

pre {
  background-color: #2d2d2d;
  border: 1px solid #3c3c3c;
  padding: 0.5em;
  margin-top: 1em;
  margin-bottom: 1em;
  overflow-x: auto;
}
pre code {
  background: none;
  border: none;
  padding: 0;
}
code {
  background-color: #3c3c3c;
  padding: 0.2em;
}

strong { font-weight: bold; }
em { font-style: italic; }

</style>