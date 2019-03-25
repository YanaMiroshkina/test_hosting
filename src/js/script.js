(function() {

'use strict';

var requestAnimationFrame = window.requestAnimationFrame;

var dotsContainer = document.querySelector('[data-js-dots]'),
dots = document.querySelectorAll('[data-js-dot]'),
slides = document.querySelectorAll('[data-js-slide]');

// высота документа (страницы)
//определить размер страницы с учетом прокрутки можно, взяв максимум из нескольких свойств
var pageHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
);

dotsContainer.onclick = function(e) {
  if (e.target.tagName != 'SPAN') return;
  var current = switchCurrent(e.target);
  selectSlide(current);
}

function switchCurrent(el) {
  var current;
  [].forEach.call(dots, function(dot, i) {
    dot.classList.remove('active');
    if (dot === el) {
      dot.classList.add('active');
      current = i;
    }
  });
  return current;
}

function selectSlide(current) {
  [].forEach.call(slides, function(slide, i) {
    if (i == current) {
      var startY = slide.getBoundingClientRect().top,
      direction = (startY < 0) ? -1 : (startY > 0) ? 1 : 0;
      if (direction == 0) return;
      scroll(slide, direction);
    }
  });
}

function scroll(el, direction) {
  var duration = 2000,
  start = new Date().getTime();

  var fn = function() {
    var top = el.getBoundingClientRect().top,
      // время прошедшее от начала прокрутки страницы
      now = new Date().getTime() - start,
      // на сколько должна быть прокручена страница
      result = Math.round(top * now / duration);

    // корректируем значение 'result'
    result = (result > direction * top) ? top : (result == 0) ? direction : result;

    // определяем есть необходимость прокручивать страницу дальше или нет
    // применение этого условия необходимо, когда высота последнего контейнера
    // меньше высоты экрана и верхняя граница контейнера физически не может
    // достигнуть верхней границы экрана
    if (direction * top > 0 && (pageHeight - window.pageYOffset) > direction * document.documentElement.clientHeight) {
      window.scrollBy(0,result);
      // рекурсивно запускаем функцию анимации прокрутки страницы
      requestAnimationFrame(fn);
    }
  }
  // старт прокрутки страницы
  requestAnimationFrame(fn);
}

})();













