import { Commands } from './command';
import { State } from './variables/state';

eventOn('MESSAGE_SENT', (message_id: number) => {
  console.log('[event_listener] MESSAGE_SENT start');
  const state = State.loadFromVariable(message_id - 1);
  const message = getChatMessages(message_id)[0].message;
  const commands = Commands.fromString(message);
  commands.execute(state, message_id);
  state.saveAsVariable(message_id);
  console.log('[event_listener] MESSAGE_SENT end');
});

eventOn('MESSAGE_RECEIVED', (message_id: number) => {
  console.log('[event_listener] MESSAGE_RECEIVED start');
  const state = State.loadFromVariable(message_id - 1);
  const message = getChatMessages(message_id)[0].message;
  const commands = Commands.fromString(message);
  commands.execute(state, message_id);
  state.saveAsVariable(message_id);
  console.log('[event_listener] MESSAGE_RECEIVED end');
});
