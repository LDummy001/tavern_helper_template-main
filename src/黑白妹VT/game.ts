import {
  AddMapCommand,
  Commands,
  InitDatetimeCommand,
  InitMapCommand,
  InitNumCommand,
  InitStrCommand,
} from '@/VariableTracker/command';
import { State } from '@/VariableTracker/state';
import { Action } from './action';
import { GameState } from './game_state';

export class Game {
  private game_state: GameState;

  constructor(state: State) {
    this.game_state = new GameState(state);
  }

  public getGameState() {
    return this.game_state;
  }

  public initiateState(): void {
    const commands = new Commands();
    commands.pushCommand(new InitNumCommand(GameState.STAMINA_KEY, 0, 60, 40));
    commands.pushCommand(new InitNumCommand(GameState.MONEY_KEY, 0, null, 6000));
    commands.pushCommand(new InitNumCommand(GameState.TRUST_KEY, 0, 1000, 25));
    commands.pushCommand(new InitNumCommand(GameState.INTEREST_KEY, 0, 1000, 10));
    commands.pushCommand(new InitNumCommand(GameState.MOOD_KEY, -2, 2, 0));
    commands.pushCommand(new InitDatetimeCommand(GameState.DATETIME_KEY, '2025-11-19T19:00:00'));
    commands.pushCommand(new InitStrCommand(GameState.BIG_PLACE_KEY, '住宅區'));
    commands.pushCommand(new InitStrCommand(GameState.MIDDLE_PLACE_KEY, '家中'));
    commands.pushCommand(new InitStrCommand(GameState.SMALL_PLACE_KEY, '客廳'));
    commands.pushCommand(new InitStrCommand(GameState.WEATHER_KEY, '晴朗'));
    commands.pushCommand(
      new InitStrCommand(
        GameState.CLOTHING_KEY,
        '初中生水手服，領口的鈕扣解開了，胸前鈕扣間的縫隙露出一小片屬於胸罩的白色布料',
      ),
    );
    commands.pushCommand(new InitStrCommand(GameState.CURRENT_ACTION_KEY, Action.NONE_STR));
    commands.pushCommand(new InitStrCommand(GameState.EXPECT_RESULT_KEY, Action.NONE_STR));
    commands.pushCommand(new InitMapCommand(GameState.FLAGS_KEY));
    commands.pushCommand(new InitNumCommand(GameState.FLAG_BATH_KEY, 0, 1, 0));
    commands.pushCommand(new AddMapCommand(GameState.FLAGS_KEY, GameState.FLAG_BATH_KEY));
    commands.pushCommand(new InitMapCommand(GameState.SHOP_ITEMS_KEY));
    commands.pushCommand(new InitMapCommand(GameState.INVENTORIES_KEY));
    commands.pushCommand(new InitNumCommand(GameState.TRUST_ROC_KEY, null, null, 0));
    commands.pushCommand(new InitNumCommand(GameState.INTEREST_ROC_KEY, null, null, 0));
    commands.pushCommand(new InitNumCommand(GameState.MOOD_ROC_KEY, null, null, 0));
    commands.pushCommand(new InitMapCommand(GameState.ITEM_TABLE_KEY));
    commands.pushCommand(new InitMapCommand(GameState.SUMMARY_TABLE_KEY));
    commands.execute(this.game_state);
  }

  public getForceActionStr(): string {
    const possible_action_names: Map<string, string[] | null> = new Map();
    for (const [name, action] of Action.registry.getAll()) {
      if (action.prototype.isForce(this.game_state)) {
        if (action.prototype.category) {
          const category = action.prototype.category;
          const names = possible_action_names.get(category) ?? [];
          names.push(name);
          possible_action_names.set(category, names);
        } else {
          possible_action_names.set(name, null);
        }
      }
    }
    let action_string = '';
    for (const [category, names] of possible_action_names) {
      if (names === null) {
        action_string += `[${category}]\n`;
      } else {
        action_string += `[${category}]:\n`;
        for (const name of names) {
          action_string += `  [${name}]\n`;
        }
      }
    }
    if (action_string) action_string = '<ActionBlock>\n' + action_string + '</ActionBlock>';
    return action_string;
  }

  public getPossibleActionStr(): string {
    const possible_action_names: Map<string, string[] | null> = new Map();
    for (const [name, action] of Action.registry.getAll()) {
      if (action.prototype.isPossible(this.game_state)) {
        if (action.prototype.category) {
          const category = action.prototype.category;
          const names = possible_action_names.get(category) ?? [];
          names.push(name);
          possible_action_names.set(category, names);
        } else {
          possible_action_names.set(name, null);
        }
      }
    }
    let action_string = '';
    for (const [category, names] of possible_action_names) {
      if (names === null) {
        action_string += `[${category}]\n`;
      } else {
        action_string += `[${category}]:\n`;
        for (const name of names) {
          action_string += `  [${name}]\n`;
        }
      }
    }
    if (action_string) action_string = '<ActionBlock>\n' + action_string + '</ActionBlock>';
    return action_string;
  }

