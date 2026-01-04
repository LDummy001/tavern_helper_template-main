import { Datetime } from './datetime';

export class Character {
  public name: string;
  public static readonly NAME_KEY: string = '名稱';
  public age: number | null;
  public static readonly AGE_KEY: string = '年齡';
  public gender: string;
  public static readonly GENDER_KEY: string = '性別';
  public identity: string;
  public static readonly IDENTITY_KEY: string = '身份';
  public introduction: string;
  public static readonly INTRODUCTION_KEY: string = '簡介';
  public personality: string;
  public static readonly PERSONALITY_KEY: string = '性格';
  public height: number;
  public static readonly HEIGHT_KEY: string = '身高';
  public weight: number;
  public static readonly WEIGHT_KEY: string = '體重';
  public chest_size: number;
  public static readonly CHEST_SIZE_KEY: string = '胸圍';
  public cup_size: string | null;
  public static readonly CUP_SIZE_KEY: string = '罩杯';
  public waist_size: number;
  public static readonly WAIST_SIZE_KEY: string = '腰圍';
  public hips_size: number;
  public static readonly HIPS_SIZE_KEY: string = '臀圍';
  public hairstyle: string;
  public static readonly HAIRSTYLE_KEY: string = '髮型';
  public appearance: string;
  public static readonly APPEARANCE_KEY: string = '樣貌';
  public clothes: string;
  public static readonly CLOTHES_KEY: string = '衣著';
  public birthday: Datetime;
  public static readonly BIRTHDAY_KEY: string = '生日';
  public favourite: string;
  public static readonly FAVOURITE_KEY: string = '愛好';
  public extra_information: string;
  public static readonly EXTRA_INFORMATION_KEY: string = '其他重要資訊';
  public money: number;
  public static readonly MONEY_KEY: string = '金錢';
  public mood: number;
  public static readonly MOOD_KEY: string = '心情';
  public horny: number;
  public static readonly HORNY_KEY: string = '性慾';
  public relations: Map<string, string>;
  public static readonly RELATIONS_KEY: string = '關係';
  public friendships: Map<string, number>;
  public static readonly FRIENDSHIPS_KEY: string = '友好度';
  public loves: Map<string, number>;
  public static readonly LOVES_KEY: string = '愛情度';
  public inventory: Map<string, number>;
  public static readonly INVENTORY_KEY: string = '所持物';

  public static readonly MOOD_LOW: number = -100;
  public static readonly MOOD_HIGH: number = 100;
  public static readonly HORNY_LOW: number = 0;
  public static readonly HORNY_HIGH: number = 100;
  public static readonly FRIENDSHIP_LOW: number = -1000;
  public static readonly FRIENDSHIP_HIGH: number = 1000;
  public static readonly LOVE_LOW: number = 0;
  public static readonly LOVE_HIGH: number = 1000;

  public constructor(
    name: string,
    age: number,
    gender: string,
    identity: string,
    introduction: string,
    personality: string,
    height: number,
    weight: number,
    chest_size: number,
    cup_size: string | null,
    waist_size: number,
    hips_size: number,
    hairstyle: string,
    appearance: string,
    clothes: string,
    birthday: Datetime,
    favourite: string,
    extra_information: string,
    money: number,
    mood: number,
    horny: number,
    relations: Map<string, string>,
    friendships: Map<string, number>,
    loves: Map<string, number>,
    inventory: Map<string, number>,
  ) {
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
    this.birthday = birthday;
    this.favourite = favourite;
    this.extra_information = extra_information;
    this.money = money;
    this.mood = mood;
    this.horny = horny;
    this.relations = relations;
    this.friendships = friendships;
    this.loves = loves;
    this.inventory = inventory;
  }

  public static instantiate(): Character {
    // Just for testing usage, probably change the logic later on.
    return new Character(
      '紫月',
      17,
      '男',
      '高中二年級學生',
      '一段介紹',
      '平淡，膽小',
      172,
      52,
      70,
      null,
      50,
      55,
      '黑色短髮',
      '普通，平平無奇',
      '居家服',
      new Datetime(new Date(1998, 8, 22, 0, 0, 0)),
      '妹妹',
      '沒有額外資訊',
      10000,
      20,
      0,
      new Map([['c2', '哥哥']]),
      new Map([
        ['c2', 100],
        ['c5', 70],
        ['c6', -40],
      ]),
      new Map([['c2', 50]]),
      new Map([['i2', 2]]),
    );
  }

