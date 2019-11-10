'use strict';
(function () {

  /**
   * @description jQuery says: "Hello there!". Alias for document.querySelector();
   * @param {String} selector - css совместимый селектор.
   * @return {HTMLElement} - первый встретившийся html элемент, подходящий под переданный селектор.
   */
  window.$ = function qS(selector) {
    return document.querySelector(selector);
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

})();
