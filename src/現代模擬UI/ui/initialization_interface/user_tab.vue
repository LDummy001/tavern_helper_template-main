<template>
  <div class="user-profile-container">
    <h3>用戶資料設定</h3>

    <!-- 基本資訊 -->
    <div class="section">
      <h4>基本資訊</h4>
      <div class="form-grid">
        <div class="input-group">
          <label>角色ID</label>
          <div class="display-text">c1</div>
        </div>

        <div class="input-group">
          <label for="surname-input">姓氏</label>
          <input id="surname-input" v-model="user_data.surname" type="text" placeholder="例如：張" class="text-input" />
          <div v-if="user_data.generated_surname" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_surname }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.surname = user_data.generated_surname;
                user_data.generated_surname = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="name-input">名字</label>
          <input id="name-input" v-model="user_data.name" type="text" placeholder="例如：小明" class="text-input" />
          <div v-if="user_data.generated_name" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_name }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.name = user_data.generated_name;
                user_data.generated_name = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="age-input">年齡</label>
          <input
            id="age-input"
            v-model.number="user_data.age"
            type="number"
            placeholder="例如：18"
            class="text-input"
            min="0"
            max="200"
          />
          <div v-if="user_data.generated_age" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_age }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.age = parseInt(user_data.generated_age) || null;
                user_data.generated_age = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="gender-input">性別</label>
          <input id="gender-input" v-model="user_data.gender" type="text" placeholder="例如：女" class="text-input" />
          <div v-if="user_data.generated_gender" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_gender }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.gender = user_data.generated_gender;
                user_data.generated_gender = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="identity-input">身份</label>
          <input
            id="identity-input"
            v-model="user_data.identity"
            type="text"
            placeholder="例如：高中生"
            class="text-input"
          />
          <div v-if="user_data.generated_identity" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_identity }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.identity = user_data.generated_identity;
                user_data.generated_identity = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="birthday-input">生日</label>
          <div class="birthday-inputs">
            <input
              v-model.number="user_data.birthday_month"
              type="number"
              placeholder="月"
              class="birthday-input"
              min="1"
              max="12"
            />
            <input
              v-model.number="user_data.birthday_day"
              type="number"
              placeholder="日"
              class="birthday-input"
              min="1"
              max="31"
            />
          </div>
          <div v-if="user_data.generated_birthday_month || user_data.generated_birthday_day" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">
              {{ user_data.generated_birthday_month }}月 {{ user_data.generated_birthday_day }}日
            </div>
            <button
              class="replace-btn"
              @click="
                user_data.birthday_month = parseInt(user_data.generated_birthday_month) || null;
                user_data.birthday_day = parseInt(user_data.generated_birthday_day) || null;
                user_data.generated_birthday_month = '';
                user_data.generated_birthday_day = '';
              "
            >
              使用
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 外貌特徵 -->
    <div class="section">
      <h4>外貌特徵</h4>
      <div class="form-grid">
        <div class="input-group">
          <label for="height-input">身高 (cm)</label>
          <input
            id="height-input"
            v-model.number="user_data.height"
            type="number"
            placeholder="例如：165"
            class="text-input"
            min="0"
            max="300"
          />
          <div v-if="user_data.generated_height" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_height }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.height = parseInt(user_data.generated_height) || null;
                user_data.generated_height = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="weight-input">體重 (kg)</label>
          <input
            id="weight-input"
            v-model.number="user_data.weight"
            type="number"
            placeholder="例如：50"
            class="text-input"
            min="0"
            max="500"
          />
          <div v-if="user_data.generated_weight" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_weight }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.weight = parseInt(user_data.generated_weight) || null;
                user_data.generated_weight = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="chest-size-input">胸圍 (cm)</label>
          <input
            id="chest-size-input"
            v-model.number="user_data.chest_size"
            type="number"
            placeholder="例如：85"
            class="text-input"
            min="0"
            max="200"
          />
          <div v-if="user_data.generated_chest_size" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_chest_size }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.chest_size = parseInt(user_data.generated_chest_size) || null;
                user_data.generated_chest_size = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="cup-size-input">罩杯</label>
          <input
            id="cup-size-input"
            v-model="user_data.cup_size"
            type="text"
            placeholder="例如：C"
            class="text-input"
          />
          <div v-if="user_data.generated_cup_size" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_cup_size }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.cup_size = user_data.generated_cup_size;
                user_data.generated_cup_size = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="waist-size-input">腰圍 (cm)</label>
          <input
            id="waist-size-input"
            v-model.number="user_data.waist_size"
            type="number"
            placeholder="例如：60"
            class="text-input"
            min="0"
            max="200"
          />
          <div v-if="user_data.generated_waist_size" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_waist_size }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.waist_size = parseInt(user_data.generated_waist_size) || null;
                user_data.generated_waist_size = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="hips-size-input">臀圍 (cm)</label>
          <input
            id="hips-size-input"
            v-model.number="user_data.hips_size"
            type="number"
            placeholder="例如：88"
            class="text-input"
            min="0"
            max="200"
          />
          <div v-if="user_data.generated_hips_size" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_hips_size }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.hips_size = parseInt(user_data.generated_hips_size) || null;
                user_data.generated_hips_size = '';
              "
            >
              使用
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 外觀描述 -->
    <div class="section">
      <h4>外觀描述</h4>
      <div class="form-grid">
        <div class="input-group full-width">
          <label for="hairstyle-input">髮型</label>
          <input
            id="hairstyle-input"
            v-model="user_data.hairstyle"
            type="text"
            placeholder="例如：黑色長直髮"
            class="text-input"
          />
          <div v-if="user_data.generated_hairstyle" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_hairstyle }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.hairstyle = user_data.generated_hairstyle;
                user_data.generated_hairstyle = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group full-width">
          <label for="appearance-input">外貌</label>
          <textarea
            id="appearance-input"
            v-model="user_data.appearance"
            placeholder="描述外貌特徵..."
            class="text-area"
            rows="3"
          ></textarea>
          <div v-if="user_data.generated_appearance" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_appearance }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.appearance = user_data.generated_appearance;
                user_data.generated_appearance = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group full-width">
          <label for="clothes-input">服裝</label>
          <textarea
            id="clothes-input"
            v-model="user_data.clothes"
            placeholder="描述常穿的服裝..."
            class="text-area"
            rows="3"
          ></textarea>
          <div v-if="user_data.generated_clothes" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_clothes }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.clothes = user_data.generated_clothes;
                user_data.generated_clothes = '';
              "
            >
              使用
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 個性與喜好 -->
    <div class="section">
      <h4>個性與喜好</h4>
      <div class="form-grid">
        <div class="input-group full-width">
          <label for="introduction-input">角色簡介</label>
          <textarea
            id="introduction-input"
            v-model="user_data.introduction"
            placeholder="簡單介紹自己..."
            class="text-area"
            rows="3"
          ></textarea>
          <div v-if="user_data.generated_introduction" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_introduction }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.introduction = user_data.generated_introduction;
                user_data.generated_introduction = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group full-width">
          <label for="personality-input">個性</label>
          <textarea
            id="personality-input"
            v-model="user_data.personality"
            placeholder="描述性格特點..."
            class="text-area"
            rows="3"
          ></textarea>
          <div v-if="user_data.generated_personality" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_personality }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.personality = user_data.generated_personality;
                user_data.generated_personality = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group full-width">
          <label for="favourite-input">喜好</label>
          <textarea
            id="favourite-input"
            v-model="user_data.favourite"
            placeholder="描述喜歡的事物..."
            class="text-area"
            rows="3"
          ></textarea>
          <div v-if="user_data.generated_favourite" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_favourite }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.favourite = user_data.generated_favourite;
                user_data.generated_favourite = '';
              "
            >
              使用
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 其他資訊 -->
    <div class="section">
      <h4>其他資訊</h4>
      <div class="form-grid">
        <div class="input-group">
          <label for="money-input">金錢</label>
          <input
            id="money-input"
            v-model.number="user_data.money"
            type="number"
            placeholder="例如：10000"
            class="text-input"
            min="0"
          />
          <div v-if="user_data.generated_money" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_money }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.money = parseInt(user_data.generated_money) || null;
                user_data.generated_money = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group full-width">
          <label for="extra-info-input">其他重要資訊</label>
          <textarea
            id="extra-info-input"
            v-model="user_data.extra_information"
            placeholder="其他需要描述的資訊..."
            class="text-area"
            rows="3"
          ></textarea>
          <div v-if="user_data.generated_extra_information" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_extra_information }}</div>
            <button
              class="replace-btn"
              @click="
                user_data.extra_information = user_data.generated_extra_information;
                user_data.generated_extra_information = '';
              "
            >
              使用
            </button>
          </div>
        </div>

        <div class="input-group full-width">
          <label>關係</label>
          <div class="relations-list">
            <div
              v-for="[target_id, relation_desc] in Array.from(user_data.關係 || new Map())"
              :key="target_id"
              class="relation-item"
            >
              <span class="relation-target">[{{ target_id }}] {{ getCharacterDisplayName(target_id) }}</span> 是此角色的
              <input
                :value="relation_desc"
                type="text"
                placeholder="輸入關係描述"
                class="relation-input"
                @input="updateRelation(target_id, ($event.target as HTMLInputElement).value)"
              />
              <button class="remove-relation-btn" @click="removeRelation(target_id)">×</button>
            </div>
            <div class="add-relation">
              <select v-model="user_data.selected_relation_target" class="relation-select">
                <option value="">選擇目標角色</option>
                <option v-for="[id, data] in getAllOtherCharacters()" :key="id" :value="id">
                  {{ `${id}: ${data.姓氏 || ''}${data.名字 || ''}` }}
                </option>
              </select>
              <button class="add-relation-btn" :disabled="!user_data.selected_relation_target" @click="addRelation">
                添加關係
              </button>
            </div>
          </div>
          <div v-if="user_data.generated_relationship" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_relationship }}</div>
            <button class="replace-btn" @click="applyGeneratedField('關係', user_data.generated_relationship)">
              使用
            </button>
          </div>
        </div>

        <div class="input-group full-width">
          <label>所持物</label>
          <div class="inventory-list">
            <div
              v-for="[item_id, quantity] in Array.from(user_data.所持物 || new Map())"
              :key="item_id"
              class="inventory-item"
            >
              <span class="inventory-target">[{{ item_id }}] {{ getItemDisplayName(item_id) }}</span> :
              <input
                :value="quantity"
                type="number"
                placeholder="數量"
                class="inventory-input"
                min="1"
                @input="updateInventory(item_id, parseInt(($event.target as HTMLInputElement).value) || 1)"
              />
              <button class="remove-inventory-btn" @click="removeInventory(item_id)">×</button>
            </div>
            <div class="add-inventory">
              <select v-model="user_data.selected_inventory_item" class="inventory-select">
                <option value="">選擇物品</option>
                <option v-for="[id, data] in getAllItems()" :key="id" :value="id">
                  {{ `${id}: ${data.name || '未知物品'}` }}
                </option>
              </select>
              <input
                v-model.number="user_data.selected_inventory_quantity"
                type="number"
                placeholder="數量"
                class="quantity-input"
                min="1"
                :disabled="!user_data.selected_inventory_item"
              />
              <button
                class="add-inventory-btn"
                :disabled="!user_data.selected_inventory_item || !user_data.selected_inventory_quantity"
                @click="addInventory"
              >
                添加物品
              </button>
            </div>
          </div>
          <div v-if="user_data.generated_inventory" class="generated-result">
            <label>生成結果：</label>
            <div class="generated-text">{{ user_data.generated_inventory }}</div>
            <button class="replace-btn" @click="applyGeneratedField('所持物', user_data.generated_inventory)">
              使用
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 生成要求 -->
    <div class="section">
      <h4>生成要求</h4>
      <div class="form-grid">
        <div class="input-group full-width">
          <label for="generation-requirement-input">對AI生成的要求</label>
          <textarea
            id="generation-requirement-input"
            v-model="user_data.generation_requirement"
            placeholder="對AI生成的要求..."
            class="text-area"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- 生成按鈕 -->
    <div class="action-section">
      <button class="generate-btn" :disabled="!hasWorldInfo || is_generating" @click="generateUserProfile">
        <span v-if="is_generating" class="loading-spinner"></span>
        {{ is_generating ? '生成中...' : hasWorldInfo ? '生成未填寫的字段' : '請先完成世界背景設定' }}
      </button>
      <button class="apply-all-btn" :disabled="!hasGeneratedResults" @click="applyAllGeneratedResults">應用全部</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// 用戶資料結構
