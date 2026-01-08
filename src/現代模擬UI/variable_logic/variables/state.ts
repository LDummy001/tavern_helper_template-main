import { Character } from './character';
import { Datetime } from './datetime';
import { Item } from './item';
import { Promise } from './promise';
import { Summary } from './summary';

export class State {
  public datetime: Datetime;
  public static readonly DATETIME_KEY: string = '當前時間';
  public big_location: string;
  public static readonly BIG_LOCATION_KEY: string = '大地點';
  public middle_location: string;
  public static readonly MIDDLE_LOCATION_KEY: string = '中地點';
  public small_location: string;
  public static readonly SMALL_LOCATION_KEY: string = '小地點';
  public weather: string;
  public static readonly WEATHER_KEY: string = '天氣';
  public current_event: string;
  public static readonly CURRENT_EVENT_KEY: string = '當前事件';
  public static readonly CURRENT_EVENT_NULL_VALUE: string = '無';
  public active_characters: Map<string, Character>;
  public static readonly ACTIVE_CHARACTERS_KEY: string = '當前角色';
  public deactive_characters: Map<string, Character>;
  public static readonly DEACTIVE_CHARACTERS_KEY: string = '背景角色';
  public items: Map<string, Item>;
  public static readonly ITEMS_KEY: string = '物品';
  public promises: Map<string, Promise>;
  public static readonly PROMISES_KEY: string = '約定';
  public summaries: Summary[];
  public static readonly SUMMARIES_KEY: string = '總結';

  public constructor(
    datetime: Datetime,
    big_location: string,
    middle_location: string,
    small_location: string,
    weather: string,
    current_event: string,
    active_characters: Map<string, Character>,
    deactive_characters: Map<string, Character>,
    items: Map<string, Item>,
    promises: Map<string, Promise>,
    summaries: Summary[],
  ) {
    this.datetime = datetime;
    this.big_location = big_location;
    this.middle_location = middle_location;
    this.small_location = small_location;
    this.weather = weather;
    this.current_event = current_event;
    this.active_characters = active_characters;
    this.deactive_characters = deactive_characters;
    this.items = items;
    this.promises = promises;
    this.summaries = summaries;
  }

  public static loadFromVariable(message_id: number): State {
    let variable;
    if (message_id < 0) {
      // If message_id < 0, load from chat variable
      variable = getVariables({ type: 'chat' })['state'];
    } else {
      // Else load from respective message variable
      variable = getVariables({ type: 'message', message_id: message_id });
    }
    const active_characters = new Map<string, Character>();
    const active_character_variables: [string, any][] = variable[State.ACTIVE_CHARACTERS_KEY];
    for (const [character_id, active_character_record] of Object.entries(active_character_variables)) {
      active_characters.set(character_id, Character.fromRecord(active_character_record));
    }
    const deactive_characters = new Map<string, Character>();
    const deactive_character_variables: [string, any][] = variable[State.DEACTIVE_CHARACTERS_KEY];
    for (const [character_id, deactive_character_record] of Object.entries(deactive_character_variables)) {
      deactive_characters.set(character_id, Character.fromRecord(deactive_character_record));
    }
    const items = new Map<string, Item>();
    const item_variables: [string, any][] = variable[State.ITEMS_KEY];
    for (const [item_id, item_record] of Object.entries(item_variables)) {
      items.set(item_id, Item.fromRecord(item_record));
    }
    const promises = new Map<string, Promise>();
    const promise_variables: Record<string, any> = variable[State.PROMISES_KEY];
    for (const [promise_id, promise_record] of Object.entries(promise_variables)) {
      promises.set(promise_id, Promise.fromRecord(promise_record));
    }
    const summaries = new Array<Summary>();
    const summary_variables: [string, any][] = variable[State.SUMMARIES_KEY];
    for (const summary_record of summary_variables) {
      summaries.push(Summary.fromRecord(summary_record));
    }
    return new State(
      Datetime.fromString(variable[State.DATETIME_KEY]),
      variable[State.BIG_LOCATION_KEY],
      variable[State.MIDDLE_LOCATION_KEY],
      variable[State.SMALL_LOCATION_KEY],
      variable[State.WEATHER_KEY],
      variable[State.CURRENT_EVENT_KEY],
      active_characters,
      deactive_characters,
      items,
      promises,
      summaries,
    );
  }

