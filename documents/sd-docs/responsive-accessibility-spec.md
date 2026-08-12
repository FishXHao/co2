# 響應式與無障礙規格文件

**文件狀態**: Draft — WCAG 等級基準、支援矩陣待需求方核准  
**文件版本**: 0.1.0  
**建立日期**: 2026-08-12  
**維護者**: UX / QA  
**上游文件**: [ui-architecture.md](ui-architecture.md)、[ui-design-system.md](ui-design-system.md)  
**相關文件**: [frontend-specification.md](frontend-specification.md)、[ui-wireframes.md](ui-wireframes.md)、[../test-case/frontend/README.md](../test-case/frontend/README.md)

> **⚠ 假設聲明**：WCAG 等級基準（建議 WCAG 2.1 AA）、支援的瀏覽器版本與裝置清單、螢幕閱讀器測試範圍，以及是否需要多語系支援，均待需求方核准後更新。

---

## 目錄

1. [響應式斷點](#1-響應式斷點)
2. [響應式版面行為](#2-響應式版面行為)
3. [觸控尺寸](#3-觸控尺寸)
4. [鍵盤操作與 Focus](#4-鍵盤操作與-focus)
5. [語意化 HTML](#5-語意化-html)
6. [ARIA 規格](#6-aria-規格)
7. [表單錯誤關聯](#7-表單錯誤關聯)
8. [色彩對比](#8-色彩對比)
9. [減少動畫](#9-減少動畫)
10. [支援矩陣](#10-支援矩陣)
11. [測試方法](#11-測試方法)
12. [待確認事項](#12-待確認事項)

---

## 1. 響應式斷點

| 名稱 | 範圍 | 代表裝置（假設） | CSS Media Query |
|------|------|----------------|----------------|
| `xs` | < 480px | 小型手機（如 iPhone SE） | `@media (max-width: 479px)` |
| `sm` | 480–767px | 標準手機橫向 | `@media (min-width: 480px) and (max-width: 767px)` |
| `md` | 768–1023px | 平板直向 | `@media (min-width: 768px) and (max-width: 1023px)` |
| `lg` | 1024–1279px | 平板橫向、小型筆電 | `@media (min-width: 1024px) and (max-width: 1279px)` |
| `xl` | ≥ 1280px | 桌面 | `@media (min-width: 1280px)` |

> **Assumption**：斷點數值與命名依現有技術規格 Vue 3 + Vite 前端慣例規劃，實際調整以設計核准稿為準。

---

## 2. 響應式版面行為

### 2.1 導航列（Header）

| 斷點 | 行為 |
|------|------|
| `xl` / `lg` | 完整橫向導航列，顯示所有項目 |
| `md` | 可折疊或部分顯示，依實際項目數調整 |
| `sm` / `xs` | 漢堡選單（Hamburger Menu），點擊展開垂直導航列 |

**手機版導航展開行為**：
- 覆蓋在頁面內容上方，有關閉按鈕
- 導航打開時，`body` 禁止捲動（避免背景捲動）
- 關閉導航後，focus 返回漢堡按鈕

### 2.2 頁面主要內容區

| 斷點 | 欄數 | 備註 |
|------|------|------|
| `xs` / `sm` | 1 欄 | 全寬，水平 padding 16px |
| `md` | 1–2 欄 | 依內容類型，水平 padding 24px |
| `lg` / `xl` | 多欄（依頁面） | 最大容器寬度 1200px，置中 |

### 2.3 表單版面

| 斷點 | 行為 |
|------|------|
| `xs` / `sm` | 欄位全寬，垂直排列 |
| `md` 以上 | 可 2 欄並排（依欄位性質） |

**原則**：
- 所有表單欄位在手機版必須全寬
- 相關欄位（如姓名的姓/名）可在 `md` 以上並排
- 操作按鈕在手機版置底固定或全寬顯示（依 UX 設計核准）

### 2.4 列表與卡片

| 斷點 | 行為 |
|------|------|
| `xs` / `sm` | 單欄垂直列表 |
| `md` | 2 欄卡片格式 |
| `lg` / `xl` | 2–3 欄卡片格式 |

### 2.5 表格

| 斷點 | 行為 |
|------|------|
| `lg` / `xl` | 標準橫向表格 |
| `xs` 至 `md` | 橫向捲動（`overflow-x: auto`）或轉換為卡片列表 |

### 2.6 Typography 縮放

| 元素 | 桌面 | 手機 |
|------|------|------|
| H1 | 2rem | 1.5rem |
| H2 | 1.5rem | 1.25rem |
| H3 | 1.25rem | 1.125rem |
| Body | 1rem | 1rem（不縮小） |

---

## 3. 觸控尺寸

> 依 WCAG 2.5.5（AAA）及 WCAG 2.5.8（AA Level in WCAG 2.2）建議。

| 規則 | 數值 | 說明 |
|------|------|------|
| 最小可點擊區域 | 44×44px | 按鈕、連結、圖示按鈕 |
| 最小觸控目標間距 | 8px | 相鄰可點擊元素之間 |
| 建議目標寬高 | ≥ 44×44px | 手機版所有可互動元件 |

**實作原則**：
- 若按鈕視覺尺寸小於 44px，使用 `padding` 擴大點擊區域，不改變視覺大小
- `<a>`、`<button>` 元素確保滿足最小尺寸要求
- 避免在手機版使用 hover-only 的互動模式

---

## 4. 鍵盤操作與 Focus

### 4.1 基本鍵盤操作要求

| 操作 | 鍵盤行為 |
|------|---------|
| 頁面導覽 | `Tab` 向前，`Shift+Tab` 向後 |
| 連結與按鈕 | `Enter` 觸發 |
| Checkbox / Radio | `Space` 切換 |
| Select / Dropdown | `↑↓` 選擇選項，`Enter` 確認 |
| Modal 關閉 | `Esc` 關閉 |
| Dialog/Menu 關閉 | `Esc` 關閉並返回觸發元素 |
| 表格 | `↑↓←→` 在欄位間移動（若有互動表格） |

### 4.2 Focus 順序

- Focus 順序與頁面視覺閱讀順序一致（從左到右、從上到下）
- 跳過重複導航的「跳過連結（Skip Link）」：
  ```html
  <a href="#main-content" class="skip-link">跳過導航，直接進入主要內容</a>
  ```
  Skip Link 預設在視覺上隱藏，獲得 Focus 時顯示。

### 4.3 Focus Ring（焦點指示）

- 所有可互動元件獲得 Focus 時必須有清楚的視覺指示
- 建議使用 CSS outline 方式：
  ```css
  :focus-visible {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
  ```
- 禁止使用 `outline: none` 或 `outline: 0` 而不提供替代方案
- Focus Ring 的對比度需符合 WCAG 規範（建議 3:1，待確認）

### 4.4 Focus 鎖定（Focus Trap）

以下情境需鎖定 Focus 在特定容器內：
- Modal 對話框開啟時
- 行動版導航選單開啟時

關閉後 Focus 需返回觸發該互動的元素。

---

## 5. 語意化 HTML

### 5.1 頁面結構標籤

```html
<header role="banner">         <!-- 頁首 -->
  <nav aria-label="主要導航">  <!-- 導航 -->
</header>
<main id="main-content">       <!-- 主要內容，跳過連結的目標 -->
<aside aria-label="側欄">      <!-- 側欄（如有） -->
<footer role="contentinfo">    <!-- 頁尾 -->
```

### 5.2 標題層級

- 每頁只有一個 `<h1>`，對應頁面主標題
- 標題層級不跳躍（h1 → h2 → h3，不跳至 h4）
- 視覺上的「小標題」不可只用 CSS 模擬，必須使用正確的 heading 層級

### 5.3 連結與按鈕

- 導向新頁面或錨點：使用 `<a href="...">`
- 觸發操作（送出、開啟 Modal、切換狀態）：使用 `<button type="button">` 或 `<button type="submit">`
- 禁止使用 `<div>`、`<span>` 模擬可互動元件

### 5.4 清單

- 導航項目使用 `<ul>`/`<ol>` + `<li>`
- 麵包屑使用 `<nav aria-label="麵包屑"><ol>...<ol></nav>`

---

## 6. ARIA 規格

> 優先使用原生語意 HTML，僅在原生無法達成時使用 ARIA。

### 6.1 常用 ARIA Attributes

| 情境 | ARIA 屬性 | 說明 |
|------|----------|------|
| 圖示按鈕（無文字） | `aria-label="[動作描述]"` | 如「關閉」、「搜尋」 |
| 裝飾性圖示 | `aria-hidden="true"` | 不讓螢幕閱讀器讀取 |
| 展開/收合 | `aria-expanded="true/false"` | 如漢堡選單、手風琴 |
| 彈出選單 | `aria-haspopup="true"` | 觸發 Dropdown 的按鈕 |
| 必填欄位 | `aria-required="true"` | 表單必填項目 |
| 無效欄位 | `aria-invalid="true"` | 驗證失敗的欄位 |
| 錯誤訊息關聯 | `aria-describedby="[error-id]"` | 指向錯誤訊息元素 |
| 動態內容更新 | `aria-live="polite"` | Toast、載入完成通知 |
| 重要警示 | `aria-live="assertive"` | 緊急錯誤訊息 |
| Modal | `role="dialog" aria-modal="true" aria-labelledby="[title-id]"` | 對話框 |
| 進度條 | `role="progressbar" aria-valuenow aria-valuemin aria-valuemax` | 載入進度 |
| 麵包屑當前頁 | `aria-current="page"` | 麵包屑最後一個項目 |
| 導航當前頁 | `aria-current="page"` | 導航當前選中項目 |

### 6.2 Live Region（動態內容）

```html
<!-- 成功/資訊通知（不中斷使用者） -->
<div aria-live="polite" aria-atomic="true" class="toast-container">
  <!-- Toast 內容動態插入 -->
</div>

<!-- 錯誤通知（重要，立即播報） -->
<div aria-live="assertive" role="alert">
  <!-- 錯誤訊息 -->
</div>
```

---

## 7. 表單錯誤關聯

### 7.1 表單結構規範

```html
<div class="form-field">
  <label for="email">
    電子信箱
    <span aria-hidden="true" class="required-mark">*</span>
  </label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid="true"         <!-- 驗證失敗時加入 -->
    aria-describedby="email-error email-hint"  <!-- 關聯錯誤訊息 -->
  />
  <span id="email-hint" class="field-hint">請輸入登入用的電子信箱</span>
  <span id="email-error" class="field-error" role="alert">
    <!-- 驗證失敗時顯示，平時可空或 hidden -->
    請輸入有效的電子信箱格式
  </span>
</div>
```

### 7.2 表單整體錯誤摘要

多欄位表單送出失敗時，在表單頂端顯示錯誤摘要，並以連結指向各錯誤欄位：

```html
<div role="alert" aria-labelledby="form-error-heading">
  <h3 id="form-error-heading">請修正以下錯誤後重新送出</h3>
  <ul>
    <li><a href="#email">電子信箱：請輸入有效格式</a></li>
    <li><a href="#phone">電話：此欄位為必填</a></li>
  </ul>
</div>
```

---

## 8. 色彩對比

> **Assumption**：以下基準為 WCAG 2.1 AA 建議，待需求方確認是否有更高要求（WCAG 2.1 AAA 或 WCAG 2.2）。

| 元素 | 建議最低對比比 | 說明 |
|------|--------------|------|
| 一般文字（< 18pt） | 4.5:1 | WCAG 2.1 AA |
| 大型文字（≥ 18pt / 14pt bold） | 3:1 | WCAG 2.1 AA |
| UI 元件邊框、圖示 | 3:1 | WCAG 2.1 AA |
| Focus Ring | 3:1（對相鄰顏色） | WCAG 2.1 AA |
| 停用（Disabled）狀態 | 無要求（建議 2:1 以上）| WCAG 豁免 |

**不依賴色彩傳達資訊的原則**：
- 錯誤訊息除了紅色外，還需有文字說明或圖示
- 必填欄位除了 `*` 顏色外，需在頁面說明「`*` 為必填項目」
- 成功/失敗狀態除了色彩外，需有明確文字或圖示

---

## 9. 減少動畫

尊重使用者的系統偏好設定：

```css
/* 偵測使用者是否要求減少動畫 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**適用場景**：
- 頁面過場動畫
- 元件展開/收合動畫
- Toast 淡入/淡出
- Skeleton 載入動畫
- Carousel / 輪播（需提供暫停控制項）

**不應移除的視覺反饋**：
- Focus Ring（焦點指示不屬於裝飾動畫）
- 載入 Spinner（功能性視覺提示，但可改為靜態）

---

## 10. 支援矩陣

> **⚠ Assumption**：以下為規劃假設，實際支援清單須由需求方確認。

### 10.1 瀏覽器支援（建議基準，待確認）

| 瀏覽器 | 版本 | 優先級 | 備註 |
|--------|------|--------|------|
| Chrome | 最新 2 個主版本 | P0 | — |
| Edge | 最新 2 個主版本 | P0 | 基於 Chromium |
| Firefox | 最新 2 個主版本 | P1 | — |
| Safari | 最新 2 個主版本 | P1 | macOS / iOS |
| Safari iOS | 最新 2 個主版本 | P1 | iPhone 主要瀏覽器 |
| Chrome Android | 最新 1 個主版本 | P1 | Android 主要瀏覽器 |
| IE 11 | — | 不支援 | 待確認是否需要（Assumption：不支援） |

### 10.2 裝置與解析度支援（建議基準，待確認）

| 類型 | 最小解析度 | 代表裝置（Assumption） |
|------|-----------|---------------------|
| 手機（縱向） | 360×640px | Android 入門機型 |
| 手機（縱向） | 390×844px | iPhone 14 |
| 平板（縱向） | 768×1024px | iPad |
| 桌面 | 1280×800px | 筆電最小解析度 |
| 大型桌面 | 1920×1080px | 全高清桌面 |

### 10.3 螢幕閱讀器測試範圍（建議基準，待確認）

| 螢幕閱讀器 | 平台 | 優先級 | 備註 |
|-----------|------|--------|------|
| VoiceOver + Safari | macOS / iOS | P1 | — |
| NVDA + Chrome | Windows | P1 | 免費，廣泛使用 |
| TalkBack | Android | P2 | — |
| JAWS | Windows | P2 | Assumption：視需求方要求 |

---

## 11. 測試方法

### 11.1 自動化測試工具

| 工具 | 用途 | 執行時機 |
|------|------|---------|
| axe-core / axe DevTools | 無障礙自動掃描 | 開發期間、CI |
| Lighthouse Accessibility | 評分與問題回報 | 開發期間、CI |
| WAVE | 視覺化無障礙問題 | QA 人工審查 |

> **前提**：採用哪套工具與 CI 整合方式待 PG/QA 確認。

### 11.2 手動測試清單（QA 執行）

- [ ] 僅使用鍵盤完成核心流程（登入、申辦表單）
- [ ] Focus 順序合理，無 Focus 陷阱
- [ ] Focus Ring 在所有互動元件上可見
- [ ] Skip Link 功能正常
- [ ] 螢幕閱讀器播報內容正確（VoiceOver / NVDA）
- [ ] 表單錯誤訊息被螢幕閱讀器播報
- [ ] 動態內容更新（Toast、載入完成）有 aria-live 播報
- [ ] 色彩對比符合標準（使用 Colour Contrast Analyser）
- [ ] 不依賴顏色傳達重要資訊
- [ ] 調整瀏覽器字體至 200% 後版面不破版
- [ ] `prefers-reduced-motion` 設定有效

---

## 12. 待確認事項

| 項目 | 類型 | 影響範圍 |
|------|------|---------|
| WCAG 等級要求（AA 或 AAA） | 待確認 | 對比標準、互動需求 |
| 是否需要支援 IE 11 | 待確認 | 技術選型、Polyfill |
| 確切的瀏覽器版本支援清單 | 待確認 | 測試矩陣 |
| 螢幕閱讀器測試範圍 | 待確認 | QA 測試計畫 |
| 是否需要多語系 / 右至左語言支援 | 待確認 | HTML `dir` 屬性、版面 |
| 最小支援螢幕解析度 | 待確認 | 斷點設計 |
| 政府資訊無障礙規範（如 Section 508、WCAG-EM） | 待確認 | 若客戶為政府機關 |

---

**對應 WBS**：4.4（響應式與無障礙規格）  
**對應 WBS**：7.3（E2E、響應式、相容性與無障礙測試）  
**下一步**：P0 確認支援矩陣後由 UX/QA 更新測試計畫；開發期間整合自動化無障礙掃描工具。
