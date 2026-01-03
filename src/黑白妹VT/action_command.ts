import {
  AddMapCommand,
  Command,
  Commands,
  InitDatetimeCommand,
  InitMapCommand,
  InitNumCommand,
  InitStrCommand,
} from '@/VariableTracker/command';
import { State } from '@/VariableTracker/state';
import { Action } from './action';
import { GameState } from './game_state';

@Command.registry.register()
export class InitializeCommand extends Command {
  protected get REGEX(): RegExp {
    return /initialize\(\)/g;
  }
  protected create(_args: string[]): Command {
    return new InitializeCommand();
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    const commands = new Commands();
    commands.pushCommand(new InitNumCommand(GameState.STAMINA_KEY, 0, 60, 40));
    commands.pushCommand(new InitNumCommand(GameState.MONEY_KEY, 0, null, 6000));
    commands.pushCommand(new InitNumCommand(GameState.TRUST_KEY, 0, 1000, 25));
    commands.pushCommand(new InitNumCommand(GameState.INTEREST_KEY, 0, 1000, 10));
    commands.pushCommand(new InitNumCommand(GameState.MOOD_KEY, -2, 2, 0));
    commands.pushCommand(new InitDatetimeCommand(GameState.DATETIME_KEY, '2025-11-19T19:00:00'));
    commands.pushCommand(new InitStrCommand(GameState.BIG_PLACE_KEY, '住宅區'));
    commands.pushCommand(new InitStrCommand(GameState.MIDDLE_PLACE_KEY, '家中'));
    commands.pushCommand(new InitStrCommand(GameState.SMALL_PLACE_KEY, '客廳'));
    commands.pushCommand(new InitStrCommand(GameState.WEATHER_KEY, '晴朗'));
    commands.pushCommand(
      new InitStrCommand(
        GameState.CLOTHING_KEY,
        '初中生水手服，領口的鈕扣解開了，胸前鈕扣間的縫隙露出一小片屬於胸罩的白色布料',
      ),
    );
    commands.pushCommand(new InitStrCommand(GameState.CURRENT_ACTION_KEY, Action.NONE_STR));
    commands.pushCommand(new InitStrCommand(GameState.EXPECT_RESULT_KEY, Action.NONE_STR));
    commands.pushCommand(new InitMapCommand(GameState.FLAGS_KEY));
    commands.pushCommand(new InitNumCommand(GameState.FLAG_BATH_KEY, 0, 1, 0));
    commands.pushCommand(new AddMapCommand(GameState.FLAGS_KEY, GameState.FLAG_BATH_KEY));
    commands.pushCommand(new InitMapCommand(GameState.SHOP_ITEMS_KEY));
    commands.pushCommand(new InitMapCommand(GameState.INVENTORIES_KEY));
    commands.pushCommand(new InitNumCommand(GameState.TRUST_ROC_KEY, null, null, 0));
    commands.pushCommand(new InitNumCommand(GameState.INTEREST_ROC_KEY, null, null, 0));
    commands.pushCommand(new InitNumCommand(GameState.MOOD_ROC_KEY, null, null, 0));
    commands.pushCommand(new InitMapCommand(GameState.ITEM_TABLE_KEY));
    commands.pushCommand(new InitMapCommand(GameState.SUMMARY_TABLE_KEY));
    commands.execute(game_state);
    return game_state;
  }
}

@Command.registry.register()
export class StartActionCommand extends Command {
  private current_action: string;
  private expected_result: string;

