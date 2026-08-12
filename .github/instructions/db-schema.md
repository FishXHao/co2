# MongoDB Schema / NoSQL 資料庫模式

本文件定義碳排能源服務入口網站的 MongoDB 設計，採 NoSQL 文件模型，適用於：
- 用戶/帳戶管理與角色權限
- 站點/地點與設備/電表資料
- 原始用量事件與讀表資料
- 排放因子版本管理與歷史追溯
- 計算結果鎖定與查詢效能
- 報表與帳單資料分離

## 1. 系統概覽

本系統支援「用戶入口 + 能源用量 / 排放報表 + 帳單管理」，並保留原始事件級別資料。MongoDB 的文件模型適合以下設計：
- `accounts` 與 `users` 關聯
- `locations` 與 `meters` 可以嵌入或以參考方式存放
- `meter_readings` 為原始事件文件
- `emission_factors` 版本化管理
- `emission_calculations` 鎖定因子並保存計算結果

## 2. 集合與文件設計

### 2.1 accounts
儲存客戶帳戶與基本資料。

範例文件：
```json
{
  "_id": ObjectId("...") ,
  "name": "Example Corp",
  "industry": "Manufacturing",
  "created_at": ISODate("2026-08-12T00:00:00Z"),
  "updated_at": ISODate("2026-08-12T00:00:00Z")
}
```

### 2.2 users
帳戶下的登入使用者與角色資訊。

範例文件：
```json
{
  "_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "email": "user@example.com",
  "password_hash": "...",
  "name": "Alice",
  "role": "admin",
  "created_at": ISODate("2026-08-12T00:00:00Z"),
  "updated_at": ISODate("2026-08-12T00:00:00Z")
}
```

### 2.3 locations
帳戶下的實體場站或服務地址。

範例文件：
```json
{
  "_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "name": "Plant A",
  "address": "123 Example Rd",
  "city": "Taipei",
  "region": "Taipei",
  "postal_code": "100",
  "created_at": ISODate(...),
  "updated_at": ISODate(...)
}
```

### 2.4 meters
計量設備資料。可放在 `locations` 集合內嵌，或獨立成集合以便查詢。

範例文件：
```json
{
  "_id": ObjectId("..."),
  "location_id": ObjectId("..."),
  "name": "Electricity Meter 1",
  "meter_type": "electricity",
  "serial_number": "EM-001",
  "unit": "kWh",
  "installed_at": ISODate(...),
  "active": true,
  "created_at": ISODate(...),
  "updated_at": ISODate(...)
}
```

### 2.5 meter_readings
原始讀表事件文件，保存原始值與計算用量。

範例文件：
```json
{
  "_id": ObjectId("..."),
  "meter_id": ObjectId("..."),
  "reading_at": ISODate(...),
  "reading_value": 12345.6,
  "previous_value": 12200.0,
  "usage_value": 145.6,
  "note": "monthly reading",
  "created_at": ISODate(...)
}
```

### 2.6 energy_types
能源類別與單位定義。

範例文件：
```json
{
  "_id": ObjectId("..."),
  "code": "ELEC",
  "name": "Electricity",
  "unit": "kWh",
  "created_at": ISODate(...),
  "updated_at": ISODate(...)
}
```

### 2.7 emission_factors
排放因子版本文件。

範例文件：
```json
{
  "_id": ObjectId("..."),
  "energy_type_id": ObjectId("..."),
  "factor_value": 0.526,
  "factor_unit": "kgCO2e/kWh",
  "effective_from": ISODate("2026-01-01T00:00:00Z"),
  "effective_to": ISODate("2026-12-31T23:59:59Z"),
  "source": "EPA 2026",
  "version": "2026-v1",
  "created_at": ISODate(...)
}
```

### 2.8 emission_calculations
排放計算結果文件，保存引用因子版本與計算值。

範例文件：
```json
{
  "_id": ObjectId("..."),
  "meter_reading_id": ObjectId("..."),
  "energy_type_id": ObjectId("..."),
  "emission_factor_id": ObjectId("..."),
  "usage": 145.6,
  "emission_value": 76.61,
  "calculated_at": ISODate(...)
}
```

### 2.9 billing_periods
帳單或報表週期文件。

範例文件：
```json
{
  "_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "start_date": ISODate("2026-07-01T00:00:00Z"),
  "end_date": ISODate("2026-07-31T23:59:59Z"),
  "status": "posted",
  "created_at": ISODate(...),
  "updated_at": ISODate(...)
}
```

### 2.10 usage_reports
用量與排放彙總報表文件。

範例文件：
```json
{
  "_id": ObjectId("..."),
  "billing_period_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "energy_type_id": ObjectId("..."),
  "total_usage": 1520.4,
  "total_emission": 800.1,
  "generated_at": ISODate(...)
}
```

### 2.11 bills
帳單文件與付款狀態。

範例文件：
```json
{
  "_id": ObjectId("..."),
  "billing_period_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "amount": 45000.0,
  "currency": "TWD",
  "due_date": ISODate("2026-08-31T00:00:00Z"),
  "status": "pending",
  "issued_at": ISODate(...),
  "created_at": ISODate(...),
  "updated_at": ISODate(...)
}
```

## 3. 關係與設計策略

### 3.1 參考 vs 嵌入
- `accounts`、`users`、`locations`、`meters` 建議以獨立集合儲存，便於查詢與權限控制。
- `meter_readings` 與 `emission_calculations` 為高頻新增資料，應保持較小文件，避免嵌入過大。
- `energy_types` / `emission_factors` 為參考資料，可獨立成集合。

### 3.2 常用查詢
- 以 `meter_id` 查詢 `meter_readings`
- 以 `billing_period_id` 查詢 `usage_reports` 與 `bills`
- 以 `energy_type_id` 查詢 `emission_factors`
- 以 `meter_reading_id` 查詢 `emission_calculations`

### 3.3 建議索引
- `users.account_id`
- `locations.account_id`
- `meters.location_id`
- `meter_readings.meter_id`
- `meter_readings.reading_at`
- `emission_factors.energy_type_id`
- `emission_calculations.meter_reading_id`
- `billing_periods.account_id`
- `usage_reports.billing_period_id`
- `bills.billing_period_id`

## 4. 設計備註

- `meter_readings.usage_value` 可以由 `reading_value - previous_value` 計算，也可以由資料匯入時直接保存。
- `emission_calculations` 必須鎖定 `emission_factor_id`，以保留歷史計算依據。
- `usage_reports` 與 `bills` 透過 `billing_period_id` 連結，報表與帳單週期一致。
- MongoDB 適合原始事件與時序資料，因此 `meter_readings` 應以時間為主要查詢維度，並避免過度嵌入大量歷史資料。
