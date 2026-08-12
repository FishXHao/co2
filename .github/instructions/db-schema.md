# 資料庫模式（DB Schema）

此文件為碳/能源服務入口的資料表設計說明（供 `.github/instructions` 使用）。
涵蓋：帳戶與使用者、場站與計表、原始讀表事件、排放因子版本化、排放計算紀錄，以及報表與帳單分離設計。

## 1. 目的

- 支援用戶入口與帳戶管理
- 蒐集並保留原始計表讀值（可供稽核與回溯）
- 管理排放因子版本與有效期間
- 追蹤每次計算所用的因子版本，避免歷史數據重算不一致
- 報表（用量/排放）與帳單（金額）分開存放，透過 `billing_periods` 關聯

## 2. 資料表總覽

### accounts
- `id` PK
- `name`
- `industry`
- `created_at`
- `updated_at`

### users
- `id` PK
- `account_id` FK -> `accounts(id)`
- `email`
- `password_hash`
- `name`
- `role` (`admin` / `operator` / `viewer`)
- `created_at`
- `updated_at`

### locations
- `id` PK
- `account_id` FK -> `accounts(id)`
- `name`
- `address`
- `city`
- `region`
- `postal_code`
- `created_at`
- `updated_at`

### meters
- `id` PK
- `location_id` FK -> `locations(id)`
- `name`
- `meter_type` (`electricity` / `gas` / `water` / `fuel` / `transport`)
- `serial_number`
- `unit` (`kWh` / `m3` / `L` / `km`)
- `installed_at`
- `active` BOOLEAN
- `created_at`
- `updated_at`

### meter_readings
原始讀表事件（事件級資料），系統應保留每筆讀值以利稽核。
- `id` PK
- `meter_id` FK -> `meters(id)`
- `reading_at` TIMESTAMP
- `reading_value` NUMERIC
- `previous_value` NUMERIC NULLABLE
- `usage_value` NUMERIC NULLABLE -- 可由系統計算或直接匯入
- `note` TEXT
- `created_at` TIMESTAMP

### energy_types
- `id` PK
- `code` (e.g. `ELEC`, `GAS`)
- `name`
- `unit`
- `created_at`
- `updated_at`

### emission_factors
管理因子版本與生效期間，用於穩定歷史計算。
- `id` PK
- `energy_type_id` FK -> `energy_types(id)`
- `factor_value` NUMERIC
- `factor_unit` (e.g. `kgCO2e/unit`)
- `effective_from` DATE/TIMESTAMP
- `effective_to` DATE/TIMESTAMP NULLABLE
- `source` TEXT
- `version` VARCHAR
- `created_at` TIMESTAMP

### emission_calculations
每筆原始用量的排放計算紀錄，明確鎖定當時使用的 `emission_factors`。
- `id` PK
- `meter_reading_id` FK -> `meter_readings(id)`
- `energy_type_id` FK -> `energy_types(id)`
- `emission_factor_id` FK -> `emission_factors(id)`
- `usage` NUMERIC
- `emission_value` NUMERIC
- `calculated_at` TIMESTAMP

### billing_periods
定義報表/帳單週期，report/bill 皆以此為來源。
- `id` PK
- `account_id` FK -> `accounts(id)`
- `start_date` DATE
- `end_date` DATE
- `status` (`draft` / `confirmed` / `posted`)
- `created_at`
- `updated_at`

### usage_reports
彙總用量與排放（按能源別、帳戶與週期）。
- `id` PK
- `billing_period_id` FK -> `billing_periods(id)`
- `account_id` FK -> `accounts(id)`
- `energy_type_id` FK -> `energy_types(id)`
- `total_usage` NUMERIC
- `total_emission` NUMERIC
- `generated_at` TIMESTAMP

### bills
帳單與付款狀態紀錄（與金流、發票整合可擴充）。
- `id` PK
- `billing_period_id` FK -> `billing_periods(id)`
- `account_id` FK -> `accounts(id)`
- `amount` NUMERIC
- `currency` VARCHAR
- `due_date` DATE
- `status` (`pending` / `paid` / `overdue`)
- `issued_at` TIMESTAMP
- `created_at`
- `updated_at`

## 3. 關聯概覽

- `accounts` 1:N `users`
- `accounts` 1:N `locations`
- `locations` 1:N `meters`
- `meters` 1:N `meter_readings`
- `energy_types` 1:N `emission_factors`
- `meter_readings` 1:1 `emission_calculations` (通常一筆讀值對應一筆計算)
- `accounts` 1:N `billing_periods`
- `billing_periods` 1:N `usage_reports`
- `billing_periods` 1:N `bills`

## 4. 設計備註

- `meter_readings.usage_value` 可由 `reading_value - previous_value` 計算；若為外部匯入資料，可直接儲存並標記來源。
- `emission_calculations` 應鎖定 `emission_factor_id`（版本），避免事後因子變動影響歷史紀錄。
- 若需支援多幣別或稅務，建議在 `bills` 或 `invoices` 增加匯率與稅別欄位。

---

檔案位置：`.github/instructions/db-schema.md`
如需我把此轉為 PostgreSQL DDL 或 ORM 模型（SQLAlchemy / Django），請回覆要的格式。 
