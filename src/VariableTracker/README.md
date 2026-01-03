# VariableTracker

VariableTracker 是一個專為 SillyTavern（酒館）設計的腳本模組，用於在聊天過程中追蹤和管理自定義變數。

## 主要功能

- **變數管理**：支援數值、字串和日期時間變數
- **命令解析**：從聊天訊息中解析 `<VTC>...</VTC>` 標籤內的命令
- **狀態追蹤**：自動同步變數狀態，支援歷史記錄
- **事件驅動**：監聽酒館事件，自動更新變數
- **調試工具**：提供清除和重新載入變數的按鈕

## 支援的變數類型

- **NumVariable**：數值變數，可設定低/高限制，支援增量修改
- **StrVariable**：字串變數，支援初始化和設定
- **DatetimeVariable**：日期時間變數，支援初始化和增量調整
- **RandomVariable**：隨機變數，支援權重隨機抽取

## 命令語法

命令需嵌入在 `<VTC>...</VTC>` 標籤中，例如：

- 初始化數值：`<VTC>init_num(health, 0, 100, 50)</VTC>`
- 修改數值：`<VTC>delta_num(health, -10)</VTC>`
- 初始化字串：`<VTC>init_str(name, "Alice")</VTC>`
- 設定字串：`<VTC>set_str(name, "Bob")</VTC>`
- 初始化日期時間：`<VTC>init_datetime(date, "2023-01-01T00:00:00")</VTC>`
- 修改日期時間：`<VTC>delta_year(date, 1)</VTC>`
- 初始化隨機變數：`<VTC>init_random(weather, sunny:3, rainy:1, cloudy:2)</VTC>`
- 隨機抽取：`<VTC>roll(weather)</VTC>`
- 刪除變數：`<VTC>delete(variable_name)</VTC>`

## 使用說明

1. 將 `index.ts` 載入到酒館助手腳本中
2. 在聊天訊息中使用上述命令語法
3. 變數將自動儲存在聊天變數中，並在事件觸發時更新

## 範例

在訊息中輸入：`<VTC>init_num(health, 0, 100, 80)</VTC>` 初始化健康值為 80，範圍 0-100。

然後輸入：`<VTC>delta_num(health, -20)</VTC>` 將健康值減少 20，結果為 60。

隨機變數範例：`<VTC>init_random(weather, sunny:3, rainy:1, cloudy:2)</VTC>` 初始化天氣變數，陽天權重 3，雨天權重 1，多雲權重 2。

然後輸入：`<VTC>roll(weather)</VTC>` 隨機抽取天氣結果。

刪除變數範例：`<VTC>delete(health)</VTC>` 刪除名為 health 的變數。

## 注意事項

- 命令解析使用正則表達式，確保語法正確
- 變數狀態與訊息歷史綁定，支援變體和刪除操作
- 與 MVU 變數框架不同，此系統專注於聊天級別變數

## 詳細文檔

詳細的技術文檔請參考 `Documentation.md`。
