<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2>設置</h2>
    </div>

    <div class="settings-list">
      <!-- 版本號 -->
      <div class="setting-item version-item">
        <div class="setting-label">
          <span class="setting-title">版本號</span>
          <span class="setting-description">當前應用版本</span>
        </div>
        <div class="setting-control">
          <span class="version-number">{{ version }}</span>
        </div>
      </div>

      <!-- 全屏開關 -->
      <div class="setting-item">
        <div class="setting-label">
          <span class="setting-title">全屏模式</span>
          <span class="setting-description">啟用全屏顯示模式</span>
        </div>
        <div class="setting-control">
          <label class="switch">
            <input v-model="fullscreen_enabled" type="checkbox" @change="handleFullscreenChange" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- 渲染大小 -->
      <div class="setting-item">
        <div class="setting-label">
          <span class="setting-title">載入樓層數目</span>
          <span class="setting-description">設置每次載入樓層的數目</span>
        </div>
        <div class="setting-control">
          <input
            v-model.number="render_size"
            type="number"
            class="number-input"
            min="1"
            @input="handleRenderSizeChange"
          />
        </div>
      </div>

      <!-- 排除最新總結數量 -->
      <div class="setting-item">
        <div class="setting-label">
          <span class="setting-title">排除最新總結數量</span>
          <span class="setting-description">設置不使用最新n個總結的數量</span>
        </div>
        <div class="setting-control">
          <input
            v-model.number="exclude_latest_summaries"
            type="number"
            class="number-input"
            min="0"
            @input="handleExcludeLatestSummariesChange"
          />
        </div>
      </div>

      <!-- XML內容摺疊規則 -->
      <div class="setting-item xml-rules-item">
        <div class="setting-label">
          <span class="setting-title">XML內容摺疊規則</span>
          <span class="setting-description">設置XML標籤內容的顯示方式</span>
        </div>
      </div>

      <!-- XML內容摺疊規則表格 -->
      <div class="folding-rules-fullwidth">
        <div class="folding-rules-container">
          <!-- 表頭 -->
          <div class="rules-header">
            <div class="header-cell">標籤名稱</div>
            <div class="header-cell">標題名稱</div>
            <div class="header-cell">顯示模式</div>
            <div class="header-cell">匹配模式</div>
            <div class="header-cell">匹配結束標籤策略</div>
            <div class="header-cell">操作</div>
          </div>

          <!-- 規則行 -->
          <div v-for="(rule, index) in tag_rules" :key="index" class="folding-rule-row">
            <!-- 標籤名稱 -->
            <div class="rule-cell">
              <input
                v-model="rule.tag_name"
                type="text"
                class="text-input compact"
                placeholder="例如: think"
                @input="updateFoldingRule(index, { tag_name: rule.tag_name })"
              />
            </div>

            <!-- 標題名稱 -->
            <div class="rule-cell">
              <input
                v-model="rule.title_name"
                type="text"
                class="text-input compact"
                placeholder="例如: 思考內容"
                @input="updateFoldingRule(index, { title_name: rule.title_name })"
              />
            </div>

            <!-- 顯示模式 -->
            <div class="rule-cell">
              <select
                v-model="rule.display_mode"
                class="select-input compact"
                @change="updateFoldingRule(index, { display_mode: rule.display_mode })"
              >
                <option value="invisible">隱藏</option>
                <option value="fold_bar">摺疊欄</option>
              </select>
            </div>

            <!-- 匹配模式 -->
            <div class="rule-cell">
              <div class="radio-group compact">
                <label class="radio-option compact">
                  <input
                    v-model="rule.match_mode"
                    type="radio"
                    :value="'both'"
                    @change="updateFoldingRule(index, { match_mode: rule.match_mode })"
                  />
                  <span class="radio-label">開始及結束</span>
                </label>
                <label class="radio-option compact">
                  <input
                    v-model="rule.match_mode"
                    type="radio"
                    :value="'end_only'"
                    @change="updateFoldingRule(index, { match_mode: rule.match_mode })"
                  />
                  <span class="radio-label">只結束</span>
                </label>
              </div>
            </div>

            <!-- 匹配結束標籤策略 -->
            <div class="rule-cell">
              <div class="radio-group compact">
                <label class="radio-option compact">
                  <input
                    v-model="rule.match_strategy"
                    type="radio"
                    :value="'first'"
                    @change="updateFoldingRule(index, { match_strategy: rule.match_strategy })"
                  />
                  <span class="radio-label">第一個</span>
                </label>
                <label class="radio-option compact">
                  <input
                    v-model="rule.match_strategy"
                    type="radio"
                    :value="'last'"
                    @change="updateFoldingRule(index, { match_strategy: rule.match_strategy })"
                  />
                  <span class="radio-label">最後一個</span>
                </label>
              </div>
            </div>

            <!-- 刪除按鈕 -->
            <div class="rule-cell">
              <button class="delete-rule-btn compact" @click="deleteFoldingRule(index)">刪除</button>
            </div>
          </div>

          <!-- 添加規則按鈕 -->
          <div class="add-rule-row">
            <button class="add-rule-btn" @click="addFoldingRule">+ 添加摺疊規則</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits<{
  renderSizeChanged: [newSize: number];
}>();

