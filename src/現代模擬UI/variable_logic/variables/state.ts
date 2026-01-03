import { Character } from './character';
import { Datetime } from './datetime';
import { Item } from './item';

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
  public active_characters: Map<string, Character>;
  public static readonly ACTIVE_CHARACTERS_KEY: string = '當前角色';
  public deactive_characters: Map<string, Character>;
  public static readonly DEACTIVE_CHARACTERS_KEY: string = '背景角色';
  public items: Map<string, Item>;
  public static readonly ITEMS_KEY: string = '物品';

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
    return new State(
      new Datetime(variable[State.DATETIME_KEY]),
      variable[State.BIG_LOCATION_KEY],
      variable[State.MIDDLE_LOCATION_KEY],
      variable[State.SMALL_LOCATION_KEY],
      variable[State.WEATHER_KEY],
      variable[State.CURRENT_EVENT_KEY],
      active_characters,
      deactive_characters,
      items,
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
    const variable = {
      [State.DATETIME_KEY]: this.datetime.toDate(),
      [State.BIG_LOCATION_KEY]: this.big_location,
      [State.MIDDLE_LOCATION_KEY]: this.middle_location,
      [State.SMALL_LOCATION_KEY]: this.small_location,
      [State.WEATHER_KEY]: this.weather,
      [State.CURRENT_EVENT_KEY]: this.current_event,
      [State.ACTIVE_CHARACTERS_KEY]: active_characters,
      [State.DEACTIVE_CHARACTERS_KEY]: deactive_characters,
      [State.ITEMS_KEY]: items,
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
    prompt += `${this.getItemPrompt()}`;
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
