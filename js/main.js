'use strict';

var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TIMES = ['12:00', '13:00', '14:00'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

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

function drawPins() {
  document.querySelector('.map').classList.remove('map--faded');
  var pinsFragment = generatePins();

  document.querySelector('.map__pins').appendChild(pinsFragment);
}

drawPins();
