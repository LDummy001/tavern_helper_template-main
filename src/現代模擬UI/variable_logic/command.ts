import { ClassRegistry } from '@/util/class_registry';
import { Character } from './variables/character';
import { Datetime } from './variables/datetime';
import { Item } from './variables/item';
import { Location } from './variables/location';
import { State } from './variables/state';

export abstract class Command {
  protected abstract get REGEX(): RegExp;
  protected abstract create(args: string[]): Command;
  protected abstract isValid(): boolean;
  public abstract execute(state: State, message_id: number): State;

  public static readonly registry = new ClassRegistry<typeof Command>();

  public constructor(..._args: any[]) {}

  public static parseString(s: string | undefined) {
    if (s === undefined) return [];
    const matches = [...s.matchAll(this.prototype.REGEX)];
    return matches
      .map(match => ({
        command: this.prototype.create(match.slice(1).map(arg => arg.trim())),
        index: match.index!,
      }))
      .filter(({ command }) => command.isValid());
  }
}

@Command.registry.register()
export class DeltaMinutesCommand extends Command {
  private delta_minutes: number;
  constructor(delta_minutes: number) {
    super();
    this.delta_minutes = delta_minutes;
  }
  protected get REGEX(): RegExp {
    return /deltaMinutes\(\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const delta_minutes = Number(args[0]);
    return new DeltaMinutesCommand(delta_minutes);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta_minutes)) return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    state.datetime.deltaMinutes(this.delta_minutes);
    return state;
  }
}

@Command.registry.register()
export class SetCurrentLocationCommand extends Command {
  private current_location_id: string;
  constructor(current_location_id: string) {
    super();
    this.current_location_id = current_location_id;
  }
  protected get REGEX(): RegExp {
    return /setCurrentLocation\(\s*"([^"]+?)"\s*\s*\)/g;
  }
  protected create(args: string[]): Command {
    const current_location_id = args[0];
    return new SetCurrentLocationCommand(current_location_id);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State, _message_id: number): State {
    if (!state.locations.has(this.current_location_id)) return state;
    state.current_location_id = this.current_location_id;
    return state;
  }
}

@Command.registry.register()
export class SetWeatherCommand extends Command {
  private weather: string;
  constructor(weather: string) {
    super();
    this.weather = weather;
  }
  protected get REGEX(): RegExp {
    return /setWeather\(\s*"([^"]+?)"\s*\s*\)/g;
  }
  protected create(args: string[]): Command {
    const weather = args[0];
    return new SetWeatherCommand(weather);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State, _message_id: number): State {
    state.weather = this.weather;
    return state;
  }
}

