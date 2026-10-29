(function () {
  'use strict';

  var cfg = window.INVITATION;
  var KST_OFFSET_MS = 9 * 60 * 60 * 1000;
  var DAY_MS = 24 * 60 * 60 * 1000;

  var eventTime = new Date(cfg.eventDate).getTime();

  // 기기 시간대와 무관하게 KST 달력 날짜를 UTC 자정 값으로 환산
  function kstDayStart(ms) {
    var d = new Date(ms + KST_OFFSET_MS);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = text;
    });
  }

  function render() {
    var now = Date.now();
    var dayDiff = Math.round((kstDayStart(eventTime) - kstDayStart(now)) / DAY_MS);
    var remain = eventTime - now;
    var countdown = document.querySelector('[data-countdown]');
    var dday = document.querySelector('[data-dday]');

    if (dayDiff > 0) {
      dday.textContent = 'D-' + dayDiff;
    } else if (dayDiff === 0) {
      dday.textContent = 'D-DAY';
    } else {
      dday.textContent = '행사가 종료되었습니다';
    }

    var ended = remain <= 0;
    countdown.classList.toggle('is-ended', ended);
    var total = ended ? 0 : Math.floor(remain / 1000);
    var parts = {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60
    };
    Object.keys(parts).forEach(function (key) {
      var el = countdown.querySelector('[data-cd="' + key + '"]');
      el.textContent = key === 'days' ? String(parts[key]) : pad(parts[key]);
    });

    return !ended;
  }

  // 행사 정보 채우기
  document.title = cfg.title + ' 초대장';
  setText('[data-title]', cfg.title);
  setText('[data-tagline]', cfg.tagline);
  setText('[data-date]', cfg.dateText);
  setText('[data-time]', cfg.timeText);
  setText('[data-target]', cfg.target);
  setText('[data-place-name]', cfg.place.name);
  setText('[data-address]', cfg.place.address);

  var timer = null;
  function tick() {
    if (!render() && timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    if (timer) return;
    if (render()) timer = setInterval(tick, 1000);
  }

  // 탭이 숨겨진 동안은 갱신을 멈추고 돌아오면 즉시 갱신
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearInterval(timer);
      timer = null;
    } else {
      start();
    }
  });

  start();
})();
