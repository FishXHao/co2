-- ============================================
-- 碳捕捉與封存監測資料庫架構 (SQL Server)
-- 依 carbon-capture-swagger.json 之 API 規格設計
-- 版本: 1.0.0
-- 更新日期: 2026-08-12
-- ============================================

-- ============================================
-- 1. 監測站點主檔 (Stations)
-- 用途: 各監測類型（大氣／土壤氣體／地下水水質／微震）共用之站點基本資料
-- ============================================
CREATE TABLE Stations (
    StationId NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Type NVARCHAR(30) NOT NULL
        CHECK (Type IN ('atmosphere', 'soil_gas', 'groundwater_quality', 'seismic')),
    Latitude FLOAT NULL,
    Longitude FLOAT NULL,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),

    INDEX IX_Stations_Type (Type)
);

-- ============================================
-- 2. 監測讀值表 (MonitoringReadings)
-- 用途: 大氣 CO2、土壤氣體、地下水水質、微震共用之讀值紀錄
-- ============================================
CREATE TABLE MonitoringReadings (
    ReadingId BIGINT IDENTITY(1,1) PRIMARY KEY,
    StationId NVARCHAR(50) NOT NULL,
    MonitoringType NVARCHAR(30) NOT NULL
        CHECK (MonitoringType IN ('atmosphere', 'soil_gas', 'groundwater_quality', 'seismic')),
    Value FLOAT NOT NULL,
    Unit NVARCHAR(20) NOT NULL,
    Baseline FLOAT NULL,
    ThresholdMax FLOAT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'normal'
        CHECK (Status IN ('normal', 'warning', 'maintenance')),
    RecordedAt DATETIME2(7) NOT NULL,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),

    FOREIGN KEY (StationId) REFERENCES Stations(StationId),
    INDEX IX_MonitoringReadings_Station_RecordedAt (StationId, RecordedAt DESC),
    INDEX IX_MonitoringReadings_Type_RecordedAt (MonitoringType, RecordedAt DESC)
);

-- ============================================
-- 3. 灌注紀錄表 (InjectionRecords)
-- 用途: 逐日二氧化碳灌注量紀錄
-- ============================================
CREATE TABLE InjectionRecords (
    RecordId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RecordDate DATE NOT NULL UNIQUE,
    VolumeTons FLOAT NOT NULL,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),

    INDEX IX_InjectionRecords_RecordDate (RecordDate DESC)
);

-- ============================================
-- 4. 灌注目標設定表 (InjectionTargets)
-- 用途: 累積灌注目標量（例如 300,000 噸），供摘要 API 計算達成率
-- ============================================
CREATE TABLE InjectionTargets (
    TargetId INT IDENTITY(1,1) PRIMARY KEY,
    TargetVolumeTons FLOAT NOT NULL,
    EffectiveFrom DATE NOT NULL,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================
-- 5. 環境定期監測報告表 (PeriodicMonitoringReports)
-- 用途: 生態／交通量／噪音／地下水定期監測報告
-- ============================================
CREATE TABLE PeriodicMonitoringReports (
    ReportId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Category NVARCHAR(20) NOT NULL
        CHECK (Category IN ('ecology', 'traffic', 'noise', 'groundwater')),
    Title NVARCHAR(200) NOT NULL,
    Summary NVARCHAR(MAX) NULL,
    ReportDate DATE NOT NULL,
    AttachmentUrl NVARCHAR(500) NULL,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),

    INDEX IX_PeriodicMonitoringReports_Category_ReportDate (Category, ReportDate DESC)
);

-- ============================================
-- 6. 知識文章表 (KnowledgeArticles)
-- 用途: 環保對策／碳封存小百科／國際案例
-- ============================================
CREATE TABLE KnowledgeArticles (
    ArticleId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Category NVARCHAR(30) NOT NULL
        CHECK (Category IN ('environmental_measure', 'storage_encyclopedia', 'international_case')),
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    PublishedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    CreatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),

    INDEX IX_KnowledgeArticles_Category_PublishedAt (Category, PublishedAt DESC)
);

-- ============================================
-- 7. 科普影音表 (EducationalVideos)
-- 用途: 碳來源／碳捕捉／碳再利用／碳運輸／碳封存科普影音
-- ============================================
CREATE TABLE EducationalVideos (
    VideoId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(200) NOT NULL,
    ThumbnailUrl NVARCHAR(500) NULL,
    VideoUrl NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),

    INDEX IX_EducationalVideos_CreatedAt (CreatedAt DESC)
);

-- ============================================
-- 8. Read Model: 灌注量摘要視圖
-- 用途: 供 GET /injection-volumes/summary 使用
-- ============================================
CREATE VIEW vw_InjectionVolumeSummary AS
SELECT
    CAST(GETUTCDATE() AS DATE) AS SummaryDate,
    (SELECT VolumeTons FROM InjectionRecords WHERE RecordDate = CAST(GETUTCDATE() AS DATE)) AS DailyVolumeTons,
    (
        SELECT SUM(VolumeTons) FROM InjectionRecords
        WHERE YEAR(RecordDate) = YEAR(GETUTCDATE()) AND MONTH(RecordDate) = MONTH(GETUTCDATE())
    ) AS MonthlyVolumeTons,
    (SELECT SUM(VolumeTons) FROM InjectionRecords) AS CumulativeVolumeTons,
    (SELECT TOP 1 TargetVolumeTons FROM InjectionTargets ORDER BY EffectiveFrom DESC) AS TargetVolumeTons;
