<template>
  <div class="start-container">
    <h3>開始設定</h3>

    <div class="section">
      <div class="datetime-group">
        <label>起始時間</label>
        <div class="datetime-inputs">
          <div class="datetime-input">
            <input v-model="start_year" type="number" class="form-input" placeholder="年" min="1900" max="2100" />
            <span class="unit">年</span>
          </div>
          <div class="datetime-input">
            <input v-model="start_month" type="number" class="form-input" placeholder="月" min="1" max="12" />
            <span class="unit">月</span>
          </div>
          <div class="datetime-input">
            <input v-model="start_date" type="number" class="form-input" placeholder="日" min="1" max="31" />
            <span class="unit">日</span>
          </div>
          <div class="datetime-input">
            <input v-model="start_hour" type="number" class="form-input" placeholder="時" min="0" max="23" />
            <span class="unit">時</span>
          </div>
          <div class="datetime-input">
            <input v-model="start_minute" type="number" class="form-input" placeholder="分" min="0" max="59" />
            <span class="unit">分</span>
          </div>
        </div>
        <div
          v-if="
            generated_start_year ||
            generated_start_month ||
            generated_start_date ||
            generated_start_hour ||
            generated_start_minute
          "
          class="generated-result"
        >
          <label>生成結果：</label>
          <div class="generated-text">
            {{ generated_start_year ? `年：${generated_start_year}\n` : ''
            }}{{ generated_start_month ? `月：${generated_start_month}\n` : ''
            }}{{ generated_start_date ? `日：${generated_start_date}\n` : ''
            }}{{ generated_start_hour ? `時：${generated_start_hour}\n` : ''
            }}{{ generated_start_minute ? `分：${generated_start_minute}` : '' }}
          </div>
          <button class="replace-btn" @click="applyGeneratedDatetime">使用</button>
        </div>
      </div>

      <div class="input-group">
        <label>大地點</label>
        <input v-model="big_location" type="text" class="form-input" placeholder="輸入大地點" />
        <div v-if="generated_big_location" class="generated-result">
          <label>生成結果：</label>
          <div class="generated-text">{{ generated_big_location }}</div>
          <button
            class="replace-btn"
            @click="
              big_location = generated_big_location;
              generated_big_location = '';
            "
          >
            使用
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>中地點</label>
        <input v-model="middle_location" type="text" class="form-input" placeholder="輸入中地點" />
        <div v-if="generated_middle_location" class="generated-result">
          <label>生成結果：</label>
          <div class="generated-text">{{ generated_middle_location }}</div>
          <button
            class="replace-btn"
            @click="
              middle_location = generated_middle_location;
              generated_middle_location = '';
            "
          >
            使用
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>小地點</label>
        <input v-model="small_location" type="text" class="form-input" placeholder="輸入小地點" />
        <div v-if="generated_small_location" class="generated-result">
          <label>生成結果：</label>
          <div class="generated-text">{{ generated_small_location }}</div>
          <button
            class="replace-btn"
            @click="
              small_location = generated_small_location;
              generated_small_location = '';
            "
          >
            使用
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>天氣</label>
        <input v-model="weather" type="text" class="form-input" placeholder="輸入天氣" />
        <div v-if="generated_weather" class="generated-result">
          <label>生成結果：</label>
          <div class="generated-text">{{ generated_weather }}</div>
          <button
            class="replace-btn"
            @click="
              weather = generated_weather;
              generated_weather = '';
            "
          >
            使用
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>起始資訊</label>
        <textarea v-model="information" class="form-textarea" placeholder="輸入起始資訊" rows="3"></textarea>
        <div v-if="generated_information" class="generated-result">
          <label>生成結果：</label>
          <div class="generated-text">{{ generated_information }}</div>
          <button
            class="replace-btn"
            @click="
              information = generated_information;
              generated_information = '';
            "
          >
            使用
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>生成要求</label>
        <textarea
          v-model="generation_requirement"
          class="form-textarea"
          placeholder="輸入生成這些項目的要求"
          rows="3"
        ></textarea>
      </div>

      <div class="item-actions">
        <button class="action-btn generate" :disabled="!has_world_info || is_generating" @click="generateStartData">
          <span v-if="is_generating" class="loading-spinner"></span>
          {{ is_generating ? '生成中...' : has_world_info ? '生成內容' : '請先完成世界背景設定' }}
        </button>
        <button class="action-btn apply-all" :disabled="!hasGeneratedResults" @click="applyAllGeneratedResults">
          應用全部
        </button>
      </div>
    </div>

    <!-- 標籤頁完成狀態指示器 -->
    <div class="completion-status">
      <div class="status-item" :class="{ completed: isWorldInfoTabCompleted() }">
        <span class="status-label">世界資訊：</span>
        <span class="status-value">{{ isWorldInfoTabCompleted() ? '已完成' : '未完成' }}</span>
      </div>
      <div class="status-item" :class="{ completed: isUserTabCompleted() }">
        <span class="status-label">用戶設定：</span>
        <span class="status-value">{{ isUserTabCompleted() ? '已完成' : '未完成' }}</span>
      </div>
      <div class="status-item" :class="{ completed: isCharacterTabCompleted() }">
        <span class="status-label">角色設定：</span>
        <span class="status-value">{{ isCharacterTabCompleted() ? '已完成' : '未完成' }}</span>
      </div>
      <div class="status-item" :class="{ completed: isItemTabCompleted() }">
        <span class="status-label">物品設定：</span>
        <span class="status-value">{{ isItemTabCompleted() ? '已完成' : '未完成' }}</span>
      </div>
      <div class="status-item" :class="{ completed: isExtraTabCompleted() }">
        <span class="status-label">額外設定：</span>
        <span class="status-value">{{ isExtraTabCompleted() ? '已完成' : '未完成' }}</span>
      </div>
      <div class="status-item" :class="{ completed: isStartTabCompleted }">
        <span class="status-label">開始設定：</span>
        <span class="status-value">{{ isStartTabCompleted ? '已完成' : '未完成' }}</span>
      </div>
    </div>

    <!-- 開始按鈕 -->
    <div class="start-action">
      <button class="action-btn start" :disabled="!allTabsCompleted" @click="startChat">開始</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Character } from '@/現代模擬UI/variable_logic/variables/character';
