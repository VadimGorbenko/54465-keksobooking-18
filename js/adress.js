'use strict';

(function () {

  window.address = {
    /**
     * @description - записывает координаты в поле ввода адреса.
     * @param {String} state - состояние карты. default - изначальное, active - интерактивное.
     */
    setAddress: function (state) {
      var coords = window.address.getCoords(state);
      window.utils.$('#address').value = coords;
    },

    /**
     * @description - Расчитываем кординаты адреса
     * @param {String} state - состояние карты. default - изначальное, active - интерактивное.
     * @return {String} - '%d, %d' - значение по X, и по Y;
     */
    getCoords: function (state) {
      var POINTER_HEIGHT = 22;

      var pinParams = window.consts.mainPin.getBoundingClientRect();
      var pointerPeakX = pinParams.width / 2;
      var pointerPeakY = pinParams.height + POINTER_HEIGHT;
      var x = pinParams.left;
      var y = pinParams.top;

      if (state === 'default') {
        // Если начальное состояние
        // то прибавляем ширину делённую на 2, чтобы получить центр по X.
        x += pinParams.width / 2;
        // то прибавляем высоту делённую на 2, чтобы получить центр по Y.
        y += pinParams.height / 2;
      }
      if (state === 'active') {
        // Если активное состояние
        // то прибавляем координаты острого конца указателя
        x += pointerPeakX;
        y += pointerPeakY;

      }
      return x + ', ' + y;
    }
  };

})();
