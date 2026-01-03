export class Item {
  public name: string;
  public static readonly NAME_KEY: string = '名稱';
  public description: string;
  public static readonly DESCRIPTION_KEY: string = '描述';
  public value: number;
  public static readonly VALUE_KEY: string = '價值';

  public constructor(name: string, description: string, value: number) {
    this.name = name;
    this.description = description;
    this.value = value;
  }

  public static fromRecord(record: Record<string, any>): Item {
    return new Item(record[Item.NAME_KEY], record[Item.DESCRIPTION_KEY], record[Item.VALUE_KEY]);
  }

  public toRecord(): Record<string, any> {
    return {
      [Item.NAME_KEY]: this.name,
      [Item.DESCRIPTION_KEY]: this.description,
      [Item.VALUE_KEY]: this.value,
    };
  }
}
