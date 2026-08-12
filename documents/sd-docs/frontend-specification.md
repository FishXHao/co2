# 前端實作規格文件

**文件狀態**: Draft — 依 SOW/WBS 4.5 設計交付規格，套件與路由依現有 architecture.md 與 technical-spec.md  
**文件版本**: 0.1.0  
**建立日期**: 2026-08-12  
**維護者**: SA / PG  
**上游文件**: [architecture.md](architecture.md)、[technical-spec.md](technical-spec.md)、[ui-architecture.md](ui-architecture.md)、[ui-design-system.md](ui-design-system.md)  
**相關文件**: [responsive-accessibility-spec.md](responsive-accessibility-spec.md)、[ui-wireframes.md](ui-wireframes.md)、[../api-docs/swagger.json](../api-docs/swagger.json)、[../../documents/test-case/frontend/README.md](../test-case/frontend/README.md)

> **⚠ 假設聲明**：套件版本、路由清單、Pinia Store 分割與 API 服務端點均依現有技術規格假設。規劃中的套件（vue-router、pinia、axios）標示「規劃中」，採用前需確認版本相容性。

---

## 目錄

1. [前端目錄與模組結構](#1-前端目錄與模組結構)
2. [Vue Router 路由規格](#2-vue-router-路由規格)
3. [Pinia 狀態管理規格](#3-pinia-狀態管理規格)
4. [API Service 層規格](#4-api-service-層規格)
5. [表單驗證規格](#5-表單驗證規格)
6. [UI 狀態模型](#6-ui-狀態模型)
7. [認證與 Token 處理](#7-認證與-token-處理)
8. [環境變數與建置設定](#8-環境變數與建置設定)
9. [SEO 與 Meta 規格](#9-seo-與-meta-規格)
10. [響應式實作規則](#10-響應式實作規則)
11. [元件命名與程式碼規範](#11-元件命名與程式碼規範)
12. [測試交接規格](#12-測試交接規格)
13. [待確認事項](#13-待確認事項)

---

## 1. 前端目錄與模組結構

```
src/
├── main.js                  # 應用程式入口，掛載 Vue App
├── App.vue                  # 根元件（Router View + 全域 Layout）
│
├── router/
│   └── index.js             # Vue Router 路由定義與守衛（規劃中）
│
├── stores/                  # Pinia Stores（規劃中）
│   ├── auth.js              # 認證狀態（Token/Session）
│   ├── user.js              # 使用者資訊
│   └── ui.js                # 全域 UI 狀態（Toast、Loading）
│
├── services/                # API 請求服務層
│   ├── api.js               # Axios 實例與攔截器（規劃中）
│   ├── auth.service.js      # 認證相關 API（規劃中）
│   └── services.service.js  # 服務項目相關 API（規劃中）
│
├── composables/             # 可重用 Composition API 邏輯
│   ├── useAuth.js           # 認證邏輯（規劃中）
│   ├── useFormValidation.js # 表單驗證邏輯（規劃中）
│   └── useApiState.js       # API 請求狀態管理（規劃中）
│
├── views/                   # 頁面級元件（對應路由）
│   ├── HomeView.vue
│   ├── ServiceListView.vue
│   ├── ServiceDetailView.vue
│   ├── ApplyView.vue         # C：條件式，待確認
│   ├── ApplyResultView.vue   # C：條件式，待確認
│   ├── LoginView.vue         # C：條件式，待確認
│   ├── AccountView.vue       # C：條件式，待確認
│   └── error/
│       ├── NotFoundView.vue
│       ├── ForbiddenView.vue
│       └── ServerErrorView.vue
│
├── components/              # 共用元件
│   ├── layout/
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── AppBreadcrumb.vue
│   │   └── AppSkipLink.vue
│   ├── ui/
│   │   ├── AppButton.vue
│   │   ├── AppInput.vue
│   │   ├── AppSelect.vue
│   │   ├── AppModal.vue
│   │   ├── AppToast.vue
│   │   ├── AppSpinner.vue
│   │   ├── AppSkeleton.vue
│   │   └── AppEmptyState.vue
│   └── service/
│       ├── ServiceCard.vue
│       └── ServiceSteps.vue
│
└── assets/
    ├── styles/
    │   ├── tokens.css       # CSS 自訂屬性（Design Tokens）
    │   ├── global.css       # 全域重置與基礎樣式
    │   └── utilities.css    # 工具類別（若需要）
    └── images/              # 靜態圖片資產
```

### 1.1 模組責任說明

| 層級 | 目錄 | 責任 | 命名規則 |
|------|------|------|---------|
| 頁面 | `views/` | 路由對應、組合元件與資料取得 | `[Name]View.vue` |
| 元件 | `components/` | 可重用 UI 元件，不直接呼叫 API | `App[Name].vue`（共用）、功能前綴（專用） |
| 狀態 | `stores/` | 全域狀態，透過 Pinia 管理 | `[domain].js` |
| 服務 | `services/` | API 呼叫，統一錯誤處理 | `[domain].service.js` |
| 邏輯 | `composables/` | 跨元件可重用邏輯 | `use[Name].js` |

---

## 2. Vue Router 路由規格

> **前提**：`vue-router ^4.x` 規劃中，採用前確認版本與安裝。

### 2.1 路由定義（假設）

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/services',
    name: 'service-list',
    component: () => import('@/views/ServiceListView.vue')
  },
  {
    path: '/services/:id',
    name: 'service-detail',
    component: () => import('@/views/ServiceDetailView.vue')
  },
  {
    path: '/info/:slug',
    name: 'info-page',
    component: () => import('@/views/InfoView.vue')
  },
  // 條件式路由（C）：待 P0 確認是否需要登入
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true }   // 已登入者導向首頁
  },
  {
    path: '/apply/:serviceId',
    name: 'apply',
    component: () => import('@/views/ApplyView.vue'),
    meta: { requiresAuth: true }    // Assumption：需登入，待確認
  },
  {
    path: '/apply/:serviceId/result',
    name: 'apply-result',
    component: () => import('@/views/ApplyResultView.vue'),
    meta: { requiresAuth: true }    // Assumption：需登入，待確認
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/AccountView.vue'),
    meta: { requiresAuth: true }
  },
  // 系統頁面
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/views/error/ForbiddenView.vue')
  },
  {
    path: '/500',
    name: 'server-error',
    component: () => import('@/views/error/ServerErrorView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/error/NotFoundView.vue')
  }
]
```

### 2.2 路由守衛規則（Assumption）

> 以下守衛規則依賴認證功能，若 P0 確認不需要登入，則移除 `requiresAuth` 相關邏輯。

```javascript
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // 需要登入的頁面：未登入導向 /login 並記錄來源
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 訪客專用頁面（如登入頁）：已登入導向首頁
  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return { name: 'home' }
  }
})
```

### 2.3 路由命名慣例

- 使用 kebab-case 命名（如 `service-detail`、`apply-result`）
- 動態參數使用語意化名稱（`:id`、`:serviceId`、`:slug`）
- 系統頁面使用描述性名稱（`not-found`、`forbidden`、`server-error`）

---

## 3. Pinia 狀態管理規格

> **前提**：`pinia ^2.x` 規劃中，採用前確認版本與安裝。

### 3.1 認證 Store（auth.js）

```javascript
// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,          // JWT Token 或 null
    user: null,           // 使用者基本資訊
    isAuthenticated: false
  }),
  actions: {
    async login(credentials) { /* ... */ },
    async logout() { /* ... */ },
    async refreshToken() { /* ... */ },  // Assumption：是否需要 refresh token
    initFromStorage() { /* 從 localStorage/sessionStorage 恢復狀態 */ }
  }
})
```

### 3.2 UI Store（ui.js）

```javascript
// src/stores/ui.js
export const useUiStore = defineStore('ui', {
  state: () => ({
    toasts: [],           // 通知訊息佇列
    globalLoading: false  // 全頁載入遮罩
  }),
  actions: {
    showToast({ type, message, duration }) { /* ... */ },
    removeToast(id) { /* ... */ },
    setGlobalLoading(value) { /* ... */ }
  }
})
```

### 3.3 Store 使用原則

- Store 只在 `views/` 或 `composables/` 中使用，`components/` 透過 props/emit 傳遞資料
- 避免在 Store 中直接操作 DOM
- 敏感資訊（Token）不存入 `localStorage`，優先使用 `sessionStorage` 或 httpOnly Cookie（待 SA 確認）

---

## 4. API Service 層規格

> **前提**：`axios ^1.x` 規劃中。

### 4.1 Axios 實例設定

```javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器：自動附加 Token
api.interceptors.request.use((config) => {
  const token = /* 從 Store 或安全儲存取得 */ null
  if (token) config.headers.Authorization = '****** [****** 格式，待 SA 確認]'
  return config
})

// 回應攔截器：統一錯誤處理
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) { /* 導向登入或清除 Token */ }
    if (status === 403) { /* 導向 403 頁面 */ }
    if (status >= 500) { /* 顯示系統錯誤提示 */ }
    return Promise.reject(error)
  }
)
```

### 4.2 API 呼叫結果處理原則

每個 API 呼叫應處理以下狀態：

| HTTP 狀態碼 | 處理方式 |
|------------|---------|
| 200 / 201 | 回傳資料，更新 UI 狀態 |
| 400 | 顯示欄位驗證錯誤 |
| 401 | 清除 Token，導向登入頁 |
| 403 | 顯示 403 提示或頁面 |
| 404 | 顯示 404 提示或頁面 |
| 429 | 顯示「請稍後再試」，不暴露速率限制細節 |
| 5xx | 顯示系統錯誤訊息，提供重試或返回首頁選項 |
| 網路錯誤 | 顯示「連線問題，請確認網路後重試」 |

### 4.3 防止重複送出

```javascript
// 使用響應式 loading 旗標
const isSubmitting = ref(false)

