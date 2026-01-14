<template>
  <div class="location-tabs-container">
    <h3>地點資料設定</h3>

    <!-- 其他地點動態摺疊欄 -->
    <div
      v-for="[location_id, location_data] in other_locations_entries"
      :key="location_id"
      class="location-fold-bar"
      :class="{ 'location-incomplete': !isLocationComplete(location_data) }"
    >
      <FoldBarComponent :title="`${location_id}: ${getLocationDisplayName(location_data)}`" :is-open="false">
        <template #title-actions>
          <button class="remove-location-btn" title="移除地點" @click="removeLocation(location_id)">
            <span>×</span>
          </button>
        </template>
        <div class="location-info-container">
          <div class="section">
            <h4>基本資訊</h4>
            <div class="form-grid">
              <div class="input-group">
                <label>地點</label>
                <input v-model="location_data.name" type="text" placeholder="例如：魔法森林" class="text-input" />
                <div v-if="location_data.generated_name" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ location_data.generated_name }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(location_id, 'name', location_data.generated_name)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>位置</label>
                <input v-model="location_data.location" type="text" placeholder="例如：森林深處" class="text-input" />
                <div v-if="location_data.generated_location" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ location_data.generated_location }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(location_id, 'location', location_data.generated_location)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>描述</label>
                <textarea
                  v-model="location_data.description"
                  placeholder="描述地點的特點..."
                  class="text-area"
                  rows="3"
                ></textarea>
                <div v-if="location_data.generated_description" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ location_data.generated_description }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(location_id, 'description', location_data.generated_description)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>子地點生成結果</label>
                <div
                  v-if="location_data.generated_sub_location && location_data.generated_sub_location.length > 0"
                  class="generated-result"
                >
                  <label>生成結果：</label>
                  <div class="generated-text">{{ location_data.generated_sub_location.join(', ') }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(location_id, 'sub_location', location_data.generated_sub_location)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>子地點</label>
                <div class="sub-locations-container">
                  <div
                    v-for="(sub_location_id, index) in location_data.sub_location || []"
                    :key="index"
                    class="sub-location-item"
                  >
                    <select
                      :value="sub_location_id"
                      class="text-input"
                      @change="updateSubLocation(location_id, index, ($event.target as HTMLSelectElement).value)"
                    >
                      <option value="">選擇子地點...</option>
                      <option
                        v-for="[other_location_id, other_location_data] in chat_locations"
                        :key="other_location_id"
                        :value="other_location_id"
                        :disabled="other_location_id === location_id"
                      >
                        {{ other_location_id }}: {{ getLocationDisplayName(other_location_data) }}
                      </option>
                    </select>
                    <button class="remove-sub-location-btn" @click="removeSubLocation(location_id, index)">
                      <span>×</span>
                    </button>
                  </div>
                  <button class="add-sub-location-btn" @click="addSubLocation(location_id)">
                    <span>+ 添加子地點</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 生成要求區域 -->
          <div class="section">
            <h4>生成要求</h4>
            <div class="form-grid">
              <div class="input-group full-width">
                <label>對AI生成的要求</label>
                <textarea
                  v-model="location_data.generation_requirement"
                  placeholder="對AI生成的要求..."
                  class="text-area"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 生成按鈕區域 -->
          <div class="action-section">
            <button
              class="generate-btn"
              :disabled="!hasWorldInfo || is_generating.get(location_id)"
              @click="generateLocationProfile(location_id)"
            >
              <span v-if="is_generating.get(location_id)" class="loading-spinner"></span>
              {{
                is_generating.get(location_id)
                  ? '生成中...'
                  : hasWorldInfo
                    ? '生成未填寫的字段'
                    : '請先完成世界背景設定'
              }}
            </button>
            <button
              class="apply-all-btn"
              :disabled="!hasGeneratedResults(location_data)"
              @click="applyAllGeneratedResults(location_id)"
            >
              應用全部
            </button>
          </div>
        </div>
      </FoldBarComponent>
    </div>

    <!-- 批量生成地點區域 -->
    <div class="bulk-generate-section">
      <h4>批量生成地點</h4>
      <div class="form-grid">
        <div class="input-group">
          <label>生成數量</label>
          <div class="count-input-row">
            <input
              v-model.number="bulk_generate_count"
              type="number"
              min="1"
              max="10"
              class="text-input count-input"
              placeholder="1-10"
              :disabled="allow_ai_determine_count"
            />
            <div class="ai-count-checkbox">
              <input id="allow_ai_count" v-model="allow_ai_determine_count" type="checkbox" />
              <label for="allow_ai_count">讓AI決定生成數量</label>
            </div>
          </div>
        </div>
        <div class="input-group full-width">
          <label>批量生成要求</label>
          <textarea
            v-model="bulk_generation_requirement"
            placeholder="描述要生成的地點類型、主題等..."
            class="text-area"
            rows="3"
          ></textarea>
        </div>
      </div>
      <button
        class="bulk-generate-btn"
        :disabled="
          !hasWorldInfo ||
          is_bulk_generating ||
          (!allow_ai_determine_count && (bulk_generate_count < 1 || bulk_generate_count > 10))
        "
        @click="generateBulkLocations"
      >
        <span v-if="is_bulk_generating" class="loading-spinner"></span>
        {{
          is_bulk_generating
            ? '批量生成中...'
            : hasWorldInfo
              ? allow_ai_determine_count
                ? '讓AI決定生成數量'
                : `生成 ${bulk_generate_count} 個地點`
              : '請先完成世界背景設定'
        }}
      </button>
    </div>

    <!-- 添加地點按鈕 -->
    <div class="add-location-section">
      <button class="add-location-btn" @click="addNewLocation">
        <span>+ 添加地點</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import FoldBarComponent from '../common_elements/fold_bar.vue';

// 地點資料結構
interface LocationData {
  id?: string;
  name?: string;
  location?: string;
  description?: string;
  sub_location?: string[];
  generation_requirement?: string;
  // 生成結果
  generated_name?: string;
  generated_location?: string;
  generated_description?: string;
  generated_sub_location?: string[];
}

// 獲取聊天變數中的地點資料
const chat_locations = ref<Map<string, LocationData>>(new Map());

// 生成狀態
const is_generating = ref<Map<string, boolean>>(new Map());

// 批量生成狀態
const is_bulk_generating = ref(false);
const bulk_generate_count = ref(3);
const bulk_generation_requirement = ref('');
const allow_ai_determine_count = ref(false);

// 常量
const GENERATED_FIELDS = ['generated_name', 'generated_location', 'generated_description'];
const REQUIRED_FIELDS = ['generated_name', 'generated_location', 'generated_description', 'generated_sub_location'];

// 檢查是否有世界背景
const hasWorldInfo = computed(() => {
  try {
    const variables = getVariables({ type: 'chat' });
    return !!variables?.world_info?.trim();
  } catch {
    return false;
  }
});

// 為模板提供 entries 形式的數據
const other_locations_entries = computed(() => {
  return Array.from(chat_locations.value.entries());
});

// 獲取地點顯示名稱
const getLocationDisplayName = (location_data: LocationData): string => {
  return location_data?.name || '未知地點';
};

// 檢查是否有任何生成結果
const hasGeneratedResults = (location_data: LocationData): boolean => {
  return !!(
    location_data?.generated_name ||
    location_data?.generated_location ||
    location_data?.generated_description ||
    location_data?.generated_sub_location
  );
};

// 檢查地點資料是否完整填寫
const isLocationComplete = (location_data: LocationData): boolean => {
  return !!(location_data?.name?.trim() && location_data?.location?.trim() && location_data?.description?.trim());
};

// 初始化地點的所有字段
const initializeLocationFields = (location: LocationData) => {
  // 初始化生成結果字段
  GENERATED_FIELDS.forEach(field => {
    if (!(location as any)[field]) {
      (location as any)[field] = '';
    }
  });

  // 初始化數組字段
  if (!location.generated_sub_location) {
    location.generated_sub_location = [];
  }
  if (!location.sub_location) {
    location.sub_location = [];
  }

  // 初始化字符串字段
  if (!location.location) {
    location.location = '';
  }
  if (!location.generated_location) {
    location.generated_location = '';
  }

  // 初始化其他字段
  if (!location.generation_requirement) {
    location.generation_requirement = '';
  }
};

// 載入聊天變數中的地點資料
const loadChatLocations = () => {
  try {
    const variables = getVariables({ type: 'chat' });

    if (variables?.locations) {
      const locations_map = new Map<string, LocationData>();
      for (const [location_id, location_data] of Object.entries(variables.locations)) {
        const location = reactive(location_data as LocationData);
        initializeLocationFields(location);
        locations_map.set(location_id, location);
      }
      chat_locations.value = locations_map;
    } else {
      chat_locations.value = new Map();
    }
  } catch (error) {
    console.error('載入地點資料失敗:', error);
    chat_locations.value = new Map();
  }

  // 載入生成結果
  try {
    for (const [location_id, location] of chat_locations.value) {
      const storedGenerated = localStorage.getItem(`location_profile_generated_${location_id}`);
      if (storedGenerated) {
        Object.assign(location, JSON.parse(storedGenerated));
      }
    }
  } catch (error) {
    console.error('Failed to load generated location profiles from localStorage:', error);
  }

  // 載入批量生成要求
  try {
    const storedBulkRequirement = localStorage.getItem('bulk_location_generation_requirement');
    if (storedBulkRequirement) {
      bulk_generation_requirement.value = storedBulkRequirement;
    }

    const storedAllowAiCount = localStorage.getItem('bulk_location_allow_ai_count');
    if (storedAllowAiCount) {
      allow_ai_determine_count.value = storedAllowAiCount === 'true';
    }
  } catch (error) {
    console.error('Failed to load bulk generation settings from localStorage:', error);
  }
};

// 保存地點資料
const saveLocationData = (location_id: string) => {
  try {
    // 獲取當前聊天變數
    const variables = getVariables({ type: 'chat' });
    const locations = { ...(variables.locations || {}) };

    // 獲取當前地點資料
    const location_data = chat_locations.value.get(location_id);
    if (!location_data) return;

    // 更新地點資料
    locations[location_id] = {
      name: location_data.name || '',
      location: location_data.location || '',
      description: location_data.description || '',
      sub_location: location_data.sub_location || [],
    };

    // 保存到聊天變數
    variables['locations'] = locations;
    replaceVariables(variables, { type: 'chat' });
  } catch (error) {
    console.error(`保存地點 ${location_id} 資料失敗:`, error);
  }
};

// 監聽聊天變數變化
watch(
  () => getVariables({ type: 'chat' }),
  new_variables => {
    if (new_variables?.locations) {
      const locationsMap = new Map<string, LocationData>();
      for (const [location_id, location_data] of Object.entries(new_variables.locations)) {
        const location = reactive(location_data as LocationData);
        initializeLocationFields(location);
        locationsMap.set(location_id, location);
      }
      chat_locations.value = locationsMap;
    }
  },
  { deep: true },
);

// 監聽地點資料變化並自動保存
watch(
  chat_locations,
  () => {
    // 當地點資料發生變化時，遍歷所有地點並保存
    for (const [location_id] of chat_locations.value.entries()) {
      saveLocationData(location_id);
    }
  },
  { deep: true },
);

// 監聽 generation_requirement 變化並保存到 localStorage
watch(
  () => chat_locations.value,
  newLocations => {
    for (const [location_id, location] of newLocations.entries()) {
      watch(
        () => location.generation_requirement,
        newValue => {
          try {
            const storedGenerated = localStorage.getItem(`location_profile_generated_${location_id}`);
            const generatedData = storedGenerated ? JSON.parse(storedGenerated) : {};
            generatedData.generation_requirement = newValue;
            localStorage.setItem(`location_profile_generated_${location_id}`, JSON.stringify(generatedData));
          } catch (error) {
            console.error(`Failed to save generation_requirement for ${location_id} to localStorage:`, error);
          }
        },
        { immediate: false },
      );
    }
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  loadChatLocations();
});

// 生成下一個可用的地點ID
const generateNextLocationId = (): string => {
  const existingIds = Array.from(chat_locations.value.keys());
  let nextId = 1; // 從l1開始

  while (existingIds.includes(`l${nextId}`)) {
    nextId++;
  }

  return `l${nextId}`;
};

// 將 object 格式轉換為 string
const castObjectToString = (object: [string, any]): string => {
  return (
    '[' +
    Object.entries(object)
      .map(([key, value]) => (typeof value === 'string' ? `'${key}':'${value}'` : `'${key}':${value}`))
      .join(', ') +
    ']'
  );
};

// 通用生成結果應用函數
const applyGeneratedField = (location_id: string, field_name: string, generated_value: string | string[]) => {
  const location_data = chat_locations.value.get(location_id);
  if (!location_data) return;

  const fieldMappings: Record<string, { field: keyof LocationData; parser?: (val: any) => any }> = {
    name: { field: 'name' },
    location: { field: 'location' },
    description: { field: 'description' },
    sub_location: { field: 'sub_location', parser: (val: any) => val },
  };

  const mapping = fieldMappings[field_name];
  if (mapping) {
    const parsedValue = mapping.parser ? mapping.parser(generated_value) : generated_value;
    (location_data as any)[mapping.field] = parsedValue;
    (location_data as any)[`generated_${field_name}`] = '';
  }

  // 更新 Map
  chat_locations.value.set(location_id, { ...location_data });
  saveLocationData(location_id);
};

// 應用所有生成結果
const applyAllGeneratedResults = (location_id: string) => {
  const location_data = chat_locations.value.get(location_id);
  if (!location_data) return;

  // 應用生成結果到對應字段
  REQUIRED_FIELDS.forEach(field => {
    const generated_field = field as keyof LocationData;
    const target_field = field.replace('generated_', '') as keyof LocationData;
    const generated_value = location_data[generated_field];

    if (generated_value) {
      (location_data as any)[target_field] = generated_value;
      (location_data as any)[generated_field] = field === 'generated_sub_location' ? [] : '';
    }
  });

  // 更新 Map
  chat_locations.value.set(location_id, { ...location_data });

  // 保存資料
  saveLocationData(location_id);

  // 清除 localStorage
  try {
    localStorage.removeItem(`location_profile_generated_${location_id}`);
  } catch (error) {
    console.error(`Failed to remove generated location profile for ${location_id} from localStorage:`, error);
  }
};

// 添加新地點
const addNewLocation = () => {
  const newLocationId = generateNextLocationId();

  // 創建新的空地點資料
  const newLocation: LocationData = {
    name: '',
    location: '',
    description: '',
    sub_location: [],
    generation_requirement: '',
    // 生成結果欄位
    generated_name: '',
    generated_location: '',
    generated_description: '',
    generated_sub_location: [],
  };

  // 添加到本地狀態
  const reactiveNewLocation = reactive(newLocation);
  chat_locations.value.set(newLocationId, reactiveNewLocation);

  // 保存到聊天變數
  try {
    const variables = getVariables({ type: 'chat' });
    const locations = variables.locations || {};
    locations[newLocationId] = {
      name: '',
      location: '',
      description: '',
      sub_location: [],
    };
    insertOrAssignVariables({ locations }, { type: 'chat' });
  } catch (error) {
    console.error('Failed to add new location to chat variables:', error);
  }
};

// 移除地點
const removeLocation = (location_id: string) => {
  // 從本地狀態移除
  chat_locations.value.delete(location_id);

  // 從聊天變數移除
  try {
    const variables = getVariables({ type: 'chat' });
    delete variables.locations[location_id];
    replaceVariables(variables, { type: 'chat' });
  } catch (error) {
    console.error(`Failed to remove location ${location_id} from chat variables:`, error);
  }
};

// 添加子地點
const addSubLocation = (location_id: string) => {
  const location_data = chat_locations.value.get(location_id);
  if (!location_data) return;

  if (!location_data.sub_location) {
    location_data.sub_location = [];
  }

  location_data.sub_location.push('');
  chat_locations.value.set(location_id, { ...location_data });
  saveLocationData(location_id);
};

// 移除子地點
const removeSubLocation = (location_id: string, index: number) => {
  const location_data = chat_locations.value.get(location_id);
  if (!location_data || !location_data.sub_location) return;

  location_data.sub_location.splice(index, 1);
  chat_locations.value.set(location_id, { ...location_data });
  saveLocationData(location_id);
};

// 更新子地點
const updateSubLocation = (location_id: string, index: number, value: string) => {
  const location_data = chat_locations.value.get(location_id);
  if (!location_data || !location_data.sub_location) return;

  location_data.sub_location[index] = value;
  chat_locations.value.set(location_id, { ...location_data });
  saveLocationData(location_id);
};

// 獲取地點生成提示
const getLocationPrompt = (location_data: LocationData): string => {
  let location_prompt = `請根據世界背景資訊、生成要求及已有地點資料，為以下地點完善地點資料設定：\n\n`;
  location_prompt += `id：${location_data.id || ''}\n`;
  location_prompt += `地點：${location_data.name || ''}\n`;
  location_prompt += `位置：${location_data.location || ''}\n`;
  location_prompt += `描述：${location_data.description || ''}\n`;
  location_prompt += `子地點：${location_data.sub_location && location_data.sub_location.length > 0 ? JSON.stringify(location_data.sub_location) : '[]'}\n`;
  location_prompt += `\n請生成一個唯一的地點ID，格式必須是 "l1", "l2", "l3", ... 且不能與現有地點ID重複。\n`;
  return location_prompt;
};

// 獲取生成前世界背景系統提示
const getPreWorldInfoSystemPrompt = (): string => {
  const variable = getVariables({ type: 'chat' });
  const world_info: string = variable.world_info;
  let character_description = getCharData('current')!.description;
  character_description = character_description.replace('{{getvar::world_info}}', world_info);
  let pre_world_info_system_prompt =
    '你是一個專業的地點設計助手，擅長創造豐富多彩的地點設定。請根據提供的世界背景及生成要求，為地點完善資料。\n';
  pre_world_info_system_prompt += '\n';
  pre_world_info_system_prompt += '<世界背景>\n';
  return pre_world_info_system_prompt;
};

// 通用角色字段列表
const CHARACTER_FIELDS = [
  '姓氏', '名字', '年齡', '性別', '身份', '身高', '體重', '胸圍', '罩杯', '腰圍', '臀圍',
  '髮型', '樣貌', '衣著', '簡介', '性格', '愛好', '金錢', '生日月份', '生日日期', '其他重要資訊'
];

const CHARACTER_RELATION_FIELDS = ['關係', '友好度', '愛情度'];

// 生成角色狀態提示的通用函數
const generateCharacterStatusPrompt = (character_state: any, character_id: string, include_additional_fields = false): string => {
  let prompt = `id：${character_id}\n`;

  // 基本字段
  CHARACTER_FIELDS.forEach(field => {
    prompt += `  ${field}：${character_state[field] || ''}\n`;
  });

  // 額外字段（用於非用戶角色）
  if (include_additional_fields) {
    prompt += `  心情：${character_state.心情 || ''}\n`;
    prompt += `  性慾：${character_state.性慾 || ''}\n`;
  }

  // 關係字段
  CHARACTER_RELATION_FIELDS.forEach(field => {
    prompt += `  ${field}：${castObjectToString(character_state[field])}\n`;
  });

  return prompt;
};

// 獲取用戶狀態提示
const getUserStatusPrompt = (): string => {
  const variables = getVariables({ type: 'chat' });
  const user_state = variables['characters']['c1'];
  const user_name = `${user_state.姓氏}${user_state.名字}`;
  let user_status_prompt = `<${user_name}Status>\n`;
  user_status_prompt += generateCharacterStatusPrompt(user_state, 'c1');
  user_status_prompt += `</${user_name}Status>`;
  return user_status_prompt;
};

// 獲取角色狀態提示
const getCharacterStatusPrompt = (): string => {
  const variables = getVariables({ type: 'chat' });
  const characters = variables['characters'];
  if (characters === undefined) return '';

  let character_status_prompt = `<CharacterStatus>\n`;
  for (const [key, character_state] of Object.entries(characters) as [string, any]) {
    if (key === 'c1') continue;
    character_status_prompt += generateCharacterStatusPrompt(character_state, key, true) + '\n';
  }
  character_status_prompt += `</CharacterStatus>`;
  return character_status_prompt;
};

const getLocationTablePrompt = (): string => {
  let location_table_prompt = '<LocationTable>\n';
  location_table_prompt += '|id|地點|位置|描述|子地點|\n';
  location_table_prompt += '|---|---|---|---|---|\n';
  const variables = getVariables({ type: 'chat' });
  const locations = variables['locations'];
  if (locations === undefined) return '';
  for (const [key, location] of Object.entries(locations) as [string, any]) {
    const subLocations = location.sub_location ? location.sub_location.join(', ') : '';
    location_table_prompt += `|${key}|${location.name}|${location.location || ''}|${location.description}|${subLocations}|\n`;
  }
  location_table_prompt += '</LocationTable>';
  return location_table_prompt;
};

const getExtraWorldInfoPrompt = (): string => {
  let extra_world_info_prompt = '';
  const variables = getVariables({ type: 'chat' });
  const extra_world_infos = variables['extra_world_info'];
  if (extra_world_infos === undefined) return '';
  for (const extra_world_info of Array.from(extra_world_infos) as { name: string; content: string }[]) {
    if (extra_world_info.name === '' || extra_world_info.content === '') continue;
    extra_world_info_prompt += `<${extra_world_info.name}>\n`;
    extra_world_info_prompt += `${extra_world_info.content}\n`;
    extra_world_info_prompt += `</${extra_world_info.name}>\n`;
    extra_world_info_prompt += '\n';
  }
  return extra_world_info_prompt;
};

// 獲取生成後世界背景系統提示
const getPostWorldInfoSystemPrompt = (location_data: LocationData): string => {
  let post_world_info_system_prompt = '\n</世界背景>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getUserStatusPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getCharacterStatusPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getLocationTablePrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getExtraWorldInfoPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<生成要求>\n';
  post_world_info_system_prompt += `${location_data.generation_requirement || '無特殊要求'}\n`;
  post_world_info_system_prompt += '</生成要求>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<子地點說明>\n';
  post_world_info_system_prompt += '子地點表示直接包含在當前地點內的子區域。例如：\n';
  post_world_info_system_prompt += '- 如果地點 l2 位於地點 l1 內，則 l2 是 l1 的子地點\n';
  post_world_info_system_prompt += '- 如果地點 l3 是 l2 的子地點，則 l3 不是 l1 的子地點（因為 l3 間接位於 l1 內）\n';
  post_world_info_system_prompt += '- 子地點id必須是現有的地點id，不能使用不存在的id\n';
  post_world_info_system_prompt += '</子地點說明>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<example>\n';
  post_world_info_system_prompt +=
    '# The following is an example of user input and expected output. Please strictly follow the style and format to generate the output. Output anything other than this format is prohibited.\n';
  post_world_info_system_prompt += `id：l1\n`;
  post_world_info_system_prompt += `地點：'地點名稱'\n`;
  post_world_info_system_prompt += `位置：'地點的地理位置'\n`;
  post_world_info_system_prompt += `描述：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `子地點：['l2', 'l4']\n`;
  post_world_info_system_prompt += '</example>\n';
  return post_world_info_system_prompt;
};

// 通用字段解析映射
const FIELD_PARSERS: Record<string, { field: keyof LocationData; parser: (val: string) => any }> = {
  'id': { field: 'id', parser: (val: string) => val.replace(/^["']|["']$/g, '') },
  '地點': { field: 'name', parser: (val: string) => val.replace(/^["']|["']$/g, '') },
  '位置': { field: 'location', parser: (val: string) => val.replace(/^["']|["']$/g, '') },
  '描述': { field: 'description', parser: (val: string) => val.replace(/^["']|["']$/g, '') },
  '子地點': {
    field: 'sub_location',
    parser: (val: string) => {
      try {
        let parsedValue = val;
        if (parsedValue.startsWith("'") && parsedValue.endsWith("'")) {
          parsedValue = parsedValue.slice(1, -1);
        }
        parsedValue = parsedValue.replace(/'/g, '"');
        const subLocations = JSON.parse(parsedValue);
        return Array.isArray(subLocations) ? subLocations : [];
      } catch (error) {
        console.warn('Failed to parse sub_location:', val, error);
        return [];
      }
    }
  }
};

// 解析單行數據的通用函數
const parseLocationLine = (line: string, target: LocationData, is_generated = false) => {
  const colonIndex = line.indexOf('：'); // 注意：這裡是全角冒號
  if (colonIndex <= 0) return;

  const key = line.substring(0, colonIndex).trim();
  const value = line.substring(colonIndex + 1).trim();

  const parser = FIELD_PARSERS[key];
  if (parser) {
    const field_name = is_generated ? `generated_${parser.field}` : parser.field;
    (target as any)[field_name] = parser.parser(value);
  }
};

// 解析批量生成的地點數據
const parseBulkGeneratedData = (result: string): LocationData[] => {
  const locations: LocationData[] = [];
  const sections = result
    .split('---')
    .map(section => section.trim())
    .filter(section => section);

  for (const section of sections) {
    const lines = section.split('\n');
    const locationData: LocationData = {
      id: '',
      name: '',
      location: '',
      description: '',
      sub_location: [],
    };

    lines.forEach(line => parseLocationLine(line, locationData));

    // 只添加有名稱的地點
    if (locationData.name && locationData.name.trim()) {
      locations.push(locationData);
    }
  }

  return locations;
};

// 獲取批量生成後世界背景系統提示
const getPostWorldInfoSystemPromptForBulk = (): string => {
  let post_world_info_system_prompt = '\n</世界背景>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getUserStatusPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getCharacterStatusPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getLocationTablePrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getExtraWorldInfoPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<子地點說明>\n';
  post_world_info_system_prompt += '子地點表示直接包含在當前地點內的子區域。例如：\n';
  post_world_info_system_prompt += '- 如果地點 l2 位於地點 l1 內，則 l2 是 l1 的子地點\n';
  post_world_info_system_prompt += '- 如果地點 l3 是 l2 的子地點，則 l3 不是 l1 的子地點（因為 l3 間接位於 l1 內）\n';
  post_world_info_system_prompt += '- 子地點id必須是現有的地點id，不能使用不存在的id\n';
  post_world_info_system_prompt += '</子地點說明>\n';
  post_world_info_system_prompt += '\n';

  if (allow_ai_determine_count.value) {
    post_world_info_system_prompt += '<生成數量說明>\n';
    post_world_info_system_prompt += '請根據世界背景和生成要求決定生成適當數量的地點。\n';
    post_world_info_system_prompt += '請根據世界背景的複雜度和生成要求的具體性來決定數量。\n';
    post_world_info_system_prompt += '</生成數量說明>\n';
    post_world_info_system_prompt += '\n';
  }

  post_world_info_system_prompt += '<example>\n';
  post_world_info_system_prompt +=
    '# The following is an example of user input and expected output. Please strictly follow the style and format to generate the output. Output anything other than this format is prohibited.\n';
  post_world_info_system_prompt += `id：l1\n`;
  post_world_info_system_prompt += `地點：'地點名稱'\n`;
  post_world_info_system_prompt += `位置：'地點的地理位置'\n`;
  post_world_info_system_prompt += `描述：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `子地點：['id', ...]\n`;
  post_world_info_system_prompt += '\n---\n';
  post_world_info_system_prompt += `id：l2\n`;
  post_world_info_system_prompt += `地點：'地點名稱'\n`;
  post_world_info_system_prompt += `位置：'地點的地理位置'\n`;
  post_world_info_system_prompt += `描述：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `子地點：['id', ...]\n`;
  post_world_info_system_prompt += '</example>\n';
  return post_world_info_system_prompt;
};

// 解析生成結果並填充數據
const parseAndFillGeneratedData = (result: string, location_data: LocationData) => {
  const lines = result.split('\n');
  lines.forEach(line => parseLocationLine(line, location_data, true));
};

// 生成地點資料
const generateLocationProfile = async (location_id: string) => {
  const location_data = chat_locations.value.get(location_id);
  if (!location_data) return;

  // 設置生成狀態
  const current_generating = new Map(is_generating.value);
  current_generating.set(location_id, true);
  is_generating.value = current_generating;

  try {
    const location_prompt = getLocationPrompt(location_data);
    const pre_world_info_system_prompt = getPreWorldInfoSystemPrompt();
    const post_world_info_system_prompt = getPostWorldInfoSystemPrompt(location_data);

    const result = await generateRaw({
      user_input: location_prompt,
      ordered_prompts: [
        {
          role: 'system',
          content: pre_world_info_system_prompt,
        },
        'char_description',
        {
          role: 'system',
          content: post_world_info_system_prompt,
        },
        'user_input',
      ],
    });

    // 解析結果並填充到生成字段中
    parseAndFillGeneratedData(result, location_data);

    // 保存生成結果到 localStorage
    try {
      localStorage.setItem(
        `location_profile_generated_${location_id}`,
        JSON.stringify({
          generation_requirement: location_data.generation_requirement,
          generated_name: location_data.generated_name,
          generated_location: location_data.generated_location,
          generated_description: location_data.generated_description,
          generated_sub_location: location_data.generated_sub_location,
        }),
      );
    } catch (error) {
      console.error(`Failed to save generated location profile for ${location_id} to localStorage:`, error);
    }

    // 更新 Map
    chat_locations.value.set(location_id, { ...location_data });
  } catch (error) {
    console.error(`生成地點 ${location_id} 資料失敗:`, error);
    // 設置錯誤消息
    location_data.generated_name = '生成失敗，請重試。';
  } finally {
    // 清除生成狀態
    const current_generating = new Map(is_generating.value);
    current_generating.set(location_id, false);
    is_generating.value = current_generating;
  }
};

// 批量生成地點
const generateBulkLocations = async () => {
  if (!allow_ai_determine_count.value && (bulk_generate_count.value < 1 || bulk_generate_count.value > 10)) return;

  is_bulk_generating.value = true;

  try {
    // 保存批量生成要求到本地存儲
    try {
      localStorage.setItem('bulk_location_generation_requirement', bulk_generation_requirement.value);
      localStorage.setItem('bulk_location_allow_ai_count', allow_ai_determine_count.value.toString());
    } catch (error) {
      console.error('Failed to save bulk generation settings to localStorage:', error);
    }

    // 創建批量生成提示
    const countText = allow_ai_determine_count.value
      ? '請根據世界背景和生成要求自行決定生成適當數量的地點'
      : `請一次性生成 ${bulk_generate_count.value} 個地點`;

    const bulk_prompt = `請根據世界背景資訊和批量生成要求，${countText}。每個地點應包含地點名稱、位置、描述和子地點數組。

批量生成要求：${bulk_generation_requirement.value || '無特殊要求'}

請以以下格式輸出，每個地點占一行：
id：l1
地點：地點名稱
位置：地點的地理位置
描述：地點描述
子地點：['子地點id1', '子地點id2', ...]

---

請注意：
- id格式必須是 "l1", "l2", "l3", ... 且不能與現有地點id重複
- 子地點ID必須是現有的地點id，不能使用不存在的id
`;

    const pre_world_info_system_prompt = getPreWorldInfoSystemPrompt();
    const post_world_info_system_prompt = getPostWorldInfoSystemPromptForBulk();

    const result = await generateRaw({
      user_input: bulk_prompt,
      ordered_prompts: [
        {
          role: 'system',
          content: pre_world_info_system_prompt,
        },
        'char_description',
        {
          role: 'system',
          content: post_world_info_system_prompt,
        },
        'user_input',
      ],
    });

    // 解析批量生成結果
    const newLocations = parseBulkGeneratedData(result);

    // 添加新地點到系統
    for (const locationData of newLocations) {
      // 使用AI生成的ID，如果沒有則自動生成
      const newLocationId = locationData.id || generateNextLocationId();
      const newLocation: LocationData = {
        id: newLocationId,
        name: locationData.name || '',
        location: locationData.location || '',
        description: locationData.description || '',
        sub_location: locationData.sub_location || [],
        generation_requirement: bulk_generation_requirement.value,
        generated_name: '',
        generated_location: '',
        generated_description: '',
        generated_sub_location: [],
      };

      // 添加到本地狀態
      const reactiveNewLocation = reactive(newLocation);
      chat_locations.value.set(newLocationId, reactiveNewLocation);

      // 保存到聊天變數
      try {
        const variables = getVariables({ type: 'chat' });
        const locations = variables.locations || {};
        locations[newLocationId] = {
          name: newLocation.name,
          location: newLocation.location,
          description: newLocation.description,
          sub_location: newLocation.sub_location,
        };
        insertOrAssignVariables({ locations }, { type: 'chat' });
      } catch (error) {
        console.error('Failed to add bulk generated location to chat variables:', error);
      }
    }

    toastr.success(`成功生成 ${newLocations.length} 個地點！`);
  } catch (error) {
    console.error('批量生成地點失敗:', error);
    toastr.error('批量生成失敗，請重試。');
  } finally {
    is_bulk_generating.value = false;
  }
};
</script>

<style lang="scss" scoped>
.location-tabs-container {
  color: #e0e0e0;
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;

  h3 {
    color: #007acc;
    margin-bottom: 24px;
    font-size: 20px;
  }
}

// 地點摺疊欄樣式
.location-fold-bar {
  margin-bottom: 16px;

  // 美化摺疊欄按鈕
  :deep(.fold-bar-btn) {
    background: linear-gradient(135deg, #2a2a2a 0%, #333333 100%);
    border: 1px solid #555;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 600;
    color: #e0e0e0;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #333333 0%, #404040 100%);
      border-color: #666;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  }

  // 美化摺疊欄內容區域
  :deep(.fold-bar-content) {
    background: linear-gradient(135deg, #1a1a1a 0%, #222222 100%);
    border: 1px solid #555;
    border-top: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  // 美化內容文字區域
  :deep(.fold-bar-content-text) {
    padding: 20px;
  }

  // 美化底部收起按鈕
  :deep(.fold-bar-footer-toggle) {
    background: linear-gradient(135deg, #2a2a2a 0%, #333333 100%);
    border-top: 1px solid #555;
    color: #b0b0b0;
    font-size: 13px;
    font-weight: 500;
    padding: 12px 16px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #333333 0%, #404040 100%);
      color: #e0e0e0;
      border-color: #666;
    }
  }

  // 美化切換圖標
  :deep(.fold-bar-toggle-icon) {
    color: #007acc;
    font-size: 14px;
    font-weight: bold;
  }

  // 不完整地點的樣式
  &.location-incomplete {
    :deep(.fold-bar-btn span) {
      color: #ff6b6b !important;
    }
  }
}

// 移除地點按鈕樣式
.remove-location-btn {
  background: #b91c1c;
  border: 1px solid #b91c1c;
  border-radius: 3px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  span {
    line-height: 1;
    margin-top: -1px;
  }
}

.location-info-container {
  .section {
    margin-bottom: 16px;
  }
}

.section {
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #404040;
  margin-bottom: 20px;

  h4 {
    color: #b0b0b0;
    margin-bottom: 16px;
    font-size: 16px;
    border-bottom: 1px solid #404040;
    padding-bottom: 8px;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

// 輸入組樣式
.input-group {
  &.full-width {
    grid-column: 1 / -1;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: #b0b0b0;
    font-weight: 500;
  }
}

.text-input {
  width: 100%;
  padding: 12px 16px;
  background-color: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007acc;
  }

  &::placeholder {
    color: #666;
  }
}

.text-area {
  width: 100%;
  padding: 12px 16px;
  background-color: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007acc;
  }

  &::placeholder {
    color: #666;
  }
}

// 子地點容器樣式
.sub-locations-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-location-item {
  display: flex;
  align-items: center;
  gap: 8px;

  .text-input {
    flex: 1;
  }

  .remove-sub-location-btn {
    background: #b91c1c;
    border: 1px solid #b91c1c;
    border-radius: 3px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    span {
      line-height: 1;
      margin-top: -1px;
    }
  }
}

.add-sub-location-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: 1px solid #28a745;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #218838 0%, #1aa085 100%);
    border-color: #218838;
    transform: translateY(-1px);
  }

  span {
    font-size: 16px;
    font-weight: bold;
  }
}

// 批量生成區域樣式
.bulk-generate-section {
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #404040;
  margin-bottom: 20px;

  h4 {
    color: #007acc;
    margin-bottom: 16px;
    font-size: 16px;
    border-bottom: 1px solid #404040;
    padding-bottom: 8px;
  }
}

// 數量輸入行樣式
.count-input-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.count-input {
  flex: 0 0 auto;
  width: 120px;
}

.ai-count-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #007acc;
    cursor: pointer;
  }

  label {
    color: #b0b0b0;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 0;
    user-select: none;

    &:hover {
      color: #e0e0e0;
    }
  }
}

.bulk-generate-btn {
  padding: 14px 32px;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 16px;

  &:hover:not(:disabled) {
    background-color: #218838;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
}

// 添加地點區域樣式
.add-location-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid #404040;
}

.add-location-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: 1px solid #28a745;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #218838 0%, #1aa085 100%);
    border-color: #218838;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }

  span {
    font-size: 18px;
    font-weight: bold;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .section {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .input-group {
    &.full-width {
      grid-column: 1;
    }
  }

  .location-tabs-container {
    max-width: 100%;
    margin: 0;
  }

  .add-location-section {
    padding: 16px 0;
    margin-top: 16px;
  }

  .add-location-btn {
    padding: 10px 20px;
    font-size: 14px;

    span {
      font-size: 16px;
    }
  }

  .count-input-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .count-input {
    width: 100%;
  }

  .ai-count-checkbox {
    font-size: 13px;
  }

  .remove-location-btn {
    width: 20px;
    height: 20px;
    font-size: 14px;
  }

  // 調整摺疊欄內容的間距
  :deep(.fold-bar-content-text) {
    padding: 16px;
  }

  // 調整動作區域在移動設備上的佈局
  .action-section {
    flex-direction: row;
    align-items: stretch;
    gap: 12px;

    .generate-btn,
    .apply-all-btn {
      flex: 1;
      width: auto;
      max-width: none;
    }
  }
}

// 生成結果樣式
.generated-result {
  margin-top: 8px;
  padding: 8px;
  background-color: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 6px;

  label {
    display: block;
    margin-bottom: 4px;
    color: #007acc;
    font-size: 12px;
    font-weight: 500;
  }

  .generated-text {
    color: #e0e0e0;
    font-size: 14px;
    margin-bottom: 8px;
    word-wrap: break-word;
  }

  .replace-btn {
    padding: 6px 12px;
    background-color: #28a745;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #218838;
    }
  }
}

// 動作區域樣式
.action-section {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 0;

  .generate-btn,
  .apply-all-btn {
    flex: 1;
    max-width: none;
  }
}

.generate-btn {
  padding: 14px 32px;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: #218838;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.apply-all-btn {
  padding: 14px 32px;
  background-color: #007acc;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
}
</style>
