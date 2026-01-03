import { State } from '@/VariableTracker/state';
import { DatetimeVariable, MapVariable, NumVariable, StrVariable } from '@/VariableTracker/variable';
import { Item } from './item';

export class GameState extends State {
  public constructor(state: State) {
    super(state);
  }

  public static get STAMINA_KEY(): string {
    return '行動力';
  }

  public static get MONEY_KEY(): string {
    return '金錢';
  }

  public static get TRUST_KEY(): string {
    return '信賴';
  }

  public static get INTEREST_KEY(): string {
    return '興致';
  }

  public static get MOOD_KEY(): string {
    return '心情';
  }

  public static get CURRENT_ACTION_KEY(): string {
    return '當前行動';
  }

  public static get EXPECT_RESULT_KEY(): string {
    return '預期結果';
  }

  public static get DATETIME_KEY(): string {
    return '時間';
  }

  public static get BIG_PLACE_KEY(): string {
    return '大地點';
  }

  public static get MIDDLE_PLACE_KEY(): string {
    return '中地點';
  }

  public static get SMALL_PLACE_KEY(): string {
    return '小地點';
  }

  public static get WEATHER_KEY(): string {
    return '天氣';
  }

  public static get FLAGS_KEY(): string {
    return 'flags';
  }

  public static get FLAG_BATH_KEY(): string {
    return '洗澡了';
  }

  public static get SHOP_ITEMS_KEY(): string {
    return 'shop_items';
  }

  public static get INVENTORIES_KEY(): string {
    return 'inventories';
  }

  public static get TRUST_ROC_KEY(): string {
    return '信賴變動';
  }

  public static get INTEREST_ROC_KEY(): string {
    return '興致變動';
  }

  public static get MOOD_ROC_KEY(): string {
    return '心情變動';
  }

  public static get ITEM_TABLE_KEY(): string {
    return 'item_table';
  }

  public static get CLOTHING_KEY(): string {
    return '妹妹衣著';
  }

  public static get SUMMARY_TABLE_KEY(): string {
    return 'summary_table';
  }

  public static get SUMMARY_KEY(): string {
    return '總結';
  }

  public static get WEIGHTING_KEY(): string {
    return '權重';
  }

  private getNumVariable(key: string): NumVariable | null {
    const variable = this.state.get(key);
    if (variable instanceof NumVariable) return variable;
    else return null;
  }

  private getStrVariable(key: string): StrVariable | null {
    const variable = this.state.get(key);
    if (variable instanceof StrVariable) return variable;
    else return null;
  }

  private getMapVariable(key: string): MapVariable | null {
    const variable = this.state.get(key);
    if (variable instanceof MapVariable) return variable;
    else return null;
  }

  private getStaminaVariable(): NumVariable {
    return this.getNumVariable(GameState.STAMINA_KEY)!;
  }

  public getStamina(): number {
    return this.getStaminaVariable().getNum();
  }

  public deltaStamina(delta: number): void {
    this.getStaminaVariable().deltaNum(delta);
  }

  public getStaminaHigh(): number | null {
    return this.getStaminaVariable().getHigh();
  }

  public deltaStaminaHigh(delta: number): void {
    this.getStaminaVariable().deltaHigh(delta);
  }

  private getMoneyVariable(): NumVariable {
    return this.getNumVariable(GameState.MONEY_KEY)!;
  }

  public getMoney(): number {
    return this.getMoneyVariable()!.getNum();
  }

  public deltaMoney(delta: number): void {
    this.getMoneyVariable().deltaNum(delta);
  }

  private getTrustVariable(): NumVariable {
    return this.getNumVariable(GameState.TRUST_KEY)!;
  }

  public getTrust(): number {
    return this.getTrustVariable()!.getNum();
  }

  public deltaTrust(delta: number): void {
    this.getTrustVariable().deltaNum(delta);
  }

  private getInterestVariable(): NumVariable {
    return this.getNumVariable(GameState.INTEREST_KEY)!;
  }

  public getInterest(): number {
    return this.getInterestVariable()!.getNum();
  }

  public deltaInterest(delta: number): void {
    this.getInterestVariable().deltaNum(delta);
  }

  private getMoodVariable(): NumVariable {
    return this.getNumVariable(GameState.MOOD_KEY)!;
  }

