<template>
  <div class="promise-tab-container">
    <div class="promise-content">
      <!-- 約定列表標題 -->
      <div class="promise-section">
        <h3 class="section-title">約定列表</h3>
      </div>

      <!-- 約定列表 -->
      <div class="promise-list">
        <div v-for="[promise_id, promise] in promises" :key="promise_id" class="promise-row">
          <!-- 第一行：ID、截止日期、操作按鈕 -->
          <div class="promise-first-row">
            <div class="promise-id-name-group">
              <div v-if="!editing_promise_ids.has(promise_id)" class="promise-id">{{ promise_id }}</div>
              <input v-else v-model="edit_forms[promise_id].id" class="promise-id-input" placeholder="約定ID" />
              <div v-if="!editing_promise_ids.has(promise_id)" class="promise-deadline">
                {{ formatDeadline(promise.deadline) }}
              </div>
              <div v-else class="promise-deadline-input-group">
                <input
                  v-model.number="edit_forms[promise_id].deadline.year"
                  type="number"
                  placeholder="年"
                  class="promise-deadline-input promise-deadline-year-input"
                  @input="
                    edit_forms[promise_id].deadline.year = clampInput(
                      edit_forms[promise_id].deadline.year.toString(),
                      0,
                      Number.MAX_SAFE_INTEGER,
                    )
                  "
                />
                <span>年</span>
                <input
                  v-model.number="edit_forms[promise_id].deadline.month"
                  type="number"
                  placeholder="月"
                  class="promise-deadline-input"
                  @input="
                    edit_forms[promise_id].deadline.month = clampInput(
                      edit_forms[promise_id].deadline.month.toString(),
                      1,
                      12,
                    )
                  "
                />
                <span>月</span>
                <input
                  v-model.number="edit_forms[promise_id].deadline.day"
                  type="number"
                  placeholder="日"
                  class="promise-deadline-input"
                  @input="
                    edit_forms[promise_id].deadline.day = clampInput(
                      edit_forms[promise_id].deadline.day.toString(),
                      1,
                      31,
                    )
                  "
                />
                <span>日</span>
                <input
                  v-model.number="edit_forms[promise_id].deadline.hour"
                  type="number"
                  placeholder="時"
                  class="promise-deadline-input"
                  @input="
                    edit_forms[promise_id].deadline.hour = clampInput(
                      edit_forms[promise_id].deadline.hour.toString(),
                      0,
                      23,
                    )
                  "
                />
                <span>:</span>
                <input
                  v-model.number="edit_forms[promise_id].deadline.minute"
                  type="number"
                  placeholder="分"
                  class="promise-deadline-input"
                  @input="
                    edit_forms[promise_id].deadline.minute = clampInput(
                      edit_forms[promise_id].deadline.minute.toString(),
                      0,
                      59,
                    )
                  "
                />
              </div>
            </div>
            <div class="promise-actions">
              <button
                v-if="!editing_promise_ids.has(promise_id)"
                class="edit-promise-button"
                @click="startEditingPromise(promise_id)"
              >
                編輯
              </button>
              <button
                v-if="!editing_promise_ids.has(promise_id)"
                class="delete-promise-button"
                @click="deletePromise(promise_id)"
              >
                刪除
              </button>
            </div>
          </div>

          <!-- 第二行：地點 + 編輯按鈕 -->
          <div class="promise-location-row">
            <div class="promise-location-group">
              <span class="promise-location-label">地點：</span>
              <div v-if="!editing_promise_ids.has(promise_id)" class="promise-location">{{ promise.location }}</div>
              <input
                v-else
                v-model="edit_forms[promise_id].location"
                class="promise-location-input promise-location-input-edit"
                placeholder="約定地點"
              />
            </div>
            <div v-if="editing_promise_ids.has(promise_id)" class="promise-edit-actions">
              <button class="confirm-button" @click="savePromiseEdit(promise_id)">保存</button>
              <button class="cancel-button" @click="cancelPromiseEdit(promise_id)">取消</button>
            </div>
          </div>

          <!-- 第三行：角色ID -->
          <div v-if="!editing_promise_ids.has(promise_id)" class="promise-character-ids-display">
            <span v-for="character_id in promise.character_ids" :key="character_id" class="promise-character-id-tag">
              {{ characters.find(c => c.id === character_id)?.name || character_id }}
            </span>
          </div>
          <div v-else class="promise-character-ids-input-group">
            <div class="selected-characters">
              <span
                v-for="character_id in edit_forms[promise_id].character_ids"
                :key="character_id"
                class="selected-character-tag"
              >
                {{ characters.find(c => c.id === character_id)?.name || character_id }}
                <button class="remove-character-btn" @click="removeCharacterId(edit_forms[promise_id], character_id)">
                  ×
                </button>
              </span>
            </div>
            <select
              class="character-select"
              @change="
                addCharacterId(edit_forms[promise_id], ($event.target as HTMLSelectElement).value);
                ($event.target as HTMLSelectElement).value = '';
              "
            >
              <option value="">選擇角色...</option>
              <option
                v-for="character in characters"
                :key="character.id"
                :value="character.id"
                :disabled="edit_forms[promise_id].character_ids.includes(character.id)"
              >
                {{ character.name }} ({{ character.id }})
              </option>
            </select>
          </div>

          <!-- 第四行：描述 -->
          <div v-if="!editing_promise_ids.has(promise_id)" class="promise-description">{{ promise.description }}</div>
          <textarea
            v-else
            v-model="edit_forms[promise_id].description"
            class="promise-description-input"
            placeholder="約定內容"
          ></textarea>
        </div>
        <!-- 新約定編輯行 -->
        <div v-if="is_adding" class="promise-row new-promise-row">
          <!-- 第一行：ID、截止日期 -->
          <div class="promise-first-row">
            <div class="promise-id-name-group">
              <input v-model="add_form.id" class="promise-id-input" placeholder="約定ID" />
              <div class="promise-deadline-input-group">
                <input
                  v-model.number="add_form.deadline.year"
                  type="number"
                  placeholder="年"
                  class="promise-deadline-input promise-deadline-year-input"
                  @input="
                    add_form.deadline.year = clampInput(add_form.deadline.year.toString(), 0, Number.MAX_SAFE_INTEGER)
                  "
                />
                <span>年</span>
                <input
                  v-model.number="add_form.deadline.month"
                  type="number"
                  placeholder="月"
                  class="promise-deadline-input"
                  @input="add_form.deadline.month = clampInput(add_form.deadline.month.toString(), 1, 12)"
                />
                <span>月</span>
                <input
                  v-model.number="add_form.deadline.day"
                  type="number"
                  placeholder="日"
                  class="promise-deadline-input"
                  @input="add_form.deadline.day = clampInput(add_form.deadline.day.toString(), 1, 31)"
                />
                <span>日</span>
                <input
                  v-model.number="add_form.deadline.hour"
                  type="number"
                  placeholder="時"
                  class="promise-deadline-input"
                  @input="add_form.deadline.hour = clampInput(add_form.deadline.hour.toString(), 0, 23)"
                />
                <span>:</span>
                <input
                  v-model.number="add_form.deadline.minute"
                  type="number"
                  placeholder="分"
                  class="promise-deadline-input"
                  @input="add_form.deadline.minute = clampInput(add_form.deadline.minute.toString(), 0, 59)"
                />
              </div>
            </div>
          </div>

          <!-- 第二行：地點 + 添加按鈕 -->
          <div class="promise-location-row">
            <div class="promise-location-group">
              <span class="promise-location-label">地點：</span>
              <input
                v-model="add_form.location"
                class="promise-location-input promise-location-input-edit"
                placeholder="約定地點"
              />
            </div>
            <div class="promise-edit-actions">
              <button class="confirm-button" @click="addNewPromise">添加</button>
              <button class="cancel-button" @click="cancelAddingPromise">取消</button>
            </div>
          </div>

          <!-- 第三行：角色ID -->
          <div class="promise-character-ids-input-group">
            <div class="selected-characters">
              <span v-for="character_id in add_form.character_ids" :key="character_id" class="selected-character-tag">
                {{ characters.find(c => c.id === character_id)?.name || character_id }}
                <button class="remove-character-btn" @click="removeCharacterId(add_form, character_id)">×</button>
              </span>
            </div>
            <select
              class="character-select"
              @change="
                addCharacterId(add_form, ($event.target as HTMLSelectElement).value);
                ($event.target as HTMLSelectElement).value = '';
              "
            >
              <option value="">選擇角色...</option>
              <option
                v-for="character in characters"
                :key="character.id"
                :value="character.id"
                :disabled="add_form.character_ids.includes(character.id)"
              >
                {{ character.name }} ({{ character.id }})
              </option>
            </select>
          </div>

          <!-- 第四行：描述 -->
          <textarea v-model="add_form.description" class="promise-description-input" placeholder="約定內容"></textarea>
        </div>

        <div v-if="promises.size === 0 && !is_adding" class="no-promises-message">沒有任何約定</div>
        <button v-if="!is_adding" class="add-promise-button" @click="startAddingPromise">+ 添加約定</button>
      </div>

      <!-- 確認窗口 -->
      <ConfirmationWindow
        :confirm-dialog="confirm_dialog"
        @update:confirm-dialog="confirm_dialog = $event"
        @confirm-dialog-confirm="confirmDeletePromise"
        @confirm-dialog-cancel="cancelDeletePromise"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Datetime } from '../../variable_logic/variables/datetime';
