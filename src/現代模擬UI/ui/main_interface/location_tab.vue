<template>
  <div class="location-tab-container">
    <div class="location-content">
      <!-- 地點列表標題 -->
      <div class="location-section">
        <h3 class="section-title">地點列表</h3>
      </div>

      <!-- 地點列表 -->
      <div class="location-list">
        <div v-for="[location_id, location] in locations" :key="location_id" :id="`location-${location_id}`" class="location-row">
          <!-- 第一行：ID、名稱、操作按鈕 -->
          <div class="location-first-row">
            <div class="location-id-name-group">
              <div v-if="!editing_location_ids.has(location_id)" class="location-id">{{ location_id }}</div>
              <input v-else v-model="edit_forms[location_id].id" class="location-id-input" placeholder="地點ID" />
              <div v-if="!editing_location_ids.has(location_id)" class="location-name">
                {{ location.name }}
              </div>
              <input
                v-else
                v-model="edit_forms[location_id].name"
                class="location-name-input"
                placeholder="地點名稱"
              />
            </div>
            <div class="location-actions">
              <button
                v-if="!editing_location_ids.has(location_id)"
                class="edit-location-button"
                @click="startEditingLocation(location_id)"
              >
                編輯
              </button>
              <button
                v-if="!editing_location_ids.has(location_id)"
                class="delete-location-button"
                @click="deleteLocation(location_id)"
              >
                刪除
              </button>
            </div>
          </div>

          <!-- 第二行：位置 + 編輯按鈕 -->
          <div class="location-location-row">
            <div class="location-location-group">
              <span class="location-location-label">位置：</span>
              <div v-if="!editing_location_ids.has(location_id)" class="location-location">{{ location.location }}</div>
              <input
                v-else
                v-model="edit_forms[location_id].location"
                class="location-location-input location-location-input-edit"
                placeholder="地點位置"
              />
            </div>
            <div v-if="editing_location_ids.has(location_id)" class="location-edit-actions">
              <button class="confirm-button" @click="saveLocationEdit(location_id)">保存</button>
              <button class="cancel-button" @click="cancelLocationEdit(location_id)">取消</button>
            </div>
          </div>

          <!-- 第三行：父地點 -->
          <div v-if="!editing_location_ids.has(location_id)" class="location-parent-display">
            <span v-if="location.parent_location_id" class="location-parent-tag" @click="jumpToLocation(location.parent_location_id)">
              父: {{ location.parent_location_id }} {{ locations.get(location.parent_location_id)?.name || location.parent_location_id }}
            </span>
            <span v-else class="location-parent-tag">根地點</span>
          </div>
          <div v-else class="location-parent-input-group">
            <select
              class="parent-location-select"
              v-model="edit_forms[location_id].parent_location_id"
            >
              <option :value="null">根地點</option>
              <option
                v-for="[id, loc] in locations"
                :key="id"
                :value="id"
                :disabled="id === location_id || wouldCreateCycle(location_id, id)"
              >
                {{ loc.name }} ({{ id }})
              </option>
            </select>
          </div>

          <!-- 第四行：子地點 -->
          <div v-if="!editing_location_ids.has(location_id)" class="location-children-display">
            <span v-for="child_id in location.sub_location_ids" :key="child_id" class="location-child-tag" @click="jumpToLocation(child_id)">
              子: {{ child_id }} {{ locations.get(child_id)?.name || child_id }}
            </span>
          </div>
          <div v-else class="location-children-input-group">
            <div class="selected-children">
              <span
                v-for="child_id in edit_forms[location_id].sub_location_ids"
                :key="child_id"
                class="selected-child-tag"
              >
                {{ locations.get(child_id)?.name || child_id }}
                <button class="remove-child-btn" @click="removeChildLocation(edit_forms[location_id], child_id)">
                  ×
                </button>
              </span>
            </div>
            <select
              class="child-location-select"
              @change="
                addChildLocation(edit_forms[location_id], ($event.target as HTMLSelectElement).value);
                ($event.target as HTMLSelectElement).value = '';
              "
            >
              <option value="">選擇子地點...</option>
              <option
                v-for="[id, loc] in locations"
                :key="id"
                :value="id"
                :disabled="edit_forms[location_id].sub_location_ids.includes(id) || id === location_id || wouldCreateCycle(id, location_id)"
              >
                {{ loc.name }} ({{ id }})
              </option>
            </select>
          </div>

          <!-- 第五行：描述 -->
          <div v-if="!editing_location_ids.has(location_id)" class="location-description">{{ location.description }}</div>
          <textarea
            v-else
            v-model="edit_forms[location_id].description"
            class="location-description-input"
            placeholder="地點描述"
          ></textarea>
        </div>
        <!-- 新地點編輯行 -->
        <div v-if="is_adding" class="location-row new-location-row">
          <!-- 第一行：ID、名稱 -->
          <div class="location-first-row">
            <div class="location-id-name-group">
              <input v-model="add_form.id" class="location-id-input" placeholder="地點ID" />
              <input v-model="add_form.name" class="location-name-input" placeholder="地點名稱" />
            </div>
          </div>

          <!-- 第二行：位置 + 添加按鈕 -->
          <div class="location-location-row">
            <div class="location-location-group">
              <span class="location-location-label">位置：</span>
              <input
                v-model="add_form.location"
                class="location-location-input location-location-input-edit"
                placeholder="地點位置"
              />
            </div>
            <div class="location-edit-actions">
              <button class="confirm-button" @click="addNewLocation">添加</button>
              <button class="cancel-button" @click="cancelAddingLocation">取消</button>
            </div>
          </div>

          <!-- 第三行：父地點 -->
          <div class="location-parent-input-group">
            <select
              class="parent-location-select"
              v-model="add_form.parent_location_id"
            >
              <option :value="null">根地點</option>
              <option
                v-for="[id, loc] in locations"
                :key="id"
                :value="id"
              >
                {{ loc.name }} ({{ id }})
              </option>
            </select>
          </div>

          <!-- 第四行：子地點 -->
          <div class="location-children-input-group">
            <div class="selected-children">
              <span v-for="child_id in add_form.sub_location_ids" :key="child_id" class="selected-child-tag">
                {{ locations.get(child_id)?.name || child_id }}
                <button class="remove-child-btn" @click="removeChildLocation(add_form, child_id)">×</button>
              </span>
            </div>
            <select
              class="child-location-select"
              @change="
                addChildLocation(add_form, ($event.target as HTMLSelectElement).value);
                ($event.target as HTMLSelectElement).value = '';
              "
            >
              <option value="">選擇子地點...</option>
              <option
                v-for="[id, loc] in locations"
                :key="id"
                :value="id"
                :disabled="add_form.sub_location_ids.includes(id) || id === add_form.id"
              >
                {{ loc.name }} ({{ id }})
              </option>
            </select>
          </div>

          <!-- 第五行：描述 -->
          <textarea v-model="add_form.description" class="location-description-input" placeholder="地點描述"></textarea>
        </div>

        <div v-if="locations.size === 0 && !is_adding" class="no-locations-message">沒有任何地點</div>
        <button v-if="!is_adding" class="add-location-button" @click="startAddingLocation">+ 添加地點</button>
      </div>

      <!-- 確認窗口 -->
      <ConfirmationWindow
        :confirm-dialog="confirm_dialog"
        @update:confirm-dialog="confirm_dialog = $event"
        @confirm-dialog-confirm="confirmDeleteLocation"
        @confirm-dialog-cancel="cancelDeleteLocation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { Location } from '../../variable_logic/variables/location';
