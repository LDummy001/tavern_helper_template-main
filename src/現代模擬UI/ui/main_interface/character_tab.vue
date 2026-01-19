<template>
  <div class="character-tab-container">
    <!-- 角色列表視圖 -->
    <div v-if="!selected_character_id && !is_adding" class="character-content">
      <!-- 活躍角色部分 -->
      <div class="character-section">
        <h3 class="section-title">活躍角色</h3>
        <div class="character-list">
          <div
            v-for="[characterId, character] in active_characters"
            :key="characterId"
            class="character-item clickable"
            @click="selectCharacter(characterId)"
          >
            <div class="character-info" :class="{ 'user-character-info': characterId === 'c1' }">
              <span :class="characterId === 'c1' ? 'user-id' : 'character-id'">{{ characterId }}</span>
              <span :class="characterId === 'c1' ? 'user-name' : 'character-name'">{{ character.name }}</span>
            </div>
            <button
              v-if="characterId !== 'c1'"
              class="toggle-status-button"
              title="設為非活躍"
              @click.stop="toggleCharacterStatus(characterId)"
            >
              ↓
            </button>
            <div v-if="characterId !== 'c1'" class="character-progress-bars">
              <ProgressBar label="心情" :value="character.mood || 0" attributeType="mood" />
              <ProgressBar label="性慾" :value="character.horny || 0" attributeType="horny" />
              <ProgressBar label="友好度" :value="character.friendships?.get('c1') || 0" attributeType="friendship" />
              <ProgressBar label="愛情度" :value="character.loves?.get('c1') || 0" attributeType="love" />
            </div>
          </div>
          <div v-if="active_characters.size === 0" class="no-characters-message">沒有活躍角色</div>
        </div>
      </div>

      <!-- 非活躍角色部分 -->
      <div class="character-section">
        <h3 class="section-title">非活躍角色</h3>
        <div class="character-list">
          <div
            v-for="[characterId, character] in deactive_characters"
            :key="characterId"
            class="character-item clickable"
            @click="selectCharacter(characterId)"
          >
            <div class="character-info" :class="{ 'user-character-info': characterId === 'c1' }">
              <span :class="characterId === 'c1' ? 'user-id' : 'character-id'">{{ characterId }}</span>
              <span :class="characterId === 'c1' ? 'user-name' : 'character-name'">{{ character.name }}</span>
            </div>
            <button
              v-if="characterId !== 'c1'"
              class="toggle-status-button"
              title="設為活躍"
              @click.stop="toggleCharacterStatus(characterId)"
            >
              ↑
            </button>
            <div v-if="characterId !== 'c1'" class="character-progress-bars">
              <ProgressBar label="心情" :value="character.mood || 0" attributeType="mood" />
              <ProgressBar label="性慾" :value="character.horny || 0" attributeType="horny" />
              <ProgressBar label="友好度" :value="character.friendships?.get('c1') || 0" attributeType="friendship" />
              <ProgressBar label="愛情度" :value="character.loves?.get('c1') || 0" attributeType="love" />
            </div>
          </div>
          <div v-if="deactive_characters.size === 0" class="no-characters-message">沒有非活躍角色</div>
        </div>
      </div>

      <!-- 新增角色按鈕 -->
      <button v-if="!is_adding" class="add-character-button" @click="startAddingCharacter">+ 添加角色</button>
    </div>

    <!-- 角色詳細信息視圖 -->
    <div v-else class="character-detail-content">
      <!-- 角色名稱標題 -->
      <div class="character-header">
        <div class="header-buttons">
          <button v-if="!is_editing && !is_adding" class="edit-button" @click="startEditing">編輯</button>
          <button
            v-if="!is_editing && !is_adding && selected_character_id !== 'c1'"
            class="delete-button"
            @click="deleteCharacter"
          >
            刪除
          </button>
        </div>
        <h1 class="character-detail-name">{{ is_adding ? '新增角色' : selected_character?.name || 'N/A' }}</h1>
        <button class="back-button" @click="handleBackButton">←</button>
      </div>

      <!-- 所有屬性統一顯示 -->
      <div class="attributes-grid">
        <!-- 基本信息 -->
        <div class="attribute-item horizontal">
          <span class="attribute-label">ID</span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{ selected_character_id }}</span>
          <input v-else v-model="edited_character_id" class="attribute-input" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label">名稱<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{ selected_character?.name || 'N/A' }}</span>
          <input v-else v-model="edited_character.名稱" class="attribute-input" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label">性別<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{
            selected_character?.gender || 'N/A'
          }}</span>
          <input v-else v-model="edited_character.性別" class="attribute-input" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label">年齡<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{ selected_character?.age || 'N/A' }}</span>
          <input v-else v-model.number="edited_character.年齡" class="attribute-input" type="number" />
        </div>

        <!-- 身體測量 -->
        <div class="attribute-item horizontal">
          <span class="attribute-label unit-label">身高 (cm)<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{
            selected_character?.height || 'N/A'
          }}</span>
          <input v-else v-model.number="edited_character.身高" class="attribute-input" type="number" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label unit-label">體重 (kg)<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{
            selected_character?.weight || 'N/A'
          }}</span>
          <input v-else v-model.number="edited_character.體重" class="attribute-input" type="number" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label unit-label">胸圍 (cm)<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{
            selected_character?.chest_size || 'N/A'
          }}</span>
          <input v-else v-model.number="edited_character.胸圍" class="attribute-input" type="number" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label">罩杯<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{
            selected_character?.cup_size || '不適用'
          }}</span>
          <input v-else v-model="edited_character.罩杯" class="attribute-input" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label unit-label">腰圍 (cm)<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{
            selected_character?.waist_size || 'N/A'
          }}</span>
          <input v-else v-model.number="edited_character.腰圍" class="attribute-input" type="number" />
        </div>
        <div class="attribute-item horizontal">
          <span class="attribute-label unit-label">臀圍 (cm)<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{
            selected_character?.hips_size || 'N/A'
          }}</span>
          <input v-else v-model.number="edited_character.臀圍" class="attribute-input" type="number" />
        </div>

        <!-- 金錢 -->
        <div class="attribute-item full-width horizontal">
          <span class="attribute-label">金錢</span>
          <span v-if="!is_editing && !is_adding" class="attribute-value money">{{
            formatMoney(selected_character?.money)
          }}</span>
          <input v-else v-model.number="edited_character.金錢" class="attribute-input" type="number" />
        </div>

        <!-- 生日 -->
        <div class="attribute-item full-width birthday-fullwidth">
          <span class="attribute-label">生日</span>
          <span v-if="!is_editing && !is_adding" class="attribute-value">{{
            formatBirthday(selected_character?.birthday)
          }}</span>
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

        <!-- 心情和性慾 (僅非用戶角色顯示) -->
        <div v-if="selected_character_id !== 'c1'" class="attribute-item full-width">
          <ProgressBar v-if="!is_editing" label="心情" :value="selected_character?.mood || 0" attributeType="mood" />
          <div v-else class="progress-edit-container">
            <span class="attribute-label">心情</span>
            <input
              v-model.number="edited_character.心情"
              class="attribute-input"
              type="number"
              min="-100"
              max="100"
              @input="clampMoodValue"
              @blur="clampMoodValue"
            />
          </div>
        </div>
        <div v-if="selected_character_id !== 'c1'" class="attribute-item full-width">
          <ProgressBar v-if="!is_editing" label="性慾" :value="selected_character?.horny || 0" attributeType="horny" />
          <div v-else class="progress-edit-container">
            <span class="attribute-label">性慾</span>
            <input
              v-model.number="edited_character.性慾"
              class="attribute-input"
              type="number"
              min="0"
              max="100"
              @input="clampHornyValue"
              @blur="clampHornyValue"
            />
          </div>
        </div>

        <!-- 外貌特徵 -->
        <div class="attribute-item full-width">
          <span class="attribute-label">身份<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value no-bold">{{
            selected_character?.identity || 'N/A'
          }}</span>
          <textarea v-else v-model="edited_character.身份" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">髮型<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value no-bold">{{
            selected_character?.hairstyle || 'N/A'
          }}</span>
          <textarea v-else v-model="edited_character.髮型" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">樣貌<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value no-bold">{{
            selected_character?.appearance || 'N/A'
          }}</span>
          <textarea v-else v-model="edited_character.樣貌" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">衣著<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value no-bold">{{
            selected_character?.clothes || 'N/A'
          }}</span>
          <textarea v-else v-model="edited_character.衣著" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">愛好<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value no-bold">{{
            selected_character?.favourite || 'N/A'
          }}</span>
          <textarea v-else v-model="edited_character.愛好" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">簡介<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value no-bold">{{
            selected_character?.introduction || 'N/A'
          }}</span>
          <textarea v-else v-model="edited_character.簡介" class="attribute-textarea"></textarea>
        </div>
        <div class="attribute-item full-width">
          <span class="attribute-label">性格<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value no-bold">{{
            selected_character?.personality || 'N/A'
          }}</span>
          <textarea v-else v-model="edited_character.性格" class="attribute-textarea"></textarea>
        </div>
        <div
          v-if="(selected_character?.extra_information && !is_adding) || is_editing"
          class="attribute-item full-width"
        >
          <span class="attribute-label">其他重要資訊<span class="required-asterisk">*</span></span>
          <span v-if="!is_editing && !is_adding" class="attribute-value no-bold">{{
            selected_character?.extra_information || 'N/A'
          }}</span>
          <textarea v-else v-model="edited_character.其他重要資訊" class="attribute-textarea"></textarea>
        </div>
      </div>

      <!-- 關係 -->
      <div class="relations-section">
        <h3 class="section-title">關係</h3>
        <div v-if="!is_editing && !is_adding" class="relations-list">
          <div
            v-for="[characterId, relation] in selected_character?.relations || []"
            :key="characterId"
            class="relation-item"
          >
            <span class="relation-highlight"
              >{{ state?.getCharacter(characterId)?.name || '未知' }} ({{ characterId }})</span
            >
            <span class="connector"> 是此角色的 </span><span class="relation-highlight">{{ relation }}</span>
          </div>
          <div v-if="!selected_character?.relations || selected_character.relations.size === 0" class="no-message">
            沒有任何關係
          </div>
        </div>
        <div v-else class="relations-edit-list">
          <div v-for="(_, characterId) in edited_relations" :key="characterId" class="edit-item">
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
            <span class="edit-connector"> 是此角色的 </span>
            <input v-model="edited_relations[characterId]" class="input-field" placeholder="關係" />
            <button class="relation-remove-btn" @click="removeRelation(String(characterId))">×</button>
          </div>
          <button class="add-relation-btn" @click="addRelation">+ 添加關係</button>
        </div>
      </div>

      <!-- 友好度和愛情度 (僅非用戶角色顯示) -->
      <div v-if="selected_character_id !== 'c1' || is_adding" class="friendships-section">
        <h3 class="section-title">友好度</h3>
        <div v-if="!is_editing && !is_adding" class="friendships-list">
          <div
            v-for="[characterId, friendship] in selected_character?.friendships || []"
            :key="characterId"
            class="friendship-item"
          >
            <ProgressBar :label="`${state?.getCharacter(characterId)?.name || '未知'} (${characterId})`" :value="friendship" attributeType="friendship" />
          </div>
          <div v-if="!selected_character?.friendships || selected_character.friendships.size === 0" class="no-message">
            沒有任何友好度
          </div>
        </div>
        <div v-else class="friendships-edit-list">
          <div v-for="(_, characterId) in edited_friendships" :key="characterId" class="edit-item">
            <select
              :value="characterId"
              class="relation-select"
              @change="e => updateFriendshipCharacter(String(characterId), (e.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>選擇角色</option>
              <option v-for="char in available_characters" :key="char.id" :value="char.id">
                {{ char.name }} ({{ char.id }})
              </option>
            </select>
            <span class="edit-connector"> : </span>
            <input
              v-model.number="edited_friendships[characterId]"
              class="input-field"
              type="number"
              min="-1000"
              max="1000"
              placeholder="友好度"
              @input="clampFriendshipValue(String(characterId))"
              @blur="clampFriendshipValue(String(characterId))"
            />
            <button class="friendship-remove-btn" @click="removeFriendship(String(characterId))">×</button>
          </div>
          <button class="add-friendship-btn" @click="addFriendship">+ 添加友好度</button>
        </div>
      </div>

      <div v-if="selected_character_id !== 'c1' || is_adding" class="loves-section">
        <h3 class="section-title">愛情度</h3>
        <div v-if="!is_editing && !is_adding" class="loves-list">
          <div v-for="[characterId, love] in selected_character?.loves || []" :key="characterId" class="love-item">
            <ProgressBar :label="`${state?.getCharacter(characterId)?.name || '未知'} (${characterId})`" :value="love" attributeType="love" />
          </div>
          <div v-if="!selected_character?.loves || selected_character.loves.size === 0" class="no-message">
            沒有任何愛情度
          </div>
        </div>
        <div v-else class="loves-edit-list">
          <div v-for="(_, characterId) in edited_loves" :key="characterId" class="edit-item">
            <select
              :value="characterId"
              class="relation-select"
              @change="e => updateLoveCharacter(String(characterId), (e.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>選擇角色</option>
              <option v-for="char in available_characters" :key="char.id" :value="char.id">
                {{ char.name }} ({{ char.id }})
              </option>
            </select>
            <span class="edit-connector"> : </span>
            <input
              v-model.number="edited_loves[characterId]"
              class="input-field"
              type="number"
              min="0"
              max="1000"
              placeholder="愛情度"
              @input="clampLoveValue(String(characterId))"
              @blur="clampLoveValue(String(characterId))"
            />
            <button class="love-remove-btn" @click="removeLove(String(characterId))">×</button>
          </div>
          <button class="add-love-btn" @click="addLove">+ 添加愛情度</button>
        </div>
      </div>

      <div class="inventory-section">
        <h3 class="section-title">所持物</h3>
        <div v-if="!is_editing && !is_adding" class="inventory-list">
           <div
             v-for="[itemId, quantity] in selected_character?.inventory || []"
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
           <div v-if="!selected_character?.inventory || selected_character.inventory.size === 0" class="no-message">
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
        <button class="confirm-button" :disabled="isConfirmDisabled" @click="confirmEditing">確認</button>
        <button class="cancel-button" @click="cancelEditing">取消</button>
      </div>
    </div>

    <!-- 確認窗口 -->
    <ConfirmationWindow
      :confirm-dialog="confirm_dialog"
      @confirm-dialog-confirm="confirmDeleteCharacter"
      @confirm-dialog-cancel="cancelDeleteCharacter"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { Character } from '../../variable_logic/variables/character';