import { Datetime } from '@/現代模擬UI/variable_logic/variables/datetime';
import { Item } from '@/現代模擬UI/variable_logic/variables/item';
import { State } from '@/現代模擬UI/variable_logic/variables/state';
import { onMounted, ref, watch } from 'vue';

const start_year = ref('');
const start_month = ref('');
const start_date = ref('');
const start_hour = ref('');
const start_minute = ref('');
const big_location = ref('');
const middle_location = ref('');
const small_location = ref('');
const weather = ref('');
const information = ref('');
const generation_requirement = ref('');
const is_generating = ref(false);

// 生成結果字段
const generated_start_year = ref('');
const generated_start_month = ref('');
const generated_start_date = ref('');
const generated_start_hour = ref('');
const generated_start_minute = ref('');
const generated_big_location = ref('');
const generated_middle_location = ref('');
const generated_small_location = ref('');
const generated_weather = ref('');
const generated_information = ref('');

const has_world_info = computed(() => {
  try {
    const variables = getVariables({ type: 'chat' });
    return !!variables?.world_info?.trim();
  } catch {
    return false;
  }
});

const hasGeneratedResults = computed(() => {
  return (
    generated_start_year.value ||
    generated_start_month.value ||
    generated_start_date.value ||
    generated_start_hour.value ||
    generated_start_minute.value ||
    generated_big_location.value ||
    generated_middle_location.value ||
    generated_small_location.value ||
    generated_weather.value ||
    generated_information.value
  );
});

const isStartTabCompleted = computed(() => {
  return (
    String(start_year.value).trim() !== '' &&
    String(start_month.value).trim() !== '' &&
    String(start_date.value).trim() !== '' &&
    String(start_hour.value).trim() !== '' &&
    String(start_minute.value).trim() !== '' &&
    String(big_location.value).trim() !== '' &&
    String(middle_location.value).trim() !== '' &&
    String(small_location.value).trim() !== '' &&
    String(weather.value).trim() !== '' &&
    String(information.value).trim() !== ''
  );
});

