'use strict';

(function () {
  // генерируем метки.
  window.generatePins = function () {
    var pin;
    var adverts = window.getAdverts();
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
  };

  // Рисуем метки
  window.drawPins = function () {
    var pinsFragment = window.generatePins();
    document.querySelector('.map__pins').appendChild(pinsFragment);
  };

})();
