import { ClassRegistry } from '@/util/class_registry';
import { GameState } from './game_state';

export abstract class Action {
  public static readonly registry = new ClassRegistry<typeof Action>();
  public static readonly NONE_STR: string = '無';

  public abstract get category(): string | null;
  public abstract get name(): string;
  public abstract start(game_state: GameState): void;
  public abstract getStartRestoreKeys(): string[];
  public abstract finish(game_state: GameState): void;
  public abstract getFinishRestoreKeys(): string[];
  public abstract isPossible(game_state: GameState): boolean;
  public abstract isForce(game_state: GameState): boolean;
}

@Action.registry.register(NormalTalkAction.prototype.name)
export class NormalTalkAction extends Action {
  private static readonly SUCCESS_STR: string = '成功提高信賴';
  private static readonly NORMAL_STR: string = '普通';

  public get category(): string | null {
    return '說話';
  }

  public get name(): string {
    return '無關緊要的話題';
  }

  public start(game_state: GameState): void {
    game_state.setCurrentAction(this.name);
    game_state.deltaStamina(-10);
    if (Math.random() < 0.33) game_state.setExpectResult(NormalTalkAction.SUCCESS_STR);
    else game_state.setExpectResult(NormalTalkAction.NORMAL_STR);
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.EXPECT_RESULT_KEY, GameState.STAMINA_KEY];
  }

  public finish(game_state: GameState): void {
    switch (game_state.getExpectResult()) {
      case NormalTalkAction.SUCCESS_STR:
        game_state.deltaTrust(+4);
        break;
      case NormalTalkAction.NORMAL_STR:
        game_state.deltaTrust(+2);
        break;
    }
    game_state.deltaMinutes(+30);
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
  }

  public getFinishRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.EXPECT_RESULT_KEY, GameState.TRUST_KEY, GameState.DATETIME_KEY];
  }

  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
    if (game_state.getStamina() < 10) return false;
    if (!game_state.isCurrentDateTimeAtNight()) return false;
    return true;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(LewdTalkAction.prototype.name)
export class LewdTalkAction extends Action {
  private static readonly SUCCESS_STR: string = '成功，提高興致';
  private static readonly NORMAL_STR: string = '普通';
  private static readonly FAIL_STR: string = '失敗，降低信賴';

  public get category(): string | null {
    return '說話';
  }
  public get name(): string {
    return '色色的話題';
  }

