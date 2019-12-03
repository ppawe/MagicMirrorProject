import json
import time
import os

data = {"nfc": 1234}
with open("nfc.json", "w") as f:
    json.dump(data, f)
    
json.dumps(data)
time.sleep(5)
os.remove("nfc.json")