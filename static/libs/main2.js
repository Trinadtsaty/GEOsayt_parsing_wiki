//Функция для загрузки Яндекс Пробок

function traffic() {
	var trafficProvider = new ymaps.traffic.provider.Actual({}, {
		infoLayerShown: true
	});
	trafficProvider.setMap(this._yandex);
};

//Реализация перехватчика для момента загрузки панели управления Яндекс API с целью изменения синтексиса
L.Yandex.addInitHook('on', 'load', function () {
	this._setStyle(this._yandex.controls.getContainer(), {
		right: '50px',
		top: '3px',
		width: 'auto'
	});
});

//Функция для загрузки яндекс пробок с панелью управления
function trafficCtrl() {
	this._yandex.controls
		.add('trafficControl', {
			size: 'auto'
		})
		.get('trafficControl').state.set('trafficShown', true);
};

//создание объеката слоя базовой карты
var bmURL = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
	bm = L.tileLayer(bmURL),
	osmLight = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'),
	osmDark = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'),
	gSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
		subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
		maxZoom: 19,
		attribution: 'Google карта - фу'
	}),
	yMap = L.yandex('map'),
	yMapTraffic = L.yandex('overlay')
		.on('load', traffic), //событие, которое срабатывает при полной загрузке overley слоя (запускается фун-ция traffic)
	yMapTrafficCtrl = L.yandex('overlay')
		.on('load', trafficCtrl),
	gkhPerm = L.tileLayer.wms('https://romangis.nextgis.com/api/resource/660/wms', {
		layers: 'ngw_id_656',
		format: 'image/png',
		transparent: true,
		attribution: 'Надпись в нижнем углу'
	});



//Создание объекта карты
//var myMap = L.map('map', {
//center: [58.016051, 56.283487],
//zoom: 18,
//layers: [bm]
var myMap = L.map('map', {
	center: [59.940396, 30.313804],
	zoom: 16,
	//attributionContol: fals
	layers: [osmDark, osmLight]
});


//Создание своей иконки для точечного объекта
const rwsIcon = L.icon({
	iconUrl: './static/data/icons/RedTrain.png',
	iconSize: [32, 32],
	iconAnchor: [32,0]
});
//Создание собственного экземпляра класса иконок на основе Icon
const rwIcon = L.Icon.extend({
	options: {
		iconSize: [32, 32],
		iconAnchor: [32, 0]
	}
});
//Создание массива иконок памятников
const rwIcons = [
	new rwIcon({ iconUrl: './static/data/icons/BlueTrain1.png', }),
	new rwIcon({ iconUrl: './static/data/icons/BlueTrain2.png', }),
	new rwIcon({ iconUrl: './static/data/icons/BlueTrain3.png', })
];

// Добавляем слой GeoJSON-а, уникальные значения
const rwstLayer = L.geoJSON(rwst, {
	pointToLayer: function (feature, latlng) {
		let year = feature.properties.Год;
		year < 1800 ? icn = rwIcons[0] :
			year >= 1800 && year < 1900 ? icn = rwIcons[1] :
			icn=rwIcons[2]
		return L.marker(latlng, {
			icon: icn



		})
	}
})
	.bindPopup(function (rwst) {
		let rwstPhoto = '';
		if (rwst.feature.properties.Photo == 1) {
			rwstPhoto = '<br><img src="./static/data/QGIS/Photo/' + rwst.feature.properties.Фото + '/photo.jpg" width="285" height="190"> '
		}
		return '<b>Название памятника: </b>' + rwst.feature.properties.Название + rwstPhoto
	});

//59.9298074, 30.3622627 - координаты московского вокзала
//Создание точечных объектов

const rws = L.layerGroup([
	L.marker([59.9301635, 30.3620616], {
		title: 'Московский Вокзал',
		icon: rwsIcon

	})
		.bindPopup('<b>Название: </b><i>Московский Вокзал</i><br><img src="./static/data/photo/Station.jpg" width=322 height=180> '),
	L.marker([59.9554588, 30.356335], {
		title: 'Финляндский Вокзал',
		icon: rwsIcon

	})
		.bindPopup('<b>Название: </b><i>Финляндский Вокзал</i><br><img src="./static/data/photo/Finnish.jpg" width=300 height=198> '),
	L.marker([59.9319361, 30.4407871], {
		title: 'Ладожский вокзал',
		icon: rwsIcon

	})
		.bindPopup('<b>Название: </b><i>Ладожский вокзал</i><br><img src="./static/data/photo/Ladozhsky.jpg" width=307 height=245> ')

]);



