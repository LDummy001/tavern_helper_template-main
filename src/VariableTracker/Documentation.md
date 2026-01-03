# VariableTracker 詳細技術文檔

本文檔詳細說明 VariableTracker 中所有變數類型和命令的定義、屬性及用法。所有命令需嵌入在 `<VTC>...</VTC>` 標籤中，並在聊天訊息中使用。

## 系統架構

VariableTracker 使用裝飾器和註冊表系統實現動態類型管理和命令解析：

- **ClassRegistry**: 泛型類型註冊表系統
- **裝飾器註冊**: 使用 `@registry.register()` 自動註冊類型
- **命令解析**: 正則表達式匹配和工廠模式創建
- **狀態管理**: Map-based 變數存儲和持久化
- **隨機系統**: 權重隨機抽取和 PostCommand 機制

## 變數類型系統

### Variable 抽象基類

所有變數類型都繼承自 `Variable` 抽象類：

```typescript
export abstract class Variable {
  public abstract get TYPE(): string;
  protected abstract fromObject(obj: Record<string, any>): Variable | null;
  public abstract getValue(): Record<string, any>;

  public static readonly registry = new ClassRegistry<typeof Variable>();
}
```

**註冊機制**：使用裝飾器自動註冊到全域註冊表：

```typescript
@Variable.registry.register(NumVariable.prototype.TYPE)
export class NumVariable extends Variable { ... }
```

### NumVariable (數值變數)

**定義**：表示一個數值變數，可設定最小值 (low) 和最大值 (high)，並支援增量修改。

**屬性**：

- `low`: number | null - 最小值限制 (null 表示無限制)
- `high`: number | null - 最大值限制 (null 表示無限制)
- `num`: number - 當前數值

**方法**：

- `deltaLow(delta: number | null)`: 修改最小值限制
- `deltaHigh(delta: number | null)`: 修改最大值限制
- `deltaNum(delta: number)`: 增量修改數值（自動應用限制）

**約束邏輯**：

```typescript
private applyConstrain(): void {
  if (this.low !== null && this.num < this.low) this.num = this.low;
  if (this.high !== null && this.num > this.high) this.num = this.high;
}
```

**用法範例**：

- 初始化：`<VTC>init_num(health, 0, 100, 80)</VTC>`
- 增量：`<VTC>delta_num(health, -20)</VTC>`
- 調整限制：`<VTC>delta_low(health, 10)</VTC>` 或 `<VTC>delta_high(health, null)</VTC>`

### StrVariable (字串變數)

**定義**：表示一個字串變數，用於儲存文字資料。

**屬性**：

- `str`: string - 當前字串值

**方法**：

- `setStr(str: string)`: 設定新的字串值

**註冊裝飾器**：

```typescript
@Variable.registry.register(StrVariable.prototype.TYPE)
export class StrVariable extends Variable { ... }
```

**用法範例**：

- 初始化：`<VTC>init_str(name, "Alice")</VTC>`
- 修改：`<VTC>set_str(name, "Bob")</VTC>`

### DatetimeVariable (日期時間變數)

**定義**：表示一個日期時間變數，支援日期和時間的增量調整。

**屬性**：

- `datetime`: Date - 當前日期時間物件

**方法**：

- `deltaDatetime(delta_year, delta_month, delta_date, delta_hour, delta_minute, delta_second)`: 增量調整所有時間單位

**時間調整邏輯**：

```typescript
public deltaDatetime(...deltas: number[]): void {
  this.datetime.setFullYear(this.datetime.getFullYear() + deltas[0]);
  this.datetime.setMonth(this.datetime.getMonth() + deltas[1]);
  this.datetime.setDate(this.datetime.getDate() + deltas[2]);
  this.datetime.setHours(this.datetime.getHours() + deltas[3]);
  this.datetime.setMinutes(this.datetime.getMinutes() + deltas[4]);
  this.datetime.setSeconds(this.datetime.getSeconds() + deltas[5]);
}
```

**註冊裝飾器**：

```typescript
@Variable.registry.register(DatetimeVariable.prototype.TYPE)
export class DatetimeVariable extends Variable { ... }
```