  public static fromRecord(record: Record<string, any>): Character {
    return new Character(
      record[Character.NAME_KEY],
      record[Character.AGE_KEY],
      record[Character.GENDER_KEY],
      record[Character.IDENTITY_KEY],
      record[Character.INTRODUCTION_KEY],
      record[Character.PERSONALITY_KEY],
      record[Character.HEIGHT_KEY],
      record[Character.WEIGHT_KEY],
      record[Character.CHEST_SIZE_KEY],
      record[Character.CUP_SIZE_KEY] ?? null,
      record[Character.WAIST_SIZE_KEY],
      record[Character.HIPS_SIZE_KEY],
      record[Character.HAIRSTYLE_KEY],
      record[Character.APPEARANCE_KEY],
      record[Character.CLOTHES_KEY],
      new Datetime(record[Character.BIRTHDAY_KEY]),
      record[Character.FAVOURITE_KEY],
      record[Character.EXTRA_INFORMATION_KEY],
      record[Character.MONEY_KEY],
      record[Character.MOOD_KEY],
      record[Character.HORNY_KEY],
      new Map(Object.entries(record[Character.RELATIONS_KEY])),
      new Map(Object.entries(record[Character.FRIENDSHIPS_KEY])),
      new Map(Object.entries(record[Character.LOVES_KEY])),
      new Map(Object.entries(record[Character.INVENTORY_KEY])),
    );
  }

  public toRecord(): Record<string, any> {
    return {
      [Character.NAME_KEY]: this.name,
      [Character.AGE_KEY]: this.age,
      [Character.GENDER_KEY]: this.gender,
      [Character.IDENTITY_KEY]: this.identity,
      [Character.INTRODUCTION_KEY]: this.introduction,
      [Character.PERSONALITY_KEY]: this.personality,
      [Character.HEIGHT_KEY]: this.height,
      [Character.WEIGHT_KEY]: this.weight,
      [Character.CHEST_SIZE_KEY]: this.chest_size,
      [Character.CUP_SIZE_KEY]: this.cup_size,
      [Character.WAIST_SIZE_KEY]: this.waist_size,
      [Character.HIPS_SIZE_KEY]: this.hips_size,
      [Character.HAIRSTYLE_KEY]: this.hairstyle,
      [Character.APPEARANCE_KEY]: this.appearance,
      [Character.CLOTHES_KEY]: this.clothes,
      [Character.BIRTHDAY_KEY]: this.birthday.toDate(),
      [Character.FAVOURITE_KEY]: this.favourite,
      [Character.EXTRA_INFORMATION_KEY]: this.extra_information,
      [Character.MONEY_KEY]: this.money,
      [Character.MOOD_KEY]: this.mood,
      [Character.HORNY_KEY]: this.horny,
      [Character.RELATIONS_KEY]: Object.fromEntries(this.relations),
      [Character.FRIENDSHIPS_KEY]: Object.fromEntries(this.friendships),
      [Character.LOVES_KEY]: Object.fromEntries(this.loves),
      [Character.INVENTORY_KEY]: Object.fromEntries(this.inventory),
    };
  }

  public deltaFriendship(character_id: string, delta: number) {
    let friendship = this.friendships.get(character_id) || 0;
    friendship += delta;
    if (friendship < Character.FRIENDSHIP_LOW) friendship = Character.FRIENDSHIP_LOW;
    if (friendship > Character.FRIENDSHIP_HIGH) friendship = Character.FRIENDSHIP_HIGH;
    this.friendships.set(character_id, friendship);
  }

  public deltaLove(character_id: string, delta: number) {
    let love = this.loves.get(character_id) || 0;
    love += delta;
    if (love < Character.LOVE_LOW) love = Character.LOVE_LOW;
    if (love > Character.LOVE_HIGH) love = Character.LOVE_HIGH;
    if (love === 0) this.loves.delete(character_id);
    else this.loves.set(character_id, love);
  }

  public deltaMood(delta: number) {
    this.mood += delta;
    if (this.mood < Character.MOOD_LOW) this.mood = Character.MOOD_LOW;
    if (this.mood > Character.MOOD_HIGH) this.mood = Character.MOOD_HIGH;
  }

  public deltaHorny(delta: number) {
    this.horny += delta;
    if (this.horny < Character.HORNY_LOW) this.horny = Character.HORNY_LOW;
    if (this.horny > Character.HORNY_HIGH) this.horny = Character.HORNY_HIGH;
  }
}
