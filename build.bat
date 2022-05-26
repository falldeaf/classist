ECHO Building to target- %1
CALL androidjs build
CALL C:\Users\tmardis\AppData\Local\Android\Sdk\platform-tools\adb -s %1 install .\dist\classist.apk
Start-Sleep -Seconds 1
CALL C:\Users\tmardis\AppData\Local\Android\Sdk\platform-tools\adb -s %1 shell monkey -p com.androidjs.classist 1
powershell -c (New-Object Media.SoundPlayer "C:\Users\tmardis\Downloads\notify.wav").PlaySync();