async function handleSubmit() {
  if (isSubmitting.value) return  // 防止重複觸發
  isSubmitting.value = true
  try {
    await api.post('/apply', formData.value)
    // 成功處理
  } catch (error) {
    // 錯誤處理
  } finally {
    isSubmitting.value = false
  }
}
```

---

## 5. 表單驗證規格

### 5.1 驗證時機

| 時機 | 行為 |
|------|------|
| 欄位失去焦點（blur） | 驗證該欄位，顯示錯誤訊息 |
| 表單送出 | 驗證所有欄位，顯示錯誤摘要，focus 移至第一個錯誤 |
| 錯誤欄位重新輸入 | 清除錯誤訊息（live validation） |

### 5.2 必要驗證規則

| 欄位類型 | 驗證規則 |
|---------|---------|
| 必填 | 不得為空或只有空白字元 |
| Email | 符合 RFC 5322 格式 |
| 電話 | 符合台灣手機或市話格式（依欄位需求，待確認） |
| 密碼 | 最小長度依後端規格（待確認） |
| 字數限制 | 不超過欄位最大字數 |

### 5.3 錯誤訊息顯示規則

- 錯誤訊息顯示在欄位下方，使用 `--color-error-500` 色彩
- 欄位邊框改為 `--color-error-500`
- 加上 `aria-invalid="true"` 與 `aria-describedby="[error-id]"`（參見 [responsive-accessibility-spec.md](responsive-accessibility-spec.md)）
- 表單送出失敗時，頂端顯示錯誤摘要

---

## 6. UI 狀態模型

每個需要 API 互動的頁面或元件需實作以下狀態：

| 狀態 | 說明 | UI 表現 |
|------|------|---------|
| `idle` | 尚未發出請求 | 顯示空白或初始內容 |
| `loading` | 請求進行中 | Skeleton 或 Spinner，禁止互動 |
| `success` | 請求成功 | 顯示資料 |
| `empty` | 請求成功但無資料 | 空白狀態元件（圖示 + 說明 + CTA） |
| `validationError` | 前端驗證失敗 | 欄位錯誤訊息 + 頂端摘要 |
| `apiError` | API 回傳錯誤 | 行內錯誤訊息或 Toast |
| `unauthorized` | 401 未授權 | 導向登入 |
| `forbidden` | 403 無權限 | 顯示 403 提示 |
| `serverError` | 5xx 系統錯誤 | 系統錯誤提示 + 重試 |
| `networkError` | 網路異常 | 連線錯誤提示 + 重試 |

```javascript
// 建議使用 Composable 統一管理 API 狀態
// src/composables/useApiState.js
export function useApiState() {
  const status = ref('idle')  // 'idle' | 'loading' | 'success' | 'empty' | 'error'
  const error = ref(null)
  const data = ref(null)

  async function execute(apiCall) {
    status.value = 'loading'
    error.value = null
    try {
      const result = await apiCall()
      data.value = result
      status.value = result && (Array.isArray(result) ? result.length === 0 : !result)
        ? 'empty'
        : 'success'
    } catch (err) {
      error.value = err
      status.value = 'error'
    }
  }

  return { status, error, data, execute }
}
```

---

## 7. 認證與 Token 處理

> **Assumption**：以下為 JWT Token 流程假設。實際認證機制（JWT、Session Cookie、SSO）待 SA 確認。

### 7.1 Token 儲存原則

- **優先使用 httpOnly Cookie**（後端設定，前端無法透過 JS 存取，安全性較高）
- 若使用前端儲存，使用 `sessionStorage`（關閉分頁後清除），避免 `localStorage`
- Token 不得存入 Vuex/Pinia 的持久化儲存（避免 XSS 洩漏）

### 7.2 Session 過期處理

- API 回應 401 時，清除本地 Token 並導向登入頁
- 導向登入頁時保留 `redirect` query 參數，登入成功後返回原頁面
- 顯示使用者友善的過期提示（如「您的工作階段已逾時，請重新登入」）

### 7.3 登入/登出流程

**登入**：
1. 送出帳號密碼 → `POST /api/login`
2. 成功：取得 Token → 存入安全儲存 → 更新 auth Store → 導向目標頁
3. 失敗：顯示錯誤訊息，清除密碼欄位

**登出**：
1. 呼叫 `POST /api/logout`（若後端有此端點）
2. 清除本地 Token 與 Store 狀態
3. 導向首頁或登入頁

---

## 8. 環境變數與建置設定

### 8.1 環境變數定義

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=[應用程式名稱（待確認）]
VITE_ENABLE_DEBUG=true

# .env.production
VITE_API_BASE_URL=https://[正式環境網域（待確認）]/api
VITE_APP_TITLE=[應用程式名稱（待確認）]
VITE_ENABLE_DEBUG=false
```