@Command.registry.register()
export class CreateCharacterCommand extends Command {
  private id: string;
  private name: string;
  private age: number;
  private gender: string;
  private identity: string;
  private introduction: string;
  private personality: string;
  private height: number;
  private weight: number;
  private chest_size: number;
  private cup_size: string;
  private waist_size: number;
  private hips_size: number;
  private hairstyle: string;
  private appearance: string;
  private clothes: string;
  private birthday_month: number;
  private birthday_date: number;
  private favourite: string;
  private extra_information: string;
  private money: number;
  private mood: number;
  private horny: number;
  constructor(
    id: string,
    name: string,
    age: number,
    gender: string,
    identity: string,
    introduction: string,
    personality: string,
    height: number,
    weight: number,
    chest_size: number,
    cup_size: string,
    waist_size: number,
    hips_size: number,
    hairstyle: string,
    appearance: string,
    clothes: string,
    birthday_month: number,
    birthday_date: number,
    favourite: string,
    extra_information: string,
    money: number,
    mood: number,
    horny: number,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.identity = identity;
    this.introduction = introduction;
    this.personality = personality;
    this.height = height;
    this.weight = weight;
    this.chest_size = chest_size;
    this.cup_size = cup_size;
    this.waist_size = waist_size;
    this.hips_size = hips_size;
    this.hairstyle = hairstyle;
    this.appearance = appearance;
    this.clothes = clothes;
    this.birthday_month = birthday_month;
    this.birthday_date = birthday_date;
    this.favourite = favourite;
    this.extra_information = extra_information;
    this.money = money;
    this.mood = mood;
    this.horny = horny;
  }
  protected get REGEX(): RegExp {
    return /createCharacter\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^"]+?)\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*,\s*"([^"]+?)"\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*,\s*"([^"]+?)"\s*,\s*"([^"]*?)"\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    const name = args[1];
    const age = Number(args[2]);
    const gender = args[3];
    const identity = args[4];
    const introduction = args[5];
    const personality = args[6];
    const height = Number(args[7]);
    const weight = Number(args[8]);
    const chest_size = Number(args[9]);
    const cup_size = args[10];
    const waist_size = Number(args[11]);
    const hips_size = Number(args[12]);
    const hairstyle = args[13];
    const appearance = args[14];
    const clothes = args[15];
    const birthday_month = Number(args[16]);
    const birthday_date = Number(args[17]);
    const favourite = args[18];
    const extra_information = args[19];
    const money = Number(args[20]);
    const mood = Number(args[21]);
    const horny = Number(args[22]);
    return new CreateCharacterCommand(
      id,
      name,
      age,
      gender,
      identity,
      introduction,
      personality,
      height,
      weight,
      chest_size,
      cup_size,
      waist_size,
      hips_size,
      hairstyle,
      appearance,
      clothes,
      birthday_month,
      birthday_date,
      favourite,
      extra_information,
      money,
      mood,
      horny,
    );
  }
  protected isValid(): boolean {
    if (isNaN(this.age)) return false;
    if (isNaN(this.height)) return false;
    if (isNaN(this.weight)) return false;
    if (isNaN(this.chest_size)) return false;
    if (isNaN(this.waist_size)) return false;
    if (isNaN(this.hips_size)) return false;
    if (isNaN(this.birthday_month)) return false;
    if (isNaN(this.birthday_date)) return false;
    if (isNaN(this.money)) return false;
    if (isNaN(this.mood)) return false;
    if (isNaN(this.horny)) return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    if (state.hasCharacter(this.id)) return state;
    let birthday_year = state.datetime.year - this.age;
    if (
      state.datetime.month < this.birthday_month ||
      (state.datetime.month === this.birthday_month && state.datetime.date < this.birthday_date)
    ) {
      birthday_year -= 1;
    }
    const birthday = new Datetime(new Date(birthday_year, this.birthday_month, this.birthday_date));
    const character = new Character(
      this.name,
      this.age,
      this.gender,
      this.identity,
      this.introduction,
      this.personality,
      this.height,
      this.weight,
      this.chest_size,
      this.cup_size,
      this.waist_size,
      this.hips_size,
      this.hairstyle,
      this.appearance,
      this.clothes,
      birthday,
      this.favourite,
      this.extra_information,
      this.money,
      this.mood,
      this.horny,
      new Map(),
      new Map(),
      new Map(),
      new Map(),
    );
    state.active_characters.set(this.id, character);
    return state;
  }
}

@Command.registry.register()
export class DeltaMoneyCommand extends Command {
  private id: string;
  private delta: number;
  constructor(id: string, delta: number) {
    super();
    this.id = id;
    this.delta = delta;
  }
  protected get REGEX(): RegExp {
    return /deltaMoney\(\s*"([^"]+?)"\s*,\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    const delta = Number(args[1]);
    return new DeltaMoneyCommand(id, delta);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta)) return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    const character = state.getCharacter(this.id);
    const storage = state.storages.get(this.id);
    if (!character && !storage) return state;
    if (character) {
      character.money += this.delta;
    } else {
      storage!.money += this.delta;
    }
    return state;
  }
}

@Command.registry.register()
export class DeltaFriendshipCommand extends Command {
  private from_id: string;
  private to_id: string;
  private delta: number;
  constructor(from_id: string, to_id: string, delta: number) {
    super();
    this.from_id = from_id;
    this.to_id = to_id;
    this.delta = delta;
  }
  protected get REGEX(): RegExp {
    return /deltaFriendship\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const from_id = args[0];
    const to_id = args[1];
    const delta = Number(args[2]);
    return new DeltaFriendshipCommand(from_id, to_id, delta);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta)) return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    if (!state.hasCharacter(this.from_id)) return state;
    if (!state.hasCharacter(this.to_id)) return state;
    const character = state.getCharacter(this.from_id);
    if (!character) return state;
    character.deltaFriendship(this.to_id, this.delta);
    return state;
  }
}

