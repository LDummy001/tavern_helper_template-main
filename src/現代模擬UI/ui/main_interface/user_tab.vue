<template>
  <div class="user-tab-container">
    <div ref="userContentRef" class="user-content">
      <!-- 用戶名稱標題 -->
      <div class="user-header">
        <h1 class="user-name">{{ user_character?.name || 'N/A' }}</h1>
        <button v-if="!is_editing" class="edit-button" @click="startEditing">編輯</button>
      </div>

      <!-- 所有屬性統一顯示 -->
      <div class="attributes-grid">
        <!-- 基本信息 -->
        <div class="attribute-item horizontal">
          <span class="attribute-label">ID</span>
          <span class="attribute-value">{{ user_character ? 'c1' : 'N/A' }}</span>
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label">性別</span>
          <span v-if="!is_editing" class="attribute-value">{{ user_character?.gender || 'N/A' }}</span>
          <input v-else v-model="edited_character.性別" class="attribute-input" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label">年齡</span>
          <span v-if="!is_editing" class="attribute-value">{{ user_character?.age || 'N/A' }}</span>
          <input v-else v-model.number="edited_character.年齡" class="attribute-input" type="number" />
        </div>

        <!-- 身體測量 -->
        <div class="attribute-item horizontal">
          <span class="attribute-label unit-label">身高 (cm)</span>
          <span v-if="!is_editing" class="attribute-value">{{ user_character?.height || 'N/A' }}</span>
          <input v-else v-model.number="edited_character.身高" class="attribute-input" type="number" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label unit-label">體重 (kg)</span>
          <span v-if="!is_editing" class="attribute-value">{{ user_character?.weight || 'N/A' }}</span>
          <input v-else v-model.number="edited_character.體重" class="attribute-input" type="number" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label unit-label">胸圍 (cm)</span>
          <span v-if="!is_editing" class="attribute-value">{{ user_character?.chest_size || 'N/A' }}</span>
          <input v-else v-model.number="edited_character.胸圍" class="attribute-input" type="number" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label">罩杯</span>
          <span v-if="!is_editing" class="attribute-value">{{ user_character?.cup_size || '不適用' }}</span>
          <input v-else v-model="edited_character.罩杯" class="attribute-input" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label unit-label">腰圍 (cm)</span>
          <span v-if="!is_editing" class="attribute-value">{{ user_character?.waist_size || 'N/A' }}</span>
          <input v-else v-model.number="edited_character.腰圍" class="attribute-input" type="number" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label unit-label">臀圍 (cm)</span>
          <span v-if="!is_editing" class="attribute-value">{{ user_character?.hips_size || 'N/A' }}</span>
          <input v-else v-model.number="edited_character.臀圍" class="attribute-input" type="number" />
        </div>

        <!-- 金錢 -->
        <div class="attribute-item full-width horizontal">
          <span class="attribute-label">金錢</span>
          <span v-if="!is_editing" class="attribute-value money">{{ formatMoney(user_character?.money) }}</span>
          <input v-else v-model.number="edited_character.金錢" class="attribute-input" type="number" />
        </div>

        <!-- 生日 -->
        <div class="attribute-item full-width birthday-fullwidth">
          <span class="attribute-label">生日</span>
          <span v-if="!is_editing" class="attribute-value">{{ formatBirthday(user_character?.birthday) }}</span>
          <div v-else class="birthday-edit-container">
            <div class="birthday-input-group">
              <input
                v-model.number="edited_character.生日.month"
                class="attribute-input birthday-month"
                type="number"
                placeholder="月"
                min="1"
                max="12"
              />
              <span class="birthday-separator">月</span>
              <input
                v-model.number="edited_character.生日.date"
                class="attribute-input birthday-date"
                type="number"
                placeholder="日"
                min="1"
                max="31"
              />
              <span class="birthday-separator">日</span>
            </div>
          </div>
        </div>

        <!-- 外貌特徵 -->
        <div class="attribute-item full-width">
          <span class="attribute-label">身份</span>
          <span v-if="!is_editing" class="attribute-value no-bold">{{ user_character?.identity || 'N/A' }}</span>
          <textarea v-else v-model="edited_character.身份" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">髮型</span>
          <span v-if="!is_editing" class="attribute-value no-bold">{{ user_character?.hairstyle || 'N/A' }}</span>
          <textarea v-else v-model="edited_character.髮型" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">樣貌</span>
          <span v-if="!is_editing" class="attribute-value no-bold">{{ user_character?.appearance || 'N/A' }}</span>
          <textarea v-else v-model="edited_character.樣貌" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">衣著</span>
          <span v-if="!is_editing" class="attribute-value no-bold">{{ user_character?.clothes || 'N/A' }}</span>
          <textarea v-else v-model="edited_character.衣著" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">愛好</span>
          <span v-if="!is_editing" class="attribute-value no-bold">{{ user_character?.favourite || 'N/A' }}</span>
          <textarea v-else v-model="edited_character.愛好" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">簡介</span>
          <span v-if="!is_editing" class="attribute-value no-bold">{{ user_character?.introduction || 'N/A' }}</span>
          <textarea v-else v-model="edited_character.簡介" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">性格</span>
          <span v-if="!is_editing" class="attribute-value no-bold">{{ user_character?.personality || 'N/A' }}</span>
          <textarea v-else v-model="edited_character.性格" class="attribute-textarea"></textarea>
        </div>
        <div v-if="user_character?.extra_information || is_editing" class="attribute-item full-width">
          <span class="attribute-label">其他重要資訊</span>
          <span v-if="!is_editing" class="attribute-value no-bold">{{
            user_character?.extra_information || 'N/A'
          }}</span>
          <textarea v-else v-model="edited_character.其他重要資訊" class="attribute-textarea"></textarea>
        </div>
      </div>

      <!-- 關係和物品 -->
      <div class="relations-section">
        <h3 class="section-title">關係</h3>
        <div v-if="!is_editing" class="relations-list">
          <div
            v-for="[characterId, relation] in user_character?.relations || []"
            :key="characterId"
            class="relation-item"
          >
            <span class="relation-highlight"
              >{{ state?.getCharacter(characterId)?.name || '未知' }} ({{ characterId }})</span
            >
            <span class="relation-connector"> 是此角色的 </span><span class="relation-highlight">{{ relation }}</span>
          </div>
          <div v-if="!user_character?.relations || user_character.relations.size === 0" class="no-relations-message">
            沒有任何關係
          </div>
        </div>
        <div v-else class="relations-edit-list">
          <div v-for="(_, characterId) in edited_relations" :key="characterId" class="relation-edit-item">
            <select
              :value="characterId"
              class="relation-select"
              @change="e => updateRelationCharacter(String(characterId), (e.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>選擇角色</option>
              <option v-for="char in available_characters" :key="char.id" :value="char.id">
                {{ char.name }} ({{ char.id }})
              </option>
            </select>
            <span class="relation-edit-connector"> 是此角色的 </span>
            <input v-model="edited_relations[characterId]" class="relation-input" placeholder="關係" />
            <button class="relation-remove-btn" @click="removeRelation(String(characterId))">×</button>
          </div>
          <button class="add-relation-btn" @click="addRelation">+ 添加關係</button>
        </div>
      </div>

      <div class="inventory-section">
        <h3 class="section-title">所持物</h3>
        <div v-if="!is_editing" class="inventory-list">
          <div
            v-for="[itemId, quantity] in user_character?.inventory || []"
            :key="itemId"
            class="inventory-item"
            :class="{ 'storage-item': isStorage(itemId) }"
          >
            <div class="inventory-first-row">
              <span class="item-name-id">{{ getInventoryItemName(itemId) }} ({{ itemId }})</span>
              <span v-if="!isStorage(itemId)" class="item-quantity">× {{ quantity }}</span>
              <span v-else class="storage-indicator">貯存點</span>
            </div>
            <div class="inventory-second-row">
              {{ getInventoryItemDescription(itemId) }}
            </div>
            <div v-if="isStorage(itemId)" class="inventory-third-row">
              <div v-if="getStorageInventorySize(itemId) === 0" class="no-inventory">無物品</div>
              <div v-else class="inventory-items">
                <span
                  v-for="[storage_item_id, storage_quantity] in getStorageInventory(itemId)"
                  :key="storage_item_id"
                  :class="state?.storages.has(storage_item_id) ? 'storage-item-tag' : 'inventory-item-tag'"
                >
                  {{ getInventoryItemName(storage_item_id) }} ({{ storage_item_id }}){{
                    state?.storages.has(storage_item_id) ? '' : ` × ${storage_quantity}`
                  }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="!user_character?.inventory || user_character.inventory.size === 0" class="no-inventory-message">
            沒有任何物品
          </div>
        </div>
        <div v-else class="inventory-edit-list">
          <div v-for="(_, itemId) in edited_inventory" :key="itemId" class="inventory-edit-item">
            <select
              :value="itemId"
              class="inventory-select"
              @change="e => updateInventoryItem(String(itemId), (e.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>選擇物品或貯存點...</option>
              <optgroup label="物品">
                <option v-for="item in available_items.filter(i => i.type === 'item')" :key="item.id" :value="item.id">
                  {{ item.name }} ({{ item.id }})
                </option>
              </optgroup>
              <optgroup label="貯存點">
                <option
                  v-for="item in available_items.filter(i => i.type === 'storage')"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }} ({{ item.id }})
                </option>
              </optgroup>
            </select>
            <span v-if="!isStorage(String(itemId))" class="inventory-edit-connector">×</span>
            <input
              v-if="!isStorage(String(itemId))"
              v-model.number="edited_inventory[itemId]"
              class="inventory-quantity-input"
              type="number"
              min="0"
              placeholder="數量"
            />
            <button class="inventory-remove-btn" @click="removeInventoryItem(String(itemId))">×</button>
          </div>
          <button class="add-inventory-btn" @click="addInventoryItem">+ 添加物品或貯存點</button>
        </div>
      </div>

      <!-- 編輯按鈕 -->
      <div v-if="is_editing" class="edit-buttons">
        <button class="confirm-button" @click="confirmEditing">確認</button>
        <button class="cancel-button" @click="cancelEditing">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { klona } from 'klona';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { Character } from '../../variable_logic/variables/character';
