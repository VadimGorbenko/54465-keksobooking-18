'use strict';

window.app = {
  isDataLoaded: false,
};

// Добавляем обработчик опускания кнопки мыши на основную метку. Данный обработчик отслеживает перемещение основной метки и меняет значение адреса.
window.consts.mainPin.addEventListener('mousedown', function (evt) {
  var TOP_LIMIT = 130;
  var BOTTOM_LIMIT = 630;
  var FULL_PIN_HEIGHT = 87;

  window.state.setActive();

  var pin = evt.currentTarget;
  var pinParent = pin.parentElement;
  var pinParentParams = pinParent.getBoundingClientRect();

  var shiftX = evt.offsetX;
  var shiftY = evt.offsetY;

  var pinParentCoords = pinParent.getBoundingClientRect();
  var coords = pin.getBoundingClientRect();

  var leftLimit = -(coords.width / 2);
  var rightLimit = pinParentCoords.width - coords.width / 2;


  dragMainPin(evt.pageX, evt.page);

  /**
   * @description передвигаем метку, проверяя лимиты
   * @param {Number} x - соответствующая координата, на которую нужно сместить.
   * @param {Number} y - соответствующая координата, на которую нужно сместить.
   */
  function dragMainPin(x, y) {
    // корректировка координат, чтобы можно было хватать за любое место метки.
    var newX = x - pinParentParams.left - window.scrollX - shiftX;
    var newY = y - pinParentParams.top - window.scrollY - shiftY;

    var pinPeakY = newY + FULL_PIN_HEIGHT;

    if (newX < leftLimit) {
      newX = leftLimit;
    } else if (newX > rightLimit) {
      newX = rightLimit;
    }

    if (pinPeakY < TOP_LIMIT) {
      newY = TOP_LIMIT - FULL_PIN_HEIGHT;
    } else if (pinPeakY > BOTTOM_LIMIT) {
      newY = BOTTOM_LIMIT - FULL_PIN_HEIGHT;
    }

    pin.style.left = newX + 'px';
    pin.style.top = newY + 'px';
  }


  pin.parentElement.addEventListener('mousemove', mouseMoveHandler);

  document.addEventListener('mouseup', mouseUpHandler);

  function mouseMoveHandler(moveEvt) {
    dragMainPin(moveEvt.pageX, moveEvt.pageY);
    window.address.setAddress('active');
  }

  function mouseUpHandler() {
    pin.parentElement.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  }
});

// Обработчик нажатия клавиши на основную метку по Enter
window.consts.mainPin.addEventListener('keydown', function (evt) {
  if (window.utils.isEnterKey(evt.keyCode)) {
    window.state.setActive();
  }
});


window.address.setAddress('default');
