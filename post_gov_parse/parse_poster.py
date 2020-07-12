from firefox import *
import pymongo
from bson import BSON
from CardboDB import CardboDB
import re
import pickle
from bson.objectid import ObjectId
import datetime
from pytz import timezone

def load_obj(name ):
    with open(name, 'rb') as f:
        return pickle.load(f)

db = CardboDB(
    "mongodb+srv://cardbo:69541@cardbo-br3ga.gcp.mongodb.net/dbCardbo?retryWrites=true&w=majority", "dbCardbo")
# mongodb+srv://cardbo:<password>@cardbo-br3ga.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority

webpage = "https://ecounter.post.gov.tw/RS_PhoneLogin.aspx"
checkpage = "https://ecounter.post.gov.tw/RS_OnlineNo_SelectBranch.aspx"
phone_num = "0911234568"

# data = load_obj('data.pkl')
# with open('data.pkl', 'wb') as f:
#     pickle.dump(data, f, pickle.HIGHEST_PROTOCOL)

while(True):
    time_now = datetime.datetime.now(timezone('Asia/Taipei'))
    data = parsePosterData(checkpage, phone_num, full=False)
    
    # insert data to db
    allPost = db.getData("postoffices")

    count = 0
    for p in allPost:
        # print(p["storeNm"])
        post_name = re.split(re.escape('('), p["storeNm"])[0]
        post_tel = p["tel"]
        matches = [d for d in data if d["telephone_num"] == post_tel]

        if(len(matches) == 0):
            if(p["nowWaiting"] != -1):
                print("-1 changed", p)
                db.updateOneById("postoffices", ObjectId(p['_id']), {"nowWaiting": -1})
            if(p["nowCalling"] != -1):
                print("-1 changed", p)
                db.updateOneById("postoffices", ObjectId(p['_id']), {"nowCalling": -1})
        elif(len(matches) == 1):
            time = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')
            if(p["nowWaiting"] != matches[0]['waiting_num']):
                count=count+1
                db.updateOneById("postoffices", ObjectId(p['_id']), {"nowWaiting": matches[0]['waiting_num'], "waitingUpdateTime": time})
            if(p["nowCalling"] != matches[0]['current_num']):
                count=count+1
                db.updateOneById("postoffices", ObjectId(p['_id']), {"nowCalling": matches[0]['current_num'], "waitingUpdateTime": time})
        else:
            print("Error multiple", p)

    print(f"updated time:{datetime.datetime.now()} count:{count}")