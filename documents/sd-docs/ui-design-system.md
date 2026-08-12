# UI Design System 文件

**文件狀態**: Draft — 品牌色彩、字體、Logo 待需求方核准；未確認項目使用語意化 Token 作為佔位  
**文件版本**: 0.1.0  
**建立日期**: 2026-08-12  
**維護者**: UX  
**上游文件**: [ui-architecture.md](ui-architecture.md)、[../sow/sow.md](../sow/sow.md)  
**相關文件**: [ui-wireframes.md](ui-wireframes.md)、[responsive-accessibility-spec.md](responsive-accessibility-spec.md)、[frontend-specification.md](frontend-specification.md)

> **⚠ 假設聲明**：本文件所有色彩值（HEX/HSL）、字體名稱、間距與圓角數值均為可替換的語意化 Token 佔位值。品牌色、官方字體、Logo 使用規則與視覺資產版權須由需求方核准後更新。

---

## 目錄

1. [設計 Token](#1-設計-token)
2. [色彩系統](#2-色彩系統)
3. [字體系統](#3-字體系統)
4. [間距系統](#4-間距系統)
5. [圓角與陰影](#5-圓角與陰影)
6. [容器與斷點](#6-容器與斷點)
7. [共用元件規格](#7-共用元件規格)
8. [元件狀態規格](#8-元件狀態規格)
9. [中文內容與錯誤訊息規則](#9-中文內容與錯誤訊息規則)
10. [圖示使用規則](#10-圖示使用規則)
11. [視覺資產規則](#11-視覺資產規則)
12. [待確認事項](#12-待確認事項)

---

## 1. 設計 Token

> 所有設計值透過語意化 Token 管理，確保品牌色或數值變更時只需更新 Token 定義。

Token 命名規則：`--[類別]-[語意]-[層級]`

範例：
```css
/* ⚠ 以下為佔位值，品牌色待核准 */
--color-primary-500: #0066cc;      /* 主要品牌色（待確認） */
--color-neutral-100: #f5f5f5;
--spacing-4: 1rem;
--radius-md: 0.5rem;
```

---

## 2. 色彩系統

> **⚠ Assumption**：以下色彩為語意化佔位值，品牌主色與輔色須由需求方確認。對比值需符合 [responsive-accessibility-spec.md](responsive-accessibility-spec.md) 的 WCAG 要求（建議基準：WCAG 2.1 AA，待確認）。

### 2.1 主色（Primary）

| Token | 語意 | 佔位值（待確認） | 使用場景 |
|-------|------|----------------|---------|
| `--color-primary-700` | 深主色 | `#004c99` | Hover、Active 狀態 |
| `--color-primary-500` | 標準主色 | `#0066cc` | 主要按鈕、連結、重點 |
| `--color-primary-100` | 淺主色背景 | `#e6f0ff` | 選取狀態背景、提示背景 |

### 2.2 中性色（Neutral）

| Token | 語意 | 佔位值 | 使用場景 |
|-------|------|--------|---------|
| `--color-neutral-900` | 最深文字 | `#1a1a1a` | 主要內文 |
| `--color-neutral-700` | 次要文字 | `#4a4a4a` | 說明文字、標籤 |
| `--color-neutral-400` | 提示文字 | `#9a9a9a` | Placeholder |
| `--color-neutral-200` | 邊框 | `#d9d9d9` | 輸入框邊框、分隔線 |
| `--color-neutral-100` | 淺背景 | `#f5f5f5` | 頁面背景、卡片背景 |
| `--color-neutral-0` | 白色 | `#ffffff` | 卡片前景、浮層 |

### 2.3 語意色（Semantic）

| Token | 語意 | 佔位值 | 使用場景 |
|-------|------|--------|---------|
| `--color-success-500` | 成功 | `#1a8a4a` | 成功訊息、勾選 |
| `--color-success-100` | 成功背景 | `#e6f5ec` | 成功提示框背景 |
| `--color-error-500` | 錯誤 | `#cc2200` | 錯誤訊息、必填缺漏 |
| `--color-error-100` | 錯誤背景 | `#fce8e5` | 錯誤提示框背景 |
| `--color-warning-500` | 警告 | `#cc7700` | 警告訊息、提醒 |
| `--color-warning-100` | 警告背景 | `#fff3e0` | 警告提示框背景 |
| `--color-info-500` | 資訊 | `#0066cc` | 資訊提示（同主色，待確認是否區別） |
| `--color-info-100` | 資訊背景 | `#e6f0ff` | 資訊提示框背景 |

> 所有語意色的正常文字（≥ 4.5:1）與大型文字（≥ 3:1）對比比需依 WCAG 2.1 AA 基準驗證（建議基準，待確認）。

---

## 3. 字體系統

> **⚠ Assumption**：字體名稱與授權待需求方確認；以下為結構佔位。

### 3.1 字體 Token

| Token | 字體名稱（待確認） | 備用字體 | 使用場景 |
|-------|----------------|---------|---------|
| `--font-family-base` | `[品牌指定字體]` | `"Noto Sans TC", sans-serif` | 主要內文 |
| `--font-family-heading` | `[品牌指定字體]` | `"Noto Sans TC", sans-serif` | 標題 |
| `--font-family-mono` | `[等寬字體]` | `"Courier New", monospace` | 程式碼、ID 顯示 |

### 3.2 文字階層

| 層級 | Token | 字體大小 | 字重 | 行高 | 使用場景 |
|------|-------|---------|------|------|---------|
| H1 | `--text-h1` | `2rem (32px)` | 700 | 1.3 | 頁面主標題 |
| H2 | `--text-h2` | `1.5rem (24px)` | 600 | 1.35 | 區塊標題 |
| H3 | `--text-h3` | `1.25rem (20px)` | 600 | 1.4 | 子區塊標題 |
| Body-L | `--text-body-l` | `1.125rem (18px)` | 400 | 1.6 | 重要內文 |
| Body | `--text-body` | `1rem (16px)` | 400 | 1.6 | 一般內文 |
| Body-S | `--text-body-s` | `0.875rem (14px)` | 400 | 1.5 | 說明文字、標籤 |
| Caption | `--text-caption` | `0.75rem (12px)` | 400 | 1.5 | 圖說、輔助文字 |

> 手機版 H1 建議縮小至 1.5rem，H2 至 1.25rem（參見 [responsive-accessibility-spec.md](responsive-accessibility-spec.md)）。

---

## 4. 間距系統

採用 4px 倍數的基準間距系統：

| Token | 數值 | 使用場景 |
|-------|------|---------|
| `--spacing-1` | `0.25rem (4px)` | 最小間距、圖示與文字間距 |
| `--spacing-2` | `0.5rem (8px)` | 元素內部小間距 |
| `--spacing-3` | `0.75rem (12px)` | 元素內部中間距 |
| `--spacing-4` | `1rem (16px)` | 標準間距、表單欄位間 |
| `--spacing-6` | `1.5rem (24px)` | 區塊間距 |
| `--spacing-8` | `2rem (32px)` | 大區塊間距、頁面 section 間 |
| `--spacing-12` | `3rem (48px)` | 頁面主要區塊分隔 |
| `--spacing-16` | `4rem (64px)` | 頁面最大區塊分隔 |

---

## 5. 圓角與陰影

### 5.1 圓角 Token

| Token | 數值 | 使用場景 |
|-------|------|---------|
| `--radius-sm` | `0.25rem (4px)` | 標籤、小型元件 |
| `--radius-md` | `0.5rem (8px)` | 按鈕、輸入框 |
| `--radius-lg` | `0.75rem (12px)` | 卡片、Modal |
| `--radius-xl` | `1rem (16px)` | 大型容器 |
| `--radius-full` | `9999px` | 圓形按鈕、Chip |

### 5.2 陰影 Token

| Token | 數值 | 使用場景 |
|-------|------|---------|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.1)` | 卡片輕微浮起 |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.12)` | Dropdown、懸浮卡片 |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.15)` | Modal、浮層 |

---

## 6. 容器與斷點

> 詳細響應式斷點定義參見 [responsive-accessibility-spec.md](responsive-accessibility-spec.md)。

| 斷點名稱 | 範圍 | 容器最大寬度 |
|---------|------|------------|
| `xs`（手機） | < 480px | 100%（無容器邊界） |
| `sm`（大手機） | 480–767px | 100%，水平 padding 16px |
| `md`（平板） | 768–1023px | 100%，水平 padding 24px |
| `lg`（小桌面） | 1024–1279px | 960px |
| `xl`（桌面） | ≥ 1280px | 1200px |

---

## 7. 共用元件規格

> 以下為元件規格摘要，詳細 Wireframe 見 [ui-wireframes.md](ui-wireframes.md)。

### 7.1 Button（按鈕）

| 類型 | Token | 使用場景 |
|------|-------|---------|
| Primary | `btn-primary` | 主要行動（送出、確認） |
| Secondary | `btn-secondary` | 次要行動（取消、返回） |
| Outline | `btn-outline` | 低優先操作 |
| Destructive | `btn-destructive` | 刪除、不可回復的操作 |
| Link | `btn-link` | 文字型連結按鈕 |

**尺寸**：

| 尺寸 | 高度 | 水平 Padding | 字體大小 |
|------|------|------------|---------|
| sm | 32px | 12px | 14px |
| md（預設） | 40px | 16px | 16px |
| lg | 48px | 20px | 18px |

> 最小可點擊區域 44×44px（參見無障礙規格）。

### 7.2 Input（文字輸入框）

- 邊框：`1px solid --color-neutral-200`，Focus 改為 `2px solid --color-primary-500`
- 高度：40px（md）
- 圓角：`--radius-md`
- Placeholder：`--color-neutral-400`
- Error 狀態：邊框改為 `--color-error-500`，下方顯示錯誤訊息
- 必填標示：Label 右側加 `*`，顏色使用 `--color-error-500`

### 7.3 Select（下拉選單）

- 與 Input 相同的邊框、高度與圓角規格
- 右側顯示向下箭頭圖示
- 選項列表使用卡片陰影 `--shadow-md`

### 7.4 Checkbox / Radio

- 控制項大小：18×18px
- Focus ring：`2px solid --color-primary-500`，`2px offset`
- Label 在右側，間距 `--spacing-2`

### 7.5 Modal（對話框）

- 背景遮罩：`rgba(0,0,0,0.5)`
- 容器：`--radius-lg`，`--shadow-lg`，最大寬 560px
- 標題、內容、操作按鈕三段式佈局
- 鍵盤：開啟時 focus 鎖定在 Modal 內，`Esc` 鍵關閉
- 關閉按鈕位於右上角，有清楚的 aria-label

### 7.6 Toast（通知訊息）

- 位置：頁面右上角（桌面）/ 頁面底部（手機）
- 類型：成功、錯誤、警告、資訊
- 自動消失時間：成功 3 秒，錯誤需手動關閉
- 需有關閉按鈕

### 7.7 Table（表格）

- 水平分隔線，無垂直線
- Header 使用 `--color-neutral-100` 背景
- Hover 行使用 `--color-primary-100` 背景
- 手機版建議改為卡片式或橫向捲動

### 7.8 Pagination（分頁）

- 顯示當前頁、前後頁按鈕、第一/最後頁
- 按鈕尺寸符合 44px 最小觸控尺寸
- 當前頁有清楚的視覺標示

### 7.9 Form（表單容器）

- 欄位標籤在欄位上方
- 必填 `*` 標示在標籤右側
- 錯誤訊息在欄位下方，使用錯誤色
- 多步驟表單需有進度指示器
- 送出按鈕對齊表單最後一個欄位

### 7.10 Card（卡片）

- 背景：`--color-neutral-0`
- 邊框：`1px solid --color-neutral-200`（或僅使用陰影）
- 圓角：`--radius-lg`
- Padding：`--spacing-6`

### 7.11 Loading（載入中）

- 行內 Spinner：按鈕、小型元件
- 骨架屏（Skeleton）：列表、卡片、頁面區塊
- 全頁遮罩：重要操作提交中（防止重複操作）

---

## 8. 元件狀態規格

每個互動元件需實作以下狀態：

| 狀態 | 說明 | 視覺提示 |
|------|------|---------|
| Default | 初始狀態 | 標準外觀 |
| Hover | 滑鼠懸浮 | 顏色加深或改變背景 |
| Focus | 鍵盤或點擊聚焦 | 明顯 Focus Ring（見無障礙規格） |
| Active | 按下中 | 顏色更深或縮小效果 |
| Disabled | 不可操作 | 降低透明度（opacity 0.4-0.5），禁止滑鼠 pointer |
| Loading | 等待中 | Spinner 或骨架屏，防止操作 |
| Error | 輸入或請求錯誤 | 紅色邊框/文字，顯示錯誤訊息 |
| Success | 操作成功 | 綠色確認訊息或 Toast |
| Empty | 無資料 | 空白狀態圖示 + 說明文字 + CTA |

> Disabled 狀態需確保對比度符合標準，且不依賴色彩作為唯一辨識手段。

---

## 9. 中文內容與錯誤訊息規則

### 9.1 語氣與措詞原則

- 使用繁體中文，語氣親切、清楚，避免技術術語
- 錯誤訊息說明「發生什麼問題」及「使用者能做什麼」
- 避免使用「Error」、「Invalid」等英文詞彙呈現給使用者

### 9.2 常用錯誤訊息範本

| 情境 | 訊息文字 |
|------|---------|
| 必填欄位空白 | `此欄位為必填項目` |
| 格式不符（如 Email） | `請輸入有效的電子信箱格式，例如：user@example.com` |
| 超過字數限制 | `已超過 [N] 字元的上限` |
| 帳號或密碼錯誤 | `帳號或密碼不正確，請重新輸入` |
| 帳號鎖定 | `您的帳號已暫時鎖定，請稍後再試或聯絡客服` |
| 未授權 | `您沒有執行此操作的權限` |
| 網路逾時 | `連線逾時，請確認網路狀態後重試` |
| 伺服器錯誤 | `系統發生問題，請稍後再試` |
| 送出成功 | `您的申請已成功送出` |
| 儲存成功 | `變更已儲存` |
| 刪除確認 | `確定要刪除此項目嗎？此操作無法復原。` |
| 頁面離開警告 | `您有未儲存的變更，確定要離開嗎？` |

### 9.3 空白狀態文字

| 情境 | 訊息文字 |
|------|---------|
| 列表無資料 | `目前沒有符合條件的項目` |
| 搜尋無結果 | `找不到相關內容，請嘗試其他關鍵字` |
| 申辦紀錄空白 | `您目前尚無申辦紀錄` |

---

## 10. 圖示使用規則

> **⚠ Assumption**：圖示庫名稱與版本待需求方或開發規格確認。以下為通用原則。

- 使用 SVG 圖示（可縮放、可替換色彩）
- 裝飾性圖示加上 `aria-hidden="true"`
- 功能性圖示（無文字標籤）加上 `aria-label` 或 `title`
- 圖示尺寸：16px（行內）、20px（按鈕）、24px（獨立）
- 圖示顏色透過 CSS `currentColor` 繼承，不直接寫死顏色

---

## 11. 視覺資產規則

> **⚠ Assumption**：品牌 Logo、商標、圖片授權與配色均待需求方提供。

- Logo 須有 SVG 格式（可縮放）與 PNG 備用（透明背景）
- Header 使用 Logo 標準版，深色背景使用白色/反白版（版本待確認）
- 不使用未授權的圖片或插圖
- 圖片建議使用 WebP 格式，並提供 JPEG/PNG 備用
- 所有圖片須有 `alt` 文字（裝飾性圖片使用空 `alt=""`）

---

## 12. 待確認事項

| 項目 | 類型 | 影響範圍 |
|------|------|---------|
| 品牌主色與輔色 HEX 值 | 待確認 | 色彩 Token 全部更新 |
| 官方字體名稱與授權 | 待確認 | Font Token、字體載入方式 |
| Logo 檔案與使用規則 | 待確認 | Header、Footer、Favicon |
| WCAG 等級要求（AA 或 AAA） | 待確認 | 對比色計算 |
| 圖示庫選擇 | 待確認 | 元件圖示 |
| 是否使用 UI 框架（如 Vuetify、Element Plus） | 待確認 | 所有元件規格 |
| 動畫與過場效果需求 | 待確認 | 過場、Toast 動畫 |
| 深色模式（Dark Mode）是否需要 | 待確認 | Token 設計 |

---

**對應 WBS**：4.3（視覺系統與共用元件）  
**對應 WBS**：4.5（設計交付與開發評審）  
**下一步**：品牌色、字體與圖示庫確認後更新 Token 值；開發前與 PG 確認是否採用 UI 框架。
