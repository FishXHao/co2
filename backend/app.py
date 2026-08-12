"""Flask backend implementing all endpoints defined in documents/api-docs.

Covers two specs:
- swagger.json                 -> 登入系統 API (Auth / Health / User)
- carbon-capture-swagger.json   -> 碳捕捉與封存監測 API

Data is stored in-memory (no DB yet, per db-schema/README.md TODO for
carbon-capture) and is reset whenever the process restarts.
"""
import uuid
from datetime import datetime, timezone
from functools import wraps

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PORT = 8000

# ---------------------------------------------------------------------------
# In-memory data stores
# ---------------------------------------------------------------------------

USERS = [
    {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "username": "admin",
        "password": "password123",
        "email": "admin@example.com",
        "isActive": True,
        "isLocked": False,
        "createdAt": "2026-01-01T00:00:00.000Z",
        "lastLoginAt": None,
    },
    {
        "userId": "550e8400-e29b-41d4-a716-446655440001",
        "username": "user",
        "password": "123456",
        "email": "user@example.com",
        "isActive": True,
        "isLocked": False,
        "createdAt": "2026-01-01T00:00:00.000Z",
        "lastLoginAt": None,
    },
    {
        "userId": "550e8400-e29b-41d4-a716-446655440002",
        "username": "test",
        "password": "test123",
        "email": "test@example.com",
        "isActive": True,
        "isLocked": False,
        "createdAt": "2026-01-01T00:00:00.000Z",
        "lastLoginAt": None,
    },
]

# token -> username, issued on successful /api/login
TOKENS = {}

STATIONS = [
    {"stationId": "ATM-001", "name": "城中站", "type": "atmosphere",
     "location": {"latitude": 23.0468, "longitude": 120.2148}},
    {"stationId": "ATM-002", "name": "梅南里站", "type": "atmosphere",
     "location": {"latitude": 23.0512, "longitude": 120.2201}},
    {"stationId": "ATM-003", "name": "坪頂站", "type": "atmosphere",
     "location": {"latitude": 23.0397, "longitude": 120.2255}},
    {"stationId": "SOIL-001", "name": "封存場站", "type": "soil_gas",
     "location": {"latitude": 23.0450, "longitude": 120.2300}},
    {"stationId": "GW-001", "name": "封存場站", "type": "groundwater_quality",
     "location": {"latitude": 23.0450, "longitude": 120.2300}},
    {"stationId": "SEIS-001", "name": "封存場站", "type": "seismic",
     "location": {"latitude": 23.0450, "longitude": 120.2300}},
]

# monitoring type -> list of MonitoringReading dicts (latest last)
READINGS = {
    "atmosphere": [
        {"stationId": "ATM-001", "stationName": "城中站", "value": 418.2, "unit": "ppm",
         "baseline": 400.0, "thresholdMax": 450.0, "status": "normal",
         "recordedAt": "2026-08-12T08:00:00.000Z"},
        {"stationId": "ATM-002", "stationName": "梅南里站", "value": 421.5, "unit": "ppm",
         "baseline": 400.0, "thresholdMax": 450.0, "status": "normal",
         "recordedAt": "2026-08-12T08:00:00.000Z"},
        {"stationId": "ATM-003", "stationName": "坪頂站", "value": 455.9, "unit": "ppm",
         "baseline": 400.0, "thresholdMax": 450.0, "status": "warning",
         "recordedAt": "2026-08-12T08:00:00.000Z"},
    ],
    "soil_gas": [
        {"stationId": "SOIL-001", "stationName": "封存場站", "value": 2.3, "unit": "%",
         "baseline": 0.5, "thresholdMax": 5.0, "status": "normal",
         "recordedAt": "2026-08-12T08:00:00.000Z"},
    ],
    "groundwater_quality": [
        {"stationId": "GW-001", "stationName": "封存場站", "value": 7.1, "unit": "pH",
         "baseline": 6.5, "thresholdMax": 8.5, "status": "normal",
         "recordedAt": "2026-08-12T08:00:00.000Z"},
    ],
    "seismic": [
        {"stationId": "SEIS-001", "stationName": "封存場站", "value": 0.8, "unit": "ML",
         "baseline": 0.0, "thresholdMax": 3.0, "status": "normal",
         "recordedAt": "2026-08-12T08:00:00.000Z"},
    ],
}