**規則**：
- 所有環境變數以 `VITE_` 開頭才會暴露到前端
- 敏感資訊（密鑰、密碼）不得存入前端環境變數
- `.env.local` 存放本地覆蓋設定，不進版控（加入 `.gitignore`）

### 8.2 Vite 建置設定重點

```javascript
// vite.config.js
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    sourcemap: false,       // 正式環境不產生 source map
    chunkSizeWarningLimit: 1000
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // 開發環境 API proxy
        changeOrigin: true
      }
    }
  }
})
```

---

## 9. SEO 與 Meta 規格

> **Assumption**：是否需要 SSR/SSG 或特定 SEO 要求待確認。

每個頁面應設定：

```html
<meta name="description" content="[頁面描述]">
<title>[頁面標題] | [品牌名稱（待確認）]</title>
```

**使用 `useHead` 或 `@vueuse/head`（規劃中，待確認）** 動態設定 meta：

```javascript
// 頁面元件中
useHead({
  title: computed(() => `${pageTitle.value} | ${appTitle}`),
  meta: [
    { name: 'description', content: computed(() => pageDescription.value) }
  ]
})
```

---

## 10. 響應式實作規則

- 使用 CSS 自訂屬性（CSS Variables）實作 Design Token（參見 [ui-design-system.md](ui-design-system.md)）
- 優先使用 CSS Flexbox 和 Grid 實作版面，不依賴 JS 計算版面寬度
- 斷點透過 CSS Media Query 實作（參見 [responsive-accessibility-spec.md](responsive-accessibility-spec.md)）
- 圖片使用 `loading="lazy"` 延遲載入
- 使用 `srcset` 提供不同解析度圖片（若有多個圖片尺寸需求）

