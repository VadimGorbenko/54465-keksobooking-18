'use strict';

// Добавляем обработчик опускания кнопки мыши на основную метку.
window.consts.mainPin.addEventListener('mousedown', function (evt) {
  setStateToActive();

  var pin = evt.currentTarget;
  var pinParent = pin.parentElement;
  var pinParentCoords = pinParent.getBoundingClientRect();
  var pinParentCoordsX = pinParentCoords.left;
  var pinParentCoordsY = pinParentCoords.top;

  var coords = pin.getBoundingClientRect();
  var coordsX = coords.left;
  var coordsY = coords.top;
  var leftLimit = -(coords.width / 2);
  var rightLimit = pin.parentElement.getBoundingClientRect().width - coords.width / 2;
  var topLimit = 130;
  var bottomLimit = 630;
  var shiftX = evt.x - coordsX;
  var shiftY = evt.y - coordsY;

  dragMainPin(evt.x, evt.y);

  function dragMainPin(x, y) {
    var newX = x - pinParentCoordsX - shiftX;
    var newY = y - pinParentCoordsY - shiftY;

    if (newX < leftLimit) {
      newX = leftLimit;
    } else if (newX > rightLimit) {
      newX = rightLimit;
    }
    if (newY < topLimit) {
      newY = topLimit;
    } else if (newY > bottomLimit) {
      newY = bottomLimit;
    }
    pin.style.left = newX + 'px';
    pin.style.top = newY + 'px';
  }

  function onMouseMove(moveEvt) {
    dragMainPin(moveEvt.x, moveEvt.y);
    window.setAddress('active');
  }

  pin.parentElement.addEventListener('mousemove', onMouseMove);

  pin.addEventListener('mouseup', function () {
    pin.parentElement.removeEventListener('mousemove', onMouseMove);
  });
});

// Обработчик нажатия клавиши на основную метку по Enter
window.consts.mainPin.addEventListener('keydown', function (evt) {
  if (evt.type === 'keydown' && evt.keyCode === window.consts.ENTER_KEY) {
    setStateToActive();
  }
});

var filterNGenPins = filterCallback(window.generatePins);

// Переводит интерфейс в "активное" состояние.
function setStateToActive() {
  window.$('.map').classList.remove('map--faded');
  // var filtersForm = $('.map__filters');
  window.drawPins(filterNGenPins);
  window.consts.adForm.classList.remove('ad-form--disabled');
  Array.prototype.forEach.call(window.consts.adForm.elements, enableFieldset);
}
/* eslint-disable-next-line */
function setStateToDefault() {
  window.consts.mainPin.style.left = '570px';
  window.consts.mainPin.style.top = '375px';
  window.setAddress('active');
}

/**
 * "Фабрка" для функции обратного вызова фильрации данных, после их получения.
 * @param {Function} afterFilterCallback - callback, в который передадутся отфильтрованные данные.
 * @return {Function} функция, которую нужно передавать в качестве коллбэка в метод рисования меток на карте.
 */
function filterCallback(afterFilterCallback) {
  return function (data) {
    var filterForm = window.consts.filterForm;
    var filtersData = new FormData(filterForm);

    var filteredData = data.filter(function (dataItem) {
      var isMatch = false;
      // если если информация о предложении
      if (dataItem.hasOwnProperty('offer')) {
        isMatch = true;
        // Перебираем все данные с формы-фильтра и сверяя значения фильтруем данные с сервера.
        filtersData.forEach(function (value, key) {
          if (value !== 'any') {
            var keyAsInData;
            var dataItemValue;
            // Если да, значит фильтры про общие данные
            if (key.startsWith('housing')) {
              keyAsInData = key.replace('housing-', '');
              dataItemValue = dataItem.offer[keyAsInData];

              if (keyAsInData === 'price') {
                dataItemValue = getPriceCategory(dataItemValue);
              }

              if (value !== String(dataItemValue)) {
                isMatch = false;
              }
              // Иначе из дополнительных опций
            } else {
              dataItemValue = dataItem.offer[key];
              // Если выбранное значение не находится в массиве доп опций объявления, то оно не подходит.
              if (dataItemValue.indexOf(value) === -1) {
                isMatch = false;
              }
            }

          }
        });
      }

      return isMatch;

    });

    // Фильтруем чтобы всегда было не больше 5ти меток.
    filteredData = filteredData.slice(0, 5);

    afterFilterCallback(filteredData);
  };
}

/**
 * Match`ер числовых значений цены и значений соответствующего поля на форме фильтра.
 * @param {Number} price - цена.
 * @return {String} соответствующее цене значение из поля фильтра.
 */
function getPriceCategory(price) {
  var category = 'any';
  if (price <= 10000) {
    category = 'low';
  }
  if (price <= 49999) {
    category = 'middle';
  }
  if (price >= 50000) {
    category = 'high';
  }
  return category;
}

// вешаем disabled атрибут на все fieldset в выбранной форме.
// @param {HTMLElement} element - html element формы.
function enableFieldset(element) {
  if (element.tagName === 'FIELDSET') {
    element.removeAttribute('disabled');
  }
}

window.setAddress('default');

// Добавляем обработчик отправки формы, в котором будем её валидировать.
window.consts.adForm.addEventListener('submit', window.adFormSubmitHandler);

// добавляем обработчик открытия карточки по указателю
window.consts.pinsCont.addEventListener('click', window.showCard);

// Обработчик закрытия(удаления) popups блоков.
window.document.body.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('popup__close')) {
    evt.target.parentElement.remove();
  }
});

// Обработчик закрытия(удаления) карточки объявления по ESC.
window.document.body.addEventListener('keydown', function (evt) {
  if (evt.keyCode === window.consts.ESC_KEY) {
    var cardPopup = window.$('.map__card.popup');
    if (cardPopup) {
      cardPopup.remove();
    }
  }
});

// Добавляем обработчик изменения поля на форме фильтра
window.consts.filterForm.addEventListener('change', changeFilterHandler);

function changeFilterHandler() {
  var changeFilters = window.debounce(function () {
    window.drawPins(filterNGenPins);
    window.clearPins();
    window.clearCards();
  });

  changeFilters();
}
