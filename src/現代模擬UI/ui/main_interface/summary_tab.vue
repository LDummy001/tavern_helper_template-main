<template>
  <div class="summary-tab-container">
    <div class="summary-content">
      <!-- 總結列表標題 -->
      <div class="summary-section">
        <h3 class="section-title">總結列表</h3>
        <button class="add-summary-button" @click="startAddingSummary">+ 添加總結</button>
      </div>

      <!-- 添加新總結編輯區域 -->
      <div v-if="adding_new" class="summary-row new-summary-row">
        <div class="summary-edit-mode">
          <!-- 第一行：最後樓層、權重、操作按鈕 -->
          <div class="summary-edit-first-row">
            <div class="summary-weighting-last-message-input-group">
              <div class="summary-last-message-id-input-group">
                最後樓層:
                <input
                  :value="edit_last_message_id"
                  type="number"
                  class="summary-last-message-id-input"
                  min="0"
                  step="1"
                  @input="updateLastMessageId($event)"
                />
              </div>
              <div class="summary-weighting-input-group">
                權重:
                <input
                  :value="edit_weighting"
                  type="number"
                  class="summary-weighting-input"
                  step="0.1"
                  min="0"
                  max="1"
                  @input="updateWeighting($event)"
                />
              </div>
            </div>
            <div class="summary-edit-actions">
              <button class="confirm-button" :disabled="!isEditFormValid" @click="saveSummary">保存</button>
              <button class="cancel-button" @click="cancelEditSummary">取消</button>
            </div>
          </div>

          <!-- 第二行：時間輸入 -->
          <div class="summary-edit-datetime-row">
            <div class="summary-datetime-input-group">
              <input
                :value="edit_datetime.year"
                type="number"
                class="summary-datetime-input summary-datetime-year-input"
                placeholder="年"
                @input="updateDatetime('year', $event)"
              />年
              <input
                :value="edit_datetime.month"
                type="number"
                class="summary-datetime-input"
                placeholder="月"
                min="1"
                max="12"
                @input="updateDatetime('month', $event)"
              />月
              <input
                :value="edit_datetime.day"
                type="number"
                class="summary-datetime-input"
                placeholder="日"
                min="1"
                max="31"
                @input="updateDatetime('day', $event)"
              />日
              <input
                :value="edit_datetime.hour"
                type="number"
                class="summary-datetime-input"
                placeholder="時"
                min="0"
                max="23"
                @input="updateDatetime('hour', $event)"
              />:
              <input
                :value="edit_datetime.minute"
                type="number"
                class="summary-datetime-input"
                placeholder="分"
                min="0"
                max="59"
                @input="updateDatetime('minute', $event)"
              />
            </div>
          </div>

          <!-- 第三行：總結內容輸入 -->
          <textarea
            :value="edit_summary_content"
            class="summary-content-input"
            placeholder="輸入總結內容..."
            @input="edit_summary_content = ($event.target as HTMLTextAreaElement).value"
          ></textarea>
        </div>
      </div>

      <!-- 總結列表 -->
      <div class="summary-list">
        <div
          v-for="(summary, index) in summaries"
          :key="index"
          class="summary-row"
          :class="{ 'new-summary-row': editing_index === index }"
        >
          <!-- 編輯模式 -->
          <div v-if="editing_index === index" class="summary-edit-mode">
            <!-- 第一行：最後樓層、權重、操作按鈕 -->
            <div class="summary-edit-first-row">
              <div class="summary-weighting-last-message-input-group">
                <div class="summary-last-message-id-input-group">
                  最後樓層:
                  <input
                    :value="edit_last_message_id"
                    type="number"
                    class="summary-last-message-id-input"
                    min="0"
                    step="1"
                    @input="updateLastMessageId($event)"
                  />
                </div>
                <div class="summary-weighting-input-group">
                  權重:
                  <input
                    :value="edit_weighting"
                    type="number"
                    class="summary-weighting-input"
                    step="0.1"
                    min="0"
                    max="1"
                    @input="updateWeighting($event)"
                  />
                </div>
              </div>
              <div class="summary-edit-actions">
                <button class="confirm-button" :disabled="!isEditFormValid" @click="saveSummary">保存</button>
                <button class="cancel-button" @click="cancelEditSummary">取消</button>
              </div>
            </div>

            <!-- 第二行：時間輸入 -->
            <div class="summary-edit-datetime-row">
              <div class="summary-datetime-input-group">
                <input
                  :value="edit_datetime.year"
                  type="number"
                  class="summary-datetime-input summary-datetime-year-input"
                  placeholder="年"
                  @input="updateDatetime('year', $event)"
                />年
                <input
                  :value="edit_datetime.month"
                  type="number"
                  class="summary-datetime-input"
                  placeholder="月"
                  min="1"
                  max="12"
                  @input="updateDatetime('month', $event)"
                />月
                <input
                  :value="edit_datetime.day"
                  type="number"
                  class="summary-datetime-input"
                  placeholder="日"
                  min="1"
                  max="31"
                  @input="updateDatetime('day', $event)"
                />日
                <input
                  :value="edit_datetime.hour"
                  type="number"
                  class="summary-datetime-input"
                  placeholder="時"
                  min="0"
                  max="23"
                  @input="updateDatetime('hour', $event)"
                />:
                <input
                  :value="edit_datetime.minute"
                  type="number"
                  class="summary-datetime-input"
                  placeholder="分"
                  min="0"
                  max="59"
                  @input="updateDatetime('minute', $event)"
                />
              </div>
            </div>

            <!-- 第三行：總結內容輸入 -->
            <textarea
              :value="edit_summary_content"
              class="summary-content-input"
              placeholder="輸入總結內容..."
              @input="edit_summary_content = ($event.target as HTMLTextAreaElement).value"
            ></textarea>
          </div>

          <!-- 顯示模式 -->
          <div v-else>
            <!-- 第一行：消息ID、權重、操作按鈕 -->
            <div class="summary-first-row">
              <div class="summary-weighting-last-message-group">
                <div class="summary-last-message-id">最後樓層: {{ summary.last_message_id }}</div>
                <div class="summary-weighting">權重: {{ summary.weighting }}</div>
                <div class="summary-status" :class="`status-${getSummaryUsageStatus(summary)}`">
                  {{ getSummaryUsageStatus(summary) === 'used' ? '使用中' : '未使用' }}
                </div>
              </div>
              <div class="summary-actions">
                <button class="edit-summary-button" @click="editSummary(index)">編輯</button>
                <button class="delete-summary-button" @click="deleteSummary(index)">刪除</button>
              </div>
            </div>

            <!-- 第二行：時間 -->
            <div class="summary-datetime-row">
              <div class="summary-datetime">
                {{ formatDatetime(summary.datetime) }}
              </div>
            </div>

            <!-- 第三行：總結內容 -->
            <div class="summary-content-display">{{ summary.summary }}</div>
          </div>
        </div>

        <div v-if="summaries.length === 0" class="no-summaries-message">沒有任何總結</div>
      </div>

      <!-- 確認窗口 -->
      <ConfirmationWindow
        :confirm-dialog="confirm_dialog"
        @update:confirm-dialog="confirm_dialog = $event"
        @confirm-dialog-confirm="confirmDeleteSummary"
        @confirm-dialog-cancel="cancelDeleteSummary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { Datetime } from '../../variable_logic/variables/datetime';