interface UserData {
  surname: string;
  name: string;
  age: number | null;
  gender: string;
  identity: string;
  introduction: string;
  personality: string;
  height: number | null;
  weight: number | null;
  chest_size: number | null;
  cup_size: string;
  waist_size: number | null;
  hips_size: number | null;
  hairstyle: string;
  appearance: string;
  clothes: string;
  birthday_month: number | null;
  birthday_day: number | null;
  favourite: string;
  extra_information: string;
  money: number | null;
  generation_requirement: string;
  關係?: Map<string, string>;
  selected_relation_target?: string;
  所持物?: Map<string, number>;
  selected_inventory_item?: string;
  selected_inventory_quantity?: number;
  // 生成結果
  generated_surname: string;
  generated_name: string;
  generated_age: string;
  generated_gender: string;
  generated_identity: string;
  generated_introduction: string;
  generated_personality: string;
  generated_height: string;
  generated_weight: string;
  generated_chest_size: string;
  generated_cup_size: string;
  generated_waist_size: string;
  generated_hips_size: string;
  generated_hairstyle: string;
  generated_appearance: string;
  generated_clothes: string;
  generated_birthday_month: string;
  generated_birthday_day: string;
  generated_favourite: string;
  generated_extra_information: string;
  generated_money: string;
  generated_relationship?: string;
  generated_inventory?: string;
}