@Command.registry.register()
export class DeltaLoveCommand extends Command {
  private from_id: string;
  private to_id: string;
  private delta: number;
  constructor(from_id: string, to_id: string, delta: number) {
    super();
    this.from_id = from_id;
    this.to_id = to_id;
    this.delta = delta;
  }
  protected get REGEX(): RegExp {
    return /deltaLove\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const from_id = args[0];
    const to_id = args[1];
    const delta = Number(args[2]);
    return new DeltaLoveCommand(from_id, to_id, delta);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta)) return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    if (!state.hasCharacter(this.from_id)) return state;
    if (!state.hasCharacter(this.to_id)) return state;
    const character = state.getCharacter(this.from_id);
    if (!character) return state;
    character.deltaLove(this.to_id, this.delta);
    return state;
  }
}

@Command.registry.register()
export class DeltaMoodCommand extends Command {
  private id: string;
  private delta: number;
  constructor(id: string, delta: number) {
    super();
    this.id = id;
    this.delta = delta;
  }
  protected get REGEX(): RegExp {
    return /deltaMood\(\s*"([^"]+?)"\s*,\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    const delta = Number(args[1]);
    return new DeltaMoodCommand(id, delta);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta)) return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    const character = state.getCharacter(this.id);
    if (!character) return state;
    character.deltaMood(this.delta);
    return state;
  }
}

@Command.registry.register()
export class DeltaHornyCommand extends Command {
  private id: string;
  private delta: number;
  constructor(id: string, delta: number) {
    super();
    this.id = id;
    this.delta = delta;
  }
  protected get REGEX(): RegExp {
    return /deltaHorny\(\s*"([^"]+?)"\s*,\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    const delta = Number(args[1]);
    return new DeltaHornyCommand(id, delta);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta)) return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    const character = state.getCharacter(this.id);
    if (!character) return state;
    character.deltaHorny(this.delta);
    return state;
  }
}

@Command.registry.register()
export class SetRelationCommand extends Command {
  private from_id: string;
  private to_id: string;
  private relation: string;
  constructor(from_id: string, to_id: string, relation: string) {
    super();
    this.from_id = from_id;
    this.to_id = to_id;
    this.relation = relation;
  }
  protected get REGEX(): RegExp {
    return /setRelation\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const from_id = args[0];
    const to_id = args[1];
    const relation = args[2];
    return new SetRelationCommand(from_id, to_id, relation);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State, _message_id: number): State {
    if (!state.hasCharacter(this.from_id)) return state;
    if (!state.hasCharacter(this.to_id)) return state;
    const character = state.getCharacter(this.from_id);
    if (!character) return state;
    character.relations.set(this.to_id, this.relation);
    return state;
  }
}

@Command.registry.register()
export class SetCharacterPropertyCommand extends Command {
  private id: string;
  private key: string;
  private value: string;
  constructor(id: string, key: string, value: string) {
    super();
    this.id = id;
    this.key = key;
    this.value = value;
  }
  protected get REGEX(): RegExp {
    return /setCharacterProperty\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    const key = args[1];
    const value = args[2];
    return new SetCharacterPropertyCommand(id, key, value);
  }
  protected isValid(): boolean {
    const allowed_keys = [
      Character.IDENTITY_KEY,
      Character.INTRODUCTION_KEY,
      Character.PERSONALITY_KEY,
      Character.HAIRSTYLE_KEY,
      Character.APPEARANCE_KEY,
      Character.CLOTHES_KEY,
      Character.FAVOURITE_KEY,
      Character.EXTRA_INFORMATION_KEY,
    ];
    return allowed_keys.includes(this.key);
  }
  public execute(state: State, _message_id: number): State {
    const character = state.getCharacter(this.id);
    if (!character) return state;
    switch (this.key) {
      case Character.IDENTITY_KEY:
        character.identity = this.value;
        break;
      case Character.INTRODUCTION_KEY:
        character.introduction = this.value;
        break;
      case Character.PERSONALITY_KEY:
        character.personality = this.value;
        break;
      case Character.HAIRSTYLE_KEY:
        character.hairstyle = this.value;
        break;
      case Character.APPEARANCE_KEY:
        character.appearance = this.value;
        break;
      case Character.CLOTHES_KEY:
        character.clothes = this.value;
        break;
      case Character.FAVOURITE_KEY:
        character.favourite = this.value;
        break;
      case Character.EXTRA_INFORMATION_KEY:
        character.extra_information = this.value;
        break;
    }
    return state;
  }
}

