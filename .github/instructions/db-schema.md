# DB Schema — MongoDB 版本 / 資料庫模式（範本）

**版本**: 1.0.0
**更新日期**: 2026-08-12
**資料庫類型**: MongoDB (NoSQL, 文件模型)

---

## 概述

此文件以登入系統文件樣式編寫，提供碳排/能源服務門戶的 MongoDB 設計細節。包含集合定義、範例文件、關聯策略、常用查詢、索引建議、部署與備份指引，以及整合建議。

設計目標：
- 支援原始事件級別用量資料（時序資料）與高頻寫入。
- 保留排放因子版本以利歷史重現計算。
- 報表與帳單分離以利彈性彙總與歸檔。
- 提供查詢效率高的索引建議與分區策略（time-based sharding）。

---

## 變更紀錄

### v1.0.0 (2026-08-12)
- 初版：MongoDB 集合設計、文件範例、索引建議與部署說明。

---

## 文件結構（建議存放）

| 檔案名稱 | 說明 |
|---|---|
| db-schema.md | 本文件（MongoDB 版本） |
| create_indexes.js | 建立預設索引的腳本（Node/Mongo Shell） |
| migration/ | 導入與資料轉換腳本 |
| er-diagram.drawio | ER/集合示意圖 |

---

## 集合與文件設計（核心集合）

每個集合包含範例文件與欄位說明。請依實際需求調整欄位類型與必要性。

### accounts
用途：客戶/公司帳戶。

範例：
```json
{
  "_id": ObjectId("..."),
  "name": "Example Corp",
  "industry": "Manufacturing",
  "metadata": {"vat": "TW12345678"},
  "created_at": ISODate("2026-08-12T00:00:00Z"),
  "updated_at": ISODate("2026-08-12T00:00:00Z")
}
```

重要說明：此集合用於帳務與報表的最上層分區鍵（account_id）。

### users
用途：系統使用者（可為帳戶管理者或一般使用者）。

範例：
```json
{
  "_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "email": "user@example.com",
  "password_hash": "bcrypt$2b$...",
  "display_name": "Alice",
  "roles": ["account_admin"],
  "is_active": true,
  "is_deleted": false,
  "created_at": ISODate(...),
  "updated_at": ISODate(...)
}
```

說明：以獨立集合保留使用者資料，並以 `account_id` 做查詢過濾。

### locations
用途：場站或服務地址（可用於計量點分群）。

範例：
```json
{
  "_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "name": "Plant A",
  "address": "123 Example Rd",
  "city": "Taipei",
  "region": "Taipei",
  "postal_code": "100",
  "meta": {"zone": "A"},
  "created_at": ISODate(...)
}
```

### meters
用途：計量設備（電表、瓦斯表、車輛等）。建議獨立集合，便於查詢與設備生命週期管理。

範例：
```json
{
  "_id": ObjectId("..."),
  "location_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "name": "Electricity Meter 1",
  "meter_type": "electricity",
  "serial_number": "EM-001",
  "unit": "kWh",
  "installed_at": ISODate(...),
  "active": true,
  "created_at": ISODate(...)
}
```

### meter_readings
用途：原始讀表事件（high write）。此集合為時序資料的主要存放處，應避免過度嵌入大型子文件。

範例：
```json
{
  "_id": ObjectId("..."),
  "meter_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "reading_at": ISODate("2026-07-31T23:00:00Z"),
  "reading_value": 12345.6,
  "previous_value": 12200.0,
  "usage_value": 145.6,
  "status": "imported",
  "source": "manual|gateway|api",
  "metadata": {"batch_id": "2026-07"},
  "created_at": ISODate(...)
}
```

設計建議：以 `meter_id + reading_at` 作為複合索引，並依需求開啟 time-series collection 或普通集合加分片。

### energy_types
用途：能源類別定義（供排放計算使用）。

範例：
```json
{
  "_id": ObjectId("..."),
  "code": "ELEC",
  "name": "Electricity",
  "unit": "kWh",
  "created_at": ISODate(...)
}
```

### emission_factors
用途：排放因子版本管理，包含生效期間與來源資訊。

範例：
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

重要：每次計算應引用當時的 `emission_factor` `_id`，避免未來更新改變歷史結果。

### emission_calculations
用途：保存對應 `meter_readings` 的排放計算結果（可存在同一批次多筆）。

範例：
```json
{
  "_id": ObjectId("..."),
  "meter_reading_id": ObjectId("..."),
  "meter_id": ObjectId("..."),
  "energy_type_id": ObjectId("..."),
  "emission_factor_id": ObjectId("..."),
  "usage": 145.6,
  "emission_value": 76.61,
  "calculated_at": ISODate(...)
}
```

設計備註：此集合是事件到讀取鏈 (reading → calculation) 的鏈結，應保留 `emission_factor_id` 與 `calculation_version`。

### billing_periods
用途：報表/帳單週期管理。