import { Promise } from '../../variable_logic/variables/promise';
import { State } from '../../variable_logic/variables/state';
import ConfirmationWindow from '../common_elements/confirmation_window.vue';

// 創建空的表單對象
const createEmptyForm = () => ({
  id: '',
  deadline: { year: '', month: '', day: '', hour: '', minute: '' },
  location: '',
  character_ids: [] as string[],
  description: '',
});

// 從 deadline 對象創建 Datetime
const createDatetimeFromDeadline = (deadline: {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
}) => {
  const year = parseInt(deadline.year) || new Date().getFullYear();
  const month = parseInt(deadline.month) || 1;
  const day = parseInt(deadline.day) || 1;
  const hour = parseInt(deadline.hour) || 0;
  const minute = parseInt(deadline.minute) || 0;
  return new Datetime(new Date(year, month - 1, day, hour, minute, 0));
};

// 從 Datetime 解析為 deadline 對象
const parseDatetimeToDeadline = (datetime: Datetime) => {
  const date = datetime.toDate();
  return {
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString(),
    day: date.getDate().toString(),
    hour: date.getHours().toString(),
    minute: date.getMinutes().toString(),
  };
};

// 編輯模式
const is_adding = ref(false);
const editing_promise_ids = ref(new Set<string>());
const add_form = ref(createEmptyForm());
const edit_forms = ref<
  Record<
    string,
    {
      id: string;
      deadline: { year: string; month: string; day: string; hour: string; minute: string };
      location: string;
      character_ids: string[];
      description: string;
    }
  >