@Command.registry.register()
export class CreateItemCommand extends Command {
  private id: string;
  private name: string;
  private description: string;
  private value: number;
  constructor(id: string, name: string, description: string, value: number) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.value = value;
  }
  protected get REGEX(): RegExp {
    return /createItem\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    const name = args[1];
    const description = args[2];
    const value = Number(args[3]);
    return new CreateItemCommand(id, name, description, value);
  }
  protected isValid(): boolean {
    if (isNaN(this.value)) return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    if (state.items.has(this.id)) return state;
    const item = new Item(this.name, this.description, this.value);
    state.items.set(this.id, item);
    return state;
  }
}

@Command.registry.register()
export class DeltaInventoryCommand extends Command {
  private id: string;
  private item_id: string;
  private delta: number;
  constructor(id: string, item_id: string, delta: number) {
    super();
    this.id = id;
    this.item_id = item_id;
    this.delta = delta;
  }
  protected get REGEX(): RegExp {
    return /deltaInventory\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    const item_id = args[1];
    const delta = Number(args[2]);
    return new DeltaInventoryCommand(id, item_id, delta);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta)) return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    if (!state.items.has(this.item_id)) return state;
    const character = state.getCharacter(this.id);
    const storage = state.storages.get(this.id);
    if (!character && !storage) return state;
    const inventory = character ? character.inventory : storage!.inventory;
    let quantity = inventory.get(this.item_id) || 0;
    quantity += this.delta;
    if (quantity <= 0) {
      inventory.delete(this.item_id);
    } else {
      inventory.set(this.item_id, quantity);
    }
    return state;
  }
}

@Command.registry.register()
export class CreateStorageCommand extends Command {
  private id: string;
  private name: string;
  private description: string;
  private parent_id: string;
  constructor(id: string, name: string, description: string, parent_id: string) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.parent_id = parent_id;
  }
  protected get REGEX(): RegExp {
    return /createStorage\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    const name = args[1];
    const description = args[2];
    const parent_id = args[3];
    return new CreateStorageCommand(id, name, description, parent_id);
  }
  protected isValid(): boolean {
    if (this.id.trim() === '') return false;
    if (this.name.trim() === '') return false;
    if (this.description.trim() === '') return false;
    if (this.parent_id.trim() === '') return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    state.addStorage(this.id, this.name, this.description, this.parent_id);
    return state;
  }
}

@Command.registry.register()
export class RemoveStorageCommand extends Command {
  private id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }
  protected get REGEX(): RegExp {
    return /removeStorage\(\s*"([^"]+?)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    return new RemoveStorageCommand(id);
  }
  protected isValid(): boolean {
    if (this.id.trim() === '') return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    state.removeStorage(this.id);
    return state;
  }
}

@Command.registry.register()
export class SetStorageParentCommand extends Command {
  private storage_id: string;
  private parent_id: string;
  constructor(storage_id: string, parent_id: string) {
    super();
    this.storage_id = storage_id;
    this.parent_id = parent_id;
  }
  protected get REGEX(): RegExp {
    return /setStorageParent\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const storage_id = args[0];
    const parent_id = args[1];
    return new SetStorageParentCommand(storage_id, parent_id);
  }
  protected isValid(): boolean {
    if (this.storage_id.trim() === '') return false;
    if (this.parent_id.trim() === '') return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    state.setStorageParent(this.storage_id, this.parent_id);
    return state;
  }
}

@Command.registry.register()
export class CreateLocationCommand extends Command {
  private id: string;
  private name: string;
  private location: string;
  private description: string;
  constructor(id: string, name: string, location: string, description: string) {
    super();
    this.id = id;
    this.name = name;
    this.location = location;
    this.description = description;
  }
  protected get REGEX(): RegExp {
    return /createLocation\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    const name = args[1];
    const location = args[2];
    const description = args[3];
    return new CreateLocationCommand(id, name, location, description);
  }
  protected isValid(): boolean {
    if (this.id.trim() === '') return false;
    if (this.name.trim() === '') return false;
    if (this.location.trim() === '') return false;
    if (this.description.trim() === '') return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    if (state.locations.has(this.id)) return state;
    const location = new Location(this.id, this.name, this.location, this.description, null, [], []);
    state.locations.set(this.id, location);
    return state;
  }
}

