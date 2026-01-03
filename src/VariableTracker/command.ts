import { ClassRegistry } from '@/util/class_registry';
import { RandomEvent } from '@/util/random';
import { State } from './state';
import { DatetimeVariable, MapVariable, NumVariable, RandomVariable, StrVariable } from './variable';

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

export abstract class PostCommand extends Command {
  public abstract getRestoreKeys(state: State): string[];
}

@Command.registry.register()
export class InitNumCommand extends Command {
  private key: string;
  private low: number | null;
  private high: number | null;
  private num: number;

  constructor(key: string, low: number | null, high: number | null, num: number) {
    super();
    this.key = key;
    this.low = low;
    this.high = high;
    this.num = num;
  }

  public get REGEX() {
    return /init_num\s*\(\s*([^(),:]+?)\s*,\s*([^(),:]+?)\s*,\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    const low = args[1] === 'null' ? null : Number(args[1]);
    const high = args[2] === 'null' ? null : Number(args[2]);
    const num = Number(args[3]);
    return new InitNumCommand(key, low, high, num);
  }

  protected isValid(): boolean {
    if (this.low !== null && isNaN(this.low)) return false;
    if (this.high !== null && isNaN(this.high)) return false;
    if (isNaN(this.num)) return false;
    if (this.low !== null && this.high !== null && this.low > this.high) return false;
    return true;
  }

  public execute(state: State): State {
    const variable: NumVariable = new NumVariable(this.low, this.high, this.num);
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class DeltaNumCommand extends Command {
  private key: string;
  private delta: number;

  constructor(key: string, delta: number) {
    super();
    this.key = key;
    this.delta = delta;
  }

  public get REGEX() {
    return /delta_num\s*\(\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    const delta = Number(args[1]);
    return new DeltaNumCommand(key, delta);
  }

  protected isValid(): boolean {
    if (isNaN(this.delta)) return false;
    return true;
  }

  public execute(state: State): State {
    const variable = state.getVariable(this.key);
    if (variable === null || variable instanceof NumVariable === false) return state;
    variable.deltaNum(this.delta);
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class DeltaLowCommand extends Command {
  private key: string;
  private delta: number | null;

  constructor(key: string, delta: number | null) {
    super();
    this.key = key;
    this.delta = delta;
  }

  public get REGEX() {
    return /delta_low\s*\(\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    const delta = args[1] === 'null' ? null : Number(args[1]);
    return new DeltaLowCommand(key, delta);
  }

  protected isValid(): boolean {
    if (this.delta !== null && isNaN(this.delta)) return false;
    return true;
  }

  public execute(state: State): State {
    const variable = state.getVariable(this.key);
    if (variable === null || variable instanceof NumVariable === false) return state;
    variable.deltaLow(this.delta);
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class DeltaHighCommand extends Command {
  private key: string;
  private delta: number | null;

  constructor(key: string, delta: number | null) {
    super();
    this.key = key;
    this.delta = delta;
  }

  public get REGEX() {
    return /delta_high\s*\(\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    const delta = args[1] === 'null' ? null : Number(args[1]);
    return new DeltaHighCommand(key, delta);
  }

  protected isValid(): boolean {
    if (this.delta !== null && isNaN(this.delta)) return false;
    return true;
  }

  public execute(state: State): State {
    const variable = state.getVariable(this.key);
    if (variable === null || variable instanceof NumVariable === false) return state;
    variable.deltaHigh(this.delta);
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class InitStrCommand extends Command {
  private key: string;
  private str: string;

  constructor(key: string, str: string) {
    super();
    this.key = key;
    this.str = str;
  }

  public get REGEX() {
    return /init_str\s*\(\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    const str = args[1];
    return new InitStrCommand(key, str);
  }

  protected isValid(): boolean {
    return true;
  }

  public execute(state: State): State {
    const variable = new StrVariable(this.str);
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class SetStrCommand extends Command {
  private key: string;
  private str: string;

  constructor(key: string, str: string) {
    super();
    this.key = key;
    this.str = str;
  }

  public get REGEX() {
    return /set_str\s*\(\s*([^(),:]+?)\s*,\s*([^)]+?)\s*\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    const str = args[1];
    return new SetStrCommand(key, str);
  }

  protected isValid(): boolean {
    return true;
  }

  public execute(state: State): State {
    const variable = state.getVariable(this.key);
    if (variable === null || variable instanceof StrVariable === false) return state;
    variable.setStr(this.str);
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class InitDatetimeCommand extends Command {
  private key: string;
  private datetime_string: string;

  constructor(key: string, datetime_string: string) {
    super();
    this.key = key;
    this.datetime_string = datetime_string;
  }

  protected get REGEX(): RegExp {
    return /init_datetime\(([^,:]+),\s*([^)]+)\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    const datetime_string = args[1];
    return new InitDatetimeCommand(key, datetime_string);
  }

  protected isValid(): boolean {
    const datetime = new Date(this.datetime_string);
    return !isNaN(datetime.getTime());
  }

  public execute(state: State): State {
    const datetime = new Date(this.datetime_string);
    const variable = new DatetimeVariable(datetime);
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class DeltaDatetimeCommand extends Command {
  private key: string;
  private delta_year: number;
  private delta_month: number;
  private delta_date: number;
  private delta_hour: number;
  private delta_minute: number;
  private delta_second: number;

  constructor(
    key: string,
    delta_year: number,
    delta_month: number,
    delta_date: number,
    delta_hour: number,
    delta_minute: number,
    delta_second: number,
  ) {
    super();
    this.key = key;
    this.delta_year = delta_year;
    this.delta_month = delta_month;
    this.delta_date = delta_date;
    this.delta_hour = delta_hour;
    this.delta_minute = delta_minute;
    this.delta_second = delta_second;
  }

  protected get REGEX(): RegExp {
    return /delta_datetime\(([^,]+),\s*([^)]+),\s*([^)]+),\s*([^)]+),\s*([^)]+),\s*([^)]+),\s*([^)]+)\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    const delta_year = Number(args[1]);
    const delta_month = Number(args[2]);
    const delta_date = Number(args[3]);
    const delta_hour = Number(args[4]);
    const delta_minute = Number(args[5]);
    const delta_second = Number(args[6]);
    return new DeltaDatetimeCommand(key, delta_year, delta_month, delta_date, delta_hour, delta_minute, delta_second);
  }

  protected isValid(): boolean {
    if (isNaN(this.delta_year)) return false;
    if (isNaN(this.delta_month)) return false;
    if (isNaN(this.delta_date)) return false;
    if (isNaN(this.delta_hour)) return false;
    if (isNaN(this.delta_minute)) return false;
    if (isNaN(this.delta_second)) return false;
    return true;
  }

  public execute(state: State): State {
    const variable = state.getVariable(this.key);
    if (variable === null || variable instanceof DatetimeVariable === false) return state;
    variable.deltaDatetime(
      this.delta_year,
      this.delta_month,
      this.delta_date,
      this.delta_hour,
      this.delta_minute,
      this.delta_second,
    );
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class DeltaDatetimeSingleArgCommand extends Command {
  private command_name: string;
  private key: string;
  private delta: number;

  constructor(command_name: string, key: string, delta: number) {
    super();
    this.command_name = command_name;
    this.key = key;
    this.delta = delta;
  }

  protected get REGEX(): RegExp {
    return /(delta_year|delta_month|delta_date|delta_hour|delta_minute|delta_second)\(([^,]+),\s*([^)]+)\)/g;
  }

  protected create(args: string[]): Command {
    const command_name = args[0];
    const key = args[1];
    const delta = Number(args[2]);
    return new DeltaDatetimeSingleArgCommand(command_name, key, delta);
  }

  protected isValid(): boolean {
    if (isNaN(this.delta)) return false;
    return true;
  }

  public execute(state: State): State {
    const variable = state.getVariable(this.key);
    if (variable === null || variable instanceof DatetimeVariable === false) return state;
    const delta_year = this.command_name === 'delta_year' ? this.delta : 0;
    const delta_month = this.command_name === 'delta_month' ? this.delta : 0;
    const delta_date = this.command_name === 'delta_date' ? this.delta : 0;
    const delta_hour = this.command_name === 'delta_hour' ? this.delta : 0;
    const delta_minute = this.command_name === 'delta_minute' ? this.delta : 0;
    const delta_second = this.command_name === 'delta_second' ? this.delta : 0;
    variable.deltaDatetime(delta_year, delta_month, delta_date, delta_hour, delta_minute, delta_second);
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class InitRandomCommand extends Command {
  private key: string;
  private random_events: RandomEvent[];

  constructor(key: string, random_events: RandomEvent[]) {
    super();
    this.key = key;
    this.random_events = random_events;
  }

  protected get REGEX(): RegExp {
    return /init_random\(\s*([^,]+)\s*,\s*(.+)\s*\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    const random_events_str = args[1];
    const random_events: RandomEvent[] = [];
    for (const random_event_str of random_events_str.split(',')) {
      const [event_str, weighting_str] = random_event_str.split(':');
      random_events.push({ event: event_str, weighting: Number(weighting_str) });
    }
    return new InitRandomCommand(key, random_events);
  }

  protected isValid(): boolean {
    for (const random_event of this.random_events) {
      if (Number.isNaN(random_event.weighting)) return false;
    }
    return true;
  }

  public execute(state: State): State {
    const variable = new RandomVariable(null, this.random_events);
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class RollCommand extends PostCommand {
  private key: string;

  constructor(key: string) {
    super();
    this.key = key;
  }

  protected get REGEX(): RegExp {
    return /roll\(\s*([^,()]+)\s*\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    return new RollCommand(key);
  }

  protected isValid(): boolean {
    return true;
  }

  public execute(state: State): State {
    const variable = state.getVariable(this.key);
    if (variable === null || variable instanceof RandomVariable === false) return state;
    variable.roll();
    state.setVariable(this.key, variable);
    return state;
  }

  public getRestoreKeys(_state: State): string[] {
    return [this.key];
  }
}

@Command.registry.register()
export class DeleteCommand extends Command {
  private key: string;

  constructor(key: string) {
    super();
    this.key = key;
  }

  protected get REGEX(): RegExp {
    return /delete\(([^,()]+)\s*\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    return new DeleteCommand(key);
  }

  protected isValid(): boolean {
    return true;
  }

  public execute(state: State): State {
    state.deleteVariable(this.key);
    return state;
  }
}

@Command.registry.register()
export class InitMapCommand extends Command {
  private key: string;

  constructor(key: string) {
    super();
    this.key = key;
  }

  protected get REGEX(): RegExp {
    return /init_map\(\s*([^,]+)\s*\)/g;
  }

  protected create(args: string[]): Command {
    const key = args[0];
    return new InitMapCommand(key);
  }

  protected isValid(): boolean {
    return true;
  }

  public execute(state: State): State {
    const variable = new MapVariable();
    state.setVariable(this.key, variable);
    return state;
  }
}

@Command.registry.register()
export class AddMapCommand extends Command {
  private map_key: string;
  private variable_key: string;

  constructor(map_key: string, variable_key: string) {
    super();
    this.map_key = map_key;
    this.variable_key = variable_key;
  }
  protected get REGEX(): RegExp {
    return /add_map\(\s*([^,]+)\s*,\s*(.+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const map_key = args[0];
    const variable_key = args[1];
    return new AddMapCommand(map_key, variable_key);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const map = state.getVariable(this.map_key);
    if (map === null || map instanceof MapVariable === false) return state;
    const variable = state.getVariable(this.variable_key);
    if (variable === null) return state;
    map.setVariable(this.variable_key, variable);
    state.deleteVariable(this.variable_key);
    state.setVariable(this.map_key, map);
    return state;
  }
}

@Command.registry.register()
export class PopMapCommand extends Command {
  private map_key: string;
  private variable_key: string;

  constructor(map_key: string, variable_key: string) {
    super();
    this.map_key = map_key;
    this.variable_key = variable_key;
  }
  protected get REGEX(): RegExp {
    return /pop_map\(\s*([^,]+)\s*,\s*(.+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const map_key = args[0];
    const variable_key = args[1];
    return new PopMapCommand(map_key, variable_key);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const map = state.getVariable(this.map_key);
    if (map === null || map instanceof MapVariable === false) return state;
    const variable = map.getVariable(this.variable_key);
    if (variable === undefined) return state;
    map.deleteVariable(this.variable_key);
    state.setVariable(this.variable_key, variable);
    state.setVariable(this.map_key, map);
    return state;
  }
}

@Command.registry.register()
export class DeleteMapCommand extends Command {
  private map_key: string;
  private variable_key: string;

  constructor(map_key: string, variable_key: string) {
    super();
    this.map_key = map_key;
    this.variable_key = variable_key;
  }
  protected get REGEX(): RegExp {
    return /delete_map\(\s*([^,]+)\s*,\s*(.+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const map_key = args[0];
    const variable_key = args[1];
    return new DeleteMapCommand(map_key, variable_key);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const map = state.getVariable(this.map_key);
    if (map === null || map instanceof MapVariable === false) return state;
    map.deleteVariable(this.variable_key);
    state.setVariable(this.map_key, map);
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

  static fromString(s: string, mode: 'normal' | 'post' = 'normal'): Commands {
    let s_split = s.split('<UserPerspective>');
    if (!s.includes('<VTC>')) return new Commands();
    s_split = s_split[s_split.length - 1].split(`<VTC>`);
    const command_string = s_split[s_split.length - 1].split(`</VTC>`)[0];
    let command_index_array: { command: Command; index: number }[] = [];
    for (const command_class of Command.registry.getAll().values()) {
      if (mode === 'normal' && command_class.prototype instanceof PostCommand) continue;
      if (mode === 'post' && !(command_class.prototype instanceof PostCommand)) continue;
      command_index_array = command_index_array.concat(command_class.parseString(command_string));
    }
    command_index_array.sort((a, b) => a.index - b.index);
    const commands: Command[] = command_index_array.map(args => {
      return args.command;
    });
    console.log('[VariableTracker] commands:', commands);
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