const user_data = ref<UserData>({
  surname: '',
  name: '',
  age: null,
  gender: '',
  identity: '',
  introduction: '',
  personality: '',
  height: null,
  weight: null,
  chest_size: null,
  cup_size: '',
  waist_size: null,
  hips_size: null,
  hairstyle: '',
  appearance: '',
  clothes: '',
  birthday_month: null,
  birthday_day: null,
  favourite: '',
  extra_information: '',
  money: null,
  generation_requirement: '',
  關係: new Map(),
  selected_relation_target: '',
  所持物: new Map(),
  selected_inventory_item: '',
  selected_inventory_quantity: 1,
  // 生成結果
  generated_surname: '',
  generated_name: '',
  generated_age: '',
  generated_gender: '',
  generated_identity: '',
  generated_introduction: '',
  generated_personality: '',
  generated_height: '',
  generated_weight: '',
  generated_chest_size: '',
  generated_cup_size: '',
  generated_waist_size: '',
  generated_hips_size: '',
  generated_hairstyle: '',
  generated_appearance: '',
  generated_clothes: '',
  generated_birthday_month: '',
  generated_birthday_day: '',
  generated_favourite: '',
  generated_extra_information: '',
  generated_money: '',
  generated_relationship: '',
  generated_inventory: '',
});

const is_generating = ref(false);

// 獲取所有物品
const getAllItems = () => {
  const all = new Map();
  const variables = getVariables({ type: 'chat' });
  if (variables?.items) {
    for (const [item_id, item_data] of Object.entries(variables.items)) {
      all.set(item_id, reactive(item_data as any));
    }
  }
  return Array.from(all.entries());
};

// 獲取角色顯示名稱
const getCharacterDisplayName = (character_id: string): string => {
  if (character_id === 'c1') {
    // 用戶角色
    const variables = getVariables({ type: 'chat' });
    const userChar = variables.characters?.c1;
    if (userChar) {
      const fullName = `${userChar.姓氏 || ''}${userChar.名字 || ''}`.trim();
      return fullName || '未知用戶';
    }
    return '未知用戶';
  } else {
    // 其他角色
    const variables = getVariables({ type: 'chat' });
    const char = variables.characters?.[character_id];
    if (char) {
      const fullName = `${char.姓氏 || ''}${char.名字 || ''}`.trim();
      return fullName || '未知角色';
    }
    return '未知角色';
  }
};

// 獲取物品顯示名稱
const getItemDisplayName = (item_id: string): string => {
  const variables = getVariables({ type: 'chat' });
  const item = variables.items?.[item_id];
  if (item) {
    return item.name || '未知物品';
  }
  return '未知物品';
};

// 檢查是否有任何生成結果
const hasGeneratedResults = computed(() => {
  return (
    user_data.value.generated_surname ||
    user_data.value.generated_name ||
    user_data.value.generated_age ||
    user_data.value.generated_gender ||
    user_data.value.generated_identity ||
    user_data.value.generated_introduction ||
    user_data.value.generated_personality ||
    user_data.value.generated_height ||
    user_data.value.generated_weight ||
    user_data.value.generated_chest_size ||
    user_data.value.generated_cup_size ||
    user_data.value.generated_waist_size ||
    user_data.value.generated_hips_size ||
    user_data.value.generated_hairstyle ||
    user_data.value.generated_appearance ||
    user_data.value.generated_clothes ||
    user_data.value.generated_birthday_month ||
    user_data.value.generated_birthday_day ||
    user_data.value.generated_favourite ||
    user_data.value.generated_extra_information ||
    user_data.value.generated_money ||
    user_data.value.generated_relationship ||
    user_data.value.generated_inventory
  );
});

// 獲取所有其他角色（包括用戶）
const getAllOtherCharacters = () => {
  const all = new Map();
  const variables = getVariables({ type: 'chat' });
  if (variables?.characters) {
    for (const [char_id, char_data] of Object.entries(variables.characters)) {
      if (char_id !== 'c1') {
        all.set(char_id, reactive(char_data as CharacterData));
      }
    }
  }
  return Array.from(all.entries());
};

// 檢查 world_info 是否存在
const hasWorldInfo = computed(() => {
  try {
    const variables = getVariables({ type: 'chat' });
    return variables?.world_info?.trim();
  } catch {
    return false;
  }
});

