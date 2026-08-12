# 碳捕捉與封存監測 API 說明文件

## 用途

本文件為 [carbon-capture-swagger.json](carbon-capture-swagger.json) 的輔助說明，記錄該 API 規格的參考來源、功能對應與待辦事項，避免說明文字與 JSON 規格混雜。

## 參考來源

- 台灣中油「碳封存示範場域環境資訊」網站：https://service.cpc.com.tw:8101
- 擷取時間：2026/08/12

## 現況說明

此規格**僅完成 API Doc 階段**。專案目前尚未針對「碳捕捉／封存監測」建立對應的 SD Doc（`documents/sd-docs/`）與 DB Schema（`documents/db-schema/`），欄位與型別為依網站前台呈現內容推導，實作前應先補齊需求規格與資料模型，並確認與本文件是否一致。

## 網站功能對應 API 分組

| 網站功能 | API 分組（tag） | 說明 |
|---|---|---|
| 本日／本月／累積灌注量 | `InjectionVolume` | 首頁摘要卡片（含累積目標 300,000 噸） |
| 站點主檔（城中站、梅南里站、坪頂站、封存場站等） | `Stations` | 各監測類型共用之站點基本資料 |
| 大氣即時 CO2 監測 | `AtmosphereMonitoring` | 多站 CO2 濃度（ppm）即時值與歷史查詢 |
| 土壤氣體即時監測 | `SoilGasMonitoring` | 封存場站 CO2 濃度（%）即時值與歷史查詢 |
| 地下水水質即時監測 | `GroundwaterMonitoring` | 酸鹼值（pH）即時值、正常範圍與歷史查詢 |
| 微震監測 | `SeismicMonitoring` | 微震事件即時資料 |
| 生態／交通量／噪音／地下水定期監測 | `PeriodicMonitoring` | 定期報告分類列表與內容 |
| 環保對策／碳封存小百科／國際案例 | `KnowledgeContent` | 知識文章列表與內容 |
| 碳來源／碳捕捉／碳再利用／碳運輸／碳封存科普影音 | `EducationalVideos` | 科普影片列表與內容 |

## 端點總覽

| 方法 | 路徑 | 說明 |
|---|---|---|
| GET | `/api/carbon-capture/injection-volumes/summary` | 灌注量摘要 |
| GET | `/api/carbon-capture/injection-records` | 查詢灌注紀錄 |
| POST | `/api/carbon-capture/injection-records` | 新增灌注紀錄（需驗證） |
| GET | `/api/carbon-capture/stations` | 監測站點列表 |
| POST | `/api/carbon-capture/stations` | 新增站點（需驗證） |
| GET/PUT/DELETE | `/api/carbon-capture/stations/{stationId}` | 單一站點查詢／更新／刪除（寫入需驗證） |
| GET | `/api/carbon-capture/monitoring/atmosphere` | 大氣 CO2 即時值 |
| POST | `/api/carbon-capture/monitoring/atmosphere` | 上傳大氣 CO2 讀值（需驗證） |
| GET | `/api/carbon-capture/monitoring/atmosphere/{stationId}/history` | 大氣 CO2 歷史資料 |
| GET | `/api/carbon-capture/monitoring/soil-gas` | 土壤氣體即時值 |
| POST | `/api/carbon-capture/monitoring/soil-gas` | 上傳土壤氣體讀值（需驗證） |
| GET | `/api/carbon-capture/monitoring/soil-gas/{stationId}/history` | 土壤氣體歷史資料 |
| GET | `/api/carbon-capture/monitoring/groundwater-quality` | 地下水水質即時值 |
| POST | `/api/carbon-capture/monitoring/groundwater-quality` | 上傳地下水水質讀值（需驗證） |
| GET | `/api/carbon-capture/monitoring/groundwater-quality/{stationId}/history` | 地下水水質歷史資料 |
| GET | `/api/carbon-capture/monitoring/seismic` | 微震即時資料 |
| POST | `/api/carbon-capture/monitoring/seismic` | 上傳微震事件（需驗證） |
| GET | `/api/carbon-capture/periodic-monitorings` | 定期監測分類列表 |
| GET | `/api/carbon-capture/periodic-monitorings/{reportId}` | 定期監測報告內容 |
| GET | `/api/carbon-capture/knowledge-articles` | 知識文章列表 |
| POST | `/api/carbon-capture/knowledge-articles` | 新增知識文章（需驗證） |
| GET | `/api/carbon-capture/knowledge-articles/{articleId}` | 知識文章內容 |
| GET | `/api/carbon-capture/videos` | 科普影音列表 |
| POST | `/api/carbon-capture/videos` | 新增科普影音（需驗證） |
| GET | `/api/carbon-capture/videos/{videoId}` | 科普影音內容 |

## 共用 Schema 摘要

- `MonitoringReading`：監測讀值共用結構，包含 `value`、`unit`、`baseline`、`thresholdMax`、`status`（正常／警示／儀器維護檢修中）、`recordedAt`。
- `Station`：站點主檔，含 `type`（`atmosphere`／`soil_gas`／`groundwater_quality`／`seismic`）與座標。
- `InjectionVolumeSummary`／`InjectionRecord`：灌注量摘要與逐日紀錄。
- `PeriodicMonitoringReport`：定期監測報告，`category` 涵蓋 `ecology`／`traffic`／`noise`／`groundwater`。
- `KnowledgeArticle`：`category` 涵蓋 `environmental_measure`／`storage_encyclopedia`／`international_case`。
- `EducationalVideo`：含標題、縮圖與影片連結（支援外部平台如 YouTube）。
- `Error`：全站統一錯誤格式，各端點以 `$ref` 引用。

## 認證

所有寫入端點（`POST`／`PUT`／`DELETE`）皆標示 `bearerAuth`（JWT Bearer Token），讀取端點維持公開存取，對應網站前台為公開監測資訊看板的特性。

## 待辦事項

- [ ] 建立對應 SD Doc，明確定義業務規則（如警示閾值判定邏輯、灌注目標量來源）
- [ ] 建立 DB Schema，確認資料表結構與 `swagger.json` 欄位型別一致
- [ ] 依 SD Doc／DB Schema 結果檢視本規格是否需要調整
