<template>
  <div class="main-interface-container">
    <div class="tab-navigation top">
      <!-- 第一行標籤 -->
      <div class="tab-row">
        <button
          class="tab-button"
          :class="{ active: active_tab === 'conversation' }"
          @click="switchToTab('conversation')"
        >
          對話
        </button>
        <button class="tab-button" :class="{ active: active_tab === 'user' }" @click="switchToTab('user')">用戶</button>
        <button class="tab-button" :class="{ active: active_tab === 'character' }" @click="switchToTab('character')">
          角色
        </button>
        <button class="tab-button" :class="{ active: active_tab === 'item' }" @click="switchToTab('item')">物品</button>
      </div>
      <!-- 第二行標籤 -->
      <div class="tab-row">
        <button class="tab-button" :class="{ active: active_tab === 'promise' }" @click="switchToTab('promise')">
          約定
        </button>
        <button class="tab-button" :class="{ active: active_tab === 'summary' }" @click="switchToTab('summary')">
          總結
        </button>
        <button class="tab-button" :class="{ active: active_tab === 'world_info' }" @click="switchToTab('world_info')">
          世界
        </button>
        <button class="tab-button" :class="{ active: active_tab === 'settings' }" @click="switchToTab('settings')">
          設置
        </button>
      </div>
    </div>

    <div class="main-content">
      <div v-if="active_tab === 'conversation'" class="conversation-area">
        <ConversationTab ref="conversation_tab_ref" />
      </div>

      <div v-else-if="active_tab === 'user'" class="user-area">
        <UserTab ref="user_tab_ref" />
      </div>

      <div v-else-if="active_tab === 'character'" class="character-area">
        <CharacterTab ref="character_tab_ref" />
      </div>

      <div v-else-if="active_tab === 'item'" class="item-area">
        <ItemTab />
      </div>

      <div v-else-if="active_tab === 'promise'" class="promise-area">
        <PromiseTab />
      </div>

      <div v-else-if="active_tab === 'summary'" class="summary-area">
        <SummaryTab />
      </div>

      <div v-else-if="active_tab === 'world_info'" class="world-info-area">
        <WorldInfoTab />
      </div>

      <div v-else-if="active_tab === 'settings'" class="settings-area">
        <SettingTab @render-size-changed="handleRenderSizeChanged" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CharacterTab from './character_tab.vue';
import ConversationTab from './conversation_tab.vue';
import ItemTab from './item_tab.vue';
import PromiseTab from './promise_tab.vue';
import SettingTab from './setting_tab.vue';
import SummaryTab from './summary_tab.vue';
import UserTab from './user_tab.vue';
import WorldInfoTab from './world_info_tab.vue';

const active_tab = ref('conversation');
const conversation_tab_ref = ref<any>(null);
const character_tab_ref = ref<any>(null);
const user_tab_ref = ref<any>(null);
const dialogue_scroll_position = ref(0);

const switchToTab = (tab: string) => {
  // 如果點擊的是當前活躍的標籤
  if (tab === active_tab.value) {
    // 對於角色標籤，處理特殊邏輯
    if (tab === 'character' && character_tab_ref.value) {
      character_tab_ref.value.handleTabClick();
    }
    // 對於用戶標籤，處理特殊邏輯
    else if (tab === 'user' && user_tab_ref.value) {
      user_tab_ref.value.handleTabClick();
    }
    // 其他標籤暫時不做任何事情
    return;
  }

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
}

.conversation-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
}

.user-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
}

.character-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
}

.item-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
}

.promise-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
}

.summary-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
}

.world-info-area {
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
  flex-direction: column;
  background-color: #2a2a2a;
  border-bottom: 1px solid #404040;
  flex-shrink: 0;

  &.top {
    border-top: none;
  }
}

.tab-row {
  display: flex;
  border-bottom: 1px solid #404040;

  &:last-child {
    border-bottom: none;
  }
}

.tab-button {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  border-right: 1px solid #404040;
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

  &:last-child {
    border-right: none;
  }
}

@media (max-width: 768px) {
  .tab-button {
    padding: 8px;
    font-size: 14px;
  }
}
</style>