// 設置數據
const version = ref('v0.4.2'); // 版本號 - 手動更新此處
const fullscreen_enabled = ref(false);
const render_size = ref(10);
const exclude_latest_summaries = ref(1);

// XML內容摺疊規則
interface TagRule {
  tag_name: string;
  match_mode: 'both' | 'end_only'; // 匹配開始和結束標籤 vs 只匹配結束標籤
  match_strategy: 'first' | 'last'; // 匹配第一個 vs 匹配最後一個
  display_mode: 'invisible' | 'fold_bar'; // 隱藏 vs 摺疊欄
  title_name: string; // 摣疊欄標題名稱
}

const tag_rules = ref<TagRule[]>([]);

// 動態高度相關
const tab_navigation_height = ref(0); // 頂部標籤導航高度
const resize_observer = ref<ResizeObserver | null>(null);

// 動態計算設置容器的最大高度
const settings_container_max_height = computed(() => {
  return `calc(100vh - ${tab_navigation_height.value}px)`;
});

// 從聊天變數恢復設置
const loadSettings = () => {
  try {
    const settings = getVariables({ type: 'chat' });
    if (settings && settings.settings) {
      fullscreen_enabled.value = settings.settings.fullscreen_enabled || false;
      render_size.value = settings.settings.render_size || 10;
      exclude_latest_summaries.value = settings.settings.exclude_latest_summaries || 1;
      tag_rules.value = settings.settings.tag_rules || [];
    } else {
      // 如果沒有設置，保存默認值
      saveSettings();
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
};

// 保存設置到聊天變數
const saveSettings = () => {
  try {
    const settings = {
      fullscreen_enabled: fullscreen_enabled.value,
      render_size: render_size.value,
      exclude_latest_summaries: exclude_latest_summaries.value,
      tag_rules: tag_rules.value,
    };
    insertOrAssignVariables({ settings }, { type: 'chat' });
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

// 全屏API函數
const enterFullscreen = async () => {
  try {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else if ((document.documentElement as any).webkitRequestFullscreen) {
      await (document.documentElement as any).webkitRequestFullscreen();
    } else if ((document.documentElement as any).mozRequestFullScreen) {
      await (document.documentElement as any).mozRequestFullScreen();
    } else if ((document.documentElement as any).msRequestFullscreen) {
      await (document.documentElement as any).msRequestFullscreen();
    }
  } catch (error) {
    console.error('Failed to enter fullscreen:', error);
  }
};

const exitFullscreen = async () => {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      await (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      await (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      await (document as any).msExitFullscreen();
    }
  } catch (error) {
    console.error('Failed to exit fullscreen:', error);
  }
};

const isFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
};

// 事件處理函數
const handleFullscreenChange = async () => {
  if (fullscreen_enabled.value) {
    await enterFullscreen();
  } else {
    await exitFullscreen();
  }
  saveSettings();
};

const handleRenderSizeChange = () => {
  // 約束為正整數 (>=1，不接受負數、0、十進制數)
  let constrainedValue = Math.floor(Number(render_size.value));
  if (isNaN(constrainedValue) || constrainedValue < 1) {
    constrainedValue = 10; // 默認值
  }
  render_size.value = constrainedValue;

  saveSettings();
  emit('renderSizeChanged', render_size.value);
};

const handleExcludeLatestSummariesChange = () => {
  // 約束為非負整數 (>=0，不接受負數、十進制數)
  let constrainedValue = Math.floor(Number(exclude_latest_summaries.value));
  if (isNaN(constrainedValue) || constrainedValue < 0) {
    constrainedValue = 1; // 默認值
  }
  exclude_latest_summaries.value = constrainedValue;

  saveSettings();
};

// XML內容摺疊規則管理
const addFoldingRule = () => {
  const newRule: TagRule = {
    tag_name: '',
    match_mode: 'both',
    match_strategy: 'first',
    display_mode: 'invisible',
    title_name: '',
  };
  tag_rules.value.push(newRule);
  saveSettings();
};

const deleteFoldingRule = (ruleIndex: number) => {
  if (ruleIndex >= 0 && ruleIndex < tag_rules.value.length) {
    tag_rules.value.splice(ruleIndex, 1);
    saveSettings();
  }
};

const updateFoldingRule = (ruleIndex: number, updates: Partial<TagRule>) => {
  if (ruleIndex >= 0 && ruleIndex < tag_rules.value.length) {
    tag_rules.value[ruleIndex] = { ...tag_rules.value[ruleIndex], ...updates };
    saveSettings();
  }
};

// 設置 ResizeObserver 來監聽高度變化
const setupResizeObserver = () => {
  if (typeof ResizeObserver === 'undefined') {
    // 降級方案：使用固定高度
    tab_navigation_height.value = 74; // 估計的標籤導航高度
    return;
  }

  resize_observer.value = new ResizeObserver(entries => {
    for (const entry of entries) {
      const target = entry.target as HTMLElement;
      if (target.classList.contains('tab-navigation')) {
        tab_navigation_height.value = target.offsetHeight;
      }
    }
  });

  // 監聽父元素的標籤導航
  const tabNavigation = document.querySelector('.tab-navigation.top') as HTMLElement;
  if (tabNavigation) {
    resize_observer.value.observe(tabNavigation);
    tab_navigation_height.value = tabNavigation.offsetHeight;
  }
};

// 清理 ResizeObserver
const cleanupResizeObserver = () => {
  if (resize_observer.value) {
    resize_observer.value.disconnect();
    resize_observer.value = null;
  }
};

// 監聽全屏狀態變化 - 強制同步全屏狀態
const handleFullscreenChangeEvent = () => {
  const currentlyFullscreen = isFullscreen();
  // 始終設置為實際全屏狀態，無論當前值是什麼
  fullscreen_enabled.value = currentlyFullscreen;
  saveSettings();
};

// 添加全屏事件監聽器
const addFullscreenListeners = () => {
  document.addEventListener('fullscreenchange', handleFullscreenChangeEvent);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChangeEvent);
  document.addEventListener('mozfullscreenchange', handleFullscreenChangeEvent);
  document.addEventListener('MSFullscreenChange', handleFullscreenChangeEvent);
};

// 移除全屏事件監聽器
const removeFullscreenListeners = () => {
  document.removeEventListener('fullscreenchange', handleFullscreenChangeEvent);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChangeEvent);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChangeEvent);
  document.removeEventListener('MSFullscreenChange', handleFullscreenChangeEvent);
};