import { State } from '../../variable_logic/variables/state';

// 編輯模式
const is_editing = ref(false);
const edited_character = ref<any>(null);

// 動態高度相關
const tab_navigation_height = ref(0); // 頂部標籤導航高度
const resize_observer = ref<ResizeObserver | null>(null);

// 動態計算用戶內容的最大高度
const user_content_max_height = computed(() => {
  return `calc(100vh - ${tab_navigation_height.value}px)`;
});

// 編輯關係的響應式數據
const edited_relations = computed({
  get: () => edited_character.value?.關係 || {},
  set: (value: any) => {
    if (edited_character.value) {
      edited_character.value.關係 = value;
    }
  },
});

// 編輯物品的響應式數據
const edited_inventory = computed({
  get: () => edited_character.value?.所持物 || {},
  set: (value: any) => {
    if (edited_character.value) {
      edited_character.value.所持物 = value;
    }
  },
});

// 獲取所有可用角色列表（排除用戶自己）
const available_characters = computed(() => {
  if (!state.value) return [];
  const characters = [];
  for (const [id, character] of state.value.active_characters) {
    if (id !== 'c1') {
      // 排除用戶自己
      characters.push({ id, name: character.name });
    }
  }
  for (const [id, character] of state.value.deactive_characters) {
    characters.push({ id, name: character.name });
  }
  return characters;
});

