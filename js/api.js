'use strict';

(function () {
  window.API = {
    /**
     * @description Метод получения данных с сервера.
     * @param {Object} params - Объект параметров запроса.
     * @param {String} params.url - урл запроса.
     * @param {Number} params.top - количество возвращаемых элементов "сверху".
     * @param {String} params.filterBy - id элемента, по значению которого необходимо произвести фильтр.
     * @param {Function} resolve - callback в случае успешного выполнения запроса.
     * @param {Function} reject - callback в случае ошибки выполнения запроса.
     */
    getData: function (params, resolve, reject) {
      var request = new XMLHttpRequest();
      request.responseType = 'json';

      request.addEventListener('load', function () {
        var response;
        if (request.status === 200) {
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

      request.timeout = 10000; // 10s

      request.open('GET', params.url);
      request.send();
    }
  };
})();