import { State } from '../../variable_logic/variables/state';
import { Summary } from '../../variable_logic/variables/summary';
import ConfirmationWindow from '../common_elements/confirmation_window.vue';

// 動態高度相關
const tab_navigation_height = ref(0); // 頂部標籤導航高度
const resize_observer = ref<ResizeObserver | null>(null);

// 動態計算總結內容的最大高度
const summary_content_max_height = computed(() => {
  return `calc(100vh - ${tab_navigation_height.value}px)`;
});

// 設置 ResizeObserver 監聽標籤導航高度變化
const setupResizeObserver = async () => {
  await nextTick();
  const tab_navigation = document.querySelector('.tab-navigation') as HTMLElement;
  if (tab_navigation && window.ResizeObserver) {
    resize_observer.value = new ResizeObserver(entries => {
      for (const entry of entries) {
        tab_navigation_height.value = entry.contentRect.height;
      }
    });
    resize_observer.value.observe(tab_navigation);
  } else {
    // 降級支援：如果不支持 ResizeObserver，使用估計值
    tab_navigation_height.value = 74;
  }
};

// 清理 ResizeObserver
const cleanupResizeObserver = () => {
  if (resize_observer.value) {
    resize_observer.value.disconnect();
    resize_observer.value = null;
  }
};

// 生命週期鉤子
onMounted(() => {
  setupResizeObserver();
});

onUnmounted(() => {
  cleanupResizeObserver();
});

