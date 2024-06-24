import codecs
js_file_path = "static\data\QGIS\pamytnik.js"
txt_file_path = "static\data\QGIS\info.txt"
f = open(txt_file_path, "w")
f.close()
# with codecs.open(js_file_path, 'r', "utf_8_sig") as js_file:
#     strok = js_file.readlines()
# strok_r=strok[len(strok)-3]

# strok_r=strok[:len(strok_r)-2]


name="Александровская колонна"
age="1834"
point="30.315814, 59.939039"
opis="1"
IMG="//upload.wikimedia.org/wikipedia/commons/thumb/5/56/Alexander_column.jpg/284px-Alexander_column.jpg"
ID=11-6

f = codecs.open(txt_file_path, "a", "utf_8_sig")
big_srtok='        { "type": "Feature", "properties": { "id": ' + ID +', "Название": "' + name + '", "Фото": "' + IMG + '", "Год": ' + age + ', "Photo": "' + opis + '" }, "geometry": { "type": "Point", "coordinates": [' + point + '] } },'
f.write(big_srtok)
f.close()
# print(big_srtok)
# print('        { "type": "Feature", "properties": { "id": 1, "Название": "Александровская колонна", "Фото": "//upload.wikimedia.org/wikipedia/commons/thumb/5/56/Alexander_column.jpg/284px-Alexander_column.jpg", "Год": 1834, "Photo": "1" }, "geometry": { "type": "Point", "coordinates": [30.315814, 59.939039] } },')
# f = codecs.open(txt_file_path, "a", "utf_8_sig")
for i in range(len(strok)):
    if i!=len(strok)-3:
        f.write(strok[i])
    else:
        strok_r=strok[i]
        strok_r=strok[:len(strok_r)-2]
        print(strok_r)
        f.write(f)
        f.write(strok[i])

# {"type": "Feature", "properties": {"id": 1, "Название": "Александровская колонна",
#                                    "Фото": "//upload.wikimedia.org/wikipedia/commons/thumb/5/56/Alexander_column.jpg/284px-Alexander_column.jpg",
#                                    "Год": 1834, "Photo": "1"},
#  "geometry": {"type": "Point", "coordinates": [30.315814, 59.939039]}},