  public saveAsVariable(message_id: number): void {
    const active_characters: Record<string, any> = {};
    for (const [character_id, active_character] of this.active_characters) {
      active_characters[character_id] = active_character.toRecord();
    }
    const deactive_characters: Record<string, any> = {};
    for (const [character_id, deactive_character] of this.deactive_characters) {
      deactive_characters[character_id] = deactive_character.toRecord();
    }
    const items: Record<string, any> = {};
    for (const [item_id, item] of this.items) {
      items[item_id] = item.toRecord();
    }
    const promises: Record<string, any> = {};
    for (const [promise_id, promise] of this.promises) {
      promises[promise_id] = promise.toRecord();
    }
    const summaries: Record<string, any>[] = [];
    // 按 last_message_id 升序排列（最小的在前）
    const sorted_summaries = [...this.summaries].sort((a, b) => a.last_message_id - b.last_message_id);
    for (const summary of sorted_summaries) {
      summaries.push(summary.toRecord());
    }
    const variable = {
      [State.DATETIME_KEY]: this.datetime.toString(),
      [State.BIG_LOCATION_KEY]: this.big_location,
      [State.MIDDLE_LOCATION_KEY]: this.middle_location,
      [State.SMALL_LOCATION_KEY]: this.small_location,
      [State.WEATHER_KEY]: this.weather,
      [State.CURRENT_EVENT_KEY]: this.current_event,
      [State.ACTIVE_CHARACTERS_KEY]: active_characters,
      [State.DEACTIVE_CHARACTERS_KEY]: deactive_characters,
      [State.ITEMS_KEY]: items,
      [State.PROMISES_KEY]: promises,
      [State.SUMMARIES_KEY]: summaries,
    };
    if (message_id < 0) {
      // If message_id < 0, store the state to chat variable
      const chat_variable = getVariables({ type: 'chat' });
      chat_variable['state'] = variable;
      replaceVariables(chat_variable, { type: 'chat' });
    } else {
      // Else store to respective message variable
      replaceVariables(variable, { type: 'message', message_id: message_id });
    }
  }

  public getCharacter(character_id: string): Character | undefined {
    return this.active_characters.get(character_id) || this.deactive_characters.get(character_id);
  }

  public hasCharacter(character_id: string): boolean {
    return this.active_characters.has(character_id) || this.deactive_characters.has(character_id);
  }

  public addPromise(deadline: Datetime, character_ids: string[], location: string, description: string) {
    const existing_ids = Array.from(this.promises.keys());
    const numbers = existing_ids.map(id => parseInt(id.substring(1))).filter(n => !isNaN(n));
    const max_number = Math.max(...numbers, 0);
    const promise_id = `p${max_number + 1}`;
    const promise = new Promise(deadline, character_ids, location, description);
    this.promises.set(promise_id, promise);
  }

  public addSummary(summary: string, weighting: number, message_id: number) {
    const datetime = this.datetime.clone();
    this.summaries.push(new Summary(datetime, summary, weighting, message_id));
  }

  // 獲取最新的 summary 的 last_message_id，如果沒有 summary 則返回 -1
  public getLatestSummaryLastMessageId(): number {
    const variable = getVariables({ type: 'chat' });
    const exclude_latest_summaries = variable.settings?.exclude_latest_summaries || 0;
    // summaries 已經按時間升序排列，最新的在最後，排除最後的 exclude_latest_summaries 個
    const effective_summaries = this.summaries.slice(0, this.summaries.length - exclude_latest_summaries);
    if (effective_summaries.length === 0) return -1;
    return effective_summaries[effective_summaries.length - 1].last_message_id;
  }

