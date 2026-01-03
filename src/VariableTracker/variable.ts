import { ClassRegistry } from '@/util/class_registry';
import { RandomEvent, select } from '@/util/random';

export abstract class Variable {
  public abstract get TYPE(): string;
  protected abstract fromObject(obj: Record<string, any>): Variable | null;
  public abstract getValue(): Record<string, any>;

  public static readonly registry = new ClassRegistry<typeof Variable>();

  public constructor(..._args: any[]) {}

  public static fromObject(obj: Record<string, any>): Variable | null {
    return this.prototype.fromObject(obj);
  }
}

@Variable.registry.register(NumVariable.prototype.TYPE)
export class NumVariable extends Variable {
  private low: number | null;
  private high: number | null;
  private num: number;

  constructor(low: number | null, high: number | null, num: number) {
    super();
    this.low = low;
    this.high = high;
    this.num = num;
  }

  protected fromObject(obj: Record<string, any>): NumVariable | null {
    const low = obj['low'];
    const high = obj['high'];
    const num = obj['num'];
    return new NumVariable(low, high, num);
  }

  public get TYPE(): string {
    return 'num';
  }

  public getValue(): Record<string, any> {
    return {
      low: this.low,
      high: this.high,
      num: this.num,
    };
  }

  public getLow(): number | null {
    return this.low;
  }

  public getHigh(): number | null {
    return this.high;
  }

  public getNum(): number {
    return this.num;
  }

  public deltaLow(delta: number | null): void {
    if (delta === null) {
      this.low = null;
    } else if (this.low === null) {
      this.low = delta;
    } else {
      this.low += delta;
    }
    this.applyConstrain();
  }

  public deltaHigh(delta: number | null): void {
    if (delta === null) {
      this.high = null;
    } else if (this.high === null) {
      this.high = delta;
    } else {
      this.high += delta;
    }
    this.applyConstrain();
  }

  public deltaNum(delta: number): void {
    this.num += delta;
    this.applyConstrain();
  }

  private applyConstrain(): void {
    if (this.low !== null && this.num < this.low) {
      this.num = this.low;
    }
    if (this.high !== null && this.num > this.high) {
      this.num = this.high;
    }
  }
}

@Variable.registry.register(StrVariable.prototype.TYPE)
export class StrVariable extends Variable {
  private str: string;

  constructor(str: string) {
    super();
    this.str = str;
  }

  protected fromObject(obj: Record<string, any>): StrVariable | null {
    const str = obj['str'];
    return new StrVariable(str);
  }

  public get TYPE(): string {
    return 'str';
  }

  public getValue(): Record<string, any> {
    return {
      str: this.str,
    };
  }

  public getStr(): string {
    return this.str;
  }

  public setStr(str: string): void {
    this.str = str;
  }
}

@Variable.registry.register(DatetimeVariable.prototype.TYPE)
export class DatetimeVariable extends Variable {
  private datetime: Date;

  constructor(datetime: Date) {
    super();
    this.datetime = new Date(datetime);
  }

  protected fromObject(obj: Record<string, any>): Variable | null {
    const datetime = obj['datetime'];
    return new DatetimeVariable(datetime);
  }

  public get TYPE(): string {
    return 'datetime';
  }

  public getValue(): Record<string, any> {
    return {
      datetime: this.datetime,
    };
  }

  public getYear(): number {
    return this.datetime.getFullYear();
  }

  public getMonth(): number {
    return this.datetime.getMonth();
  }

  public getDate(): number {
    return this.datetime.getDate();
  }

  public getHours(): number {
    return this.datetime.getHours();
  }

  public getMinutes(): number {
    return this.datetime.getMinutes();
  }

  public getSeconds(): number {
    return this.datetime.getSeconds();
  }

  public getDay(): number {
    return this.datetime.getDay();
  }

  public getDateTime(): Date {
    return this.datetime;
  }

  public deltaDatetime(
    delta_year: number,
    delta_month: number,
    delta_date: number,
    delta_hour: number,
    delta_minute: number,
    delta_second: number,
  ): void {
    this.datetime.setFullYear(this.datetime.getFullYear() + delta_year);
    this.datetime.setMonth(this.datetime.getMonth() + delta_month);
    this.datetime.setDate(this.datetime.getDate() + delta_date);
    this.datetime.setHours(this.datetime.getHours() + delta_hour);
    this.datetime.setMinutes(this.datetime.getMinutes() + delta_minute);
    this.datetime.setSeconds(this.datetime.getSeconds() + delta_second);
  }
}

@Variable.registry.register(RandomVariable.prototype.TYPE)
export class RandomVariable extends Variable {
  private outcome: any;
  private random_events: RandomEvent[];

  constructor(outcome: any, random_events: RandomEvent[]) {
    super();
    this.outcome = outcome;
    this.random_events = random_events;
  }

  protected fromObject(obj: Record<string, any>): Variable | null {
    const outcome = obj?.outcome;
    const events = obj['random_events'];
    return new RandomVariable(outcome, events);
  }

  public get TYPE(): string {
    return 'random';
  }

  public getValue(): Record<string, any> {
    return {
      outcome: this.outcome,
      random_events: this.random_events,
    };
  }

  public roll(): void {
    this.outcome = select(this.random_events);
  }
}

@Variable.registry.register(MapVariable.prototype.TYPE)
export class MapVariable extends Variable {
  private map: Map<string, Variable>;

  constructor(map?: Record<string, Record<string, any>>) {
    super();
    this.map = new Map<string, Variable>();
    if (!map) return;
    for (const [key, variable_record] of Object.entries(map)) {
      const variable = Variable.registry.get(variable_record.type)?.fromObject(variable_record.values);
      if (variable) this.map.set(key, variable);
    }
  }
  public get TYPE(): string {
    return 'map';
  }
  protected fromObject(map: Record<string, any>): Variable | null {
    return new MapVariable(map);
  }
  public getValue(): Record<string, any> {
    const record: Record<string, any> = {};
    for (const [key, variable] of this.map.entries()) {
      record[key] = {
        type: variable.TYPE,
        values: variable.getValue(),
      };
    }
    return record;
  }
  public getVariable(key: string): Variable | undefined {
    return this.map.get(key);
  }
  public setVariable(key: string, variable: Variable): void {
    this.map.set(key, variable);
  }
  public deleteVariable(key: string): void {
    this.map.delete(key);
  }
  public get size(): number {
    return this.map.size;
  }

  public keys(): MapIterator<string> {
    return this.map.keys();
  }
}