// 確認窗口
const confirm_dialog = ref({
  visible: false,
  title: '',
  message: '',
  confirmText: '確認',
  cancelText: '取消',
});
const summary_to_delete = ref<number | null>(null);

// 編輯狀態（表示顯示列表中的索引）
const editing_index = ref<number | null>(null);
const adding_new = ref(false);
const edit_datetime = ref({
  year: 0,
  month: 0,
  day: 0,
  hour: 0,
  minute: 0,
});
const edit_weighting = ref(0);
const edit_last_message_id = ref(0);
const edit_summary_content = ref('');

// 獲取狀態
const state = ref<State | null>(null);

// 保存狀態並重新載入
const saveAndReloadState = () => {
  if (state.value) {
    state.value.saveAsVariable(getLastMessageId());
    loadState();
  }
};

// 載入狀態
const loadState = () => {
  try {
    const message_id = getLastMessageId();
    state.value = State.loadFromVariable(message_id);
  } catch (error) {
    console.error('Failed to load state:', error);
    state.value = null;
  }
};

// 初始化載入state
loadState();

const summaries = computed(() => {
  if (!state.value?.summaries) return [];
  // 按 last_message_id 降序排列（最大的在頂部）
  return [...state.value.summaries].sort((a, b) => b.last_message_id - a.last_message_id);
});

// 計算總結的使用狀態
const getSummaryUsageStatus = (summary: any) => {
  if (!state.value) return 'unused';
  // 從聊天變數讀取設置
  const settings = getVariables({ type: 'chat' }).settings || {};
  const excludeCount = settings.exclude_latest_summaries || 1;
  // 按 last_message_id 升序排列（最小的在前）
  const sortedSummaries = [...state.value.summaries].sort((a, b) => a.last_message_id - b.last_message_id);
  const summaryIndex = sortedSummaries.findIndex(s => s.last_message_id === summary.last_message_id);
  // 如果總結在排除範圍內，則為未使用狀態
  return summaryIndex >= sortedSummaries.length - excludeCount ? 'unused' : 'used';
};

// 刪除總結（顯示確認窗口）
const deleteSummary = (index: number) => {
  if (state.value && summaries.value[index]) {
    const summary = summaries.value[index];
    summary_to_delete.value = index; // 設置顯示索引
    confirm_dialog.value = {
      visible: true,
      title: '確認刪除總結',
      message: `確定要刪除總結 "${summary.summary.substring(0, 50)}${summary.summary.length > 50 ? '...' : ''}" 嗎？此操作無法撤銷。`,
      confirmText: '刪除',
      cancelText: '取消',
    };
  }
};

// 確認刪除總結
const confirmDeleteSummary = () => {
  if (summary_to_delete.value !== null && state.value) {
    const summary = summaries.value[summary_to_delete.value];
    const originalIndex = state.value.summaries.indexOf(summary);
    if (originalIndex !== -1) {
      state.value.summaries.splice(originalIndex, 1);
      saveAndReloadState();
    }
  }
  confirm_dialog.value.visible = false;
  summary_to_delete.value = null;
};

// 取消刪除總結
const cancelDeleteSummary = () => {
  confirm_dialog.value.visible = false;
  summary_to_delete.value = null;
};

// 編輯總結
const editSummary = (index: number) => {
  if (state.value && summaries.value[index]) {
    editing_index.value = index; // 設置顯示索引
    const summary = summaries.value[index];

    const date = summary.datetime.toDate();
    edit_datetime.value = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
    edit_weighting.value = summary.weighting;
    edit_last_message_id.value = summary.last_message_id;
    edit_summary_content.value = summary.summary;
  }
};

// 獲取最後助手消息 ID
const getLastAssistantMessageId = () => {
  const assistantMessages = getChatMessages(-1, { role: 'assistant' });
  return assistantMessages.length > 0 ? assistantMessages[0].message_id : getLastMessageId();
};

// 開始添加新總結
const startAddingSummary = () => {
  adding_new.value = true;
  if (state.value) {
    const currentDatetime = state.value.datetime.toDate();
    edit_datetime.value = {
      year: currentDatetime.getFullYear(),
      month: currentDatetime.getMonth() + 1,
      day: currentDatetime.getDate(),
      hour: currentDatetime.getHours(),
      minute: currentDatetime.getMinutes(),
    };
  }
  edit_last_message_id.value = getLastAssistantMessageId();
  edit_weighting.value = 0.5;
  edit_summary_content.value = '';
};

