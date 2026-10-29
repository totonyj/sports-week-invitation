(function () {
  'use strict';

  var place = window.INVITATION.place;
  var lat = place.lat;
  var lng = place.lng;

  // OpenStreetMap embed (API 키 불필요)
  var dLng = 0.004;
  var dLat = 0.003;
  var bbox = [lng - dLng, lat - dLat, lng + dLng, lat + dLat].join(',');
  var embedUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=' +
    encodeURIComponent(bbox) + '&layer=mapnik&marker=' + encodeURIComponent(lat + ',' + lng);

  var links = {
    osm: 'https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lng +
      '#map=17/' + lat + '/' + lng,
    naver: 'https://map.naver.com/p/search/' + encodeURIComponent(place.address),
    kakao: 'https://map.kakao.com/link/to/' + encodeURIComponent(place.name) + ',' + lat + ',' + lng
  };

  var frame = document.querySelector('[data-map]');
  var fallback = document.querySelector('[data-map-fallback]');
  var loaded = false;

  frame.addEventListener('load', function () {
    loaded = true;
  });
  frame.src = embedUrl;

  // iframe 로드 실패는 이벤트로 알 수 없어 시간 초과로 판단
  setTimeout(function () {
    if (!loaded) {
      fallback.hidden = false;
    }
  }, 8000);

  Object.keys(links).forEach(function (key) {
    var a = document.querySelector('[data-link="' + key + '"]');
    if (a) a.href = links[key];
  });

  // 주소 복사
  var copyBtn = document.querySelector('[data-copy]');
  var defaultLabel = copyBtn.textContent;

  function showResult(text) {
    copyBtn.textContent = text;
    setTimeout(function () {
      copyBtn.textContent = defaultLabel;
    }, 1800);
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  copyBtn.addEventListener('click', function () {
    var text = place.address;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { showResult('복사되었습니다'); },
        function () { showResult(legacyCopy(text) ? '복사되었습니다' : '복사에 실패했습니다'); }
      );
    } else {
      showResult(legacyCopy(text) ? '복사되었습니다' : '복사에 실패했습니다');
    }
  });
})();
