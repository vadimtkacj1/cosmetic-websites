# dev.ps1 - запускає всі сайти локально
# Usage: .\dev.ps1

$root = "C:\Users\vadim\Downloads\maayan\sites"

# Static sites - npx serve
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx serve '$root\maayan-cosmetics.com' -l 3001"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx serve '$root\hofit-barbershop.com' -l 3002"

# Next.js
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\irena-beauty.com'; npm run dev"

Write-Host ""
Write-Host "Sites running:" -ForegroundColor Green
Write-Host "  maayan-cosmetics.com  ->  http://localhost:3001" -ForegroundColor Cyan
Write-Host "  hofit-barbershop.com  ->  http://localhost:3002" -ForegroundColor Cyan
Write-Host "  irena-beauty.com      ->  http://localhost:4028" -ForegroundColor Cyan
Write-Host ""
