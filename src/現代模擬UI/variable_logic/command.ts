import { ClassRegistry } from '@/util/class_registry';
import { Character } from './variables/character';
import { Datetime } from './variables/datetime';
import { State } from './variables/state';

export abstract class Command {
  protected abstract get REGEX(): RegExp;
  protected abstract create(args: string[]): Command;
  protected abstract isValid(): boolean;
  public abstract execute(state: State): State;

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
  public execute(state: State): State {
    state.datetime.deltaMinutes(this.delta_minutes);
    return state;
  }
}

@Command.registry.register()
export class SetBigLocationCommand extends Command {
  private big_location: string;
  constructor(big_location: string) {
    super();
    this.big_location = big_location;
  }
  protected get REGEX(): RegExp {
    return /setBigLocation\s*\(\s*"([^"]+?)"\s*\s*\)/g;
  }
  protected create(args: string[]): Command {
    const big_location = args[0];
    return new SetBigLocationCommand(big_location);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    state.big_location = this.big_location;
    return state;
  }
}

@Command.registry.register()
export class SetMiddleLocationCommand extends Command {
  private middle_location: string;
  constructor(middle_location: string) {
    super();
    this.middle_location = middle_location;
  }
  protected get REGEX(): RegExp {
    return /setMiddleLocation\s*\(\s*"([^"]+?)"\s*\s*\)/g;
  }
  protected create(args: string[]): Command {
    const middle_location = args[0];
    return new SetMiddleLocationCommand(middle_location);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    state.middle_location = this.middle_location;
    return state;
  }
}

@Command.registry.register()
export class SetSmallLocationCommand extends Command {
  private small_location: string;
  constructor(small_location: string) {
    super();
    this.small_location = small_location;
  }
  protected get REGEX(): RegExp {
    return /setSmallLocation\s*\(\s*"([^"]+?)"\s*\s*\)/g;
  }
  protected create(args: string[]): Command {
    const small_location = args[0];
    return new SetSmallLocationCommand(small_location);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    state.small_location = this.small_location;
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
    return /setWeather\s*\(\s*"([^"]+?)"\s*\s*\)/g;
  }
  protected create(args: string[]): Command {
    const weather = args[0];
    return new SetWeatherCommand(weather);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
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
    return /createCharacter\s*\(\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^"]+?)\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*,\s*"([^"]+?)"\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*,\s*"([^"]+?)"\s*,\s*"([^"]+?)"\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*,\s*([^"]+?)\s*\)/g;
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
  public execute(state: State): State {
    if (state.active_characters.has(this.id) || state.deactive_characters.has(this.id)) return state;
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
    let s_split = s.split('</UserPerspective>');
    s_split = s_split[s_split.length - 1].split(`<VariableUpdate>`);
    const command_string = s_split[s_split.length - 1].split(`</VariableUpdate>`)[0];
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

  public execute(state: State): State {
    for (const command of this.commands) {
      command.execute(state);
    }
    return state;
  }

  *[Symbol.iterator](): IterableIterator<Command> {
    for (const command of this.commands) {
      yield command;
    }
  }
}
