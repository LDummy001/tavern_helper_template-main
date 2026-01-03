<template>
  <div class="phone-wrapper">
    <div class="phone-body">
      <div class="phone-notch" />
      <div class="phone-screen">
        <header class="status-bar">
          <div class="time-block">
            <span class="time">{{ timeString }}</span>
            <span class="date">{{ dateString }}</span>
          </div>
          <div class="signal-block">
            <div class="signal-bars">
              <span v-for="(active, index) in signalBars" :key="index" :class="['signal-bar', { active }]" />
            </div>
            <div class="battery">
              <span class="battery-icon">
                <span class="battery-fill" :style="{ width: `${status.battery}%` }" />
              </span>
              <span>{{ status.battery }}%</span>
            </div>
          </div>
        </header>

        <section class="hero-card">
          <div class="avatar" :style="avatarStyle">
            <span v-if="!avatarUrl">{{ initials }}</span>
          </div>
          <div class="hero-main">
            <p class="label">檔案同步</p>
            <h1>{{ status.name }}</h1>
            <p class="subtitle">{{ status.mood }}</p>
            <p class="location">
              <span class="dot" />
              {{ status.location }}
            </p>
          </div>
          <div class="hero-objective">
            <span>當前目標</span>
            <p>{{ status.objective }}</p>
          </div>
        </section>

        <section class="stats-panel">
          <article v-for="metric in metrics" :key="metric.key" class="stat-card">
            <header class="stat-header">
              <span class="stat-title">{{ metric.label }}</span>
              <span class="stat-value">{{ metric.value }}%</span>
            </header>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: `${metric.value}%` }" />
            </div>
          </article>
        </section>

        <section class="buff-panel">
          <div class="buff-header">
            <span>狀態效果</span>
            <small>即時同步</small>
          </div>
          <div class="buff-tags">
            <span v-for="buff in status.buffs" :key="buff.label" :class="['buff-pill', buff.type]">
              {{ buff.label }}
            </span>
          </div>
        </section>

        <section class="chat-panel">
          <div class="chat-header">
            <span>最近通訊</span>
            <button type="button" class="refresh" @click="refreshAll">重新整理</button>
          </div>
          <ul class="chat-list">
            <li v-for="bubble in chatPreview" :key="bubble.id" :class="['chat-bubble', bubble.sender]">
              <p class="chat-text">{{ bubble.text }}</p>
              <span class="chat-meta"> {{ bubble.sender === 'char' ? status.name : '你' }} · {{ bubble.time }} </span>
            </li>
            <li v-if="!chatPreview.length" class="chat-placeholder">
              <p>暫無聊天紀錄, 等待新的互動...</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { z } from 'zod';

type Buff = {
  label: string;
  type: 'positive' | 'negative' | 'neutral';
};

type Status = {
  name: string;
  mood: string;
  location: string;
  objective: string;
  hp: number;
  mp: number;
  stamina: number;
  focus: number;
  battery: number;
  signal: number;
  buffs: Buff[];
};

type StatusPayload = Partial<Omit<Status, 'buffs'>> & { buffs?: Buff[] };
type ChatBubble = {
  id: number;
  sender: 'char' | 'user';
  text: string;
  time: string;
};

const defaultStatus: Status = {
  name: '角色',
  mood: '情緒穩定',
  location: '未知位置',
  objective: '等待玩家指示',
  hp: 88,
  mp: 64,
  stamina: 72,
  focus: 55,
  battery: 76,
  signal: 3,
  buffs: [
    { label: '專注', type: 'positive' },
    { label: '輕裝', type: 'positive' },
    { label: '輕微疲勞', type: 'neutral' },
  ],
};

const StatusShape = z
  .object({
    name: z.string().min(1).optional(),
    mood: z.string().optional(),
    location: z.string().optional(),
    objective: z.string().optional(),
    hp: z.number().min(0).max(100).optional(),
    mp: z.number().min(0).max(100).optional(),
    stamina: z.number().min(0).max(100).optional(),
    focus: z.number().min(0).max(100).optional(),
    battery: z.number().min(0).max(100).optional(),
    signal: z.number().min(0).max(4).optional(),
    buffs: z
      .array(
        z.object({
          label: z.string(),
          type: z.enum(['positive', 'negative', 'neutral']).default('neutral'),
        }),
      )
      .optional(),
  })
  .partial();

const status = reactive<Status>({ ...defaultStatus });
const chatPreview = ref<ChatBubble[]>([]);
const clock = ref(new Date());
const avatarUrl = ref<string | null>(null);