// 載入用戶資料
const loadUserData = () => {
  try {
    // 從聊天變數載入用戶資料
    const variables = getVariables({ type: 'chat' });
    const characters = variables.characters || {};
    const userCharacter = characters.c1;

    if (userCharacter) {
      // 載入姓氏和名字
      user_data.value.surname = userCharacter['姓氏'] || '';
      user_data.value.name = userCharacter['名字'] || '';

      // 載入其他字段
      user_data.value.age = userCharacter['年齡'];
      user_data.value.gender = userCharacter['性別'] || '';
      user_data.value.identity = userCharacter['身份'] || '';
      user_data.value.introduction = userCharacter['簡介'] || '';
      user_data.value.personality = userCharacter['性格'] || '';
      user_data.value.height = userCharacter['身高'];
      user_data.value.weight = userCharacter['體重'];
      user_data.value.chest_size = userCharacter['胸圍'];
      user_data.value.cup_size = userCharacter['罩杯'] || '';
      user_data.value.waist_size = userCharacter['腰圍'];
      user_data.value.hips_size = userCharacter['臀圍'];
      user_data.value.hairstyle = userCharacter['髮型'] || '';
      user_data.value.appearance = userCharacter['樣貌'] || '';
      user_data.value.clothes = userCharacter['衣著'] || '';
      user_data.value.favourite = userCharacter['愛好'] || '';
      user_data.value.extra_information = userCharacter['其他重要資訊'] || '';
      user_data.value.money = userCharacter['金錢'];

      // 載入生日
      user_data.value.birthday_month = userCharacter['生日月份'];
      user_data.value.birthday_day = userCharacter['生日日期'];

      // 載入關係
      if (userCharacter.關係) {
        user_data.value.關係 = new Map(Object.entries(userCharacter.關係));
      } else {
        user_data.value.關係 = new Map();
      }

      // 載入所持物
      if (userCharacter.所持物) {
        user_data.value.所持物 = new Map(Object.entries(userCharacter.所持物));
      } else {
        user_data.value.所持物 = new Map();
      }
    }
  } catch (error) {
    console.error('Failed to load user data from chat variables:', error);
  }

  // 載入生成結果（仍然從 localStorage 載入，因為生成結果是臨時的）
  try {
    const storedGenerated = localStorage.getItem('user_profile_generated');
    if (storedGenerated) {
      const generatedData = JSON.parse(storedGenerated);
      Object.assign(user_data.value, generatedData);
    }
  } catch (error) {
    console.error('Failed to load generated user profile from localStorage:', error);
  }
};

// 保存用戶資料
const saveUserData = () => {
  try {
    // 獲取當前聊天變數
    const variables = getVariables({ type: 'chat' });
    const characters = variables.characters || {};

    // 創建用戶角色資料
    const user_character_data = {
      姓氏: user_data.value.surname,
      名字: user_data.value.name,
      年齡: user_data.value.age,
      性別: user_data.value.gender,
      身份: user_data.value.identity,
      簡介: user_data.value.introduction,
      性格: user_data.value.personality,
      身高: user_data.value.height,
      體重: user_data.value.weight,
      胸圍: user_data.value.chest_size,
      罩杯: user_data.value.cup_size,
      腰圍: user_data.value.waist_size,
      臀圍: user_data.value.hips_size,
      髮型: user_data.value.hairstyle,
      樣貌: user_data.value.appearance,
      衣著: user_data.value.clothes,
      生日月份: user_data.value.birthday_month,
      生日日期: user_data.value.birthday_day,
      愛好: user_data.value.favourite,
      其他重要資訊: user_data.value.extra_information,
      金錢: user_data.value.money,
      心情: 50, // 默認心情
      性慾: 0, // 默認性慾
      關係: Object.fromEntries(user_data.value.關係 || new Map()),
      友好度: {},
      愛情度: {},
      所持物: Object.fromEntries(user_data.value.所持物 || new Map()),
    };

    // 更新 characters.c1
    characters.c1 = user_character_data;

    variables.characters = characters;
    // 保存到聊天變數
    replaceVariables(variables, { type: 'chat' });
  } catch (error) {
    console.error('Failed to save user data to chat variables:', error);
  }
};

const castObjectToString = (object: Record<string, any>): string => {
  return (
    '[' +
    Object.entries(object)
      .map(([key, value]) => (typeof value === 'string' ? `'${key}':'${value}'` : `'${key}':${value}`))
      .join(', ') +
    ']'
  );
};

const getUserPrompt = (): string => {
  let user_prompt = '請根據世界背景資訊、生成要求及已有角色資料，為用戶完善以下的角色資料設定：\n';
  user_prompt += '\n';
  user_prompt += `姓氏：${user_data.value.surname}\n`;
  user_prompt += `名字：${user_data.value.name}\n`;
  user_prompt += `年齡：${user_data.value.age}\n`;
  user_prompt += `性別：${user_data.value.gender}\n`;
  user_prompt += `身份：${user_data.value.identity}\n`;
  user_prompt += `簡介：${user_data.value.introduction}\n`;
  user_prompt += `性格：${user_data.value.personality}\n`;
  user_prompt += `身高：${user_data.value.height}\n`;
  user_prompt += `體重：${user_data.value.weight}\n`;
  user_prompt += `胸圍：${user_data.value.chest_size}\n`;
  user_prompt += `罩杯：${user_data.value.cup_size}\n`;
  user_prompt += `腰圍：${user_data.value.waist_size}\n`;
  user_prompt += `臀圍：${user_data.value.hips_size}\n`;
  user_prompt += `髮型：${user_data.value.hairstyle}\n`;
  user_prompt += `樣貌：${user_data.value.appearance}\n`;
  user_prompt += `衣著：${user_data.value.clothes}\n`;
  user_prompt += `生日(月)：${user_data.value.birthday_month}\n`;
  user_prompt += `生日(日)：${user_data.value.birthday_day}\n`;
  user_prompt += `喜好：${user_data.value.favourite}\n`;
  user_prompt += `其他重要資訊：${user_data.value.extra_information}\n`;
  user_prompt += `金錢：${user_data.value.money}\n`;
  user_prompt += `關係：${castObjectToString(Object.fromEntries(user_data.value.關係 || new Map()))}\n`;
  user_prompt += `所持物：${castObjectToString(Object.fromEntries(user_data.value.所持物 || new Map()))}\n`;
  return user_prompt;
};

