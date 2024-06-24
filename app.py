# pip install Flask
# pip install beautifulsoup4
# pip install requests
# pip install lxml
from flask import Flask, render_template, request
import json
import requests
import codecs
from bs4 import BeautifulSoup


def probels(name):
    rep = " "
    name_new = ''
    for i in name:
        simvol = i
        if rep in simvol:
            simvol = simvol.replace(simvol, "_")
        name_new += simvol
    return name_new

def poisk(name_new):
    url = f'https://ru.wikipedia.org/wiki/{name_new}'
    page = requests.get(url)
    src = page.text
    soup = BeautifulSoup(src, "lxml")
    find_text = soup.find("p").text
    find_IMG = soup.find("img").get("src")
    return find_text, find_IMG

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



parser = Flask(__name__)






@parser.route('/')
def index():
    return render_template('index2.html')

@parser.route('/add', methods=['POST', "GET"])
def add_poin():
    if request.method == 'POST':
        name=request.form['name']
        a=probels(name)
        text, IMG=poisk(a)
        age = request.form['age']
        point = request.form["Point_cord"]
        opis = obrabotka(text)
        IMG = str(IMG)
        js_file_path = "static\data\QGIS\pamytnik.js"
        txt_file_path = "static\data\QGIS\info.txt"
        f = open(txt_file_path, "w")
        f.close()
        with codecs.open(js_file_path, 'r', "utf_8_sig") as js_file:
            strok = js_file.readlines()
        ID = str(len(strok) - 6)
        big_srtok = '        { "type": "Feature", "properties": { "id": ' + ID + ', "Название": "' + name + '", "Фото": "' + IMG + '", "Год": ' + age + ', "Photo": "' + opis + '" }, "geometry": { "type": "Point", "coordinates": [' + point + '] } },\n'
        f = codecs.open(txt_file_path, "a", "utf_8_sig")
        for i in range(len(strok)):
            if i != len(strok) - 3:
                f.write(strok[i])
            else:
                f.write(big_srtok)
                f.write(strok[i])
        f.close()
        f = open(js_file_path, "w")
        f.close()
        JS = codecs.open(js_file_path, "w", "utf_8_sig")
        TXT = codecs.open(txt_file_path, "r", "utf_8_sig")
        JS.write(TXT.read())
        JS.close()
        TXT.close()

    return render_template('index1.html')





if __name__== '__main__':
    parser.run(debug=True)