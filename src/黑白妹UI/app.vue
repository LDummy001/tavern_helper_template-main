<template>
  <div class="galgame-container">
    <!-- 背景 -->
    <div class="background"></div>

    <!-- 統一寬度容器 -->
    <div class="content-wrapper">
      <!-- 主要內容區域 -->
      <div class="main-content">
        <!-- 對話框 -->
        <div class="dialogue-box">
          <div class="dialogue-text">
            {{ display_strings.dialogue_text }}
          </div>
        </div>
      </div>

      <!-- 物品欄面板 -->
      <div class="inventories-panel">
        <div class="inventories-header">
          <button class="inventories-btn" @click="toggleInventoriesDropdown">
            <span>物品欄</span>
            <div class="toggle-icon" :class="{ open: inventories_dropdown_open }"></div>
          </button>
        </div>
        <div class="inventories-content" :class="{ open: inventories_dropdown_open }">
          <div v-if="inventories.length === 0" class="no-items-message">
            <p>物品欄為空</p>
          </div>
          <div v-for="item in inventories" :key="item.name" class="inventory-item">
            <span class="item-name">{{ item.name }} </span>
            <span class="item-description">{{ item.description }}</span>
            <span class="item-quantity">數量:{{ item.quantity }}</span>
          </div>
          <div class="inventories-footer-toggle" @click="toggleInventoriesDropdown">▲ 收起 ▲</div>
        </div>
      </div>

      <!-- 底部狀態欄 -->
      <div class="bottom-status-bar">
        <!-- 第一行：日期時間和天氣 -->
        <div class="status-row-1">
          <span class="date-time"
            >{{ display_strings.month_day }} ({{ display_strings.day_of_week }}) {{ display_strings.time }}
            {{ display_strings.weather }}</span
          >
        </div>

        <!-- 第二行：地點 -->
        <div class="status-row-2">
          <span class="location"
            >{{ display_strings.big_place }}-{{ display_strings.middle_place }}-{{ display_strings.small_place }}</span
          >
        </div>

        <!-- 第三行：衣著 -->
        <div class="status-row-3">
          <span class="clothing">{{ clothing_display }}</span>
        </div>

        <!-- 第四行：信賴、興致、心情、金錢 -->
        <div class="status-row-4">
          <span class="status-item">信賴:{{ display_strings.trust }}</span>
          <span class="status-item">興致:{{ display_strings.interest }}</span>
          <span class="status-item">心情:{{ display_strings.mood }}</span>
          <span class="status-item">${{ remaining_money }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { State } from '@/VariableTracker/state';
import { GameState } from '@/黑白妹VT/game_state';
import { computed, onMounted, reactive, ref } from 'vue';

// 默認值配置
const NONE_STR = '???';
const defaults = {
  stamina: NONE_STR as number | '???',
  stamina_high: NONE_STR as number | '???',
  money: NONE_STR as number | '???',
  trust: NONE_STR as number | '???',
  interest: NONE_STR as number | '???',
  mood: NONE_STR,
  day_of_week: NONE_STR,
  month_day: NONE_STR,
  time: NONE_STR,
  big_place: NONE_STR,
  middle_place: NONE_STR,
  small_place: NONE_STR,
  weather: NONE_STR,
  current_action: NONE_STR,
  clothing: NONE_STR,
  dialogue_text: '[無法載入對話內容...]',
};

// 響應式狀態
const display_strings = reactive({ ...defaults });

// 計算屬性
const clothing_display = computed(() => {
  const clothing = game_state.getClothing();
  return clothing ? `妹妹衣著: ${clothing}` : '妹妹衣著: ???';
});

// 物品欄狀態
const inventories = ref<Array<{ name: string; description: string; quantity: number }>>([]);
const inventories_dropdown_open = ref<boolean>(false);

// 計算屬性
const VARIABLE_SCOPE = { type: 'chat' as const };
const CHARACTER_SCOPE = { type: 'character' as const };
const message_id = getCurrentMessageId();
const swipe_id = getChatMessages(message_id, { include_swipes: true })[0]?.swipe_id;

const stamina_percentage = computed(() => {
  if (typeof display_strings.stamina !== 'number') return 0;
  if (typeof display_strings.stamina_high !== 'number') return 0;
  return display_strings.stamina_high === 0
    ? 0
    : Math.round((display_strings.stamina / display_strings.stamina_high) * 100);
});

// 計算剩餘金錢
const remaining_money = computed(() => {
  const currentMoney = typeof display_strings.money === 'number' ? display_strings.money : 0;
  return currentMoney;
});

const variables = getVariables(VARIABLE_SCOPE);
const state = State.fromVariables(variables['history'][message_id][swipe_id]);
const game_state = new GameState(state);

// 從消息樓層變數獲取狀態
function loadStatus() {
  try {
    if (message_id === null) return;

    // 更新狀態值
    display_strings.stamina = game_state.getStamina() ?? defaults.stamina;
    display_strings.stamina_high = game_state.getStaminaHigh() ?? defaults.stamina_high;
    display_strings.money = game_state.getMoney() ?? defaults.money;
    display_strings.trust = game_state.getTrust() ?? defaults.trust;
    display_strings.interest = game_state.getInterest() ?? defaults.interest;
    display_strings.mood = getMoodString(game_state.getMood()) ?? defaults.mood;
    display_strings.day_of_week = getDayString(game_state.getDay()) ?? defaults.day_of_week;
    display_strings.month_day = `${game_state.getMonth()}月${game_state.getDate()}日`;
    display_strings.time = `${game_state.getHours().toString().padStart(2, '0')}:${game_state.getMinutes().toString().padStart(2, '0')}`;
    display_strings.big_place = game_state.getBigPlace() ?? defaults.big_place;
    display_strings.middle_place = game_state.getMiddlePlace() ?? defaults.middle_place;
    display_strings.small_place = game_state.getSmallPlace() ?? defaults.small_place;
    display_strings.weather = game_state.getWeather() ?? defaults.weather;
    display_strings.current_action = game_state.getCurrentAction() ?? defaults.current_action;
    display_strings.clothing = game_state.getClothing() ?? defaults.clothing;

    // 載入物品欄
    loadInventories(game_state);
  } catch (error) {
    // 載入失敗時不顯示錯誤，避免干擾用戶體驗
  }
}

// 載入物品欄
function loadInventories(game_state: GameState) {
  try {
    const rawInventories = game_state.getInventories();
    inventories.value = rawInventories.map(item => ({
      name: item.name,
      description: game_state.getItem(item.name)?.description || item.description,
      quantity: item.quantity,
    }));
  } catch (error) {
    inventories.value = [];
  }
}

// 心情數值轉換為字符串
function getMoodString(mood_num: number): string {
  const mood_strings = ['隨時都會爆發的狀態', '不高興', '普通', '不錯', '高興'];
  return mood_strings[mood_num + 2] ?? NONE_STR;
}

// 星期數值轉換為字符串
function getDayString(day_num: number): string {
  const day_strings = ['日', '一', '二', '三', '四', '五', '六'];
  return day_strings[day_num] ?? NONE_STR;
}

// 獲取對話文字（從最新消息）
function loadDialogue() {
  try {
    if (message_id === null) return;
    const chat_message = getChatMessages(message_id)[0];
    const message = chat_message.message;
    parseUserPerspective(message);
  } catch (error) {
    console.warn('[黑白妹UI] 無法載入對話文字', error);
  }
}

function retrieveStringInsideTag(text: string, tag: string) {
  const text_split = text.split(`<${tag}>`);
  const retrieve_text = text_split[text_split.length - 1].split(`</${tag}>`)[0];
  return retrieve_text;
}

function parseUserPerspective(message: string) {
  const dialogue_text = retrieveStringInsideTag(message, 'UserPerspective');
  display_strings.dialogue_text = dialogue_text ?? defaults.dialogue_text;
}

// 切換物品欄下拉選單
function toggleInventoriesDropdown() {
  inventories_dropdown_open.value = !inventories_dropdown_open.value;
}

onMounted(() => {
  loadStatus();
  loadDialogue();

  // 使用 eventMakeFirst 監聽 MESSAGE_SENT 事件，比黑白妹VT.event_listener.ts 更早執行
  eventMakeFirst(tavern_events.MESSAGE_SENT, (message_id: number) => {
    console.log('[黑白妹UI] MESSAGE_SENT start');
    if (getCurrentMessageId() + 1 !== message_id) return;
    const variables = getVariables(VARIABLE_SCOPE);
    variables['current'] = game_state.toVariables();
    replaceVariables(variables, VARIABLE_SCOPE);
    console.log('[黑白妹UI] MESSAGE_SENT end');
  });
});
</script>

<style lang="scss" scoped>
.galgame-container {
  position: relative;
  width: 100%;
  font-family: 'Comic Sans MS', 'Chalkduster', sans-serif;
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bottom-status-bar {
  background: rgba(20, 20, 20, 0.95);
  border: 3px solid #666;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 5px 5px 0px #333;
  font-size: 14px;
  font-weight: bold;
  color: #ccc;
}

.status-row-1 {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  gap: 20px;
}

.status-row-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.status-row-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.status-row-4 {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;
}

.date-time {
  color: #ccc;
  text-shadow: 1px 1px 0px #333;
  white-space: nowrap;
  justify-self: center;
}

.weather {
  color: #ccc;
  text-shadow: 1px 1px 0px #333;
  justify-self: center;
}

.location {
  color: #ccc;
  text-shadow: 1px 1px 0px #333;
  justify-self: center;
  text-align: center;
}

.current-action {
  color: #ccc;
  text-shadow: 1px 1px 0px #333;
  justify-self: center;
  text-align: center;
  font-weight: bold;
}

.stamina-bar {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 8px;
  justify-self: center;

  .value {
    color: #000;
    font-size: 11px;
    font-weight: bold;
    text-shadow:
      1px 1px 0px #fff,
      -1px -1px 0px #fff,
      1px -1px 0px #fff,
      -1px 1px 0px #fff;
    white-space: nowrap;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    pointer-events: none;
    grid-column: 2;
  }

  .label {
    color: #ccc;
    font-size: 12px;
    text-shadow: 1px 1px 0px #333;
    white-space: nowrap;
    grid-column: 1;
  }

  .bar-container {
    position: relative;
    width: 120px;
    height: 16px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid #666;
    border-radius: 6px;
    overflow: hidden;
    grid-column: 2;
  }

  .bar-fill {
    height: 100%;
    background: #ccc;
    border-radius: 5px;
    transition: width 0.3s ease;
  }
}

.money {
  color: #ccc;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 1px 1px 0px #333;
  justify-self: center;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #2a2a2a 25%, #1a1a1a 25%, #1a1a1a 50%, #2a2a2a 50%, #2a2a2a 75%, #1a1a1a 75%);
  background-size: 20px 20px;
  opacity: 0.3;
  z-index: -1;
}

.main-content {
  display: flex;
  flex: 1;
  padding: 20px 20px 0 20px;
  gap: 20px;
  align-items: flex-start;
}

.status-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;

  .label {
    color: #aaa;
  }

  .value {
    color: #ccc;
    text-shadow: 1px 1px 0px #333;
  }
}

.dialogue-box {
  flex: 1;
  background: rgba(20, 20, 20, 0.95);
  border: 3px solid #666;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 5px 5px 0px #333;
  min-height: 120px;
  display: flex;
  align-items: center;
}

.dialogue-text {
  font-size: 16px;
  line-height: 1.6;
  color: #ccc;
  text-shadow: 1px 1px 0px #333;
  word-wrap: break-word;
  white-space: pre-line; /* 保留換行符並自動換行 */
}

// 漫畫風效果
.galgame-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.03) 2px,
    rgba(255, 255, 255, 0.03) 4px
  );
  pointer-events: none;
}