  public getMood(): number {
    return this.getMoodVariable()!.getNum();
  }

  public deltaMood(delta: number): void {
    this.getMoodVariable().deltaNum(delta);
  }

  public getCurrentAction(): string {
    return this.getStrVariable(GameState.CURRENT_ACTION_KEY)!.getStr();
  }

  public setCurrentAction(s: string): void {
    this.getStrVariable(GameState.CURRENT_ACTION_KEY)!.setStr(s);
  }

  public getExpectResult(): string {
    return this.getStrVariable(GameState.EXPECT_RESULT_KEY)!.getStr();
  }

  public setExpectResult(s: string): void {
    this.getStrVariable(GameState.EXPECT_RESULT_KEY)!.setStr(s);
  }

  private getDatetimeVariable(): DatetimeVariable | null {
    const variable = this.state.get(GameState.DATETIME_KEY);
    if (variable instanceof DatetimeVariable) return variable;
    else return null;
  }

  public getYear(): number {
    return this.getDatetimeVariable()!.getYear();
  }

  public getMonth(): number {
    return this.getDatetimeVariable()!.getMonth();
  }

  public getDate(): number {
    return this.getDatetimeVariable()!.getDate();
  }

  public getHours(): number {
    return this.getDatetimeVariable()!.getHours();
  }

  public getMinutes(): number {
    return this.getDatetimeVariable()!.getMinutes();
  }

  public getSeconds(): number {
    return this.getDatetimeVariable()!.getSeconds();
  }

  public getDay(): number {
    return this.getDatetimeVariable()!.getDay();
  }

