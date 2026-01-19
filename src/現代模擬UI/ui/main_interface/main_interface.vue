<template>
  <div class="main-interface-container">
    <div class="tab-navigation top">
      <!-- 時間顯示行 -->
      <div class="time-row">
        <div class="current-time">{{ current_time }}</div>
      </div>
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
        <button class="tab-button" :class="{ active: active_tab === 'storage' }" @click="switchToTab('storage')">貯存</button>
      </div>
      <!-- 第二行標籤 -->
      <div class="tab-row">
        <button class="tab-button" :class="{ active: active_tab === 'location' }" @click="switchToTab('location')">
          地點
        </button>
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

    <div
      class="main-content"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
    >
      <transition :name="is_swipe_transition ? `slide-${swipe_direction}` : 'no-transition'" mode="out-in">
        <div v-if="active_tab === 'conversation'" key="conversation" class="conversation-area">
          <ConversationTab ref="conversation_tab_ref" />
        </div>

        <div v-else-if="active_tab === 'user'" key="user" class="user-area">
          <UserTab ref="user_tab_ref" />
        </div>

        <div v-else-if="active_tab === 'character'" key="character" class="character-area">
          <CharacterTab ref="character_tab_ref" />
        </div>

        <div v-else-if="active_tab === 'item'" key="item" class="item-area">
           <ItemTab />
         </div>

         <div v-else-if="active_tab === 'storage'" key="storage" class="storage-area">
           <StorageTab />
         </div>

         <div v-else-if="active_tab === 'location'" key="location" class="location-area">
           <LocationTab />
         </div>

        <div v-else-if="active_tab === 'promise'" key="promise" class="promise-area">
          <PromiseTab />
        </div>

        <div v-else-if="active_tab === 'summary'" key="summary" class="summary-area">
          <SummaryTab />
        </div>

        <div v-else-if="active_tab === 'world_info'" key="world_info" class="world-info-area">
          <WorldInfoTab />
        </div>

        <div v-else-if="active_tab === 'settings'" key="settings" class="settings-area">
          <SettingTab @render-size-changed="handleRenderSizeChanged" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import CharacterTab from './character_tab.vue';
import ConversationTab from './conversation_tab.vue';
import ItemTab from './item_tab.vue';
import LocationTab from './location_tab.vue';
import StorageTab from './storage_tab.vue';
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
const current_time = ref('');

// 標籤頁順序定義
const tab_order = ['conversation', 'user', 'character', 'item', 'storage', 'location', 'promise', 'summary', 'world_info', 'settings'];

// 滑動相關變數
const touch_start_x = ref(0);
const touch_start_y = ref(0);
const touch_start_time = ref(0);
const is_mouse_down = ref(false);
const is_swipe_transition = ref(false);
const swipe_direction = ref<'left' | 'right'>('right');

const updateCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  current_time.value = `${hours}:${minutes}`;
};

let time_update_interval: number | null = null;

onMounted(() => {
  updateCurrentTime();
  time_update_interval = window.setInterval(updateCurrentTime, 60000); // 每分鐘更新一次
});

onUnmounted(() => {
  if (time_update_interval !== null) {
    clearInterval(time_update_interval);
  }
});

const switchToTab = (tab: string, isSwipe: boolean = false) => {
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

  // 設置過渡類型
  is_swipe_transition.value = isSwipe;

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

// 獲取下一個標籤頁（不循環）
const getNextTab = (currentTab: string): string => {
  const currentIndex = tab_order.indexOf(currentTab);
  if (currentIndex === -1 || currentIndex === tab_order.length - 1) return currentTab;
  return tab_order[currentIndex + 1];
};

// 獲取上一個標籤頁（不循環）
const getPreviousTab = (currentTab: string): string => {
  const currentIndex = tab_order.indexOf(currentTab);
  if (currentIndex === -1 || currentIndex === 0) return currentTab;
  return tab_order[currentIndex - 1];
};

const handleRenderSizeChanged = (newSize: number) => {
  if (conversation_tab_ref.value && conversation_tab_ref.value.handleRenderSizeChanged) {
    conversation_tab_ref.value.handleRenderSizeChanged(newSize);
  }
};

// 觸摸事件處理函數
const handleTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0];
  touch_start_x.value = touch.clientX;
  touch_start_y.value = touch.clientY;
  touch_start_time.value = Date.now();
};

const handleTouchMove = (_event: TouchEvent) => {
  // 可以添加視覺反饋，比如輕微的移動效果
  // 但為了簡單起見，這裡先不實現
};

const handleTouchEnd = (event: TouchEvent) => {
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touch_start_x.value;
  const deltaY = touch.clientY - touch_start_y.value;
  const deltaTime = Date.now() - touch_start_time.value;

  // 只處理快速的水平滑動（距離 > 20px，時間 < 1000ms，且水平移動大於垂直移動）
  if (Math.abs(deltaX) > 20 && deltaTime < 1000 && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < 0) {
      // 向左滑動，切換到下一個標籤頁
      swipe_direction.value = 'left';
      const nextTab = getNextTab(active_tab.value);
      switchToTab(nextTab, true);
    } else {
      // 向右滑動，切換到上一個標籤頁
      swipe_direction.value = 'right';
      const prevTab = getPreviousTab(active_tab.value);
      switchToTab(prevTab, true);
    }
  }
};

// 鼠標事件處理函數（用於電腦測試）
const handleMouseDown = (event: MouseEvent) => {
  is_mouse_down.value = true;
  touch_start_x.value = event.clientX;
  touch_start_y.value = event.clientY;
  touch_start_time.value = Date.now();
};

const handleMouseMove = (_event: MouseEvent) => {
  // 可以添加視覺反饋
};

const handleMouseUp = (event: MouseEvent) => {
  if (!is_mouse_down.value) return;

  is_mouse_down.value = false;
  const deltaX = event.clientX - touch_start_x.value;
  const deltaY = event.clientY - touch_start_y.value;
  const deltaTime = Date.now() - touch_start_time.value;

  // 只處理快速的水平滑動（距離 > 20px，時間 < 1000ms，且水平移動大於垂直移動）
  if (Math.abs(deltaX) > 20 && deltaTime < 1000 && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < 0) {
      // 向左滑動，切換到下一個標籤頁
      swipe_direction.value = 'left';
      const nextTab = getNextTab(active_tab.value);
      switchToTab(nextTab, true);
    } else {
      // 向右滑動，切換到上一個標籤頁
      swipe_direction.value = 'right';
      const prevTab = getPreviousTab(active_tab.value);
      switchToTab(prevTab, true);
    }
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

.storage-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
}

.location-area {
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

.time-row {
  display: flex;
  padding: 4px 12px;
  background-color: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #404040;
  align-items: center;
}

.current-time {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  font-family: 'Courier New', monospace;
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

// 滑動動畫 - 向右滑動（從 user 到 conversation）
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

// 滑動動畫 - 向左滑動（從 conversation 到 user）
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

// 無動畫過渡
.no-transition-enter-active,
.no-transition-leave-active {
  transition: none;
}

.no-transition-enter-from,
.no-transition-leave-to {
  opacity: 1;
  transform: none;
}
</style>
