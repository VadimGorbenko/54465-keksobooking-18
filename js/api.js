'use strict';

(function () {
  var SUCCESS_STATUS_CODE = 200;
  var FAIL_STATUS_CODE = 400;
  var REQUEST_TIMEOUT_MS = 10000;
  var REQUEST_GET_METHOD = 'GET';
  var REQUEST_RESPONSE_TYPE = 'json';
  var REQUEST_ERROR_MESSAGE = 'Произошла ошибка соединения';
  var REQUEST_TIMEOUT_MESSAGE = 'Запрос не успел выполниться за ';
  var PINS_DATA_SOURS = 'https://js.dump.academy/keksobooking/data';

  window.API = {
    /**
     * @description Метод получения данных с сервера.
     * @param {Function} resolve - callback в случае успешного выполнения запроса.
     * @param {Function} reject - callback в случае ошибки выполнения запроса.
     */
    getData: function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.responseType = REQUEST_RESPONSE_TYPE;

      request.addEventListener('load', function () {
        var response;
        if (request.status === SUCCESS_STATUS_CODE) {
          response = request.response;
          window.app.isDataLoaded = true;
          resolve(response);
        }
      });

      request.addEventListener('error', function () {
        reject(REQUEST_ERROR_MESSAGE);
      });

      request.addEventListener('timeout', function () {
        reject(REQUEST_TIMEOUT_MESSAGE + request.timeout + 'мс');
      });

      request.timeout = REQUEST_TIMEOUT_MS;

      request.open(REQUEST_GET_METHOD, PINS_DATA_SOURS);
      request.send();
    },

    sendData: function (form, successHandler, failHandler) {
      var method = form.method;
      var url = form.action;
      var formData = new FormData(form);

      var request = new XMLHttpRequest();

      request.onload = function () {
        if (request.status === SUCCESS_STATUS_CODE) {
          successHandler();
        }

        if (request.status >= FAIL_STATUS_CODE) {
          failHandler();
        }
      };

      request.open(method, url);
      request.send(formData);
    }
  };
})();