// 獲取所有可用物品列表
const available_items = computed(() => {
  if (!state.value) return [];
  const items = [];
  for (const [id, item] of state.value.items) {
    items.push({ id, name: item.name, type: 'item' });
  }
  for (const [id, storage] of state.value.storages) {
    items.push({ id, name: storage.name, type: 'storage' });
  }
  return items;
});

// 獲取物品名稱（支持 item 和 storage）
const getInventoryItemName = (itemId: string) => {
  if (!state.value) return '未知';
  const item = state.value.items.get(itemId);
  if (item) return item.name;
  const storage = state.value.storages.get(itemId);
  if (storage) return storage.name;
  return '未知';
};

// 判斷物品是否為貯存點
const isStorage = (itemId: string) => {
  return state.value?.storages.has(itemId) || false;
};

// 獲取貯存點的庫存大小
const getStorageInventorySize = (storageId: string) => {
  const storage = state.value?.storages.get(storageId);
  return storage?.inventory.size || 0;
};

// 獲取貯存點的庫存項目
const getStorageInventory = (storageId: string) => {
  const storage = state.value?.storages.get(storageId);
  return storage?.inventory || new Map();
};

// 獲取物品描述（支持 item 和 storage）
const getInventoryItemDescription = (itemId: string) => {
  if (!state.value) return '無描述';
  const item = state.value.items.get(itemId);
  if (item) return item.description;
  const storage = state.value.storages.get(itemId);
  if (storage) {
    return storage.description;
  }
  return '無描述';
};

