<template>
  <div class="world-info-container">
    <div class="world-info-content">
      <h3>世界資訊</h3>

      <div class="section">
        <div class="sortable-container">
          <template v-for="(item, index) in fold_items" :key="item.id">
            <div
              v-if="drop_target_index === index && dragged_index !== null && dragged_index !== index"
              class="drop-indicator"
            ></div>

            <div
              class="sortable-item"
              :class="{ dragging: dragged_index === index }"
              :data-id="item.id"
              draggable="true"
              @dragstart="onDragStart($event, index)"
              @dragover.prevent="onDragOver($event, index)"
              @drop="onDrop($event, index)"
              @dragend="onDragEnd"
              @dragleave="onDragLeave"
            >
              <FoldBar
                :title="item.name || '未設定'"
                :is-open="item.is_open"
                :class="['draggable-fold-bar', { incomplete: !item.name || !item.content }]"
                @toggle="toggleFoldItem(index)"
              >
                <template #title-actions>
                  <button class="remove-btn" title="移除此項目" @click.stop="deleteItem(index)">
                    <span>×</span>
                  </button>
                </template>

                <div class="fold-content">
                  <div class="input-group">
                    <label>名稱</label>
                    <input v-model="item.name" type="text" class="form-input" placeholder="輸入項目名稱" />
                  </div>

                  <div class="input-group">
                    <label>內容</label>
                    <textarea
                      v-model="item.content"
                      class="form-textarea"
                      placeholder="輸入項目內容"
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="input-group">
                    <label>生成要求</label>
                    <textarea
                      v-model="item.generation_requirement"
                      class="form-textarea"
                      placeholder="輸入生成此項目的要求"
                      rows="2"
                    ></textarea>
                  </div>

                  <div v-if="item.generated_content" class="generated-result">
                    <label>生成結果：</label>
                    <div class="generated-text">{{ item.generated_content }}</div>
                    <button class="replace-btn" @click="applyGeneratedContent(index)">使用</button>
                  </div>

                  <div class="item-actions">
                    <button
                      class="action-btn generate"
                      :disabled="!has_world_info || is_generating.get(item.id)"
                      @click="generateItem(index)"
                    >
                      <span v-if="is_generating.get(item.id)" class="loading-spinner"></span>
                      {{
                        is_generating.get(item.id) ? '生成中...' : has_world_info ? '生成內容' : '請先完成世界背景設定'
                      }}
                    </button>
                    <button
                      class="action-btn apply"
                      :disabled="!item.generated_content"
                      @click="applyGeneratedContent(index)"
                    >
                      應用結果
                    </button>
                  </div>
                </div>
              </FoldBar>
            </div>
          </template>

          <div v-if="drop_target_index === fold_items.length && dragged_index !== null" class="drop-indicator"></div>
        </div>
        <div class="add-item-section">
          <button class="add-btn" @click="addNewItem">+ 添加新項目</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import FoldBar from '../common_elements/fold_bar.vue';

// 動態高度相關
const tab_navigation_height = ref(0); // 頂部標籤導航高度
const resize_observer = ref<ResizeObserver | null>(null);

// 動態計算世界資訊內容的最大高度
const world_info_content_max_height = computed(() => {
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
  loadWorldInfo();
  loadGenerationRequirements();
  setupResizeObserver();
});

onUnmounted(() => {
  cleanupResizeObserver();
});

interface fold_item {
  id: string;
  name: string;
  content: string;
  generation_requirement: string;
  is_open: boolean;
  generated_content?: string;
}

const fold_items = ref<fold_item[]>([]);
const is_generating = ref<Map<string, boolean>>(new Map());

const has_world_info = computed(() => {
  try {
    const variables = getVariables({ type: 'chat' });
    return !!variables?.world_info?.trim();
  } catch {
    return false;
  }
});

const dragged_index = ref<number | null>(null);
const drop_target_index = ref<number | null>(null);

const toggleFoldItem = (index: number) => {
  fold_items.value[index].is_open = !fold_items.value[index].is_open;
};

const deleteItem = (index: number) => {
  fold_items.value.splice(index, 1);
};

