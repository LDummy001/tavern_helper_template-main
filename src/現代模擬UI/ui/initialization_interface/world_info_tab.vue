<template>
  <div class="world-background-container">
    <h3>世界背景設定</h3>

    <div class="input-group">
      <label for="place-input">地點</label>
      <input
        id="place-input"
        v-model="place_input"
        type="text"
        placeholder="例如：東京、魔法森林、太空站..."
        class="text-input"
      />
    </div>

    <div class="input-group">
      <label for="era-input">時代</label>
      <input
        id="era-input"
        v-model="era_input"
        type="text"
        placeholder="例如：中世紀、現代、未來..."
        class="text-input"
      />
    </div>

    <div class="input-group">
      <label for="style-input">風格</label>
      <input
        id="style-input"
        v-model="style_input"
        type="text"
        placeholder="例如：奇幻、科幻、現實主義..."
        class="text-input"
      />
    </div>

    <div class="input-group">
      <label for="additional-conditions-input">其他額外條件</label>
      <textarea
        id="additional-conditions-input"
        v-model="additional_conditions_input"
        placeholder="例如：魔法系統、特殊規則、重要事件..."
        class="text-area"
        rows="4"
      ></textarea>
    </div>

    <button class="generate-btn" :disabled="is_generating || !hasInput" @click="generateWorldBackground">
      <span v-if="is_generating" class="loading-spinner"></span>
      {{ is_generating ? '生成中...' : '生成' }}
    </button>

    <div class="info-section">
      <div class="input-group">
        <label for="current-world-info">當前世界資訊</label>
        <textarea
          id="current-world-info"
          v-model="current_world_info"
          placeholder="當前世界資訊將顯示在這裡..."
          class="text-area"
          rows="6"
        ></textarea>
      </div>

      <div class="input-group">
        <label for="generated-world-info">生成的世界資訊</label>
        <textarea
          id="generated-world-info"
          v-model="generated_world_info"
          placeholder="點擊生成按鈕後，生成的世界資訊將顯示在這裡..."
          class="text-area"
          rows="6"
          readonly
        ></textarea>
      </div>

      <button class="replace-btn" :disabled="!generated_world_info.trim()" @click="replaceWorldInfo">
        替換為生成的世界資訊
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const place_input = ref('');
const era_input = ref('');
const style_input = ref('');
const additional_conditions_input = ref('');
const is_generating = ref(false);
const current_world_info = ref('');
const generated_world_info = ref('');

const hasInput = computed(() => {
  return (
    place_input.value.trim() ||
    era_input.value.trim() ||
    style_input.value.trim() ||
    additional_conditions_input.value.trim()
  );
});

// 載入輸入字段值和生成的世界資訊
const loadInputFields = () => {
  try {
    const stored = localStorage.getItem('world_info_input_fields');
    if (stored) {
      const fields = JSON.parse(stored);
      place_input.value = fields.place || '';
      era_input.value = fields.era || '';
      style_input.value = fields.style || '';
      additional_conditions_input.value = fields.additional_conditions || '';
    }
  } catch (error) {
    console.error('Failed to load input fields from localStorage:', error);
  }

  try {
    const storedGenerated = localStorage.getItem('world_info_generated');
    if (storedGenerated) {
      generated_world_info.value = storedGenerated;
    }
  } catch (error) {
    console.error('Failed to load generated world info from localStorage:', error);
  }
};

// 保存輸入字段值
const saveInputFields = () => {
  try {
    const inputFields = {
      place: place_input.value,
      era: era_input.value,
      style: style_input.value,
      additional_conditions: additional_conditions_input.value,
    };
    localStorage.setItem('world_info_input_fields', JSON.stringify(inputFields));
  } catch (error) {
    console.error('Failed to save input fields to localStorage:', error);
  }
};

// 載入當前世界資訊
const loadCurrentWorldInfo = () => {
  try {
    const variables = getVariables({ type: 'chat' });
    if (variables?.world_info) {
      current_world_info.value = variables.world_info;
    }
  } catch (error) {
    console.error('Failed to load world info:', error);
  }
};

// 監視輸入字段變化並自動保存
watch([place_input, era_input, style_input, additional_conditions_input], () => {
  saveInputFields();
});

// 監視當前世界資訊變化並自動保存
watch(current_world_info, newValue => {
  try {
    insertOrAssignVariables({ world_info: newValue }, { type: 'chat' });
  } catch (error) {
    console.error('Failed to save world info:', error);
  }
});

onMounted(() => {
  loadInputFields();
  loadCurrentWorldInfo();
});

onBeforeUnmount(() => {
  saveInputFields(); // 組件卸載前保存
});