INJECTION_TARGET_TONS = 300000.0

INJECTION_RECORDS = [
    {"recordId": str(uuid.uuid4()), "date": "2026-08-10", "volumeTons": 120.5},
    {"recordId": str(uuid.uuid4()), "date": "2026-08-11", "volumeTons": 118.2},
    {"recordId": str(uuid.uuid4()), "date": "2026-08-12", "volumeTons": 125.0},
]

PERIODIC_MONITORING_REPORTS = [
    {"reportId": str(uuid.uuid4()), "category": "ecology", "title": "生態監測季報",
     "summary": "本季生態監測未發現異常物種變化。", "reportDate": "2026-07-31",
     "attachmentUrl": "https://example.com/reports/ecology-2026-q2.pdf"},
    {"reportId": str(uuid.uuid4()), "category": "traffic", "title": "交通量監測月報",
     "summary": "施工車輛進出流量維持穩定。", "reportDate": "2026-07-31",
     "attachmentUrl": "https://example.com/reports/traffic-2026-07.pdf"},
    {"reportId": str(uuid.uuid4()), "category": "noise", "title": "環境噪音監測月報",
     "summary": "各測點噪音值均低於法規標準。", "reportDate": "2026-07-31",
     "attachmentUrl": "https://example.com/reports/noise-2026-07.pdf"},
    {"reportId": str(uuid.uuid4()), "category": "groundwater", "title": "地下水定期監測月報",
     "summary": "地下水水質各項指標正常。", "reportDate": "2026-07-31",
     "attachmentUrl": "https://example.com/reports/groundwater-2026-07.pdf"},
]

KNOWLEDGE_ARTICLES = [
    {"articleId": str(uuid.uuid4()), "category": "environmental_measure", "title": "環保對策概觀",
     "content": "介紹碳封存場址的環境保護對策與監測機制。",
     "publishedAt": "2026-06-01T00:00:00.000Z"},
    {"articleId": str(uuid.uuid4()), "category": "storage_encyclopedia", "title": "碳封存小百科",
     "content": "說明二氧化碳地質封存的基本原理。",
     "publishedAt": "2026-06-15T00:00:00.000Z"},
    {"articleId": str(uuid.uuid4()), "category": "international_case", "title": "國際案例分享",
     "content": "彙整國際間碳捕捉與封存示範場域案例。",
     "publishedAt": "2026-07-01T00:00:00.000Z"},
]

EDUCATIONAL_VIDEOS = [
    {"videoId": str(uuid.uuid4()), "title": "碳來源科普影片",
     "thumbnailUrl": "https://example.com/thumbs/carbon-source.jpg",
     "videoUrl": "https://www.youtube.com/watch?v=example1"},
    {"videoId": str(uuid.uuid4()), "title": "碳捕捉技術介紹",
     "thumbnailUrl": "https://example.com/thumbs/carbon-capture.jpg",
     "videoUrl": "https://www.youtube.com/watch?v=example2"},
    {"videoId": str(uuid.uuid4()), "title": "碳封存（陸域）科普影片",
     "thumbnailUrl": "https://example.com/thumbs/onshore-storage.jpg",
     "videoUrl": "https://www.youtube.com/watch?v=example3"},
]

MONITORING_TYPES = ("atmosphere", "soil_gas", "groundwater_quality", "seismic")
PERIODIC_CATEGORIES = ("ecology", "traffic", "noise", "groundwater")
KNOWLEDGE_CATEGORIES = ("environmental_measure", "storage_encyclopedia", "international_case")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + \
        f"{datetime.now(timezone.utc).microsecond // 1000:03d}Z"


def login_error(message, status_code, error_code=None):
    body = {"success": False, "message": message}
    if error_code:
        body["errorCode"] = error_code
    return jsonify(body), status_code


def cc_error(message, status_code, code=None):
    body = {"message": message}
    if code:
        body["code"] = code
    return jsonify(body), status_code


def require_login_auth(f):
    """Bearer auth guard for swagger.json (/api/logout, /api/users/*)."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "") if auth_header.startswith("Bearer ") else None
        if not token or token not in TOKENS:
            return login_error("未認證", 401, "UNAUTHENTICATED")
        request.current_username = TOKENS[token]
        return f(*args, **kwargs)
    return wrapper


def require_cc_auth(f):
    """Bearer auth guard for carbon-capture write endpoints."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "") if auth_header.startswith("Bearer ") else None
        if not token or token not in TOKENS:
            return cc_error("未認證", 401, "UNAUTHORIZED")
        request.current_username = TOKENS[token]
        return f(*args, **kwargs)
    return wrapper


