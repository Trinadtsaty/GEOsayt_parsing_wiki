import requests
from bs4 import BeautifulSoup
import codecs



def probels(name):
    rep = " "
    name_new=''
    for i in name:
        simvol = i
        if rep in simvol:
            simvol = simvol.replace(simvol, "_")
        name_new+=simvol
    return name_new

def obrabotka(stroka):
    new_stroka=''
    i=0
    while i<100 or stroka[i-1]!='.':
        if stroka[i]=='[':
            i+=3
        else:
            new_stroka +=stroka[i]
            i+=1
    new_stroka=new_stroka + '..'
    return new_stroka

def poisk(name_new):
    url = f'https://ru.wikipedia.org/wiki/{name_new}'
    page = requests.get(url)
    src = page.text
    soup = BeautifulSoup(src, "lxml")
    find_text = soup.find("p").text
    find_IMG = soup.find("img").get("src")
    return find_text, find_IMG

name = 'Зимний Дворец'
name=probels(name)


url =f'https://ru.wikipedia.org/wiki/{name}'
page = requests.get(url)
src = page.text
# print(src)
# with codecs.open('index.html','w', "utf_8_sig" ) as file:
#     file.write(src)
# with codecs.open('index.html', 'r', "utf_8_sig") as file:
#     src = file.read()
soup = BeautifulSoup(src, "lxml")



find_text = soup.find("p").text
print(obrabotka(find_text))
# find_IMG = soup.find("img").get("src")
# print(obrabotka(find_text.text))

# find_IMG = soup.find("img").get("src")
# print(find_IMG)
# find_IMG2 = soup.find("img").get("srcset")
# print(find_IMG)