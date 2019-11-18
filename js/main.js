'use strict';

// Добавляем обработчик опускания кнопки мыши на основную метку. Данный обработчик отслеживает перемещение основной метки и меняет значение адреса.
window.consts.mainPin.addEventListener('mousedown', function (evt) {
  var TOP_LIMIT = 130;
  var BOTTOM_LIMIT = 630;

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
  var rightLimit = pinParentCoords.width - coords.width / 2;
  var shiftX = evt.x - coordsX;
  var shiftY = evt.y - coordsY;

  dragMainPin(evt.x, evt.y);

  /**
   * @description передвигаем метку, проверяя лимиты
   * @param {Number} x - соответствующая координата, на которую нужно сместить.
   * @param {Number} y - соответствующая координата, на которую нужно сместить.
   */
  function dragMainPin(x, y) {
    // корректировка координат, чтобы можно было хватать за любое место метки.
    var newX = x - pinParentCoordsX - shiftX;
    var newY = y - pinParentCoordsY - shiftY;

    if (newX < leftLimit) {
      newX = leftLimit;
    } else if (newX > rightLimit) {
      newX = rightLimit;
    }

    if (newY < TOP_LIMIT) {
      newY = TOP_LIMIT;
    } else if (newY > BOTTOM_LIMIT) {
      newY = BOTTOM_LIMIT;
    }

    pin.style.left = newX + 'px';
    pin.style.top = newY + 'px';
  }

  function onMouseMove(moveEvt) {
    dragMainPin(moveEvt.x, moveEvt.y);
    window.address.setAddress('active');
  }

  pin.parentElement.addEventListener('mousemove', onMouseMove);

  pin.addEventListener('mouseup', function () {
    pin.parentElement.removeEventListener('mousemove', onMouseMove);
  });
});

// Обработчик нажатия клавиши на основную метку по Enter
window.consts.mainPin.addEventListener('keydown', function (evt) {
  if (window.utils.isEnterKey(evt.keyCode)) {
    setStateToActive();
  }
});

// Переводит интерфейс в "активное" состояние.
function setStateToActive() {
  window.utils.$('.map').classList.remove('map--faded');
  window.pins.drawPins(window.filterForm.filterCallback);
  window.consts.newForm.classList.remove('ad-form--disabled');
  Array.prototype.forEach.call(window.consts.newForm.elements, enableFieldset);
}

// Отключим линтинг для следующей строки, так как эта функция используется в другом модуле. Тем не менее, она относится к скрипту самой странице, поэтому размещена здесь.
/* eslint-disable-next-line */
function setStateToDefault() {
  var MAIN_PIN_DEFAULT_LEFT = '570px';
  var MAIN_PIN_DEFAULT_TOP = '375px';

  window.consts.mainPin.style.left = MAIN_PIN_DEFAULT_LEFT;
  window.consts.mainPin.style.top = MAIN_PIN_DEFAULT_TOP;
  window.address.setAddress('active');
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

// вешаем disabled атрибут на все fieldset в выбранной форме.
// @param {HTMLElement} element - html element формы.
function enableFieldset(element) {
  if (element.tagName === 'FIELDSET') {
    element.removeAttribute('disabled');
  }
}

window.address.setAddress('default');