def find_user(username=None, user_id=None):
    for u in USERS:
        if username is not None and u["username"] == username:
            return u
        if user_id is not None and u["userId"] == user_id:
            return u
    return None


def user_detail_payload(user):
    return {
        "userId": user["userId"],
        "username": user["username"],
        "email": user["email"],
        "isActive": user["isActive"],
        "isLocked": user["isLocked"],
        "createdAt": user["createdAt"],
        "lastLoginAt": user["lastLoginAt"],
    }


def determine_status(value, baseline, threshold_max):
    if threshold_max is not None and value > threshold_max:
        return "warning"
    if baseline is not None and value < baseline:
        return "warning"
    return "normal"


def find_station(station_id):
    return next((s for s in STATIONS if s["stationId"] == station_id), None)


def filter_by_date(records, date_field, start_date, end_date):
    result = records
    if start_date:
        result = [r for r in result if r[date_field] >= start_date]
    if end_date:
        result = [r for r in result if r[date_field] <= end_date]
    return result


# ---------------------------------------------------------------------------
# Auth / Health / User routes (swagger.json)
# ---------------------------------------------------------------------------

@app.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return login_error("請輸入帳號和密碼", 400)

    user = find_user(username=username)
    if not user or user["password"] != password:
        return login_error("帳號或密碼錯誤", 401, "INVALID_CREDENTIALS")

    user["lastLoginAt"] = now_iso()
    token = uuid.uuid4().hex
    TOKENS[token] = user["username"]

    return jsonify({
        "success": True,
        "message": "登入成功",
        "user": {"username": user["username"], "userId": user["userId"], "email": user["email"]},
        "token": token,
    }), 200


@app.get("/api/health")
def health_check():
    return jsonify({
        "status": "ok",
        "message": "Server is running",
        "timestamp": now_iso(),
    }), 200


@app.post("/api/logout")
@require_login_auth
def logout():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "")
    TOKENS.pop(token, None)
    return jsonify({"success": True, "message": "登出成功", "timestamp": now_iso()}), 200


@app.get("/api/users/me")
@require_login_auth
def get_current_user():
    user = find_user(username=request.current_username)
    if not user:
        return login_error("使用者不存在", 404)
    return jsonify({"success": True, "data": user_detail_payload(user)}), 200


@app.get("/api/users/<user_id>")
@require_login_auth
def get_user_by_id(user_id):
    user = find_user(user_id=user_id)
    if not user:
        return login_error("使用者不存在", 404)
    return jsonify({"success": True, "data": user_detail_payload(user)}), 200


# ---------------------------------------------------------------------------
# InjectionVolume routes
# ---------------------------------------------------------------------------

@app.get("/api/carbon-capture/injection-volumes/summary")
def get_injection_volume_summary():
    today = "2026-08-12"
    month_prefix = today[:7]
    daily = next((r["volumeTons"] for r in INJECTION_RECORDS if r["date"] == today), None)
    monthly = sum(r["volumeTons"] for r in INJECTION_RECORDS if r["date"].startswith(month_prefix))
    cumulative = sum(r["volumeTons"] for r in INJECTION_RECORDS)

    return jsonify({
        "date": today,
        "dailyVolumeTons": daily,
        "monthlyVolumeTons": monthly,
        "cumulativeVolumeTons": cumulative,
        "targetVolumeTons": INJECTION_TARGET_TONS,
    }), 200


@app.route("/api/carbon-capture/injection-records", methods=["GET", "POST"])
def injection_records():
    if request.method == "GET":
        start_date = request.args.get("startDate")
        end_date = request.args.get("endDate")
        records = filter_by_date(INJECTION_RECORDS, "date", start_date, end_date)
        return jsonify(records), 200

    return create_injection_record()


@require_cc_auth
def create_injection_record():
    data = request.get_json(silent=True) or {}
    date = data.get("date")
    volume_tons = data.get("volumeTons")

    if not date or volume_tons is None:
        return cc_error("date 與 volumeTons 為必填欄位", 400, "VALIDATION_ERROR")

    record = {"recordId": str(uuid.uuid4()), "date": date, "volumeTons": volume_tons}
    INJECTION_RECORDS.append(record)
    return jsonify(record), 201


