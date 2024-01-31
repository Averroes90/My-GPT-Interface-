<template>
<v-overlay class="justify-end align-end ma-0 pa-0"  
    contained persistent
    no-click-animation
    :model-value="selectMode"
    :scrim="false"
    z-index="1"
    scroll-strategy="none">
    <v-btn
        prepend-icon="mdi-open-in-new" 
        v-if="selectMode"
        color="blue"
        @click="popInteractions"
        text="Pop Selected Interactions">
        
    </v-btn>
   
</v-overlay>

    
</template>
<script setup>
    import { computed , defineEmits } from 'vue';
    import { useStore } from 'vuex';
    const store = useStore();
    const emit = defineEmits()

    const selectMode = computed(() => store.state.selectMode)

    const popInteractions = () => {
        emit('pop:selectedInteractions');
    };
</script>