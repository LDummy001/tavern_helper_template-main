<template>
  <div class="item-tab-container">
    <div class="item-content">
      <!-- 物品列表標題 -->
      <div class="item-section">
        <h3 class="section-title">物品列表</h3>
      </div>

      <!-- 物品列表 -->
      <div class="item-list">
        <div v-for="[item_id, item] in items" :key="item_id" class="item-row">
          <!-- 物品信息 -->
          <div class="item-info">
            <div class="item-id-name-row">
              <div v-if="!editing_item_ids.has(item_id)" class="item-id">{{ item_id }}</div>
              <input v-else v-model="edit_forms[item_id].id" class="item-id-input" placeholder="物品ID" />
              <div v-if="!editing_item_ids.has(item_id)" class="item-name">{{ item.name }}</div>
              <input v-else v-model="edit_forms[item_id].name" class="item-name-input" placeholder="物品名稱" />
            </div>
            <div v-if="!editing_item_ids.has(item_id)" class="item-description">{{ item.description }}</div>
            <textarea
              v-else
              v-model="edit_forms[item_id].description"
              class="item-description-input"
              placeholder="物品描述"
            ></textarea>
          </div>

          <!-- 價值和操作按鈕 -->
          <div class="item-value-actions-row">
            <div v-if="!editing_item_ids.has(item_id)" class="item-value">${{ item.value.toLocaleString() }}</div>
            <div v-else class="item-value-input-wrapper">
              <span class="dollar-sign">$</span>
              <input
                v-model.number="edit_forms[item_id].value"
                class="item-value-input"
                type="number"
                placeholder="價值"
              />
            </div>
            <div class="item-actions">
              <button v-if="!editing_item_ids.has(item_id)" class="edit-item-button" @click="startEditingItem(item_id)">
                編輯
              </button>
              <button v-else class="confirm-button" @click="saveItemEdit(item_id)">保存</button>
              <button v-if="!editing_item_ids.has(item_id)" class="delete-item-button" @click="deleteItem(item_id)">
                刪除
              </button>
              <button v-else class="cancel-button" @click="cancelItemEdit(item_id)">取消</button>
            </div>
          </div>
        </div>
        <!-- 新物品編輯行 -->
        <div v-if="is_adding" class="item-row new-item-row">
          <!-- 物品信息 -->
          <div class="item-info">
            <div class="item-id-name-row">
              <input v-model="add_form.id" class="item-id-input" placeholder="物品ID" />
              <input v-model="add_form.name" class="item-name-input" placeholder="物品名稱" />
            </div>
            <textarea v-model="add_form.description" class="item-description-input" placeholder="物品描述"></textarea>
          </div>

          <!-- 價值和操作按鈕 -->
          <div class="item-value-actions-row">
            <div class="item-value-input-wrapper">
              <span class="dollar-sign">$</span>
              <input v-model.number="add_form.value" class="item-value-input" type="number" placeholder="價值" />
            </div>
            <div class="item-actions">
              <button class="confirm-button" @click="addNewItem">添加</button>
              <button class="cancel-button" @click="cancelAddingItem">取消</button>
            </div>
          </div>
        </div>

        <div v-if="items.size === 0 && !is_adding" class="no-items-message">沒有任何物品</div>
        <button v-if="!is_adding" class="add-item-button" @click="startAddingItem">+ 添加物品</button>
      </div>

      <!-- 確認窗口 -->
      <ConfirmationWindow
        :confirm-dialog="confirm_dialog"
        @update:confirm-dialog="confirm_dialog = $event"
        @confirm-dialog-confirm="confirmDeleteItem"
        @confirm-dialog-cancel="cancelDeleteItem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Item } from '../../variable_logic/variables/item';
import { State } from '../../variable_logic/variables/state';
import ConfirmationWindow from '../common_elements/confirmation_window.vue';

// 創建空的表單對象
const createEmptyForm = () => ({
  id: '',
  name: '',
  description: '',
  value: 0,
});

// 編輯模式
const is_adding = ref(false);
const editing_item_ids = ref(new Set<string>());
const add_form = ref(createEmptyForm());
const edit_forms = ref<Record<string, { id: string; name: string; description: string; value: number }>>({});

// 確認窗口
const confirm_dialog = ref({
  visible: false,
  title: '',
  message: '',
  confirmText: '確認',
  cancelText: '取消',
});
const item_to_delete = ref<string | null>(null);

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

const items = computed(() => {
  return state.value?.items || new Map();
});

// 開始添加物品
const startAddingItem = () => {
  is_adding.value = true;
  add_form.value = createEmptyForm();
};

