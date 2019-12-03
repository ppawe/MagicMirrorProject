import time
from subprocess import call
import subprocess
import os
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

button = 4

GPIO.setup(button, GPIO.IN, GPIO.PUD_UP)

sessionStarted = False
chromiumStarted = False

while True:
    button_state = GPIO.input(button)
    if button_state == GPIO.LOW:
        if not sessionStarted:
            # if not chromiumStarted:
            subprocess.Popen('/usr/lib/chromium-browser/chromium-browser --kiosk https://jitsi.test.domain/Notfallsession &', shell=True).communicate()[0]
            # chromiumStarted = True
            time.sleep(4)
            os.system("lxterminal -e 'pm2 stop mm'")
            sessionStarted = True
            
        else:
            os.system("lxterminal -e 'pm2 start mm' &")
            time.sleep(10)
            os.system("lxterminal -e 'pkill -f -- \"chromium-browser\"'")
            sessionStarted = False
        time.sleep(5)
