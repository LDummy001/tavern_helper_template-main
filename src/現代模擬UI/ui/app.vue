<template>
  <div v-if="mounted" class="app-container" :style="{ height: parent_height }">
    <!-- 初始化UI -->
    <div v-if="!is_initialized" class="initialization-wrapper">
      <InitializationInterface />
    </div>

    <!-- 主要UI -->
    <div v-else>
      <MainInterface />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import InitializationInterface from './initialization_interface/initialization_interface.vue';
import MainInterface from './main_interface/main_interface.vue';

const mounted = ref(false);
const is_initialized = ref(false);
const parent_height = ref('100vh');

// 檢查是否處於全屏狀態
const isFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
};

// 更新父窗口高度
const updateParentHeight = () => {
  if (isFullscreen()) {
    parent_height.value = '100vh';
  } else {
    try {
      if (window.parent && window.parent.innerHeight) {
        parent_height.value = `${window.parent.innerHeight * 0.7}px`;
      }
    } catch (error) {
      // 如果無法訪問父窗口，保持默認值
      console.warn('Unable to access parent window height:', error);
    }
  }
};

// 全屏狀態變化處理函數
const handleFullscreenChange = () => {
  updateParentHeight();
};

// 載入聊天設置
const loadChatSettings = () => {
  try {
    const variables = getVariables({ type: 'chat' });
    if (variables?.is_initialized === undefined) {
      // 如果 is_initialized 不存在，設置為 false 並保存
      is_initialized.value = false;
      insertOrAssignVariables({ is_initialized: false }, { type: 'chat' });
    } else {
      is_initialized.value = variables.is_initialized;
    }
  } catch (error) {
    console.error('Failed to load chat settings:', error);
  }
};

onMounted(() => {
  mounted.value = true;
  // 載入聊天設置
  loadChatSettings();

  // 監聽聊天切換事件
  eventOn(tavern_events.CHAT_CHANGED, (newChatId: string) => {
    console.log('Chat changed to:', newChatId);
    // 重新載入設置
    loadChatSettings();
  });

  // 監聽初始化完成事件
  eventOn('initialization_completed', () => {
    console.log('Initialization completed, switching to main interface');
    is_initialized.value = true;
  });

  // 監聽聊天變數變化，特別是 is_initialized
  watch(
    () => getVariables({ type: 'chat' }),
    newVariables => {
      if (newVariables?.is_initialized !== undefined) {
        is_initialized.value = newVariables.is_initialized;
      }
    },
    { deep: true },
  );

  // 初始化父窗口高度
  updateParentHeight();

  // 添加全屏事件監聽器
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);
});

// 組件卸載時清理監聽器
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
});
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.initialization-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss">
body {
  overflow-y: auto;
}
</style>