  public isWeekday(): boolean {
    switch (this.getDay()) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return true;
    }
    return false;
  }

  public isWeekend(): boolean {
    switch (this.getDay()) {
      case 0:
      case 6:
        return true;
    }
    return false;
  }

  public deltaMinutes(delta: number): void {
    this.getDatetimeVariable()!.deltaDatetime(0, 0, 0, 0, delta, 0);
  }

  public deltaDatetimeUntil(hour: number, minute: number): void {
    const variable = this.getDatetimeVariable()!;
    const current_hour = variable.getHours();
    const current_minute = variable.getMinutes();
    const current_total_minute = current_hour * 60 + current_minute;
    let target_total_minutes = hour * 60 + minute;
    if (current_total_minute > target_total_minutes) target_total_minutes += 1440;
    const delta_minute = target_total_minutes - current_total_minute;
    variable.deltaDatetime(0, 0, 0, 0, delta_minute, 0);
  }

  public getBigPlace(): string {
    return this.getStrVariable(GameState.BIG_PLACE_KEY)!.getStr();
  }

  public setBigPlace(s: string): void {
    this.getStrVariable(GameState.BIG_PLACE_KEY)!.setStr(s);
  }

  public getMiddlePlace(): string {
    return this.getStrVariable(GameState.MIDDLE_PLACE_KEY)!.getStr();
  }

  public setMiddlePlace(s: string): void {
    this.getStrVariable(GameState.MIDDLE_PLACE_KEY)!.setStr(s);
  }

  public getSmallPlace(): string {
    return this.getStrVariable(GameState.SMALL_PLACE_KEY)!.getStr();
  }

  public setSmallPlace(s: string): void {
    this.getStrVariable(GameState.SMALL_PLACE_KEY)!.setStr(s);
  }

  public getWeather(): string {
    return this.getStrVariable(GameState.WEATHER_KEY)!.getStr();
  }

  public setWeather(s: string): void {
    this.getStrVariable(GameState.WEATHER_KEY)!.setStr(s);
  }

  private getFlagsVariable(): MapVariable {
    return this.getMapVariable(GameState.FLAGS_KEY)!;
  }

  private getFlagBathVariable(): NumVariable {
    return this.getFlagsVariable().getVariable(GameState.FLAG_BATH_KEY) as NumVariable;
  }

  public isAlreadyBath(): boolean {
    return this.getFlagBathVariable().getNum() === 1;
  }

  public setFlagBath(already_bath: boolean): void {
    if (already_bath) this.getFlagBathVariable().deltaNum(+1);
    else this.getFlagBathVariable().deltaNum(-1);
  }

  private getShopItemsVariable(): MapVariable {
    return this.getMapVariable(GameState.SHOP_ITEMS_KEY)!;
  }

  public addShopItem(name: string, price: number, max_quantity: number | null): void {
    const item = Item.get(name);
    if (!item) return;
    const item_variable: MapVariable = new MapVariable();
    item_variable.setVariable('price', new NumVariable(null, null, price));
    if (max_quantity !== null) {
      item_variable.setVariable('max_quantity', new NumVariable(0, max_quantity, max_quantity));
    }
    const shop_items_variable = this.getShopItemsVariable();
    shop_items_variable.setVariable(item.name, item_variable);
  }

  public getShopItem(name: string) {
    const shop_items_variable = this.getShopItemsVariable();
    const item_variable = shop_items_variable.getVariable(name) as MapVariable | undefined;
    if (!item_variable) return null;
    const item = Item.get(name)!;
    const price = (item_variable.getVariable('price') as NumVariable).getNum();
    let max_quantity;
    const max_quantity_variable = item_variable.getVariable('max_quantity') as NumVariable | undefined;
    if (!max_quantity_variable) max_quantity = null;
    else max_quantity = max_quantity_variable.getNum();
    return {
      item: item,
      price: price,
      max_quantity: max_quantity,
    };
  }

  public getShopItems() {
    const shop_items_variable = this.getShopItemsVariable();
    const shop_items = [];
    for (const key of shop_items_variable.keys()) {
      shop_items.push(this.getShopItem(key)!);
    }
    return shop_items;
  }

  public getShopItemsSize(): number {
    return this.getShopItemsVariable().size;
  }

  public clearShopItems(): void {
    this.setVariable(GameState.SHOP_ITEMS_KEY, new MapVariable());
  }

  public buyShopItem(name: string, quantity: number): void {
    const shop_items_variable = this.getShopItemsVariable();
    const shop_item_variable = shop_items_variable.getVariable(name) as MapVariable | undefined;
    if (!shop_item_variable) return;
    const price = (shop_item_variable.getVariable('price') as NumVariable).getNum();
    this.deltaMoney(-price * quantity);
    const max_quantity_variable = shop_item_variable.getVariable('max_quantity') as NumVariable | undefined;
    if (max_quantity_variable) {
      max_quantity_variable.deltaNum(-quantity);
    }
    this.deltaInventory(name, quantity);
  }

  public sellShopItem(name: string, quantity: number) {
    const inventory = this.getInventory(name);
    if (!inventory) return;
    const shop_item = this.getShopItem(name)!;
    let max_quantity = shop_item.max_quantity;
    if (max_quantity !== null) max_quantity += quantity;
    this.deltaInventory(name, -quantity);
    this.deltaMoney(shop_item.price * quantity);
    this.addShopItem(name, shop_item.price, max_quantity);
  }

  private getInventoriesVariable(): MapVariable {
    return this.getMapVariable(GameState.INVENTORIES_KEY)!;
  }

  public deltaInventory(name: string, quantity: number): void {
    const inventories_variable = this.getInventoriesVariable();
    let quantity_variable = inventories_variable.getVariable(name) as NumVariable | undefined;
    if (!quantity_variable) quantity_variable = new NumVariable(0, null, quantity);
    else quantity_variable.deltaNum(quantity);
    if (quantity_variable.getNum() === 0) inventories_variable.deleteVariable(name);
    else inventories_variable.setVariable(name, quantity_variable);
  }

  public getInventory(name: string) {
    const quantity_variable = this.getInventoriesVariable().getVariable(name) as NumVariable | undefined;
    if (!quantity_variable) return null;
    const quantity = quantity_variable.getNum();
    const item = this.getItem(name)!;
    const description = item.description;
    return {
      name: name,
      description: description,
      quantity: quantity,
    };
  }

  public hasInventory(name: string): boolean {
    const item = Item.get(name);
    if (!item) return false;
    return this.getInventoriesVariable().getVariable(item.name) !== undefined;
  }

  public getInventories() {
    const inventories_variable = this.getInventoriesVariable();
    const inventories = [];
    for (const key of inventories_variable.keys()) {
      inventories.push(this.getInventory(key)!);
    }
    return inventories;
  }

  public getDinnerInventory(): string {
    if (this.hasInventory('體力食材')) return '體力食材';
    if (this.hasInventory('便當')) return '便當';
    if (this.hasInventory('食材')) return '食材';
    return '泡麵';
  }

  private getTrustROCVariable(): NumVariable {
    return this.getNumVariable(GameState.TRUST_ROC_KEY)!;
  }

  public getTrustROC(): number {
    return this.getTrustROCVariable()!.getNum();
  }

  public deltaTrustROC(delta: number): void {
    this.getTrustROCVariable().deltaNum(delta);
  }

  public resetTrustROC(): void {
    this.getTrustROCVariable().deltaNum(-this.getTrustROC());
  }

  private getInterestROCVariable(): NumVariable {
    return this.getNumVariable(GameState.INTEREST_ROC_KEY)!;
  }

  public getInterestROC(): number {
    return this.getInterestROCVariable()!.getNum();
  }

  public deltaInterestROC(delta: number): void {
    this.getInterestROCVariable().deltaNum(delta);
  }

  public resetInterestROC(): void {
    this.getInterestROCVariable().deltaNum(-this.getInterestROC());
  }

  private getMoodROCVariable(): NumVariable {
    return this.getNumVariable(GameState.MOOD_ROC_KEY)!;
  }

  public getMoodROC(): number {
    return this.getMoodROCVariable()!.getNum();
  }

  public deltaMoodROC(delta: number): void {
    this.getMoodROCVariable().deltaNum(delta);
  }

  public resetMoodROC(): void {
    this.getMoodROCVariable().deltaNum(-this.getMoodROC());
  }

  private getItemTableVariable(): MapVariable {
    return this.getMapVariable(GameState.ITEM_TABLE_KEY)!;
  }

  public createItem(name: string, description: string): void {
    const item_table_variable = this.getItemTableVariable();
    const description_variable = new StrVariable(description);
    item_table_variable.setVariable(name, description_variable);
  }

  public getItem(name: string): { description: string } | null {
    const item_table_variable = this.getItemTableVariable();
    const description_variable = item_table_variable.getVariable(name) as StrVariable;
    if (!description_variable) return null;
    const description = description_variable.getStr();
    return {
      description: description,
    };
  }

  public getItemTable(): Map<string, string> {
    const item_table_variable = this.getItemTableVariable();
    const item_table = new Map<string, string>();
    for (const name of item_table_variable.keys()) {
      const description_variable = item_table_variable.getVariable(name) as StrVariable;
      const description = description_variable.getStr();
      item_table.set(name, description);
    }
    return item_table;
  }

  public getClothing(): string {
    return this.getStrVariable(GameState.CLOTHING_KEY)!.getStr();
  }

  public setClothing(s: string): void {
    this.getStrVariable(GameState.CLOTHING_KEY)!.setStr(s);
  }

  private getSummaryTableVariable(): MapVariable {
    return this.getMapVariable(GameState.SUMMARY_TABLE_KEY)!;
  }

  public addSummary(summary: string, weighting: number): void {
    const summary_table_variable = this.getSummaryTableVariable();
    const id = summary_table_variable.size;
    const datatime_variable = this.getDatetimeVariable()!;
    const big_place = this.getBigPlace();
    const middle_place = this.getMiddlePlace();
    const small_place = this.getSmallPlace();
    const summary_variable = new MapVariable();
    summary_variable.setVariable(GameState.DATETIME_KEY, datatime_variable);
    summary_variable.setVariable(GameState.BIG_PLACE_KEY, new StrVariable(big_place));
    summary_variable.setVariable(GameState.MIDDLE_PLACE_KEY, new StrVariable(middle_place));
    summary_variable.setVariable(GameState.SMALL_PLACE_KEY, new StrVariable(small_place));
    summary_variable.setVariable(GameState.SUMMARY_KEY, new StrVariable(summary));
    summary_variable.setVariable(GameState.WEIGHTING_KEY, new NumVariable(0, 1, weighting));
    summary_table_variable.setVariable(String(id), summary_variable);
  }

  public getSummary(id: number) {
    const summary_table_variable = this.getSummaryTableVariable();
    const summary_variable = summary_table_variable.getVariable(String(id)) as MapVariable | undefined;
    if (!summary_variable) return null;
    const datetime_variable = summary_variable.getVariable(GameState.DATETIME_KEY) as DatetimeVariable;
    const datetime = datetime_variable.getDateTime();
    const big_place_variable = summary_variable.getVariable(GameState.BIG_PLACE_KEY) as StrVariable;
    const big_place = big_place_variable.getStr();
    const middle_place_variable = summary_variable.getVariable(GameState.MIDDLE_PLACE_KEY) as StrVariable;
    const middle_place = middle_place_variable.getStr();
    const small_place_variable = summary_variable.getVariable(GameState.SMALL_PLACE_KEY) as StrVariable;
    const small_place = small_place_variable.getStr();
    const summary_string_variable = summary_variable.getVariable(GameState.SUMMARY_KEY) as StrVariable;
    const summary = summary_string_variable.getStr();
    const weighting_variable = summary_variable.getVariable(GameState.WEIGHTING_KEY) as NumVariable;
    const weighting = weighting_variable.getNum();
    return {
      datetime: datetime,
      big_place: big_place,
      middle_place: middle_place,
      small_place: small_place,
      summary: summary,
      weighting: weighting,
    };
  }

  public getSummaries() {
    const summary_table_variable = this.getSummaryTableVariable();
    const summaries = [];
    for (let id = 0; id < summary_table_variable.size; id++) {
      summaries.push(this.getSummary(id));
    }
    return summaries;
  }

  public finishCurrentAction(summary: string, weighting: number): void {
    this.addSummary(summary, weighting);
    weighting = Math.trunc(weighting * 10);
    const trust_roc = this.getTrustROC();
    const interest_roc = this.getInterestROC();
    const roc_sum = Math.max(1, Math.abs(trust_roc) + Math.abs(interest_roc));
    let delta_trust = Math.trunc((trust_roc / roc_sum) * weighting);
    if (delta_trust < 0) delta_trust *= 2;
    let delta_interest = Math.trunc((interest_roc / roc_sum) * weighting);
    if (delta_interest < 0) delta_interest *= 2;
    const mood_roc = this.getMoodROC();
    let delta_mood = 0;
    if (mood_roc > 0 && mood_roc > 10 - weighting) delta_mood = 1;
    else if (mood_roc < 0 && mood_roc * 2 < weighting - 10) delta_mood = -1;
    console.log('[Action Command] weighting:', weighting);
    console.log('[Action Command] trust_roc:', trust_roc);
    console.log('[Action Command] interest_roc:', interest_roc);
    console.log('[Action Command] roc_sum:', roc_sum);
    console.log('[Action Command] delta_trust:', delta_trust);
    console.log('[Action Command] delta_interest:', delta_interest);
    console.log('[Action Command] mood_roc:', mood_roc);
    console.log('[Action Command] delta_mood:', delta_mood);
    this.deltaTrust(delta_trust);
    this.deltaInterest(delta_interest);
    this.deltaMood(delta_mood);
    this.resetTrustROC();
    this.resetInterestROC();
    this.resetMoodROC();
  }

  public handleChangeDateEvents(
    start_year: number,
    start_month: number,
    start_date: number,
    end_year: number,
    end_month: number,
    end_date: number,
  ): void {
    const normalized_start_date = new Date(start_year, start_month, start_date);
    const normalized_end_date = new Date(end_year, end_month, end_date);
    const delta_date = Math.floor(
      (normalized_end_date.getTime() - normalized_start_date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (delta_date <= 0) return;
    this.deltaMoney(+2000 * delta_date);
  }

  public isCurrentDateTimeBetween(
    start_hour: number,
    start_minute: number,
    end_hour: number,
    end_minute: number,
  ): boolean {
    const datetime_variable = this.state.get(GameState.DATETIME_KEY);
    if (!(datetime_variable instanceof DatetimeVariable)) return false;
    const current_hour = datetime_variable.getHours();
    const current_minute = datetime_variable.getMinutes();
    const current_total_minutes = current_hour * 60 + current_minute;

    const start_total_minutes = start_hour * 60 + start_minute;
    const end_total_minutes = end_hour * 60 + end_minute;

    if (start_total_minutes <= end_total_minutes) {
      // If same day
      return current_total_minutes >= start_total_minutes && current_total_minutes <= end_total_minutes;
    } else {
      // If over 00:00
      return current_total_minutes >= start_total_minutes || current_total_minutes <= end_total_minutes;
    }
  }

  public isCurrentDateTimeAtNight(): boolean {
    return this.isCurrentDateTimeBetween(19, 0, 0, 0);
  }
}
