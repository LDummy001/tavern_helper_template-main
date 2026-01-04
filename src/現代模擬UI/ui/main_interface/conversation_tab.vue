<template>
  <div class="conversation-tab-container">
    <div class="main-content">
      <div class="dialogue-fullscreen">
        <div ref="messages_container_ref" class="messages-container">
          <!-- 載入更多消息按鈕 -->
          <div v-if="has_more_messages" class="load-more-container">
            <button class="load-more-btn" @click="loadMoreMessages">載入更多消息</button>
          </div>

          <div v-for="(message, msg_index) in messages" :key="msg_index" class="message" :class="message.role">
            <div v-if="editing_message_index === msg_index" class="edit-mode">
              <textarea v-model="editing_text" class="edit-textarea" rows="3" @keydown="handleEditKeyDown"></textarea>
              <div class="edit-controls">
                <button class="edit-btn confirm-btn" @click="saveEdit(message, msg_index)">✓</button>
                <button class="edit-btn cancel-btn" @click="cancelEdit">✕</button>
              </div>
            </div>
            <template v-else>
              <div class="message-actions">
                <button
                  v-if="message.role === 'assistant' && !message.is_latest_assistant"
                  class="rewind-message-btn"
                  title="從此點回退對話"
                  @click="rewindConversation(message, msg_index)"
                >
                  ⏪
                </button>
                <button class="edit-message-btn" title="編輯消息" @click="startEdit(message, msg_index)">✏️</button>
              </div>
              <div class="message-content">
                <template v-for="(segment, index) in parseMessageText(message.content)" :key="index">
                  <!-- 普通文本 -->
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-if="segment.type === 'plain_text'" v-html="segment.message"></span>

                  <!-- 摺疊欄 -->
                  <FoldBarComponent
                    v-if="segment.type === 'fold_bar'"
                    :title="segment.fold_bar_title || '內容'"
                    :is-open="segment.is_open || false"
                  >
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="segment.message"></span>
                  </FoldBarComponent>
                </template>
              </div>
              <div v-if="message.is_latest_assistant && message.swipes" class="swipe-controls">
                <button class="swipe-btn" :disabled="(message.swipe_id || 0) <= 0" @click="previousSwipe(message)">
                  ‹
                </button>
                <span class="swipe-indicator"> {{ (message.swipe_id || 0) + 1 }}/{{ message.swipes.length }} </span>
                <button class="swipe-btn" :disabled="is_generating_new_swipe" @click="nextSwipe(message)">›</button>
                <button
                  class="swipe-btn delete-btn"
                  :disabled="message.swipes.length <= 1"
                  title="刪除當前swipe"
                  @click="deleteSwipe(message)"
                >
                  ×
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="input-area">
        <div class="input-container">
          <textarea
            ref="message_input_ref"
            v-model="user_input"
            class="message-input"
            placeholder="輸入您的訊息..."
            rows="1"
            @keydown="handleKeyDown"
            @input="adjustTextareaHeight"
          ></textarea>
          <div v-if="is_generating || is_generating_new_swipe" class="loading-spinner"></div>
          <button
            class="send-button"
            @click="is_generating || is_generating_new_swipe ? stopGeneration() : sendMessage()"
          >
            {{ is_generating || is_generating_new_swipe ? '停止' : '發送' }}
          </button>
        </div>
      </div>

      <!-- 通用組件 -->
      <ConfirmationWindow
        :confirm-dialog="confirm_dialog"
        @confirm-dialog-confirm="handleConfirmDialogConfirm"
        @confirm-dialog-cancel="handleConfirmDialogCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { State } from '@/現代模擬UI/variable_logic/variables/state';
import { nextTick, onMounted, ref } from 'vue';
import ConfirmationWindow from '../common_elements/confirmation_window.vue';
import FoldBarComponent from '../common_elements/fold_bar.vue';

const emit = defineEmits<{
  renderSizeChanged: [newSize: number];
}>();

const user_input = ref('');
const messages = ref<
  {
    content: string;
    role: string;
    swipe_id?: number;
    swipes?: string[];
    swipes_data?: Record<string, any>;
    swipes_info?: Record<string, any>;
    is_latest_assistant?: boolean;
  }[]
