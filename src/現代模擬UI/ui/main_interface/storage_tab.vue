<template>
  <div class="storage-tab-container">
    <div class="storage-content">
      <!-- 貯存點列表標題 -->
      <div class="storage-section">
        <h3 class="section-title">貯存點列表</h3>
      </div>

      <!-- 貯存點列表 -->
      <div class="storage-list">
        <div
          v-for="[storage_id, storage] in storages"
          :id="`storage-${storage_id}`"
          :key="storage_id"
          class="storage-row"
        >
          <!-- 第一行：ID、名稱、操作按鈕 -->
          <div class="storage-first-row">
            <div class="storage-id-name-group">
              <div v-if="!editing_storage_ids.has(storage_id)" class="storage-id">{{ storage_id }}</div>
              <input v-else v-model="edit_forms[storage_id].id" class="storage-id-input" placeholder="貯存點ID" />
              <div v-if="!editing_storage_ids.has(storage_id)" class="storage-name">
                {{ storage.name }}
              </div>
              <input v-else v-model="edit_forms[storage_id].name" class="storage-name-input" placeholder="貯存點名稱" />
            </div>
            <div class="storage-actions">
              <button
                v-if="!editing_storage_ids.has(storage_id)"
                class="edit-storage-button"
                @click="startEditingStorage(storage_id)"
              >
                編輯
              </button>
              <button
                v-if="!editing_storage_ids.has(storage_id)"
                class="delete-storage-button"
                @click="deleteStorage(storage_id)"
              >
                刪除
              </button>
            </div>
          </div>

          <!-- 第二行：金錢 + 編輯按鈕 -->
          <div class="storage-money-row">
            <div class="storage-money-group">
              <span class="storage-money-label">貯存金額：</span>
              <div v-if="!editing_storage_ids.has(storage_id)" class="storage-money">${{ storage.money }}</div>
              <input
                v-else
                v-model.number="edit_forms[storage_id].money"
                type="number"
                class="storage-money-input storage-money-input-edit"
                placeholder="金錢數量"
                min="0"
                @input="
                  edit_forms[storage_id].money = Math.max(0, parseInt(($event.target as HTMLInputElement).value) || 0)
                "
              />
            </div>
            <div v-if="editing_storage_ids.has(storage_id)" class="storage-edit-actions">
              <button
                class="confirm-button"
                :disabled="
                  !edit_forms[storage_id].id || !edit_forms[storage_id].name || !edit_forms[storage_id].parent_id
                "
                @click="saveStorageEdit(storage_id)"
              >
                保存
              </button>
              <button class="cancel-button" @click="cancelStorageEdit(storage_id)">取消</button>
            </div>
          </div>

          <!-- 第三行：父級 -->
          <div v-if="!editing_storage_ids.has(storage_id)" class="storage-parent-display">
            <span class="storage-parent-tag">
              {{ storage.parent_id }}
              {{
                characters.get(storage.parent_id)?.name ||
                locations.get(storage.parent_id)?.name ||
                storages.get(storage.parent_id)?.name ||
                storage.parent_id
              }}
            </span>
          </div>
          <div v-else class="storage-parent-input-group">
            <select v-model="edit_forms[storage_id].parent_id" class="parent-select">
              <option value="" disabled>選擇父級 (角色、地點或貯存點)...</option>
              <optgroup label="角色">
                <option v-for="[id, character] in characters" :key="`char-${id}`" :value="id">
                  {{ character.name }} ({{ id }})
                </option>
              </optgroup>
              <optgroup label="地點">
                <option v-for="[id, location] in locations" :key="`loc-${id}`" :value="id">
                  {{ location.name }} ({{ id }})
                </option>
              </optgroup>
              <optgroup label="貯存點">
                <option
                  v-for="[id, storage_option] in storages"
                  :key="`storage-${id}`"
                  :value="id"
                  :disabled="id === storage_id"
                >
                  {{ storage_option.name }} ({{ id }})
                </option>
              </optgroup>
            </select>
          </div>

          <!-- 第四行：庫存 -->
          <div v-if="!editing_storage_ids.has(storage_id)" class="storage-inventory-display">
            <div v-if="storage.inventory.size === 0" class="no-inventory">無物品</div>
            <div v-else class="inventory-items">
              <span
                v-for="[item_id, quantity] in storage.inventory"
                :key="item_id"
                :class="storages.has(item_id) ? 'storage-item-tag' : 'inventory-item-tag'"
              >
                {{ items.get(item_id)?.name || storages.get(item_id)?.name || item_id }} ({{ item_id }}){{
                  storages.has(item_id) ? '' : ` × ${quantity}`
                }}
              </span>
            </div>
          </div>
          <div v-else class="storage-inventory-input-group">
            <div class="selected-inventory">
              <div
                v-for="item_id in Object.keys(edit_forms[storage_id].inventory)"
                :key="item_id"
                class="selected-inventory-item"
              >
                <span class="item-name">{{ items.get(item_id)?.name || storages.get(item_id)?.name || item_id }}</span>
                <span v-if="isStorage(item_id)" class="storage-indicator">貯存點</span>
                <span v-if="!isStorage(item_id)" class="inventory-edit-connector">×</span>
                <input
                  v-if="!isStorage(item_id)"
                  v-model.number="edit_forms[storage_id].inventory[item_id]"
                  type="number"
                  class="item-quantity-input"
                  placeholder="數量"
                  min="1"
                  step="1"
                  @input="
                    edit_forms[storage_id].inventory[item_id] = Math.max(
                      1,
                      parseInt(($event.target as HTMLInputElement).value) || 1,
                    )
                  "
                />
                <button class="remove-item-btn" @click="removeInventoryItem(edit_forms[storage_id], item_id)">×</button>
              </div>
            </div>
            <select
              class="item-select"
              @change="
                addInventoryItem(edit_forms[storage_id], ($event.target as HTMLSelectElement).value);
                ($event.target as HTMLSelectElement).value = '';
              "
            >
              <option value="">選擇物品或貯存點...</option>
              <optgroup label="物品">
                <option
                  v-for="[id, item] in items"
                  :key="id"
                  :value="id"
                  :disabled="edit_forms[storage_id].inventory.hasOwnProperty(id)"
                >
                  {{ item.name }} ({{ id }})
                </option>
              </optgroup>
              <optgroup label="貯存點">
                <option
                  v-for="[id, storage_opt] in storages"
                  :key="id"
                  :value="id"
                  :disabled="edit_forms[storage_id].inventory.hasOwnProperty(id) || id === storage_id"
                >
                  {{ storage_opt.name }} ({{ id }})
                </option>
              </optgroup>
            </select>
          </div>

          <!-- 第五行：描述 -->
          <div v-if="!editing_storage_ids.has(storage_id)" class="storage-description">{{ storage.description }}</div>
          <textarea
            v-else
            v-model="edit_forms[storage_id].description"
            class="storage-description-input"
            placeholder="貯存點描述"
          ></textarea>
        </div>
        <!-- 新貯存點編輯行 -->
        <div v-if="is_adding" class="storage-row new-storage-row">
          <!-- 第一行：ID、名稱 -->
          <div class="storage-first-row">
            <div class="storage-id-name-group">
              <input v-model="add_form.id" class="storage-id-input" placeholder="貯存點ID" />
              <input v-model="add_form.name" class="storage-name-input" placeholder="貯存點名稱" />
            </div>
          </div>

          <!-- 第二行：金錢 + 添加按鈕 -->
          <div class="storage-money-row">
            <div class="storage-money-group">
              <span class="storage-money-label">貯存金額：</span>
              <input
                v-model.number="add_form.money"
                type="number"
                class="storage-money-input storage-money-input-edit"
                placeholder="金錢數量"
                min="0"
                @input="add_form.money = Math.max(0, parseInt(($event.target as HTMLInputElement).value) || 0)"
              />
            </div>
            <div class="storage-edit-actions">
              <button
                class="confirm-button"
                :disabled="!add_form.id || !add_form.name || !add_form.parent_id"
                @click="addNewStorage"
              >
                添加
              </button>
              <button class="cancel-button" @click="cancelAddingStorage">取消</button>
            </div>
          </div>

          <!-- 第三行：父級 -->
          <div class="storage-parent-input-group">
            <select v-model="add_form.parent_id" class="parent-select">
              <option value="" disabled>選擇父級 (角色、地點或貯存點)...</option>
              <optgroup label="角色">
                <option v-for="[id, character] in characters" :key="`char-${id}`" :value="id">
                  {{ character.name }} ({{ id }})
                </option>
              </optgroup>
              <optgroup label="地點">
                <option v-for="[id, location] in locations" :key="`loc-${id}`" :value="id">
                  {{ location.name }} ({{ id }})
                </option>
              </optgroup>
              <optgroup label="貯存點">
                <option v-for="[id, storage] in storages" :key="`storage-${id}`" :value="id">
                  {{ storage.name }} ({{ id }})
                </option>
              </optgroup>
            </select>
          </div>

          <!-- 第四行：庫存 -->
          <div class="storage-inventory-input-group">
            <div class="selected-inventory">
              <div v-for="item_id in Object.keys(add_form.inventory)" :key="item_id" class="selected-inventory-item">
                <span class="item-name">{{ items.get(item_id)?.name || storages.get(item_id)?.name || item_id }}</span>
                <span v-if="isStorage(item_id)" class="storage-indicator">貯存點</span>
                <span v-if="!isStorage(item_id)" class="inventory-edit-connector">×</span>
                <input
                  v-if="!isStorage(item_id)"
                  v-model.number="add_form.inventory[item_id]"
                  type="number"
                  class="item-quantity-input"
                  placeholder="數量"
                  min="1"
                  step="1"
                  @input="
                    add_form.inventory[item_id] = Math.max(1, parseInt(($event.target as HTMLInputElement).value) || 1)
                  "
                />
                <button class="remove-item-btn" @click="removeInventoryItem(add_form, item_id)">×</button>
              </div>
            </div>
            <select
              class="item-select"
              @change="
                addInventoryItem(add_form, ($event.target as HTMLSelectElement).value);
                ($event.target as HTMLSelectElement).value = '';
              "
            >
              <option value="">選擇物品或貯存點...</option>
              <optgroup label="物品">
                <option
                  v-for="[id, item] in items"
                  :key="id"
                  :value="id"
                  :disabled="add_form.inventory.hasOwnProperty(id)"
                >
                  {{ item.name }} ({{ id }})
                </option>
              </optgroup>
              <optgroup label="貯存點">
                <option
                  v-for="[id, storage_opt] in storages"
                  :key="id"
                  :value="id"
                  :disabled="add_form.inventory.hasOwnProperty(id)"
                >
                  {{ storage_opt.name }} ({{ id }})
                </option>
              </optgroup>
            </select>
          </div>

          <!-- 第五行：描述 -->
          <textarea
            v-model="add_form.description"
            class="storage-description-input"
            placeholder="貯存點描述"
          ></textarea>
        </div>

        <div v-if="storages.size === 0 && !is_adding" class="no-storages-message">沒有任何貯存點</div>
        <button v-if="!is_adding" class="add-storage-button" @click="startAddingStorage">+ 添加貯存點</button>
      </div>

      <!-- 確認窗口 -->
      <ConfirmationWindow
        :confirm-dialog="confirm_dialog"
        @update:confirm-dialog="confirm_dialog = $event"
        @confirm-dialog-confirm="confirmDeleteStorage"
        @confirm-dialog-cancel="cancelDeleteStorage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { State } from '../../variable_logic/variables/state';
