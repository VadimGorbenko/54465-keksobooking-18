'use strict';

(function () {

  var TIMEIN_INPUT = window.consts.newForm.querySelector('#timein');
  var TIMEOUT_INPUT = window.consts.newForm.querySelector('#timeout');
  var MISSMATCH_ROOMS_GUESTS_MESSAGE = 'Число комнат не соответствует числу жильцов!';

  window.newForm = {
    /**
     * @description обработчик(валидатор) отправки формы.
     * @param {Event} evt - объект события.
     */
    submitHandler: function (evt) {
      evt.preventDefault();
      var form = evt.target;
      // Если число комнат и число гостей !=, то
      if (form.rooms.value !== form.capacity.value) {
        form.capacity.setCustomValidity(MISSMATCH_ROOMS_GUESTS_MESSAGE);
      } else {
        form.address.removeAttribute('disabled');
        window.API.sendData(form, window.newForm.submitSuccessHandler, window.newForm.submitFailHandler);
        form.address.setAttribute('disabled', true);
      }
    },

    submitSuccessHandler: function () {
      var form = window.consts.newForm;
      form.reset();
      window.pins.clearCards();
      window.pins.clearPins();
      window.setStateToDefault();
      window.newForm.showMessage('success');
    },

    submitFailHandler: function () {
      window.newForm.showMessage('error');
    },

    showMessage: function (type) {
      var template = window.utils.$('#' + type).content.querySelector('.' + type);
      var message = template.cloneNode(true);
      message.addEventListener('click', function (evt) {
        evt.currentTarget.remove();
      });
      window.utils.$('main').prepend(message);
      document.addEventListener('keydown', closeMessage);

      function closeMessage(evt) {
        if (window.utils.isEscKey(evt.keyCode)) {
          message.remove();
          message = null;
          document.removeEventListener('keydown', closeMessage)
        }
      }
    }
  }

  // Добавляем обработчик отправки формы, в котором будем её валидировать.
  window.consts.newForm.addEventListener('submit', window.newForm.submitHandler);

  // Добавляем обработчики событий для связи изменения времени заезда и выезда
  // заезд
  TIMEIN_INPUT.addEventListener('change', function (evt) {
    TIMEOUT_INPUT.value = evt.target.value;
  });

  // выезд
  TIMEOUT_INPUT.addEventListener('change', function (evt) {
    TIMEIN_INPUT.value = evt.target.value;
  });

  // Добавление обработчика изменения минимальной цены за ночь в зависимости от типа жилья размещаемого объявления.
  window.utils.$('#type').addEventListener('change', function (evt) {
    var FLAT_PRICE = 1000;
    var HOUSE_PRICE = 5000;
    var PALACE_PRICE = 10000;
    var BUNGALO_PRICE = 0;

    var chosenType = evt.target.value;
    var priceInput = window.utils.$('#price');
    var minValue;

    switch (chosenType) {
      case 'flat':
        minValue = FLAT_PRICE;
        break;
      case 'house':
        minValue = HOUSE_PRICE;
        break;
      case 'palace':
        minValue = PALACE_PRICE;
        break;
      default:
        minValue = BUNGALO_PRICE;
        break;
    }

    priceInput.setAttribute('min', minValue);
    priceInput.setAttribute('placeholder', minValue);

  });

})();