// 移除關係
const removeRelation = (characterId: string) => {
  if (edited_character.value?.關係) {
    delete edited_character.value.關係[characterId];
  }
};

// 添加關係
const addRelation = () => {
  if (edited_character.value?.關係) {
    // 使用空字符串作為鍵來表示新添加的項目，這樣下拉列表會顯示占位符
    edited_character.value.關係[''] = '';
  }
};

// 移除物品
const removeInventoryItem = (itemId: string) => {
  if (edited_character.value?.所持物) {
    delete edited_character.value.所持物[itemId];
  }
};

// 添加物品
const addInventoryItem = () => {
  if (edited_character.value?.所持物) {
    // 使用空字符串作為鍵來表示新添加的項目，這樣下拉列表會顯示占位符
    // 對於 storage 類型，數量始終為 1
    edited_character.value.所持物[''] = 1;
  }
};

// 更新關係中的角色ID
const updateRelationCharacter = (oldCharacterId: string, newCharacterId: string) => {
  if (edited_character.value?.關係 && oldCharacterId !== newCharacterId) {
    const relation = edited_character.value.關係[oldCharacterId];
    delete edited_character.value.關係[oldCharacterId];
    if (newCharacterId) {
      edited_character.value.關係[newCharacterId] = relation;
    }
  }
};

// 更新物品中的物品ID
const updateInventoryItem = (oldItemId: string, newItemId: string) => {
  if (edited_character.value?.所持物 && oldItemId !== newItemId) {
    const quantity = edited_character.value.所持物[oldItemId];
    delete edited_character.value.所持物[oldItemId];
    if (newItemId) {
      edited_character.value.所持物[newItemId] = quantity;
    }
  }
};

// 獲取狀態和用戶角色
const state = ref<State | null>(null);

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

const user_character = computed(() => {
  return state.value?.getCharacter('c1') || null;
});

// 格式化生日
const formatBirthday = (birthday: any) => {
  if (!birthday) return 'N/A';
  return `${birthday.month}月${birthday.date}日`;
};

// 格式化金錢
const formatMoney = (money: number | undefined) => {
  if (money === undefined) return 'N/A';
  return `$${money.toLocaleString()}`;
};

// 編輯功能
const startEditing = () => {
  if (user_character.value) {
    edited_character.value = klona(user_character.value.toRecord());
    // 將Map轉換為object以便編輯
    edited_character.value.關係 = Object.fromEntries(user_character.value.relations);
    edited_character.value.所持物 = Object.fromEntries(user_character.value.inventory);
    // 將生日從Datetime轉換為{month, date}對象
    edited_character.value.生日 = {
      month: user_character.value.birthday.month,
      date: user_character.value.birthday.date,
    };
    is_editing.value = true;
  }
};

