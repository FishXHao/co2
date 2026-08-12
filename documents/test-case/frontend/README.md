# 前端測試案例

## 📁 文件組織

- **[frontend-user-stories.md](frontend-user-stories.md)** - 前端 User Stories（需求定義）
- **README.md** - 本文件（測試案例格式說明、UI 驗收矩陣索引）

---

## 🎨 UI/UX Prototype 驗收索引

> 以下為 Prototype 文件與測試的對應關係，供 QA 進行 UI 驗收時參考。

### Prototype 文件連結

| 文件 | 用途 | 狀態 |
|------|------|------|
| [ui-architecture.md](../../sd-docs/ui-architecture.md) | 頁面清單、路由、角色權限矩陣 | Draft |
| [ui-wireframes.md](../../sd-docs/ui-wireframes.md) | 低保真 Wireframe、元件、狀態、操作流程 | Draft |
| [ui-design-system.md](../../sd-docs/ui-design-system.md) | Token、元件規格、錯誤訊息 | Draft |
| [responsive-accessibility-spec.md](../../sd-docs/responsive-accessibility-spec.md) | 響應式、WCAG、鍵盤/ARIA | Draft |
| [frontend-specification.md](../../sd-docs/frontend-specification.md) | Vue 3 實作規格、狀態模型 | Draft |

### Prototype Review 流程

```
UX 完成 Prototype 文件（Draft）
    ↓
設計評審（UX / SA / PG / QA / BA 共同參與）
    ↓
QA 依 ui-wireframes.md 建立 UI 驗收案例
    ↓
PG 依 frontend-specification.md 實作
    ↓
QA 依驗收矩陣執行測試
```

---

## UI Acceptance Matrix（驗收矩陣）

> 以下為初版驗收項目，開發完成後 QA 請依 [ui-wireframes.md](../../sd-docs/ui-wireframes.md) 補充詳細案例。

### 版面與響應式

| 驗收項目 | 優先級 | 備註 |
|---------|--------|------|
| 桌面（≥ 1024px）主要頁面無水平溢出 | P0 | — |
| 手機（< 768px）主要頁面無水平溢出 | P0 | — |
| 表單欄位在手機版全寬顯示 | P0 | — |
| 服務列表在手機版為單欄垂直排列 | P1 | — |
| 漢堡選單在手機版可正常展開/收合 | P1 | Assumption：若有導航 |

### 導航

| 驗收項目 | 優先級 | 備註 |
|---------|--------|------|
| Header 導航可到達所有核定頁面 | P0 | — |
| 麵包屑路徑正確呈現 | P1 | — |
| Skip Link（跳過導航）功能正常 | P1 | 無障礙要求 |
| 404 頁面有返回首頁按鈕 | P0 | — |

### 表單與互動

| 驗收項目 | 優先級 | 備註 |
|---------|--------|------|
| 必填欄位空白送出時顯示錯誤訊息 | P0 | — |
| 格式錯誤欄位有清楚的訊息說明 | P0 | — |
| 表單送出期間禁止重複點擊 | P0 | — |
| 送出成功導向結果頁 | P0 | — |
| 送出失敗顯示具體說明 | P0 | — |

### 載入與狀態

| 驗收項目 | 優先級 | 備註 |
|---------|--------|------|
| API 請求期間顯示 Loading 狀態 | P0 | — |
| 無資料時顯示空白狀態元件 | P1 | — |
| API 錯誤有使用者可操作的提示 | P0 | — |

### 無障礙（WCAG，建議基準 AA，待確認）

| 驗收項目 | 優先級 | 備註 |
|---------|--------|------|
| 僅使用鍵盤可完成核心流程 | P1 | — |
| 所有互動元件有清楚的 Focus Ring | P1 | — |
| 表單錯誤訊息被螢幕閱讀器播報 | P1 | — |
| 主要文字對比度 ≥ 4.5:1 | P1 | 待 WCAG 等級確認 |
| 圖示按鈕有 aria-label | P1 | — |

---

## 測試組織

本目錄存放所有前端相關的測試案例，分類如下：

### 測試分類

| 分類 | 說明 |
|------|------|
| **User Story 驗證** | 對應 [frontend-user-stories.md](frontend-user-stories.md) 的 Acceptance Criteria |
| **Component Test** | 共用元件（Button、Input、Modal 等）的狀態與行為 |
| **Page Test** | 各頁面的渲染、資料呈現與狀態切換 |
| **Interaction Test** | 使用者操作流程（表單填寫、送出、結果） |
| **Responsive Test** | 各斷點版面正確性（桌面/平板/手機） |
| **Accessibility Test** | 鍵盤操作、焦點順序、ARIA、對比度 |
| **API State Test** | Loading、Success、Empty、Error 各狀態 |

---

## 測試案例格式

每個測試案例應包含：

### 1. 測試標題
簡短描述測試目標

### 2. 測試場景
描述測試的情境和前置條件

### 3. 測試步驟
詳細的操作步驟（編號列表）

### 4. 預期結果
明確的驗證點和期望行為

### 5. 邊界條件
特殊情況、錯誤處理、極端值測試

## 測試案例範例

### TC-FE-001: 登入表單驗證

**測試場景**：使用者在登入頁面輸入帳號密碼

**前置條件**：
- 應用程式已啟動
- 使用者未登入

**測試步驟**：
1. 開啟登入頁面 (http://localhost:3000)
2. 輸入帳號：`admin`
3. 輸入密碼：`password123`
4. 點擊「登入」按鈕

**預期結果**：
- ✓ 顯示載入狀態
- ✓ API 請求成功 (POST /api/login)
- ✓ 顯示歡迎訊息
- ✓ 使用者名稱正確顯示

**邊界條件測試**：
- 空白帳號/密碼：顯示錯誤訊息
- 錯誤帳號密碼：顯示「帳號或密碼錯誤」
- 連續失敗 5 次：帳號鎖定提示

## 測試覆蓋目標

- [ ] User Story 驗證測試
- [ ] 組件渲染測試
- [ ] 使用者互動測試
- [ ] 表單驗證測試
- [ ] API 整合測試
- [ ] 錯誤處理測試
- [ ] 響應式設計測試
- [ ] 無障礙測試（鍵盤、ARIA、對比）