>([]);
const is_generating = ref(false);
const current_generation_id = ref<string | null>(null);
const last_user_message_id = ref<number | null>(null);
const last_user_message_text = ref('');
const is_generating_new_swipe = ref(false);
const swipe_generation_message_id = ref<number | null>(null);
const message_input_ref = ref<HTMLTextAreaElement | null>(null);
const messages_container_ref = ref<HTMLDivElement | null>(null);
const editing_message_index = ref<number | null>(null);
const editing_text = ref('');
const confirm_dialog = ref({
  visible: false,
  title: '',
  message: '',
  confirmText: '確定',
  cancelText: '取消',
});
const render_size = ref(10); // 默認渲染大小
const rendered_messages_count = ref(0); // 當前已渲染的消息總數
const has_more_messages = ref(false); // 是否還有更多消息

// 載入聊天設置
const loadChatSettings = () => {
  try {
    const settings = getVariables({ type: 'chat' });
    if (settings?.settings?.render_size) {
      render_size.value = settings.settings.render_size;
    }
  } catch (error) {
    console.error('Failed to load chat settings:', error);
  }
};

// 載入更多消息
const loadMoreMessages = () => {
  if (messages_container_ref.value) {
    // 記錄載入前的滾動位置
    const previousScrollHeight = messages_container_ref.value.scrollHeight;
    const previousScrollTop = messages_container_ref.value.scrollTop;

    // 增加渲染的消息數量
    rendered_messages_count.value += render_size.value;

    // 載入消息
    loadMessages();

    // 使用雙重nextTick確保DOM完全更新（處理可能的動態內容高度變化）
    nextTick(() => {
      nextTick(() => {
        if (messages_container_ref.value) {
          const newScrollHeight = messages_container_ref.value.scrollHeight;
          const addedHeight = newScrollHeight - previousScrollHeight;

          // 調整滾動位置以補償新增的內容
          messages_container_ref.value.scrollTop = previousScrollTop + addedHeight;
        }
      });
    });
  } else {
    // 如果沒有滾動容器引用，直接載入
    rendered_messages_count.value += render_size.value;
    loadMessages();
  }
};

// 重置渲染狀態（用於生成新消息或回退後）
const resetRenderState = () => {
  rendered_messages_count.value = render_size.value;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    sendMessage();
  }
};

const adjustTextareaHeight = () => {
  if (message_input_ref.value) {
    message_input_ref.value.style.height = 'auto';
    const newHeight = Math.min(message_input_ref.value.scrollHeight, 120);
    message_input_ref.value.style.height = `${newHeight}px`;
  }
};

const startEdit = (message: any, index: number) => {
  editing_message_index.value = index;
  editing_text.value = message.content;
};

const cancelEdit = () => {
  editing_message_index.value = null;
  editing_text.value = '';
};

const saveEdit = async (message: any, index: number) => {
  if (editing_text.value.trim() && editing_text.value !== message.content) {
    try {
      if (message.role === 'user') {
        await setChatMessages(
          [
            {
              message_id: getLastMessageId() - (messages.value.length - 1 - index),
              message: editing_text.value.trim(),
            },
          ],
          { refresh: 'none' },
        );
      } else if (message.role === 'assistant') {
        if (message.swipes) {
          const currentSwipeId = message.swipe_id || 0;
          const newSwipes = [...message.swipes];
          newSwipes[currentSwipeId] = editing_text.value.trim();

          await setChatMessages(
            [
              {
                message_id: getLastMessageId() - (messages.value.length - 1 - index),
                swipes: newSwipes,
              },
            ],
            { refresh: 'none' },
          );
        } else {
          await setChatMessages(
            [
              {
                message_id: getLastMessageId() - (messages.value.length - 1 - index),
                message: editing_text.value.trim(),
              },
            ],
            { refresh: 'none' },
          );
        }
      }
      loadMessages();
    } catch (error) {
      console.error('Failed to save edit:', error);
    }
  }
  cancelEdit();
};

const handleEditKeyDown = (_event: KeyboardEvent) => {};

const rewindConversation = (message: any, index: number) => {
  showConfirmDialog('回退對話', '確定要從此點回退對話嗎？這將刪除此點之後的所有消息。', () =>
    performRewind(message, index),
  );
};

