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

// Переводит интерфейс в "активное" состояние.
function setStateToActive() {
  window.$('.map').classList.remove('map--faded');
  // var filtersForm = $('.map__filters');
  window.drawPins();
  window.consts.adForm.classList.remove('ad-form--disabled');
  Array.prototype.forEach.call(window.consts.adForm.elements, enableFieldset);
}

function setStateToDefault() {
  window.consts.mainPin.style.left = '570px';
  window.consts.mainPin.style.top = '375px';
  window.setAddress('active');
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
