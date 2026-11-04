@echo off
setlocal
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONUNBUFFERED=1
echo HUB ONE - Windows CPU setup
echo This installs dependencies and downloads verified models. Internet is required.
where py >nul 2>&1
if errorlevel 1 goto missing_python
py -3.12 --version
if errorlevel 1 goto missing_python
where ffmpeg >nul 2>&1
if errorlevel 1 goto missing_ffmpeg
where ffprobe >nul 2>&1
if errorlevel 1 goto missing_ffmpeg
py -3.12 -m venv .venv
if errorlevel 1 goto failed
".venv\Scripts\python.exe" -m pip install torch==2.7.1 torchvision==0.22.1 --index-url https://download.pytorch.org/whl/cpu
if errorlevel 1 goto failed
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto failed
".venv\Scripts\python.exe" scripts\download_models.py
if errorlevel 1 goto failed
".venv\Scripts\python.exe" scripts\generate_samples.py
if errorlevel 1 goto failed
if not exist .env copy .env.example .env >nul
echo.
echo Setup completed. Double-click START_WINDOWS.cmd next.
pause
exit /b 0
:missing_python
echo.
echo Python 3.12 with the Windows py launcher is required.
echo Install Python 3.12 from python.org, then open a new terminal and try again.
pause
exit /b 1
:missing_ffmpeg
echo.
echo ffmpeg and ffprobe are required on PATH.
echo Run: winget install --id Gyan.FFmpeg -e
echo Then close this window and retry in a new window.
pause
exit /b 1
:failed
echo.
echo Setup failed. The actual error is above. Keep this window open for diagnosis.
echo The web page has NOT been started. Do not open localhost yet.
pause
exit /b 1
