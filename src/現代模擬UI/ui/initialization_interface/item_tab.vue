<template>
  <div class="item-tabs-container">
    <h3>物品資料設定</h3>

    <!-- 其他物品動態摺疊欄 -->
    <div
      v-for="[item_id, item_data] in other_items_entries"
      :key="item_id"
      class="item-fold-bar"
      :class="{ 'item-incomplete': !isItemComplete(item_data) }"
    >
      <FoldBarComponent :title="`${item_id}: ${getItemDisplayName(item_data)}`" :is-open="false">
        <template #title-actions>
          <button class="remove-item-btn" title="移除物品" @click="removeItem(item_id)">
            <span>×</span>
          </button>
        </template>
        <div class="item-info-container">
          <div class="section">
            <h4>基本資訊</h4>
            <div class="form-grid">
              <div class="input-group">
                <label>名稱</label>
                <input v-model="item_data.name" type="text" placeholder="例如：魔法書" class="text-input" />
                <div v-if="item_data.generated_name" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ item_data.generated_name }}</div>
                  <button class="replace-btn" @click="applyGeneratedField(item_id, 'name', item_data.generated_name)">
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>價值</label>
                <input
                  :value="getNumberValue(item_data, 'value')"
                  type="number"
                  placeholder="例如：100"
                  class="text-input"
                  min="0"
                  @input="setNumberValue(item_data, 'value', ($event.target as HTMLInputElement).value)"
                />
                <div v-if="item_data.generated_value" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ item_data.generated_value }}</div>
                  <button class="replace-btn" @click="applyGeneratedField(item_id, 'value', item_data.generated_value)">
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>描述</label>
                <textarea
                  v-model="item_data.description"
                  placeholder="描述物品的特點..."
                  class="text-area"
                  rows="3"
                ></textarea>
                <div v-if="item_data.generated_description" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ item_data.generated_description }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(item_id, 'description', item_data.generated_description)"
                  >
                    使用
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
                  v-model="item_data.generation_requirement"
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
              :disabled="!hasWorldInfo || is_generating.get(item_id)"
              @click="generateItemProfile(item_id)"
            >
              <span v-if="is_generating.get(item_id)" class="loading-spinner"></span>
              {{
                is_generating.get(item_id) ? '生成中...' : hasWorldInfo ? '生成未填寫的字段' : '請先完成世界背景設定'
              }}
            </button>
            <button
              class="apply-all-btn"
              :disabled="!hasGeneratedResults(item_data)"
              @click="applyAllGeneratedResults(item_id)"
            >
              應用全部
            </button>
          </div>
        </div>
      </FoldBarComponent>
    </div>

    <!-- 添加物品按鈕 -->
    <div class="add-item-section">
      <button class="add-item-btn" @click="addNewItem">
        <span>+ 添加物品</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import FoldBarComponent from '../common_elements/fold_bar.vue';

// 通用數字字段處理函數
const getNumberValue = (data: any, field: string): string => {
  const value = data[field] as number | null;
  return value?.toString() || '';
};

const setNumberValue = (data: any, field: string, value: string) => {
  if (value === '' || value.trim() === '') {
    data[field] = null;
  } else {
    const num = parseInt(value);
    data[field] = isNaN(num) ? null : num;
  }
};

// 物品資料結構
interface ItemData {
  name?: string;
  description?: string;
  value?: number | null;
  generation_requirement?: string;
  // 生成結果
  generated_name?: string;
  generated_description?: string;
  generated_value?: string;
}

// 獲取聊天變數中的物品資料
const chat_items = ref<Map<string, ItemData>>(new Map());

// 生成狀態
const is_generating = ref<Map<string, boolean>>(new Map());

// 檢查是否有世界背景
const hasWorldInfo = computed(() => {
  try {
    const variables = getVariables({ type: 'chat' });
    return !!variables?.world_info?.trim();
  } catch {
    return false;
  }
});