  public getForceActions(): Map<string, string[] | null> {
    const force_action_names: Map<string, string[] | null> = new Map();
    for (const [name, action] of Action.registry.getAll()) {
      if (action.prototype.isForce(this.game_state)) {
        if (action.prototype.category) {
          const category = action.prototype.category;
          const names = force_action_names.get(category) ?? [];
          names.push(name);
          force_action_names.set(category, names);
        } else {
          force_action_names.set(name, null);
        }
      }
    }
    return force_action_names;
  }

  public getPossibleActions(): Map<string, string[] | null> {
    const possible_action_names: Map<string, string[] | null> = new Map();
    for (const [name, action] of Action.registry.getAll()) {
      if (action.prototype.isPossible(this.game_state)) {
        if (action.prototype.category) {
          const category = action.prototype.category;
          const names = possible_action_names.get(category) ?? [];
          names.push(name);
          possible_action_names.set(category, names);
        } else {
          possible_action_names.set(name, null);
        }
      }
    }
    return possible_action_names;
  }

  public getStatusStr(): string {
    let status_string: string = '';
    status_string += `金錢:$${this.game_state.getMoney()}\n`;
    status_string += `信賴:${this.game_state.getTrust()}\n`;
    status_string += `興致:${this.game_state.getInterest()}\n`;
    const mood_strings = ['隨時都會爆發的狀態', '不高興', '普通', '不錯', '高興'];
    status_string += `心情:${mood_strings[this.game_state.getMood() + 2]}\n`;
    const day_strings = ['日', '一', '二', '三', '四', '五', '六'];
    status_string += `星期:${day_strings[this.game_state.getDay()]}\n`;
    status_string += `月日:${this.game_state.getMonth()}月${this.game_state.getDate()}日\n`;
    status_string += `時刻:${this.game_state.getHours().toString().padStart(2, '0')}:${this.game_state.getMinutes().toString().padStart(2, '0')}\n`;
    status_string += `大地點:${this.game_state.getBigPlace()}\n`;
    status_string += `中地點:${this.game_state.getMiddlePlace()}\n`;
    status_string += `小地點:${this.game_state.getSmallPlace()}\n`;
    status_string += `天氣:${this.game_state.getWeather()}\n`;
    status_string += `妹妹衣著:${this.game_state.getClothing()}\n`;
    status_string += `當前行動:${this.game_state.getCurrentAction()}\n`;
    status_string += `預期結果:${this.game_state.getExpectResult()}\n`;
    if (status_string) status_string = '<StatusBlock>\n' + status_string + '</StatusBlock>';
    return status_string;
  }

  public getItemTableStr(): string {
    let item_table_string: string = '<ItemTable>\n';
    const item_table = this.game_state.getItemTable();
    for (const [name, description] of item_table) {
      item_table_string += `${name}: ${description}\n`;
    }
    item_table_string += '<ItemTable>';
    return item_table_string;
  }

  public getSummaryTableStr(): string {
    let summary_table_string: string = '<SummaryTable>\n';
    summary_table_string += '  #以下為歷史記錄格式，在敍事有需要時必須嚴格遵守此記錄，以免作出矛盾或重複的描寫。\n';
    summary_table_string += '  #| 時間 | 地點 | 事件總結 | 權重(0.0~1.0)，用以標示該事件的重要程度 |\n';
    const summaries = this.game_state.getSummaries();
    for (const summary_record of summaries) {
      if (summary_record === null) continue;
      const year = summary_record!.datetime.getFullYear();
      const month = summary_record!.datetime.getMonth();
      const date = summary_record!.datetime.getDate();
      const hour = summary_record!.datetime.getHours();
      const minutes = summary_record!.datetime.getMinutes();
      const day = summary_record!.datetime.getDay();
      const day_strings = ['日', '一', '二', '三', '四', '五', '六'];
      const day_string = day_strings[day];
      const hour_string = hour.toString().padStart(2, '0');
      const minutes_string = minutes.toString().padStart(2, '0');
      const datetime_string = `${year}年${month}月${date}日 (${day_string}) ${hour_string}:${minutes_string}`;
      const location_string = `${summary_record.big_place}-${summary_record.middle_place}-${summary_record.small_place}`;
      summary_table_string += `| ${datetime_string} | ${location_string} | ${summary_record.summary} | ${summary_record.weighting} |\n`;
    }
    summary_table_string += '<SummaryTable>';
    return summary_table_string;
  }
}
