<template>
  <v-switch
    hide-details
    :model-value="model"
    :color="color"
    :label="label"
  ></v-switch>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'red',
  },
  model: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
});

const { color, model, label } = toRefs(props);
</script>
