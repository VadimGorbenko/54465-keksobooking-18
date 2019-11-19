'use strict';

(function () {

  var TIMEIN_INPUT = window.consts.newForm.querySelector('#timein');
  var TIMEOUT_INPUT = window.consts.newForm.querySelector('#timeout');
  var ROOMS_INPUT = window.consts.newForm.querySelector('#room_number');
  var GUESTS_INPUT = window.consts.newForm.querySelector('#capacity');
  var AVATAR_INPUT = window.consts.newForm.querySelector('#avatar');
  var AVATAR_INPUT_DROPZONE = window.consts.newForm.querySelector('.ad-form-header__drop-zone');
  var PHOTOS_INPUT = window.consts.newForm.querySelector('#images');
  var PHOTOS_INPUT_DROPZONE = window.consts.newForm.querySelector('.ad-form__drop-zone');
  var NOT_FOR_GUESTS_ROOMS = 100;
  var NOT_FOR_GUESTS_CAPACITY = 0;

  window.newForm = {
    /**
     * @description обработчик(валидатор) отправки формы.
     * @param {Event} evt - объект события.
     */
    submitHandler: function (evt) {
      evt.preventDefault();
      var form = evt.target;
      form.address.removeAttribute('disabled');
      window.API.sendData(form, window.newForm.submitSuccessHandler, window.newForm.submitFailHandler);
      form.address.setAttribute('disabled', true);
    },

    submitSuccessHandler: function () {
      var form = window.consts.newForm;
      form.reset();
      window.pins.clearCards();
      window.pins.clearPins();
      window.state.setToDefault();
      window.filterForm.resetFilters();
      window.newForm.showMessage('success');
    },

    submitFailHandler: function () {
      window.newForm.showMessage('error');
    },

    showMessage: function (type) {
      var template = window.utils.$('#' + type).content.querySelector('.' + type);
      var message = template.cloneNode(true);
      message.addEventListener('click', function (evt) {
        evt.currentTarget.remove();
      });
      window.document.addEventListener('keydown', closeMessage);
      window.utils.$('main').prepend(message);

      function closeMessage(evt) {
        if (window.utils.isEscKey(evt.keyCode)) {
          message.remove();
          message = null;
          document.removeEventListener('keydown', closeMessage);
        }
      }
    }
  };

  // Добавляем обработчик отправки формы, в котором будем её валидировать.
  window.consts.newForm.addEventListener('submit', window.newForm.submitHandler);

  window.utils.$('.ad-form__reset').addEventListener('click', window.state.setToDefault);
  // Добавляем обработчики событий для связи изменения времени заезда и выезда
  // заезд
  TIMEIN_INPUT.addEventListener('change', function (evt) {
    TIMEOUT_INPUT.value = evt.target.value;
  });

  // выезд
  TIMEOUT_INPUT.addEventListener('change', function (evt) {
    TIMEIN_INPUT.value = evt.target.value;
  });

  ROOMS_INPUT.addEventListener('change', roomsChangeHandler);

  /**
   * @description функция, сопоставляющая возможные варианты выбора количества гостей, в зависимости от выбранного количества комнат.
   * @param {Event} evt - событие изменения.
   */
  function roomsChangeHandler(evt) {
    var value = Number(evt.target.value);

    if (value === NOT_FOR_GUESTS_ROOMS) {
      GUESTS_INPUT.querySelectorAll('option').forEach(function (option) {
        var numberOptionValue = Number(option.value);

        if (numberOptionValue !== NOT_FOR_GUESTS_CAPACITY) {
          option.setAttribute('disabled', 'disabled');
        } else {
          option.removeAttribute('disabled');
        }

      });
      GUESTS_INPUT.value = NOT_FOR_GUESTS_CAPACITY;
    } else {
      GUESTS_INPUT.querySelectorAll('option').forEach(function (option) {
        var numberOptionValue = Number(option.value);

        if (numberOptionValue > value || numberOptionValue === NOT_FOR_GUESTS_CAPACITY) {
          option.setAttribute('disabled', 'disabled');
        } else {
          option.removeAttribute('disabled');
        }

      });
      GUESTS_INPUT.value = value;
    }
  }

  // Добавим обработчики событий на изменения инпутов файлов и их драг-н-дрон зоны.
  AVATAR_INPUT.addEventListener('change', filesChangeHandler);
  AVATAR_INPUT_DROPZONE.addEventListener('dragover', dropzoneDragoverHandler);
  AVATAR_INPUT_DROPZONE.addEventListener('drop', dragzoneDropHandler);
  PHOTOS_INPUT.addEventListener('change', filesChangeHandler);
  PHOTOS_INPUT_DROPZONE.addEventListener('dragover', dropzoneDragoverHandler);
  PHOTOS_INPUT_DROPZONE.addEventListener('drop', dragzoneDropHandler);

  /**
   * @description функция обработчик изменения файлов. Проверяет, как был изменён инпут, напрямую или через drag-n-drop и рисует превью.
   * @param {Event} evt - объект события.
   */
  function filesChangeHandler(evt) {
    var isByDrop = evt.dataTransfer ? true : false;
    var imgContainer;
    var files;
    if (isByDrop) {
      files = evt.dataTransfer.files;
      imgContainer = evt.target.htmlFor === 'avatar' ? window.consts.avatarInputPreview : window.consts.photosInputPreview;
    } else {
      files = evt.target.files;
      imgContainer = evt.target.name === 'avatar' ? window.consts.avatarInputPreview : window.consts.photosInputPreview;
    }

    previewImages(files, imgContainer);
  }

  /**
   * @description Загружает картинку из files как dataURI и отображает её в imgContainer;
   * @param {*} files
   * @param {*} imgContainer
   */
  function previewImages(files, imgContainer) {
    var PREVIEW_SIZE = 40;

    [].forEach.call(files, function (file) {

      if (file.type.match(/image.*/)) {
        var reader = new FileReader();

        reader.onload = function (loadEvent) {
          imgContainer.innerHTML = '';
          var img = document.createElement('img');
          img.src = loadEvent.target.result;
          img.width = PREVIEW_SIZE;
          img.height = PREVIEW_SIZE;

          imgContainer.appendChild(img);
        };

        reader.readAsDataURL(file);
      }

    });
  }

  function dropzoneDragoverHandler(evt) {
    evt.preventDefault();

    evt.target.classList.add('active');
    evt.dataTransfer.dropEffect = 'copy';
  }

  function dragzoneDropHandler(evt) {
    evt.preventDefault();

    evt.target.classList.remove('active');
    filesChangeHandler(evt);
  }

  // Добавление обработчика изменения минимальной цены за ночь в зависимости от типа жилья размещаемого объявления.
  window.utils.$('#type').addEventListener('change', function (evt) {
    var FLAT_PRICE = 1000;
    var HOUSE_PRICE = 5000;
    var PALACE_PRICE = 10000;
    var BUNGALO_PRICE = 0;

    var chosenType = evt.target.value;
    var priceInput = window.utils.$('#price');
    var minValue;

    switch (chosenType) {
      case 'flat':
        minValue = FLAT_PRICE;
        break;
      case 'house':
        minValue = HOUSE_PRICE;
        break;
      case 'palace':
        minValue = PALACE_PRICE;
        break;
      default:
        minValue = BUNGALO_PRICE;
        break;
    }

    priceInput.setAttribute('min', minValue);
    priceInput.setAttribute('placeholder', minValue);

  });

})();