# ---------------------------------------------------------------------------
# Station routes
# ---------------------------------------------------------------------------

@app.route("/api/carbon-capture/stations", methods=["GET", "POST"])
def stations_collection():
    if request.method == "GET":
        station_type = request.args.get("type")
        result = STATIONS
        if station_type:
            result = [s for s in result if s["type"] == station_type]
        return jsonify(result), 200

    return create_station()


@require_cc_auth
def create_station():
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    station_type = data.get("type")

    if not name or station_type not in MONITORING_TYPES:
        return cc_error("name 為必填且 type 需為有效監測類型", 400, "VALIDATION_ERROR")

    station = {
        "stationId": f"ST-{uuid.uuid4().hex[:8]}",
        "name": name,
        "type": station_type,
        "location": data.get("location", {}),
    }
    STATIONS.append(station)
    return jsonify(station), 201


@app.route("/api/carbon-capture/stations/<station_id>", methods=["GET", "PUT", "DELETE"])
def station_item(station_id):
    if request.method == "GET":
        station = find_station(station_id)
        if not station:
            return cc_error("找不到站點", 404, "NOT_FOUND")
        return jsonify(station), 200

    if request.method == "PUT":
        return update_station(station_id)

    return delete_station(station_id)


@require_cc_auth
def update_station(station_id):
    station = find_station(station_id)
    if not station:
        return cc_error("找不到站點", 404, "NOT_FOUND")

    data = request.get_json(silent=True) or {}
    name = data.get("name")
    station_type = data.get("type")
    if not name or station_type not in MONITORING_TYPES:
        return cc_error("name 為必填且 type 需為有效監測類型", 400, "VALIDATION_ERROR")

    station["name"] = name
    station["type"] = station_type
    station["location"] = data.get("location", station.get("location", {}))
    return jsonify(station), 200


@require_cc_auth
def delete_station(station_id):
    station = find_station(station_id)
    if not station:
        return cc_error("找不到站點", 404, "NOT_FOUND")
    STATIONS.remove(station)
    return "", 204


# ---------------------------------------------------------------------------
# Generic monitoring reading handlers (atmosphere / soil-gas / groundwater / seismic)
# ---------------------------------------------------------------------------

def list_readings(monitoring_type):
    return jsonify(READINGS[monitoring_type]), 200


@require_cc_auth
def create_reading(monitoring_type):
    data = request.get_json(silent=True) or {}
    station_id = data.get("stationId")
    value = data.get("value")
    unit = data.get("unit")
    recorded_at = data.get("recordedAt")

    if not station_id or value is None or not unit or not recorded_at:
        return cc_error("stationId、value、unit、recordedAt 為必填欄位", 400, "VALIDATION_ERROR")

    station = find_station(station_id)
    if not station or station["type"] != monitoring_type:
        return cc_error("找不到符合監測類型的站點", 400, "INVALID_STATION")

    previous = next((r for r in READINGS[monitoring_type] if r["stationId"] == station_id), None)
    baseline = previous["baseline"] if previous else None
    threshold_max = previous["thresholdMax"] if previous else None

    reading = {
        "stationId": station_id,
        "stationName": station["name"],
        "value": value,
        "unit": unit,
        "baseline": baseline,
        "thresholdMax": threshold_max,
        "status": determine_status(value, baseline, threshold_max),
        "recordedAt": recorded_at,
    }
    READINGS[monitoring_type].append(reading)
    return jsonify(reading), 201


def reading_history(monitoring_type, station_id):
    station = find_station(station_id)
    if not station or station["type"] != monitoring_type:
        return cc_error("找不到資源", 404, "NOT_FOUND")

    start_date = request.args.get("startDate")
    end_date = request.args.get("endDate")
    history = [r for r in READINGS[monitoring_type] if r["stationId"] == station_id]
    history = [r for r in history if (not start_date or r["recordedAt"][:10] >= start_date)
               and (not end_date or r["recordedAt"][:10] <= end_date)]
    return jsonify(history), 200


@app.route("/api/carbon-capture/monitoring/atmosphere", methods=["GET", "POST"])
def atmosphere_readings():
    if request.method == "GET":
        return list_readings("atmosphere")
    return create_reading("atmosphere")


