@echo off
cd /d "%~dp0"
start "AMD Offline" http://127.0.0.1:8016/demos/etd-1-1-20261104/?mode=replay#space
python -m http.server 8016 --bind 127.0.0.1