// 獲取除了預設物品之外的其他物品
const other_items = computed(() => {
  const items = new Map<string, ItemData>();
  for (const [item_id, item_data] of chat_items.value) {
    items.set(item_id, item_data);
  }
  return items;
});

// 為模板提供 entries 形式的數據
const other_items_entries = computed(() => {
  return Array.from(other_items.value.entries());
});

// 計算每個物品的完成狀態
const itemCompletions = computed(() => {
  const completions: Record<string, boolean> = {};
  for (const [item_id, item_data] of chat_items.value.entries()) {
    completions[item_id] = isItemComplete(item_data);
  }
  return completions;
});

// 獲取物品顯示名稱
const getItemDisplayName = (item_data: ItemData): string => {
  return item_data?.name || '未知物品';
};

// 檢查是否有任何生成結果
const hasGeneratedResults = (item_data: ItemData): boolean => {
  return !!(item_data?.generated_name || item_data?.generated_description || item_data?.generated_value);
};

// 檢查物品資料是否完整填寫
const isItemComplete = (item_data: ItemData): boolean => {
  return !!(item_data?.name?.trim() && item_data?.description?.trim() && item_data?.value !== null);
};

// 初始化物品的生成結果欄位
const initializeGeneratedFields = (item: ItemData) => {
  const generatedFields = ['generated_name', 'generated_description', 'generated_value'];

  generatedFields.forEach(field => {
    if (!(item as any)[field]) {
      (item as any)[field] = '';
    }
  });

  if (!item.generation_requirement) {
    item.generation_requirement = '';
  }
};

// 載入聊天變數中的物品資料
const loadChatItems = () => {
  try {
    const variables = getVariables({ type: 'chat' });

    if (variables?.items) {
      const items_map = new Map<string, ItemData>();
      for (const [item_id, item_data] of Object.entries(variables.items)) {
        const item = reactive(item_data as ItemData);
        initializeGeneratedFields(item);
        items_map.set(item_id, item);
      }
      chat_items.value = items_map;
    } else {
      chat_items.value = new Map();
    }
  } catch (error) {
    console.error('載入物品資料失敗:', error);
    chat_items.value = new Map();
  }

  // 載入生成結果
  try {
    for (const [item_id, item] of chat_items.value) {
      const storedGenerated = localStorage.getItem(`item_profile_generated_${item_id}`);
      if (storedGenerated) {
        Object.assign(item, JSON.parse(storedGenerated));
      }
    }
  } catch (error) {
    console.error('Failed to load generated item profiles from localStorage:', error);
  }
};

// 保存物品資料
const saveItemData = (item_id: string) => {
  try {
    // 獲取當前聊天變數
    const variables = getVariables({ type: 'chat' });
    const items = { ...(variables.items || {}) };

    // 獲取當前物品資料
    const item_data = chat_items.value.get(item_id);
    if (!item_data) return;

    // 更新物品資料
    items[item_id] = {
      name: item_data.name || '',
      description: item_data.description || '',
      value: item_data.value,
    };

    // 保存到聊天變數
    variables['items'] = items;
    replaceVariables(variables, { type: 'chat' });
  } catch (error) {
    console.error(`保存物品 ${item_id} 資料失敗:`, error);
  }
};

// 監聽聊天變數變化
watch(
  () => getVariables({ type: 'chat' }),
  new_variables => {
    if (new_variables?.items) {
      const itemsMap = new Map<string, ItemData>();
      for (const [item_id, item_data] of Object.entries(new_variables.items)) {
        const item = reactive(item_data as ItemData);
        initializeGeneratedFields(item);
        itemsMap.set(item_id, item);
      }
      chat_items.value = itemsMap;
    }
  },
  { deep: true },
);

// 監聽物品資料變化並自動保存
watch(
  chat_items,
  () => {
    // 當物品資料發生變化時，遍歷所有物品並保存
    for (const [item_id] of chat_items.value.entries()) {
      saveItemData(item_id);
    }
  },
  { deep: true },
);

