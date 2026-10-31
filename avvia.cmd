@echo off
setlocal
cd /d "%~dp0"
title Blueprint - Avvio
echo.
echo AVVIO BLUEPRINT / START BLUEPRINT
echo.
where node >nul 2>&1
if errorlevel 1 (
  echo ERRORE: Node.js non trovato. Installa Node.js 22.18 o successivo.
  echo ERROR: Node.js missing. Install Node.js 22.18 or later.
  goto no_node
)
node scripts\launch.mjs %*
if errorlevel 1 goto errore
exit /b 0
:no_node
set "BLUEPRINT_LOG=%~dp0blueprint-avvio.log"
(>>"%BLUEPRINT_LOG%" echo [%DATE% %TIME%] Node.js non trovato / Node.js missing from PATH.) 2>nul
if errorlevel 1 goto log_temporaneo
if not exist "%BLUEPRINT_LOG%" goto log_temporaneo
goto mostra_log
:log_temporaneo
set "BLUEPRINT_LOG=%TEMP%\blueprint-avvio-no-node.log"
(>>"%BLUEPRINT_LOG%" echo [%DATE% %TIME%] Node.js non trovato / Node.js missing from PATH.) 2>nul
if errorlevel 1 echo Impossibile scrivere il log / Unable to write log.
:mostra_log
echo Log: "%BLUEPRINT_LOG%"
:errore
echo.
echo Avvio fallito. Consulta il log indicato / Startup failed. Consult the displayed log.
echo I progetti nel browser non sono stati modificati / Saved browser projects have not been changed.
if not "%BLUEPRINT_TEST_MODE%"=="1" pause
exit /b 1