@app.get("/api/carbon-capture/monitoring/atmosphere/<station_id>/history")
def atmosphere_history(station_id):
    return reading_history("atmosphere", station_id)


@app.route("/api/carbon-capture/monitoring/soil-gas", methods=["GET", "POST"])
def soil_gas_readings():
    if request.method == "GET":
        return list_readings("soil_gas")
    return create_reading("soil_gas")


@app.get("/api/carbon-capture/monitoring/soil-gas/<station_id>/history")
def soil_gas_history(station_id):
    return reading_history("soil_gas", station_id)


@app.route("/api/carbon-capture/monitoring/groundwater-quality", methods=["GET", "POST"])
def groundwater_readings():
    if request.method == "GET":
        return list_readings("groundwater_quality")
    return create_reading("groundwater_quality")


@app.get("/api/carbon-capture/monitoring/groundwater-quality/<station_id>/history")
def groundwater_history(station_id):
    return reading_history("groundwater_quality", station_id)


@app.route("/api/carbon-capture/monitoring/seismic", methods=["GET", "POST"])
def seismic_readings():
    if request.method == "GET":
        return list_readings("seismic")
    return create_reading("seismic")


# ---------------------------------------------------------------------------
# Periodic monitoring reports
# ---------------------------------------------------------------------------

@app.get("/api/carbon-capture/periodic-monitorings")
def list_periodic_monitorings():
    category = request.args.get("category")
    result = PERIODIC_MONITORING_REPORTS
    if category:
        result = [r for r in result if r["category"] == category]
    return jsonify(result), 200


@app.get("/api/carbon-capture/periodic-monitorings/<report_id>")
def get_periodic_monitoring_report(report_id):
    report = next((r for r in PERIODIC_MONITORING_REPORTS if r["reportId"] == report_id), None)
    if not report:
        return cc_error("找不到資源", 404, "NOT_FOUND")
    return jsonify(report), 200


# ---------------------------------------------------------------------------
# Knowledge articles
# ---------------------------------------------------------------------------

@app.route("/api/carbon-capture/knowledge-articles", methods=["GET", "POST"])
def knowledge_articles():
    if request.method == "GET":
        category = request.args.get("category")
        result = KNOWLEDGE_ARTICLES
        if category:
            result = [a for a in result if a["category"] == category]
        return jsonify(result), 200

    return create_knowledge_article()


@require_cc_auth
def create_knowledge_article():
    data = request.get_json(silent=True) or {}
    category = data.get("category")
    title = data.get("title")
    content = data.get("content")

    if category not in KNOWLEDGE_CATEGORIES or not title or not content:
        return cc_error("category、title、content 為必填欄位", 400, "VALIDATION_ERROR")

    article = {
        "articleId": str(uuid.uuid4()),
        "category": category,
        "title": title,
        "content": content,
        "publishedAt": now_iso(),
    }
    KNOWLEDGE_ARTICLES.append(article)
    return jsonify(article), 201


@app.get("/api/carbon-capture/knowledge-articles/<article_id>")
def get_knowledge_article(article_id):
    article = next((a for a in KNOWLEDGE_ARTICLES if a["articleId"] == article_id), None)
    if not article:
        return cc_error("找不到資源", 404, "NOT_FOUND")
    return jsonify(article), 200


# ---------------------------------------------------------------------------
# Educational videos
# ---------------------------------------------------------------------------

@app.route("/api/carbon-capture/videos", methods=["GET", "POST"])
def educational_videos():
    if request.method == "GET":
        return jsonify(EDUCATIONAL_VIDEOS), 200
    return create_educational_video()


@require_cc_auth
def create_educational_video():
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    video_url = data.get("videoUrl")

    if not title or not video_url:
        return cc_error("title 與 videoUrl 為必填欄位", 400, "VALIDATION_ERROR")

    video = {
        "videoId": str(uuid.uuid4()),
        "title": title,
        "thumbnailUrl": data.get("thumbnailUrl"),
        "videoUrl": video_url,
    }
    EDUCATIONAL_VIDEOS.append(video)
    return jsonify(video), 201


@app.get("/api/carbon-capture/videos/<video_id>")
def get_educational_video(video_id):
    video = next((v for v in EDUCATIONAL_VIDEOS if v["videoId"] == video_id), None)
    if not video:
        return cc_error("找不到資源", 404, "NOT_FOUND")
    return jsonify(video), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
