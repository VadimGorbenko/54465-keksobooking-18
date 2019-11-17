'use strict';

(function () {
  var SUCCESS_STATUS_CODE = 200;
  var FAIL_STATUS_CODE = 400;
  var REQUEST_TIMEOUT_MS = 10000;
  var REQUEST_GET_METHOD = 'GET';
  var PINS_DATA_SOURS = 'https://js.dump.academy/keksobooking/data';
  window.API = {
    /**
     * @description Метод получения данных с сервера.
     * @param {Function} resolve - callback в случае успешного выполнения запроса.
     * @param {Function} reject - callback в случае ошибки выполнения запроса.
     */
    getData: function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.responseType = 'json';

      request.addEventListener('load', function () {
        var response;
        if (request.status === SUCCESS_STATUS_CODE) {
          response = request.response;
          resolve(response);
        } else {
          reject('Cтатус ответа: ' + request.status + ' ' + request.statusText);
        }
      });

      request.addEventListener('error', function () {
        reject('Произошла ошибка соединения');
      });

      request.addEventListener('timeout', function () {
        reject('Запрос не успел выполниться за ' + request.timeout + 'мс');
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
