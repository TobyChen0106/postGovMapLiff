import re
import bs4
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary

def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 100, fill = '█', printEnd = "\r"):
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print(f'\r{prefix} |{bar}| {percent}% {suffix}', end = printEnd)
    # Print New Line on Complete
    if iteration == total: 
        print()

def get_option_list(driver, id, exclude="請選擇"):
    selector = driver.find_element_by_id(id)
    _list = []
    for option in selector.find_elements_by_tag_name("option"):
        if(option.text != exclude):
            _list.append(option.text)
    return _list

def parsePosterData(checkpage, phone_num="0123456789", num_poster = 616, full=True):
    try:
        options = Options()
        options.headless = True

        driver = webdriver.Firefox( options=options)
        driver.get(checkpage)
        data_list = []

        # input phone num
        sbox = driver.find_element_by_id("txt_phone_number")
        sbox.send_keys(phone_num)

        # click checkbox
        agree_radio = driver.find_element_by_id("checkbox1")
        agree_radio.click()

        # login
        submit = driver.find_element_by_id("btnLogin")
        submit.click()

        city_list = get_option_list(driver, "ddlCity")

        poster_counter = 0
        for c, city in enumerate(city_list):
            # city_select = driver.find_element_by_id("ddlCity")
            try:
                city_select = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "ddlCity")))
            except TimeoutException:
                print("[SELECT CITY] Timeout <%s>"%(city))
                continue
            for city_option in city_select.find_elements_by_tag_name("option"):
                if(city_option.text == city):
                    city_option.click()  # select() in earlier versions of webdriver

                    district_list = get_option_list(driver, "ddlDistrict")

                    for d, district in enumerate(district_list):
                        # district_select = driver.find_element_by_id("ddlDistrict")
                        try:
                            district_select = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "ddlDistrict")))
                        except TimeoutException:
                            print("[SELECT DISTRICT] Timeout <%s/%s>"%(city, district))
                            continue
                        for district_option in district_select.find_elements_by_tag_name("option"):
                            if(district_option.text == district):
                                # click search
                                district_option.click()
                                
                                # btnSearch
                                submit = driver.find_element_by_id("btnSearch")
                                submit.click()
                                try:
                                    flag = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//button[@class='btn btn-primary btn-lg active']")))
                                except TimeoutException:
                                    print("[SEARCH] Timeout <%s/%s>"%(city, district))
                                    break
                                root = bs4.BeautifulSoup(driver.page_source, "html.parser")
                                cards = root.find_all("div", class_="row main2-s-list")
                                poster_data = []
                                for c in cards:
                                    title = c.contents[0].find("a")
                                    onclick = title["onclick"]
                                    title = title.text

                                    info = c.contents[1].find("div", {"id": "codeinfo"}).text
                                    infos = re.split(" |：|/",info)
                                    # ["儲匯業務", "目前叫號", "313", "等待人數", "0"]
                                    phone = c.contents[1].find("a").text
                                    phone = re.split("：",phone)[1]

                                    branchinfo = c.contents[1].find("span",{"id": "branchinfo"}).text
                                    branchinfo = re.split("：",branchinfo)[1]

                                    poster_data.append({ "poster_name":title, "type":infos[0], "current_num":infos[2], "waiting_num":infos[4], "telephone_num":phone, "address":branchinfo, "onclick":onclick })
                                    
                                for poster in poster_data:
                                    #### PRINT ####
                                    poster_counter=poster_counter+1
                                    printProgressBar(poster_counter, num_poster, prefix="SOLVING", suffix=f"  {city}-{district}-{poster['poster_name']}          ")
                                    #### PRINT ####
                                    if(full):
                                        driver.execute_script(poster["onclick"])
                                        try:
                                            flag = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "labelBRHName")))
                                        except TimeoutException:
                                            print("[Get Update Time] Timeout <%s>"%poster["poster_name"])
                                            break
                                        root_for_update = bs4.BeautifulSoup(driver.page_source, "html.parser")
                                        update_time_el = root_for_update.find(id="labelLastUpdate")
                                        if(update_time_el):
                                            updateTime = update_time_el.text
                                        poster["update_time"] = updateTime
                                        driver.back()
                                        
                                    data_list.append(poster.copy())

                                break
                        driver.back()
                    break
        driver.quit()
    except:
        driver.quit()
        
    return data_list

if __name__ == "__main__":
    webpage = "https://ecounter.post.gov.tw/RS_PhoneLogin.aspx"
    checkpage = "https://ecounter.post.gov.tw/RS_OnlineNo_SelectBranch.aspx"
    phone_num = "0911805479"
    data = parsePosterData(checkpage, phone_num, full=False)
    

    for d in data:
        print(d)
    print(len(data))

