'use strict';

(function () {
  var MAP_FILTER_CONT = window.utils.$('.map__filters-container');
  /**
   * @description декодируем тип жилья с латиницы на кирилицу.
   * @param {String} type
   * @return {String}
   */
  function decodeHouseType(type) {
    var HOUSE_TYPE_MAP = {
      bungalo: 'Бунгало',
      house: 'Дом',
      palace: 'Дворец',
      flat: 'Квартира',
    };

    return HOUSE_TYPE_MAP[type];
  }

  window.pins = {
    // генерируем метки на основе данных.
    generatePins: function (data) {
      var pin;
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

      window.pins.renderPins(fragment);
    },

    // В случае возникновения ошибки получения данных
    generationFailed: function (error) {
      var errorTemplate = window.utils.$('#error').content.querySelector('.error');
      window.utils.$('main').prepend(errorTemplate);
      throw new Error(error.message);
    },

    // Запрашиваем данные для меток и выполняем filterCallback в случае успеха, generationFailed в случае ошибки.
    drawPins: function (filterCallback) {
      window.API.getData(filterCallback, window.pins.generationFailed);
    },

    // Рисуем метки, предварительно отчистив предыдущие, чтобы не дублировались.
    renderPins: function (fragment) {
      window.pins.clearPins();
      window.utils.$('.map__pins').appendChild(fragment);
    },

    // метод удаления всех существующих меток на карте, кроме основной.
    clearPins: function () {
      document.querySelectorAll('.map__pin:not(.map__pin--main)')
        .forEach(function (item) {
          item.remove();
        });
    },

    // метод удаления всех открытых карточек предложений.
    clearCards: function () {
      document.querySelectorAll('.map__card.popup')
        .forEach(function (item) {
          item.remove();
        });
      window.document.body.removeEventListener('keydown', closeOfferCardHandler);
    },

    /**
     * @description функция для отрисовки карточки объявления.
     * @param {Event} evt - объект события
     */
    showCard: function (evt) {
      var target;

      if (evt.target.parentElement.classList.contains('map__pin')) {

        target = evt.target.parentElement;

      } else {

        target = evt.target;

      }

      if (!target.classList.contains('map__pin--main')) {
        var card = generateCard(target.data);

        window.pins.clearCards();
        window.document.body.addEventListener('keydown', closeOfferCardHandler);

        MAP_FILTER_CONT.before(card);

      }
    }
  };

  /**
   * @description Генерирует карточку на основе поступивших данных.
   * @param {Object} cardData - объект данных карточки.
   * @return {HTMLElement} карточка предложения
   */
  function generateCard(cardData) {
    var cardOffer = cardData.offer;
    var cardTemplate = window.utils.$('#card').content.querySelector('.map__card').cloneNode(true);

    cardTemplate.querySelector('.popup__title').textContent = cardOffer.title;
    cardTemplate.querySelector('.popup__text--address').textContent = cardOffer.address;
    cardTemplate.querySelector('.popup__text--price').textContent = cardOffer.price + '₽/ночь';
    cardTemplate.querySelector('.popup__type').textContent = decodeHouseType(cardOffer.type);
    cardTemplate.querySelector('.popup__text--capacity').textContent = cardOffer.rooms + ' комнаты для ' + cardOffer.guests + ' гостей';
    cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardOffer.checkin + ', выезд до' + cardOffer.checkout;
    cardTemplate.querySelector('.popup__description').textContet = cardOffer.description;
    cardTemplate.querySelector('.popup__avatar').setAttribute('src', cardData.author.avatar);
    cardTemplate.querySelector('.popup__close').onclick = function (clickEvt) {
      clickEvt.target.parentElement.remove();
      window.document.body.removeEventListener('keydown', closeOfferCardHandler);
    };

    var cardFeature = document.createElement('li');
    cardFeature.classList.add('popup__feature');

    var cardFeatures = cardOffer.features.map(function (feature) {
      var newFeature = cardFeature.cloneNode();
      newFeature.classList.add('popup__feature--' + feature);
      return newFeature;
    });

    var featuresCont = cardTemplate.querySelector('.popup__features');
    featuresCont.innerHTML = '';
    cardFeatures.forEach(function (feature) {
      featuresCont.append(feature);
    });

    var cardPhoto = cardTemplate.querySelector('.popup__photos').querySelector('.popup__photo');
    var cardPhotos = cardOffer.photos.map(function (src) {
      var newPhoto = cardPhoto.cloneNode();
      newPhoto.setAttribute('src', src);
      return newPhoto;
    });
    var photosCont = cardTemplate.querySelector('.popup__photos');
    photosCont.innerHTML = '';

    cardPhotos.forEach(function (photo) {
      photosCont.append(photo);
    });

    return cardTemplate;
  }

  function closeOfferCardHandler(evt) {
    if (window.utils.isEscKey(evt.keyCode)) {
      var cardPopup = window.utils.$('.map__card.popup');
      if (cardPopup) {
        cardPopup.remove();
        window.document.body.removeEventListener('keydown', closeOfferCardHandler);
      }
    }
  }

  // добавляем обработчик открытия карточки по указателю
  window.utils.$('.map__pins').addEventListener('click', window.pins.showCard);

})();