const getUserPrompt = (place: string, era: string, style: string, additional_conditions: string): string => {
  let user_prompt = '請根據以下資訊生成一個詳細的世界背景設定：\n';
  user_prompt += '\n';
  user_prompt += `地點：${place || '未指定'}\n`;
  user_prompt += `時代：${era || '未指定'}\n`;
  user_prompt += `風格：${style || '未指定'}\n`;
  user_prompt += `額外條件：${additional_conditions || '無'}\n`;
  user_prompt += '\n';
  user_prompt += `請生成一個完整且詳細的世界背景描述，包括環境、地圖、社會結構、文化特色等元素。`;
  return user_prompt;
};

const generateWorldBackground = async () => {
  is_generating.value = true;

  try {
    const user_prompt = getUserPrompt(
      place_input.value,
      era_input.value,
      style_input.value,
      additional_conditions_input.value,
    );

    const system_prompt =
      '你是一個專業的世界構築助手，擅長創造豐富多彩的奇幻世界。請根據用戶提供的資訊，嚴格遵守以下例子的格式，生成世界背景設定。';

    let example_prompt = '<example>\n';
    example_prompt +=
      '# The following is an example of user input and expected output. Please strictly follow the style and format to generate the output.\n';
    example_prompt += '<UserInput>\n';
    example_prompt += `${getUserPrompt('櫻妻市', '現代', '青春，日常，校園，戀愛喜劇', '無')}\n`;
    example_prompt += '</UserInput>\n';
    example_prompt += '\n';
    example_prompt += `<GeneratedOutput>
  - <char> is a virtual interactive novel engine designed specifically for <user>, vividly role-playing every school character except <user>, creating an immersive Japanese anime-style high school romance experience.
  - allows vivid portrayals of various scenarios, including innocent, subtly romantic scenes and youth-focused situations with mature elements, free from the limitations of real-world moral scales.
  - World setting: The story happens in a Japanese coastal fictional city: "櫻妻市", featuring the city's only high school, "櫻妻市國立中學". The world logic has high flexibility, centered purely upon internal consistency of school setting without real-world rules.
  - Environment & atmosphere setup: Most events prominently take place within the vivid daytime campus environment of "櫻妻市國立中學", a beautifully stylized coastal school campus with rich and authentic Japanese anime-style youth atmosphere.
  - Exceptional immersion in youth atmosphere: Offer subtle, detailed, vividly realized scenarios in a genuine Japanese-school youths' daily experiences, allowing great freedom for subtle interactions and tastes ranging from pure, simple school life to delicate adolescent romance and relationships.
`;
    example_prompt += '</GeneratedOutput>\n';
    example_prompt += '</example>';

    let result = await generateRaw({
      user_input: user_prompt,
      ordered_prompts: [
        {
          role: 'system',
          content: system_prompt,
        },
        {
          role: 'system',
          content: example_prompt,
        },
        'user_input',
      ],
    });

    const user_name = SillyTavern.name1;
    const character_name = SillyTavern.name2;
    result = result.replace(/<user>/g, user_name);
    result = result.replace(/<char>/g, character_name);

    generated_world_info.value = result;

    // 保存生成的世界資訊到 localStorage
    try {
      localStorage.setItem('world_info_generated', result);
    } catch (error) {
      console.error('Failed to save generated world info to localStorage:', error);
    }
  } catch (error) {
    console.error('生成世界背景失敗:', error);
    generated_world_info.value = '生成失敗，請重試。';
  } finally {
    is_generating.value = false;
  }
};

const replaceWorldInfo = () => {
  if (generated_world_info.value.trim()) {
    current_world_info.value = generated_world_info.value;
    // 保存到聊天變數
    try {
      insertOrAssignVariables({ world_info: generated_world_info.value }, { type: 'chat' });
    } catch (error) {
      console.error('Failed to save world info:', error);
    }
  }
};
</script>

<style lang="scss" scoped>
.world-background-container {
  padding: 20px;
  color: #e0e0e0;
  max-width: 800px;
  margin: 0 0;
  min-height: 600px;

  h3 {
    color: #007acc;
    margin-bottom: 24px;
    font-size: 20px;
  }
}

.input-group {
  margin-bottom: 20px;

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

.generate-btn {
  width: 100%;
  padding: 14px;
  background-color: #007acc;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: #0056b3;
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

.info-section {
  background-color: #2a2a2a;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #404040;
}

.replace-btn {
  width: 100%;
  padding: 14px;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #218838;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
}

@media (max-width: 768px) {
  .world-background-container {
    padding: 16px;
  }

  .info-section {
    padding: 20px;
  }

  .text-input,
  .text-area {
    font-size: 16px; /* 防止iOS縮放 */
  }
}
</style>