@Command.registry.register()
export class AddSubLocationCommand extends Command {
  private parent_location_id: string;
  private sub_location_id: string;
  constructor(parent_location_id: string, sub_location_id: string) {
    super();
    this.parent_location_id = parent_location_id;
    this.sub_location_id = sub_location_id;
  }
  protected get REGEX(): RegExp {
    return /addSubLocation\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const parent_location_id = args[0];
    const sub_location_id = args[1];
    return new AddSubLocationCommand(parent_location_id, sub_location_id);
  }
  protected isValid(): boolean {
    if (this.parent_location_id.trim() === '') return false;
    if (this.sub_location_id.trim() === '') return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    const parent_location = state.locations.get(this.parent_location_id);
    if (!parent_location) return state;
    const sub_location = state.locations.get(this.sub_location_id);
    if (!sub_location) return state;
    if (sub_location.parent_location_id !== null) return state;
    if (parent_location.sub_location_ids.includes(this.sub_location_id)) return state;
    parent_location.sub_location_ids.push(this.sub_location_id);
    sub_location.parent_location_id = this.parent_location_id;
    return state;
  }
}

@Command.registry.register()
export class SetLocationDescriptionCommand extends Command {
  private id: string;
  private description: string;
  constructor(id: string, description: string) {
    super();
    this.id = id;
    this.description = description;
  }
  protected get REGEX(): RegExp {
    return /setLocationDescription\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    const description = args[1];
    return new SetLocationDescriptionCommand(id, description);
  }
  protected isValid(): boolean {
    if (this.id.trim() === '') return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    const location = state.locations.get(this.id);
    if (!location) return state;
    location.description = this.description;
    return state;
  }
}

@Command.registry.register()
export class CreatePromiseCommand extends Command {
  private deadline_year: number;
  private deadline_month: number;
  private deadline_date: number;
  private deadline_hours: number;
  private deadline_minutes: number;
  private character_ids: string[];
  private location_id: string;
  private description: string;
  constructor(
    deadline_year: number,
    deadline_month: number,
    deadline_date: number,
    deadline_hours: number,
    deadline_minutes: number,
    character_ids: string[],
    location_id: string,
    description: string,
  ) {
    super();
    this.deadline_year = deadline_year;
    this.deadline_month = deadline_month;
    this.deadline_date = deadline_date;
    this.deadline_hours = deadline_hours;
    this.deadline_minutes = deadline_minutes;
    this.character_ids = character_ids;
    this.location_id = location_id;
    this.description = description;
  }
  protected get REGEX(): RegExp {
    return /createPromise\(\s*([^,()]+)\s*,\s*([^,()]+)\s*,\s*([^,()]+)\s*,\s*([^,()]+)\s*,\s*([^,()]+)\s*,\s*"([^"]+?)"\s*,\s*"([^"]*?)"\s*,\s*"([^"]+?)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const deadline_year = Number(args[0]);
    const deadline_month = Number(args[1]);
    const deadline_date = Number(args[2]);
    const deadline_hours = Number(args[3]);
    const deadline_minutes = Number(args[4]);
    const character_ids_str = args[5];
    const location_id = args[6];
    const description = args[7];
    const character_ids = character_ids_str.split(',').map(s => s.trim());
    return new CreatePromiseCommand(
      deadline_year,
      deadline_month,
      deadline_date,
      deadline_hours,
      deadline_minutes,
      character_ids,
      location_id,
      description,
    );
  }
  protected isValid(): boolean {
    if (isNaN(this.deadline_year)) return false;
    if (isNaN(this.deadline_month)) return false;
    if (isNaN(this.deadline_date)) return false;
    if (isNaN(this.deadline_hours)) return false;
    if (isNaN(this.deadline_minutes)) return false;
    return true;
  }
  public execute(state: State, _message_id: number): State {
    if (this.location_id !== '' && !state.locations.has(this.location_id)) return state;
    for (const id of this.character_ids) {
      if (!state.hasCharacter(id)) return state;
    }
    const deadline = new Datetime(
      new Date(
        this.deadline_year,
        this.deadline_month - 1,
        this.deadline_date,
        this.deadline_hours,
        this.deadline_minutes,
      ),
    );
    const location_id = this.location_id === '' ? null : this.location_id;
    state.addPromise(deadline, this.character_ids, location_id, this.description);
    return state;
  }
}

