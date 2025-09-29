#!/usr/bin/env bash
set -euo pipefail

# Uso:
#   ./run.sh           # build + up
#   ./run.sh rebuild   # fuerza rebuild sin caché
#   ./run.sh logs      # muestra logs
#   ./run.sh down      # baja los servicios
#   ./run.sh reset     # baja y borra volúmenes (⚠ borra datos de DB)

command -v docker >/dev/null || { echo "Docker no instalado"; exit 1; }
docker compose version >/dev/null || { echo "Docker Compose v2 requerido"; exit 1; }

cmd="${1:-up}"

case "$cmd" in
  up)
    docker compose up -d --build
    ;;
  rebuild)
    docker compose build --no-cache
    docker compose up -d
    ;;
  logs)
    docker compose logs -f
    ;;
  down)
    docker compose down
    ;;
  reset)
    docker compose down -v
    ;;
  *)
    echo "Comando no reconocido: $cmd"
    echo "Opciones: up | rebuild | logs | down | reset"
    exit 2
    ;;
esac

echo "✅ Listo. API en http://localhost:8080/api"