**用法範例**：

- 初始化：`<VTC>init_datetime(current_time, "2023-01-01T12:00:00")</VTC>`
- 完整調整：`<VTC>delta_datetime(current_time, 1, 0, 0, 0, 0, 0)</VTC>`
- 單項調整：`<VTC>delta_year(current_time, 2)</VTC>`

### RandomVariable (隨機變數)

**定義**：表示一個隨機變數，支援權重隨機抽取事件。

**屬性**：

- `outcome`: any - 當前抽取結果 (初始為 null)
- `random_events`: RandomEvent[] - 隨機事件列表

**RandomEvent 結構**：

```typescript
type RandomEvent = {
  event: any;        // 事件值
  weighting: number; // 權重 (必須 > 0)
};
```

**方法**：

- `roll()`: 根據權重隨機抽取一個事件並設為 outcome

**隨機抽取邏輯**：

```typescript
export function select(random_events: RandomEvent[]) {
  let total_weight = 0;
  for (const random_event of random_events) {
    total_weight += random_event.weighting;
  }
  let random = Math.random() * total_weight;
  for (const random_event of random_events) {
    random -= random_event.weighting;
    if (random <= 0) return random_event.event;
  }
  return random_events[-1].event;
}
```

**註冊裝飾器**：

```typescript
@Variable.registry.register(RandomVariable.prototype.TYPE)
export class RandomVariable extends Variable { ... }
```

**用法範例**：

- 初始化：`<VTC>init_random(weather, sunny:3, rainy:1, cloudy:2)</VTC>`
- 抽取：`<VTC>roll(weather)</VTC>`

## 命令系統架構

### Command 抽象基類

所有命令都繼承自 `Command` 抽象類：

```typescript
export abstract class Command {
  protected abstract get REGEX(): RegExp;
  protected abstract create(args: string[]): Command;
  protected abstract isValid(): boolean;
  public abstract execute(state: State): State;

  public static readonly registry = new ClassRegistry<typeof Command>();

  public static parseString(s: string | undefined): { command: Command; index: number }[] {
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
```

### Commands 容器類

負責解析 `<VTC>...</VTC>` 標籤內的命令：

```typescript
export class Commands {
  private commands: Command[] = [];

  static fromString(s: string, mode: 'normal' | 'post' = 'normal'): Commands {
    const matches = [...s.matchAll(/<VTC>([\s\S]*?)<\/VTC>/g)];
    const command_string = Array.from(matches, m => m[1])[0];
    // 遍歷所有已註冊的命令類型進行解析
    // 根據 mode 過濾 PostCommand 或普通 Command
    // 按索引排序確保執行順序
  }

  public execute(state: State): State {
    for (const command of this.commands) {
      command.execute(state);
    }
    return state;
  }
}
```

**PostCommand 機制**：

```typescript
export abstract class PostCommand extends Command {
  public abstract getRestoreKeys(): string[];
}
```

PostCommand 用於需要在狀態回溯時恢復的命令（如隨機抽取），它們會記錄需要恢復的變數鍵，以便在編輯訊息時正確還原狀態。

### 裝飾器註冊

所有命令類型都使用裝飾器自動註冊：

```typescript
@Command.registry.register()
export class InitNumCommand extends Command { ... }
```

### InitNumCommand

**語法**：`init_num(key, low, high, num)`

**參數**：

- `key`: string - 變數鍵名
- `low`: number | 'null' - 最小值 (字串 'null' 表示無限制)
- `high`: number | 'null' - 最大值 (字串 'null' 表示無限制)
- `num`: number - 初始數值

**驗證**：low 和 high 必須為有效數字或 'null'，num 必須為數字，且 low <= high (如果都非 null)。

**執行**：創建新的 NumVariable 並儲存到狀態。

### DeltaNumCommand

**語法**：`delta_num(key, delta)`

**參數**：

- `key`: string - 變數鍵名
- `delta`: number - 增量值

**驗證**：delta 必須為有效數字。

**執行**：對指定 NumVariable 呼叫 deltaNum(delta)。

### DeltaLowCommand

**語法**：`delta_low(key, delta)`

