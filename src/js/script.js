(function() {

  'use strict';

  /* ======================================= */
  /* ========== SCROLL TO SLIDES =========== */
  /* ======================================= */

  var browser_window = window,
  html = document,
  request_animation_frame = browser_window.requestAnimationFrame,
  dots_container = html.querySelector('[data-js-dots]'),
  dots = html.querySelectorAll('[data-js-dot]'),
  arrow_down = html.querySelector('[data-js-arrow]'),
  slides = html.querySelectorAll('[data-js-slide]');

  /* определить размер страницы с учетом прокрутки можно, взяв максимум из нескольких свойств */
  var page_height = Math.max(
    html.body.scrollHeight, html.documentElement.scrollHeight,
    html.body.offsetHeight, html.documentElement.offsetHeight,
    html.body.clientHeight, html.documentElement.clientHeight
  );

  dots_container.onclick = function(e) {
    if (e.target.tagName != 'SPAN') return;
    var current = switch_current(e.target);
    select_slide(current);
  }

  arrow_down.onclick = function(e) {
    select_slide(1);
  }

  function switch_current(el) {
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

  function select_slide(current) {
    [].forEach.call(slides, function(slide, i) {
      if (i == current) {
        var start_y = slide.getBoundingClientRect().top,
        direction = (start_y < 0) ? -1 : (start_y > 0) ? 1 : 0;
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
        /* время, прошедшее от начала прокрутки страницы */
        now = new Date().getTime() - start,
        /* насколько должна быть прокручена страница */
        result = Math.round(top * now / duration);

      /* корректируем значение 'result' */
      result = (result > direction * top) ? top : (result == 0) ? direction : result;

      if (direction * top > 0 && (page_height - browser_window.pageYOffset) > direction * html.documentElement.clientHeight) {
        browser_window.scrollBy(0,result);
        request_animation_frame(fn);
      }
    }
    request_animation_frame(fn);
  }

  /* ======================================= */
  /* ======== SWITCH DOTS ON SCROLL ======== */
  /* ======================================= */

  function set_dot_on_scroll() {
    
    var window_height = browser_window.innerHeight,
    half_window_height = window_height / 2;

    [].forEach.call(slides, function(slide, i) {

      var current = +slide.getAttribute('data-js-slide'),
      coords = slide.getBoundingClientRect(),
      slide_top = coords.top,
      slide_bottom = coords.bottom;

      /* slide occupies more than 50% of the screen when top is almost on top */
      if (((slide_top >= 0 && slide_top < half_window_height && slide_bottom >= 0)
        /* slide occupies more than 50% when block's bottom is almost on the bottom */ 
        || (slide_bottom > half_window_height && slide_bottom < window_height))
        /* slide's borders are above and under the screen */ 
        || (slide_top < 0 && slide_bottom > window_height)) {

        [].forEach.call(dots, function(dot, i) {
          dot.classList.remove('active');
          if (i === current) {
            dot.classList.add('active');
          }
        });
      }

    });

  }

  set_dot_on_scroll();

  browser_window.onscroll = set_dot_on_scroll;

  /* ======================================= */
  /* ============ CHECK DOMAIN ============= */
  /* ======================================= */

  var form_check_domain = html.querySelector("[data-js-form='check-domain']"),
  el_domain_input = html.querySelector('[data-js-domain-input]'),
  btn_check_domain = html.querySelector("[data-js-btn='check-domain']"),
  el_domain_info = html.querySelector('[data-js-domain-info]'),
  el_domain_data = html.querySelector('[data-js-domain-data]'),
  regexp_domain = /^(([a-zа-яё0-9]+\.)*[a-zа-яё0-9]+\.[a-zа-яё]+)$/;

  form_check_domain.onsubmit = function(e) {
    e.preventDefault();

    var domain = el_domain_input.value.toLowerCase(),
    data = '',
    xhr = new XMLHttpRequest();

    if (regexp_domain.test(domain)) {
      data = encodeURIComponent(domain);
    } else {
      alert('Заполните поле корректно');
      return;
    }

    // xhr.open('POST', '/check-domain', true);
    // xhr.send(data);

    // xhr.onreadystatechange = function() {

      el_domain_data.textContent = '';
      // el_domain_data.textContent = this.responseText;
      el_domain_data.textContent = 'Домен ' + domain + ' свободен.';
      el_domain_info.classList.add('visible');

    // }

  }

  btn_check_domain.onblur = function() {
    el_domain_info.classList.remove('visible');
  }

  /* ======================================= */
  /* ====== OPEN BENEFIT DESCRIPTION ======= */
  /* ======================================= */

  var btns_open_description = html.querySelectorAll("[data-js-open='benefit-description']"),
  els_description = html.querySelectorAll('[data-js-description]');

  [].forEach.call(btns_open_description, function(btn) {

    btn.addEventListener('click', function(e) {
      var t = e.currentTarget,
      next = t.nextSibling,
      is_visible = next.classList.contains('visible'),
      height = 200,
      max_height = 0,
      end_height = 0,
      unwrap_duration = 3000,
      start_time_flag = 0,
      start_time = start_time_flag = (new Date()).getTime(),
      time_passed = 0,
      roll_down = !!is_visible ? false : true,
      hide_all = false,
      el_visible = '',
      elem = '';

      function change_height(time_passed) {
        if (hide_all) {
          max_height = height - (time_passed/unwrap_duration) * height;
          elem = el_visible;
        } else if (roll_down) {
          max_height = (time_passed/unwrap_duration) * height;
          elem = next;
        }
        elem.style.maxHeight = max_height + 'px';
        
      }

      function roll_down_after_wrapping() {
        time_passed = unwrap_duration;
        if (hide_all) {
          hide_all = false;
          el_visible = '';
          if (roll_down) {
            start_time = (new Date()).getTime();
            start_time_flag = start_time;
            time_passed = 0;
            request_animation_frame(each_frame);
          }
        }
      }

      function each_frame() {
        if (!is_visible) {
          next.classList.add('visible');
        }
        time_passed = time_passed + (new Date()).getTime() - start_time;
        if (start_time == start_time_flag) {
          start_time = (new Date()).getTime();
          change_height(0);
        } else if (time_passed < unwrap_duration) {
          change_height(time_passed);
        } else if (time_passed >= unwrap_duration) {
          // завершающий шаг анимации -
          // иногда блок сворачивается или разворачивается
          // немного не до конца, и его нужно доанимировать
          change_height(unwrap_duration);
          // эта функция развернет нужный блок,
          // если после сворачивания всех блоков
          // какой-то из них требуется развернуть
          roll_down_after_wrapping();
          return;
        }

        request_animation_frame(each_frame);
      };

      [].forEach.call(els_description, function(el) {
        if (el.classList.contains('visible')) {
          hide_all = true;
          el_visible = el;
          el.classList.remove('visible'); 
        }
      });

      request_animation_frame(each_frame);

    });
  });
  

})();

















