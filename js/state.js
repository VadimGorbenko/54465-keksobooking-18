'use strict';

(function () {
  var MAP = window.utils.$('.map');

  window.state = {
    // Переводит интерфейс в "активное" состояние.
    setActive: function () {
      MAP.classList.remove('map--faded');
      if (!window.app.isDataLoaded) {
        window.pins.drawPins(window.filterForm.filterCallback);
      }
      window.consts.newForm.classList.remove('ad-form--disabled');
      Array.prototype.forEach.call(window.consts.newForm.elements, enableFieldset);
      window.address.setAddress('active');
    },

    setToDefault: function (evt) {
      var MAIN_PIN_DEFAULT_LEFT = '570px';
      var MAIN_PIN_DEFAULT_TOP = '375px';

      window.pins.clearPins();
      window.pins.clearCards();
      MAP.classList.add('map--faded');
      window.consts.newForm.classList.add('ad-form--disabled');
      Array.prototype.forEach.call(window.consts.newForm.elements, disableFieldset);
      window.consts.mainPin.style.left = MAIN_PIN_DEFAULT_LEFT;
      window.consts.mainPin.style.top = MAIN_PIN_DEFAULT_TOP;

      if (evt) {
        evt.preventDefault();
        window.utils.$('.ad-form').reset();
      }

      window.address.setAddress('default');
      window.app.isDataLoaded = false;
    }
  };

  // вешаем disabled атрибут на все fieldset в выбранной форме.
  // @param {HTMLElement} element - html element формы.
  function enableFieldset(element) {
    if (element.tagName === 'FIELDSET') {
      element.removeAttribute('disabled');
    }
  }

  function disableFieldset(element) {
    if (element.tagName === 'FIELDSET') {
      element.setAttribute('disabled', 'disabled');
    }
  }

})();