範例：
```json
{
  "_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "start_date": ISODate("2026-07-01T00:00:00Z"),
  "end_date": ISODate("2026-07-31T23:59:59Z"),
  "status": "posted",
  "created_at": ISODate(...)
}
```

### usage_reports
用途：依 `billing_period` 聚合的用量與排放彙總（Read model）。

範例：
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

### bills
用途：帳單資料與付款狀態。

範例：
```json
{
  "_id": ObjectId("..."),
  "billing_period_id": ObjectId("..."),
  "account_id": ObjectId("..."),
  "amount": 45000.0,
  "currency": "TWD",
  "due_date": ISODate("2026-08-31T00:00:00Z"),
  "status": "pending",
  "issued_at": ISODate(...)
}
```

---

## 關係與設計策略

### 參考 vs 嵌入
- 對於高頻查詢與高寫入（如 `meter_readings`、`emission_calculations`），建議獨立集合並以小文件為主，避免將大量時序資料嵌入至父文件。
- 低變動且小量的參考資料（如 `energy_types`、`emission_factors`）可獨立成集合，計算時以 `_id` 參考。

### 分片與擴充策略
- 建議以時間或 `account_id` 為分片鍵（例如：hashtag shard key: { account_id, reading_at } 或 time-based sharding for readings）。
- 使用 time-series collection（MongoDB 5+）能簡化時序資料管理並優化儲存與查詢。

---

## 常用查詢與範例

1. 取得特定 meter 的最近讀表：
```js
db.meter_readings.find({ meter_id: ObjectId("...") }).sort({ reading_at: -1 }).limit(10)
```

2. 依 billing_period 聚合排放彙總：
```js
db.emission_calculations.aggregate([
  { $match: { calculated_at: { $gte: ISODate(...), $lte: ISODate(...) } } },
  { $group: { _id: "$energy_type_id", total_emission: { $sum: "$emission_value" } } }
])
```

3. 查詢某帳戶在某月的用量總和：
```js
db.meter_readings.aggregate([
  { $match: { account_id: ObjectId("..."), reading_at: { $gte: start, $lte: end } } },
  { $group: { _id: null, total_usage: { $sum: "$usage_value" } } }
])
```

---

## 索引建議

- `users.account_id`
- `meters.location_id`
- `meter_readings`: compound index `{ meter_id: 1, reading_at: -1 }`
- `meter_readings.reading_at` (TTL 或分片 範圍查詢)
- `emission_factors.energy_type_id`
- `emission_calculations.meter_reading_id`
- `billing_periods.account_id`
- `usage_reports.billing_period_id`

示例（Mongo Shell / createIndexes）：
```js
db.meter_readings.createIndex({ meter_id: 1, reading_at: -1 })
db.meter_readings.createIndex({ account_id: 1, reading_at: -1 })
db.emission_calculations.createIndex({ meter_reading_id: 1 })
db.emission_factors.createIndex({ energy_type_id: 1 })
db.usage_reports.createIndex({ billing_period_id: 1 })
```

---

## 部署、備份與遷移建議

- 使用 Replica Set 提供高可用性與讀寫分離。
- 考慮 time-series collection 或使用分片 (sharding) 以支援大量時序資料。
- 定期建立備份 (mongodump 或 Cloud Provider snapshot)，並測試還原流程。
- Migration：在 schema 變更時採取向後相容的變更，例如新增欄位並提供預設值，逐步回填歷史資料。

示例：使用 mongodump/mongorestore
```bash
mongodump --uri="$MONGO_URI" --db co2db --out /backups/co2db-$(date +%F)
mongorestore --uri="$MONGO_URI" --db co2db /backups/co2db-2026-08-12
```

---

## 與 Redis / 快取整合建議

- Cache 熱點：`usage_reports`、近期 `meter_readings` 查詢。
- Key 範例： `meter:recent:{meterId}`, `account:report:{billingPeriodId}`。
- 使用 Cache-Aside 或 Write-Through 模式，並設置合理 TTL。

---

## 維運與監控

- 監控指標：寫入速率、讀取延遲、分片熱點、儲存成長。
- 設定 alert：當 oplog lag 過大、分片不均或儲存使用率超過門檻時通知。

---

## 變更與貢獻

如需提出變動，請：
1. 在 issues 描述變更內容與影響
2. 提交 migration 腳本到 `migration/` 並附上回填策略
3. 更新 `db-schema.md` 並標註版本

---

## 附錄：快速索引建立腳本（建議放在 create_indexes.js）

```js
// Node script or mongo shell
db.meter_readings.createIndex({ meter_id: 1, reading_at: -1 });
db.meter_readings.createIndex({ account_id: 1, reading_at: -1 });
db.emission_calculations.createIndex({ meter_reading_id: 1 });
db.emission_factors.createIndex({ energy_type_id: 1 });
db.usage_reports.createIndex({ billing_period_id: 1 });
```

---

**最後更新**: 2026-08-12
**維護者**: Data Platform / System Analyst

