import { ref } from 'vue';
import { State } from './variables/state';

// 生成狀態接口
interface GenerationState {
  is_generating: boolean;
  is_generating_new_swipe: boolean;
  current_generation_id: string | null;
  last_user_message_id: number | null;
  last_user_message_text: string;
  swipe_generation_message_id: number | null;
}

// 生成管理器類
export class GenerationManager {
  private static instance: GenerationManager;
  private state = ref<GenerationState>({
    is_generating: false,
    is_generating_new_swipe: false,
    current_generation_id: null,
    last_user_message_id: null,
    last_user_message_text: '',
    swipe_generation_message_id: null,
  });

  private constructor() {
    // 監聽生成結束事件
    eventOn(iframe_events.GENERATION_ENDED, (text: string, id: string) => {
      this.handleGenerationEnd(text, id);
    });
  }

  public static getInstance(): GenerationManager {
    if (!GenerationManager.instance) {
      GenerationManager.instance = new GenerationManager();
    }
    return GenerationManager.instance;
  }

  // 獲取生成狀態的響應式引用
  public getState() {
    return this.state;
  }

  // 開始新消息生成
  public startGeneration(message: string, message_id: number) {
    this.state.value.is_generating = true;
    this.state.value.last_user_message_id = message_id;
    this.state.value.last_user_message_text = message;
    const generation_id = `generation_${Date.now()}`;
    this.state.value.current_generation_id = generation_id;

    // 先發射 MESSAGE_SENT 事件來更新 State
    eventEmit('MESSAGE_SENT', message_id);

    // 使用更新後的 State 來隱藏正確的消息
    this.hideSummarizedMessages();

    // 發送生成請求
    generate({ generation_id: generation_id });
  }

  // 開始新 swipe 生成
  public startSwipeGeneration(message_id: number) {
    this.state.value.is_generating_new_swipe = true;
    this.state.value.swipe_generation_message_id = message_id;

    this.hideSummarizedMessages();

    // 隱藏當前消息
    setChatMessages(
      [
        {
          message_id: message_id,
          is_hidden: true,
        },
      ],
      { refresh: 'none' },
    );

    const generationId = `swipe_generation_${Date.now()}`;
    this.state.value.current_generation_id = generationId;
    generate({ generation_id: generationId });
  }

  // 停止生成
  public async stopGeneration(): Promise<void> {
    if (!this.state.value.current_generation_id) return;

    try {
      await stopGenerationById(this.state.value.current_generation_id);

      if (this.state.value.is_generating_new_swipe) {
        this.state.value.is_generating_new_swipe = false;
        this.state.value.swipe_generation_message_id = null;
      } else if (this.state.value.last_user_message_id !== null) {
        // 恢復用戶輸入
        this.restoreUserInput();
      }

      this.resetState();
    } catch (error) {
      console.error('Failed to stop generation:', error);
      this.resetState();
    }
  }

  // 恢復用戶輸入
  private restoreUserInput() {
    // 這裡需要通過事件通知 conversation_tab 恢復輸入
    eventEmit('RESTORE_USER_INPUT', this.state.value.last_user_message_text);
  }

  // 處理生成結束
  private async handleGenerationEnd(text: string, id: string) {
    try {
      // 只處理對話標籤的生成（以 generation_ 或 swipe_generation_ 開頭的 ID）
      if (!id || (!id.startsWith('generation_') && !id.startsWith('swipe_generation_'))) {
        return;
      }

      if (this.state.value.is_generating_new_swipe && this.state.value.swipe_generation_message_id !== null) {
        // 處理新 swipe 生成結束
        const message_id = this.state.value.swipe_generation_message_id;
        const existing_message = getChatMessages(message_id, { include_swipes: true })[0] as any;

        if (existing_message && existing_message.swipes) {
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
        // 處理正常生成結束：創建新的助手消息
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

      // 發送消息接收事件
      eventEmit('MESSAGE_RECEIVED', getLastMessageId());
    } catch (error) {
      console.error('Failed to handle generation end:', error);
    } finally {
      this.resetState();
    }
  }

  // 重置狀態
  private resetState() {
    this.state.value.is_generating = false;
    this.state.value.is_generating_new_swipe = false;
    this.state.value.current_generation_id = null;
    this.state.value.swipe_generation_message_id = null;
    this.state.value.last_user_message_id = null;
    this.state.value.last_user_message_text = '';
  }

  // 檢查是否正在生成
  public isGenerating(): boolean {
    return this.state.value.is_generating || this.state.value.is_generating_new_swipe;
  }

  // 獲取當前生成 ID
  public getCurrentGenerationId(): string | null {
    return this.state.value.current_generation_id;
  }

  // 隱藏被 summary 覆蓋的消息
  private hideSummarizedMessages(): void {
    try {
      const state = State.loadFromVariable(getLastMessageId()); // 從最新消息變數加載狀態
      const latest_summary_last_message_id = state.getLatestSummaryLastMessageId();
      const total_messages = getLastMessageId() + 1; // 消息 ID 從 0 開始，所以總數是 last_id + 1

      const messages_to_update = [];

      // 隱藏從 0 到 latest_summary_last_message_id 的所有消息
      if (latest_summary_last_message_id >= 0) {
        for (let message_id = 0; message_id <= latest_summary_last_message_id; message_id++) {
          messages_to_update.push({
            message_id: message_id,
            is_hidden: true,
          });
        }
      }

      // 確保其他消息不會被隱藏
      for (let message_id = latest_summary_last_message_id + 1; message_id < total_messages; message_id++) {
        messages_to_update.push({
          message_id: message_id,
          is_hidden: false,
        });
      }

      if (messages_to_update.length > 0) {
        setChatMessages(messages_to_update, { refresh: 'none' });
      }
    } catch (error) {
      console.error('Failed to hide summarized messages:', error);
    }
  }
}

// 導出單例實例
export const generationManager = GenerationManager.getInstance();