>({});

// 確認窗口
const confirm_dialog = ref({
  visible: false,
  title: '',
  message: '',
  confirmText: '確認',
  cancelText: '取消',
});
const promise_to_delete = ref<string | null>(null);

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

const promises = computed(() => {
  return state.value?.promises || new Map();
});

const characters = computed(() => {
  if (!state.value) return [];
  const all_characters = new Map<string, string>();
  // 添加活躍角色
  for (const [id, character] of state.value.active_characters) {
    all_characters.set(id, character.name);
  }
  // 添加非活躍角色
  for (const [id, character] of state.value.deactive_characters) {
    all_characters.set(id, character.name);
  }
  return Array.from(all_characters.entries()).map(([id, name]) => ({ id, name }));
});

// 生成下一個可用的約定ID
const generateNextPromiseId = () => {
  const existing_ids = Array.from(promises.value.keys());
  let counter = 1;
  while (existing_ids.includes(`p${counter}`)) {
    counter++;
  }
  return `p${counter}`;
};

// 開始添加約定
const startAddingPromise = () => {
  is_adding.value = true;
  add_form.value = createEmptyForm();
  add_form.value.id = generateNextPromiseId();
};

// 驗證和創建約定
const validateAndCreatePromise = (form: {
  id: string;
  deadline: { year: string; month: string; day: string; hour: string; minute: string };
  location: string;
  character_ids: string[];
  description: string;
}) => {
  if (!form.id || !form.deadline || !form.location || !form.description) {
    return null;
  }

  try {
    const deadline = createDatetimeFromDeadline(form.deadline);
    const character_ids = form.character_ids.filter(id => id);
    return new Promise(deadline, character_ids, form.location, form.description);
  } catch (error) {
    console.error('Failed to create promise:', error);
    return null;
  }
};