@Command.registry.register()
export class RemovePromiseCommand extends Command {
  private id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }
  protected get REGEX(): RegExp {
    return /removePromise\(\s*"([^,()]+)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    return new RemovePromiseCommand(id);
  }
  protected isValid(): boolean {
    return this.id.trim() !== '';
  }
  public execute(state: State, _message_id: number): State {
    if (!state.promises.has(this.id)) return state;
    state.promises.delete(this.id);
    return state;
  }
}

@Command.registry.register()
export class StartEventCommand extends Command {
  private event: string;
  constructor(event: string) {
    super();
    this.event = event;
  }
  protected get REGEX(): RegExp {
    return /startEvent\(\s*"([^"]+)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const event = args[0];
    return new StartEventCommand(event);
  }
  protected isValid(): boolean {
    return this.event.trim() !== '';
  }
  public execute(state: State, _message_id: number): State {
    state.current_event = this.event;
    return state;
  }
}

@Command.registry.register()
export class FinishEventCommand extends Command {
  private summary: string;
  private weighting: number;
  constructor(summary: string, weighting: number) {
    super();
    this.summary = summary;
    this.weighting = weighting;
  }
  protected get REGEX(): RegExp {
    return /finishEvent\(\s*"([^"]+)"\s*,\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const summary = args[0];
    const weighting = Number(args[1]);
    return new FinishEventCommand(summary, weighting);
  }
  protected isValid(): boolean {
    if (this.summary.trim() === '') return false;
    if (isNaN(this.weighting)) return false;
    return true;
  }
  public execute(state: State, message_id: number): State {
    state.addSummary(this.summary, this.weighting, message_id);
    state.current_event = State.CURRENT_EVENT_NULL_VALUE;
    return state;
  }
}

@Command.registry.register()
export class ActivateCharacterCommand extends Command {
  private id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }
  protected get REGEX(): RegExp {
    return /activateCharacter\(\s*"([^"]+)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    return new ActivateCharacterCommand(id);
  }
  protected isValid(): boolean {
    return this.id.trim() !== '';
  }
  public execute(state: State, _message_id: number): State {
    if (!state.deactive_characters.has(this.id)) return state;
    const character = state.deactive_characters.get(this.id)!;
    state.active_characters.set(this.id, character);
    state.deactive_characters.delete(this.id);
    return state;
  }
}

@Command.registry.register()
export class DeactivateCharacterCommand extends Command {
  private id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }
  protected get REGEX(): RegExp {
    return /deactivateCharacter\(\s*"([^"]+)"\s*\)/g;
  }
  protected create(args: string[]): Command {
    const id = args[0];
    return new DeactivateCharacterCommand(id);
  }
  protected isValid(): boolean {
    return this.id.trim() !== '';
  }
  public execute(state: State, _message_id: number): State {
    if (!state.active_characters.has(this.id)) return state;
    const character = state.active_characters.get(this.id)!;
    state.deactive_characters.set(this.id, character);
    state.active_characters.delete(this.id);
    return state;
  }
}

export class Commands {
  private commands: Command[] = [];

  constructor(commands?: Command[]) {
    this.commands = commands ?? [];
  }

  public pushCommand(command: Command) {
    this.commands.push(command);
  }

  static fromString(s: string): Commands {
    if (!s.includes('<VariableUpdate>')) return new Commands();
    const s_split = s.split('<VariableUpdate>');
    const command_string = s_split[s_split.length - 1].split('</VariableUpdate>')[0];
    let command_index_array: { command: Command; index: number }[] = [];
    for (const command_class of Command.registry.getAll().values()) {
      command_index_array = command_index_array.concat(command_class.parseString(command_string));
    }
    command_index_array.sort((a, b) => a.index - b.index);
    const commands: Command[] = command_index_array.map(args => {
      return args.command;
    });
    console.log('[Commands] commands:', commands);
    return new Commands(commands);
  }

  public execute(state: State, message_id: number): State {
    for (const command of this.commands) {
      command.execute(state, message_id);
    }
    return state;
  }

  *[Symbol.iterator](): IterableIterator<Command> {
    for (const command of this.commands) {
      yield command;
    }
  }
}