.status-panel::after,
.dialogue-box::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #666;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .bottom-status-bar {
    padding: 12px;
    margin: 5px;
    gap: 6px;
    font-size: 12px;
  }

  .status-row-1 {
    gap: 6px;
  }

  .status-row-2 {
    gap: 6px;
  }

  .status-row-3 {
    gap: 6px;
  }

  .date-time,
  .weather,
  .location,
  .current-action,
  .money {
    justify-self: center;
    text-align: center;
  }

  .status-item {
    justify-self: center;
    text-align: center;
  }

  .stamina-bar {
    justify-self: center;
  }

  .stamina-bar .bar-container {
    width: 120px;
  }

  .main-content {
    padding: 10px 10px 0 10px;
  }

  .dialogue-box {
    margin-bottom: 10px;
  }
}

/* 商店面板樣式 */
.shop-panel {
  background: rgba(20, 20, 20, 0.95);
  border: 3px solid #666;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 5px 5px 0px #333;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  flex: 1;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.shop-header {
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.shop-header span {
  font-size: 18px;
  font-weight: bold;
  color: #ccc;
  text-shadow: 1px 1px 0px #333;
}

.no-items-message {
  text-align: center;
  padding: 20px;
  color: #ccc;
  font-size: 14px;
  text-shadow: 1px 1px 0px #333;
}

.no-items-message p {
  margin: 10px 0;
}

.shop-items {
  display: flex;
  flex-direction: column;
}

.shop-item {
  padding: 8px 12px;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.shop-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.shop-item:last-child {
  border-bottom: none;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.item-name {
  flex-shrink: 0;
  text-align: left;
  white-space: nowrap;
  align-self: center;
}

.item-price {
  font-size: 14px;
  font-weight: bold;
  color: #5ee4ff;
  text-shadow: 1px 1px 0px #000;
  margin-right: 12px;
  white-space: nowrap;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 120px;
  justify-content: flex-end;
}

.item-description {
  font-size: 13px;
  color: #888;
  text-shadow: 1px 1px 0px #333;
  line-height: 1.4;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 2px solid #666;
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
  font-size: 18px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-shadow: 1px 1px 0px #333;
}

.quantity-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: #888;
  transform: scale(1.05);
}

.quantity-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.05);
}