const cancelEditing = () => {
  is_editing.value = false;
  edited_character.value = null;
};

const confirmEditing = () => {
  if (state.value && edited_character.value) {
    // 將生日對象轉換回Datetime
    if (edited_character.value.生日 && edited_character.value.生日.month && edited_character.value.生日.date) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() 返回 0-11
      const currentDay = currentDate.getDate();

      const birthMonth = edited_character.value.生日.month;
      const birthDay = edited_character.value.生日.date;
      const age = edited_character.value.年齡 || 0;

      // 計算生日年份：如果生日已經過了，則年份是 currentYear - age，否則是 currentYear - age - 1
      let birthYear = currentYear - age;
      if (birthMonth > currentMonth || (birthMonth === currentMonth && birthDay > currentDay)) {
        birthYear -= 1;
      }

      edited_character.value.生日 = new Date(
        birthYear,
        edited_character.value.生日.month - 1,
        edited_character.value.生日.date,
      ).toString();
    }

    // 過濾無效的關係項目
    if (edited_character.value.關係) {
      const filteredRelations: any = {};
      for (const [characterId, relation] of Object.entries(edited_character.value.關係)) {
        // 如果角色ID不為空且關係不為空，則保留
        if (characterId && relation && typeof relation === 'string' && relation.trim() !== '') {
          filteredRelations[characterId] = relation;
        }
      }
      edited_character.value.關係 = filteredRelations;
    }

    // 過濾無效的物品項目
    if (edited_character.value.所持物) {
      const filteredInventory: any = {};
      for (const [itemId, quantity] of Object.entries(edited_character.value.所持物)) {
        // 如果物品ID不為空且數量大於0，則保留
        if (itemId && quantity && typeof quantity === 'number' && quantity > 0) {
          // 對於 storage 類型，數量必須是 1
          const finalQuantity = isStorage(itemId) ? 1 : quantity;
          filteredInventory[itemId] = finalQuantity;
        }
      }
      edited_character.value.所持物 = filteredInventory;
    }

    state.value.active_characters.set('c1', Character.fromRecord(edited_character.value));
    state.value.saveAsVariable(getLastMessageId());
    // 重新載入state以確保UI更新
    loadState();
  }
  is_editing.value = false;
  edited_character.value = null;
};

const handleTabClick = () => {
  if (is_editing.value) {
    cancelEditing();
  }
  // 如果沒有在編輯模式，什麼都不做
};

defineExpose({ handleTabClick });

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

onMounted(() => {
  // 初始化完成
  nextTick(() => {
    setupResizeObserver();
  });
});

onUnmounted(() => {
  cleanupResizeObserver();
});
</script>

<style lang="scss" scoped>
.user-tab-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.user-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  gap: 20px;
  display: flex;
  flex-direction: column;
  min-height: v-bind(user_content_max_height);
  max-height: v-bind(user_content_max_height);

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

.user-header {
  text-align: center;
  position: relative;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  color: #007acc;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.attributes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.attribute-item {
  background: #252525;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #404040;

  &.full-width {
    grid-column: 1 / -1;
    text-align: left;
    padding: 16px;
  }

  &.horizontal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;

    .attribute-label {
      margin-bottom: 0;
      flex-shrink: 0;
    }

    .attribute-value {
      margin-left: auto;
    }

    // 在編輯模式中為標籤和輸入欄位之間添加空間
    .attribute-input {
      margin-left: 8px;
    }
  }

  &.birthday-fullwidth {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;

    .attribute-label {
      margin-bottom: 0;
      flex-shrink: 0;
    }

    .attribute-value {
      margin-left: auto;
    }

    .birthday-edit-container {
      margin-left: auto;
      justify-content: flex-end;
    }
  }
}

.attribute-label {
  display: block;
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;

  &.unit-label {
    text-transform: none;
  }
}