  private getGeneralStatusPrompt(): string {
    const year = this.datetime.year;
    const month = this.datetime.month;
    const date = this.datetime.date;
    const hours = this.datetime.hours;
    const minutes = this.datetime.minutes;
    const datetime_string = `${year}年${month}月${date}日 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    let general_status_prompt = '<GeneralStatus>\n';
    general_status_prompt += `  ${State.DATETIME_KEY}:${datetime_string}\n`;
    general_status_prompt += `  ${State.BIG_LOCATION_KEY}:${this.big_location}\n`;
    general_status_prompt += `  ${State.MIDDLE_LOCATION_KEY}:${this.middle_location}\n`;
    general_status_prompt += `  ${State.SMALL_LOCATION_KEY}:${this.small_location}\n`;
    general_status_prompt += `  ${State.WEATHER_KEY}:${this.weather}\n`;
    general_status_prompt += `  ${State.CURRENT_EVENT_KEY}:${this.current_event}\n`;
    general_status_prompt += '</GeneralStatus>\n';
    return general_status_prompt;
  }

  private getUserPrompt(): string {
    const user = this.active_characters.get('c1')!;
    let user_prompt = `<${user.name}Status>\n`;
    user_prompt += `id: c1\n`;
    user_prompt += `  ${Character.NAME_KEY}:${user.name}\n`;
    user_prompt += `  ${Character.AGE_KEY}:${user.age}\n`;
    user_prompt += `  ${Character.GENDER_KEY}:${user.gender}\n`;
    user_prompt += `  ${Character.IDENTITY_KEY}:${user.identity}\n`;
    user_prompt += `  ${Character.INTRODUCTION_KEY}:${user.introduction}\n`;
    user_prompt += `  ${Character.PERSONALITY_KEY}:${user.personality}\n`;
    user_prompt += `  ${Character.HEIGHT_KEY}:${user.height}\n`;
    user_prompt += `  ${Character.WEIGHT_KEY}:${user.weight}\n`;
    user_prompt += `  ${Character.CHEST_SIZE_KEY}:${user.chest_size}\n`;
    if (user.cup_size) user_prompt += `  ${Character.CUP_SIZE_KEY}:${user.cup_size}\n`;
    user_prompt += `  ${Character.WAIST_SIZE_KEY}:${user.waist_size}\n`;
    user_prompt += `  ${Character.HIPS_SIZE_KEY}:${user.hips_size}\n`;
    user_prompt += `  ${Character.HAIRSTYLE_KEY}:${user.hairstyle}\n`;
    user_prompt += `  ${Character.CLOTHES_KEY}:${user.clothes}\n`;
    user_prompt += `  ${Character.BIRTHDAY_KEY}:${user.birthday.month}月${user.birthday.date}日\n`;
    user_prompt += `  ${Character.FAVOURITE_KEY}:${user.favourite}\n`;
    user_prompt += `  ${Character.EXTRA_INFORMATION_KEY}:${user.extra_information}\n`;
    user_prompt += `  ${Character.MONEY_KEY}:${user.money}\n`;
    user_prompt += `  ${Character.RELATIONS_KEY}:\n`;
    for (const [character_id, relation] of user.relations) {
      user_prompt += `    ${character_id}:${relation}\n`;
    }
    user_prompt += `  ${Character.INVENTORY_KEY}:\n`;
    for (const [item_id, quantity] of user.inventory) {
      user_prompt += `    ${item_id}:${quantity}\n`;
    }
    user_prompt += `</${user.name}Status>\n`;
    return user_prompt;
  }

  private getActiveCharacterPrompt(): string {
    let active_character_prompt = `<ActiveCharacterStatus>\n`;
    for (const [character_id, character] of this.active_characters) {
      if (character_id === 'c1') continue;
      active_character_prompt += `id: ${character_id}\n`;
      active_character_prompt += `  ${Character.NAME_KEY}:${character.name}\n`;
      active_character_prompt += `  ${Character.AGE_KEY}:${character.age}\n`;
      active_character_prompt += `  ${Character.GENDER_KEY}:${character.gender}\n`;
      active_character_prompt += `  ${Character.IDENTITY_KEY}:${character.identity}\n`;
      active_character_prompt += `  ${Character.INTRODUCTION_KEY}:${character.introduction}\n`;
      active_character_prompt += `  ${Character.PERSONALITY_KEY}:${character.personality}\n`;
      active_character_prompt += `  ${Character.HEIGHT_KEY}:${character.height}\n`;
      active_character_prompt += `  ${Character.WEIGHT_KEY}:${character.weight}\n`;
      active_character_prompt += `  ${Character.CHEST_SIZE_KEY}:${character.chest_size}\n`;
      if (character.cup_size) active_character_prompt += `  ${Character.CUP_SIZE_KEY}:${character.cup_size}\n`;
      active_character_prompt += `  ${Character.WAIST_SIZE_KEY}:${character.waist_size}\n`;
      active_character_prompt += `  ${Character.HIPS_SIZE_KEY}:${character.hips_size}\n`;
      active_character_prompt += `  ${Character.HAIRSTYLE_KEY}:${character.hairstyle}\n`;
      active_character_prompt += `  ${Character.CLOTHES_KEY}:${character.clothes}\n`;
      active_character_prompt += `  ${Character.BIRTHDAY_KEY}:${character.birthday.month}月${character.birthday.date}日\n`;
      active_character_prompt += `  ${Character.FAVOURITE_KEY}:${character.favourite}\n`;
      active_character_prompt += `  ${Character.EXTRA_INFORMATION_KEY}:${character.extra_information}\n`;
      active_character_prompt += `  ${Character.MONEY_KEY}:${character.money}\n`;
      active_character_prompt += `  ${Character.MOOD_KEY}:${character.mood}\n`;
      active_character_prompt += `  ${Character.HORNY_KEY}:${character.horny}\n`;
      active_character_prompt += `  ${Character.RELATIONS_KEY}:\n`;
      for (const [character_id, relation] of character.relations) {
        active_character_prompt += `    ${character_id}:${relation}\n`;
      }
      active_character_prompt += `  ${Character.FRIENDSHIPS_KEY}:\n`;
      for (const [character_id, friendship] of character.friendships) {
        active_character_prompt += `    ${character_id}:${friendship}\n`;
      }
      active_character_prompt += `  ${Character.LOVES_KEY}:\n`;
      for (const [character_id, love] of character.loves) {
        active_character_prompt += `    ${character_id}:${love}\n`;
      }
      active_character_prompt += `  ${Character.INVENTORY_KEY}:\n`;
      for (const [item_id, quantity] of character.inventory) {
        active_character_prompt += `    ${item_id}:${quantity}\n`;
      }
      active_character_prompt += '\n';
    }
    active_character_prompt += `</ActiveCharacterStatus>\n`;
    return active_character_prompt;
  }

  private getDeactiveCharacterPrompt(): string {
    let deactive_character_prompt = `<DeactiveCharacterStatus>\n`;
    for (const [character_id, character] of this.deactive_characters) {
      deactive_character_prompt += `id: ${character_id}\n`;
      deactive_character_prompt += `  ${Character.NAME_KEY}:${character.name}\n`;
      deactive_character_prompt += `  ${Character.AGE_KEY}:${character.age}\n`;
      deactive_character_prompt += `  ${Character.GENDER_KEY}:${character.gender}\n`;
      deactive_character_prompt += `  ${Character.IDENTITY_KEY}:${character.identity}\n`;
      deactive_character_prompt += `  ${Character.INTRODUCTION_KEY}:${character.introduction}\n`;
      deactive_character_prompt += `  ${Character.PERSONALITY_KEY}:${character.personality}\n`;
      deactive_character_prompt += `  ${Character.FAVOURITE_KEY}:${character.favourite}\n`;
      deactive_character_prompt += `  ${Character.EXTRA_INFORMATION_KEY}:${character.extra_information}\n`;
      deactive_character_prompt += `  ${Character.RELATIONS_KEY}:\n`;
      for (const [character_id, relation] of character.relations) {
        deactive_character_prompt += `    ${character_id}:${relation}\n`;
      }
      deactive_character_prompt += `  ${Character.FRIENDSHIPS_KEY}:\n`;
      for (const [character_id, friendship] of character.friendships) {
        deactive_character_prompt += `    ${character_id}:${friendship}\n`;
      }
      deactive_character_prompt += `  ${Character.LOVES_KEY}:\n`;
      for (const [character_id, love] of character.loves) {
        deactive_character_prompt += `    ${character_id}:${love}\n`;
      }
      deactive_character_prompt += '\n';
    }
    deactive_character_prompt += `</DeactiveCharacterStatus>\n`;
    return deactive_character_prompt;
  }

  private getItemPrompt(): string {
    let item_prompt = `<ItemTable>\n`;
    item_prompt += `|id|${Item.NAME_KEY}|${Item.DESCRIPTION_KEY}|${Item.VALUE_KEY}|\n`;
    item_prompt += '|---|---|---|---|\n';
    for (const [item_id, item] of this.items) {
      item_prompt += `|${item_id}|${item.name}|${item.description}|${item.value}|\n`;
    }
    item_prompt += `</ItemTable>\n`;
    return item_prompt;
  }

  private getPromisePrompt(): string {
    let promise_prompt = `<PromiseTable>\n`;
    promise_prompt += `|id|${Promise.DEADLINE_KEY}|${Promise.CHARACTER_IDS_KEY}|${Promise.LOCATION_KEY}|${Promise.DESCRIPTION_KEY}|\n`;
    promise_prompt += '|---|---|---|---|---|\n';
    for (const [promise_id, promise] of this.promises) {
      const deadline_str = `${promise.deadline.year}年${promise.deadline.month}月${promise.deadline.date}日 ${promise.deadline.hours.toString().padStart(2, '0')}:${promise.deadline.minutes.toString().padStart(2, '0')}`;
      promise_prompt += `|${promise_id}|${deadline_str}|${promise.character_ids.join(',')}|${promise.location}|${promise.description}|\n`;
    }
    promise_prompt += `</PromiseTable>\n`;
    return promise_prompt;
  }

  private getSummaryPrompt(): string {
    const variable = getVariables({ type: 'chat' });
    const exclude_latest_summaries = variable.settings?.exclude_latest_summaries || 0;
    // summaries 已經保證最舊的在前面，最新的在最後，直接排除最後的 exclude_latest_summaries 個
    const filtered_summaries = this.summaries.slice(0, this.summaries.length - exclude_latest_summaries);
    let summary_prompt = `<HistorySummary>\n`;
    summary_prompt += `|${Summary.DATETIME_KEY}|${Summary.SUMMARY_KEY}|${Summary.WEIGHTING_KEY}|\n`;
    summary_prompt += '|---|---|---|\n';
    for (const summary of filtered_summaries) {
      const datetime_str = `${summary.datetime.year}年${summary.datetime.month}月${summary.datetime.date}日 ${summary.datetime.hours.toString().padStart(2, '0')}:${summary.datetime.minutes.toString().padStart(2, '0')}`;
      summary_prompt += `|${datetime_str}|${summary.summary}|${summary.weighting.toFixed(1)}|\n`;
    }
    summary_prompt += `</HistorySummary>\n`;
    return summary_prompt;
  }

  private getStartingBackground(): string {
    const variable = getVariables({ type: 'chat' });
    let prompt = '<StartingBackground>\n';
    prompt += `${variable.start_settings.information}\n`;
    prompt += '</StartingBackground>\n';
    return prompt;
  }

  public injectPrompt(is_first_generation: boolean): void {
    let prompt = `${this.getGeneralStatusPrompt()}\n`;
    prompt += `${this.getUserPrompt()}\n`;
    prompt += `${this.getActiveCharacterPrompt()}\n`;
    prompt += `${this.getDeactiveCharacterPrompt()}\n`;
    prompt += `${this.getItemPrompt()}\n`;
    prompt += `${this.getPromisePrompt()}\n`;
    prompt += `${this.getSummaryPrompt()}`;
    if (is_first_generation) prompt += `\n${this.getStartingBackground()}`;
    injectPrompts([
      {
        id: 'prompt',
        position: 'in_chat',
        depth: 9999,
        role: 'system',
        content: prompt,
        should_scan: true,
      },
    ]);
  }
}
