(function () {
  'use strict';

  var KEY = 'invitation-theme';
  var root = document.documentElement;

  function readSaved() {
    try {
      var v = localStorage.getItem(KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch (e) {
      return null;
    }
  }

  function save(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      // 저장소를 쓸 수 없으면 현재 방문에서만 적용
    }
  }

  // 저장된 값이 없으면 기기 설정을 따른다 (기본은 라이트)
  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0f1b2d' : '#f3f6fb');
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      var toDark = theme === 'light';
      btn.textContent = toDark ? '다크' : '라이트';
      btn.setAttribute('aria-label', toDark ? '다크 모드로 전환' : '라이트 모드로 전환');
    }
  }

  // 깜빡임 방지: 렌더링 전에 먼저 적용
  apply(readSaved() || systemTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('[data-theme-toggle]');
    apply(root.getAttribute('data-theme'));
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      save(next);
    });
  });
})();
