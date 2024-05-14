<template>
  <v-container fluid class="ma-0 pa-0 ga-0">
    <TokenControls
      :context-tokens="contextTokens"
      :remaining-tokens="remainingTokens"
      :total-tokens="totalTokens"
    />
    <v-virtual-scroll
      :key="listVersion"
      ref="virtualScrollRef"
      :items="interactions"
      height="1130"
      class="mt-15"
    >
      <template #default="{ item }">
        <v-card
          class="mt-2"
          :color="
            selectedInteractions.includes(item.interactionSessionId)
              ? 'grey-darken-3'
              : undefined
          "
          :ripple="selectMode"
          v-on="
            selectMode
              ? { click: () => toggleSelection(item.interactionSessionId) }
              : {}
          "
        >
          <div class="d-flex justify-space-between align-center">
            <v-card-item class="text-overline">User Prompt:</v-card-item>
            <v-card-actions>
              <v-checkbox-btn
                v-if="selectMode"
                color="red"
                density="compact"
                :model-value="
                  selectedInteractions.includes(item.interactionSessionId)
                "
              />
            </v-card-actions>
          </div>
          <v-card-item class="text-caption mt-n5">
            Tokens: {{ item.prompt_token_count }}
          </v-card-item>
          <v-card-item class="text-body-1 mt-n5">
            <div v-html="$markdown.render(item.segments)"></div>
          </v-card-item>
          <v-divider></v-divider>
          <v-card-item class="text-secondary text-overline"
            >AI Response:</v-card-item
          >
          <v-card-item class="text-caption text-secondary mt-n5">
            Tokens: {{ item.response_token_count }}
          </v-card-item>
          <v-card-item class="text-body-1 text-secondary mt-n5">
            <div v-html="$markdown.render(item.response)"></div>
          </v-card-item>
        </v-card>
      </template>
    </v-virtual-scroll>
    <PopInteractionsButton
      @pop:selected-interactions="popSelectedInteractions"
    />
  </v-container>
</template>

<script setup>
import {
  computed,
  ref,
  defineProps,
  defineEmits,
  toRefs,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import PopInteractionsButton from './PopInteractionsButton.vue';
import { useNotifications } from '@/composables/useNotifications';
import TokenControls from './TokenControls.vue';
import { createChatWindowModule } from '@/store/chatWindowDynamicModule.js';

// Define component props
const props = defineProps({
  uniqueId: {
    type: String,
    required: true,
  },
  modelName: {
    type: String,
    required: true,
  },
  newConversationCheckboxState: {
    type: Boolean,
    default: false,
  },
  newConversationTitle: {
    type: String,
    default: '',
  },
});
// Define component emits
const emit = defineEmits(['update:selectedInteractions']);

// ToRefs utility
const {
  uniqueId,
  modelName,
  newConversationCheckboxState,
  newConversationTitle,
} = toRefs(props);

// Composables and Vuex store usage
const store = useStore();
const { addNotification } = useNotifications();
const contextTokens = computed(
  () => store.state[`chat_${uniqueId.value}`].contextTokens
);
const totalTokens = computed(
  () => store.state[`chat_${uniqueId.value}`].totalTokens
);

const tokenLimit = 128000;

const remainingTokens = computed(() => {
  return tokenLimit - contextTokens.value;
});

// eslint-disable-next-line vue/no-ref-object-reactivity-loss
store.registerModule(`chat_${uniqueId.value}`, createChatWindowModule());
store.commit('ADD_CHAT_WINDOW', {
  // eslint-disable-next-line vue/no-ref-object-reactivity-loss
  windowId: uniqueId.value,
  // eslint-disable-next-line vue/no-ref-object-reactivity-loss
  modelName: modelName.value,
});

// Reactive state and computed properties
const selectMode = computed(() => store.state.selectMode);
const interactions = computed(
  () => store.state[`chat_${uniqueId.value}`].interactions
);
const selectedInteractions = ref([]);
const virtualScrollRef = ref(null);
const listVersion = ref(0);
// Methods
const toggleSelection = (id) => {
  const index = selectedInteractions.value.indexOf(id);
  if (index > -1) {
    selectedInteractions.value.splice(index, 1); // Deselect
  } else {
    selectedInteractions.value.push(id); // Select
  }
  emit('update:selectedInteractions', selectedInteractions.value);
};

const popSelectedInteractions = () => {
  // Helper function for validating title
  const isValidTitle = () =>
    newConversationCheckboxState.value &&
    newConversationTitle.value.trim() !== '';

  if (!isValidTitle()) {
    addNotification(
      'Please enter a title for the new conversation',
      'error-message'
    );
    return;
  }

  if (
    window.confirm(
      'Are you sure you want to pop selected interactions into a new conversation?'
    )
  ) {
    store.dispatch('popSelectedInteractions', {
      ids: selectedInteractions.value,
      newConversationTitle: newConversationTitle.value,
      windowId: uniqueId.value,
    });
    selectedInteractions.value = []; // Clear the selected items
  }
};

function scrollToItem(index) {
  const virtualScroll = virtualScrollRef.value;
  if (virtualScroll) {
    virtualScroll.scrollToIndex(index);
  }
}

// Watchers
watch(selectMode, (newVal) => {
  if (!newVal) {
    selectedInteractions.value = [];
  }
});

watch(interactions, (newInteractions) => {
  listVersion.value++;
  const index = newInteractions.length - 1;
  if (index >= 0) {
    nextTick(() => {
      scrollToItem(index);
    });
  }
});

onMounted(async () => {
  await store.dispatch('populateConversationTitleList', {
    windowId: uniqueId.value,
  });
});

onBeforeUnmount(() => {
  store.unregisterModule(`chat_${uniqueId.value}`);
  store.commit('REMOVE_CHAT_WINDOW', uniqueId.value);
});
</script>

<style lang="scss">
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: bold;
}

h1 {
  font-size: 2em;
}

h2 {
  font-size: 1.75em;
}

h3 {
  font-size: 1.5em;
}

// Repeat for h4, h5, h6 if needed with their respective font-sizes

ul,
ol {
  margin-left: 2em;
  list-style-position: outside;

  li {
    margin-bottom: 0.5em;
  }
}

p {
  margin-top: 2em;
  margin-bottom: 2em;
}

pre {
  background-color: #2d2d2d;
  border: 1px solid #3c3c3c;
  padding: 0.1em;
  margin-top: 1em;
  margin-bottom: 1em;
  overflow-x: auto;
}

strong {
  font-weight: bold;
}

em {
  font-style: italic;
}

.code-language {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro',
    monospace;
  background-color: #2d2d2d; // Same as the code block background for consistency
  margin-left: 1em;
  display: block; // To ensure it takes the full width
  padding: 0.1em;
}
</style>
