'use strict';

(function () {


  /**
   * @description - записывает координаты в поле ввода адреса.
   * @param {String} state - состояние карты. default - изначальное, active - интерактивное.
   */
  window.setAddress = function (state) {
    var coords = window.getCoords(state);
    window.utils.$('#address').value = coords;
  };

  /**
   * @description - Расчитываем кординаты адреса
   * @param {String} state - состояние карты. default - изначальное, active - интерактивное.
   * @return {String} - '%d, %d' - значение по X, и по Y;
   */
  window.getCoords = function (state) {
    var pinStyles = getComputedStyle(window.consts.mainPin);
    var pinAfterStyles = getComputedStyle(window.consts.mainPin, 'after');
    var x = parseInt(pinStyles.left, 10);
    var y = parseInt(pinStyles.top, 10);

    if (state === 'default') {
      // Если начальное состояние
      // то прибавляем ширину делённую на 2, чтобы получить центр по X.
      x += (parseInt(pinStyles.width, 10) / 2);
      // то прибавляем высоту делённую на 2, чтобы получить центр по Y.
      y += (parseInt(pinStyles.height, 10) / 2);
    }
    if (state === 'active') {
      // Если активное состояние
      // то прибавляем координаты острого конца указателя
      x += parseInt(pinAfterStyles.left, 10) + (parseInt(pinAfterStyles.width, 10) / 2);
      y += parseInt(pinAfterStyles.top, 10) + parseInt(pinAfterStyles.height, 10);

    }
    return x + ', ' + y;
  };

})();
