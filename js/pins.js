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
      pin.data = advert;

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
    var params = {
      url: window.consts.dataURL,
      top: 5,
      filterBy: 'type',
    };
    window.API.getData(params, window.generatePins, window.generationFailed);
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

  /**
   * @description функция для отрисовки карточки объявления.
   * @param {Event} evt - объект события
   */
  window.showCard = function (evt) {
    var target;

    if (evt.target.parentElement.classList.contains('map__pin')) {

      target = evt.target.parentElement;

    } else if (evt.target.classList.contains('map__pin')) {

      target = evt.target;

    } else {
      return;
    }

    if (!target.classList.contains('map__pin--main')) {
      var firstCardData = target.data;
      var firstCardOffer = firstCardData.offer;
      var cardTemplate = window.$('#card').content.querySelector('.map__card');
      var firstCard = cardTemplate.cloneNode(true);
      firstCard.querySelector('.popup__title').textContent = firstCardOffer.title;
      firstCard.querySelector('.popup__text--address').textContent = firstCardOffer.address;
      firstCard.querySelector('.popup__text--price').textContent = firstCardOffer.price + '₽/ночь';
      firstCard.querySelector('.popup__type').textContent = window.decodeHouseType(firstCardOffer.type);
      firstCard.querySelector('.popup__text--capacity').textContent = firstCardOffer.rooms + ' комнаты для ' + firstCardOffer.guests + ' гостей';
      firstCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + firstCardOffer.checkin + ', выезд до' + firstCardOffer.checkout;

      var cardFeature = document.createElement('li');
      cardFeature.classList.add('popup__feature');
      var cardFeatures = firstCardOffer.features.map(function (feature) {
        var newFeature = cardFeature.cloneNode();
        newFeature.classList.add('popup__feature--' + feature);
        return newFeature;
      });

      var featuresCont = firstCard.querySelector('.popup__features');
      featuresCont.innerHTML = '';
      cardFeatures.forEach(function (feature) {
        featuresCont.append(feature);
      });

      firstCard.querySelector('.popup__description').textContet = firstCardOffer.description;
      var cardPhoto = firstCard.querySelector('.popup__photos').querySelector('.popup__photo');
      var cardPhotos = firstCardOffer.photos.map(function (src) {
        var newPhoto = cardPhoto.cloneNode();
        newPhoto.setAttribute('src', src);
        return newPhoto;
      });
      var photosCont = firstCard.querySelector('.popup__photos');
      photosCont.innerHTML = '';
      cardPhotos.forEach(function (photo) {
        photosCont.append(photo);
      });
      firstCard.querySelector('.popup__avatar').setAttribute('src', firstCardData.author.avatar);

      if (window.$('.map__card.popup')) {
        window.$('.map__card.popup').remove();
      }
      window.consts.filterCont.before(firstCard);
    }
  };

})();
