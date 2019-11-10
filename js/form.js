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
      form.submit();
    }
  };

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