// 保存編輯
const saveSummary = () => {
  if (!state.value) return;

  try {
    const newDate = new Date(
      edit_datetime.value.year,
      edit_datetime.value.month - 1, // JavaScript Date month is 0-based
      edit_datetime.value.day,
      edit_datetime.value.hour,
      edit_datetime.value.minute,
      0,
    );

    const newDatetime = new Datetime(newDate);
    const updatedSummary = new Summary(
      newDatetime,
      edit_summary_content.value.trim(),
      edit_weighting.value,
      edit_last_message_id.value,
    );

    if (editing_index.value !== null) {
      // 編輯現有總結
      const summary = summaries.value[editing_index.value];
      const originalIndex = state.value.summaries.indexOf(summary);
      if (originalIndex !== -1) {
        state.value.summaries[originalIndex] = updatedSummary;
        saveAndReloadState();
        editing_index.value = null;
      }
    } else if (adding_new.value) {
      // 添加新總結
      state.value.summaries.push(updatedSummary);
      // 確保升序排列
      state.value.summaries.sort((a, b) => a.last_message_id - b.last_message_id);
      saveAndReloadState();
      adding_new.value = false;
    }
  } catch (error) {
    console.error('Failed to save summary:', error);
  }
};

// 取消編輯
const cancelEditSummary = () => {
  editing_index.value = null;
  adding_new.value = false;
};

// 檢查編輯字段是否有效
const isEditFormValid = computed(() => {
  if (edit_last_message_id.value < 0 || !Number.isInteger(edit_last_message_id.value)) {
    return false;
  }
  if (edit_weighting.value < 0 || edit_weighting.value > 1) {
    return false;
  }
  if (edit_datetime.value.year < 0 || !Number.isInteger(edit_datetime.value.year)) {
    return false;
  }
  if (!edit_summary_content.value.trim()) {
    return false;
  }
  // 檢查日期有效性
  try {
    const testDate = new Date(
      edit_datetime.value.year,
      edit_datetime.value.month - 1,
      edit_datetime.value.day,
      edit_datetime.value.hour,
      edit_datetime.value.minute,
      0,
    );
    if (
      testDate.getFullYear() !== edit_datetime.value.year ||
      testDate.getMonth() !== edit_datetime.value.month - 1 ||
      testDate.getDate() !== edit_datetime.value.day
    ) {
      return false;
    }
  } catch {
    return false;
  }
  return true;
});

// 限制輸入值
const clampInput = (value: string, min: number, max: number, allowFloat: boolean = false) => {
  const num = allowFloat ? parseFloat(value) : parseInt(value);
  if (isNaN(num)) return '';
  return Math.min(Math.max(num, min), max).toString();
};

// 更新最後樓層 ID
const updateLastMessageId = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const clampedValue = parseInt(clampInput(target.value, 0, Number.MAX_SAFE_INTEGER));
  edit_last_message_id.value = clampedValue;
};

// 更新權重
const updateWeighting = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const clampedValue = parseFloat(clampInput(target.value, 0, 1, true));
  edit_weighting.value = clampedValue;
};

// 更新日期時間
const updateDatetime = (field: keyof typeof edit_datetime.value, event: Event) => {
  const target = event.target as HTMLInputElement;
  let clampedValue: number;

  switch (field) {
    case 'year':
      clampedValue = parseInt(clampInput(target.value, 0, Number.MAX_SAFE_INTEGER));
      break;
    case 'month':
      clampedValue = parseInt(clampInput(target.value, 1, 12));
      break;
    case 'day':
      clampedValue = parseInt(clampInput(target.value, 1, 31));
      break;
    case 'hour':
      clampedValue = parseInt(clampInput(target.value, 0, 23));
      break;
    case 'minute':
      clampedValue = parseInt(clampInput(target.value, 0, 59));
      break;
    default:
      return;
  }

  edit_datetime.value = { ...edit_datetime.value, [field]: clampedValue };
};

// 格式化時間顯示
const formatDatetime = (datetime: any) => {
  // Type assertion to handle Vue's reactive proxy
  const dt = datetime as Datetime;
  const date = dt.toDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};
</script>

<style lang="scss" scoped>
.summary-tab-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.summary-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: v-bind(summary_content_max_height);
  max-height: v-bind(summary_content_max_height);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2a2a2a;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;

    &:hover {
      background: #666;
    }
  }
}

.summary-section {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #007acc;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #007acc;
}

