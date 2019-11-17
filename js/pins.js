'use strict';

(function () {
  var MAP_FILTER_CONT = window.utils.$('.map__filters-container');

  // генерируем метки на основе данных.
  window.generatePins = function (data) {
    var pin;
    // var adverts = window.getAdverts(); // Старая версия - до появления api.
    var template = window.utils.$('#pin').content.querySelector('.map__pin');
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
    var errorTemplate = window.utils.$('#error').content.querySelector('.error');
    window.utils.$('main').prepend(errorTemplate);
    throw new Error(error.message);
  };

  // Запрашиваем данные для меток и выполняем generatesPin в случае успеха, generationFailed в случае ошибки.
  window.drawPins = function (filterCallback) {
    window.API.getData(filterCallback, window.generationFailed);
  };

  // Рисуем метки, предварительно отчистив предыдущие, чтобы не дублировались.
  window.renderPins = function (fragment) {
    window.clearPins();
    window.utils.$('.map__pins').appendChild(fragment);
  };

  // метод удаления всех существующих меток на карте, кроме основной.
  window.clearPins = function () {
    document.querySelectorAll('.map__pin:not(.map__pin--main)')
      .forEach(function (item) {
        item.remove();
      });
  };

  // метод удаления всех открытых карточек предложений.
  window.clearCards = function () {
    document.querySelectorAll('.map__card.popup')
      .forEach(function (item) {
        item.remove();
      });
  };

  /**
   * @description декодируем тип жилья с латиницы на кирилицу.
   * @param {String} type
   * @return {String}
   */
  window.decodeHouseType = function (type) {
    var decodedType;
    switch (type) {
      case 'bungalo':
        decodedType = 'Бунгало';
        break;
      case 'house':
        decodedType = 'Дом';
        break;
      case 'palace':
        decodedType = 'Дворец';
        break;
      default:
        decodedType = 'Квартира';
        break;
    }
    return decodedType;
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
      var cardTemplate = window.utils.$('#card').content.querySelector('.map__card');
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

      window.clearCards();
      MAP_FILTER_CONT.before(firstCard);
    }
  };

  // добавляем обработчик открытия карточки по указателю
  window.utils.$('.map__pins').addEventListener('click', window.showCard);

})();