import { Storage } from '../../variable_logic/variables/storage';
import ConfirmationWindow from '../common_elements/confirmation_window.vue';

// 動態高度相關
const tab_navigation_height = ref(0); // 頂部標籤導航高度
const resize_observer = ref<ResizeObserver | null>(null);

// 動態計算貯存點內容的最大高度
const storage_content_max_height = computed(() => {
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

// 創建空的表單對象
const createEmptyForm = () => ({
  id: '',
  name: '',
  description: '',
  parent_id: '',
  money: 0,
  inventory: {} as Record<string, number>,
});

// 編輯模式
const is_adding = ref(false);
const editing_storage_ids = ref(new Set<string>());
const add_form = ref(createEmptyForm());
const edit_forms = ref<
  Record<
    string,
    {
      id: string;
      name: string;
      description: string;
      parent_id: string;
      money: number;
      inventory: Record<string, number>;
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
const storage_to_delete = ref<string | null>(null);

// 判斷物品是否為貯存點
const isStorage = (itemId: string) => {
  return state.value?.storages.has(itemId) || false;
};

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

const storages = computed(() => {
  return state.value?.storages || new Map();
});

const characters = computed(() => {
  return state.value?.active_characters || new Map();
});

const locations = computed(() => {
  return state.value?.locations || new Map();
});

const items = computed(() => {
  return state.value?.items || new Map();
});

// 開始添加貯存點
const startAddingStorage = () => {
  is_adding.value = true;
  add_form.value = createEmptyForm();
};

// 驗證和創建貯存點
const validateAndCreateStorage = (form: {
  id: string;
  name: string;
  description: string;
  parent_id: string;
  money: number;
  inventory: Record<string, number>;
}) => {
  if (!form.id || !form.name || !form.description || form.money < 0) {
    return null;
  }

  // 驗證 parent_id 是否存在（可以是 character、location 或 storage）
  const isValidParent =
    characters.value.has(form.parent_id) || locations.value.has(form.parent_id) || storages.value.has(form.parent_id);
  if (!isValidParent) {
    return null;
  }

  // 驗證 inventory 中的物品 ID 是否存在（可以是 item 或 storage）
  for (const item_id in form.inventory) {
    const isValidItem = items.value.has(item_id) || storages.value.has(item_id);
    const expectedQuantity = storages.value.has(item_id) ? 1 : form.inventory[item_id];
    if (!isValidItem || expectedQuantity < 1) {
      return null;
    }
  }

  try {
    const inventory = new Map<string, number>();
    for (const [item_id, quantity] of Object.entries(form.inventory)) {
      // 對於貯存點類型，數量始終為 1
      const finalQuantity = storages.value.has(item_id) ? 1 : quantity;
      inventory.set(item_id, finalQuantity);
    }

    return new Storage(form.name, form.description, form.parent_id, form.money, inventory);
  } catch (error) {
    console.error('Failed to create storage:', error);
    return null;
  }
};

// 添加新貯存點
const addNewStorage = () => {
  if (!state.value) return;

  // 檢查貯存點ID是否已經存在
  if (state.value.storages.has(add_form.value.id)) {
    cancelAddingStorage();
    return;
  }

  const new_storage = validateAndCreateStorage(add_form.value);
  if (new_storage) {
    state.value.storages.set(add_form.value.id, new_storage);
    saveAndReloadState();
    cancelAddingStorage();
  } else {
    cancelAddingStorage();
  }
};

// 取消添加貯存點
const cancelAddingStorage = () => {
  is_adding.value = false;
  add_form.value = createEmptyForm();
};

// 開始編輯貯存點
const startEditingStorage = (storage_id: string) => {
  const storage = storages.value.get(storage_id);
  if (storage) {
    editing_storage_ids.value.add(storage_id);
    edit_forms.value[storage_id] = {
      id: storage_id,
      name: storage.name,
      description: storage.description,
      parent_id: storage.parent_id,
      money: storage.money,
      inventory: Object.fromEntries(storage.inventory),
    };
  }
};

// 保存貯存點編輯
const saveStorageEdit = (storage_id: string) => {
  if (!state.value || !edit_forms.value[storage_id]) return;

  const form = edit_forms.value[storage_id];

  // 檢查貯存點ID是否已經存在（如果ID發生了變化）
  if (form.id !== storage_id && state.value.storages.has(form.id)) {
    cancelStorageEdit(storage_id);
    return;
  }

  const updated_storage = validateAndCreateStorage(form);
  if (updated_storage) {
    const existing_storage = state.value.storages.get(storage_id);
    if (existing_storage) {
      // 如果ID發生了變化，需要刪除舊的並添加新的
      if (form.id !== storage_id) {
        state.value.storages.delete(storage_id);
        state.value.storages.set(form.id, updated_storage);
      } else {
        // 更新現有貯存點的屬性
        existing_storage.name = updated_storage.name;
        existing_storage.description = updated_storage.description;
        existing_storage.parent_id = updated_storage.parent_id;
        existing_storage.money = updated_storage.money;
        existing_storage.inventory = updated_storage.inventory;
      }
      saveAndReloadState();
    }
    cancelStorageEdit(storage_id);
  } else {
    cancelStorageEdit(storage_id);
  }
};

// 取消貯存點編輯
const cancelStorageEdit = (storage_id: string) => {
  editing_storage_ids.value.delete(storage_id);
  delete edit_forms.value[storage_id];
};

// 刪除貯存點（顯示確認窗口）
const deleteStorage = (storage_id: string) => {
  const storage = storages.value.get(storage_id);
  if (storage) {
    storage_to_delete.value = storage_id;
    confirm_dialog.value = {
      visible: true,
      title: '確認刪除貯存點',
      message: `確定要刪除貯存點 "${storage.name}" 嗎？此操作無法撤銷。`,
      confirmText: '刪除',
      cancelText: '取消',
    };
  }
};

// 確認刪除貯存點
const confirmDeleteStorage = () => {
  if (storage_to_delete.value && state.value) {
    state.value.storages.delete(storage_to_delete.value);
    saveAndReloadState();
  }
  confirm_dialog.value.visible = false;
  storage_to_delete.value = null;
};

// 取消刪除貯存點
const cancelDeleteStorage = () => {
  confirm_dialog.value.visible = false;
  storage_to_delete.value = null;
};

// 處理庫存物品的添加和移除
const addInventoryItem = (form: { inventory: Record<string, number> }, item_id: string) => {
  if (!(item_id in form.inventory)) {
    form.inventory[item_id] = 1;
  }
};

const removeInventoryItem = (form: { inventory: Record<string, number> }, item_id: string) => {
  delete form.inventory[item_id];
};
</script>

<style lang="scss" scoped>
.storage-tab-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.storage-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: v-bind(storage_content_max_height);
  max-height: v-bind(storage_content_max_height);

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

.storage-section {
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

.add-storage-button {
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

.storage-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.storage-row {
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

.new-storage-row {
  background: #2a2a2a;
  border-color: #007acc;
  border-style: dashed;
}

.storage-first-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.storage-money-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.storage-money-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.storage-money-label {
  font-weight: 500;
  color: #a0a0a0;
  font-size: 16px;
  min-width: 40px;
}

.storage-edit-actions {
  display: flex;
  gap: 8px;
}

.storage-id-name-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.storage-id {
  font-weight: 500;
  color: #007acc;
  font-size: 14px;
}

.storage-name {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
}

.storage-money {
  font-weight: 500;
  color: rgb(76, 175, 80);
  font-size: 16px;
}

.storage-money-input {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
  width: 80px;
  flex-shrink: 0;
}

.storage-money-input-edit {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px 8px;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.storage-parent-display {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.storage-parent-tag {
  background: #007acc;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.storage-inventory-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.no-inventory {
  color: #888;
  font-style: italic;
  font-size: 13px;
}

.inventory-items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.inventory-item-tag {
  background: #4caf50;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.storage-item-tag {
  background: #ff9800;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.storage-description {
  color: #a0a0a0;
  line-height: 1.4;
  font-size: 13px;
}

.storage-actions {
  display: flex;
  gap: 8px;
}

.edit-storage-button,
.delete-storage-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-storage-button {
  background: #007acc;
  color: white;

  &:hover {
    background: #005a99;
  }
}

.delete-storage-button {
  background: #f44336;
  color: white;

  &:hover {
    background: #da190b;
  }
}

.storage-id-input,
.storage-name-input,
.storage-money-input,
.storage-description-input {
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

.storage-id-input {
  font-weight: 500;
  color: #007acc;
  font-size: 14px;
  width: 50px;
  flex-shrink: 0;
  text-align: center;
}

.storage-name-input {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
  width: 120px;
  flex-shrink: 0;
}

.storage-parent-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.storage-inventory-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selected-inventory {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.selected-inventory-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #333;
  padding: 4px 8px;
  border-radius: 4px;
}

.item-name {
  flex: 1;
  color: #e0e0e0;
  font-size: 13px;
}

.item-quantity-input {
  width: 60px;
  background: #444;
  border: 1px solid #555;
  border-radius: 3px;
  color: #e0e0e0;
  padding: 2px 4px;
  font-size: 12px;
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

.inventory-edit-connector {
  color: #888888;
  font-weight: 400;
  font-size: 14px;
  white-space: nowrap;
}

.storage-indicator {
  font-weight: 600;
  color: #ffffff;
  background: #4caf50;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.remove-item-btn {
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  margin-left: 4px;

  &:hover {
    color: #da190b;
  }
}

.parent-select,
.item-select {
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

.storage-description-input {
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
    background: #666;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.cancel-button {
  background: #f44336;
  color: white;

  &:hover {
    background: #da190b;
  }
}

.no-storages-message {
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
  .storage-content {
    padding: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .storage-row {
    padding: 10px 12px;
    gap: 6px;
  }

  .storage-first-row {
    gap: 8px;
  }

  .storage-money-row {
    gap: 6px;
    margin-top: 4px;
  }

  .storage-money-group {
    gap: 6px;
  }

  .storage-money-label {
    font-size: 15px;
    min-width: 35px;
  }

  .storage-name {
    font-size: 15px;
  }

  .storage-money {
    font-size: 15px;
  }

  .storage-money-input {
    font-size: 15px;
    width: 70px;
  }

  .storage-edit-actions {
    gap: 6px;
  }

  .storage-description {
    font-size: 12px;
  }

  .storage-actions {
    gap: 6px;
  }

  .edit-storage-button,
  .delete-storage-button {
    padding: 5px 10px;
    font-size: 11px;
  }

  .storage-id-input,
  .storage-name-input,
  .storage-money-input {
    font-size: 13px;
    padding: 3px 6px;
  }

  .storage-id-input {
    width: 40px;
  }

  .storage-name-input {
    width: 100px;
  }

  .parent-select,
  .item-select {
    font-size: 12px;
    padding: 3px 6px;
  }

  .selected-inventory-item {
    padding: 3px 6px;
  }

  .item-name {
    font-size: 12px;
  }

  .item-quantity-input {
    width: 50px;
    font-size: 11px;
    padding: 2px 3px;
  }

  .inventory-item-tag,
  .storage-parent-tag {
    font-size: 12px;
    padding: 2px 6px;
  }

  .storage-description-input {
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
