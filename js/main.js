'use strict';

window.app = {
  isDataLoaded: false,
};

// Добавляем обработчик опускания кнопки мыши на основную метку. Данный обработчик отслеживает перемещение основной метки и меняет значение адреса.
window.consts.mainPin.addEventListener('mousedown', function (evt) {
  var TOP_LIMIT = 130;
  var BOTTOM_LIMIT = 630;

  window.state.setActive();

  var pin = evt.currentTarget;
  var pinParent = pin.parentElement;

  var pinParentCoords = pinParent.getBoundingClientRect();
  var pinParentCoordsX = pinParentCoords.left;
  var pinParentCoordsY = pinParentCoords.top;

  var coords = pin.getBoundingClientRect();
  var coordsX = pin.offsetLeft;
  var coordsY = pin.offsetTop;
  var shiftX = evt.clientX - pinParentCoordsX - coordsX;
  var shiftY = evt.clientY - pinParentCoordsY - coordsY;

  var leftLimit = -(coords.width / 2);
  var rightLimit = pinParentCoords.width - coords.width / 2;

  dragMainPin(evt.clientX, evt.clientY);

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
    window.state.setActive();
  }
  
});


window.address.setAddress('default');
