import { Registry } from '@/util/registry';

export class Item {
  private static readonly registry = new Registry<Item>();
  public readonly name: string;
  public readonly description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  public static register(item: Item): void {
    Item.registry.register(item.name, item);
  }

  public static get(name: string): Item | undefined {
    return Item.registry.get(name);
  }
}

//Item.register(new Item('茶', '行動力+10'));
//Item.register(new Item('玉露', '行動力+20'));
//Item.register(new Item('咖啡', '就寢時間+2'));
//Item.register(new Item('紅茶', '行動力+5、就寢時間+1'));
//Item.register(new Item('泡麵', '今天的晚餐'));
//Item.register(new Item('體力食材', '今天的晚餐'));
//Item.register(new Item('便當', '今天的晚餐'));
//Item.register(new Item('食材', '今天的晚餐'));
