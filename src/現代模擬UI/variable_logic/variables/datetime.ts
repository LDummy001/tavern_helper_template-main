export class Datetime {
  private _date: Date;

  constructor(date: Date) {
    this._date = date;
  }

  public static fromString(str: string): Datetime {
    return new Datetime(new Date(str));
  }

  public toString(): string {
    return this._date.toString();
  }

  public get year(): number {
    return this._date.getFullYear();
  }

  public get month(): number {
    return this._date.getMonth() + 1;
  }

  public get date(): number {
    return this._date.getDate();
  }

  public get hours(): number {
    return this._date.getHours();
  }

  public get minutes(): number {
    return this._date.getMinutes();
  }

  public get seconds(): number {
    return this._date.getSeconds();
  }

  public toDate(): Date {
    return this._date;
  }

  public deltaMinutes(delta_minutes: number): void {
    this._date.setMinutes(this._date.getMinutes() + delta_minutes);
  }

  public clone(): Datetime {
    return new Datetime(new Date(this._date));
  }
}
