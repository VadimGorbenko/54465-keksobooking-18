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

})();
