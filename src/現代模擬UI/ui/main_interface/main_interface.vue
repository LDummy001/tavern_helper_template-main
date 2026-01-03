<template>
  <div class="main-interface-container">
    <div class="tab-navigation top">
      <button
        class="tab-button"
        :class="{ active: active_tab === 'conversation' }"
        @click="switchToTab('conversation')"
      >
        對話
      </button>
      <button class="tab-button" :class="{ active: active_tab === 'settings' }" @click="switchToTab('settings')">
        設置
      </button>
    </div>

    <div class="main-content">
      <div v-if="active_tab === 'conversation'" class="conversation-area">
        <ConversationTab ref="conversation_tab_ref" />
      </div>

      <div v-else-if="active_tab === 'settings'" class="settings-area">
        <SettingTab @render-size-changed="handleRenderSizeChanged" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ConversationTab from './conversation_tab.vue';
import SettingTab from './setting_tab.vue';

const active_tab = ref('conversation');
const conversation_tab_ref = ref<any>(null);
const dialogue_scroll_position = ref(0);

const switchToTab = (tab: string) => {
  // 如果當前是對話標籤，保存滾動位置
  if (active_tab.value === 'conversation' && conversation_tab_ref.value) {
    dialogue_scroll_position.value = conversation_tab_ref.value.getScrollPosition();
  }

  // 切換標籤
  active_tab.value = tab;

  // 如果切換到對話標籤，恢復滾動位置
  if (tab === 'conversation') {
    // 使用 nextTick 確保組件已掛載
    setTimeout(() => {
      if (conversation_tab_ref.value) {
        conversation_tab_ref.value.setScrollPosition(dialogue_scroll_position.value);
      }
    }, 0);
  }
};

const handleRenderSizeChanged = (newSize: number) => {
  if (conversation_tab_ref.value && conversation_tab_ref.value.handleRenderSizeChanged) {
    conversation_tab_ref.value.handleRenderSizeChanged(newSize);
  }
};
</script>

<style lang="scss" scoped>
.main-interface-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.conversation-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
}

.settings-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
}

.tab-navigation {
  display: flex;
  background-color: #2a2a2a;
  border-bottom: 1px solid #404040;
  flex-shrink: 0;

  &.top {
    border-top: none;
  }
}

.tab-button {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  color: #b0b0b0;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    color: #007acc;
    background-color: #3a3a3a;
  }

  &:hover {
    background-color: #3a3a3a;
  }
}

@media (max-width: 768px) {
  .tab-button {
    padding: 14px;
    font-size: 14px;
  }
}
</style>