---

## 11. 元件命名與程式碼規範

### 11.1 命名規則

| 類型 | 規則 | 範例 |
|------|------|------|
| 元件檔名 | PascalCase | `AppButton.vue`、`ServiceCard.vue` |
| 頁面檔名 | PascalCase + View | `HomeView.vue`、`ServiceListView.vue` |
| Composable 檔名 | camelCase + use 前綴 | `useAuth.js`、`useApiState.js` |
| Store 檔名 | camelCase | `auth.js`、`ui.js` |
| CSS Class | kebab-case | `.service-card`、`.form-field` |
| CSS 自訂屬性 | kebab-case + 語意前綴 | `--color-primary-500`、`--spacing-4` |

### 11.2 Vue 3 Composition API 規範

- 使用 `<script setup>` 語法糖
- Props 使用 `defineProps`，Events 使用 `defineEmits`
- 複雜邏輯抽取至 `composables/`
- 避免在 template 中撰寫複雜的業務邏輯

---

## 12. 測試交接規格

### 12.1 PG 自我檢查清單（開發完成後）

- [ ] 所有核心頁面可在各斷點正常顯示，無水平溢出
- [ ] 所有互動元件支援鍵盤操作（Tab、Enter、Esc）
- [ ] 所有 API 請求有 Loading、Success、Empty、Error 狀態處理
- [ ] 表單驗證錯誤有清楚的欄位標示與訊息
- [ ] 表單送出期間禁止重複操作
- [ ] 所有頁面有適當的 `<title>` 和 `meta description`
- [ ] 環境變數設定正確，密鑰不進版控
- [ ] 所有圖片有 `alt` 文字