import { State } from '../../variable_logic/variables/state';
import ConfirmationWindow from '../common_elements/confirmation_window.vue';

// 動態高度相關
const tab_navigation_height = ref(0); // 頂部標籤導航高度
const resize_observer = ref<ResizeObserver | null>(null);

// 動態計算地點內容的最大高度
const location_content_max_height = computed(() => {
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
  location: '',
  description: '',
  parent_location_id: null as string | null,
  sub_location_ids: [] as string[],
});

// 編輯模式
const is_adding = ref(false);
const editing_location_ids = ref(new Set<string>());
const add_form = ref(createEmptyForm());
const edit_forms = ref<
  Record<
    string,
    {
      id: string;
      name: string;
      location: string;
      description: string;
      parent_location_id: string | null;
      sub_location_ids: string[];
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
const location_to_delete = ref<string | null>(null);

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

const locations = computed(() => {
  return state.value?.locations || new Map();
});

// 生成下一個可用的地點ID
const generateNextLocationId = () => {
  const existing_ids = Array.from(locations.value.keys());
  let counter = 1;
  while (existing_ids.includes(`l${counter}`)) {
    counter++;
  }
  return `l${counter}`;
};

// 檢查是否會創建循環引用
const wouldCreateCycle = (child_id: string, potential_parent_id: string): boolean => {
  let current_id = potential_parent_id;
  const visited = new Set<string>();

  while (current_id) {
    if (visited.has(current_id)) return true; // 檢測到循環
    if (current_id === child_id) return true; // 會創建循環

    visited.add(current_id);
    const current_location = locations.value.get(current_id);
    current_id = current_location?.parent_location_id || null;
  }

  return false;
};

// 開始添加地點
const startAddingLocation = () => {
  is_adding.value = true;
  add_form.value = createEmptyForm();
  add_form.value.id = generateNextLocationId();
};

// 驗證和創建地點
const validateAndCreateLocation = (form: {
  id: string;
  name: string;
  location: string;
  description: string;
  parent_location_id: string | null;
  sub_location_ids: string[];
}) => {
  if (!form.id || !form.name || !form.location || !form.description) {
    return null;
  }

  try {
    return new Location(form.id, form.name, form.location, form.description, form.parent_location_id, form.sub_location_ids);
  } catch (error) {
    console.error('Failed to create location:', error);
    return null;
  }
};

// 添加新地點
const addNewLocation = () => {
  if (!state.value) return;

  // 檢查地點ID是否已經存在
  if (state.value.locations.has(add_form.value.id)) {
    cancelAddingLocation();
    return;
  }

  const new_location = validateAndCreateLocation(add_form.value);
  if (new_location) {
    state.value.locations.set(add_form.value.id, new_location);
    saveAndReloadState();
    cancelAddingLocation();
  } else {
    cancelAddingLocation();
  }
};

// 取消添加地點
const cancelAddingLocation = () => {
  is_adding.value = false;
  add_form.value = createEmptyForm();
};

// 開始編輯地點
const startEditingLocation = (location_id: string) => {
  const location = locations.value.get(location_id);
  if (location) {
    editing_location_ids.value.add(location_id);
    edit_forms.value[location_id] = {
      id: location_id,
      name: location.name,
      location: location.location,
      description: location.description,
      parent_location_id: location.parent_location_id,
      sub_location_ids: [...location.sub_location_ids],
    };
  }
};

// 保存地點編輯
const saveLocationEdit = (location_id: string) => {
  if (!state.value || !edit_forms.value[location_id]) return;

  const form = edit_forms.value[location_id];

  // 檢查地點ID是否已經存在（如果ID發生了變化）
  if (form.id !== location_id && state.value.locations.has(form.id)) {
    cancelLocationEdit(location_id);
    return;
  }

  const updated_location = validateAndCreateLocation(form);
  if (updated_location) {
    const existing_location = state.value.locations.get(location_id);
    if (existing_location) {
      // 如果ID發生了變化，需要刪除舊的並添加新的
      if (form.id !== location_id) {
        state.value.locations.delete(location_id);
        state.value.locations.set(form.id, updated_location);
      } else {
        // 更新現有地點的屬性
        existing_location.name = updated_location.name;
        existing_location.location = updated_location.location;
        existing_location.description = updated_location.description;
        existing_location.parent_location_id = updated_location.parent_location_id;
        existing_location.sub_location_ids = updated_location.sub_location_ids;
      }
      saveAndReloadState();
    }
    cancelLocationEdit(location_id);
  } else {
    cancelLocationEdit(location_id);
  }
};

// 取消地點編輯
const cancelLocationEdit = (location_id: string) => {
  editing_location_ids.value.delete(location_id);
  delete edit_forms.value[location_id];
};

// 刪除地點（顯示確認窗口）
const deleteLocation = (location_id: string) => {
  const location = locations.value.get(location_id);
  if (location) {
    location_to_delete.value = location_id;
    confirm_dialog.value = {
      visible: true,
      title: '確認刪除地點',
      message: `確定要刪除地點 "${location.name}" 嗎？此操作無法撤銷。`,
      confirmText: '刪除',
      cancelText: '取消',
    };
  }
};

// 確認刪除地點
const confirmDeleteLocation = () => {
  if (location_to_delete.value && state.value) {
    state.value.locations.delete(location_to_delete.value);
    saveAndReloadState();
  }
  confirm_dialog.value.visible = false;
  location_to_delete.value = null;
};

// 取消刪除地點
const cancelDeleteLocation = () => {
  confirm_dialog.value.visible = false;
  location_to_delete.value = null;
};

// 處理子地點的添加和移除
const addChildLocation = (form: { sub_location_ids: string[] }, child_id: string) => {
  if (!form.sub_location_ids.includes(child_id)) {
    form.sub_location_ids.push(child_id);
  }
};

const removeChildLocation = (form: { sub_location_ids: string[] }, child_id: string) => {
  const index = form.sub_location_ids.indexOf(child_id);
  if (index > -1) {
    form.sub_location_ids.splice(index, 1);
  }
};

// 跳轉到指定地點
const jumpToLocation = (location_id: string) => {
  const element = document.getElementById(`location-${location_id}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<style lang="scss" scoped>
.location-tab-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.location-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: v-bind(location_content_max_height);
  max-height: v-bind(location_content_max_height);

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

.location-section {
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

.add-location-button {
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

.location-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.location-row {
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

.new-location-row {
  background: #2a2a2a;
  border-color: #007acc;
  border-style: dashed;
}

.location-first-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.location-location-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.location-location-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-location-label {
  font-weight: 500;
  color: #a0a0a0;
  font-size: 13px;
  min-width: 40px;
}

.location-edit-actions {
  display: flex;
  gap: 8px;
}

.location-id-name-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.location-id {
  font-weight: 500;
  color: #007acc;
  font-size: 14px;
}

.location-name {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
}

.location-location {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
}

.location-location-input {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
  width: 35px;
  flex-shrink: 0;
}

.location-location-input-edit {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px 8px;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.location-parent-display {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.location-parent-tag {
  background: #007acc;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.location-children-display {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.location-child-tag {
  background: #4caf50;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.location-description {
  color: #a0a0a0;
  line-height: 1.4;
  font-size: 13px;
}

.location-actions {
  display: flex;
  gap: 8px;
}

.edit-location-button,
.delete-location-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-location-button {
  background: #007acc;
  color: white;

  &:hover {
    background: #005a99;
  }
}

.delete-location-button {
  background: #f44336;
  color: white;

  &:hover {
    background: #da190b;
  }
}

.location-id-input,
.location-name-input,
.location-location-input,
.location-description-input {
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
    appearance: textfield;
  }
}

.location-id-input {
  font-weight: 500;
  color: #007acc;
  font-size: 14px;
  width: 50px;
  flex-shrink: 0;
  text-align: center;
}

.location-name-input {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
  width: 120px;
  flex-shrink: 0;
}

.location-parent-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.location-children-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selected-children {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.selected-child-tag {
  background: #4caf50;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.remove-child-btn {
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

.parent-location-select,
.child-location-select {
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

.location-description-input {
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

.no-locations-message {
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
  .location-content {
    padding: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .location-row {
    padding: 10px 12px;
    gap: 6px;
  }

  .location-first-row {
    gap: 8px;
  }

  .location-location-row {
    gap: 6px;
    margin-top: 4px;
  }

  .location-location-group {
    gap: 6px;
  }

  .location-location-label {
    font-size: 12px;
    min-width: 35px;
  }

  .location-name {
    font-size: 15px;
  }

  .location-location {
    font-size: 15px;
  }

  .location-location-input {
    font-size: 15px;
    width: 100px;
  }

  .location-edit-actions {
    gap: 6px;
  }

  .location-description {
    font-size: 12px;
  }

  .location-actions {
    gap: 6px;
  }

  .edit-location-button,
  .delete-location-button {
    padding: 5px 10px;
    font-size: 11px;
  }

  .location-id-input,
  .location-name-input,
  .location-location-input {
    font-size: 13px;
    padding: 3px 6px;
  }

  .location-id-input {
    width: 40px;
  }

  .location-name-input {
    width: 100px;
  }

  .parent-location-select,
  .child-location-select {
    font-size: 12px;
    padding: 3px 6px;
  }

  .selected-child-tag,
  .location-child-tag,
  .location-parent-tag {
    font-size: 12px;
    padding: 2px 6px;
  }

  .location-description-input {
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