//создание списка слоев
var baseLayers = {
	'OSM карта': bm,
	'OSM карта(светлая)': osmLight,
	'OSM карта(Темная)': osmDark,
	'Google-спутник': gSat,
	'Яндекс Карта': yMap

},
	overlayLayers = {
		'Яндекс пробки': yMapTraffic,
		'Яндекс-пробки с пан. Упр-я': yMapTrafficCtrl,
		'Надпись в слоях': gkhPerm,
		'Памятники СПБ': rwstLayer,
		'Вокзалы СПБ': rws

	};

//Добавление переключателя слоев
L.control.layers(baseLayers, overlayLayers).addTo(myMap);

//Создание объектов измерительных инструментов (модуль leaflet-measure)
var msrCtrl = L.control.measure({
	localization: 'ru',
	primaryLengthUnit: 'kilometers',
	secondaryLengthUnit: 'meters',
	primaryAreaUnit: 'hectares',
	secondaryAreaUnit: 'sqmeters',
	thousandsSep: ' ',
	decPoint: ',',
	//activeColor: '#8b0000',
	activeColor: '#b83535',
	completedColor: '#680f1d'
});

//Добавление измерительных инструментов на карту
msrCtrl.addTo(myMap);

//Добавление масштабной линейки
L.control.scale({
	imperial: false,
	maxWidth: "150"
}).addTo(myMap);

//Отключение префикса для атрибьюшенконтрол-а Флаг и ссылка на лифлет
//myMap.attributionControl.setPrefix(false) - убираем
myMap.attributionControl.setPrefix('крутой текст')


// Добавляем слой GeoJSON-а, константно
//L.geoJSON(rwst)
//.bindPopup('Памятник')
//	.addTo(myMap);

//Создание элемента интерфейса "Легенда"
var lgnd = L.control({
	position: 'bottomright'
});
//Создание ф-ции которая активируется при сообытии доболвения "Легенды" на карту
lgnd.onAdd = function (myMap) {
	let lgndDiv = L.DomUtil.create('div', 'lgndPanel'),
		labels = [];
	L.DomEvent
		.disableScrollPropagation(lgndDiv)
		.disableClickPropagation(lgndDiv)
	labels.push('<h3><b>Легенда для слоя с вокзалами</b></h3>');
	labels.push('<center><img src="./static/data/icons/BlueTrain1.png" width="14" height="14"> - <i>Очень старые памятники</i></center>');
	labels.push('<center><img src="./static/data/icons/BlueTrain2.png" width="14" height="14"> - <i>старые памятники</i></center>');
	labels.push('<center><img src="./static/data/icons/BlueTrain3.png" width="14" height="14"> - <i>новые памятники</i></center>');
	lgndDiv.innerHTML = labels.join('');
	return lgndDiv
};


// Добавление элемента интерфейса "Легенда" на карту
//lgnd.addTo(myMap);


//Реализация возможности Добовления/Удаления легенды при выборе определённого слоя карты

function lgndAdd() {
	lgnd.addTo(myMap)
};

function lgndremove() {
	lgnd.remove(myMap)
};

rwstLayer.on('add', lgndAdd);
rwstLayer.on('remove', lgndremove);

//Координаты углов:
// Левый верхний 60,06694100 30,38114500
// Нижний правый 60,04274000 30,45504600

//Подключение и привязка видеоролика мониторинга территории
	//Создание объекта-прямоугольника иследуемой территории
const regionBugrs = L.latLngBounds([[60.066941, 30.381145], [60.042740, 30.455046]]);
//L.rectangle(regionBugrs).addTo(myMap);
	//Загрузка видео ролика мониторинга территории на объект-прямоугольник
const ovBugrs = L.videoOverlay('./static/data/video/Bugrs.mp4', regionBugrs, {
	autoplay: true,
	loop: true
});

//Реализация функций для остановки и запуска видео ролика мониторинга территорий
function playVideo() {
	ovBugrs.getElement().play()
};

function pauseVideo() {
	ovBugrs.getElement().pause()
};

	//Создание кнопок для остановки и запуска
function playButton() {
	let btn = L.DomUtil.create('button');
	btn.innerHTML = '<b>Play<b>';
	L.DomEvent.on(btn, 'click', playVideo);
	return btn
};

function pauseButton() {
	let btn = L.DomUtil.create('button');
	btn.innerHTML = '<b>Pause<b>';
	L.DomEvent.on(btn, 'click', pauseVideo);
	return btn
};

	//Загрузка кнопок на карту
function loadBauutons() {
	let playCtrl = L.Control.extend({
		onAdd: playButton
		}),
		pauseCtrl = L.Control.extend({
			onAdd: pauseButton
		});
	(new playCtrl()).addTo(myMap);
	(new pauseCtrl()).addTo(myMap);

};
	//Событие при котором кнопки добавяться на карту

ovBugrs.on('load', loadBauutons())

ovBugrs.addTo(myMap);