const getPreWorldInfoSystemPrompt = (): string => {
  const variable = getVariables({ type: 'chat' });
  const world_info: string = variable.world_info;
  let character_description = getCharData('current')!.description;
  character_description = character_description.replace('{{getvar::world_info}}', world_info);
  let pre_world_info_system_prompt =
    '你是一個專業的角色設計助手，擅長創造豐富多彩的角色設定。請根據提供的世界背景及生成要求，為用戶完善角色資料。\n';
  pre_world_info_system_prompt += '\n';
  pre_world_info_system_prompt += '<世界背景>\n';
  return pre_world_info_system_prompt;
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
  post_world_info_system_prompt += `${getCharacterStatusPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getItemTablePrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getExtraWorldInfoPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<生成要求>\n';
  post_world_info_system_prompt += `${user_data.value.generation_requirement}\n`;
  post_world_info_system_prompt += '</生成要求>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<example>\n';
  post_world_info_system_prompt +=
    '# The following is an example of user input and expected output. Please strictly follow the style and format to generate the output. Output anything other than this format is prohibited.\n';
  post_world_info_system_prompt += `姓氏：string\n`;
  post_world_info_system_prompt += `名字：string\n`;
  post_world_info_system_prompt += `年齡：number\n`;
  post_world_info_system_prompt += `性別：'男' | '女' | '不明'\n`;
  post_world_info_system_prompt += `身份：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `簡介：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `性格：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `身高：number\n`;
  post_world_info_system_prompt += `體重：number\n`;
  post_world_info_system_prompt += `胸圍：number\n`;
  post_world_info_system_prompt += `罩杯：'Capital Letter' | '不適用'\n`;
  post_world_info_system_prompt += `腰圍：number\n`;
  post_world_info_system_prompt += `臀圍：number\n`;
  post_world_info_system_prompt += `髮型：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `樣貌：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `衣著：'以第三人稱客觀地描述當前身上服裝'\n`;
  post_world_info_system_prompt += `生日(月)：number\n`;
  post_world_info_system_prompt += `生日(日)：number\n`;
  post_world_info_system_prompt += `喜好：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `其他重要資訊：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `金錢：number\n`;
  post_world_info_system_prompt += `關係：['character_id':'對此角色的關係', ...]\n`;
  post_world_info_system_prompt += `所持物：['item_id':quantity, ...]\n`;
  post_world_info_system_prompt += '</example>';
  return post_world_info_system_prompt;
};
// 生成用戶資料
const generateUserProfile = async () => {
  is_generating.value = true;
  try {
    const user_prompt = getUserPrompt();
    const pre_world_info_system_prompt = getPreWorldInfoSystemPrompt();
    const post_world_info_system_prompt = getPostWorldInfoSystemPrompt();
    const result = await generateRaw({
      user_input: user_prompt,
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
    parseAndFillGeneratedData(result);

    // 保存生成結果到 localStorage
    try {
      localStorage.setItem(
        'user_profile_generated',
        JSON.stringify({
          generation_requirement: user_data.value.generation_requirement,
          generated_surname: user_data.value.generated_surname,
          generated_name: user_data.value.generated_name,
          generated_age: user_data.value.generated_age,
          generated_gender: user_data.value.generated_gender,
          generated_identity: user_data.value.generated_identity,
          generated_introduction: user_data.value.generated_introduction,
          generated_personality: user_data.value.generated_personality,
          generated_height: user_data.value.generated_height,
          generated_weight: user_data.value.generated_weight,
          generated_chest_size: user_data.value.generated_chest_size,
          generated_cup_size: user_data.value.generated_cup_size,
          generated_waist_size: user_data.value.generated_waist_size,
          generated_hips_size: user_data.value.generated_hips_size,
          generated_hairstyle: user_data.value.generated_hairstyle,
          generated_appearance: user_data.value.generated_appearance,
          generated_clothes: user_data.value.generated_clothes,
          generated_birthday_month: user_data.value.generated_birthday_month,
          generated_birthday_day: user_data.value.generated_birthday_day,
          generated_favourite: user_data.value.generated_favourite,
          generated_extra_information: user_data.value.generated_extra_information,
          generated_money: user_data.value.generated_money,
          generated_relationship: user_data.value.generated_relationship,
          generated_inventory: user_data.value.generated_inventory,
        }),
      );
    } catch (error) {
      console.error('Failed to save generated user profile to localStorage:', error);
    }
  } catch (error) {
    console.error('生成用戶資料失敗:', error);
    // 設置錯誤消息
    user_data.value.generated_age = '生成失敗，請重試。';
  } finally {
    is_generating.value = false;
  }
};

// 解析生成結果並填充數據
const parseAndFillGeneratedData = (result: string) => {
  // 根據換行符分割每一行
  const lines = result.split('\n');
  const data: Record<string, string> = {};

  for (const line of lines) {
    const colonIndex = line.indexOf('：'); // 注意：這裡是全角冒號
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();

      // 映射到我們的字段
      switch (key) {
        case '姓氏':
          data.generated_surname = value.replace(/^["']|["']$/g, '');
          break;
        case '名字':
          data.generated_name = value.replace(/^["']|["']$/g, '');
          break;
        case '年齡':
          data.generated_age = value.replace(/[^\d]/g, '');
          break;
        case '性別':
          data.generated_gender = value.replace(/^["']|["']$/g, '');
          break;
        case '身份':
          data.generated_identity = value.replace(/^["']|["']$/g, '');
          break;
        case '簡介':
          data.generated_introduction = value.replace(/^["']|["']$/g, '');
          break;
        case '性格':
          data.generated_personality = value.replace(/^["']|["']$/g, '');
          break;
        case '身高':
          data.generated_height = value.replace(/[^\d]/g, '');
          break;
        case '體重':
          data.generated_weight = value.replace(/[^\d]/g, '');
          break;
        case '胸圍':
          data.generated_chest_size = value.replace(/[^\d]/g, '');
          break;
        case '罩杯':
          data.generated_cup_size = value.replace(/^["']|["']$/g, '');
          break;
        case '腰圍':
          data.generated_waist_size = value.replace(/[^\d]/g, '');
          break;
        case '臀圍':
          data.generated_hips_size = value.replace(/[^\d]/g, '');
          break;
        case '髮型':
          data.generated_hairstyle = value.replace(/^["']|["']$/g, '');
          break;
        case '樣貌':
          data.generated_appearance = value.replace(/^["']|["']$/g, '');
          break;
        case '衣著':
          data.generated_clothes = value.replace(/^["']|["']$/g, '');
          break;
        case '生日(月)':
          data.generated_birthday_month = value.replace(/[^\d]/g, '');
          break;
        case '生日(日)':
          data.generated_birthday_day = value.replace(/[^\d]/g, '');
          break;
        case '喜好':
          data.generated_favourite = value.replace(/^["']|["']$/g, '');
          break;
        case '其他重要資訊':
          data.generated_extra_information = value.replace(/^["']|["']$/g, '');
          break;
        case '金錢':
          data.generated_money = value.replace(/[^\d]/g, '');
          break;
        case '關係':
          data.generated_relationship = value.replace(/^["']|["']$/g, '');
          break;
        case '所持物':
          data.generated_inventory = value.replace(/^["']|["']$/g, '');
          break;
      }
    }
  }

  // 應用解析的數據
  Object.assign(user_data.value, data);
};

// 應用所有生成結果
const applyAllGeneratedResults = () => {
  if (user_data.value.generated_surname) user_data.value.surname = user_data.value.generated_surname;
  if (user_data.value.generated_name) user_data.value.name = user_data.value.generated_name;
  if (user_data.value.generated_age) user_data.value.age = parseInt(user_data.value.generated_age) || null;
  if (user_data.value.generated_gender) user_data.value.gender = user_data.value.generated_gender;
  if (user_data.value.generated_identity) user_data.value.identity = user_data.value.generated_identity;
  if (user_data.value.generated_introduction) user_data.value.introduction = user_data.value.generated_introduction;
  if (user_data.value.generated_personality) user_data.value.personality = user_data.value.generated_personality;
  if (user_data.value.generated_height) user_data.value.height = parseInt(user_data.value.generated_height) || null;
  if (user_data.value.generated_weight) user_data.value.weight = parseInt(user_data.value.generated_weight) || null;
  if (user_data.value.generated_chest_size)
    user_data.value.chest_size = parseInt(user_data.value.generated_chest_size) || null;
  if (user_data.value.generated_cup_size) user_data.value.cup_size = user_data.value.generated_cup_size;
  if (user_data.value.generated_waist_size)
    user_data.value.waist_size = parseInt(user_data.value.generated_waist_size) || null;
  if (user_data.value.generated_hips_size)
    user_data.value.hips_size = parseInt(user_data.value.generated_hips_size) || null;
  if (user_data.value.generated_hairstyle) user_data.value.hairstyle = user_data.value.generated_hairstyle;
  if (user_data.value.generated_appearance) user_data.value.appearance = user_data.value.generated_appearance;
  if (user_data.value.generated_clothes) user_data.value.clothes = user_data.value.generated_clothes;
  if (user_data.value.generated_birthday_month)
    user_data.value.birthday_month = parseInt(user_data.value.generated_birthday_month) || null;
  if (user_data.value.generated_birthday_day)
    user_data.value.birthday_day = parseInt(user_data.value.generated_birthday_day) || null;
  if (user_data.value.generated_favourite) user_data.value.favourite = user_data.value.generated_favourite;
  if (user_data.value.generated_extra_information)
    user_data.value.extra_information = user_data.value.generated_extra_information;
  if (user_data.value.generated_money) user_data.value.money = parseInt(user_data.value.generated_money) || null;
  if (user_data.value.generated_relationship) {
    if (!user_data.value.關係) {
      user_data.value.關係 = new Map();
    }
    // 解析格式如 "['c1':'兒子', 'c2':'女兒']" 的關係數據
    const relationString = user_data.value.generated_relationship.replace(/^["']|["']$/g, ''); // 移除外層引號
    if (relationString.startsWith('[') && relationString.endsWith(']')) {
      const relationsContent = relationString.slice(1, -1); // 移除方括號
      const relationPairs = relationsContent.split(',').map(pair => pair.trim());
      for (const pair of relationPairs) {
        const colonIndex = pair.indexOf(':');
        if (colonIndex > 0) {
          const targetId = pair
            .substring(0, colonIndex)
            .replace(/^["']|["']$/g, '')
            .trim();
          const relationDesc = pair
            .substring(colonIndex + 1)
            .replace(/^["']|["']$/g, '')
            .trim();
          if (targetId && relationDesc) {
            user_data.value.關係.set(targetId, relationDesc);
          }
        }
      }
    }
    user_data.value.generated_relationship = '';
  }

  if (user_data.value.generated_inventory) {
    if (!user_data.value.所持物) {
      user_data.value.所持物 = new Map();
    }
    // 解析格式如 "['i1':1, 'i2':2]" 的所持物數據
    const inventoryString = user_data.value.generated_inventory.replace(/^["']|["']$/g, ''); // 移除外層引號
    if (inventoryString.startsWith('[') && inventoryString.endsWith(']')) {
      const inventoryContent = inventoryString.slice(1, -1); // 移除方括號
      const inventoryPairs = inventoryContent.split(',').map(pair => pair.trim());
      for (const pair of inventoryPairs) {
        const colonIndex = pair.indexOf(':');
        if (colonIndex > 0) {
          const itemId = pair
            .substring(0, colonIndex)
            .replace(/^["']|["']$/g, '')
            .trim();
          const quantity = parseInt(
            pair
              .substring(colonIndex + 1)
              .replace(/^["']|["']$/g, '')
              .trim(),
          );
          if (itemId && !isNaN(quantity) && quantity > 0) {
            user_data.value.所持物.set(itemId, quantity);
          }
        }
      }
    }
    user_data.value.generated_inventory = '';
  }

  // 清空所有生成結果
  user_data.value.generated_surname = '';
  user_data.value.generated_name = '';
  user_data.value.generated_age = '';
  user_data.value.generated_gender = '';
  user_data.value.generated_identity = '';
  user_data.value.generated_introduction = '';
  user_data.value.generated_personality = '';
  user_data.value.generated_height = '';
  user_data.value.generated_weight = '';
  user_data.value.generated_chest_size = '';
  user_data.value.generated_cup_size = '';
  user_data.value.generated_waist_size = '';
  user_data.value.generated_hips_size = '';
  user_data.value.generated_hairstyle = '';
  user_data.value.generated_appearance = '';
  user_data.value.generated_clothes = '';
  user_data.value.generated_birthday_month = '';
  user_data.value.generated_birthday_day = '';
  user_data.value.generated_favourite = '';
  user_data.value.generated_extra_information = '';
  user_data.value.generated_money = '';
  user_data.value.generated_relationship = '';
  user_data.value.generated_inventory = '';
};

// 更新關係
const updateRelation = (target_id: string, value: string) => {
  if (!user_data.value.關係) {
    user_data.value.關係 = new Map();
  }

  // 創建新的 Map 以確保響應式更新
  const newRelations = new Map(user_data.value.關係);
  newRelations.set(target_id, value);
  user_data.value.關係 = newRelations;

  // 保存資料
  saveUserData();
};

// 添加關係
const addRelation = () => {
  if (!user_data.value.selected_relation_target) return;

  if (!user_data.value.關係) {
    user_data.value.關係 = new Map();
  }

  // 如果已經存在，更新；否則添加
  user_data.value.關係.set(user_data.value.selected_relation_target, '');
  user_data.value.selected_relation_target = '';

  // 保存資料
  saveUserData();
};

// 移除關係
const removeRelation = (target_id: string) => {
  if (!user_data.value.關係) return;

  // 創建新的 Map 以確保響應式更新
  const new_relations = new Map(user_data.value.關係);
  new_relations.delete(target_id);
  user_data.value.關係 = new_relations;

  // 保存資料
  saveUserData();
};

// 更新所持物數量
const updateInventory = (item_id: string, quantity: number) => {
  if (!user_data.value.所持物) {
    user_data.value.所持物 = new Map();
  }

  // 創建新的 Map 以確保響應式更新
  const newInventory = new Map(user_data.value.所持物);
  if (quantity > 0) {
    newInventory.set(item_id, quantity);
  } else {
    newInventory.delete(item_id);
  }
  user_data.value.所持物 = newInventory;

  // 保存資料
  saveUserData();
};

// 添加所持物
const addInventory = () => {
  if (!user_data.value.selected_inventory_item || !user_data.value.selected_inventory_quantity) return;

  if (!user_data.value.所持物) {
    user_data.value.所持物 = new Map();
  }

  // 如果已經存在，更新數量；否則添加
  const currentQuantity = user_data.value.所持物.get(user_data.value.selected_inventory_item) || 0;
  user_data.value.所持物.set(
    user_data.value.selected_inventory_item,
    currentQuantity + user_data.value.selected_inventory_quantity,
  );
  user_data.value.selected_inventory_item = '';
  user_data.value.selected_inventory_quantity = 1;

  // 保存資料
  saveUserData();
};

// 移除所持物
const removeInventory = (item_id: string) => {
  if (!user_data.value.所持物) return;

  // 創建新的 Map 以確保響應式更新
  const newInventory = new Map(user_data.value.所持物);
  newInventory.delete(item_id);
  user_data.value.所持物 = newInventory;

  // 保存資料
  saveUserData();
};

// 應用單個生成結果
const applyGeneratedField = (field_name: string, generated_value: string) => {
  // 根據欄位名稱應用生成的值
  switch (field_name) {
    case '姓氏':
      user_data.value.surname = generated_value;
      user_data.value.generated_surname = '';
      break;
    case '名字':
      user_data.value.name = generated_value;
      user_data.value.generated_name = '';
      break;
    case '年齡':
      user_data.value.age = parseInt(generated_value) || null;
      user_data.value.generated_age = '';
      break;
    case '性別':
      user_data.value.gender = generated_value;
      user_data.value.generated_gender = '';
      break;
    case '身份':
      user_data.value.identity = generated_value;
      user_data.value.generated_identity = '';
      break;
    case '身高':
      user_data.value.height = parseInt(generated_value) || null;
      user_data.value.generated_height = '';
      break;
    case '體重':
      user_data.value.weight = parseInt(generated_value) || null;
      user_data.value.generated_weight = '';
      break;
    case '胸圍':
      user_data.value.chest_size = parseInt(generated_value) || null;
      user_data.value.generated_chest_size = '';
      break;
    case '罩杯':
      user_data.value.cup_size = generated_value;
      user_data.value.generated_cup_size = '';
      break;
    case '腰圍':
      user_data.value.waist_size = parseInt(generated_value) || null;
      user_data.value.generated_waist_size = '';
      break;
    case '臀圍':
      user_data.value.hips_size = parseInt(generated_value) || null;
      user_data.value.generated_hips_size = '';
      break;
    case '髮型':
      user_data.value.hairstyle = generated_value;
      user_data.value.generated_hairstyle = '';
      break;
    case '樣貌':
      user_data.value.appearance = generated_value;
      user_data.value.generated_appearance = '';
      break;
    case '衣著':
      user_data.value.clothes = generated_value;
      user_data.value.generated_clothes = '';
      break;
    case '簡介':
      user_data.value.introduction = generated_value;
      user_data.value.generated_introduction = '';
      break;
    case '性格':
      user_data.value.personality = generated_value;
      user_data.value.generated_personality = '';
      break;
    case '喜好':
      user_data.value.favourite = generated_value;
      user_data.value.generated_favourite = '';
      break;
    case '金錢':
      user_data.value.money = parseInt(generated_value) || null;
      user_data.value.generated_money = '';
      break;
    case '其他重要資訊':
      user_data.value.extra_information = generated_value;
      user_data.value.generated_extra_information = '';
      break;
    case '關係': {
      if (!user_data.value.關係) {
        user_data.value.關係 = new Map();
      }
      // 解析格式如 "['c1':'兒子', 'c2':'女兒']" 的關係數據
      const relationString = generated_value.replace(/^["']|["']$/g, ''); // 移除外層引號
      if (relationString.startsWith('[') && relationString.endsWith(']')) {
        const relationsContent = relationString.slice(1, -1); // 移除方括號
        const relationPairs = relationsContent.split(',').map(pair => pair.trim());
        for (const pair of relationPairs) {
          const colonIndex = pair.indexOf(':');
          if (colonIndex > 0) {
            const targetId = pair
              .substring(0, colonIndex)
              .replace(/^["']|["']$/g, '')
              .trim();
            const relationDesc = pair
              .substring(colonIndex + 1)
              .replace(/^["']|["']$/g, '')
              .trim();
            if (targetId && relationDesc) {
              user_data.value.關係.set(targetId, relationDesc);
            }
          }
        }
      }
      user_data.value.generated_relationship = '';
      break;
    }
    case '所持物': {
      if (!user_data.value.所持物) {
        user_data.value.所持物 = new Map();
      }
      // 解析格式如 "['i1':1, 'i2':2]" 的所持物數據
      const inventoryString = generated_value.replace(/^["']|["']$/g, ''); // 移除外層引號
      if (inventoryString.startsWith('[') && inventoryString.endsWith(']')) {
        const inventoryContent = inventoryString.slice(1, -1); // 移除方括號
        const inventoryPairs = inventoryContent.split(',').map(pair => pair.trim());
        for (const pair of inventoryPairs) {
          const colonIndex = pair.indexOf(':');
          if (colonIndex > 0) {
            const itemId = pair
              .substring(0, colonIndex)
              .replace(/^["']|["']$/g, '')
              .trim();
            const quantity = parseInt(
              pair
                .substring(colonIndex + 1)
                .replace(/^["']|["']$/g, '')
                .trim(),
            );
            if (itemId && !isNaN(quantity) && quantity > 0) {
              user_data.value.所持物.set(itemId, quantity);
            }
          }
        }
      }
      user_data.value.generated_inventory = '';
      break;
    }
  }

  // 保存資料
  saveUserData();
};

// 監視資料變化並自動保存
watch(
  user_data,
  () => {
    saveUserData();
  },
  { deep: true },
);

// 監視 generation_requirement 變化並保存到 localStorage
watch(
  () => user_data.value.generation_requirement,
  newValue => {
    try {
      const storedGenerated = localStorage.getItem('user_profile_generated');
      const generatedData = storedGenerated ? JSON.parse(storedGenerated) : {};
      generatedData.generation_requirement = newValue;
      localStorage.setItem('user_profile_generated', JSON.stringify(generatedData));
    } catch (error) {
      console.error('Failed to save generation_requirement to localStorage:', error);
    }
  },
  { immediate: false },
);

onMounted(() => {
  loadUserData();
});

onBeforeUnmount(() => {
  saveUserData();
});
</script>

<style lang="scss" scoped>
.user-profile-container {
  padding: 20px;
  color: #e0e0e0;
  max-width: 1000px;
  margin: 0 0;
  min-height: 600px;

  h3 {
    color: #007acc;
    margin-bottom: 24px;
    font-size: 20px;
  }

  h4 {
    color: #b0b0b0;
    margin-bottom: 16px;
    font-size: 16px;
    border-bottom: 1px solid #404040;
    padding-bottom: 8px;
  }
}

.section {
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #404040;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.input-group {
  &.full-width {
    grid-column: 1 / -1;
  }
}

.birthday-inputs {
  display: flex;
  gap: 8px;

  .birthday-input {
    flex: 1;
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

.display-text {
  width: 100%;
  padding: 12px 16px;
  background-color: transparent;
  border: 1px dashed #555;
  border-radius: 8px;
  color: #888;
  font-size: 14px;
  display: flex;
  align-items: center;
  font-style: italic;
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

.input-group {
  label {
    display: block;
    margin-bottom: 8px;
    color: #b0b0b0;
    font-weight: 500;
  }
}

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

.action-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
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

.relations-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.relation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1e1e1e 0%, #252525 100%);
  border: 1px solid #555;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #666;
  }

  .relation-target {
    color: #4fc3f7;
    font-weight: 600;
    font-size: 14px;
    min-width: 80px;
    padding: 4px 8px;
    background-color: #2a2a2a;
    border-radius: 4px;
    text-align: center;
  }

  .relation-input {
    flex: 1;
    padding: 10px 14px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }

    &::placeholder {
      color: #888;
    }
  }

  .remove-relation-btn {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    border: 1px solid #dc3545;
    border-radius: 6px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);

    &:hover {
      background: linear-gradient(135deg, #c82333 0%, #a02622 100%);
      border-color: #bd2130;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(220, 53, 69, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.add-relation {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #252525 0%, #2a2a2a 100%);
  border: 1px solid #555;
  border-radius: 8px;
  margin-top: 12px;

  .relation-select {
    flex: 1;
    padding: 12px 16px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }
  }

  .add-relation-btn {
    padding: 12px 20px;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    border: 1px solid #28a745;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #218838 0%, #1aa085 100%);
      border-color: #218838;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
    }

    &:disabled {
      background-color: #666;
      border-color: #666;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inventory-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1e1e1e 0%, #252525 100%);
  border: 1px solid #555;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #666;
  }

  .inventory-target {
    color: #4fc3f7;
    font-weight: 600;
    font-size: 14px;
    min-width: 80px;
    padding: 4px 8px;
    background-color: #2a2a2a;
    border-radius: 4px;
    text-align: center;
  }

  .inventory-input {
    flex: 1;
    padding: 10px 14px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }

    &::placeholder {
      color: #888;
    }
  }

  .remove-inventory-btn {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    border: 1px solid #dc3545;
    border-radius: 6px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);

    &:hover {
      background: linear-gradient(135deg, #c82333 0%, #a02622 100%);
      border-color: #bd2130;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(220, 53, 69, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.add-inventory {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #252525 0%, #2a2a2a 100%);
  border: 1px solid #555;
  border-radius: 8px;
  margin-top: 12px;

  .inventory-select {
    flex: 1;
    padding: 12px 16px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }
  }

  .quantity-input {
    padding: 12px 16px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    width: 80px;

    &:focus {
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }

    &::placeholder {
      color: #888;
    }

    &:disabled {
      background-color: #333;
      color: #666;
      cursor: not-allowed;
    }
  }

  .add-inventory-btn {
    padding: 12px 20px;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    border: 1px solid #28a745;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #218838 0%, #1aa085 100%);
      border-color: #218838;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
    }

    &:disabled {
      background-color: #666;
      border-color: #666;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@media (max-width: 768px) {
  .user-profile-container {
    padding: 16px;
  }

  .section {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .birthday-inputs {
    flex-direction: column;
  }
}
</style>