**參數**：

- `key`: string - 變數鍵名
- `delta`: number | 'null' - 最小值增量 (字串 'null' 清除限制)

**驗證**：delta 必須為有效數字或 'null'。

**執行**：對指定 NumVariable 呼叫 deltaLow(delta)。

### DeltaHighCommand

**語法**：`delta_high(key, delta)`

**參數**：

- `key`: string - 變數鍵名
- `delta`: number | 'null' - 最大值增量 (字串 'null' 清除限制)

**驗證**：delta 必須為有效數字或 'null'。

**執行**：對指定 NumVariable 呼叫 deltaHigh(delta)。

### InitStrCommand

**語法**：`init_str(key, str)`

**參數**：

- `key`: string - 變數鍵名
- `str`: string - 初始字串

**驗證**：無特殊驗證。

**執行**：創建新的 StrVariable 並儲存到狀態。

### SetStrCommand

**語法**：`set_str(key, str)`

**參數**：

- `key`: string - 變數鍵名
- `str`: string - 新字串

**驗證**：無特殊驗證。

**執行**：對指定 StrVariable 呼叫 setStr(str)。

### InitDatetimeCommand

**語法**：`init_datetime(key, datetime_string)`

**參數**：

- `key`: string - 變數鍵名
- `datetime_string`: string - 日期時間字串 (需為有效 Date 格式)

**驗證**：datetime_string 必須能解析為有效 Date。

**執行**：創建新的 DatetimeVariable 並儲存到狀態。

### DeltaDatetimeCommand

**語法**：`delta_datetime(key, delta_year, delta_month, delta_date, delta_hour, delta_minute, delta_second)`

**參數**：

- `key`: string - 變數鍵名
- `delta_year`: number - 年增量
- `delta_month`: number - 月增量
- `delta_date`: number - 日增量
- `delta_hour`: number - 小時增量
- `delta_minute`: number - 分鐘增量
- `delta_second`: number - 秒增量

**驗證**：所有 delta 必須為有效數字。

**執行**：對指定 DatetimeVariable 呼叫 deltaDatetime(...)。

### DeltaDatetimeSingleArgCommand

**語法**：`delta_year(key, delta)`, `delta_month(key, delta)`, `delta_date(key, delta)`, `delta_hour(key, delta)`, `delta_minute(key, delta)`, `delta_second(key, delta)`

**參數**：

- `key`: string - 變數鍵名
- `delta`: number - 增量值

**驗證**：delta 必須為有效數字。

**執行**：對指定 DatetimeVariable 呼叫 deltaDatetime，僅修改對應部分，其他為 0。

### InitRandomCommand

**語法**：`init_random(key, event1:weight1, event2:weight2, ...)`

**參數**：

- `key`: string - 變數鍵名
- `event1:weight1, event2:weight2, ...`: 逗號分隔的事件和權重對

**驗證**：所有權重必須為有效正數。

**執行**：解析事件權重對，創建新的 RandomVariable 並儲存到狀態。

**範例**：`init_random(weather, sunny:3, rainy:1, cloudy:2)`

### RollCommand

**語法**：`roll(key)`

**參數**：

- `key`: string - 隨機變數鍵名

**驗證**：無特殊驗證。

**執行**：對指定 RandomVariable 呼叫 roll() 方法進行隨機抽取。

**特殊性**：這是一個 PostCommand，會在正常命令執行後執行，並且會記錄需要恢復的鍵以便狀態回溯。

### DeleteCommand

**語法**：`delete(key)`

**參數**：

- `key`: string - 要刪除的變數鍵名

**驗證**：無特殊驗證。

**執行**：從狀態中完全移除指定變數。

**注意**：刪除操作不可逆，變數一旦刪除就無法恢復。

## 狀態管理系統

### State 類

負責管理所有變數的狀態：