// 添加新約定
const addNewPromise = () => {
  if (!state.value) return;

  // 檢查約定ID是否已經存在
  if (state.value.promises.has(add_form.value.id)) {
    cancelAddingPromise();
    return;
  }

  const new_promise = validateAndCreatePromise(add_form.value);
  if (new_promise) {
    state.value.promises.set(add_form.value.id, new_promise);
    saveAndReloadState();
    cancelAddingPromise();
  } else {
    cancelAddingPromise();
  }
};

// 取消添加約定
const cancelAddingPromise = () => {
  is_adding.value = false;
  add_form.value = createEmptyForm();
};

// 開始編輯約定
const startEditingPromise = (promise_id: string) => {
  const promise = promises.value.get(promise_id);
  if (promise) {
    editing_promise_ids.value.add(promise_id);
    edit_forms.value[promise_id] = {
      id: promise_id,
      deadline: parseDatetimeToDeadline(promise.deadline),
      location: promise.location,
      character_ids: [...promise.character_ids],
      description: promise.description,
    };
  }
};

// 保存約定編輯
const savePromiseEdit = (promise_id: string) => {
  if (!state.value || !edit_forms.value[promise_id]) return;

  const form = edit_forms.value[promise_id];

  // 檢查約定ID是否已經存在（如果ID發生了變化）
  if (form.id !== promise_id && state.value.promises.has(form.id)) {
    cancelPromiseEdit(promise_id);
    return;
  }

  const updated_promise = validateAndCreatePromise(form);
  if (updated_promise) {
    const existing_promise = state.value.promises.get(promise_id);
    if (existing_promise) {
      // 如果ID發生了變化，需要刪除舊的並添加新的
      if (form.id !== promise_id) {
        state.value.promises.delete(promise_id);
        state.value.promises.set(form.id, updated_promise);
      } else {
        // 更新現有約定的屬性
        existing_promise.deadline = updated_promise.deadline;
        existing_promise.location = updated_promise.location;
        existing_promise.character_ids = updated_promise.character_ids;
        existing_promise.description = updated_promise.description;
      }
      saveAndReloadState();
    }
    cancelPromiseEdit(promise_id);
  } else {
    cancelPromiseEdit(promise_id);
  }
};

// 取消約定編輯
const cancelPromiseEdit = (promise_id: string) => {
  editing_promise_ids.value.delete(promise_id);
  delete edit_forms.value[promise_id];
};

// 刪除約定（顯示確認窗口）
const deletePromise = (promise_id: string) => {
  const promise = promises.value.get(promise_id);
  if (promise) {
    promise_to_delete.value = promise_id;
    confirm_dialog.value = {
      visible: true,
      title: '確認刪除約定',
      message: `確定要刪除約定 "${promise.description}" 嗎？此操作無法撤銷。`,
      confirmText: '刪除',
      cancelText: '取消',
    };
  }
};

// 確認刪除約定
const confirmDeletePromise = () => {
  if (promise_to_delete.value && state.value) {
    state.value.promises.delete(promise_to_delete.value);
    saveAndReloadState();
  }
  confirm_dialog.value.visible = false;
  promise_to_delete.value = null;
};

// 取消刪除約定
const cancelDeletePromise = () => {
  confirm_dialog.value.visible = false;
  promise_to_delete.value = null;
};

// 處理角色ID的添加和移除
const addCharacterId = (form: { character_ids: string[] }, character_id: string) => {
  if (!form.character_ids.includes(character_id)) {
    form.character_ids.push(character_id);
  }
};

const removeCharacterId = (form: { character_ids: string[] }, character_id: string) => {
  const index = form.character_ids.indexOf(character_id);
  if (index > -1) {
    form.character_ids.splice(index, 1);
  }
};

// 限制輸入值
const clampInput = (value: string, min: number, max: number) => {
  const num = parseInt(value);
  if (isNaN(num)) return '';
  return Math.min(Math.max(num, min), max).toString();
};

// 格式化截止日期顯示
const formatDeadline = (datetime: Datetime) => {
  const date = datetime.toDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};
</script>

<style lang="scss" scoped>
.promise-tab-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.promise-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 74px);

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