// 監聽 generation_requirement 變化並保存到 localStorage
watch(
  () => chat_items.value,
  newItems => {
    for (const [item_id, item] of newItems.entries()) {
      watch(
        () => item.generation_requirement,
        newValue => {
          try {
            const storedGenerated = localStorage.getItem(`item_profile_generated_${item_id}`);
            const generatedData = storedGenerated ? JSON.parse(storedGenerated) : {};
            generatedData.generation_requirement = newValue;
            localStorage.setItem(`item_profile_generated_${item_id}`, JSON.stringify(generatedData));
          } catch (error) {
            console.error(`Failed to save generation_requirement for ${item_id} to localStorage:`, error);
          }
        },
        { immediate: false },
      );
    }
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  loadChatItems();
});

// 生成下一個可用的物品ID
const generateNextItemId = (): string => {
  const existingIds = Array.from(chat_items.value.keys());
  let nextId = 1; // 從i1開始

  while (existingIds.includes(`i${nextId}`)) {
    nextId++;
  }

  return `i${nextId}`;
};

// 通用生成結果應用函數
const applyGeneratedField = (item_id: string, field_name: string, generated_value: string) => {
  const item_data = chat_items.value.get(item_id);
  if (!item_data) return;

  const fieldMappings: Record<string, { field: keyof ItemData; parser?: (val: string) => any }> = {
    name: { field: 'name' },
    description: { field: 'description' },
    value: { field: 'value', parser: val => parseInt(val) || null },
  };

  const mapping = fieldMappings[field_name];
  if (mapping) {
    const parsedValue = mapping.parser ? mapping.parser(generated_value) : generated_value;
    (item_data as any)[mapping.field] = parsedValue;
    (item_data as any)[`generated_${field_name}`] = '';
  }

  // 更新 Map
  chat_items.value.set(item_id, { ...item_data });
  saveItemData(item_id);
};

// 將舊的 object 格式轉換為 string
const castObjectToString = (object: [string, any]): string => {
  return (
    '[' +
    Object.entries(object)
      .map(([key, value]) => (typeof value === 'string' ? `'${key}':'${value}'` : `'${key}':${value}`))
      .join(', ') +
    ']'
  );
};

// 應用所有生成結果
const applyAllGeneratedResults = (item_id: string) => {
  const item_data = chat_items.value.get(item_id);
  if (!item_data) return;

  // 定義字段映射
  const fieldMappings = [
    { generated: 'generated_name', field: 'name', parser: (val: string) => val },
    { generated: 'generated_description', field: 'description', parser: (val: string) => val },
    { generated: 'generated_value', field: 'value', parser: (val: string) => parseInt(val) || null },
  ];

  // 應用簡單字段
  fieldMappings.forEach(({ generated, field, parser }) => {
    const generatedValue = (item_data as any)[generated];
    if (generatedValue) {
      (item_data as any)[field] = parser(generatedValue);
      (item_data as any)[generated] = '';
    }
  });

  // 更新 Map
  chat_items.value.set(item_id, { ...item_data });

  // 保存資料
  saveItemData(item_id);

  // 清除 localStorage
  try {
    localStorage.removeItem(`item_profile_generated_${item_id}`);
  } catch (error) {
    console.error(`Failed to remove generated item profile for ${item_id} from localStorage:`, error);
  }
};

// 添加新物品
const addNewItem = () => {
  const newItemId = generateNextItemId();

  // 創建新的空物品資料
  const newItem: ItemData = {
    name: '',
    description: '',
    value: null,
    generation_requirement: '',
    // 生成結果欄位
    generated_name: '',
    generated_description: '',
    generated_value: '',
  };

  // 添加到本地狀態
  const reactiveNewItem = reactive(newItem);
  chat_items.value.set(newItemId, reactiveNewItem);

  // 保存到聊天變數
  try {
    const variables = getVariables({ type: 'chat' });
    const items = variables.items || {};
    items[newItemId] = {
      name: '',
      description: '',
      value: null,
    };
    insertOrAssignVariables({ items }, { type: 'chat' });
  } catch (error) {
    console.error('Failed to add new item to chat variables:', error);
  }
};