// 執行rewind操作
const performRewind = async (_message: any, index: number) => {
  try {
    // 找到fork點之後的所有消息ID
    const lastMessageId = getLastMessageId();
    const messagesToDelete: number[] = [];

    // 從rewind點之後開始的所有消息（不包括當前助手消息）
    for (let i = index + 1; i < messages.value.length; i++) {
      const messageId = lastMessageId - (messages.value.length - 1 - i);
      messagesToDelete.push(messageId);
    }

    // 刪除fork點之後的所有消息
    if (messagesToDelete.length > 0) {
      await deleteChatMessages(messagesToDelete, { refresh: 'none' });
    }

    // 找到rewind點之後的用戶消息（通常是緊跟在助手消息之後的用戶消息）
    let userMessageToRestore = '';
    // 從rewind點開始向後查找第一個用戶消息
    for (let i = index + 1; i < messages.value.length; i++) {
      if (messages.value[i].role === 'user') {
        userMessageToRestore = messages.value[i].content;
        break;
      }
    }

    user_input.value = userMessageToRestore;
    // 回退後重置渲染狀態，只顯示最新的消息
    resetRenderState();
    loadMessages();
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error('Failed to rewind conversation:', error);
  }
};

// XML標籤處理相關接口
interface tagRule {
  tag_name: string;
  match_mode: 'both' | 'end_only';
  match_strategy: 'first' | 'last';
  display_mode: 'invisible' | 'fold_bar';
  title_name: string;
}

// 消息片段接口
interface MessageSegment {
  type: 'plain_text' | 'fold_bar';
  message: string;
  fold_bar_title?: string;
  is_open?: boolean;
}

// 獲取XML摺疊規則
const getTagRules = (): tagRule[] => {
  try {
    const settings = getVariables({ type: 'chat' });
    return settings?.settings?.tag_rules || [];
  } catch (error) {
    console.error('Failed to load folding rules:', error);
    return [];
  }
};

// 解析消息文本，返回結構化的片段數組
const parseMessageText = (text: string): MessageSegment[] => {
  // 處理對話文本，將「」之間的文本標記出來

  let message_segments: MessageSegment[] = [{ type: 'plain_text', message: text }];
  const tag_rules = getTagRules();
  for (const tag_rule of tag_rules) {
    message_segments = processTagRule(tag_rule, message_segments);
  }
  for (const message_segment of message_segments) {
    if (message_segment.type === 'plain_text')
      message_segment.message = message_segment.message.replace(
        /「([^」]*)」/g,
        '<span class="dialogue-text">「$1」</span>',
      );
  }
  return message_segments;
};

const processTagRule = (tag_rule: tagRule, message_segments: MessageSegment[]) => {
  const result: MessageSegment[] = [];
  for (const message_segment of message_segments) {
    result.push(message_segment);
    if (message_segment.type !== 'plain_text') continue;
    const message = message_segment.message;
    const start_tag = `<${tag_rule.tag_name}>`;
    const end_tag = `</${tag_rule.tag_name}>`;
    const start_index = message.indexOf(start_tag);
    const end_index = tag_rule.match_strategy === 'first' ? message.indexOf(end_tag) : message.lastIndexOf(end_tag);
    if (end_index < 0) continue;
    if (tag_rule.match_mode === 'both' && start_index < 0) continue;
    const front_message = start_index < 0 ? '' : message.substring(0, start_index);
    const target_message = message.substring(start_index + start_tag.length, end_index);
    const end_message = message.substring(end_index + end_tag.length);
    result.pop();
    if (tag_rule.display_mode === 'invisible') {
      result.push({ type: 'plain_text', message: front_message + end_message });
    } else if (tag_rule.display_mode === 'fold_bar') {
      if (front_message !== '') result.push({ type: 'plain_text', message: front_message });
      result.push({
        type: 'fold_bar',
        message: target_message,
        fold_bar_title: tag_rule.title_name || tag_rule.tag_name,
      });
      if (end_message !== '') result.push({ type: 'plain_text', message: end_message });
    }
  }
  return result;
};

const scrollToBottom = () => {
  if (messages_container_ref.value) {
    messages_container_ref.value!.scrollTop = messages_container_ref.value!.scrollHeight;
  }
};

const showConfirmDialog = (title: string, message: string, confirmCallback?: () => void) => {
  confirm_dialog.value = {
    visible: true,
    title,
    message,
    confirmText: '確定',
    cancelText: '取消',
  };
  if (confirmCallback) {
    (confirm_dialog.value as any)._callback = confirmCallback;
  }
};

const handleConfirmDialogConfirm = () => {
  const callback = (confirm_dialog.value as any)._callback;
  if (callback) {
    callback();
  }
  confirm_dialog.value.visible = false;
  delete (confirm_dialog.value as any)._callback;
};

const handleConfirmDialogCancel = () => {
  confirm_dialog.value.visible = false;
};

