@echo off
setlocal
title Subir Pokemon Frontera a GitHub
cd /d "%~dp0"
set REPO=https://github.com/agusbfogolin/pokefront.git

where git >nul 2>nul
if errorlevel 1 (
  echo No se encontro Git. Instalalo desde https://git-scm.com/download/win y vuelve a abrir este archivo.
  goto fin
)

if not exist .git git init -b main
git config core.autocrlf false
git add -A
git commit -m "Pokemon Frontera: codigo, assets y estilo de juego (game-ui)"
git branch -M main

git remote remove origin >nul 2>nul
git remote add origin %REPO%

echo.
echo Conectando con GitHub (si se abre una ventana para iniciar sesion, aceptala)...
git fetch origin main >nul 2>nul
if not errorlevel 1 (
  echo El repositorio ya tiene contenido: se combina conservando tus archivos locales.
  git merge origin/main --allow-unrelated-histories -X ours --no-edit
)
git push -u origin main
if errorlevel 1 (
  echo.
  echo *** No se pudo subir. Revisa el mensaje de arriba ^(sesion de GitHub, permisos o conexion^). ***
) else (
  echo.
  echo Listo: https://github.com/agusbfogolin/pokefront
)
:fin
echo.
pause
