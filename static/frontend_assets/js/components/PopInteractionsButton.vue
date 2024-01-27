<template>
<v-card>
    <v-btn
            prepend-icon="mdi-open-in-new" stacked
            v-if="selectMode"
            color="blue"
            @click="deleteSelectedInteractions">
            Delete Selected Interactions
        </v-btn>
</v-card>

    
</template>
<script setup>
    import { computed , defineEmits } from 'vue';
    import { useStore } from 'vuex';
    const store = useStore();
    const emit = defineEmits()

    const selectMode = computed(() => store.state.selectMode)

</script>