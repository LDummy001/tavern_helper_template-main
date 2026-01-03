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
import { onMounted, ref } from 'vue';
import InitializationInterface from './initialization_interface/initialization_interface.vue';
import MainInterface from './main_interface/main_interface.vue';

const mounted = ref(false);
const is_initialized = ref(false);
const parent_height = ref('100vh');

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

  // 獲取父窗口高度
  try {
    if (window.parent && window.parent.innerHeight) {
      parent_height.value = `${window.parent.innerHeight * 0.8}px`;
    }
  } catch (error) {
    // 如果無法訪問父窗口，保持默認值
    console.warn('Unable to access parent window height:', error);
  }
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
