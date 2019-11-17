'use strict';

(function () {
  /**
   * @description обработчик(валидатор) отправки формы.
   * @param {Event} evt - объект события.
   */
  window.adFormSubmitHandler = function (evt) {
    evt.preventDefault();
    var form = evt.target;
    // Если число комнат и число гостей !=, то
    if (form.rooms.value !== form.capacity.value) {
      form.capacity.setCustomValidity('Число комнат не соответствует числу жильцов!');
    } else {
      // form.submit();
      // debugger;
      form.address.removeAttribute('disabled');
      window.API.sendData(form, formSendSuccessHandler, formSendFailHandler);
      form.address.setAttribute('disabled', true);
    }
  };

  function formSendSuccessHandler() {
    var form = window.consts.adForm;
    form.reset();
    window.clearCards();
    window.clearPins();
    setStateToDefault();
    showSuccessMessage();
  }

  function formSendFailHandler() {
    var template = window.$('#error').content.querySelector('.error');
    var message = template.cloneNode(true);
    message.addEventListener('click', function (evt) {
      evt.currentTarget.remove();
    });
    window.$('main').prepend(message);
    document.addEventListener('keydown', closeFailMessage);
  }

  function showSuccessMessage() {
    var template = window.$('#success').content.querySelector('.success');
    var message = template.cloneNode(true);
    message.addEventListener('click', function (evt) {
      evt.currentTarget.remove();
    });
    window.$('main').prepend(message);
    document.addEventListener('keydown', closeSuccessMessage);
  }

  function closeSuccessMessage(evt) {
    var message;
    if (evt.keyCode === window.consts.ESC_KEY) {
      message = window.$('.success');
      if (message) {
        message.remove();
        message = null;
      }
    }
  }

  function closeFailMessage(evt) {
    var message;
    if (evt.keyCode === window.consts.ESC_KEY) {
      message = window.$('.error');
      if (message) {
        message.remove();
        message = null;
      }
    }
  }

  // Добавляем обработчики событий для связи изменения времени заезда и выезда
  // заезд
  window.$('#timein').addEventListener('change', function (evt) {
    window.$('#timeout').value = evt.target.value;
  });

  // выезд
  window.$('#timeout').addEventListener('change', function (evt) {
    window.$('#timein').value = evt.target.value;
  });

  // Добавление обработчика изменения минимальной цены за ночь в зависимости от типа жилья размещаемого объявления.
  window.$('#type').addEventListener('change', function (evt) {
    var chosenType = evt.target.value;
    var minValue;

    switch (chosenType) {
      case 'flat':
        minValue = 1000;
        break;
      case 'house':
        minValue = 5000;
        break;
      case 'palace':
        minValue = 10000;
        break;
      default:
        minValue = 0;
        break;
    }

    window.$('#price').setAttribute('min', minValue);
    window.$('#price').setAttribute('placeholder', minValue);

  });
})();
