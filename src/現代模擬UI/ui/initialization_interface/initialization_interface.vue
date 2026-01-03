<template>
  <div class="initializations-container">
    <div class="tab-navigation top">
      <button class="tab-button" :class="{ active: active_tab === 'world_info' }" @click="switchToTab('world_info')">
        世界背景
      </button>
      <button class="tab-button" :class="{ active: active_tab === 'user' }" @click="switchToTab('user')">用戶</button>
      <button class="tab-button" :class="{ active: active_tab === 'character' }" @click="switchToTab('character')">
        角色
      </button>
      <button class="tab-button" :class="{ active: active_tab === 'item' }" @click="switchToTab('item')">物品</button>
      <button class="tab-button" :class="{ active: active_tab === 'extra' }" @click="switchToTab('extra')">其他</button>
      <button class="tab-button" :class="{ active: active_tab === 'start' }" @click="switchToTab('start')">開始</button>
    </div>

    <div class="main-content">
      <div v-if="active_tab === 'start'" class="initialization-area">
        <StartInitialization />
      </div>

      <div v-else-if="active_tab === 'world_info'" class="initialization-area">
        <WorldInfoInitialization />
      </div>

      <div v-else-if="active_tab === 'user'" class="initialization-area">
        <UserInitialization />
      </div>

      <div v-else-if="active_tab === 'character'" class="initialization-area">
        <CharacterInitialization />
      </div>

      <div v-else-if="active_tab === 'item'" class="initialization-area">
        <ItemInitialization />
      </div>

      <div v-else-if="active_tab === 'extra'" class="initialization-area">
        <ExtraInitialization />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CharacterInitialization from './character_tab.vue';
import ExtraInitialization from './extra_tab.vue';
import ItemInitialization from './item_tab.vue';
import StartInitialization from './start_tab.vue';
import UserInitialization from './user_tab.vue';
import WorldInfoInitialization from './world_info_tab.vue';

const active_tab = ref('world_info');

const switchToTab = (tab: string) => {
  active_tab.value = tab;
};
</script>

<style lang="scss" scoped>
.initializations-container {
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

.initialization-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
  overflow-y: auto;
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
