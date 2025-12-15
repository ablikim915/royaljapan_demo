import os
import json
from django.conf import settings 


def get_app_version() -> str:
    version = os.getenv("APP_VERSION")
    if version:
        return version.strip()

    backend_json = settings.BASE_DIR / "backend.json"
    if backend_json.exists():
        try:
            data = json.loads(backend_json.read_text(encoding="utf-8"))
            apps = data.get("apps", [])
            if apps and isinstance(apps, list) and len(apps) > 0:
                env = apps[0].get("env", {})
                version = env.get("APP_VERSION")
                if version:
                    return str(version).strip()
        except Exception as e:
            pass


    return "unknown"


def get_health_status():
    return {
        "status": "ok",
        "version": get_app_version()
    }