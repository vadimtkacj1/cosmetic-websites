(function () {
  'use strict';

  /* ============================================================
     COOKIES BANNER
     ============================================================ */

  var COOKIE_KEY = 'hofit_cookie_consent';

  function buildCookies() {
    if (localStorage.getItem(COOKIE_KEY)) return;

    var banner = document.createElement('div');
    banner.id = 'cookiesBanner';
    banner.className = 'cookies-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'הסכמה לשימוש בעוגיות');
    banner.innerHTML =
      '<div class="cookies-inner">' +
        '<span class="cookies-icon" aria-hidden="true">🍪</span>' +
        '<p class="cookies-text">' +
          '<strong>אנחנו משתמשים בעוגיות</strong> — ' +
          'האתר משתמש בקבצי Cookie לשיפור חוויית הגלישה וניתוח תנועה. המשך גלישה מהווה הסכמה. ' +
          '<a href="/privacy.html" target="_blank" rel="noopener">מדיניות פרטיות ←</a>' +
        '</p>' +
        '<div class="cookies-actions">' +
          '<button class="cookies-btn-accept" id="cookiesAccept" type="button">קבלה</button>' +
          '<button class="cookies-btn-decline" id="cookiesDecline" type="button">דחייה</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    setTimeout(function () { banner.classList.add('show'); }, 900);

    function dismiss(choice) {
      localStorage.setItem(COOKIE_KEY, choice);
      banner.classList.remove('show');
      setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 500);
    }

    document.getElementById('cookiesAccept').addEventListener('click', function () { dismiss('accepted'); });
    document.getElementById('cookiesDecline').addEventListener('click', function () { dismiss('declined'); });
  }

  /* ── Init ─────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildCookies);
  } else {
    buildCookies();
  }

})();
