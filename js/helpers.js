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

})();