const generateItem = async (index: number) => {
  const item = fold_items.value[index];
  if (!item) return;

  is_generating.value.set(item.id, true);

  try {
    const item_prompt = getWorldInfoItemPrompt(item);
    const pre_world_info_system_prompt = getPreWorldInfoSystemPrompt();
    const post_world_info_system_prompt = getPostWorldInfoSystemPrompt(item);

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

    parseAndFillGeneratedData(result, item);

    try {
      if (item.name && item.name.trim()) {
        const generated_data: Record<string, string> = {};
        generated_data[item.name.trim()] = item.generated_content || '';
        localStorage.setItem(`world_info_item_generated_${item.name.trim()}`, JSON.stringify(generated_data));
      }
    } catch (error) {
      console.error(`Failed to save generated world info item for ${item.name} to localStorage:`, error);
    }

    fold_items.value[index] = { ...item };
  } catch (error) {
    console.error(`生成項目 ${item.name} 內容失敗:`, error);
  } finally {
    is_generating.value.set(item.id, false);
  }
};

const applyGeneratedContent = (index: number) => {
  const item = fold_items.value[index];
  if (!item || !item.generated_content) return;

  item.content = item.generated_content;
  item.generated_content = '';

  fold_items.value[index] = { ...item };

  try {
    if (item.name && item.name.trim()) {
      localStorage.removeItem(`world_info_item_generated_${item.name.trim()}`);
    }
  } catch (error) {
    console.error(`Failed to remove generated world info item for ${item.name} from localStorage:`, error);
  }
};

const addNewItem = () => {
  const new_item: fold_item = {
    id: Date.now().toString(),
    name: '',
    content: '',
    generation_requirement: '',
    is_open: false,
    generated_content: '',
  };
  fold_items.value.push(new_item);
};

const saveWorldInfoPrompt = () => {
  const variables = getVariables({ type: 'chat' });
  let prompt = '';
  for (const world_info of Array.from(variables.extra_world_info) as { name: string; content: string }[]) {
    if (world_info.name.trim() === '' || world_info.content.trim() === '') continue;
    prompt += `<${world_info.name}>\n`;
    prompt += `${world_info.content}\n`;
    prompt += `</${world_info.name}>\n`;
    prompt += '\n';
  }
  variables.extra_world_info_prompt = prompt;
  replaceVariables(variables, { type: 'chat' });
};

// 保存 extra_world_info 到聊天變數
const saveWorldInfo = () => {
  try {
    const variables = getVariables({ type: 'chat' });
    const extra_world_info = fold_items.value.map(item => ({
      name: item.name,
      content: item.content,
    }));
    variables.extra_world_info = extra_world_info;
    replaceVariables(variables, { type: 'chat' });
    saveWorldInfoPrompt();
  } catch (error) {
    console.error('保存 extra_world_info 失敗:', error);
  }
};

const loadWorldInfo = () => {
  try {
    const variables = getVariables({ type: 'chat' });
    if (variables?.extra_world_info && Array.isArray(variables.extra_world_info)) {
      const items: fold_item[] = variables.extra_world_info.map((item: any, index: number) => ({
        id: `loaded_${index}_${Date.now()}`,
        name: item.name || '未命名項目',
        content: item.content || '',
        generation_requirement: '',
        is_open: false,
        generated_content: '',
      }));
      fold_items.value = items;
    }
  } catch (error) {
    console.error('加載 extra_world_info 失敗:', error);
  }
};

const onDragStart = (event: DragEvent, index: number) => {
  dragged_index.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
};

const onDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }

  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const y = event.clientY - rect.top;
  const height = rect.height;

  if (y < height / 2) {
    drop_target_index.value = index;
  } else {
    drop_target_index.value = index + 1;
  }
};

const onDrop = (event: DragEvent, drop_index: number) => {
  event.preventDefault();
  const drag_index = dragged_index.value;
  if (drag_index !== null && drag_index !== drop_index) {
    const items = [...fold_items.value];
    const [dragged_item] = items.splice(drag_index, 1);
    items.splice(drop_index, 0, dragged_item);
    fold_items.value = items;
  }
  dragged_index.value = null;
};