// 移除物品
const removeItem = (item_id: string) => {
  // 從本地狀態移除
  chat_items.value.delete(item_id);

  // 從聊天變數移除
  try {
    const variables = getVariables({ type: 'chat' });
    delete variables.items[item_id];
    replaceVariables(variables, { type: 'chat' });
  } catch (error) {
    console.error(`Failed to remove item ${item_id} from chat variables:`, error);
  }
};

// 獲取物品生成提示
const getItemPrompt = (item_data: ItemData): string => {
  let item_prompt = `請根據世界背景資訊、生成要求及已有物品資料，為以下物品完善物品資料設定：\n\n`;
  item_prompt += `名稱：${item_data.name || ''}\n`;
  item_prompt += `描述：${item_data.description || ''}\n`;
  item_prompt += `價值：${item_data.value || ''}\n`;
  return item_prompt;
};

// 獲取生成前世界背景系統提示
const getPreWorldInfoSystemPrompt = (): string => {
  const variable = getVariables({ type: 'chat' });
  const world_info: string = variable.world_info;
  let character_description = getCharData('current')!.description;
  character_description = character_description.replace('{{getvar::world_info}}', world_info);
  let pre_world_info_system_prompt =
    '你是一個專業的物品設計助手，擅長創造豐富多彩的物品設定。請根據提供的世界背景及生成要求，為物品完善資料。\n';
  pre_world_info_system_prompt += '\n';
  pre_world_info_system_prompt += '<世界背景>\n';
  return pre_world_info_system_prompt;
};

// 獲取用戶狀態提示
const getUserStatusPrompt = (): string => {
  const variables = getVariables({ type: 'chat' });
  const user_state = variables['characters']['c1'];
  const user_name = `${user_state.姓氏}${user_state.名字}`;
  let user_status_prompt = `<${user_name}Status>\n`;
  user_status_prompt += `id：c1\n`;
  user_status_prompt += `  姓氏：${user_state.姓氏 || ''}\n`;
  user_status_prompt += `  名字：${user_state.名字 || ''}\n`;
  user_status_prompt += `  年齡：${user_state.年齡 || ''}\n`;
  user_status_prompt += `  性別：${user_state.性別 || ''}\n`;
  user_status_prompt += `  身份：${user_state.身份 || ''}\n`;
  user_status_prompt += `  身高：${user_state.身高 || ''}\n`;
  user_status_prompt += `  體重：${user_state.體重 || ''}\n`;
  user_status_prompt += `  胸圍：${user_state.胸圍 || ''}\n`;
  user_status_prompt += `  罩杯：${user_state.罩杯 || ''}\n`;
  user_status_prompt += `  腰圍：${user_state.腰圍 || ''}\n`;
  user_status_prompt += `  臀圍：${user_state.臀圍 || ''}\n`;
  user_status_prompt += `  髮型：${user_state.髮型 || ''}\n`;
  user_status_prompt += `  樣貌：${user_state.樣貌 || ''}\n`;
  user_status_prompt += `  衣著：${user_state.衣著 || ''}\n`;
  user_status_prompt += `  簡介：${user_state.簡介 || ''}\n`;
  user_status_prompt += `  性格：${user_state.性格 || ''}\n`;
  user_status_prompt += `  愛好：${user_state.愛好 || ''}\n`;
  user_status_prompt += `  金錢：${user_state.金錢 || ''}\n`;
  user_status_prompt += `  生日月份：${user_state.生日月份 || ''}\n`;
  user_status_prompt += `  生日日期：${user_state.生日日期 || ''}\n`;
  user_status_prompt += `  其他重要資訊：${user_state.其他重要資訊 || ''}\n`;
  user_status_prompt += `  關係：${castObjectToString(user_state.關係)}\n`;
  user_status_prompt += `  友好度：${castObjectToString(user_state.友好度)}\n`;
  user_status_prompt += `  愛情度：${castObjectToString(user_state.愛情度)}\n`;
  user_status_prompt += `</${user_name}Status>`;
  return user_status_prompt;
};

