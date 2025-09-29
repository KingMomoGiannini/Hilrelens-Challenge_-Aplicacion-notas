Param(
  [ValidateSet("up","rebuild","logs","down","reset")]
  [string]$cmd = "up"
)

function Check-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    Write-Error "No se encontró '$name' en PATH."
    exit 1
  }
}

Check-Command docker
docker compose version | Out-Null

switch ($cmd) {
  "up"      { docker compose up -d --build }
  "rebuild" { docker compose build --no-cache; docker compose up -d }
  "logs"    { docker compose logs -f }
  "down"    { docker compose down }
  "reset"   { docker compose down -v }
  default   { Write-Error "Comando no reconocido: $cmd"; exit 2 }
}

Write-Host "✅ Listo. API en http://localhost:8080/api"