const onDragLeave = () => {
  drop_target_index.value = null;
};

const onDragEnd = () => {
  dragged_index.value = null;
  drop_target_index.value = null;
};

const saveGenerationRequirements = () => {
  try {
    const requirements: Record<string, string> = {};
    fold_items.value.forEach(item => {
      if (item.name && item.name.trim()) {
        requirements[item.name.trim()] = item.generation_requirement;
      }
    });
    localStorage.setItem('world_info_tab_generation_requirements', JSON.stringify(requirements));
  } catch (error) {
    console.error('保存生成要求到 localStorage 失敗:', error);
  }
};

const loadGenerationRequirements = () => {
  try {
    const stored = localStorage.getItem('world_info_tab_generation_requirements');
    if (stored) {
      const requirements: Record<string, string> = JSON.parse(stored);
      fold_items.value.forEach(item => {
        if (item.name && item.name.trim() && requirements[item.name.trim()]) {
          item.generation_requirement = requirements[item.name.trim()];
        }
      });
    }

    fold_items.value.forEach(item => {
      if (item.name && item.name.trim()) {
        const stored_generated = localStorage.getItem(`world_info_item_generated_${item.name.trim()}`);
        if (stored_generated) {
          try {
            const generated_data: Record<string, string> = JSON.parse(stored_generated);
            if (generated_data[item.name.trim()]) {
              item.generated_content = generated_data[item.name.trim()];
            }
          } catch (parse_error) {
            console.error(`Failed to parse generated content for ${item.name}:`, parse_error);
          }
        }
      }
    });
  } catch (error) {
    console.error('從 localStorage 加載生成要求失敗:', error);
  }
};

watch(
  fold_items,
  () => {
    saveWorldInfo();
    saveGenerationRequirements();
  },
  { deep: true },
);

watch(
  () => getVariables({ type: 'chat' }),
  new_variables => {
    if (new_variables?.extra_world_info) {
      loadWorldInfo();
    }
  },
  { deep: true },
);

// 獲取項目生成提示
const getWorldInfoItemPrompt = (item: fold_item): string => {
  let item_prompt = `請根據世界背景資訊、生成要求及已有項目資料，為以下項目完善內容設定：\n\n`;
  item_prompt += `名稱：${item.name || ''}\n`;
  item_prompt += `內容：${item.content || ''}\n`;
  return item_prompt;
};

const getPreWorldInfoSystemPrompt = (): string => {
  const variable = getVariables({ type: 'chat' });
  const world_info: string = variable.world_info;
  let character_description = getCharData('current')!.description;
  character_description = character_description.replace('{{getvar::world_info}}', world_info);
  let pre_world_info_system_prompt =
    '你是一個專業的項目內容設計助手，擅長創造豐富多彩的項目設定。請根據提供的世界背景及生成要求，為項目完善內容。\n';
  pre_world_info_system_prompt += '\n';
  pre_world_info_system_prompt += '<世界背景>\n';
  return pre_world_info_system_prompt;
};

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