let clockTimer: number | null = null;
const unregisterFns: Array<() => void> = [];

const timeString = computed(() => clock.value.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }));
const dateString = computed(() =>
  clock.value.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', weekday: 'short' }),
);

const signalBars = computed(() => Array.from({ length: 4 }, (_, index) => index < status.signal));
const metrics = computed(() => [
  { key: 'hp', label: '生命', value: status.hp },
  { key: 'mp', label: '意志', value: status.mp },
  { key: 'stamina', label: '體力', value: status.stamina },
  { key: 'focus', label: '專注', value: status.focus },
]);

const initials = computed(() => status.name.replace(/\s+/g, '').slice(0, 2).toUpperCase());

const avatarStyle = computed(() =>
  avatarUrl.value
    ? ({
        backgroundImage: `url(${avatarUrl.value})`,
      } as const)
    : {},
);

function setStatus(partial?: StatusPayload) {
  if (!partial) {
    return;
  }

  const parsed = StatusShape.safeParse(partial);
  if (!parsed.success) {
    console.warn('[手机角色状态栏] 無法解析狀態數據', parsed.error);
    return;
  }

  const { buffs, ...rest } = parsed.data;
  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    (status as Record<string, any>)[key] = value;
  });

  status.buffs = buffs?.length ? buffs : defaultStatus.buffs;
}

function refreshStatus() {
  try {
    status.name = substitudeMacros('{{char}}').trim() || defaultStatus.name;
  } catch (error) {
    console.warn('[手机角色状态栏] 解析角色名失敗', error);
    status.name = defaultStatus.name;
  }

  try {
    const variables = getVariables({ type: 'character' });
    const raw = _.get(variables, '手机角色状态栏') ?? _.get(variables, 'mobile_status') ?? _.get(variables, '角色狀態');
    if (_.isPlainObject(raw)) {
      setStatus(raw as StatusPayload);
    } else {
      status.battery = defaultStatus.battery;
      status.signal = defaultStatus.signal;
    }
  } catch (error) {
    console.info('[手机角色状态栏] 無法取得角色變量, 使用預設值', error);
    Object.assign(status, defaultStatus);
  }

  try {
    const avatar = getCharAvatarPath('current', true);
    avatarUrl.value = avatar;
  } catch (error) {
    console.warn('[手机角色状态栏] 無法取得頭像', error);
    avatarUrl.value = null;
  }
}

function compactText(message: string): string {
  const text = (message ?? '')
    .replace(/```[\s\S]*?```/g, '[代碼]')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[[^\]]*]\([^)]+\)/g, '$1')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 52 ? `${text.slice(0, 52)}…` : text;
}

