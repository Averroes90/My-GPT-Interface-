<!-- PromptArea.vue -->
<template>
        <v-textarea clearable 
            placeholder="Enter your prompt here"
            append-inner-icon="mdi-send"
            @click:append-inner="sendPrompt"
            @keydown.enter = "!$event.shiftKey && sendPrompt()"
            hide-details
        ></v-textarea>
</template>

<script setup>
import { defineEmits } from 'vue';



const emit = defineEmits();
const sendPrompt = ()=>{emit('sendprompt')}
</script>