const injectPrompt = (message_id: number) => {
  const state = State.loadFromVariable(message_id);
  const is_first_generation = message_id === -1;
  state.injectPrompt(is_first_generation);
};

const sendMessage = async (force?: boolean) => {
  if (force === undefined) force = false;
  if (force || user_input.value.trim()) {
    const message = user_input.value.trim();
    user_input.value = '';

    try {
      await createChatMessages(
        [
          {
            role: 'user',
            message: message,
          },
        ],
        { refresh: 'none' },
      );

      const last_message_id = getLastMessageId();
      last_user_message_id.value = last_message_id;
      last_user_message_text.value = message;

      // 生成新消息後重置渲染狀態，只顯示最新的消息
      resetRenderState();
      loadMessages();

      injectPrompt(getLastMessageId() - 1);
      is_generating.value = true;
      const generation_id = `generation_${Date.now()}`;
      current_generation_id.value = generation_id;
      generate({ generation_id: generation_id });
      eventEmit('MESSAGE_SENT', last_message_id);
    } catch (error) {
      console.error('Failed to send message:', error);
      is_generating.value = false;
      current_generation_id.value = null;
      last_user_message_id.value = null;
      last_user_message_text.value = '';
    }
  }
};

const stopGeneration = async () => {
  if (current_generation_id.value) {
    try {
      await stopGenerationById(current_generation_id.value);

      if (is_generating_new_swipe.value) {
        is_generating_new_swipe.value = false;
        swipe_generation_message_id.value = null;
      } else if (last_user_message_id.value !== null) {
        user_input.value = last_user_message_text.value;
        await deleteChatMessages([last_user_message_id.value], { refresh: 'none' });
        last_user_message_id.value = null;
        last_user_message_text.value = '';
        loadMessages();
      }

      is_generating.value = false;
      current_generation_id.value = null;
    } catch (error) {
      console.error('Failed to stop generation:', error);
      is_generating.value = false;
      is_generating_new_swipe.value = false;
      current_generation_id.value = null;
      swipe_generation_message_id.value = null;
    }
  }
};

const generateNewSwipe = async (_message: any) => {
  is_generating_new_swipe.value = true;
  swipe_generation_message_id.value = getLastMessageId();

  await setChatMessages(
    [
      {
        message_id: swipe_generation_message_id.value,
        is_hidden: true,
      },
    ],
    { refresh: 'none' },
  );

  injectPrompt(getLastMessageId() - 1);
  const generationId = `swipe_generation_${Date.now()}`;
  current_generation_id.value = generationId;
  generate({ generation_id: generationId });
};

const previousSwipe = async (message: any) => {
  if (message.swipe_id > 0) {
    const newSwipeId = message.swipe_id - 1;
    await setChatMessages(
      [
        {
          message_id: getLastMessageId(),
          swipe_id: newSwipeId,
        },
      ],
      { refresh: 'none' },
    );
    loadMessages();
    scrollToBottom();
  }
};

const nextSwipe = async (message: any) => {
  const currentSwipeId = message.swipe_id || 0;
  const maxSwipeId = message.swipes.length - 1;

  if (currentSwipeId < maxSwipeId) {
    // 切換到下一個現有的swipe
    const newSwipeId = currentSwipeId + 1;
    await setChatMessages(
      [
        {
          message_id: getLastMessageId(),
          swipe_id: newSwipeId,
        },
      ],
      { refresh: 'none' },
    );
    loadMessages();
    scrollToBottom();
  } else {
    // 沒有更多swipe，生成新的swipe
    await generateNewSwipe(message);
  }
};

const deleteSwipe = async (message: any) => {
  console.log('[deleteSwipe] message:', message);
  const current_swipe_id = message.swipe_id || 0;
  const swipes = message.swipes;
  const swipes_data = message.swipes_data;
  const swipes_info = message.swipes_info;

  // 確保至少保留一個swipe
  if (swipes.length <= 1) {
    return;
  }

  // 顯示自定義確認對話框
  showConfirmDialog(
    '刪除回應變體',
    `確定要刪除第 ${current_swipe_id + 1} 個回應變體嗎？\n\n這將永久刪除該回應變體。`,
    () => performDeleteSwipe(message, current_swipe_id, swipes, swipes_data, swipes_info),
  );
};