const allTabsCompleted = computed(() => {
  return (
    isWorldInfoTabCompleted() &&
    isUserTabCompleted() &&
    isCharacterTabCompleted() &&
    isItemTabCompleted() &&
    isExtraTabCompleted() &&
    isStartTabCompleted.value
  );
});

const generateStartData = async () => {
  is_generating.value = true;

  try {
    const start_prompt = getStartDataPrompt();
    const pre_world_info_system_prompt = getPreWorldInfoSystemPrompt();
    const post_world_info_system_prompt = getPostWorldInfoSystemPrompt();

    const result = await generateRaw({
      user_input: start_prompt,
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

    parseAndFillGeneratedData(result);

    try {
      const generated_data = {
        start_year: start_year.value,
        start_month: start_month.value,
        start_date: start_date.value,
        start_hour: start_hour.value,
        start_minute: start_minute.value,
        big_location: big_location.value,
        middle_location: middle_location.value,
        small_location: small_location.value,
        weather: weather.value,
        information: information.value,
        generated_start_year: generated_start_year.value,
        generated_start_month: generated_start_month.value,
        generated_start_date: generated_start_date.value,
        generated_start_hour: generated_start_hour.value,
        generated_start_minute: generated_start_minute.value,
        generated_big_location: generated_big_location.value,
        generated_middle_location: generated_middle_location.value,
        generated_small_location: generated_small_location.value,
        generated_weather: generated_weather.value,
        generated_information: generated_information.value,
      };
      localStorage.setItem('start_tab_generated', JSON.stringify(generated_data));
    } catch (error) {
      console.error('保存生成內容到 localStorage 失敗:', error);
    }
  } catch (error) {
    console.error('生成開始設定內容失敗:', error);
  } finally {
    is_generating.value = false;
  }
};

const saveStartData = () => {
  try {
    const variables = getVariables({ type: 'chat' });
    variables.start_settings = {
      start_year: start_year.value,
      start_month: start_month.value,
      start_date: start_date.value,
      start_hour: start_hour.value,
      start_minute: start_minute.value,
      big_location: big_location.value,
      middle_location: middle_location.value,
      small_location: small_location.value,
      weather: weather.value,
      information: information.value,
    };
    replaceVariables(variables, { type: 'chat' });
  } catch (error) {
    console.error('保存開始設定失敗:', error);
  }
};

const loadStartData = () => {
  try {
    const variables = getVariables({ type: 'chat' });
    if (variables?.start_settings) {
      start_year.value = String(variables.start_settings.start_year || '');
      start_month.value = String(variables.start_settings.start_month || '');
      start_date.value = String(variables.start_settings.start_date || '');
      start_hour.value = String(variables.start_settings.start_hour || '');
      start_minute.value = String(variables.start_settings.start_minute || '');
      big_location.value = String(variables.start_settings.big_location || '');
      middle_location.value = String(variables.start_settings.middle_location || '');
      small_location.value = String(variables.start_settings.small_location || '');
      weather.value = String(variables.start_settings.weather || '');
      information.value = String(variables.start_settings.information || '');
    }

    // 從 localStorage 加載生成內容（用於切換標籤頁時恢復）
    const stored_generated = localStorage.getItem('start_tab_generated');
    if (stored_generated) {
      try {
        const generated_data = JSON.parse(stored_generated);
        // 只有當聊天變量中沒有值時才使用 localStorage 中的值
        // 這樣可以保留用戶手動輸入的值優先級
        if (!start_year.value) start_year.value = generated_data.start_year || '';
        if (!start_month.value) start_month.value = generated_data.start_month || '';
        if (!start_date.value) start_date.value = generated_data.start_date || '';
        if (!start_hour.value) start_hour.value = generated_data.start_hour || '';
        if (!start_minute.value) start_minute.value = generated_data.start_minute || '';
        if (!big_location.value) big_location.value = generated_data.big_location || '';
        if (!middle_location.value) middle_location.value = generated_data.middle_location || '';
        if (!small_location.value) small_location.value = generated_data.small_location || '';
        if (!weather.value) weather.value = generated_data.weather || '';
        if (!information.value) information.value = generated_data.information || '';

        // 加載生成結果
        generated_start_year.value = generated_data.generated_start_year || '';
        generated_start_month.value = generated_data.generated_start_month || '';
        generated_start_date.value = generated_data.generated_start_date || '';
        generated_start_hour.value = generated_data.generated_start_hour || '';
        generated_start_minute.value = generated_data.generated_start_minute || '';
        generated_big_location.value = generated_data.generated_big_location || '';
        generated_middle_location.value = generated_data.generated_middle_location || '';
        generated_small_location.value = generated_data.generated_small_location || '';
        generated_weather.value = generated_data.generated_weather || '';
        generated_information.value = generated_data.generated_information || '';
      } catch (parse_error) {
        console.error('解析生成內容失敗:', parse_error);
      }
    }

    const stored_requirement = localStorage.getItem('start_tab_generation_requirement');
    if (stored_requirement) {
      generation_requirement.value = stored_requirement;
    }
  } catch (error) {
    console.error('加載開始設定失敗:', error);
  }
};

onMounted(() => {
  loadStartData();
});

watch(
  [
    start_year,
    start_month,
    start_date,
    start_hour,
    start_minute,
    big_location,
    middle_location,
    small_location,
    weather,
    information,
    generation_requirement,
  ],
  () => {
    saveStartData();
    saveGenerationRequirement();
  },
  { deep: true },
);

watch(
  () => getVariables({ type: 'chat' }),
  new_variables => {
    if (new_variables?.start_settings) {
      loadStartData();
    }
  },
  { deep: true },
);

const saveGenerationRequirement = () => {
  try {
    localStorage.setItem('start_tab_generation_requirement', generation_requirement.value);
  } catch (error) {
    console.error('保存生成要求到 localStorage 失敗:', error);
  }
};

const getStartDataPrompt = (): string => {
  let start_prompt = `請根據世界背景資訊、生成要求及已有資料，為遊戲開始設定完善以下內容：\n\n`;
  start_prompt += `起始時間(年)：${start_year.value || '未設定'}\n`;
  start_prompt += `起始時間(月)：${start_month.value || '未設定'}\n`;
  start_prompt += `起始時間(日)：${start_date.value || '未設定'}\n`;
  start_prompt += `起始時間(時)：${start_hour.value || '未設定'}\n`;
  start_prompt += `起始時間(分)：${start_minute.value || '未設定'}\n`;
  start_prompt += `大地點：${big_location.value || '未設定'}\n`;
  start_prompt += `中地點：${middle_location.value || '未設定'}\n`;
  start_prompt += `小地點：${small_location.value || '未設定'}\n`;
  start_prompt += `天氣：${weather.value || '未設定'}\n`;
  start_prompt += `起始資訊：${information.value || '未設定'}\n`;
  return start_prompt;
};

const getPreWorldInfoSystemPrompt = (): string => {
  const variable = getVariables({ type: 'chat' });
  const world_info: string = variable.world_info;
  let character_description = getCharData('current')!.description;
  character_description = character_description.replace('{{getvar::world_info}}', world_info);
  let pre_world_info_system_prompt =
    '你是一個專業的遊戲開始設定設計助手，擅長創造引人入勝的開場場景。請根據提供的世界背景及生成要求，為遊戲開始設定完善內容。\n';
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

const getPostWorldInfoSystemPrompt = (): string => {
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
  post_world_info_system_prompt += `${generation_requirement.value || '無特殊要求'}\n`;
  post_world_info_system_prompt += '</生成要求>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<example>\n';
  post_world_info_system_prompt +=
    '# The following is an example of user input and expected output. Please strictly follow the style and format to generate the output. Output anything other than this format is prohibited.\n';
  post_world_info_system_prompt += `起始時間(年)：number\n`;
  post_world_info_system_prompt += `起始時間(月)：number[1~12]\n`;
  post_world_info_system_prompt += `起始時間(日)：number[1~31]\n`;
  post_world_info_system_prompt += `起始時間(時)：number[0~23]\n`;
  post_world_info_system_prompt += `起始時間(分)：number[0~59]\n`;
  post_world_info_system_prompt += `大地點：'所在大區域，如：住宅區/市中心等'\n`;
  post_world_info_system_prompt += `中地點：'具體建築物，如：家中/學校等'\n`;
  post_world_info_system_prompt += `小地點：'具體房間/位置，如：客廳/便利店等'\n`;
  post_world_info_system_prompt += `天氣：'天氣描述，如：晴朗，雨天'\n`;
  post_world_info_system_prompt += `起始資訊：'遊戲開始時的場景描述或重要資訊'\n`;
  post_world_info_system_prompt += '</example>\n';
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

const parseAndFillGeneratedData = (result: string) => {
  // 解析生成內容並填充到對應的生成結果字段中
  const lines = result.split('\n');
  const data: Record<string, string> = {};

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.includes('：')) {
      const [key, value] = trimmedLine.split('：', 2);
      const cleanValue = value?.trim().replace(/^["']|["']$/g, '') || '';

      // 映射到我們的生成結果字段
      switch (key.trim()) {
        case '起始時間(年)':
          data.generated_start_year = cleanValue;
          break;
        case '起始時間(月)':
          data.generated_start_month = cleanValue;
          break;
        case '起始時間(日)':
          data.generated_start_date = cleanValue;
          break;
        case '起始時間(時)':
          data.generated_start_hour = cleanValue;
          break;
        case '起始時間(分)':
          data.generated_start_minute = cleanValue;
          break;
        case '大地點':
          data.generated_big_location = cleanValue;
          break;
        case '中地點':
          data.generated_middle_location = cleanValue;
          break;
        case '小地點':
          data.generated_small_location = cleanValue;
          break;
        case '天氣':
          data.generated_weather = cleanValue;
          break;
        case '起始資訊':
          data.generated_information = cleanValue;
          break;
      }
    }
  }

  // 應用解析的數據
  Object.assign(generated_start_year, { value: data.generated_start_year || '' });
  Object.assign(generated_start_month, { value: data.generated_start_month || '' });
  Object.assign(generated_start_date, { value: data.generated_start_date || '' });
  Object.assign(generated_start_hour, { value: data.generated_start_hour || '' });
  Object.assign(generated_start_minute, { value: data.generated_start_minute || '' });
  Object.assign(generated_big_location, { value: data.generated_big_location || '' });
  Object.assign(generated_middle_location, { value: data.generated_middle_location || '' });
  Object.assign(generated_small_location, { value: data.generated_small_location || '' });
  Object.assign(generated_weather, { value: data.generated_weather || '' });
  Object.assign(generated_information, { value: data.generated_information || '' });
};

const applyGeneratedDatetime = () => {
  if (generated_start_year.value) start_year.value = generated_start_year.value;
  if (generated_start_month.value) start_month.value = generated_start_month.value;
  if (generated_start_date.value) start_date.value = generated_start_date.value;
  if (generated_start_hour.value) start_hour.value = generated_start_hour.value;
  if (generated_start_minute.value) start_minute.value = generated_start_minute.value;

  // 清空生成結果
  generated_start_year.value = '';
  generated_start_month.value = '';
  generated_start_date.value = '';
  generated_start_hour.value = '';
  generated_start_minute.value = '';
};

const applyAllGeneratedResults = () => {
  applyGeneratedDatetime();
  if (generated_big_location.value) big_location.value = generated_big_location.value;
  if (generated_middle_location.value) middle_location.value = generated_middle_location.value;
  if (generated_small_location.value) small_location.value = generated_small_location.value;
  if (generated_weather.value) weather.value = generated_weather.value;
  if (generated_information.value) information.value = generated_information.value;

  // 清空所有生成結果
  generated_big_location.value = '';
  generated_middle_location.value = '';
  generated_small_location.value = '';
  generated_weather.value = '';
  generated_information.value = '';

  // 保存資料
  saveStartData();

  // 清除 localStorage 中的生成數據，因為已經應用
  try {
    localStorage.removeItem('start_tab_generated');
  } catch (error) {
    console.error('從 localStorage 移除生成內容失敗:', error);
  }
};

const isEmptyValue = (value: any): boolean => {
  if (value === '') return true;
  if (value === null) return true;
  if (value === undefined) return true;
  return false;
};

const isWorldInfoTabCompleted = (): boolean => {
  const variable = getVariables({ type: 'chat' });
  const world_info: string = variable.world_info || '';
  return world_info.trim() !== '';
};

const isUserTabCompleted = (): boolean => {
  const variable = getVariables({ type: 'chat' });
  const user_state = variable?.characters?.c1;
  if (!user_state) return false;
  for (const value of Object.values(user_state)) {
    if (isEmptyValue(value)) return false;
  }
  return true;
};

const isCharacterTabCompleted = (): boolean => {
  const variable = getVariables({ type: 'chat' });
  const characters = variable?.characters;
  if (!characters) return false;
  for (const [character_id, character_state] of Object.entries(characters) as [string, any]) {
    if (character_id === 'c1') continue;
    for (const value of Object.values(character_state)) {
      if (isEmptyValue(value)) return false;
    }
  }
  return true;
};

const isItemTabCompleted = (): boolean => {
  const variable = getVariables({ type: 'chat' });
  const items = variable?.items;
  if (!items) return false;
  for (const item of Object.values(items) as [string, any]) {
    for (const value of Object.values(item)) {
      if (isEmptyValue(value)) return false;
    }
  }
  return true;
};

const isExtraTabCompleted = (): boolean => {
  const variable = getVariables({ type: 'chat' });
  const extra_world_infos = variable?.extra_world_info;
  if (!extra_world_infos) return false;
  for (const extra_world_info of Object.values(extra_world_infos) as [string, any]) {
    for (const value of Object.values(extra_world_info)) {
      if (isEmptyValue(value)) return false;
    }
  }
  return true;
};

const startChat = () => {
  const start_year_num = parseInt(start_year.value);
  const start_month_num = parseInt(start_month.value);
  const start_date_num = parseInt(start_date.value);
  const start_hour_num = parseInt(start_hour.value);
  const start_minute_num = parseInt(start_minute.value);
  const big_location_string = big_location.value;
  const middle_location_string = middle_location.value;
  const small_location_string = small_location.value;
  const weather_string = weather.value;
  let variable = getVariables({ type: 'chat' });
  const character_records = variable.characters;
  const active_characters = new Map<string, Character>();
  const deactive_characters = new Map<string, Character>();
  for (const [character_id, character_record] of Object.entries(character_records) as [string, any]) {
    const name = `${character_record.姓氏}${character_record.名字}`;
    const age = parseInt(character_record.年齡);
    const birthday_date = parseInt(character_record.生日日期);
    const birthday_month = parseInt(character_record.生日月份);
    let birthday_year = start_year_num - age;
    if (start_month_num < birthday_month || (start_month_num === birthday_month && start_date_num < birthday_date)) {
      birthday_year -= 1;
    }
    const birthday = new Datetime(new Date(birthday_year, birthday_month - 1, birthday_date));
    let cup_size: string | null = character_record.罩杯;
    if (!/^[a-zA-Z]$/.test(character_record.罩杯)) cup_size = null;
    const character = new Character(
      name,
      age,
      character_record.性別,
      character_record.身份,
      character_record.簡介,
      character_record.性格,
      character_record.身高,
      character_record.體重,
      character_record.胸圍,
      cup_size,
      character_record.腰圍,
      character_record.臀圍,
      character_record.髮型,
      character_record.樣貌,
      character_record.衣著,
      birthday,
      character_record.愛好,
      character_record.其他重要資訊,
      character_record.金錢,
      character_record.心情,
      character_record.性慾,
      new Map(Object.entries(character_record.關係)),
      new Map(Object.entries(character_record.友好度)),
      new Map(Object.entries(character_record.愛情度)),
      new Map(Object.entries(character_record.所持物)),
    );
    if (character_id === 'c1') active_characters.set(character_id, character);
    else deactive_characters.set(character_id, character);
  }
  const item_records = variable.items;
  const items = new Map<string, Item>();
  for (const [item_id, item_record] of Object.entries(item_records) as [string, any]) {
    const item = new Item(item_record.name, item_record.description, item_record.value);
    items.set(item_id, item);
  }
  const state = new State(
    new Datetime(new Date(start_year_num, start_month_num - 1, start_date_num, start_hour_num, start_minute_num)),
    big_location_string,
    middle_location_string,
    small_location_string,
    weather_string,
    State.CURRENT_EVENT_NULL_VALUE,
    active_characters,
    deactive_characters,
    items,
    new Map(),
    [],
  );
  state.saveAsVariable(-1);
  state.saveAsVariable(0);
  variable = getVariables({ type: 'chat' });
  variable['is_initialized'] = true;
  replaceVariables(variable, { type: 'chat' });
  // 發送初始化完成事件
  eventEmit('initialization_completed');
};
</script>

<style lang="scss" scoped>
.start-container {
  color: #e0e0e0;
  max-width: 1000px;
  margin: 0 0;
  padding: 16px;

  h3 {
    color: #007acc;
    margin-bottom: 24px;
    font-size: 20px;
  }
}

.section {
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #404040;
  margin-bottom: 20px;

  .input-group,
  .datetime-group {
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
  }

  .datetime-inputs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .datetime-input {
      display: flex;
      align-items: center;
      gap: 4px;

      .form-input {
        width: 80px;
        text-align: center;
      }

      .unit {
        color: #b0b0b0;
        font-size: 12px;
        font-weight: 500;
        min-width: 12px;
      }
    }
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
    min-width: 0;
  }
}

.start-action {
  margin-top: 20px;
  display: flex;
  justify-content: center;

  .action-btn {
    min-width: 120px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
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
    white-space: pre-wrap;
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
    background-color: #28a745;
    border-color: #28a745;
    color: white;

    &:hover:not(:disabled) {
      background-color: #218838;
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

  &.apply-all {
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

  &.start {
    background: linear-gradient(135deg, #28a745, #20c997);
    border-color: #28a745;
    color: white;
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #218838, #1aa085);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: linear-gradient(135deg, #444, #333);
      border-color: #555;
      color: #888;
      box-shadow: none;
      cursor: not-allowed;
      transform: none;
      opacity: 0.6;

      &::before {
        content: '🔒';
        margin-right: 8px;
      }
    }
  }
}

// 響應式設計
@media (max-width: 768px) {
  .start-container {
    padding: 16px;
  }

  .section {
    padding: 16px;

    .datetime-inputs {
      gap: 6px;

      .datetime-input {
        .form-input {
          width: 70px;
        }

        .unit {
          font-size: 11px;
          min-width: 10px;
        }
      }
    }
  }

  .item-actions {
    gap: 6px;

    .action-btn {
      padding: 6px 12px;
      font-size: 12px;
    }
  }

  .completion-status {
    padding: 12px;

    .status-item {
      padding: 6px 8px;
      margin-bottom: 6px;

      .status-label {
        font-size: 13px;
      }

      .status-value {
        font-size: 13px;
      }
    }
  }

  .start-action {
    .action-btn {
      min-width: 100px;
      padding: 10px 20px;
      font-size: 14px;
    }
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
  flex-shrink: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 完成狀態指示器樣式
.completion-status {
  margin-top: 20px;
  padding: 16px;
  background-color: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #404040;

  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 8px;
    border-radius: 6px;
    background-color: #1a1a1a;
    border: 1px solid #555;
    transition: all 0.2s ease;

    &:last-child {
      margin-bottom: 0;
    }

    &.completed {
      background-color: #0f2a0f;
      border-color: #28a745;

      .status-label {
        color: #4ade80;
      }

      .status-value {
        color: #28a745;
        font-weight: 600;
      }
    }

    &:not(.completed) {
      background-color: #2a0f0f;
      border-color: #dc3545;

      .status-label {
        color: #fca5a5;
      }

      .status-value {
        color: #dc3545;
        font-weight: 600;
      }
    }

    .status-label {
      font-size: 14px;
      font-weight: 500;
    }

    .status-value {
      font-size: 14px;
    }
  }
}
</style>
