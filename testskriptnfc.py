import json
import time
import signal
import subprocess
import RPi.GPIO as GPIO
import sys
sys.path.append('/home/pi/MFRC522-python')
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
    while True:
        id,text = reader.read()
        print(id)
        
        time.sleep(1)
        continue
finally:
    GPIO.cleanup()
    shutdown