const performDeleteSwipe = async (
  _message: any,
  current_swipe_id: number,
  swipes: string[],
  swipes_data: Record<string, any>[],
  swipes_info: Record<string, any>[],
) => {
  // 創建新的swipes數組，移除當前swipe
  console.log('[performDeleteSwipe] swipes:', swipes);
  console.log('[performDeleteSwipe] swipes_data:', swipes_data);
  console.log('[performDeleteSwipe] swipes_info:', swipes_info);
  const new_swipes = swipes.filter((_: any, index: number) => index !== current_swipe_id);
  const new_swipes_data = swipes_data.filter((_: any, index: number) => index !== current_swipe_id);
  const new_swipes_info = swipes_info.filter((_: any, index: number) => index !== current_swipe_id);

  // 計算新的swipe_id
  let new_swipe_id = current_swipe_id;
  if (new_swipe_id >= new_swipes.length) {
    new_swipe_id = new_swipes.length - 1; // 如果刪除的是最後一個，切換到新的最後一個
  }

  await setChatMessages(
    [
      {
        message_id: getLastMessageId(),
        swipes: new_swipes,
        swipes_data: new_swipes_data,
        swipes_info: new_swipes_info,
        swipe_id: new_swipe_id,
      },
    ],
    { refresh: 'none' },
  );

  loadMessages();
  scrollToBottom();
};

const loadMessages = () => {
  try {
    const lastMessageId = getLastMessageId();
    if (lastMessageId >= 0) {
      // 計算要渲染的消息範圍
      const totalRendered = rendered_messages_count.value;
      const startMessageId = Math.max(0, lastMessageId - totalRendered + 1);
      const endMessageId = lastMessageId;

      // 獲取指定範圍的消息
      const chat_messages = getChatMessages(`${startMessageId}-${endMessageId}`, { include_swipes: true });

      messages.value = chat_messages.map((msg, index) => {
        const is_latest_assistant = msg.role === 'assistant' && index === chat_messages.length - 1;
        const swiped_msg = msg as any; // ChatMessageSwiped
        return {
          content: swiped_msg.swipes ? swiped_msg.swipes[swiped_msg.swipe_id || 0] : (msg as any).message,
          role: msg.role,
          swipe_id: swiped_msg.swipe_id,
          swipes: swiped_msg.swipes,
          swipes_data: swiped_msg.swipes_data,
          swipes_info: swiped_msg.swipes_info,
          is_latest_assistant: is_latest_assistant,
        };
      });

      // 檢查是否還有更多消息
      has_more_messages.value = startMessageId > 0;

      // 只有在初次載入時才滾動到底部
      if (rendered_messages_count.value === render_size.value) {
        nextTick(() => {
          scrollToBottom();
        });
      }
    }
  } catch (error) {
    console.error('Failed to load messages:', error);
    messages.value = [];
    has_more_messages.value = false;
  }
};

const handleRenderSizeChanged = (newSize: number) => {
  console.log('Render size changed to:', newSize);
  // 更新render_size變數
  render_size.value = newSize;
  // 重置渲染狀態以應用新的render_size
  resetRenderState();
  // 重新載入消息
  loadMessages();
};

// 導出方法供父組件調用
defineExpose({
  handleRenderSizeChanged,
  getScrollPosition: () => messages_container_ref.value?.scrollTop || 0,
  setScrollPosition: (position: number) => {
    if (messages_container_ref.value) {
      messages_container_ref.value.scrollTop = position;
    }
  },
});

onMounted(() => {
  // 載入聊天設置
  loadChatSettings();
  // 初始化渲染狀態
  rendered_messages_count.value = render_size.value;
  loadMessages();

  // 監聽初始化完成事件
  eventOn('initialization_completed', () => {
    console.log('[conversation_tab] initialization_completed start');
    sendMessage(true);
  });

  // 監聽生成結束事件
  eventOn(iframe_events.GENERATION_ENDED, async (text: string) => {
    try {
      if (is_generating_new_swipe.value && swipe_generation_message_id.value !== null) {
        const message_id = swipe_generation_message_id.value;
        const existing_message = getChatMessages(message_id, { include_swipes: true })[0] as any;

        if (existing_message && existing_message.swipes) {
          // 添加新的swipe到數組
          const new_swipes = [...existing_message.swipes, text];
          const new_swipe_id = new_swipes.length - 1;

          await setChatMessages(
            [
              {
                message_id: message_id,
                swipes: new_swipes,
                swipe_id: new_swipe_id,
                is_hidden: false, // 重新顯示消息
              },
            ],
            { refresh: 'none' },
          );
        }
      } else {
        // 正常生成：創建新的助手消息
        await createChatMessages(
          [
            {
              role: 'assistant',
              message: text,
            },
          ],
          { refresh: 'none' },
        );
      }

      // 刷新UI
      loadMessages();
      // 新消息到來後滾動到底部
      scrollToBottom();
      eventEmit('MESSAGE_RECEIVED', getLastMessageId());
    } catch (error) {
      console.error('Failed to handle generation end:', error);
    } finally {
      is_generating.value = false;
      is_generating_new_swipe.value = false;
      current_generation_id.value = null;
      swipe_generation_message_id.value = null;
      last_user_message_id.value = null;
      last_user_message_text.value = '';
    }
  });
});
</script>

