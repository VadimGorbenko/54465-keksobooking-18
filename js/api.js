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
        var filterValue;
        if (request.status === 200) {
          response = request.response;

          // Если был передан фильтр, то
          if (params.hasOwnProperty('filterBy') && params.filterBy.length > 0) {
            // находим элемент и его значение - будет использоваться в качестве фильтра.
            filterValue = window.$('#' + params.filterBy).value;

            response = response.filter(function (responseItem) {
              return responseItem.offer[params.filterBy] === filterValue;
            });
          }

          // Если был передан ограничитель количества
          if (params.hasOwnProperty('top') && params.top > 0 && response.length > params.top) {
            response = response.slice(0, params.top);
          }

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
    },

    sendData: function (form, successHandler, failHandler) {
      var method = form.method;
      var url = form.action;
      var formData = new FormData(form);

      var request = new XMLHttpRequest();

      request.onload = function () {
        if (request.status === 200) {
          successHandler();
        }

        if (request.status >= 400) {
          failHandler();
        }
      };

      request.open(method, url);
      request.send(formData);
    }
  };
})();