import { State } from '../../variable_logic/variables/state';
import ConfirmationWindow from '../common_elements/confirmation_window.vue';
import ProgressBar from '../common_elements/progress_bar.vue';

// 編輯模式
const is_editing = ref(false);
const is_adding = ref(false);
const edited_character = ref<any>(null);
const edited_character_id = ref<string>('');

// 刪除確認窗口
const confirm_dialog = ref({
  visible: false,
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
});

// 動態高度相關
const tab_navigation_height = ref(0); // 頂部標籤導航高度
const resize_observer = ref<ResizeObserver | null>(null);

// 動態計算角色內容的最大高度
const character_content_max_height = computed(() => {
  return `calc(100vh - ${tab_navigation_height.value}px)`;
});

// 暴露方法給父組件調用
const handleTabClick = () => {
  if (selected_character_id.value) {
    // 如果在詳細頁面或編輯頁面，返回列表頁面
    if (is_editing.value) {
      cancelEditing();
    }
    selected_character_id.value = null;
  } else if (is_adding.value) {
    // 如果在新增角色頁面，取消新增並返回列表頁面
    cancelEditing();
  }
  // 如果已經在列表頁面，什麼都不做
};

defineExpose({
  handleTabClick,
});

// 檢查新增角色時必需字段是否都已填寫
const isConfirmDisabled = computed(() => {
  if (!is_adding.value || !edited_character.value) return false;

  const requiredFields = [
    '名稱',
    '性別',
    '年齡',
    '身高',
    '體重',
    '胸圍',
    '罩杯',
    '腰圍',
    '臀圍',
    '身份',
    '髮型',
    '樣貌',
    '衣著',
    '愛好',
    '簡介',
    '性格',
    '其他重要資訊',
  ];

  return requiredFields.some(field => {
    const value = edited_character.value[field];
    return value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '');
  });
});

