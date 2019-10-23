'use strict';

(function () {
  window.API = {
    getData: function (url, resolve, reject) {
      var request = new XMLHttpRequest();
      request.responseType = 'json';

      request.addEventListener('load', function () {
        if (request.status === 200) {
          resolve(request.response);
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

      request.open('GET', url);
      request.send();
    }
  };
})();