<style lang="scss" scoped>
.conversation-tab-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialogue-fullscreen {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #1a1a1a;
  max-height: calc(100vh - 140px);
}

.load-more-container {
  display: flex;
  justify-content: center;
  padding: 16px;
  margin-bottom: 16px;
}

.load-more-btn {
  background-color: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 20px;
  color: #b0b0b0;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3a3a3a;
    border-color: #007acc;
    color: #007acc;
  }
}

.message {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #2a2a2a;
  border-radius: 12px;
  max-width: 90%;
  position: relative; /* 為編輯按鈕提供定位基準 */

  &.user {
    border-right: 4px solid #007acc;
    margin-left: auto;
    margin-right: 0;
    text-align: left;
  }

  &.assistant {
    border-left: 4px solid #28a745;
    margin-left: 0;
    margin-right: auto;
    text-align: left;
  }
}

.message-content {
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

:deep(.dialogue-text) {
  color: #f4c430; /* 柔和的金黃色，更適合暗色主題 */
  font-weight: 500;
}

.message-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  padding: 4px 12px 0 12px;
  justify-content: flex-end; /* 將按鈕對齊到右側 */
  background-color: rgba(0, 0, 0, 0.25); /* 更明顯的背景色區分 */
  border-radius: 8px 8px 0 0; /* 圓角，只在上方 */
}

.edit-message-btn,
.rewind-message-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  opacity: 1; /* 始終可見 */
  transition: opacity 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.edit-message-btn {
  &:hover {
    color: #007acc;
  }
}

.rewind-message-btn {
  &:hover {
    color: #28a745;
  }
}

.edit-mode {
  width: 100%;
}

.edit-textarea {
  width: 100%;
  padding: 12px;
  background-color: #2a2a2a;
  border: 1px solid #007acc;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.4;
  resize: none; /* 禁用手動調整大小 */
  outline: none;
  min-height: 60px; /* 最小高度 */
  field-sizing: content; /* 根據內容自動調整高度 */

  &:focus {
    border-color: #0056b3;
  }

  &::placeholder {
    color: #888;
  }
}

.edit-controls {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.edit-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &.confirm-btn {
    background-color: #28a745;
    color: white;

    &:hover {
      background-color: #218838;
    }
  }

  &.cancel-btn {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #c82333;
    }
  }
}

.swipe-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
}

.swipe-btn {
  background: none;
  border: none;
  color: #007acc;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: rgba(0, 122, 204, 0.2);
  }

  &:disabled {
    color: #666;
    cursor: not-allowed;
  }
}

.swipe-indicator {
  color: #b0b0b0;
  font-size: 12px;
  font-weight: 500;
  min-width: 40px;
  text-align: center;
}

.delete-btn {
  color: #ff6b6b !important;
  font-size: 16px;
  font-weight: bold;

  &:hover:not(:disabled) {
    background-color: rgba(255, 107, 107, 0.2);
  }

  &:disabled {
    color: #666 !important;
    cursor: not-allowed;
  }
}

.input-area {
  padding: 16px;
  background-color: #1a1a1a;
  border-top: 1px solid #404040;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  background-color: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 24px;
  color: #e0e0e0;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
  resize: none;
  min-height: 20px;
  max-height: 120px;

  &:focus {
    border-color: #007acc;
  }

  &::placeholder {
    color: #888;
  }
}

.send-button {
  padding: 12px 20px;
  background-color: #007acc;
  border: none;
  border-radius: 24px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004085;
  }
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #404040;
  border-top: 2px solid #007acc;
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

@media (max-width: 768px) {
  .messages-container {
    padding: 12px;
  }

  .input-area {
    padding: 12px;
  }

  .message-input {
    font-size: 16px;
  }

  .send-button {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