.add-summary-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  background: #007acc;
  color: white;
  margin-top: 12px;
  width: 100%;

  &:hover {
    background: #005a99;
  }
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-row {
  background: #252525;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #404040;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background: #2a2a2a;
    border-color: #555;
  }
}

.new-summary-row {
  background: #2a2a2a;
  border-color: #007acc;
  border-style: dashed;
}

.summary-first-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.summary-weighting-last-message-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.summary-datetime-row {
  margin-bottom: 4px;
}

.summary-datetime {
  font-weight: 500;
  color: #4caf50;
  font-size: 14px;
  flex-shrink: 0;
}

.summary-weighting {
  font-weight: 500;
  color: #ff9800;
  font-size: 13px;
}

.summary-last-message-id {
  font-weight: 500;
  color: #bb86fc;
  font-size: 13px;
}

.summary-status {
  font-weight: 500;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  text-align: center;
  min-width: 50px;

  &.status-used {
    background-color: #4caf50;
    color: white;
  }

  &.status-unused {
    background-color: #ff9800;
    color: white;
  }
}

.summary-content-display {
  color: #a0a0a0;
  line-height: 1.4;
  font-size: 13px;
}

.summary-actions {
  display: flex;
  gap: 8px;
}

.edit-summary-button,
.delete-summary-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-summary-button {
  background: #007acc;
  color: white;

  &:hover {
    background: #005a99;
  }
}

.delete-summary-button {
  background: #f44336;
  color: white;

  &:hover {
    background: #da190b;
  }
}

.no-summaries-message {
  background: #252525;
  padding: 16px 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  color: #888;
  text-align: center;
  font-size: 14px;
  font-style: italic;
}

.summary-edit-mode {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-edit-first-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.summary-weighting-last-message-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.summary-weighting-input-group,
.summary-last-message-id-input-group {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 13px;
  color: #a0a0a0;
}

.summary-edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.summary-edit-datetime-row {
  margin-bottom: 4px;
}

.summary-datetime-input-group {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  font-weight: 500;
  color: #4caf50;
  font-size: 14px;
}

.summary-datetime-input {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #4caf50;
  font-size: 14px;
  padding: 4px 8px;
  width: 35px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #007acc;
  }

  /* 移除數字輸入框的上下箭頭按鈕 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
}

.summary-datetime-year-input {
  width: 60px; /* Wider width for 4-digit year display */
}

.summary-weighting-input {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #ff9800;
  font-size: 14px;
  padding: 4px 8px;
  width: 60px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #007acc;
  }

  /* 移除數字輸入框的上下箭頭按鈕 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
}

.summary-last-message-id-input {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #9c27b0;
  font-size: 14px;
  padding: 4px 8px;
  width: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #007acc;
  }

  /* 移除數字輸入框的上下箭頭按鈕 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
}

.summary-content-input {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 13px;
  padding: 6px 8px;
  resize: vertical;
  min-height: 60px;
  line-height: 1.4;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.confirm-button,
.cancel-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button {
  background: #4caf50;
  color: white;

  &:hover:not(:disabled) {
    background: #45a049;
  }

  &:disabled {
    background: #666666;
    color: #cccccc;
    cursor: not-allowed;
  }
}

.cancel-button {
  background: #f44336;
  color: white;

  &:hover {
    background: #da190b;
  }
}

@media (max-width: 768px) {
  .summary-content {
    padding: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .summary-row {
    padding: 10px 12px;
    gap: 6px;
  }

  .summary-first-row {
    gap: 8px;
  }

  .summary-weighting-last-message-group {
    gap: 8px;
  }

  .summary-datetime-row {
    margin-bottom: 3px;
  }

  .summary-content-display {
    font-size: 12px;
  }

  .summary-actions {
    gap: 6px;
  }

  .edit-summary-button,
  .delete-summary-button {
    padding: 5px 10px;
    font-size: 11px;
  }

  .summary-edit-first-row {
    gap: 8px;
  }

  .summary-weighting-last-message-input-group {
    gap: 8px;
  }

  .summary-edit-actions {
    gap: 6px;
  }

  .summary-datetime-input {
    font-size: 13px;
    padding: 3px 6px;
  }

  .summary-datetime-year-input {
    width: 50px;
  }

  .summary-weighting-input {
    width: 50px;
  }

  .summary-last-message-id-input {
    width: 35px;
  }

  .summary-content-input {
    font-size: 12px;
    padding: 4px 6px;
    min-height: 50px;
  }

  .confirm-button,
  .cancel-button {
    padding: 5px 10px;
    font-size: 11px;
  }
}
</style>