function formatBubbleTime(value: unknown): string {
  const timestamp = typeof value === 'number' ? value : Date.now();
  return new Date(timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
}

function refreshChatPreview() {
  try {
    const lastId = getLastMessageId();
    if (Number.isNaN(lastId) || lastId < 0) {
      chatPreview.value = [];
      return;
    }

    const from = Math.max(0, lastId - 5);
    const range = from === lastId ? lastId : `${from}-${lastId}`;
    const messages = getChatMessages(range).filter(message => ['assistant', 'user'].includes(message.role));

    chatPreview.value = messages.slice(-4).map(message => ({
      id: message.message_id,
      sender: message.role === 'assistant' ? 'char' : 'user',
      text: compactText(message.message),
      time: formatBubbleTime(message.extra?.timestamp ?? Date.now()),
    }));
  } catch (error) {
    console.warn('[手机角色状态栏] 無法載入聊天', error);
    chatPreview.value = [];
  }
}

function refreshAll() {
  refreshStatus();
  refreshChatPreview();
}

function startClock() {
  clockTimer = window.setInterval(() => {
    clock.value = new Date();
  }, 30_000);
}

function stopClock() {
  if (clockTimer !== null) {
    clearInterval(clockTimer);
    clockTimer = null;
  }
}

function registerEvent<T extends EventType>(eventType: T, callback: () => void) {
  const handler = eventOn(eventType, ((..._args: Parameters<ListenerType[T]>) => callback()) as ListenerType[T]);
  unregisterFns.push(() => handler.stop());
}

onMounted(() => {
  refreshAll();
  startClock();

  registerEvent(tavern_events.MESSAGE_RECEIVED, refreshAll);
  registerEvent(tavern_events.MESSAGE_SENT, refreshAll);
  registerEvent(tavern_events.MESSAGE_UPDATED, refreshAll);
  registerEvent(tavern_events.CHARACTER_EDITED, refreshStatus);
  registerEvent(tavern_events.CHAT_CHANGED, refreshAll);
});

onUnmounted(() => {
  stopClock();
  unregisterFns.forEach(stop => stop());
});
</script>

<style lang="scss" scoped>
:global(body) {
  margin: 0;
  font-family: 'Noto Sans TC', 'PingFang TC', 'Microsoft YaHei', sans-serif;
}

.phone-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px 0;
  background: linear-gradient(140deg, #f6f1ff, #f8fbff 45%, #fef4f4);
}

.phone-body {
  position: relative;
  width: min(420px, 100%);
  aspect-ratio: 9 / 19.5;
  background: #0c0d12;
  border-radius: 36px;
  padding: 18px;
  box-shadow:
    0 12px 45px rgba(17, 21, 56, 0.35),
    0 8px 20px rgba(58, 96, 159, 0.18);
  overflow: hidden;
}

.phone-notch {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 18px;
  background: #000;
  border-radius: 0 0 16px 16px;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg, #141824, #0d111a 40%, #191d2c);
  border-radius: 24px;
  padding: 24px;
  color: #f5f5ff;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow: hidden;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
}

.time-block {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .time {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
  }

  .date {
    letter-spacing: 0.05em;
  }
}

.signal-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.signal-bars {
  display: flex;
  gap: 2px;
}

.signal-bar {
  width: 4px;
  height: 12px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.3s;

  &.active {
    background: #5ee4ff;
  }
}

.battery {
  display: flex;
  align-items: center;
  gap: 6px;
  font-variant-numeric: tabular-nums;
}

.battery-icon {
  width: 24px;
  height: 12px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  position: relative;
  padding: 1px;

  &::after {
    content: '';
    position: absolute;
    right: -4px;
    top: 3px;
    width: 3px;
    height: 6px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 2px;
  }
}

.battery-fill {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #3af1d5, #5ee4ff);
  transition: width 0.4s ease;
}

.hero-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  background: linear-gradient(135deg, rgba(67, 92, 219, 0.4), rgba(168, 111, 255, 0.35));
  padding: 18px;
  border-radius: 22px;
  position: relative;
  overflow: hidden;
}

.hero-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.25), transparent 55%);
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255, 255, 255, 0.25);
  z-index: 1;
}

.hero-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1;

  .label {
    font-size: 12px;
    letter-spacing: 0.2em;
    opacity: 0.7;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
  }

  .subtitle {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
  }

  .location {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #55ffb7;
    box-shadow: 0 0 8px rgba(85, 255, 183, 0.8);
  }
}

.hero-objective {
  grid-column: 1 / -1;
  margin-top: 8px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(6, 8, 18, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;

  span {
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: 0.65;
  }

  p {
    margin: 4px 0 0;
    font-size: 14px;
  }
}

.stats-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.stat-card {
  padding: 14px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);

  .stat-value {
    font-weight: 600;
    font-size: 14px;
  }
}

.stat-bar {
  width: 100%;
  height: 6px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #55ffb7, #5ee4ff);
  transition: width 0.35s ease;
}

.buff-panel {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.buff-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.buff-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.buff-pill {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 1px solid transparent;

  &.positive {
    background: rgba(85, 255, 183, 0.12);
    border-color: rgba(85, 255, 183, 0.4);
    color: #bfffed;
  }

  &.neutral {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
  }

  &.negative {
    background: rgba(255, 120, 143, 0.12);
    border-color: rgba(255, 120, 143, 0.4);
    color: #ffcfd8;
  }
}

.chat-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: rgba(10, 13, 22, 0.8);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px;
  gap: 12px;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.refresh {
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.chat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.chat-bubble {
  padding: 10px 12px;
  border-radius: 16px;
  max-width: 90%;
  background: rgba(255, 255, 255, 0.05);
  align-self: flex-start;

  &.char {
    background: rgba(94, 228, 255, 0.12);
    border: 1px solid rgba(94, 228, 255, 0.2);
    margin-left: auto;
    align-self: flex-end;
  }
}

.chat-text {
  margin: 0 0 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);
}

.chat-meta {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.chat-placeholder {
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
}

@media (max-width: 480px) {
  .phone-body {
    padding: 14px;
    border-radius: 30px;
  }

  .phone-screen {
    padding: 18px;
    border-radius: 20px;
  }
}
</style>
