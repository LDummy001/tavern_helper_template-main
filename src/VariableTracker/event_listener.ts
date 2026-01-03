import _ from 'lodash';
import { Commands, PostCommand } from './command';
import { State } from './state';

const VARIABLE_SCOPE = { type: 'chat' as const };

function calculateMessageId(message_id: number): number {
  if (message_id < 0) message_id = getLastMessageId() + message_id + 1;
  return message_id;
}

export function getCurrentState(): State {
  const variables = getVariables(VARIABLE_SCOPE);
  const current = variables['current'] ?? null;
  return State.fromVariables(current);
}

export function setCurrentState(state: State): void {
  const variables = getVariables(VARIABLE_SCOPE);
  variables['current'] = state.toVariables();
  replaceVariables(variables, VARIABLE_SCOPE);
}

function emptyCurrentState(): void {
  const variables = getVariables(VARIABLE_SCOPE);
  variables['current'] = {};
  replaceVariables(variables, VARIABLE_SCOPE);
}

function setCurrentStateToPrev(message_id: number): void {
  if (message_id === 0) {
    emptyCurrentState();
  } else {
    const prev_message_id = message_id - 1;
    const prev_swipe_id = getSwipeId(prev_message_id);
    setCurrentState(getHistory(prev_message_id, prev_swipe_id));
  }
}

function getHistory(message_id: number, swipe_id: number): State {
  message_id = calculateMessageId(message_id);
  const variables = getVariables(VARIABLE_SCOPE);
  return State.fromVariables(variables['history'][message_id][swipe_id]);
}

function setHistory(state: State, message_id: number = -1, swipe_id: number): void {
  message_id = calculateMessageId(message_id);
  const variables = getVariables(VARIABLE_SCOPE);
  variables['history'] = variables['history'] ?? [];
  variables['history'][message_id] = variables['history'][message_id] ?? [];
  variables['history'][message_id][swipe_id] = state.toVariables();
  replaceVariables(variables, VARIABLE_SCOPE);
}

function deleteHistory(message_id: number, swipe_id: number): void {
  const variable = getVariables(VARIABLE_SCOPE);
  if (!variable.history) return;
  variable['history'][message_id].splice(swipe_id, 1);
  replaceVariables(variable, VARIABLE_SCOPE);
}

function deleteHistoryStartFrom(start_message_id: number): void {
  const variables = getVariables(VARIABLE_SCOPE);
  if (!variables.history) return;
  variables.history.splice(start_message_id);
  replaceVariables(variables, VARIABLE_SCOPE);
}

function getHistorySize(message_id: number): number {
  message_id = calculateMessageId(message_id);
  const variables = getVariables(VARIABLE_SCOPE);
  return variables['history'][message_id].length;
}

function getSwipeId(message_id: number): number {
  return getChatMessages(message_id, { include_swipes: true })[0].swipe_id;
}

function isSwipeExist(message_id: number, swipe_id: number): boolean {
  const chat_message = getChatMessages(message_id, { include_swipes: true })[0];
  return swipe_id < chat_message.swipes.length;
}

function getNumOfSwipe(message_id: number): number {
  return getChatMessages(message_id, { include_swipes: true })[0].swipes.length;
}

function executeCommand(message_id: number, swipe_id?: number) {
  console.log('[VariableTracker] executeCommand strat');

  let message: string;
  if (swipe_id === undefined) {
    message = getChatMessages(message_id)[0].message;
  } else {
    message = getChatMessages(message_id, { include_swipes: true })[0].swipes[swipe_id];
  }
  const commands: Commands = Commands.fromString(message);
  console.log('[VariableTracker] commands:', commands);

  const state = getCurrentState();
  commands.execute(state);
  console.log('[VariableTracker] state:', state);
  setCurrentState(state);

  console.log('[VariableTracker] executeCommand end');
}

/**
 *Execute the post-command in the message with *message_id* and *swipe_id*.
 * @param message_id The message_id of the message where the result are stored.
 * @param swipe_id The swipe_id of the message where the result are stored.
 */