// 獲取角色狀態提示
const getCharacterStatusPrompt = (): string => {
  const variables = getVariables({ type: 'chat' });
  const characters = variables['characters'];
  if (characters === undefined) return ''
  let character_status_prompt = `<CharacterStatus>\n`;
  for (const [key, character_state] of Object.entries(characters) as [string, any]) {
    if (key === 'c1') continue;
    character_status_prompt += `id：${key}\n`;
    character_status_prompt += `  姓氏：${character_state.姓氏 || ''}\n`;
    character_status_prompt += `  名字：${character_state.名字 || ''}\n`;
    character_status_prompt += `  年齡：${character_state.年齡 || ''}\n`;
    character_status_prompt += `  性別：${character_state.性別 || ''}\n`;
    character_status_prompt += `  身份：${character_state.身份 || ''}\n`;
    character_status_prompt += `  身高：${character_state.身高 || ''}\n`;
    character_status_prompt += `  體重：${character_state.體重 || ''}\n`;
    character_status_prompt += `  胸圍：${character_state.胸圍 || ''}\n`;
    character_status_prompt += `  罩杯：${character_state.罩杯 || ''}\n`;
    character_status_prompt += `  腰圍：${character_state.腰圍 || ''}\n`;
    character_status_prompt += `  臀圍：${character_state.臀圍 || ''}\n`;
    character_status_prompt += `  髮型：${character_state.髮型 || ''}\n`;
    character_status_prompt += `  樣貌：${character_state.樣貌 || ''}\n`;
    character_status_prompt += `  衣著：${character_state.衣著 || ''}\n`;
    character_status_prompt += `  簡介：${character_state.簡介 || ''}\n`;
    character_status_prompt += `  性格：${character_state.性格 || ''}\n`;
    character_status_prompt += `  愛好：${character_state.愛好 || ''}\n`;
    character_status_prompt += `  金錢：${character_state.金錢 || ''}\n`;
    character_status_prompt += `  心情：${character_state.心情 || ''}\n`;
    character_status_prompt += `  性慾：${character_state.性慾 || ''}\n`;
    character_status_prompt += `  生日月份：${character_state.生日月份 || ''}\n`;
    character_status_prompt += `  生日日期：${character_state.生日日期 || ''}\n`;
    character_status_prompt += `  其他重要資訊：${character_state.其他重要資訊 || ''}\n`;
    character_status_prompt += `  關係：${castObjectToString(character_state.關係)}\n`;
    character_status_prompt += `  友好度：${castObjectToString(character_state.友好度)}\n`;
    character_status_prompt += `  愛情度：${castObjectToString(character_state.愛情度)}\n\n`;
  }
  character_status_prompt += `</CharacterStatus>`;
  return character_status_prompt;
};

const getItemTablePrompt = (): string => {
  let item_table_prompt = '<ItemTable>\n';
  item_table_prompt += '|id|名稱|描述|價值|\n';
  item_table_prompt += '|---|---|---|---|\n';
  const variables = getVariables({ type: 'chat' });
  const items = variables['items'];
  if (items === undefined) return ''
  for (const [key, item] of Object.entries(items) as [string, any]) {
    item_table_prompt += `|${key}|${item.name}|${item.description}|${item.value}|\n`;
  }
  item_table_prompt += '</ItemTable>';
  return item_table_prompt;
};