// 添加新物品
const addNewItem = () => {
  if (!state.value || !add_form.value.id || !add_form.value.name) return;

  // 檢查物品ID是否已經存在
  if (state.value.items.has(add_form.value.id)) {
    cancelAddingItem();
    return;
  }

  const new_item = new Item(add_form.value.name, add_form.value.description, add_form.value.value);
  state.value.items.set(add_form.value.id, new_item);
  saveAndReloadState();
  cancelAddingItem();
};

// 取消添加物品
const cancelAddingItem = () => {
  is_adding.value = false;
  add_form.value = createEmptyForm();
};

// 開始編輯物品
const startEditingItem = (item_id: string) => {
  const item = items.value.get(item_id);
  if (item) {
    editing_item_ids.value.add(item_id);
    edit_forms.value[item_id] = {
      id: item_id,
      name: item.name,
      description: item.description,
      value: item.value,
    };
  }
};

// 保存物品編輯
const saveItemEdit = (item_id: string) => {
  if (!state.value || !edit_forms.value[item_id]) return;

  const form = edit_forms.value[item_id];

  // 檢查物品ID是否已經存在（如果ID發生了變化）
  if (form.id !== item_id && state.value.items.has(form.id)) {
    cancelItemEdit(item_id);
    return;
  }

  const item = state.value.items.get(item_id);
  if (item) {
    // 如果ID發生了變化，需要刪除舊的並添加新的
    if (form.id !== item_id) {
      state.value.items.delete(item_id);
      state.value.items.set(form.id, item);
    }
    item.name = form.name;
    item.description = form.description;
    item.value = form.value;
    saveAndReloadState();
  }
  cancelItemEdit(item_id);
};

// 取消物品編輯
const cancelItemEdit = (item_id: string) => {
  editing_item_ids.value.delete(item_id);
  delete edit_forms.value[item_id];
};

// 刪除物品（顯示確認窗口）
const deleteItem = (item_id: string) => {
  const item = items.value.get(item_id);
  if (item) {
    item_to_delete.value = item_id;
    confirm_dialog.value = {
      visible: true,
      title: '確認刪除物品',
      message: `確定要刪除物品 "${item.name}" 嗎？此操作無法撤銷。`,
      confirmText: '刪除',
      cancelText: '取消',
    };
  }
};

// 確認刪除物品
const confirmDeleteItem = () => {
  if (item_to_delete.value && state.value) {
    state.value.items.delete(item_to_delete.value);
    saveAndReloadState();
  }
  confirm_dialog.value.visible = false;
  item_to_delete.value = null;
};

// 取消刪除物品
const cancelDeleteItem = () => {
  confirm_dialog.value.visible = false;
  item_to_delete.value = null;
};
</script>

<style lang="scss" scoped>
.item-tab-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.item-content {
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

.item-section {
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

.add-item-button {
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

.item-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
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

.new-item-row {
  background: #2a2a2a;
  border-color: #007acc;
  border-style: dashed;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.item-id-name-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.item-id {
  font-weight: 500;
  color: #007acc;
  font-size: 14px;
}

.item-name {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
}

.item-description {
  color: #a0a0a0;
  line-height: 1.4;
  font-size: 13px;
}

.item-value-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-value {
  font-weight: 600;
  color: #4caf50;
  font-size: 14px;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.edit-item-button,
.delete-item-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-item-button {
  background: #007acc;
  color: white;

  &:hover {
    background: #005a99;
  }
}

.delete-item-button {
  background: #f44336;
  color: white;

  &:hover {
    background: #da190b;
  }
}

.item-id-input,
.item-name-input,
.item-value-input {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 14px;
  padding: 4px 8px;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.item-id-input {
  font-weight: 500;
  color: #007acc;
  font-size: 14px;
  width: 50px;
  flex-shrink: 0;
  text-align: center;
}

.item-name-input {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
  flex: 1;
}

.item-value-input {
  font-weight: 600;
  color: #4caf50;
  font-size: 14px;
  width: 50px;
  text-align: left;
  outline: none;
}

.item-value-input-wrapper {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #4caf50;
  font-size: 14px;
}

.dollar-sign {
  margin-right: 2px;
}

.item-description-input {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 13px;
  padding: 6px 8px;
  resize: vertical;
  min-height: 60px;
  line-height: 1.4;

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

.no-items-message {
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
  .item-content {
    padding: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .item-row {
    padding: 10px 12px;
    gap: 6px;
  }

  .item-info {
    gap: 4px;
  }

  .item-name {
    font-size: 15px;
  }

  .item-description {
    font-size: 12px;
  }

  .item-actions {
    gap: 6px;
  }

  .edit-item-button,
  .delete-item-button {
    padding: 5px 10px;
    font-size: 11px;
  }

  .item-id-input,
  .item-name-input,
  .item-value-input {
    font-size: 13px;
    padding: 3px 6px;
  }

  .item-description-input {
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