.attribute-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #e0e0e0;

  &.money {
    color: #4caf50;
    font-weight: 700;
  }

  &.no-bold {
    font-weight: 400;
  }
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #007acc;
  margin: 20px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #007acc;
}

.relations-section,
.inventory-section {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.relations-list,
.inventory-list,
.relations-edit-list,
.inventory-edit-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.relation-item {
  background: #252525;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  font-size: 14px;
  color: #e0e0e0;
  line-height: 1.4;
}

.relation-highlight {
  color: #ffffff;
  font-weight: 500;
}

.relation-connector {
  color: #888888;
  font-weight: 400;
}

.relation-edit-item {
  background: #252525;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.relation-edit-connector {
  color: #888888;
  font-weight: 400;
  font-size: 14px;
  white-space: nowrap;
}

.relation-input {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 4px 8px;
  font-size: 14px;
  flex: 1;
  min-width: 50px;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.relation-select,
.inventory-select {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 4px 8px;
  font-size: 14px;
  min-width: 120px;
  flex-shrink: 0;

  &:focus {
    outline: none;
    border-color: #007acc;
  }

  option {
    background: #333;
    color: #e0e0e0;
  }

  option:disabled {
    color: #888;
    font-style: italic;
  }
}

.relation-remove-btn,
.add-relation-btn,
.add-inventory-btn {
  background: #007acc;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #005a99;
  }
}

.inventory-item {
  background: #252525;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.inventory-first-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name-id {
  font-weight: 500;
  color: #ffffff;
  font-size: 14px;
}

.item-quantity {
  font-weight: 600;
  color: #e0e0e0;
  background: #007acc;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.storage-indicator {
  font-weight: 600;
  color: #ffffff;
  background: #4caf50;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

:deep(.inventory-item-tag) {
  background: #4caf50;
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

:deep(.storage-item-tag) {
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

.inventory-second-row {
  font-size: 12px;
  color: #a0a0a0;
  line-height: 1.6;
}

.inventory-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: flex-start;
  row-gap: 6px;
  margin-top: 4px;
}

.inventory-third-row {
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

.inventory-edit-item {
  background: #252525;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.inventory-edit-connector {
  color: #888888;
  font-weight: 400;
  font-size: 14px;
  white-space: nowrap;
}

.inventory-quantity-input {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 4px 8px;
  font-size: 14px;
  width: 80px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.inventory-remove-btn {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: auto;

  &:hover {
    background: #da190b;
  }
}

.attribute-input {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 4px 8px;
  font-size: 14px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.birthday-inputs {
  display: flex;
  align-items: center;
  gap: 2px;
  width: auto;
  margin-left: auto;
}

.birthday-edit-container {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.birthday-input-group {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
}

.birthday-month,
.birthday-date {
  width: 50px;
  flex-shrink: 0;
}

.birthday-separator {
  color: #888;
  font-size: 14px;
  white-space: nowrap;
}

.attribute-textarea {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 8px;
  font-size: 14px;
  width: 100%;
  min-height: 60px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
}

.edit-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #404040;
}

.edit-button {
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  background: #007acc;
  color: white;

  &:hover {
    background: #005a99;
  }
}

.confirm-button,
.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
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

@media (max-width: 768px) {
  .user-content {
    padding: 12px;
    gap: 16px;
  }

  .user-name {
    font-size: 24px;
  }

  .attributes-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
  }

  .attribute-item {
    padding: 10px;

    &.full-width {
      padding: 12px;
    }
  }

  .attribute-value {
    font-size: 14px;
  }

  .inventory-item {
    gap: 4px;
  }

  :deep(.inventory-item-tag) {
    font-size: 12px;
    padding: 2px 6px;
  }

  .inventory-third-row :deep(.inventory-item-tag) {
    font-size: 12px;
    padding: 2px 6px;
  }
}

.no-relations-message,
.no-inventory-message {
  background: #252525;
  padding: 16px 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  color: #888;
  text-align: center;
  font-size: 14px;
  font-style: italic;
}
</style>
