@echo off
echo =======================================================
echo     Axedrobe E-Commerce Order Management System
echo =======================================================
echo.
echo Checking if Docker is running...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running or not installed.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo.
echo Starting all microservices, databases, and frontend...
echo This might take a minute or two on the first run...
echo.

docker-compose up -d --build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Something went wrong while starting the containers.
    pause
    exit /b 1
)

echo.
echo =======================================================
echo  SUCCESS! All services are up and running!
echo =======================================================
echo.
echo  Website: http://localhost:3000
echo.

:MENU
echo =======================================================
echo  What would you like to do next?
echo =======================================================
echo  1. Stop all services (Shutdown)
echo  2. Restart all services (Reboot)
echo  3. Exit this terminal (Services will keep running in background)
echo.
set /p choice=Enter your choice (1-3): 

if "%choice%"=="1" goto STOP
if "%choice%"=="2" goto RESTART
if "%choice%"=="3" goto END
goto MENU

:STOP
echo Stopping all services...
docker-compose down
echo Services stopped successfully.
pause
exit /b 0

:RESTART
echo Restarting all services...
docker-compose restart
echo Services restarted successfully.
goto MENU

:END
exit /b 0
