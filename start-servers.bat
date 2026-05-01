@echo off
setlocal enabledelayedexpansion

set NPM_PATH=C:\Users\USER\AppData\Local\Google\Chrome\Application\nodejs\node-v24.14.0-win-x64\npm.cmd

echo Installing backend dependencies...
cd /d "C:\Users\USER\Downloads\vanstracapital\backend"
call "!NPM_PATH!" install
if %errorlevel% neq 0 (
  echo Failed to install backend dependencies
  pause
  exit /b 1
)

echo Installing frontend dependencies...
cd /d "C:\Users\USER\Downloads\vanstracapital\frontend"
call "!NPM_PATH!" install
if %errorlevel% neq 0 (
  echo Failed to install frontend dependencies
  pause
  exit /b 1
)

echo.
echo ========================================
echo Starting servers...
echo ========================================
echo.

REM Start backend in a new window
cd /d "C:\Users\USER\Downloads\vanstracapital\backend"
start "Backend Server" cmd /k "call "!NPM_PATH!" start"

REM Give backend time to start
timeout /t 3 /nobreak

REM Start frontend in a new window
cd /d "C:\Users\USER\Downloads\vanstracapital\frontend"
start "Frontend Server" cmd /k "call "!NPM_PATH!" start"

echo.
echo ========================================
echo Servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.

endlocal
