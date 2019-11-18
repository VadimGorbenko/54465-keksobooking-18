'use strict';

(function () {
  var FILTER_FORM = window.utils.$('.map__filters');
  var FILTERS_SELECT_PREFIX = 'housing-';
  var FILTERS_ANY_VALUE = 'any';
  var DATA_OFFER_KEY = 'offer';
  var DATA_PRICE_KEY = 'price';
  var DATA_FEATURES_KEY = 'features';
  var KEY_MISSMATCH_MESSAGE = ' - Обработчик для этого ключа не определён.';
  var FILTER_MAX_ITEM_COUNT = 5;

  window.filterForm = {
    filterCallback: filterCallbackFabrick(window.pins.generatePins),
  };

  /**
   * "Фабрика" для функции обратного вызова фильтрации данных, после их получения.
   * @param {Function} afterFilterCallback - callback, в который передадутся отфильтрованные данные.
   * @return {Function} функция, которую нужно передавать в качестве callback в метод рисования меток на карте.
   */
  function filterCallbackFabrick(afterFilterCallback) {
    return function (data) {
      var filtersData = new FormData(FILTER_FORM);

      var filteredData = data.filter(function (dataItem) {
        var isMatch = false;
        // если если информация о предложении
        if (dataItem.hasOwnProperty(DATA_OFFER_KEY)) {
          isMatch = true;

          // Перебираем все данные с формы-фильтра и сверяя значения фильтруем данные с сервера.
          filtersData.forEach(function (value, key) {
            if (value !== FILTERS_ANY_VALUE) {
              var keyAsInData;
              var dataItemValue;

              // Если да, значит фильтры про общие данные
              if (key.startsWith(FILTERS_SELECT_PREFIX)) {
                keyAsInData = key.replace(FILTERS_SELECT_PREFIX, '');
                dataItemValue = dataItem.offer[keyAsInData];

                if (keyAsInData === DATA_PRICE_KEY) {
                  dataItemValue = getPriceCategory(dataItemValue);
                }

                if (value !== String(dataItemValue)) {
                  isMatch = false;
                }

                // Иначе из дополнительных опций features
              } else if (key === DATA_FEATURES_KEY) {
                dataItemValue = dataItem.offer[key];
                // Если выбранное значение не находится в массиве доп опций объявления, то оно не подходит.
                if (dataItemValue.indexOf(value) === -1) {
                  isMatch = false;
                }
              } else {
                throw new Error(key + KEY_MISSMATCH_MESSAGE);
              }

            }
          });
        }

        return isMatch;

      });

      // Фильтруем чтобы всегда было не больше FILTER_MAX_ITEM_COUNT меток.
      filteredData = filteredData.slice(0, FILTER_MAX_ITEM_COUNT);

      afterFilterCallback(filteredData);
    };
  }


  /**
   * Match`ер числовых значений цены и значений соответствующего поля на форме фильтра.
   * @param {Number} price - цена.
   * @return {String} соответствующее цене значение из поля фильтра.
   */
  function getPriceCategory(price) {
    var LOW_PRICE_LIMIT = 10000;
    var MIDDLE_PRICE_LIMIT = 49999;
    var HIGH_PRICE_LIMIT = 50000;

    var category = 'any';

    if (price <= LOW_PRICE_LIMIT) {
      category = 'low';
    } else if (price <= MIDDLE_PRICE_LIMIT) {
      category = 'middle';
    } else if (price >= HIGH_PRICE_LIMIT) {
      category = 'high';
    }
    return category;
  }

  // Добавляем обработчик изменения поля на форме фильтра
  FILTER_FORM.addEventListener('change', changeFilterHandler);

  function changeFilterHandler() {
    var changeFilters = window.debounce(function () {
      window.pins.clearPins();
      window.pins.clearCards();
      window.pins.drawPins(window.filterForm.filterCallback);
    });

    changeFilters();

  }

})();
