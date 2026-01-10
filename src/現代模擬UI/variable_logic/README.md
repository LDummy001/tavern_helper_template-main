# Command System Specification

## 概述

`command.ts` 實現了一個靈活的命令系統，用於在現代模擬UI中解析和執行遊戲狀態變更命令。系統基於正則表達式解析，支持從文本中提取命令並執行相應的狀態更新操作。

## 架構

### Command 抽象基類

所有命令都繼承自 `Command` 抽象類：

```typescript
abstract class Command {
  protected abstract get REGEX(): RegExp;
  protected abstract create(args: string[]): Command;
  protected abstract isValid(): boolean;
  public abstract execute(state: State, message_id: number): State;
}
```

### 命令註冊系統

使用 `ClassRegistry` 進行命令註冊：

```typescript
@Command.registry.register()
export class SomeCommand extends Command {
  // 實現具體命令邏輯
}
```

## 命令列表

### 時間相關命令

#### `deltaMinutes(分鐘數)`

調整遊戲時間的分鐘數。

**參數：**

- `分鐘數`: number - 要增加的分鐘數

**範例：**

```text
deltaMinutes(30)
```

---

### 位置相關命令

#### `setBigLocation("大位置名稱")`

設置當前的大位置。

**參數：**

- `大位置名稱`: string - 大位置的名稱

**範例：**

```text
setBigLocation("東京")
```

#### `setMiddleLocation("中位置名稱")`

設置當前的中位置。

**參數：**

- `中位置名稱`: string - 中位置的名稱

**範例：**

```text
setMiddleLocation("澀谷區")
```

#### `setSmallLocation("小位置名稱")`

設置當前的小位置。

**參數：**

- `小位置名稱`: string - 小位置的名稱

**範例：**

```text
setSmallLocation("澀谷站")
```

#### `setWeather("天氣")`

設置當前的天氣。

**參數：**

- `天氣`: string - 天氣描述

**範例：**

```text
setWeather("晴天")
```

---

### 角色相關命令

#### `createCharacter("ID", "名稱", 年齡, "性別", "身份", "介紹", "個性", 身高, 體重, 胸圍, "罩杯", 腰圍, 臀圍, "髮型", "外貌", "服裝", 生日月份, 生日日期, "喜好", "額外資訊", 金錢, 心情, 興奮度)`

創建新角色。

**參數：**

- `ID`: string - 角色唯一識別碼
- `名稱`: string - 角色名稱
- `年齡`: number - 角色年齡
- `性別`: string - 角色性別
- `身份`: string - 角色身份
- `介紹`: string - 角色介紹
- `個性`: string - 角色個性
- `身高`: number - 身高(cm)
- `體重`: number - 體重(kg)
- `胸圍`: number - 胸圍(cm)
- `罩杯`: string - 罩杯大小
- `腰圍`: number - 腰圍(cm)
- `臀圍`: number - 臀圍(cm)
- `髮型`: string - 髮型描述
- `外貌`: string - 外貌描述
- `服裝`: string - 服裝描述
- `生日月份`: number - 生日月份(1-12)
- `生日日期`: number - 生日日期(1-31)
- `喜好`: string - 喜好描述
- `額外資訊`: string - 額外資訊
- `金錢`: number - 初始金錢
- `心情`: number - 初始心情值(0-100)
- `興奮度`: number - 初始興奮度值(0-100)

**範例：**

```text
createCharacter("alice", "Alice", 20, "女", "大學生", "一個活潑的女孩", "開朗", 165, 50, 85, "C", 60, 88, "長直髮", "可愛", "校服", 5, 15, "閱讀", "喜歡貓", 1000, 80, 20)
```

#### `deltaMoney("角色ID", 金錢變化)`

調整角色的金錢。

**參數：**

- `角色ID`: string - 目標角色ID
- `金錢變化`: number - 金錢變化量(可正可負)

**範例：**

```text
deltaMoney("alice", 500)
```

#### `deltaFriendship("來源角色ID", "目標角色ID", 友誼變化)`

調整角色間的友誼值。

**參數：**

- `來源角色ID`: string - 來源角色ID
- `目標角色ID`: string - 目標角色ID
- `友誼變化`: number - 友誼值變化量(0-100)

**範例：**

```text
deltaFriendship("alice", "bob", 10)
```

#### `deltaLove("來源角色ID", "目標角色ID", 愛情變化)`

調整角色間的愛情值。

**參數：**

- `來源角色ID`: string - 來源角色ID
- `目標角色ID`: string - 目標角色ID
- `愛情變化`: number - 愛情值變化量(0-100)

**範例：**

```text
deltaLove("alice", "bob", 5)
```

#### `deltaMood("角色ID", 心情變化)`

調整角色的心情值。

**參數：**

- `角色ID`: string - 目標角色ID
- `心情變化`: number - 心情值變化量(-100到100)

**範例：**

```text
deltaMood("alice", 15)
```

#### `deltaHorny("角色ID", 興奮度變化)`

調整角色的興奮度。

**參數：**

- `角色ID`: string - 目標角色ID
- `興奮度變化`: number - 興奮度變化量(-100到100)

**範例：**

```text
deltaHorny("alice", 20)
```

#### `setRelation("來源角色ID", "目標角色ID", "關係")`

設置角色間的關係。

**參數：**

- `來源角色ID`: string - 來源角色ID
- `目標角色ID`: string - 目標角色ID
- `關係`: string - 關係描述