```typescript
export class State {
  private state: Map<string, Variable>;

  static fromVariables(variables: Record<string, any> | null): State {
    const state = new State();
    if (variables === null) return state;
    for (const [key, variable_record] of Object.entries(variables)) {
      const variable = Variable.registry.get(variable_record.type)?.fromObject(variable_record.values);
      if (variable) state.setVariable(key, variable);
    }
    return state;
  }

  public toVariables(): Record<string, any> {
    const variables: Record<string, any> = {};
    for (const [key, variable] of this.state) {
      variables[key] = {
        type: variable.TYPE,
        values: variable.getValue(),
      };
    }
    return variables;
  }

  public getVariable(key: string): Variable | null {
    return this.state.get(key) ?? null;
  }

  public setVariable(key: string, variable: Variable): void {
    this.state.set(key, variable);
  }
}
```

### 持久化機制

- **存儲位置**：使用 `getVariables({ type: 'chat' })` 存儲
- **資料結構**：

  ```typescript
  {
    current: State.toVariables(),     // 當前狀態
    history: {                        // 歷史記錄
      [messageId]: {
        [swipeId]: State.toVariables()
      }
    }
  }
  ```

### 事件處理流程

1. **MESSAGE_SENT**: 用戶發送訊息時執行普通命令，然後執行 PostCommand（如隨機抽取）並保存歷史
2. **MESSAGE_RECEIVED**: AI 回覆時執行普通命令並保存歷史
3. **MESSAGE_UPDATED**: 重新處理受影響的訊息範圍，包括 PostCommand 的狀態恢復
4. **MESSAGE_SWIPED**: 切換到對應的歷史狀態，自動恢復 PostCommand 結果
5. **MESSAGE_DELETED**: 清理相關歷史記錄，包括 PostCommand 歷史

### 狀態同步邏輯

- **增量更新**：每次命令執行都會更新當前狀態
- **PostCommand 處理**：隨機命令等 PostCommand 會在普通命令後執行，並記錄恢復鍵
- **歷史保存**：每個訊息的每個 swipe 都會保存狀態快照，包括 PostCommand 結果
- **重新處理**：編輯訊息時會重新執行受影響範圍內的所有命令，PostCommand 會正確恢復
- **狀態恢復**：切換 swipe 時會恢復對應的歷史狀態，包含 PostCommand 的隨機結果

## 技術細節

### ClassRegistry 系統

```typescript
export class ClassRegistry<T extends Class> {
  private registry: Map<string, T> = new Map();

  public register(key?: string) {
    return (cls: T) => {
      if (!key) key = cls.name;
      this.registry.set(key, cls);
      return cls as any;
    };
  }

  public get(key: string) {
    return this.registry.get(key);
  }

  public getAll() {
    return this.registry;
  }
}
```

**裝飾器使用**：

```typescript
@Variable.registry.register(NumVariable.prototype.TYPE)
export class NumVariable extends Variable {
  public get TYPE(): string { return 'num'; }
  // ...
}
```

### 命令解析流程

1. **標籤提取**：使用 `/<VTC>([\s\S]*?)<\/VTC>/g` 提取命令字串
2. **模式過濾**：根據模式 ('normal' 或 'post') 過濾命令類型
   - `normal`: 排除 PostCommand（如隨機抽取）
   - `post`: 只包含 PostCommand
3. **類型遍歷**：遍歷過濾後的已註冊命令類型
4. **正則匹配**：每個命令類型使用自己的 REGEX 進行匹配
5. **實例創建**：匹配成功後使用 `create()` 方法創建命令實例
6. **驗證過濾**：只保留 `isValid()` 為 true 的命令
7. **排序執行**：按在原始字串中的索引排序後執行

### 錯誤處理

- **無效命令**：記錄警告但不中斷執行
- **不存在變數**：記錄警告，跳過相關命令
- **類型不匹配**：記錄警告，跳過相關命令
- **解析錯誤**：記錄錯誤，繼續處理其他命令

## 注意事項

- 命令解析按索引排序執行，確保複雜命令的正確順序
- 如果變數不存在或類型不匹配，相關命令將被忽略並記錄警告
- 所有操作都會記錄詳細日誌，方便調試和追蹤
- 系統設計為容錯性強，即使部分命令失敗也不會影響整體功能
- 狀態同步依賴於 SillyTavern 的事件系統，確保訊息編輯和刪除時的正確性
