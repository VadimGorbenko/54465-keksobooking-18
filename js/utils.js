'use strict';
(function () {

  var ENTER_KEY = 13;
  var ESC_KEY = 27;

  window.utils = {
    /**
     * @description jQuery says: "Hello there!". Alias for document.querySelector();
     * @param {String} selector - css совместимый селектор.
     * @return {HTMLElement} - первый встретившийся html элемент, подходящий под переданный селектор.
     */
    $: function (selector) {
      return document.querySelector(selector);
    },

    isEnterKey: function (keyCode) {
      return keyCode === ENTER_KEY;
    },

    isEscKey: function (keyCode) {
      return keyCode === ESC_KEY;
    }

  };

})();
