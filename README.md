# Copilot Lab - 登入頁面範例專案

一個使用 Vue.js 3 和 Node.js 建立的登入系統。

## 專案目的

### 專案背景
本專案是一個**技術學習與實踐平台**，旨在提供完整的登入系統實作範例。透過整合現代化前後端技術、進階架構模式與容器化部署，協助開發者理解並掌握生產環境等級的系統設計與實作方法。

### 核心目標

#### 1. 技術架構示範
- **前後端分離架構**：展示 Vue 3 Composition API 與 Express RESTful API 的整合實踐
- **進階設計模式**：實作 CQRS (Command Query Responsibility Segregation) 和 Event Sourcing 模式
- **容器化部署**：提供完整的 Docker 與 Docker Compose 配置，實現開發與生產環境一致性

#### 2. 功能實作
- **安全認證機制**：包含密碼加密、Token 管理、會話控制
- **失敗追蹤與防護**：自動失敗次數追蹤、帳號自動鎖定機制（15 分鐘內失敗 5 次，鎖定 30 分鐘）
- **完整日誌系統**：領域事件記錄、登入日誌、審計追蹤
- **狀態管理**：使用者狀態管理、會話管理、活動追蹤

#### 3. 開發流程規範
- **文件驅動開發**：完整的 API 文件 (Swagger)、資料庫架構 (ER Diagram)、系統規格文件
- **測試案例管理**：前後端分離的測試案例組織
- **事件風暴**：透過視覺化流程圖理解業務邏輯與系統互動

### 專案價值

#### 對開發者
- 學習系統的完整開發流程
- 掌握現代化前後端技術棧的整合應用
- 理解進階架構模式在實際場景中的應用
- 建立容器化開發與部署的實務經驗

#### 對團隊
- 建立統一的技術標準與開發規範
- 提供可重用的架構模板與最佳實踐
- 培養文件驅動開發的協作文化
- 降低新成員的學習曲線

#### 對專案
- 作為技術選型與架構設計的參考範例
- 提供可擴展的系統架構基礎
- 建立完整的開發文件體系
- 實踐 DevOps 與自動化部署流程

### 適用對象
- **初學者**：學習全端開發的完整實踐
- **中階開發者**：掌握系統的設計與實作
- **技術團隊**：作為專案架構與規範的參考模板
- **技術領導者**：了解現代化技術棧的整合與最佳實踐

## 技術棧

### 前端
- Vue.js 3 (Composition API)
- Vite
- Vue Router 4（路由與導覽守衛）
- Pinia（狀態管理）
- Axios（API 呼叫）
- Vitest + @vue/test-utils（單元測試）

### 後端
- Node.js
- Express.js
- CORS

## 前端開發指南

本專案已建置完整的第一版前端，包含碳捕獲服務瀏覽、申辦流程、登入與帳戶頁面。

### 環境需求
- Node.js 18+（建議 20+）

### 安裝與啟動

```bash
# 安裝相依套件
npm install

# 複製環境變數範本（可選）
cp .env.example .env

# 同時啟動前端 (3000) 與後端 API (3001)
npm start

# 或僅啟動前端開發伺服器
npm run dev

# 僅啟動後端 API
npm run server
```

### 建置與預覽

```bash
# 建置生產版本至 dist/
npm run build

# 本地預覽建置結果
npm run preview
```

### 測試

```bash
# 執行一次完整單元測試
npm test

# 監看模式（開發時使用）
npm run test:watch
```

### 環境變數

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `VITE_API_BASE_URL` | API 基底路徑 | `/api` |
| `VITE_MOCK_MODE` | 是否啟用服務/申辦的模擬資料 | `true`（未設定時預設啟用） |

### 前端架構

