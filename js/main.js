'use strict';

// Добавляем обработчик опускания кнопки мыши на основную метку.
window.consts.mainPin.addEventListener('mousedown', function (evt) {
  setStateToActive();
  var pin = evt.currentTarget;
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
    var newX = x - shiftX;
    var newY = y - shiftY;

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
  window.drawPins(filterCallback.bind(null, window.generatePins));
  window.consts.adForm.classList.remove('ad-form--disabled');
  Array.prototype.forEach.call(window.consts.adForm.elements, enableFieldset);
}

function filterCallback(afterFilterCallback, data) {
  var filterForm = window.consts.filterForm;
  var filtersData = new FormData(filterForm);

  var filteredData = data.filter(function (dataItem) {
    var isMatch = false;
    if (dataItem.hasOwnProperty('offer')) {
      isMatch = true;

      filtersData.forEach(function (value, key) {
        if (value !== 'any') {
          var keyAsInData = key.replace('housing-', '');
          var dataItemValue = dataItem.offer[keyAsInData];

          if (keyAsInData === 'price') {
            dataItemValue = getPriceCategory(dataItemValue);
          }

          if (value !== String(dataItemValue)) {
            isMatch = false;
          }
        }
      });
    }

    return isMatch;

  });

  filteredData = filteredData.slice(0, 5);

  afterFilterCallback(filteredData);
}

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

window.consts.filterForm.addEventListener('change', changeFilterHandler);

function changeFilterHandler(evt){
    window.debounce(function(){
      window.clearPins();
      window.clearCards();
    })
}
