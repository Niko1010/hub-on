@echo off
setlocal
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONUNBUFFERED=1
if not exist ".venv\Scripts\python.exe" (
  echo Run INSTALL_WINDOWS.cmd first. Do not use the Linux cloud virtual environment.
  pause
  exit /b 1
)
".venv\Scripts\python.exe" scripts\start_local.py %*
if errorlevel 1 pause