const getCharacterStatusPrompt = (): string => {
  const variables = getVariables({ type: 'chat' });
  const characters = variables['characters'];
  if (characters === undefined) return '';
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
  if (items === undefined) return '';
  for (const [key, item] of Object.entries(items) as [string, any]) {
    item_table_prompt += `|${key}|${item.name}|${item.description}|${item.value}|\n`;
  }
  item_table_prompt += '</ItemTable>';
  return item_table_prompt;
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

const getWorldInfoPrompt = (): string => {
  let world_info_prompt = '';
  const variables = getVariables({ type: 'chat' });
  const world_infos = variables['extra_world_info'];
  if (world_infos === undefined) return '';
  for (const world_info of Array.from(world_infos) as { name: string; content: string }[]) {
    if (world_info.name === '' || world_info.content === '') continue;
    world_info_prompt += `<${world_info.name}>\n`;
    world_info_prompt += `${world_info.content}\n`;
    world_info_prompt += `</${world_info.name}>\n`;
    world_info_prompt += '\n';
  }
  return world_info_prompt;
};

const getPostWorldInfoSystemPrompt = (item: fold_item): string => {
  let post_world_info_system_prompt = '\n</世界背景>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getUserStatusPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getCharacterStatusPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getItemTablePrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getLocationTablePrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getWorldInfoPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<生成要求>\n';
  post_world_info_system_prompt += `${item.generation_requirement || '無特殊要求'}\n`;
  post_world_info_system_prompt += '</生成要求>\n';
  return post_world_info_system_prompt;
};

const castObjectToString = (object: [string, any]): string => {
  return (
    '[' +
    Object.entries(object)
      .map(([key, value]) => (typeof value === 'string' ? `'${key}':'${value}'` : `'${key}':${value}`))
      .join(', ') +
    ']'
  );
};

const parseAndFillGeneratedData = (result: string, item: fold_item) => {
  item.generated_content = result;
};
</script>

<style lang="scss" scoped>
.world-info-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.world-info-content {
  flex: 1;
  padding: 12px;
  gap: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: v-bind(world_info_content_max_height);
  max-height: v-bind(world_info_content_max_height);

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

.sortable-container {
  margin-bottom: 16px;
}

.sortable-item {
  margin-bottom: 8px;
  transition: all 0.2s ease;
  position: relative;

  &.dragging {
    opacity: 0.7;
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 122, 204, 0.3);
    z-index: 1000;
  }

  &:not(.dragging) {
    transform: translateY(0);
  }
}

.draggable-fold-bar {
  &.incomplete {
    :deep(.fold-bar-btn span) {
      color: #ef4444 !important; // 紅色標題表示未完成
    }
  }
}

.drop-indicator {
  height: 4px;
  background: linear-gradient(90deg, #007acc, #005999);
  border-radius: 2px;
  margin: 4px 0;
  box-shadow: 0 0 8px rgba(0, 122, 204, 0.6);
  animation: pulse 1.5s ease-in-out infinite;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: #007acc;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(0, 122, 204, 0.8);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.fold-content {
  padding: 12px 0;

  .input-group {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    label {
      display: block;
      margin-bottom: 6px;
      color: #b0b0b0;
      font-weight: 500;
      font-size: 13px;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 8px 12px;
      background: #2a2a2a;
      border: 1px solid #404040;
      border-radius: 4px;
      color: #e0e0e0;
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: #007acc;
        box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
      }

      &::placeholder {
        color: #666;
      }
    }

    .form-textarea {
      resize: vertical;
      min-height: 60px;
      line-height: 1.4;
    }
  }
}

.item-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;

  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0; // 防止按鈕過度壓縮
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
    white-space: pre-wrap; // 保留換行符和空格
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

.remove-btn {
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

.action-btn {
  padding: 8px 16px;
  border: 1px solid #555;
  background: #2a2a2a;
  color: #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #404040;
    border-color: #777;
  }

  &.generate {
    background: linear-gradient(135deg, #007acc, #005999);
    border-color: #007acc;
    color: white;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #005999, #004477);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background-color: #666;
      cursor: not-allowed;
      transform: none;
    }
  }

  &.apply {
    background: linear-gradient(135deg, #28a745, #20c997);
    border-color: #28a745;
    color: white;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #218838, #1aa085);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background-color: #666;
      cursor: not-allowed;
      transform: none;
    }
  }

  &.delete {
    background: #3a1a1a;
    border-color: #662222;

    &:hover {
      background: #662222;
    }
  }
}

.add-item-section {
  text-align: center;
  margin-top: 16px;
}

.add-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #007acc, #005999);
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #005999, #004477);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

// 響應式設計
@media (max-width: 768px) {
  .world-info-content {
    padding: 12px;
  }

  .section {
    padding: 16px;
  }

  .item-actions {
    // 移除 flex-direction: column，讓按鈕始終在同一行
    gap: 6px; // 在小屏幕上稍微減少間距

    .action-btn {
      // 移除 width: 100%，讓 flex: 1 處理寬度
      padding: 6px 12px; // 在小屏幕上稍微減少內邊距
      font-size: 12px; // 在小屏幕上稍微減少字體大小
    }
  }

  .add-btn {
    width: 100%;
  }
}

// 加載動畫
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  flex-shrink: 0; // 防止動畫元素被壓縮
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