.quantity-input {
  width: 60px;
  height: 32px;
  border: 2px solid #666;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s ease;
  text-shadow: 1px 1px 0px #333;
}

.quantity-input:focus {
  border-color: #5ee4ff;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 8px rgba(94, 228, 255, 0.3);
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input[type='number'] {
  -moz-appearance: textfield;
}

@media (max-width: 768px) {
  .shop-panel {
    padding: 8px;
    margin: 4px 0;
  }

  .shop-item {
    padding: 6px 8px;
  }

  .item-header {
    gap: 4px;
    margin-bottom: 2px;
  }

  .item-name {
    font-size: 14px;
    margin-right: 4px;
  }

  .item-price {
    font-size: 13px;
    margin-right: 6px;
  }

  .item-controls {
    min-width: 85px;
  }

  .item-description {
    font-size: 12px;
    text-align: left;
  }

  .quantity-input {
    width: 38px;
    font-size: 12px;
  }

  .quantity-btn {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }
}

/* 物品欄面板樣式 */
.inventories-panel {
  background: rgba(20, 20, 20, 0.95);
  border: 3px solid #666;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 5px 5px 0px #333;
  font-size: 14px;
  font-weight: bold;
  color: #ccc;
}

.inventories-header {
  text-align: center;
  margin-bottom: 8px;
  padding-bottom: 4px;
}

.inventories-btn {
  position: relative;
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  color: #ccc;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 1px 1px 0px #333;

  .toggle-icon {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #ccc;
    transition: transform 0.3s ease;
    margin-left: 8px;
    flex-shrink: 0;

    &.open {
      transform: rotate(180deg);
    }
  }
}

.inventories-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.inventories-btn:focus {
  outline: none;
}

.inventories-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(20, 20, 20, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.inventories-content.open {
  max-height: 200px;
}

.inventory-item {
  padding: 8px 12px;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: #ccc;
  text-shadow: 1px 1px 0px #333;
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.inventory-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.inventory-item:last-child {
  border-bottom: none;
}

.item-name {
  flex-shrink: 0;
  text-align: left;
  margin-right: 8px;
  align-self: center;
}

.item-description {
  flex: 1;
  text-align: left;
  margin: 0 8px;
  align-self: flex-start;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.item-quantity {
  flex-shrink: 0;
  text-align: right;
  white-space: nowrap;
  align-self: center;
}

.inventories-footer-toggle {
  display: block;
  text-align: center;
  padding: 15px 0;
  color: #ccc;
  opacity: 0.8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  text-shadow: 1px 1px 0px #333;
}

.inventories-footer-toggle:hover {
  opacity: 1;
  transform: scale(1.02);
}

.inventories-footer-toggle:active {
  transform: scale(0.98);
}

.no-items-message {
  text-align: center;
  padding: 20px;
  color: #ccc;
  font-size: 14px;
  text-shadow: 1px 1px 0px #333;
}

.no-items-message p {
  margin: 10px 0;
}

@media (max-width: 768px) {
  .inventories-panel {
    padding: 12px;
    margin: 5px;
  }

  .inventories-header {
    margin-bottom: 6px;
    padding-bottom: 2px;
  }

  .inventories-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .inventory-item {
    padding: 6px 8px;
    font-size: 12px;
  }

  .inventories-footer-toggle {
    padding: 10px 0;
    font-size: 12px;
  }
}
</style>