.promise-section {
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

.add-promise-button {
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

  &:hover {
    background: #005a99;
  }
}

.promise-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.promise-row {
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

.new-promise-row {
  background: #2a2a2a;
  border-color: #007acc;
  border-style: dashed;
}

.promise-first-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.promise-location-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.promise-location-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.promise-location-label {
  font-weight: 500;
  color: #a0a0a0;
  font-size: 13px;
  min-width: 40px;
}

.promise-edit-actions {
  display: flex;
  gap: 8px;
}

.promise-id-name-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.promise-id {
  font-weight: 500;
  color: #007acc;
  font-size: 14px;
}

.promise-location {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
}

.promise-location-input {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
  width: 35px;
  flex-shrink: 0;
}

.promise-location-input-edit {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px 8px;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.promise-deadline {
  font-weight: 500;
  color: #4caf50;
  font-size: 14px;
  flex-shrink: 0;
}

.promise-character-ids-display {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.promise-character-id-tag {
  background: #007acc;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.promise-description {
  color: #a0a0a0;
  line-height: 1.4;
  font-size: 13px;
}

.promise-actions {
  display: flex;
  gap: 8px;
}

.edit-promise-button,
.delete-promise-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-promise-button {
  background: #007acc;
  color: white;

  &:hover {
    background: #005a99;
  }
}

.delete-promise-button {
  background: #f44336;
  color: white;

  &:hover {
    background: #da190b;
  }
}

.promise-id-input,
.promise-deadline-input,
.promise-location-input,
.promise-character-ids-input {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 14px;
  padding: 4px 8px;
  width: 35px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  appearance: none;

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
  }
}

.promise-id-input {
  font-weight: 500;
  color: #007acc;
  font-size: 14px;
  width: 50px;
  flex-shrink: 0;
  text-align: center;
}

.promise-deadline-input {
  color: #4caf50;
  text-align: center;
}

.promise-deadline-year-input {
  width: 60px; /* Wider width for 4-digit year display */
}

.promise-deadline-input-group {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  font-weight: 500;
  color: #4caf50;
  font-size: 14px;
}

.promise-deadline-year,
.promise-deadline-month,
.promise-deadline-day,
.promise-deadline-hour,
.promise-deadline-minute {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #4caf50;
  font-size: 12px;
  padding: 4px 6px;
  width: 45px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.promise-location-input {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
  width: 120px;
  flex-shrink: 0;
}

.promise-character-ids-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selected-characters {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.selected-character-tag {
  background: #007acc;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.remove-character-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  margin-left: 2px;

  &:hover {
    color: #ccc;
  }
}

.character-select {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 13px;
  padding: 4px 8px;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.promise-description-input {
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

  &:hover {
    background: #45a049;
  }
}

.cancel-button {
  background: #f44336;
  color: white;

  &:hover {
    background: #da190b;
  }
}

.no-promises-message {
  background: #252525;
  padding: 16px 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  color: #888;
  text-align: center;
  font-size: 14px;
  font-style: italic;
}

@media (max-width: 768px) {
  .promise-content {
    padding: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .promise-row {
    padding: 10px 12px;
    gap: 6px;
  }

  .promise-first-row {
    gap: 8px;
  }

  .promise-location-row {
    gap: 6px;
    margin-top: 4px;
  }

  .promise-location-group {
    gap: 6px;
  }

  .promise-location-label {
    font-size: 12px;
    min-width: 35px;
  }

  .promise-location {
    font-size: 15px;
  }

  .promise-location-input {
    font-size: 15px;
    width: 100px;
  }

  .promise-edit-actions {
    gap: 6px;
  }

  .promise-description {
    font-size: 12px;
  }

  .promise-actions {
    gap: 6px;
  }

  .edit-promise-button,
  .delete-promise-button {
    padding: 5px 10px;
    font-size: 11px;
  }

  .promise-id-input,
  .promise-deadline-input,
  .promise-location-input {
    font-size: 13px;
    padding: 3px 6px;
  }

  .promise-deadline-year-input {
    width: 50px; /* Slightly wider on mobile for year input */
  }

  .promise-deadline-year,
  .promise-deadline-month,
  .promise-deadline-day,
  .promise-deadline-hour,
  .promise-deadline-minute {
    font-size: 11px;
    padding: 3px 4px;
    width: 35px;
  }

  .character-select {
    font-size: 12px;
    padding: 3px 6px;
  }

  .selected-character-tag,
  .promise-character-id-tag {
    font-size: 10px;
    padding: 1px 4px;
  }

  .promise-description-input {
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
