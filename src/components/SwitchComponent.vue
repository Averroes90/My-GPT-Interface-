<template>
    <v-switch
      hide-details
      :model-value="model"
      :color="color || 'primary'"
      :label=label
    ></v-switch>
  </template>
  <script setup>
    import { ref, toRefs } from 'vue';
    const props = defineProps({
    color: String,
    model: Boolean,
    label: String,
  });
  const { color, model, label } = toRefs(props);
  </script>