function executePostCommand(message_id: number, swipe_id?: number) {
  console.log('[VariableTracker] executePostCommand strat');

  let message: string;
  if (swipe_id === undefined) {
    message = getChatMessages(message_id)[0].message;
  } else {
    message = getChatMessages(message_id, { include_swipes: true })[0].swipes[swipe_id];
  }
  const commands: Commands = Commands.fromString(message, 'post');
  console.log('[VariableTracker] post commands:', commands);

  const state = getCurrentState();
  commands.execute(state);
  console.log('[VariableTracker] state:', state);
  setCurrentState(state);

  console.log('[VariableTracker] executePostCommand end');
}

function restorePostCommandResultFromNextMessage(message_id: number, swipe_id?: number) {
  if (!swipe_id) swipe_id = getSwipeId(message_id);
  const message = getChatMessages(message_id, { include_swipes: true })[0].swipes[swipe_id];
  const commands: Commands = Commands.fromString(message, 'post');
  const state = getHistory(message_id, swipe_id);
  const next_message_id = message_id + 1;
  const next_swipe_id = getSwipeId(next_message_id);
  const next_state = getHistory(next_message_id, next_swipe_id);
  for (const command of commands) {
    const post_command = command as PostCommand;
    for (const restore_key of post_command.getRestoreKeys(state)) {
      const variable = next_state.getVariable(restore_key);
      if (variable) state.setVariable(restore_key, variable);
    }
  }
  setHistory(state, message_id, swipe_id);
}

function restorePostCommandResultFromHistory(message_id: number, swipe_id: number) {
  const current_message = getChatMessages(message_id, { include_swipes: true })[0].swipes[swipe_id];
  const commands: Commands = Commands.fromString(current_message, 'post');

  if (message_id !== 0) {
    const prev_message_id = message_id - 1;
    const prev_swipe_id = getSwipeId(prev_message_id);
    const prev_message = getChatMessages(prev_message_id, { include_swipes: true })[0].swipes[prev_swipe_id];
    const prev_commands = Commands.fromString(prev_message, 'post');
    for (const prev_command of prev_commands) {
      commands.pushCommand(prev_command);
    }

    const current_state = getCurrentState();
    const history_state = getHistory(message_id, swipe_id);
    for (const command of commands) {
      const post_command = command as PostCommand;
      for (const restore_key of post_command.getRestoreKeys(current_state)) {
        const variable = history_state.getVariable(restore_key);
        if (variable) current_state.setVariable(restore_key, variable);
      }
    }
    setCurrentState(current_state);
  }
}

function reprocessMessageFrom(start_message_id: number): void {
  setCurrentStateToPrev(start_message_id);
  for (let message_id = start_message_id; message_id <= getLastMessageId(); message_id++) {
    console.log('[DEBUG] message_id:', message_id);
    for (let swipe_id = 0; swipe_id < getNumOfSwipe(message_id); swipe_id++) {
      executeCommand(message_id, swipe_id);
      //restorePostCommandResultFromHistory(message_id, swipe_id);
      setHistory(getCurrentState(), message_id, swipe_id);
      setCurrentStateToPrev(message_id);
    }
    setCurrentState(getHistory(message_id, getSwipeId(message_id)));
  }
}

eventOn(tavern_events.MESSAGE_SENT, async (message_id: number) => {
  console.log('[VariableTracker] MESSAGE_SENT strat');
  executeCommand(message_id);
  executePostCommand(message_id);
  const swipe_id = getSwipeId(message_id);
  setHistory(getCurrentState(), message_id, swipe_id);
  console.log('[VariableTracker] MESSAGE_SENT end');
});

eventOn(tavern_events.MESSAGE_UPDATED, async (message_id: number) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('[VariableTracker] MESSAGE_UPDATED strat');
  message_id = Number(message_id);
  const num_swipe = getNumOfSwipe(message_id);
  const num_history = getHistorySize(message_id);
  if (num_swipe < num_history) {
    // It is a delete swipe action
    const swipe_id = getSwipeId(message_id);
    deleteHistory(message_id, swipe_id);
  }
  setCurrentStateToPrev(message_id);
  reprocessMessageFrom(message_id);
  if (message_id !== 0) {
    restorePostCommandResultFromNextMessage(message_id - 1);
  }
  console.log('[VariableTracker] MESSAGE_UPDATED end');
});