**範例：**

```text
setRelation("alice", "bob", "朋友")
```

#### `setCharacterProperty("角色ID", "屬性鍵", "屬性值")`

設置角色的特定屬性。

**參數：**

- `角色ID`: string - 目標角色ID
- `屬性鍵`: string - 屬性鍵名 (支援: identity, introduction, personality, hairstyle, appearance, clothes, favourite, extra_information)
- `屬性值`: string - 新的屬性值

**範例：**

```text
setCharacterProperty("alice", "clothes", "晚禮服")
```

#### `activateCharacter("角色ID")`

激活已停用的角色。

**參數：**

- `角色ID`: string - 要激活的角色ID

**範例：**

```text
activateCharacter("alice")
```

#### `deactivateCharacter("角色ID")`

停用已激活的角色。

**參數：**

- `角色ID`: string - 要停用的角色ID

**範例：**

```text
deactivateCharacter("alice")
```

---

### 物品相關命令

#### `createItem("物品ID", "物品名稱", "物品描述", 物品價值)`

創建新物品。

**參數：**

- `物品ID`: string - 物品唯一識別碼
- `物品名稱`: string - 物品名稱
- `物品描述`: string - 物品描述
- `物品價值`: number - 物品價值

**範例：**

```text
createItem("book1", "小說書", "一本有趣的小說", 500)
```

#### `deltaInventory("角色ID", "物品ID", 數量變化)`

調整角色擁有的物品數量。

**參數：**

- `角色ID`: string - 目標角色ID
- `物品ID`: string - 物品ID
- `數量變化`: number - 數量變化量(可正可負，0以下會移除物品)

**範例：**

```text
deltaInventory("alice", "book1", 1)
```

---

### 約定相關命令

#### `createPromise(年, 月, 日, 時, 分, "角色ID列表", "地點", "描述")`

創建新約定。

**參數：**

- `年`: number - 截止年份
- `月`: number - 截止月份(1-12)
- `日`: number - 截止日期(1-31)
- `時`: number - 截止小時(0-23)
- `分`: number - 截止分鐘(0-59)
- `角色ID列表`: string - 參與角色ID，用逗號分隔
- `地點`: string - 約定地點
- `描述`: string - 約定描述

**範例：**

```text
createPromise(2024, 12, 25, 18, 30, "alice,bob", "咖啡廳", "聖誕約會")
```

#### `removePromise("約定ID")`

移除指定的約定。

**參數：**

- `約定ID`: string - 要移除的約定ID

**範例：**

```text
removePromise("promise1")
```

---

### 事件相關命令

#### `startEvent("事件名稱")`

開始一個新事件。

**參數：**

- `事件名稱`: string - 事件名稱

**範例：**

```text
startEvent("約會事件")
```

#### `finishEvent("事件摘要", 權重)`

完成當前事件並創建摘要。

**參數：**

- `事件摘要`: string - 事件摘要描述
- `權重`: number - 摘要權重(用於記憶系統)

**範例：**

```text
finishEvent("Alice和Bob進行了愉快的約會", 0.8)
```

---

## Commands 類

### 從字符串解析命令

```typescript
static fromString(s: string): Commands
```

從包含 `<VariableUpdate>` 標籤的字符串中解析命令。

**參數：**

- `s`: string - 包含命令的字符串

**返回值：**

- `Commands` - 解析出的命令集合

### 執行命令

```typescript
public execute(state: State, message_id: number): State
```

執行所有命令並更新狀態。

**參數：**

- `state`: State - 當前遊戲狀態
- `message_id`: number - 相關消息ID

**返回值：**

- `State` - 更新後的遊戲狀態

---

## 使用方式

### 在遊戲文本中使用命令

在遊戲對話或敘述中嵌入命令：

```xml
<UserPerspective>
這是一個普通的遊戲文本。

<VariableUpdate>
deltaMinutes(30)
setWeather("雨天")
deltaMood("alice", 10)
</VariableUpdate>
```

### 程式化使用

```typescript
import { Commands } from './command';

// 從字符串解析命令
const commands = Commands.fromString(gameText);

// 執行命令
const newState = commands.execute(currentState, messageId);
```

---

## 驗證規則

每個命令都有內建的驗證邏輯：

- **數值參數**: 檢查是否為有效數字
- **字串參數**: 檢查是否為非空字串
- **角色存在性**: 檢查操作的角色是否存在
- **物品存在性**: 檢查操作的物品是否存在
- **屬性鍵**: 檢查屬性鍵是否在允許列表中

無效的命令會被自動過濾，不會執行。

---

## 錯誤處理

- 無效命令會在解析階段被過濾
- 不存在的角色/物品操作會被忽略
- 所有操作都是原子的，不會部分執行

---

## 擴展新命令

要添加新命令：

1. 創建繼承 `Command` 的新類
2. 實現 `REGEX`、`create`、`isValid`、`execute` 方法
3. 使用 `@Command.registry.register()` 裝飾器註冊

```typescript
@Command.registry.register()
export class NewCommand extends Command {
  protected get REGEX(): RegExp {
    return /newCommand\(([^)]+)\)/g;
  }

  protected create(args: string[]): Command {
    // 解析參數邏輯
  }

  protected isValid(): boolean {
    // 驗證邏輯
  }

  public execute(state: State, message_id: number): State {
    // 執行邏輯
  }
}
