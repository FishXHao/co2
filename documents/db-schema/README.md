# 碳排放資料庫架構設計

**版本**: 1.0.0  
**更新日期**: 2026-08-12  
**架構模式**: 原始事件儲存 + 排放因子版本化 + 報表/帳單分離

---

## 📋 概述

本資料庫設計針對碳/能源服務入口，支援以下核心需求：
- 原始計表讀值與用量事件保留，便於稽核與回溯
- 排放因子版本管理，確保歷史計算可追溯
- 用戶、帳戶與場站/計表資料模型
- 報表與帳單分離，透過週期一致性彙總計算
- 支援多種能源類型與計量設備

---

## 🆕 Version 1.0.0 變更內容

### 新增功能

#### 1. **帳戶與用戶結構**
- ✅ `accounts` - 客戶帳戶資料
- ✅ `users` - 帳戶使用者登入與角色
- ✅ `locations` - 場站或地址資訊
- ✅ `meters` - 計量設備與計表資訊

#### 2. **原始讀表事件保存**
- ✅ `meter_readings` - 讀表時間、讀值、用量與註記
- ✅ 保留原始讀值與前次讀值，支援歷史比對

#### 3. **排放因子管理**
- ✅ `energy_types` - 能源類別定義
- ✅ `emission_factors` - 因子版本、來源與生效期間
- ✅ `emission_calculations` - 鎖定當時因子版本的計算紀錄

#### 4. **報表與帳單分離**
- ✅ `billing_periods` - 報表與帳單週期定義
- ✅ `usage_reports` - 彙總用量與排放結果
- ✅ `bills` - 帳單金額與付款狀態

### 優化改進

#### 設計優化
- ✅ 原始讀表事件保留，避免只存匯總資料導致溯源困難
- ✅ 因子版本管理，避免歷史計算不一致
- ✅ 報表/帳單分離，避免混淆用量與費用模型
- ✅ 支援多種能源、計量單位與設備類型

---

## 📁 文件結構

| 文件名稱 | 說明 |
|---------|------|
| **README.md** | 本文件 |
| **.github/instructions/db-schema.md** | 具體資料庫欄位與關聯設計 |

> 💡 **建議**: 以 `.github/instructions/db-schema.md` 為主檔，README 作為概要說明。

---

## 🏗️ 架構對應

### DB 設計對應關係

| 元素類型 | 對應資料庫元件 | 說明 |
|----------|----------------|------|
| **Actor: 企業客戶 / 使用者** | `accounts`, `users` | 帳戶、使用者與角色管理 |
| **Command: 讀表紀錄** | `meter_readings` | 原始用量事件輸入 |
| **Aggregate: 計量設備** | `meters` | 計表與設備資訊 |
| **Domain Event: 讀表事件** | `meter_readings`, `emission_calculations` | 用量與排放結果紀錄 |
| **Policy: 報表彙總** | `usage_reports`, `billing_periods` | 週期彙總與狀態管理 |
| **External: 能源類型 / 因子來源** | `energy_types`, `emission_factors` | 因子版本與來源追蹤 |
| **Read Model: 用量報表** | `usage_reports` | 彙總查詢結果 |
| **Read Model: 帳單狀態** | `bills` | 帳單與付款可查詢 |

---

## 📊 資料表結構

### 核心資料表

| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|---------|
| `accounts` | 客戶帳戶資料 | `id`, `name`, `industry`, `created_at` |
| `users` | 帳戶使用者資料 | `id`, `account_id`, `email`, `password_hash`, `role` |
| `locations` | 場站/地址資訊 | `id`, `account_id`, `name`, `address`, `city` |
| `meters` | 計量設備/計表 | `id`, `location_id`, `meter_type`, `serial_number`, `unit` |

### 用量與排放紀錄

| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|---------|
| `meter_readings` | 原始讀表事件 | `meter_id`, `reading_at`, `reading_value`, `usage_value` |
| `energy_types` | 能源類型定義 | `code`, `name`, `unit` |
| `emission_factors` | 因子版本管理 | `energy_type_id`, `factor_value`, `effective_from`, `version` |
| `emission_calculations` | 排放計算紀錄 | `meter_reading_id`, `energy_type_id`, `emission_factor_id`, `emission_value` |

### 報表與帳單

| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|---------|
| `billing_periods` | 報表/帳單週期 | `account_id`, `start_date`, `end_date`, `status` |
| `usage_reports` | 用量與排放彙總 | `billing_period_id`, `energy_type_id`, `total_usage`, `total_emission` |
| `bills` | 帳單與付款紀錄 | `billing_period_id`, `amount`, `currency`, `due_date`, `status` |

---

## 🔄 核心功能與使用範例

### 1. 匯入計表讀值
```sql
INSERT INTO meter_readings (
    meter_id,
    reading_at,
    reading_value,
    previous_value,
    usage_value,
    note,
    created_at
) VALUES (
    1,
    '2026-08-12 10:00:00',
    1200.5,
    1150.0,
    50.5,
    '月度讀表',
    CURRENT_TIMESTAMP
);
```

### 2. 新增排放因子版本
```sql
INSERT INTO emission_factors (
    energy_type_id,
    factor_value,
    factor_unit,
    effective_from,
    effective_to,
    source,
    version,
    created_at
) VALUES (
    1,
    0.532,
    'kgCO2e/kWh',
    '2026-01-01',
    '2026-12-31',
    '國家標準',
    '2026Q1',
    CURRENT_TIMESTAMP
);
```

### 3. 計算排放並鎖定版本
```sql
INSERT INTO emission_calculations (
    meter_reading_id,
    energy_type_id,
    emission_factor_id,
    usage,
    emission_value,
    calculated_at
) VALUES (
    1,
    1,
    1,
    50.5,
    26.846,
    CURRENT_TIMESTAMP
);
```

### 4. 產生用量報表
```sql
INSERT INTO usage_reports (
    billing_period_id,
    account_id,
    energy_type_id,
    total_usage,
    total_emission,
    generated_at
) VALUES (
    1,
    1,
    1,
    50.5,
    26.846,
    CURRENT_TIMESTAMP
);
```

### 5. 建立帳單
```sql
INSERT INTO bills (
    billing_period_id,
    account_id,
    amount,
    currency,
    due_date,
    status,
    issued_at,
    created_at,
    updated_at
) VALUES (
    1,
    1,
    1500.00,
    'TWD',
    '2026-09-10',
    'pending',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
```

---

## 🔒 設計注意事項

- `meter_readings` 應保留原始讀值與用量資料，避免僅存匯總值導致追溯困難。
- `emission_calculations` 應鎖定 `emission_factor_id`，避免因因子更新而改變歷史計算結果。
- `billing_periods` 為報表與帳單共同週期，確保 `usage_reports` 與 `bills` 的一致性。
- 若需支援多幣別、稅務或軟刪除，可再補 `currency_rate`、`tax_amount`、`is_deleted` 等欄位。

---

## 📚 相關文件

| 文件名稱 | 說明 |
|---------|------|
| `.github/instructions/db-schema.md` | 資料庫欄位與關聯設計詳述 |
| `documents/db-schema/README.md` | 本文件 |

---

## 📝 版本日誌

### v1.0.0 (2026-08-12)
- ✅ 完成碳/能源資料庫模式概要設計
- ✅ 支援原始讀表事件、因子版本、排放計算、報表與帳單分離
- ✅ 以 `.github/instructions/db-schema.md` 為具體欄位規格來源