eventOn(tavern_events.MESSAGE_RECEIVED, async (message_id: number) => {
  console.log('[VariableTracker] MESSAGE_RECEIVED strat');
  executeCommand(message_id);
  executePostCommand(message_id);
  const swipe_id = getSwipeId(message_id);
  setHistory(getCurrentState(), message_id, swipe_id);
  console.log('[VariableTracker] MESSAGE_RECEIVED end');
});

eventOn(tavern_events.MESSAGE_SWIPED, async (message_id: number) => {
  console.log('[VariableTracker] MESSAGE_SWIPED strat');
  const swipe_id = getSwipeId(message_id);
  const prev_message_id = message_id === 0 ? null : message_id - 1;
  if (isSwipeExist(message_id, swipe_id)) {
    // Swipe back to existing swipe
    setCurrentState(getHistory(message_id, swipe_id));
    if (prev_message_id !== null) {
      restorePostCommandResultFromNextMessage(prev_message_id);
    }
  } else if (prev_message_id !== null) {
    setCurrentStateToPrev(prev_message_id);
    if (prev_message_id !== 0) {
      executeCommand(prev_message_id - 1);
      executePostCommand(prev_message_id - 1);
    }
    const prev_swipe_id = getSwipeId(prev_message_id);
    executePostCommand(prev_message_id);
    setHistory(getCurrentState(), prev_message_id, prev_swipe_id);
  } else {
    emptyCurrentState();
  }
  console.log('[VariableTracker] MESSAGE_SWIPED end');
});

eventOn(tavern_events.MESSAGE_DELETED, async (_message_id: number) => {
  console.log('[VariableTracker] MESSAGE_DELETED strat');
  const chat_messages = getChatMessages('0-{{lastMessageId}}', { include_swipes: true });
  let prefer_role, deleted_message_id;
  if (getCharData('current')?.first_mes) prefer_role = 'assistant';
  else prefer_role = 'user';
  for (const chat_message of chat_messages) {
    if (chat_message.role === prefer_role) {
      if (prefer_role === 'assistant') prefer_role = 'user';
      else prefer_role = 'assistant';
    } else {
      deleted_message_id = chat_message.message_id;
      break;
    }
  }
  if (!deleted_message_id) deleted_message_id = chat_messages.length;
  setCurrentStateToPrev(deleted_message_id);
  deleteHistoryStartFrom(deleted_message_id);
  deleteChatMessages(_.range(deleted_message_id, getLastMessageId() + 1));
  console.log('[VariableTracker] MESSAGE_DELETED end');
});

// ===== Debug Button =====

// 清除所有變數
function clearAllVariables() {
  toastr.info('開始清除所有變數...', 'VariableTracker Debug');
  const variables = getVariables(VARIABLE_SCOPE);
  variables.current = {};
  variables.history = [];
  replaceVariables(variables, VARIABLE_SCOPE);
  toastr.success('所有變數已清除！', 'VariableTracker Debug');
}

// 重新讀取所有變數
async function reloadAllVariables() {
  toastr.info('開始重新讀取所有變數...', 'VariableTracker Debug');
  try {
    deleteHistoryStartFrom(0);
    reprocessMessageFrom(0);
  } catch (error) {
    console.error('[VariableTracker] 重新讀取變數時發生錯誤:', error);
    toastr.error('重新讀取變數失敗，請檢查控制台日誌', 'VariableTracker Debug');
    return;
  }
  toastr.success('所有變數已重新讀取完成！', 'VariableTracker Debug');
}

// 註冊按鈕
eventOn(getButtonEvent('清除所有變數'), clearAllVariables);
eventOn(getButtonEvent('重新讀取所有變數'), reloadAllVariables);
