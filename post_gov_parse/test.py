import datetime
import time
from pytz import timezone

while True:
    time_now = datetime.datetime.now(timezone('UTC'))
    print(time_now.hour)
    time.sleep(5)