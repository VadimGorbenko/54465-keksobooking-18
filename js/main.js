'use strict';

// Добавляем обработчик опускания кнопки мыши на основную метку.
window.consts.mainPin.addEventListener('mousedown', function () {
  setStateToActive();
  window.setAddress('active');
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

  window.consts.adForm.classList.remove('ad-form--disabled');
  Array.prototype.forEach.call(window.consts.adForm.elements, enableFieldset);
}

// вешаем disabled атрибут на все fieldset в выбранной форме.
// @param {HTMLElement} element - html element формы.
function enableFieldset(element) {
  if (element.tagName === 'FIELDSET') {
    element.removeAttribute('disabled');
  }
}

window.setAddress('default');

// Добавляем обработчик отравки формы, в котором будем её валидировать.
window.consts.adForm.addEventListener('submit', window.adFormSubmitHandler);
