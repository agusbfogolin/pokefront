@echo off
title Pokemon Frontera
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel%==0 (
  node servidor.mjs
  goto fin
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8123/
  python -m http.server 8123 --bind 127.0.0.1 --directory dist
  goto fin
)
echo No se encontro Node.js ni Python. Instala Node.js desde https://nodejs.org y vuelve a abrir este archivo.
:fin
pause
