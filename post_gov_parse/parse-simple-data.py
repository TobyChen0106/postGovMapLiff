import urllib.request as req
import bs4
import pymongo

from PIL import Image
import base64
from io import BytesIO
from w3lib.url import safe_url_string

import json
import time

def getImage(img_url):
    img = Image.open(req.urlopen(img_url))
    output_buffer = BytesIO()
    img.save(output_buffer, format='PNG')
    byte_data = output_buffer.getvalue()
    return base64.b64encode(byte_data)


def parsePage(url, id=0):
    cardDataTree = {
        "cardID":id,
        "cardName":"",
        "cardBank":"empty",
        "imageUrl":0,
        "imageRotate":False,
        "imageLocal":0,
        "offer":{
        },
        "note":{
            "updateTime":"",
            "updateSource":""
        }
    }

    with req.urlopen(url) as response:
        data = response.read().decode("utf-8")

    root = bs4.BeautifulSoup(data, 'html.parser')
    name = root.find('div', class_='product-name').text
    name = name.split(" ", 1)
    cardDataTree['cardBank'] = name[0]
    cardDataTree['cardName'] = name[1]

    card_image_url = root.find('div', class_="product-page").find('img').get('src')
    
    # cardDataTree['image'] = getImage(card_image_url)
    cardDataTree['imageUrl'] = card_image_url

    # print((card_image_url))
    safe_url = safe_url_string(card_image_url, encoding="utf-8")

    img = Image.open(req.urlopen(safe_url))
    width, height = img.size

    if(height>width):
        cardDataTree['imageRotate'] = True
        # print('### rotate')
    # else:
        # print('### no rotate')
    # note
    update_time = root.find('div',class_='product-updated-at').text
    cardDataTree['note']['updateTime']=update_time[7:]
    cardDataTree['note']['updateSource']=url

    # offers
    benefits = root.find('div', class_='benefits-section')
    benefit_header = benefits.find('div', class_='yrr-column-header')
    
    if(not benefit_header):
        return cardDataTree

    benefit_headers = benefit_header.find_all('div')

    items = benefit_header.nextSibling.find_all('div', class_='yrr-list-item')
    header_items = {}

    for i in items:
        item = i.find('div', class_='yrr-list-item-name')
        item_name = item.text
        
        _item = item
        offers = {}
        for header in benefit_headers:
            if(header.text != ""):
                _item = _item.nextSibling
                item_value = _item.contents[0].text
                item_note = ""
                if(len(_item.contents)>1):
                    item_note = _item.contents[1].text
                offers.update({header.text:{"value":item_value, "note":item_note}})

        header_items.update({item_name:offers})
    cardDataTree['offer'] = header_items

    
    return cardDataTree

# main
url = "all-cards-list.html"
root = bs4.BeautifulSoup(open("all-cards-list.html"), "html.parser")
cardlist = [(i.a.div.div.div.div.h3.string, i.a.get('href')) for i in root.find_all('div', class_='card product-pane')] 

# connect to mongodb atlas
client = pymongo.MongoClient("mongodb+srv://Toby0106:dbforcardbo@cluster0-gfwld.mongodb.net/test?retryWrites=true&w=majority")
db = client["cardbo-db"]
collect = db["poster"]

all_data = {}

# parsePage("https://www.money101.com.tw/%E4%BF%A1%E7%94%A8%E5%8D%A1/%E7%8E%89%E5%B1%B1%E9%8A%80%E8%A1%8C%E5%BC%98%E5%AE%89%E8%97%A5%E7%B2%A7%E8%81%AF%E5%90%8D%E5%8D%A1?entry=header&from=%E5%85%A8%E9%83%A8")
for i, card in enumerate(cardlist):
    print('\n\nsolving card %03d/%03d ... [%s]'%(i+1, len(cardlist), card[0]))
    print('parsing url: ', card[1])
    card_data = parsePage(card[1], i)
    all_data.update({card_data["cardBank"]+'-'+card_data["cardName"]:card_data})
    
    # insert data to db
    post_id = collect.insert_one(card_data).inserted_id
    print(len(all_data), ' card data postID:　',post_id)

# out_json = json.dumps(all_data, ensure_ascii=False)
# with open('card-data.json', 'w') as outfile:
#     json.dump(out_json, outfile)