// 編輯關係的響應式數據
const edited_relations = computed({
  get: () => edited_character.value?.[Character.RELATIONS_KEY] || {},
  set: (value: any) => {
    if (edited_character.value) {
      edited_character.value[Character.RELATIONS_KEY] = value;
    }
  },
});

// 編輯物品的響應式數據
const edited_inventory = computed({
  get: () => edited_character.value?.[Character.INVENTORY_KEY] || {},
  set: (value: any) => {
    if (edited_character.value) {
      edited_character.value[Character.INVENTORY_KEY] = value;
    }
  },
});

// 編輯友好度的響應式數據
const edited_friendships = computed({
  get: () => edited_character.value?.[Character.FRIENDSHIPS_KEY] || {},
  set: (value: any) => {
    if (edited_character.value) {
      edited_character.value[Character.FRIENDSHIPS_KEY] = value;
    }
  },
});

// 編輯愛情度的響應式數據
const edited_loves = computed({
  get: () => edited_character.value?.[Character.LOVES_KEY] || {},
  set: (value: any) => {
    if (edited_character.value) {
      edited_character.value[Character.LOVES_KEY] = value;
    }
  },
});

// 選中的角色ID
const selected_character_id = ref<string | null>(null);

// 獲取狀態
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

// 活躍角色
const active_characters = computed(() => {
  return state.value?.active_characters || new Map();
});

