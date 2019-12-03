import json
import time
import signal
import subprocess
import RPi.GPIO as GPIO
import sys
sys.path.append('/home/pi/MFRC522-python')
from mfrc522 import SimpleMFRC522

def to_node(type, message):
    # convert to json and print (node helper will read from stdout)
    try:
        #print(json.dumps({type: message}))
        print(message)
    except Exception:
        pass
    # stdout has to be flushed manually to prevent delays in the node helper communication
    sys.stdout.flush()

reader = SimpleMFRC522()

def shutdown(self, signum):
    to_node("status", 'Shutdown...')
    quit()

signal.signal(signal.SIGINT, shutdown)

try:
    while True:
        #print("reading..")
        id,text = reader.read()
        #print(id)
    
        to_node('login', id)
        
        time.sleep(1)
        continue
finally:
    GPIO.cleanup()
    shutdown