// 初始化時載入設置
loadSettings();
addFullscreenListeners();

// 生命週期鉤子
onMounted(() => {
  // 初始化完成
  nextTick(() => {
    setupResizeObserver();
  });
});

onUnmounted(() => {
  cleanupResizeObserver();
});

// 監聽聊天切換事件，切換聊天時重置全屏狀態
eventOn(tavern_events.APP_READY, () => {
  handleFullscreenChangeEvent();
});

// 組件卸載時清理監聽器
onUnmounted(() => {
  removeFullscreenListeners();
});

// 導出重新載入設置的方法，供CHAT_CHANGED事件使用
defineExpose({
  reloadSettings: loadSettings,
});
</script>

<style lang="scss" scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #e0e0e0;
  overflow: hidden; /* 確保滾動只在子元素中發生 */
  min-height: v-bind(settings_container_max_height);
  max-height: v-bind(settings_container_max_height);
}

.settings-header {
  padding: 20px 16px 16px 16px;
  border-bottom: 1px solid #404040;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #e0e0e0;
  }
}

.settings-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #2a2a2a;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }

  &:last-child {
    border-bottom: none;
  }

  &.version-item {
    border-bottom: 1px solid #2a2a2a;
  }

  &.xml-rules-item {
    border-bottom: none;
    padding-bottom: 8px;
  }
}

