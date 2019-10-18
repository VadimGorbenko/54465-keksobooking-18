'use strict';

(function () {
  // генерируем метки на основе данных.
  window.generatePins = function (data) {
    var pin;
    // var adverts = window.getAdverts(); // Старая версия - до появления api.
    var template = window.$('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    // Перебираем данные, чтобы сгенерировать метки:
    data.forEach(function (advert) {
      pin = template.cloneNode(true);
      pin.style.left = advert.location.x + 'px';
      pin.style.top = advert.location.y + 'px';
      pin.querySelector('img').src = advert.author.avatar;
      pin.querySelector('img').alt = advert.offer.title;

      fragment.appendChild(pin);
    });

    window.renderPins(fragment);
  };

  // В случае возникновения ошибки получения данных
  window.generationFailed = function (error) {
    var errorTemplate = window.$('#error').content.querySelector('.error');
    window.$('main').prepend(errorTemplate);
    throw new Error(error.message);
  };

  // Запрашиваем данные для меток и выполняем generatesPin в случае успеха, generationFailed в случае ошибки.
  window.drawPins = function () {
    window.API.getData(window.consts.dataURL, window.generatePins, window.generationFailed);
  };

  // Рисуем метки, предварительно отчистив предыдущие, чтобы не дублировались.
  window.renderPins = function (fragment) {
    window.clearPins();
    window.$('.map__pins').appendChild(fragment);
  };

  // метод удаления всех существующих меток на карте, кроме основной.
  window.clearPins = function () {
    document.querySelectorAll('.map__pin:not(.map__pin--main)')
      .forEach(function (item) {
        item.remove();
      });
  };

})();
