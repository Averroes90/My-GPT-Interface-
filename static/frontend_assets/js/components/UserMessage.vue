<template>
    <div class="user-message">
      You: {{ message }}
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    message: String
  });
  </script>