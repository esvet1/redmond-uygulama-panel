@echo off
cd /d "%~dp0"
call npm install || goto :hata
call npm run dist || goto :hata
echo.
echo Hazir: dist\REDMOND-Proje-Limani.exe
start "" "dist"
pause
exit /b
:hata
echo.
echo Derleme basarisiz. Node.js kurulu mu? https://nodejs.org
pause
