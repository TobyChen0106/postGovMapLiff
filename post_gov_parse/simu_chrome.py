# import requests
# import bs4

# url = 'https://ecounter.post.gov.tw/RS_PhoneLogin.aspx'
# data_url = 'https://ecounter.post.gov.tw/RS_OnlineNo_SelectBranch.aspx'
# headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36', "Upgrade-Insecure-Requests": "1","DNT": "1","Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Accept-Language": "en-US,en;q=0.5","Accept-Encoding": "gzip, deflate"}
# payload = {'txt_phone_number': '0911805469'}

# session_requests = requests.session()
# result = session_requests.post(
# 	data_url,
# 	data = payload,
# 	headers = headers,
# )

# result = session_requests.get(data_url,headers=headers)
# print(result.text)

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


webpage = "https://ecounter.post.gov.tw/RS_PhoneLogin.aspx"
checkpage = "https://ecounter.post.gov.tw/RS_OnlineNo_SelectBranch.aspx"
phone_num = "0911805469"

# op = webdriver.ChromeOptions()
# op.add_argument('headless')
# driver = webdriver.Chrome(options=op)
options = webdriver.ChromeOptions()
prefs = {'profile.default_content_setting_values': {'cookies': 2, 'images': 2, 'javascript': 2,
                                                    'plugins': 2, 'popups': 2, 'geolocation': 2,
                                                    'notifications': 2, 'auto_select_certificate': 2, 'fullscreen': 2,
                                                    'mouselock': 2, 'mixed_script': 2, 'media_stream': 2,
                                                    'media_stream_mic': 2, 'media_stream_camera': 2, 'protocol_handlers': 2,
                                                    'ppapi_broker': 2, 'automatic_downloads': 2, 'midi_sysex': 2,
                                                    'push_messaging': 2, 'ssl_cert_decisions': 2, 'metro_switch_to_desktop': 2,
                                                    'protected_media_identifier': 2, 'app_banner': 2, 'site_engagement': 2,
                                                    'durable_storage': 2}}
options.add_experimental_option('prefs', prefs)
options.add_argument("start-maximized")
options.add_argument("disable-infobars")
options.add_argument("--disable-extensions")

# options.add_argument('headless')
# driver = webdriver.Chrome(options=options)

driver = webdriver.Firefox()
driver.get(checkpage)

# print(driver.page_source)
try:
    agree_radio = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "checkbox1"))
    )

finally:
    # input phone num
    sbox = driver.find_element_by_id("txt_phone_number")
    sbox.send_keys(phone_num)

    # click checkbox
    driver.execute_script("arguments[0].scrollIntoView(true);", agree_radio)
    agree_radio.click()

    # login
    submit = driver.find_element_by_id("btnLogin")
    submit.click()

    print(driver.page_source)
    driver.quit()


# agree_radio=driver.find_element_by_id("checkbox1")
# agree_radio = driver.find_element_by_css_selector("input#checkbox1")


# print(driver.page_source)


# driver.quit()

# with req.urlopen(url) as response:

#     data = response.read().decode("utf-8")
# root = bs4.BeautifulSoup(data, 'html.parser')


# print(root)