.setting-label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-title {
  font-size: 16px;
  font-weight: 500;
  color: #e0e0e0;
}

.setting-description {
  font-size: 14px;
  color: #888;
  line-height: 1.4;
}

.setting-control {
  display: flex;
  align-items: center;
  margin-left: 16px;
}

// 開關樣式
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #404040;
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
}

input:checked + .slider {
  background-color: #007acc;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

// 數字輸入框樣式
.number-input {
  width: 80px;
  padding: 8px 12px;
  background-color: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
  text-align: center;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007acc;
  }

  &::placeholder {
    color: #888;
  }

  /* 移除數字輸入框的上下箭頭 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
}

.setting-section-header {
  padding: 16px 16px 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #e0e0e0;
  }

  .section-description {
    font-size: 14px;
    color: #888;
    line-height: 1.4;
  }
}

.folding-rules-fullwidth {
  margin-top: 8px;
  padding: 0 16px;
}

// XML內容摺疊規則樣式
.folding-rules-container {
  width: 100%;
  border: 1px solid #404040;
  border-radius: 8px;
  overflow: hidden;
}

.rules-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
  gap: 12px;
  padding: 12px 16px;
  background-color: #2a2a2a;
  border-bottom: 1px solid #404040;
  font-size: 12px;
  font-weight: 500;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-cell {
  text-align: center;
  padding: 4px 0;
}

.folding-rule-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
  gap: 12px;
  padding: 12px 16px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #202020;
  }
}

.rule-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
}

.field-label {
  font-size: 12px;
  font-weight: 500;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.text-input {
  padding: 6px 8px;
  background-color: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease;
  width: 100%;
  min-width: 80px;

  &:focus {
    border-color: #007acc;
  }

  &::placeholder {
    color: #666;
  }

  &.compact {
    padding: 4px 6px;
    font-size: 12px;
    min-width: 60px;
  }
}

.select-input {
  padding: 6px 8px;
  background-color: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 13px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
  width: 100%;
  min-width: 80px;

  &:focus {
    border-color: #007acc;
  }

  &.compact {
    padding: 4px 6px;
    font-size: 12px;
    min-width: 60px;
  }
}

// 單選按鈕樣式
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  &.compact {
    gap: 2px;
  }
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  transition: background-color 0.2s ease;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  &.compact {
    padding: 1px 2px;
    gap: 2px;
  }

  input[type='radio'] {
    margin: 0;
    width: 14px;
    height: 14px;
    accent-color: #007acc;
    cursor: pointer;
  }

  .radio-label {
    font-size: 11px;
    color: #b0b0b0;
    user-select: none;
    white-space: nowrap;
  }
}

.delete-rule-btn {
  padding: 6px 10px;
  background-color: #dc3545;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  min-width: 50px;

  &:hover {
    background-color: #c82333;
  }

  &.compact {
    padding: 4px 8px;
    font-size: 10px;
    min-width: 40px;
  }
}

.add-rule-row {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}

.add-rule-btn {
  padding: 10px 20px;
  background-color: #007acc;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
}

// 移動設備適配
@media (max-width: 768px) {
  .settings-header {
    padding: 16px 12px 12px 12px;

    h2 {
      font-size: 20px;
    }
  }

  .setting-item {
    padding: 12px;
  }

  .setting-title {
    font-size: 15px;
  }

  .setting-description {
    font-size: 13px;
  }

  .number-input {
    width: 70px;
    padding: 6px 10px;
    font-size: 13px;
  }

  // XML摺疊規則移動設備適配
  .rules-header {
    font-size: 10px;
    padding: 8px 12px;
  }

  .folding-rule-row {
    padding: 8px 12px;
    gap: 6px;
  }

  .rule-cell {
    min-height: 28px;
  }

  .text-input.compact,
  .select-input.compact {
    font-size: 11px;
    padding: 3px 4px;
    min-width: 45px;
  }

  .radio-option.compact .radio-label {
    font-size: 10px;
  }

  .delete-rule-btn.compact {
    padding: 3px 6px;
    font-size: 9px;
    min-width: 35px;
  }
}

// 版本號樣式
.version-number {
  font-size: 16px;
  font-weight: 600;
  color: #007acc;
  padding: 6px 12px;
  min-width: 80px;
  text-align: center;
  user-select: text;
}
</style>