  constructor(current_action: string, expected_result: string) {
    super();
    this.current_action = current_action;
    this.expected_result = expected_result;
  }
  protected get REGEX(): RegExp {
    return /actionStart\(\s*([^,()]+)\s*,\s*(.+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const current_action = args[0].slice(1, -1);
    const expected_result = args[1].slice(1, -1);
    return new StartActionCommand(current_action, expected_result);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    game_state.setCurrentAction(this.current_action);
    game_state.setExpectResult(this.expected_result);
    game_state.resetTrustROC();
    game_state.resetInterestROC();
    game_state.resetMoodROC();
    return game_state;
  }
}

@Command.registry.register()
export class FinishActionCommand extends Command {
  private summary: string;
  private weighting: number;

  constructor(summary: string, weighting: number) {
    super();
    this.summary = summary;
    this.weighting = weighting;
  }
  protected get REGEX(): RegExp {
    return /actionFinish\(\s*([^,()]+)\s*,\s*(.+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const summary: string = args[0].slice(1, -1);
    const weighting: number = Number(args[1]);
    return new FinishActionCommand(summary, weighting);
  }
  protected isValid(): boolean {
    if (isNaN(this.weighting)) return false;
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
    game_state.finishCurrentAction(this.summary, this.weighting);
    return game_state;
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
    const game_state = new GameState(state);
    const start_year = game_state.getYear();
    const start_month = game_state.getMonth();
    const start_date = game_state.getDate();
    game_state.deltaMinutes(this.delta_minutes);
    const end_year = game_state.getYear();
    const end_month = game_state.getMonth();
    const end_date = game_state.getDate();
    game_state.handleChangeDateEvents(start_year, start_month, start_date, end_year, end_month, end_date);
    return game_state;
  }
}

@Command.registry.register()
export class SetBigPlaceCommand extends Command {
  private big_place: string;
  constructor(big_place: string) {
    super();
    this.big_place = big_place;
  }
  protected get REGEX(): RegExp {
    return /setBigPlace\(\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const big_place = args[0].slice(1, -1);
    return new SetBigPlaceCommand(big_place);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    game_state.setBigPlace(this.big_place);
    return game_state;
  }
}

@Command.registry.register()
export class SetMiddlePlaceCommand extends Command {
  private middle_place: string;
  constructor(middle_place: string) {
    super();
    this.middle_place = middle_place;
  }
  protected get REGEX(): RegExp {
    return /setMiddlePlace\(\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const middle_place = args[0].slice(1, -1);
    return new SetMiddlePlaceCommand(middle_place);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    game_state.setMiddlePlace(this.middle_place);
    return game_state;
  }
}

@Command.registry.register()
export class SetSmallPlaceCommand extends Command {
  private small_place: string;
  constructor(small_place: string) {
    super();
    this.small_place = small_place;
  }
  protected get REGEX(): RegExp {
    return /setSmallPlace\(\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const small_place = args[0].slice(1, -1);
    return new SetSmallPlaceCommand(small_place);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    game_state.setSmallPlace(this.small_place);
    return game_state;
  }
}

@Command.registry.register()
export class SetWeatherCommand extends Command {
  weather: string;
  constructor(weather: string) {
    super();
    this.weather = weather;
  }
  protected get REGEX(): RegExp {
    return /setWeather\(\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const weather = args[0].slice(1, -1);
    return new SetWeatherCommand(weather);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    game_state.setWeather(this.weather);
    return game_state;
  }
}

@Command.registry.register()
export class SetClothingCommand extends Command {
  clothing: string;
  constructor(clothing: string) {
    super();
    this.clothing = clothing;
  }
  protected get REGEX(): RegExp {
    return /setClothing\(\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const clothing = args[0].slice(1, -1);
    return new SetClothingCommand(clothing);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    game_state.setClothing(this.clothing);
    return game_state;
  }
}

@Command.registry.register()
export class DeltaTrustROCCommand extends Command {
  private delta_trust_roc: number;
  constructor(delta_trust_roc: number) {
    super();
    this.delta_trust_roc = delta_trust_roc;
  }
  protected get REGEX(): RegExp {
    return /deltaTrustROC\(\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const delta_trust_roc = Number(args[0]);
    return new DeltaTrustROCCommand(delta_trust_roc);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta_trust_roc)) return false;
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    if (this.delta_trust_roc < -3) this.delta_trust_roc = -3;
    if (this.delta_trust_roc > 3) this.delta_trust_roc = 3;
    if (this.delta_trust_roc < 0) this.delta_trust_roc *= 2;
    game_state.deltaTrustROC(this.delta_trust_roc);
    return game_state;
  }
}

@Command.registry.register()
export class DeltaInterestROCCommand extends Command {
  private delta_interest_roc: number;
  constructor(delta_interest_roc: number) {
    super();
    this.delta_interest_roc = delta_interest_roc;
  }
  protected get REGEX(): RegExp {
    return /deltaInterestROC\(\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const delta_interest_roc = Number(args[0]);
    return new DeltaInterestROCCommand(delta_interest_roc);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta_interest_roc)) return false;
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    if (this.delta_interest_roc < -3) this.delta_interest_roc = -3;
    if (this.delta_interest_roc > 3) this.delta_interest_roc = 3;
    if (this.delta_interest_roc < 0) this.delta_interest_roc *= 2;
    game_state.deltaInterestROC(this.delta_interest_roc);
    return game_state;
  }
}

@Command.registry.register()
export class DeltaMoodROCCommand extends Command {
  private delta_mood_roc: number;
  constructor(delta_mood_roc: number) {
    super();
    this.delta_mood_roc = delta_mood_roc;
  }
  protected get REGEX(): RegExp {
    return /deltaMoodROC\(\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const delta_mood_roc = Number(args[0]);
    return new DeltaMoodROCCommand(delta_mood_roc);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta_mood_roc)) return false;
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    if (this.delta_mood_roc < -3) this.delta_mood_roc = -3;
    if (this.delta_mood_roc > 3) this.delta_mood_roc = 3;
    if (this.delta_mood_roc < 0) this.delta_mood_roc *= 2;
    game_state.deltaMoodROC(this.delta_mood_roc);
    return game_state;
  }
}

@Command.registry.register()
export class DeltaMoneyCommand extends Command {
  private delta_money: number;
  constructor(delta_money: number) {
    super();
    this.delta_money = delta_money;
  }
  protected get REGEX(): RegExp {
    return /deltaMoney\(\s*([^,()]+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const delta_money = Number(args[0]);
    return new DeltaMoneyCommand(delta_money);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta_money)) return false;
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    game_state.deltaMoney(this.delta_money);
    return game_state;
  }
}

@Command.registry.register()
export class CreateItemCommand extends Command {
  private name: string;
  private description: string;

  constructor(name: string, description: string) {
    super();
    this.name = name;
    this.description = description;
  }
  protected get REGEX(): RegExp {
    return /createItem\(\s*([^,()]+)\s*,\s*(.+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const name: string = args[0].slice(1, -1);
    const description: string = args[1].slice(1, -1);
    return new CreateItemCommand(name, description);
  }
  protected isValid(): boolean {
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    game_state.createItem(this.name, this.description);
    return game_state;
  }
}

@Command.registry.register()
export class deltaInventoryCommand extends Command {
  private name: string;
  private delta_quantity: number;

  constructor(name: string, delta_quantity: number) {
    super();
    this.name = name;
    this.delta_quantity = delta_quantity;
  }
  protected get REGEX(): RegExp {
    return /deltaInventory\(\s*([^,()]+)\s*,\s*(.+)\s*\)/g;
  }
  protected create(args: string[]): Command {
    const name: string = args[0].slice(1, -1);
    const delta_quantity: number = Number(args[1]);
    return new deltaInventoryCommand(name, delta_quantity);
  }
  protected isValid(): boolean {
    if (isNaN(this.delta_quantity)) return false;
    return true;
  }
  public execute(state: State): State {
    const game_state = new GameState(state);
    game_state.deltaInventory(this.name, this.delta_quantity);
    return game_state;
  }
}