```
src/
├── router/          # Vue Router 設定與導覽守衛
├── stores/          # Pinia 狀態（auth / user / ui）
├── services/        # API 封裝（api / auth / services / apply）
├── composables/     # 可組合函式（useAuth / useApiState / useFormValidation）
├── views/           # 頁面元件（含 error/ 錯誤頁）
├── components/
│   ├── layout/      # 版面元件（Header / Footer / Breadcrumb / SkipLink）
│   ├── ui/          # 通用 UI 元件（Button / Input / Modal / Toast ...）
│   └── service/     # 服務相關元件（ServiceCard / ServiceSteps）
└── assets/styles/   # 設計 tokens、全域樣式與工具類
```

### 設計系統與可及性
- 以 CSS 自訂屬性（design tokens）統一色彩、字級、間距與圓角
- 響應式斷點：xs / sm / md / lg / xl，容器最大寬度 1200px
- 支援鍵盤操作、ARIA 屬性、`prefers-reduced-motion`、跳至主要內容連結
- 表單具備即時驗證、錯誤聚焦與防止重複送出

### API 與假設說明
- **真實端點**（見 `documents/api-docs/swagger.json`）：`POST /api/login`、`GET /api/health`
- **規劃中 / 模擬端點**：`/api/logout`、`/api/users/me`、`/api/services`、`/api/apply` 等
  於程式碼中皆以 `// ⚠ ASSUMPTION/MOCK` 標註，並可透過 `VITE_MOCK_MODE` 控制。
- 認證採 httpOnly cookie（由伺服器管理），前端不於 localStorage 儲存權杖。

## 使用 Docker 運行

### 前置需求
- 安裝 Docker 和 Docker Compose
- 確保 Docker 服務正在運行

### 方式一：使用 Docker Compose（推薦）

#### 生產環境

```bash
# 建置映像
docker-compose build

# 啟動服務
docker-compose up -d

# 查看日誌
docker-compose logs -f

# 停止服務
docker-compose down
```

服務會在以下埠號運行：
- **前端**: http://localhost:3000 (Nginx)
- **後端**: http://localhost:3001 (Node.js)

#### 開發環境

```bash
# 啟動開發環境（支援熱重載）
docker-compose -f docker-compose.dev.yml up

# 停止開發環境
docker-compose -f docker-compose.dev.yml down
```

### 方式二：建置單一映像

#### 後端映像
```bash
# 建置
docker build -t copilot-lab-backend .

# 運行
docker run -d -p 3001:3001 --name backend copilot-lab-backend
```

#### 前端映像
```bash
# 建置
docker build -f Dockerfile.frontend -t copilot-lab-frontend .

# 運行
docker run -d -p 3000:80 --name frontend copilot-lab-frontend
```

### Docker 檔案說明

| 檔案 | 說明 |
|------|------|
| `Dockerfile` | 後端生產環境映像 |
| `Dockerfile.frontend` | 前端生產環境映像（Nginx） |
| `Dockerfile.dev` | 開發環境映像 |
| `docker-compose.yml` | 生產環境服務編排 |
| `docker-compose.dev.yml` | 開發環境服務編排 |
| `.dockerignore` | Docker 忽略檔案 |
| `nginx.conf` | Nginx 配置檔 |
| `docker.sh` | Docker 管理腳本 |

## 📁 專案結構

```
co2/
├── src/
│   ├── assets/styles/         # 設計 tokens、全域與工具樣式
│   ├── components/
│   │   ├── layout/            # Header / Footer / Breadcrumb / SkipLink
│   │   ├── ui/                # 通用 UI 元件
│   │   └── service/           # 服務相關元件
│   ├── composables/           # useAuth / useApiState / useFormValidation
│   ├── router/                # 路由與導覽守衛
│   ├── services/              # API 封裝
│   ├── stores/                # Pinia 狀態
│   ├── views/                 # 頁面（含 error/ 錯誤頁）
│   ├── App.vue                # 主應用程式組件
│   └── main.js                # 應用程式入口
├── index.html                 # HTML 模板
├── server.js                  # Express 後端伺服器
├── vite.config.js             # Vite 配置（含 test 設定）
├── .env.example               # 環境變數範本
├── package.json               # 專案配置
└── README.md                  # 說明文件
```

**這是一個示範專案，不適合直接用於正式環境**