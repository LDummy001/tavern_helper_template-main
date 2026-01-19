export class Storage {
  public name: string;
  public static readonly NAME_KEY: string = '名稱';
  public description: string;
  public static readonly DESCRIPTION_KEY: string = '描述';
  public parent_id: string;
  public static readonly PARENT_ID_KEY: string = '父id';
  public money: number;
  public static readonly MONEY_KEY: string = '金錢';
  public inventory: Map<string, number>;
  public static readonly INVENTORY_KEY: string = '貯存物';

  public constructor(
    name: string,
    description: string,
    parent_id: string,
    money: number,
    inventory: Map<string, number>,
  ) {
    this.name = name;
    this.description = description;
    this.parent_id = parent_id;
    this.money = money;
    this.inventory = inventory;
  }

  public static fromRecord(record: Record<string, any>): Storage {
    const inventory = new Map<string, number>();
    const inventory_record: Record<string, number> = record[Storage.INVENTORY_KEY] || {};
    for (const [item_id, quantity] of Object.entries(inventory_record)) {
      inventory.set(item_id, quantity);
    }
    return new Storage(
      record[Storage.NAME_KEY],
      record[Storage.DESCRIPTION_KEY],
      record[Storage.PARENT_ID_KEY],
      record[Storage.MONEY_KEY],
      inventory,
    );
  }

  public toRecord(): Record<string, any> {
    const inventory: Record<string, number> = {};
    for (const [item_id, quantity] of Array.from(this.inventory)) {
      inventory[item_id] = quantity;
    }
    return {
      [Storage.NAME_KEY]: this.name,
      [Storage.DESCRIPTION_KEY]: this.description,
      [Storage.PARENT_ID_KEY]: this.parent_id,
      [Storage.MONEY_KEY]: this.money,
      [Storage.INVENTORY_KEY]: inventory,
    };
  }
}
