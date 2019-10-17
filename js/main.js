'use strict';

var ENTER_KEY = 13;

var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TIMES = ['12:00', '13:00', '14:00'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

/**
 * @description jQuery says: "Hello there!". Alias for document.querySelector();
 * @param {String} selector - css совместимый селектор.
 * @return {HTMLElement} - первый встретившийся html элемент, подходящий под переданный селектор.
 */
function $(selector) {
  return document.querySelector(selector);
}

// Генерируем предложение метки.
function getAdverts() {
  var adverts = [];
  var advertItem;
  var oneOfTypes;
  var thisTypes;
  var oneOfTimes;
  var thisTimes;
  var thisFeatures;
  var thisPhotos;
  for (var index = 1; index <= 8; index++) {
    oneOfTypes = Math.round(Math.random() * TYPES.length);
    thisTypes = TYPES[oneOfTypes];
    oneOfTimes = Math.round(Math.random() * TIMES.length);
    thisTimes = TIMES[oneOfTimes];
    thisFeatures = FEATURES.slice(0, Math.round(Math.random() * FEATURES.length));
    thisPhotos = PHOTOS.slice(0, Math.round(Math.random() * PHOTOS.length));
    advertItem = {
      'author': {
        'avatar': 'img/avatars/user0' + index + '.png',
      },
      'offer': {
        'title': 'Lorem Ipsum',
        'address': '600, 350',
        'price': Math.round(300 + Math.random() * (15000 - 300)),
        'type': thisTypes,
        'rooms': Math.round(1 + Math.random() * (5 - 1)),
        'guests': Math.round(1 + Math.random() * (300 - 1)),
        'checkin': thisTimes,
        'checkout': thisTimes,
        'features': thisFeatures,
        'description': 'lorem ipsum dollor sit ammet',
        'photos': thisPhotos,
      },
      'location': {
        'x': Math.round(130 + Math.random() * (630 - 130)),
        'y': Math.round(130 + Math.random() * (630 - 130)),
      }
    };

    adverts.push(advertItem);
  }
  return adverts;
}

// генерируем метки.
function generatePins() {
  var pin;
  var adverts = getAdverts();
  var template = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  adverts.forEach(function (advert) {
    pin = template.cloneNode(true);
    pin.style.left = advert.location.x + 'px';
    pin.style.top = advert.location.y + 'px';
    pin.querySelector('img').src = advert.author.avatar;
    pin.querySelector('img').alt = advert.offer.title;

    fragment.appendChild(pin);
  });

  return fragment;
}

// Рисуем метки
// function drawPins() {
//   // document.querySelector('.map').classList.remove('map--faded');
//   var pinsFragment = generatePins();

//   document.querySelector('.map__pins').appendChild(pinsFragment);
// }

var mainPin = $('.map__pin--main');
var adForm = $('.ad-form');

// Добавляем обработчик опускания кнопки мыши на основную метку.
mainPin.addEventListener('mousedown', function () {
  setStateToActive();
  setAddress('active');
});

// Обработчик нажатия клавиши на основную метку по Enter
mainPin.addEventListener('keydown', function (evt) {
  if (evt.type === 'keydown' && evt.keyCode === ENTER_KEY) {
    setStateToActive();
  }
});

// Переводит интерфейс в "активное" состояние.
function setStateToActive() {
  $('.map').classList.remove('map--faded');
  // var filtersForm = $('.map__filters');

  adForm.classList.remove('ad-form--disabled');
  Array.prototype.forEach.call(adForm.elements, enableFieldset);
}

// вешаем disabled атрибут на все fieldset в выбранной форме.
// @param {HTMLElement} element - html element формы.
function enableFieldset(element) {
  if (element.tagName === 'FIELDSET') {
    element.removeAttribute('disabled');
  }
}

/**
 * @description - записывает координаты в поле ввода адреса.
 * @param {String} state - состояние карты. default - изначальное, active - интерактивное.
 */
function setAddress(state) {
  var addressInput = $('#address');
  var coords = getCoords(state);
  addressInput.value = coords;
}

/**
 * @description - Расчитываем кординаты адреса
 * @param {String} state - состояние карты. default - изначальное, active - интерактивное.
 * @return {String} - '%d, %d' - значение по X, и по Y;
 */
function getCoords(state) {
  var pinStyles = getComputedStyle(mainPin);
  var pinAfterStyles = getComputedStyle(mainPin, 'after');
  var x = parseInt(pinStyles.left, 10);
  var y = parseInt(pinStyles.top, 10);

  if (state === 'default') {
    // Если начальное состояние
    // то прибавляем ширину делённую на 2, чтобы получить центр по X.
    x += (parseInt(pinStyles.width, 10) / 2);
    // то прибавляем высоту делённую на 2, чтобы получить центр по Y.
    y += (parseInt(pinStyles.height, 10) / 2);
  }
  if (state === 'active') {
    // Если активное состояние
    // то прибавляем координаты острого конца указателя
    x += parseInt(pinAfterStyles.left, 10) + (parseInt(pinAfterStyles.width, 10) / 2);
    y += parseInt(pinAfterStyles.top, 10) + parseInt(pinAfterStyles.height, 10);

  }
  return x + ', ' + y;
}

setAddress('default');

// Добавляем обработчик отравки формы, в котором будем её валидировать.
adForm.addEventListener('submit', adFormSubmitHandler);

/**
 * @description обработчик(валидатор) отправки формы.
 * @param {Event} evt - объект события.
 */
function adFormSubmitHandler(evt) {
  evt.preventDefault();
  var form = evt.target;
  // Если число комнат и число гостей !=, то
  if (form.rooms.value !== form.capacity.value) {
    form.capacity.setCustomValidity('Число комнат не соответствует числу жильцов!');
  } else {
    form.submit();
  }
}