const getExtraWorldInfoPrompt = (): string => {
  let extra_world_info_prompt = '';
  const variables = getVariables({ type: 'chat' });
  const extra_world_infos = variables['extra_world_info'];
  if (extra_world_infos === undefined) return ''
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
const getPostWorldInfoSystemPrompt = (item_data: ItemData): string => {
  let post_world_info_system_prompt = '\n</世界背景>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getUserStatusPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getCharacterStatusPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getItemTablePrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getExtraWorldInfoPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<生成要求>\n';
  post_world_info_system_prompt += `${item_data.generation_requirement || '無特殊要求'}\n`;
  post_world_info_system_prompt += '</生成要求>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<example>\n';
  post_world_info_system_prompt +=
    '# The following is an example of user input and expected output. Please strictly follow the style and format to generate the output. Output anything other than this format is prohibited.\n';
  post_world_info_system_prompt += `名稱：string\n`;
  post_world_info_system_prompt += `描述：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `價值：number\n`;
  post_world_info_system_prompt += '</example>\n';
  return post_world_info_system_prompt;
};

// 解析生成結果並填充數據
const parseAndFillGeneratedData = (result: string, item_data: ItemData) => {
  // 根據換行符分割每一行
  const lines = result.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf('：'); // 注意：這裡是全角冒號
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();

      // 映射到我們的字段
      switch (key) {
        case '名稱':
          item_data.generated_name = value.replace(/^["']|["']$/g, '');
          break;
        case '描述':
          item_data.generated_description = value.replace(/^["']|["']$/g, '');
          break;
        case '價值':
          item_data.generated_value = value.replace(/[^\d]/g, '');
          break;
      }
    }
  }
};

// 生成物品資料
const generateItemProfile = async (item_id: string) => {
  const item_data = chat_items.value.get(item_id);
  if (!item_data) return;

  // 設置生成狀態
  const current_generating = new Map(is_generating.value);
  current_generating.set(item_id, true);
  is_generating.value = current_generating;

  try {
    const item_prompt = getItemPrompt(item_data);
    const pre_world_info_system_prompt = getPreWorldInfoSystemPrompt();
    const post_world_info_system_prompt = getPostWorldInfoSystemPrompt(item_data);

    const result = await generateRaw({
      user_input: item_prompt,
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
    parseAndFillGeneratedData(result, item_data);

    // 保存生成結果到 localStorage
    try {
      localStorage.setItem(
        `item_profile_generated_${item_id}`,
        JSON.stringify({
          generation_requirement: item_data.generation_requirement,
          generated_name: item_data.generated_name,
          generated_description: item_data.generated_description,
          generated_value: item_data.generated_value,
        }),
      );
    } catch (error) {
      console.error(`Failed to save generated item profile for ${item_id} to localStorage:`, error);
    }

    // 更新 Map
    chat_items.value.set(item_id, { ...item_data });
  } catch (error) {
    console.error(`生成物品 ${item_id} 資料失敗:`, error);
    // 設置錯誤消息
    item_data.generated_name = '生成失敗，請重試。';
  } finally {
    // 清除生成狀態
    const current_generating = new Map(is_generating.value);
    current_generating.set(item_id, false);
    is_generating.value = current_generating;
  }
};
</script>

<style lang="scss" scoped>
.item-tabs-container {
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

// 物品摺疊欄樣式
.item-fold-bar {
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

  // 不完整物品的樣式
  &.item-incomplete {
    :deep(.fold-bar-btn span) {
      color: #ff6b6b !important;
    }
  }
}

// 移除物品按鈕樣式
.remove-item-btn {
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

.item-info-container {
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

// 添加物品區域樣式
.add-item-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid #404040;
}

.add-item-btn {
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

  .item-tabs-container {
    max-width: 100%;
    margin: 0;
  }

  .add-item-section {
    padding: 16px 0;
    margin-top: 16px;
  }

  .add-item-btn {
    padding: 10px 20px;
    font-size: 14px;

    span {
      font-size: 16px;
    }
  }

  .remove-item-btn {
    width: 20px;
    height: 20px;
    font-size: 14px;
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
