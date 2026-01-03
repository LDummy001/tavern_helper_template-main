import { getCurrentState } from '@/VariableTracker/event_listener';
import { Game } from './game';

function getGame(): Game {
  return new Game(getCurrentState());
}

function addSuffix(message_id: number, suffix_string: string) {
  if (!suffix_string) return;
  let message = getChatMessages(message_id)[0].message;
  message += `\n${suffix_string}`;
  setChatMessages([{ message_id: message_id, message: message }]);
}

function injectBlocks(): void {
  uninjectPrompts(['variable_injection']);
  const game = getGame();
  let prompt = '';
  prompt += `${game.getStatusStr()}\n`;
  prompt += `${game.getItemTableStr()}`;
  injectPrompts(
    [
      {
        id: 'variable_injection',
        position: 'in_chat',
        depth: 0,
        role: 'system',
        content: prompt,
        should_scan: true,
      },
    ],
    { once: false },
  );
  injectPrompts(
    [
      {
        id: 'summary_injection',
        position: 'in_chat',
        depth: 9999,
        role: 'system',
        content: game.getSummaryTableStr(),
        should_scan: true,
      },
    ],
    { once: false },
  );
}

eventMakeFirst(tavern_events.CHAT_CREATED, () => {
  console.log('[黑白妹VT] CHAT_CREATED start');
  //const game = getGame();
  //game.initiateState();
  //setCurrentState(game.getGameState());
  console.log('[黑白妹VT] CHAT_CREATED end');
});

eventMakeLast(tavern_events.GENERATE_AFTER_COMBINE_PROMPTS, () => {
  console.log('[黑白妹VT] GENERATE_AFTER_COMBINE_PROMPTS start');
  injectBlocks();
  console.log('[黑白妹VT] GENERATE_AFTER_COMBINE_PROMPTS end');
});
