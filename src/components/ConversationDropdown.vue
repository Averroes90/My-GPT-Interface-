<!-- ConversationDropdown.vue -->
<template>
  <v-select
    :items="items"
    item-title="name"
    item-value="id"
    :value="selected"
    :disabled="disabled"
  ></v-select>
</template>

<script setup>
  import { ref, toRefs } from 'vue';

  const props = defineProps({
    items: Array,
    selected: [String, Number],
    disabled: Boolean,
  });

  const { items, selected, disabled } = toRefs(props);


</script>