// 非活躍角色
const deactive_characters = computed(() => {
  return state.value?.deactive_characters || new Map();
});

// 選中的角色
const selected_character = computed(() => {
  if (!selected_character_id.value || !state.value) return null;
  return state.value.getCharacter(selected_character_id.value);
});

// 獲取所有可用角色列表（排除當前選中的角色）
const available_characters = computed(() => {
  if (!state.value) return [];
  const characters = [];
  for (const [id, character] of state.value.active_characters) {
    if (id !== selected_character_id.value) {
      characters.push({ id, name: character.name });
    }
  }
  for (const [id, character] of state.value.deactive_characters) {
    if (id !== selected_character_id.value) {
      characters.push({ id, name: character.name });
    }
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

// 選擇角色
const selectCharacter = (characterId: string) => {
  selected_character_id.value = characterId;
};

// 切換角色活躍/非活躍狀態
const toggleCharacterStatus = (characterId: string) => {
  if (!state.value || characterId === 'c1') return;

  const character = state.value.getCharacter(characterId);
  if (!character) return;

  // 檢查角色當前狀態
  const isActive = state.value.active_characters.has(characterId);

  if (isActive) {
    // 從活躍移動到非活躍
    state.value.active_characters.delete(characterId);
    state.value.deactive_characters.set(characterId, character);
  } else {
    // 從非活躍移動到活躍
    state.value.deactive_characters.delete(characterId);
    state.value.active_characters.set(characterId, character);
  }

  // 保存狀態
  state.value.saveAsVariable(getLastMessageId());
  // 重新載入state以確保UI更新
  loadState();
};

// 處理返回按鈕
const handleBackButton = () => {
  if (is_editing.value) {
    // 如果在編輯模式中，先取消編輯
    cancelEditing();
  }
  // 返回角色列表頁面
  selected_character_id.value = null;
};

// 刪除角色（顯示確認窗口）
const deleteCharacter = () => {
  if (selected_character.value && selected_character_id.value !== 'c1') {
    confirm_dialog.value = {
      visible: true,
      title: '確認刪除角色',
      message: `確定要刪除角色 "${selected_character.value.name}" 嗎？此操作無法撤銷。`,
      confirmText: '刪除',
      cancelText: '取消',
    };
  }
};

// 確認刪除角色
const confirmDeleteCharacter = () => {
  if (state.value && selected_character_id.value && selected_character_id.value !== 'c1') {
    // 從活躍或非活躍角色中刪除
    state.value.active_characters.delete(selected_character_id.value);
    state.value.deactive_characters.delete(selected_character_id.value);
    state.value.saveAsVariable(getLastMessageId());
    // 返回角色列表頁面
    selected_character_id.value = null;
    // 重新載入state以確保UI更新
    loadState();
  }
  confirm_dialog.value.visible = false;
};

// 取消刪除角色
const cancelDeleteCharacter = () => {
  confirm_dialog.value.visible = false;
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

// 移除友好度
const removeFriendship = (characterId: string) => {
  if (edited_character.value?.友好度) {
    delete edited_character.value.友好度[characterId];
  }
};

// 添加友好度
const addFriendship = () => {
  if (edited_character.value?.友好度) {
    // 使用空字符串作為鍵來表示新添加的項目，這樣下拉列表會顯示占位符
    edited_character.value.友好度[''] = 0;
  }
};

// 更新友好度中的角色ID
const updateFriendshipCharacter = (oldCharacterId: string, newCharacterId: string) => {
  if (edited_character.value?.友好度 && oldCharacterId !== newCharacterId) {
    const friendship = edited_character.value.友好度[oldCharacterId];
    delete edited_character.value.友好度[oldCharacterId];
    if (newCharacterId) {
      edited_character.value.友好度[newCharacterId] = friendship;
    }
  }
};

// 移除愛情度
const removeLove = (characterId: string) => {
  if (edited_character.value?.愛情度) {
    delete edited_character.value.愛情度[characterId];
  }
};

// 添加愛情度
const addLove = () => {
  if (edited_character.value?.愛情度) {
    // 使用空字符串作為鍵來表示新添加的項目，這樣下拉列表會顯示占位符
    edited_character.value.愛情度[''] = 0;
  }
};

// 更新愛情度中的角色ID
const updateLoveCharacter = (oldCharacterId: string, newCharacterId: string) => {
  if (edited_character.value?.愛情度 && oldCharacterId !== newCharacterId) {
    const love = edited_character.value.愛情度[oldCharacterId];
    delete edited_character.value.愛情度[oldCharacterId];
    if (newCharacterId) {
      edited_character.value.愛情度[newCharacterId] = love;
    }
  }
};

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

// 限制心情值範圍
const clampMoodValue = () => {
  if (edited_character.value && edited_character.value.心情 !== undefined) {
    if (edited_character.value.心情 < -100) {
      edited_character.value.心情 = -100;
    } else if (edited_character.value.心情 > 100) {
      edited_character.value.心情 = 100;
    }
  }
};

// 限制興奮值範圍
const clampHornyValue = () => {
  if (edited_character.value && edited_character.value.性慾 !== undefined) {
    if (edited_character.value.性慾 < 0) {
      edited_character.value.性慾 = 0;
    } else if (edited_character.value.性慾 > 100) {
      edited_character.value.性慾 = 100;
    }
  }
};

// 限制友好度值範圍
const clampFriendshipValue = (characterId: string) => {
  if (edited_friendships.value && edited_friendships.value[characterId] !== undefined) {
    if (edited_friendships.value[characterId] < -1000) {
      edited_friendships.value[characterId] = -1000;
    } else if (edited_friendships.value[characterId] > 1000) {
      edited_friendships.value[characterId] = 1000;
    }
  }
};

// 限制愛情度值範圍
const clampLoveValue = (characterId: string) => {
  if (edited_loves.value && edited_loves.value[characterId] !== undefined) {
    if (edited_loves.value[characterId] < 0) {
      edited_loves.value[characterId] = 0;
    } else if (edited_loves.value[characterId] > 1000) {
      edited_loves.value[characterId] = 1000;
    }
  }
};

// 編輯功能
const startEditing = () => {
  if (selected_character.value) {
    const record = selected_character.value.toRecord();
    edited_character.value = {
      [Character.NAME_KEY]: record[Character.NAME_KEY],
      [Character.GENDER_KEY]: record[Character.GENDER_KEY],
      [Character.AGE_KEY]: record[Character.AGE_KEY].toString(),
      [Character.HEIGHT_KEY]: record[Character.HEIGHT_KEY].toString(),
      [Character.WEIGHT_KEY]: record[Character.WEIGHT_KEY].toString(),
      [Character.CHEST_SIZE_KEY]: record[Character.CHEST_SIZE_KEY].toString(),
      [Character.CUP_SIZE_KEY]: record[Character.CUP_SIZE_KEY] || '',
      [Character.WAIST_SIZE_KEY]: record[Character.WAIST_SIZE_KEY].toString(),
      [Character.HIPS_SIZE_KEY]: record[Character.HIPS_SIZE_KEY].toString(),
      [Character.IDENTITY_KEY]: record[Character.IDENTITY_KEY],
      [Character.HAIRSTYLE_KEY]: record[Character.HAIRSTYLE_KEY],
      [Character.APPEARANCE_KEY]: record[Character.APPEARANCE_KEY],
      [Character.CLOTHES_KEY]: record[Character.CLOTHES_KEY],
      [Character.FAVOURITE_KEY]: record[Character.FAVOURITE_KEY],
      [Character.INTRODUCTION_KEY]: record[Character.INTRODUCTION_KEY],
      [Character.PERSONALITY_KEY]: record[Character.PERSONALITY_KEY],
      [Character.EXTRA_INFORMATION_KEY]: record[Character.EXTRA_INFORMATION_KEY],
      [Character.MONEY_KEY]: record[Character.MONEY_KEY],
      [Character.MOOD_KEY]: record[Character.MOOD_KEY],
      [Character.HORNY_KEY]: record[Character.HORNY_KEY],
      [Character.RELATIONS_KEY]: record[Character.RELATIONS_KEY],
      [Character.FRIENDSHIPS_KEY]: record[Character.FRIENDSHIPS_KEY],
      [Character.LOVES_KEY]: record[Character.LOVES_KEY],
      [Character.INVENTORY_KEY]: record[Character.INVENTORY_KEY],
      [Character.BIRTHDAY_KEY]: record[Character.BIRTHDAY_KEY],
    };
    edited_character_id.value = selected_character_id.value || '';
    is_editing.value = true;
    is_adding.value = false;
  }
};

// 生成新的角色ID
const generateNewCharacterId = (): string => {
  if (!state.value) return 'c2';

  const existing_ids = new Set<string>();
  for (const id of state.value.active_characters.keys()) {
    existing_ids.add(id);
  }
  for (const id of state.value.deactive_characters.keys()) {
    existing_ids.add(id);
  }

  // 從c2開始找可用的ID
  let id_number = 2;
  while (existing_ids.has(`c${id_number}`)) {
    id_number++;
  }
  return `c${id_number}`;
};

// 新增角色功能
const startAddingCharacter = () => {
  // 生成新的角色ID
  const new_id = generateNewCharacterId();
  edited_character_id.value = new_id;

  // 創建一個空的角色對象作為模板，使用 Character 類的靜態鍵
  edited_character.value = {
    [Character.NAME_KEY]: '',
    [Character.AGE_KEY]: null,
    [Character.GENDER_KEY]: '',
    [Character.IDENTITY_KEY]: '',
    [Character.INTRODUCTION_KEY]: '',
    [Character.PERSONALITY_KEY]: '',
    [Character.HEIGHT_KEY]: 0,
    [Character.WEIGHT_KEY]: 0,
    [Character.CHEST_SIZE_KEY]: 0,
    [Character.CUP_SIZE_KEY]: '',
    [Character.WAIST_SIZE_KEY]: 0,
    [Character.HIPS_SIZE_KEY]: 0,
    [Character.HAIRSTYLE_KEY]: '',
    [Character.APPEARANCE_KEY]: '',
    [Character.CLOTHES_KEY]: '',
    [Character.BIRTHDAY_KEY]: { month: 1, date: 1 },
    [Character.FAVOURITE_KEY]: '',
    [Character.EXTRA_INFORMATION_KEY]: '',
    [Character.MONEY_KEY]: 0,
    [Character.MOOD_KEY]: 0,
    [Character.HORNY_KEY]: 0,
    [Character.RELATIONS_KEY]: {},
    [Character.INVENTORY_KEY]: {},
    [Character.FRIENDSHIPS_KEY]: {},
    [Character.LOVES_KEY]: {},
  };

  is_editing.value = true;
  is_adding.value = true;
  selected_character_id.value = null; // 切換到編輯視圖
};

const cancelEditing = () => {
  is_editing.value = false;
  is_adding.value = false;
  edited_character.value = null;
  edited_character_id.value = '';
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

const confirmEditing = () => {
  if (state.value && edited_character.value) {
    // 檢查新ID是否與現有角色衝突（排除當前編輯的角色）
    const new_id = edited_character_id.value.trim();
    if (is_adding.value) {
      // 新增模式：檢查ID是否已存在
      const existing_active = state.value.active_characters.has(new_id);
      const existing_deactive = state.value.deactive_characters.has(new_id);
      if (existing_active || existing_deactive) {
        toastr.error(`角色ID "${new_id}" 已經存在，請選擇其他ID`);
        return;
      }
    } else if (selected_character_id.value && new_id !== selected_character_id.value) {
      // 編輯模式：檢查新ID是否與其他角色衝突
      const existing_active = state.value.active_characters.has(new_id);
      const existing_deactive = state.value.deactive_characters.has(new_id);
      if (existing_active || existing_deactive) {
        toastr.error(`角色ID "${new_id}" 已經存在，請選擇其他ID`);
        return;
      }
    }

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

    // 過濾無效的友好度項目
    if (edited_character.value.友好度) {
      const filteredFriendships: any = {};
      for (const [characterId, friendship] of Object.entries(edited_character.value.友好度)) {
        // 如果角色ID不為空且友好度在有效範圍內，則保留
        if (
          characterId &&
          friendship !== undefined &&
          typeof friendship === 'number' &&
          friendship >= -1000 &&
          friendship <= 1000
        ) {
          filteredFriendships[characterId] = friendship;
        }
      }
      edited_character.value.友好度 = filteredFriendships;
    }

    // 過濾無效的愛情度項目
    if (edited_character.value.愛情度) {
      const filteredLoves: any = {};
      for (const [characterId, love] of Object.entries(edited_character.value.愛情度)) {
        // 如果角色ID不為空且愛情度在有效範圍內且大於0，則保留
        if (characterId && love !== undefined && typeof love === 'number' && love > 0 && love <= 1000) {
          filteredLoves[characterId] = love;
        }
      }
      edited_character.value.愛情度 = filteredLoves;
    }

    // 處理ID變更
    const final_id = new_id;

    // 創建記錄對象，使用 Character 類的靜態鍵
    const record = {
      [Character.NAME_KEY]: edited_character.value.名稱,
      [Character.GENDER_KEY]: edited_character.value.性別,
      [Character.AGE_KEY]: parseInt(edited_character.value.年齡),
      [Character.HEIGHT_KEY]: parseInt(edited_character.value.身高),
      [Character.WEIGHT_KEY]: parseInt(edited_character.value.體重),
      [Character.CHEST_SIZE_KEY]: parseInt(edited_character.value.胸圍),
      [Character.CUP_SIZE_KEY]: edited_character.value.罩杯 || undefined,
      [Character.WAIST_SIZE_KEY]: parseInt(edited_character.value.腰圍),
      [Character.HIPS_SIZE_KEY]: parseInt(edited_character.value.臀圍),
      [Character.IDENTITY_KEY]: edited_character.value.身份,
      [Character.HAIRSTYLE_KEY]: edited_character.value.髮型,
      [Character.APPEARANCE_KEY]: edited_character.value.樣貌,
      [Character.CLOTHES_KEY]: edited_character.value.衣著,
      [Character.FAVOURITE_KEY]: edited_character.value.愛好,
      [Character.INTRODUCTION_KEY]: edited_character.value.簡介,
      [Character.PERSONALITY_KEY]: edited_character.value.性格,
      [Character.EXTRA_INFORMATION_KEY]: edited_character.value.其他重要資訊,
      [Character.BIRTHDAY_KEY]: edited_character.value.生日,
      [Character.MONEY_KEY]: edited_character.value.金錢 ?? 0,
      [Character.MOOD_KEY]: edited_character.value.心情 ?? 50,
      [Character.HORNY_KEY]: edited_character.value.性慾 ?? 0,
      [Character.RELATIONS_KEY]: edited_character.value.關係 ?? {},
      [Character.FRIENDSHIPS_KEY]: edited_character.value.友好度 ?? {},
      [Character.LOVES_KEY]: edited_character.value.愛情度 ?? {},
      [Character.INVENTORY_KEY]: edited_character.value.所持物 ?? {},
    };

    if (is_adding.value) {
      // 新增模式：直接添加到活躍角色
      state.value.active_characters.set(final_id, Character.fromRecord(record));
      state.value.saveAsVariable(getLastMessageId());
      // 重新載入state以確保UI更新
      loadState();
      // 更新selected_character_id以反映新ID
      selected_character_id.value = final_id;
    } else if (selected_character_id.value) {
      const is_active = state.value.active_characters.has(selected_character_id.value);

      // 如果ID改變了，需要刪除舊的並添加新的
      if (final_id !== selected_character_id.value) {
        if (is_active) {
          state.value.active_characters.delete(selected_character_id.value);
          state.value.active_characters.set(final_id, Character.fromRecord(record));
        } else {
          state.value.deactive_characters.delete(selected_character_id.value);
          state.value.deactive_characters.set(final_id, Character.fromRecord(record));
        }
        // 更新selected_character_id以反映新ID
        selected_character_id.value = final_id;
      } else if (is_active) {
        // ID沒有改變，直接更新活躍角色
        state.value.active_characters.set(selected_character_id.value, Character.fromRecord(record));
      } else {
        // ID沒有改變，直接更新非活躍角色
        state.value.deactive_characters.set(selected_character_id.value, Character.fromRecord(record));
      }

      state.value.saveAsVariable(getLastMessageId());
      // 重新載入state以確保UI更新
      loadState();
    }
  }
  is_editing.value = false;
  is_adding.value = false;
  edited_character.value = null;
  edited_character_id.value = '';
};
</script>

<style lang="scss" scoped>
.character-tab-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.add-character-button {
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

.character-content,
.character-detail-content {
  flex: 1;
  padding: 12px;
  gap: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: v-bind(character_content_max_height);
  max-height: v-bind(character_content_max_height);

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

.character-section {
  margin-bottom: 24px;

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

.character-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.character-item {
  background: #252525;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #404040;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  transition: background-color 0.2s;

  &.clickable {
    cursor: pointer;

    &:hover {
      background: #2a2a2a;
      border-color: #555;
    }
  }
}

.toggle-status-button {
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s;

  &:hover {
    background: #005a99;
  }

  &:active {
    background: #004080;
  }
}

.character-id {
  color: #ffffff;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.user-id {
  color: #ffffff;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 80px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.character-name {
  color: #e0e0e0;
  font-weight: 500;
  text-align: center;
  flex: 1;
}

.user-name {
  color: #e0e0e0;
  font-weight: 500;
  flex: 1;
}

.character-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  min-width: 0;
  width: 80px;
}

.user-character-info {
  flex-direction: row;
  align-items: center;
  column-gap: 16px;
  height: auto;
  width: auto;
}

.character-progress-bars {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;

  // 減少進度條高度
  :deep(.progress-bar-wrapper) {
    height: 16px;
  }

  :deep(.progress-bar-value) {
    font-size: 12px;
  }
}

.no-characters-message {
  background: #252525;
  padding: 16px 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  color: #888;
  text-align: center;
  font-size: 14px;
  font-style: italic;
}

.character-header {
  text-align: center;
  position: relative;
}

.character-detail-name {
  font-size: 24px;
  font-weight: 700;
  color: #007acc;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-buttons {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 8px;
}

.edit-button,
.delete-button {
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

.delete-button {
  background: #f44336;

  &:hover {
    background: #da190b;
  }
}

.back-button {
  position: absolute;
  top: 0;
  right: 0;
  background: #007acc;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #005a99;
  }
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

  &.mood-horny-layout {
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

    .attribute-input {
      margin-left: auto;
      width: auto;
      min-width: 80px;
    }
  }

  .progress-edit-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;

    .attribute-label {
      margin-bottom: 0;
      flex-shrink: 0;
    }

    .attribute-input {
      width: auto;
      min-width: 80px;
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

.required-asterisk {
  color: #f44336;
  font-weight: bold;
  margin-left: 2px;
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

.relations-section,
.inventory-section,
.friendships-section,
.loves-section {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.relations-list,
.inventory-list,
.friendships-list,
.loves-list,
.relations-edit-list,
.inventory-edit-list,
.friendships-edit-list,
.loves-edit-list {
  @extend .list-container;
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

.friendship-item,
.love-item {
  background: #252525;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.relation-highlight {
  color: #ffffff;
  font-weight: 500;
}

.friendship-name,
.love-name {
  font-size: 14px;
  color: #e0e0e0;
  line-height: 1.4;
  white-space: nowrap;
  flex-shrink: 0;
}

.friendship-highlight,
.love-highlight {
  color: #ffffff;
  font-weight: 500;
}

.connector {
  color: #888888;
  font-weight: 400;
}

.edit-item {
  background: #252525;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #404040;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.edit-connector {
  color: #888888;
  font-weight: 400;
  font-size: 14px;
  white-space: nowrap;
}

.input-field {
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

.btn {
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

.action-btn {
  @extend .btn;
}

.relation-remove-btn,
.add-relation-btn,
.friendship-remove-btn,
.add-friendship-btn,
.love-remove-btn,
.add-love-btn,
.add-inventory-btn {
  @extend .action-btn;
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
  line-height: 1.4;
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

.confirm-button,
.cancel-button {
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

@media (max-width: 768px) {
  .character-content,
  .character-detail-content {
    padding: 12px;
  }

  .character-name {
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

  .character-item {
    padding: 10px 12px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .user-character-info {
    column-gap: 16px;
    height: auto;
  }

  .character-progress-bars {
    gap: 2px;
    flex: 1;
    min-width: 120px;
  }

  .character-id {
    min-width: 35px;
    padding: 3px 6px;
    font-size: 11px;
    height: 16px;
  }

  .user-id {
    min-width: 35px;
    padding: 3px 6px;
    font-size: 11px;
    height: 16px;
  }

  .character-name {
    font-size: 13px;
    line-height: 1.2;
  }
}

.no-message {
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
