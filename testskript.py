import time
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

button = 4

GPIO.setup(button, GPIO.IN, GPIO.PUD_UP)

sessionStarted = False

while True:
    button_state = GPIO.input(button)
    # if button_state == GPIO.LOW:
    #     print('LOW')
    #     time.sleep(0.5)
    print(button_state)