  public start(game_state: GameState): void {
    game_state.setCurrentAction(this.name);
    game_state.deltaStamina(-15);
    const rand = Math.random();
    if (rand < 0.25) game_state.setExpectResult(LewdTalkAction.SUCCESS_STR);
    else if (rand < 0.5) game_state.setExpectResult(LewdTalkAction.FAIL_STR);
    else game_state.setExpectResult(LewdTalkAction.NORMAL_STR);
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.EXPECT_RESULT_KEY, GameState.STAMINA_KEY];
  }

  public finish(game_state: GameState): void {
    let delta_trust = -1;
    let delta_interest = +2;
    switch (game_state.getExpectResult()) {
      case LewdTalkAction.SUCCESS_STR:
        delta_interest += 2;
        break;
      case LewdTalkAction.FAIL_STR:
        delta_trust -= 1;
        delta_interest -= 1;
        break;
    }
    game_state.deltaTrust(delta_trust);
    game_state.deltaInterest(delta_interest);
    game_state.deltaMinutes(+30);
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
  }

  public getFinishRestoreKeys(): string[] {
    return [
      GameState.TRUST_KEY,
      GameState.INTEREST_KEY,
      GameState.DATETIME_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }

  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
    if (game_state.getStamina() < 15) return false;
    if (!game_state.isCurrentDateTimeAtNight()) return false;
    return true;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(CheerTalkAction.prototype.name)
export class CheerTalkAction extends Action {
  private static readonly SUCCESS_STR: string = '成功，提高心情';
  public get category(): string | null {
    return '說話';
  }
  public get name(): string {
    return '討好';
  }

  public start(game_state: GameState): void {
    game_state.setCurrentAction(this.name);
    game_state.deltaStamina(-20);
    game_state.setExpectResult(CheerTalkAction.SUCCESS_STR);
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.STAMINA_KEY, GameState.EXPECT_RESULT_KEY];
  }

  public finish(game_state: GameState): void {
    if (game_state.getMood() <= 0) game_state.deltaMood(+1);
    game_state.deltaMinutes(+60);
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
  }

  public getFinishRestoreKeys(): string[] {
    return [GameState.MOOD_KEY, GameState.DATETIME_KEY, GameState.CURRENT_ACTION_KEY, GameState.EXPECT_RESULT_KEY];
  }

  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
    if (game_state.getStamina() < 20) return false;
    if (!game_state.isCurrentDateTimeAtNight()) return false;
    return true;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(BattlePuzzleGameAction.prototype.name)
export class BattlePuzzleGameAction extends Action {
  private static readonly SUCCESS_STR: string = '成功，提高信賴、心情';
  private static readonly NORMAL_STR: string = '普通';
  private static readonly FAIL_STR: string = '失敗，降低心情';
  public get category(): string | null {
    return '玩遊戲吧';
  }
  public get name(): string {
    return '對戰遊戲';
  }

  public start(game_state: GameState): void {
    game_state.setCurrentAction(this.name);
    game_state.deltaStamina(-20);
    const rand = Math.random();
    if (rand < 0.3) game_state.setExpectResult(BattlePuzzleGameAction.SUCCESS_STR);
    else if (rand < 0.4) game_state.setExpectResult(BattlePuzzleGameAction.FAIL_STR);
    else game_state.setExpectResult(BattlePuzzleGameAction.NORMAL_STR);
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.STAMINA_KEY, GameState.EXPECT_RESULT_KEY];
  }

  public finish(game_state: GameState): void {
    let delta_trust = +5;
    let delta_mood = 0;
    switch (game_state.getExpectResult()) {
      case BattlePuzzleGameAction.SUCCESS_STR:
        delta_trust += 4;
        delta_mood += 1;
        break;
      case BattlePuzzleGameAction.FAIL_STR:
        delta_mood -= 1;
        break;
    }
    game_state.deltaMinutes(+120);
    game_state.deltaTrust(delta_trust);
    game_state.deltaMood(delta_mood);
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
  }

  public getFinishRestoreKeys(): string[] {
    return [
      GameState.DATETIME_KEY,
      GameState.TRUST_KEY,
      GameState.MOOD_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }

  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
    if (game_state.getStamina() < 20) return false;
    if (!game_state.isCurrentDateTimeAtNight()) return false;
    return true;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(FightingGameAction.prototype.name)
export class FightingGameAction extends Action {
  private static readonly SUCCESS_STR: string = '成功，提高信賴、心情';
  private static readonly NORMAL_STR: string = '普通';
  private static readonly FAIL_STR: string = '失敗，降低心情';
  public get category(): string | null {
    return '玩遊戲吧';
  }
  public get name(): string {
    return '格鬥遊戲';
  }

  public start(game_state: GameState): void {
    game_state.setCurrentAction(this.name);
    game_state.deltaStamina(-20);
    const rand = Math.random();
    if (rand < 0.5) game_state.setExpectResult(FightingGameAction.SUCCESS_STR);
    else if (rand < 0.8) game_state.setExpectResult(FightingGameAction.FAIL_STR);
    else game_state.setExpectResult(FightingGameAction.NORMAL_STR);
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.STAMINA_KEY, GameState.EXPECT_RESULT_KEY];
  }

  public finish(game_state: GameState): void {
    let delta_trust = +3;
    let delta_mood = 0;
    switch (game_state.getExpectResult()) {
      case FightingGameAction.SUCCESS_STR:
        delta_trust += 6;
        delta_mood += 1;
        break;
      case FightingGameAction.FAIL_STR:
        delta_mood -= 1;
        break;
    }
    game_state.deltaMinutes(+120);
    game_state.deltaTrust(delta_trust);
    game_state.deltaMood(delta_mood);
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
  }

  public getFinishRestoreKeys(): string[] {
    return [
      GameState.DATETIME_KEY,
      GameState.TRUST_KEY,
      GameState.MOOD_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }

  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
    if (game_state.getStamina() < 20) return false;
    if (!game_state.isCurrentDateTimeAtNight()) return false;
    return true;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(RacingGameAction.prototype.name)
export class RacingGameAction extends Action {
  private static readonly SUCCESS_STR: string = '成功，提高信賴、心情';
  private static readonly NORMAL_STR: string = '普通';
  private static readonly FAIL_STR: string = '失敗，降低信賴、心情';
  public get category(): string | null {
    return '玩遊戲吧';
  }
  public get name(): string {
    return '競速遊戲';
  }

  public start(game_state: GameState): void {
    game_state.setCurrentAction(this.name);
    game_state.deltaStamina(-20);
    const rand = Math.random();
    if (rand < 0.7) game_state.setExpectResult(RacingGameAction.SUCCESS_STR);
    else if (rand < 0.8) game_state.setExpectResult(RacingGameAction.FAIL_STR);
    else game_state.setExpectResult(RacingGameAction.NORMAL_STR);
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.STAMINA_KEY, GameState.EXPECT_RESULT_KEY];
  }

  public finish(game_state: GameState): void {
    let delta_trust = +2;
    let delta_mood = 0;
    switch (game_state.getExpectResult()) {
      case RacingGameAction.SUCCESS_STR:
        delta_trust += 2;
        delta_mood += 1;
        break;
      case RacingGameAction.FAIL_STR:
        delta_trust -= 3;
        delta_mood -= 1;
        break;
    }
    game_state.deltaMinutes(+120);
    game_state.deltaTrust(delta_trust);
    game_state.deltaMood(delta_mood);
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
  }

  public getFinishRestoreKeys(): string[] {
    return [
      GameState.DATETIME_KEY,
      GameState.TRUST_KEY,
      GameState.MOOD_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }

  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
    if (game_state.getStamina() < 20) return false;
    if (!game_state.isCurrentDateTimeAtNight()) return false;
    return true;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(RoleplayGameAction.prototype.name)
export class RoleplayGameAction extends Action {
  private static readonly SUCCESS_STR: string = '成功，提高信賴、心情';
  private static readonly NORMAL_STR: string = '普通';
  private static readonly FAIL_STR: string = '失敗，降低信賴、心情';
  public get category(): string | null {
    return '玩遊戲吧';
  }
  public get name(): string {
    return '角色扮演遊戲';
  }

  public start(game_state: GameState): void {
    game_state.setCurrentAction(this.name);
    game_state.deltaStamina(-20);
    const rand = Math.random();
    if (rand < 0.4) game_state.setExpectResult(RoleplayGameAction.SUCCESS_STR);
    else if (rand < 0.8) game_state.setExpectResult(RoleplayGameAction.FAIL_STR);
    else game_state.setExpectResult(RoleplayGameAction.NORMAL_STR);
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.STAMINA_KEY, GameState.EXPECT_RESULT_KEY];
  }

  public finish(game_state: GameState): void {
    let delta_trust = +3;
    let delta_mood = 0;
    switch (game_state.getExpectResult()) {
      case RoleplayGameAction.SUCCESS_STR:
        delta_trust += 10;
        delta_mood += 1;
        break;
      case RoleplayGameAction.FAIL_STR:
        delta_trust -= 2;
        delta_mood -= 1;
        break;
    }
    game_state.deltaMinutes(+120);
    game_state.deltaTrust(delta_trust);
    game_state.deltaMood(delta_mood);
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
  }

  public getFinishRestoreKeys(): string[] {
    return [
      GameState.DATETIME_KEY,
      GameState.TRUST_KEY,
      GameState.MOOD_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }

  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
    if (game_state.getStamina() < 20) return false;
    if (!game_state.isCurrentDateTimeAtNight()) return false;
    return true;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(UserBathAction.prototype.name)
export class UserBathAction extends Action {
  public get category(): string | null {
    return '洗澡！';
  }
  public get name(): string {
    return '哥哥一個人洗澡';
  }

  public start(game_state: GameState): void {
    game_state.setCurrentAction(this.name);
    game_state.setSmallPlace('浴室');
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.SMALL_PLACE_KEY];
  }

  public finish(game_state: GameState): void {
    game_state.deltaStamina(+15);
    game_state.deltaMinutes(+30);
    game_state.setFlagBath(true);
    game_state.setSmallPlace('客廳');
    game_state.setCurrentAction(SisterBathAction.prototype.name);
  }

  public getFinishRestoreKeys(): string[] {
    return [
      GameState.STAMINA_KEY,
      GameState.DATETIME_KEY,
      GameState.FLAGS_KEY,
      GameState.BIG_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
    ];
  }

  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
    if (game_state.isAlreadyBath()) return false;
    if (!game_state.isCurrentDateTimeAtNight()) return false;
    return true;
  }

  public isForce(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== Action.NONE_STR) return false;
    if (game_state.isAlreadyBath()) return false;
    if (!game_state.isCurrentDateTimeBetween(21, 0, 2, 0)) return false;
    return true;
  }
}

@Action.registry.register(SisterBathAction.prototype.name)
export class SisterBathAction extends Action {
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '妹妹一個人洗澡';
  }

  public start(game_state: GameState): void {
    game_state.setCurrentAction(this.name);
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY];
  }

  public finish(game_state: GameState): void {
    game_state.deltaMinutes(+30);
    game_state.setCurrentAction(Action.NONE_STR);
  }

  public getFinishRestoreKeys(): string[] {
    return [GameState.DATETIME_KEY, GameState.CURRENT_ACTION_KEY];
  }

  public isPossible(_game_state: GameState): boolean {
    return false;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(HuntOfBraAction.prototype.name)
export class HuntOfBraAction extends Action {
  private static readonly SUCCESS_STR: string = '沒有被妹妹察覺';
  private static readonly FAIL_STR: string = '引起妹妹疑心，降低信賴';
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '偷看妹妹換下來的胸罩';
  }

  public start(game_state: GameState): void {
    game_state.setSmallPlace('更衣間');
    game_state.setCurrentAction(this.name);
    game_state.deltaStamina(-10);
    const rand = Math.random();
    if (rand < 0.1) game_state.setExpectResult(HuntOfBraAction.FAIL_STR);
    else game_state.setExpectResult(HuntOfBraAction.SUCCESS_STR);
  }

  public getStartRestoreKeys(): string[] {
    return [
      GameState.SMALL_PLACE_KEY,
      GameState.STAMINA_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }

  public finish(game_state: GameState): void {
    if (game_state.getExpectResult() === HuntOfBraAction.FAIL_STR) game_state.deltaTrust(-2);
    game_state.deltaMinutes(+30);
    game_state.setSmallPlace('客廳');
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
  }

  public getFinishRestoreKeys(): string[] {
    return [
      GameState.TRUST_KEY,
      GameState.DATETIME_KEY,
      GameState.SMALL_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }

  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== SisterBathAction.prototype.name) return false;
    return true;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(FapOnBraAction.prototype.name)
export class FapOnBraAction extends Action {
  private static readonly SUCCESS_STR: string = '成功在妹妹洗澡完畢前自慰至射精在妹妹的胸罩上，沒有被妹妹察覺';
  private static readonly FAIL_STR: string = '被妹妹發現哥哥闖進更衣間，降低信賴、心情';
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '拿妹妹的胸罩自慰';
  }

  public start(game_state: GameState): void {
    game_state.setCurrentAction(this.name);
    const rand = Math.random();
    if (rand < 0.2) game_state.setExpectResult(FapOnBraAction.FAIL_STR);
    else game_state.setExpectResult(FapOnBraAction.SUCCESS_STR);
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.EXPECT_RESULT_KEY];
  }

  public finish(game_state: GameState): void {
    let delta_trust = 0;
    let delta_mood = 0;
    switch (game_state.getExpectResult()) {
      case FapOnBraAction.SUCCESS_STR:
        delta_trust -= 1;
        break;
      case FapOnBraAction.FAIL_STR:
        if (game_state.getMood() === -2) delta_trust -= 5;
        else delta_mood -= 1;
    }
    game_state.deltaMinutes(+30);
    game_state.setSmallPlace('客廳');
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
  }

  public getFinishRestoreKeys(): string[] {
    return [
      GameState.TRUST_KEY,
      GameState.MOOD_KEY,
      GameState.DATETIME_KEY,
      GameState.SMALL_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }

  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== HuntOfBraAction.prototype.name) return false;
    return true;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(SleepAction.prototype.name)
export class SleepAction extends Action {
  private static readonly MOOD_INCREASE_STR: string = '提高心情';
  private static readonly MOOD_DECREASE_STR: string = '降低心情';
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '今天就這樣睡吧';
  }

  public start(game_state: GameState): void {
    game_state.setSmallPlace('哥哥的睡房');
    game_state.setCurrentAction(this.name);
    const rand = Math.random();
    switch (game_state.getMood()) {
      case -2:
        if (rand < 0.63) game_state.setExpectResult(SleepAction.MOOD_INCREASE_STR);
        break;
      case 1:
      case 2:
        if (rand < 0.13) game_state.setExpectResult(SleepAction.MOOD_DECREASE_STR);
    }
  }

  public getStartRestoreKeys(): string[] {
    return [GameState.SMALL_PLACE_KEY, GameState.CURRENT_ACTION_KEY, GameState.EXPECT_RESULT_KEY];
  }

  public finish(game_state: GameState): void {
    if (game_state.isCurrentDateTimeBetween(19, 0, 20, 0)) game_state.deltaStamina(+65);
    else if (game_state.isCurrentDateTimeBetween(20, 0, 21, 0)) game_state.deltaStamina(+60);
    else if (game_state.isCurrentDateTimeBetween(21, 0, 22, 0)) game_state.deltaStamina(+55);
    else if (game_state.isCurrentDateTimeBetween(22, 0, 23, 0)) game_state.deltaStamina(+50);
    else if (game_state.isCurrentDateTimeBetween(24, 0, 0, 0)) game_state.deltaStamina(+45);
    else if (game_state.isCurrentDateTimeBetween(0, 0, 1, 0)) game_state.deltaStamina(+40);
    else if (game_state.isCurrentDateTimeBetween(1, 0, 2, 0)) game_state.deltaStamina(+35);
    else if (game_state.isCurrentDateTimeBetween(2, 0, 3, 0)) game_state.deltaStamina(+30);
    else if (game_state.isCurrentDateTimeBetween(3, 0, 4, 0)) game_state.deltaStamina(+20);
    else if (game_state.isCurrentDateTimeBetween(4, 0, 5, 0)) game_state.deltaStamina(+10);
    let delta_mood = 0;
    let delta_trust = 0;
    let delta_interest = 0;
    switch (game_state.getMood()) {
      case -2:
        delta_trust -= 3;
        delta_interest -= 2;
        if (game_state.getExpectResult() === SleepAction.MOOD_INCREASE_STR) delta_mood += 1;
        break;
      case -1:
        delta_trust -= 2;
        delta_interest -= 1;
        break;
      case 0:
        delta_trust -= 1;
        delta_interest -= 1;
        break;
      case 1:
        delta_interest -= 1;
        if (game_state.getExpectResult() == SleepAction.MOOD_DECREASE_STR) delta_mood -= 1;
        break;
      case 2:
        delta_trust += 1;
        if (game_state.getExpectResult() === SleepAction.MOOD_DECREASE_STR) delta_mood -= 1;
    }
    delta_interest -= 2;
    if (game_state.getInterest() >= 200) delta_interest -= 3;
    game_state.deltaTrust(delta_trust);
    game_state.deltaInterest(delta_interest);
    game_state.deltaMood(delta_mood);
    game_state.deltaDatetimeUntil(7, 0);
    game_state.setSmallPlace('客廳');
    game_state.setCurrentAction(MorningAction.prototype.name);
    game_state.setExpectResult(Action.NONE_STR);
    game_state.setFlagBath(false);
  }

  public getFinishRestoreKeys(): string[] {
    return [
      GameState.STAMINA_KEY,
      GameState.TRUST_KEY,
      GameState.INTEREST_KEY,
      GameState.MOOD_KEY,
      GameState.DATETIME_KEY,
      GameState.SMALL_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
      GameState.FLAGS_KEY,
    ];
  }

  public isPossible(game_state: GameState): boolean {
    if (!game_state.isCurrentDateTimeAtNight()) return false;
    if (!game_state.isAlreadyBath()) return false;
    return true;
  }

  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(MorningAction.prototype.name)
export class MorningAction extends Action {
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '早上互動';
  }
  public start(game_state: GameState): void {
    game_state.setCurrentAction(MorningAction.prototype.name);
    game_state.setExpectResult(Action.NONE_STR);
  }
  public getStartRestoreKeys(): string[] {
    return [GameState.CURRENT_ACTION_KEY, GameState.EXPECT_RESULT_KEY];
  }
  public finish(game_state: GameState): void {
    if (game_state.isWeekday()) {
      game_state.deltaDatetimeUntil(8, 30);
      new SchoolAction().start(game_state);
    }
  }
  public getFinishRestoreKeys(): string[] {
    const keys: string[] = [GameState.DATETIME_KEY];
    keys.concat(new SchoolAction().getStartRestoreKeys());
    return keys;
  }
  public isPossible(_game_state: GameState): boolean {
    return false;
  }
  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(SchoolAction.prototype.name)
export class SchoolAction extends Action {
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '上學';
  }
  public start(game_state: GameState): void {
    game_state.setBigPlace('校園區');
    game_state.setMiddlePlace('校舍');
    game_state.setSmallPlace('課室');
    game_state.setCurrentAction(SchoolAction.prototype.name);
    game_state.setExpectResult(Action.NONE_STR);
  }
  public getStartRestoreKeys(): string[] {
    return [
      GameState.BIG_PLACE_KEY,
      GameState.MIDDLE_PLACE_KEY,
      GameState.SMALL_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }
  public finish(game_state: GameState): void {
    game_state.deltaDatetimeUntil(18, 0);
    new SelfBuyMealAction().start(game_state);
  }
  public getFinishRestoreKeys(): string[] {
    const keys: string[] = [GameState.DATETIME_KEY];
    keys.concat(new SelfBuyMealAction().getStartRestoreKeys());
    return keys;
  }
  public isPossible(_game_state: GameState): boolean {
    return false;
  }
  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(SelfBuyMealAction.prototype.name)
export class SelfBuyMealAction extends Action {
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '哥哥一個人購買晚餐食材';
  }
  public start(game_state: GameState): void {
    game_state.addShopItem('茶', 1000, null);
    game_state.addShopItem('玉露', 5000, null);
    game_state.addShopItem('咖啡', 1000, null);
    game_state.addShopItem('紅茶', 2000, null);
    game_state.setBigPlace('市中心');
    game_state.setMiddlePlace('商業街');
    game_state.setSmallPlace('街道');
    game_state.setCurrentAction(SelfBuyMealAction.prototype.name);
    game_state.setExpectResult(Action.NONE_STR);
  }
  public getStartRestoreKeys(): string[] {
    return [
      GameState.SHOP_ITEMS_KEY,
      GameState.BIG_PLACE_KEY,
      GameState.MIDDLE_PLACE_KEY,
      GameState.SMALL_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }
  public finish(game_state: GameState): void {
    game_state.deltaDatetimeUntil(18, 30);
    new DinnerAction().start(game_state);
  }
  public getFinishRestoreKeys(): string[] {
    const keys: string[] = [GameState.DATETIME_KEY];
    keys.concat(new DinnerAction().getStartRestoreKeys());
    return keys;
  }
  public isPossible(_game_state: GameState): boolean {
    return false;
  }
  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(BuyCupNoodleAction.prototype.name)
export class BuyCupNoodleAction extends Action {
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '把泡麵買回家';
  }
  public start(game_state: GameState): void {
    game_state.setBigPlace('市中心');
    game_state.setMiddlePlace('商業街');
    game_state.setSmallPlace('便利店');
    game_state.setCurrentAction(this.name);
    game_state.setExpectResult(Action.NONE_STR);
  }
  public getStartRestoreKeys(): string[] {
    return [
      GameState.BIG_PLACE_KEY,
      GameState.MIDDLE_PLACE_KEY,
      GameState.SMALL_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }
  public finish(game_state: GameState): void {
    game_state.deltaInventory('泡麵', +1);
    game_state.deltaDatetimeUntil(18, 30);
    new DinnerAction().start(game_state);
  }
  public getFinishRestoreKeys(): string[] {
    const keys: string[] = [GameState.INVENTORIES_KEY, GameState.DATETIME_KEY];
    keys.concat(new DinnerAction().getStartRestoreKeys());
    return keys;
  }
  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== SelfBuyMealAction.prototype.name) return false;
    return true;
  }
  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(BuyStaminaIngredientsAction.prototype.name)
export class BuyStaminaIngredientsAction extends Action {
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '把體力食材買回家 [3000元]';
  }
  public start(game_state: GameState): void {
    game_state.setBigPlace('市中心');
    game_state.setMiddlePlace('商業街');
    game_state.setSmallPlace('菜市場');
    game_state.setCurrentAction(this.name);
    game_state.setExpectResult(Action.NONE_STR);
  }
  public getStartRestoreKeys(): string[] {
    return [
      GameState.BIG_PLACE_KEY,
      GameState.MIDDLE_PLACE_KEY,
      GameState.SMALL_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }
  public finish(game_state: GameState): void {
    game_state.deltaInventory('體力食材', +1);
    game_state.deltaMoney(-3000);
    game_state.deltaDatetimeUntil(18, 30);
    new DinnerAction().start(game_state);
  }
  public getFinishRestoreKeys(): string[] {
    const keys: string[] = [GameState.INVENTORIES_KEY, GameState.MONEY_KEY, GameState.DATETIME_KEY];
    keys.concat(new DinnerAction().getStartRestoreKeys());
    return keys;
  }
  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== SelfBuyMealAction.prototype.name) return false;
    if (game_state.getMoney() < 3000) return false;
    return true;
  }
  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(BuyBentoAction.prototype.name)
export class BuyBentoAction extends Action {
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '把便當買回家 [2000元]';
  }
  public start(game_state: GameState): void {
    game_state.setBigPlace('市中心');
    game_state.setMiddlePlace('商業街');
    game_state.setSmallPlace('便當店');
    game_state.setCurrentAction(this.name);
    game_state.setExpectResult(Action.NONE_STR);
  }
  public getStartRestoreKeys(): string[] {
    return [
      GameState.BIG_PLACE_KEY,
      GameState.MIDDLE_PLACE_KEY,
      GameState.SMALL_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }
  public finish(game_state: GameState): void {
    game_state.deltaInventory('便當', +1);
    game_state.deltaMoney(-2000);
    game_state.deltaDatetimeUntil(18, 30);
    new DinnerAction().start(game_state);
  }
  public getFinishRestoreKeys(): string[] {
    const keys: string[] = [GameState.INVENTORIES_KEY, GameState.MONEY_KEY, GameState.DATETIME_KEY];
    keys.concat(new DinnerAction().getStartRestoreKeys());
    return keys;
  }
  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== SelfBuyMealAction.prototype.name) return false;
    if (game_state.getMoney() < 2000) return false;
    return true;
  }
  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(BuyCookingIngredientsAction.prototype.name)
export class BuyCookingIngredientsAction extends Action {
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '把食材買回家 [1000元]';
  }
  public start(game_state: GameState): void {
    game_state.setBigPlace('市中心');
    game_state.setMiddlePlace('商業街');
    game_state.setSmallPlace('超級市場');
    game_state.setCurrentAction(this.name);
    game_state.setExpectResult(Action.NONE_STR);
  }
  public getStartRestoreKeys(): string[] {
    return [
      GameState.BIG_PLACE_KEY,
      GameState.MIDDLE_PLACE_KEY,
      GameState.SMALL_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }
  public finish(game_state: GameState): void {
    game_state.deltaInventory('食材', +1);
    game_state.deltaMoney(-1000);
    game_state.deltaDatetimeUntil(18, 30);
    new DinnerAction().start(game_state);
  }
  public getFinishRestoreKeys(): string[] {
    const keys: string[] = [GameState.INVENTORIES_KEY, GameState.MONEY_KEY, GameState.DATETIME_KEY];
    keys.concat(new DinnerAction().getStartRestoreKeys());
    return keys;
  }
  public isPossible(game_state: GameState): boolean {
    if (game_state.getCurrentAction() !== SelfBuyMealAction.prototype.name) return false;
    if (game_state.getMoney() < 1000) return false;
    return true;
  }
  public isForce(_game_state: GameState): boolean {
    return false;
  }
}

@Action.registry.register(DinnerAction.prototype.name)
export class DinnerAction extends Action {
  private static readonly CUP_NOODLE_SUCCESS_STR: string = '食完杯麵作為晚餐，沒有特別變化';
  private static readonly CUP_NOODLE_FAIL_STR: string = '食完杯麵作為晚餐，降低妹妹心情';
  private static readonly STAMINA_INGREDIENTS_STR: string = '食完用體力食材做的晚餐';
  private static readonly BENTO_STR: string = '食完便當作為晚餐';
  private static readonly COOKING_INGREDIENTS_STR: string = '食完用食材做的晚餐';
  public get category(): string | null {
    return null;
  }
  public get name(): string {
    return '吃晚餐';
  }
  public start(game_state: GameState): void {
    const dinner_name = game_state.getDinnerInventory();
    switch (dinner_name) {
      case '體力食材':
        game_state.setExpectResult(DinnerAction.STAMINA_INGREDIENTS_STR);
        break;
      case '便當':
        game_state.setExpectResult(DinnerAction.BENTO_STR);
        break;
      case '食材':
        game_state.setExpectResult(DinnerAction.COOKING_INGREDIENTS_STR);
        break;
      case '杯麵':
        if (Math.random() < 0.5) game_state.setExpectResult(DinnerAction.CUP_NOODLE_SUCCESS_STR);
        else game_state.setExpectResult(DinnerAction.CUP_NOODLE_FAIL_STR);
        break;
    }
    game_state.clearShopItems();
    game_state.setBigPlace('住宅區');
    game_state.setMiddlePlace('家中');
    game_state.setSmallPlace('客廳');
    game_state.setCurrentAction(this.name);
  }
  public getStartRestoreKeys(): string[] {
    return [
      GameState.SHOP_ITEMS_KEY,
      GameState.BIG_PLACE_KEY,
      GameState.MIDDLE_PLACE_KEY,
      GameState.SMALL_PLACE_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }
  public finish(game_state: GameState): void {
    let dinner_inventory = '';
    let delta_stamina = 0;
    let delta_minute = 0;
    let delta_mood = 0;
    switch (game_state.getExpectResult()) {
      case DinnerAction.STAMINA_INGREDIENTS_STR:
        dinner_inventory = '體力食材';
        delta_stamina += 20;
        delta_minute += 90;
        break;
      case DinnerAction.BENTO_STR:
        dinner_inventory = '便當';
        delta_stamina += 10;
        delta_minute += 30;
        break;
      case DinnerAction.COOKING_INGREDIENTS_STR:
        dinner_inventory = '食材';
        delta_stamina += 15;
        delta_minute += 90;
        break;
      case DinnerAction.CUP_NOODLE_SUCCESS_STR:
        dinner_inventory = '泡麵';
        delta_stamina += 5;
        delta_minute += 30;
        break;
      case DinnerAction.CUP_NOODLE_FAIL_STR:
        dinner_inventory = '泡麵';
        delta_stamina += 5;
        delta_minute += 30;
        delta_mood -= 1;
    }
    game_state.deltaInventory(dinner_inventory, -1);
    game_state.deltaStamina(delta_stamina);
    game_state.deltaMinutes(delta_minute);
    game_state.deltaMood(delta_mood);
    game_state.setCurrentAction(Action.NONE_STR);
    game_state.setExpectResult(Action.NONE_STR);
  }
  public getFinishRestoreKeys(): string[] {
    return [
      GameState.INVENTORIES_KEY,
      GameState.STAMINA_KEY,
      GameState.DATETIME_KEY,
      GameState.MOOD_KEY,
      GameState.CURRENT_ACTION_KEY,
      GameState.EXPECT_RESULT_KEY,
    ];
  }
  public isPossible(_game_state: GameState): boolean {
    return false;
  }
  public isForce(_game_state: GameState): boolean {
    return false;
  }
}