### 12.2 QA 驗收交接

測試案例參見 [../test-case/frontend/README.md](../test-case/frontend/README.md)。

開發完成後提供給 QA：
- 測試環境 URL 與測試帳號（若有登入功能）
- 已知限制與未完成項目
- API Mock 設定說明（若 API 尚未完成）

---

## 13. 待確認事項

| 項目 | 類型 | 影響範圍 |
|------|------|---------|
| 是否需要登入功能 | 待確認 | 路由守衛、認證 Store、登入頁 |
| Token 儲存機制（Cookie / Storage） | 待確認 | 安全架構 |
| 是否採用 UI 框架（如 Vuetify、Element Plus） | 待確認 | 元件實作方式 |
| 是否需要 TypeScript | 待確認 | 所有 JS 檔案改為 TS |
| 是否需要 SSR / SSG（如 Nuxt） | 待確認 | 架構調整 |
| vue-router、pinia、axios 版本確認 | 待確認 | package.json 更新 |
| `useHead` / SEO 套件選擇 | 待確認 | meta 管理方式 |
| API base URL 正式環境設定 | 待確認 | 環境變數 |
| 是否需要多語系（i18n） | 待確認 | 文字管理方式 |
| 測試框架（Vitest、Cypress） | 待確認 | 測試設定 |

---

**對應 WBS**：4.5（設計交付與開發評審）、5.0（前端開發）  
**參考文件**：[architecture.md](architecture.md)、[technical-spec.md](technical-spec.md)、[../api-docs/swagger.json](../api-docs/swagger.json)  
**下一步**：P0 核准後由 PG/SA 更新路由、API 端點與套件設定；開發前完成設計評審（G3）。
