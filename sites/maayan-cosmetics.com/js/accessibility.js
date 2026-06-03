(function () {
  var STORAGE_KEY = 'a11y_prefs';
  var prefs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  function applyPrefs() {
    document.body.classList.toggle('a11y-large-text',   !!prefs.largeText);
    document.body.classList.toggle('a11y-high-contrast', !!prefs.highContrast);
    document.body.classList.toggle('a11y-underline-links', !!prefs.underlineLinks);
  }

  function savePrefs() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }

  var css = `
    #a11y-btn {
      position: fixed; bottom: 24px; left: 24px; z-index: 99999;
      width: 50px; height: 50px; border-radius: 50%;
      background: #EAA098; border: none; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,.2);
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s;
    }
    #a11y-btn:hover { transform: scale(1.08); }
    #a11y-btn svg { width: 26px; height: 26px; fill: #fff; }
    #a11y-panel {
      position: fixed; bottom: 82px; left: 24px; z-index: 99999;
      background: #fff; border: 1px solid #e0d6d4; border-radius: 14px;
      padding: 16px; box-shadow: 0 8px 32px rgba(0,0,0,.15);
      min-width: 220px; display: none; direction: rtl;
      font-family: 'Varela Round', sans-serif;
    }
    #a11y-panel.open { display: block; }
    #a11y-panel h3 { margin: 0 0 12px; font-size: 14px; color: #333; font-weight: 600; }
    .a11y-option {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 4px; cursor: pointer; border-radius: 8px;
      font-size: 13px; color: #444; transition: background .15s;
    }
    .a11y-option:hover { background: #fdf5f4; }
    .a11y-option input { accent-color: #EAA098; width: 16px; height: 16px; cursor: pointer; }
    #a11y-reset {
      margin-top: 10px; width: 100%; padding: 8px; border-radius: 8px;
      border: 1px solid #EAA098; background: #fff; color: #EAA098;
      font-size: 12px; cursor: pointer; font-family: inherit; transition: background .15s;
    }
    #a11y-reset:hover { background: #fdf5f4; }
    body.a11y-large-text { font-size: 120% !important; }
    body.a11y-high-contrast { filter: contrast(1.5) !important; }
    body.a11y-underline-links a { text-decoration: underline !important; }
  `;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'a11y-btn';
  btn.setAttribute('aria-label', 'תפריט נגישות');
  btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="4" r="2"/><path d="M19 7H5a1 1 0 0 0 0 2h5.5l-1.7 5.1A4 4 0 1 0 13 19v-3.3l1.8-1.8L16 17a1 1 0 0 0 1.9-.6l-1.6-5H19a1 1 0 0 0 0-2z"/></svg>';

  var panel = document.createElement('div');
  panel.id = 'a11y-panel';
  panel.innerHTML = `
    <h3>נגישות</h3>
    <label class="a11y-option"><input type="checkbox" id="a11y-large" ${prefs.largeText ? 'checked' : ''}/> הגדלת טקסט</label>
    <label class="a11y-option"><input type="checkbox" id="a11y-contrast" ${prefs.highContrast ? 'checked' : ''}/> ניגודיות גבוהה</label>
    <label class="a11y-option"><input type="checkbox" id="a11y-links" ${prefs.underlineLinks ? 'checked' : ''}/> הדגשת קישורים</label>
    <button id="a11y-reset">איפוס</button>
  `;

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    applyPrefs();

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.classList.remove('open');
      }
    });

    document.getElementById('a11y-large').addEventListener('change', function () {
      prefs.largeText = this.checked; savePrefs(); applyPrefs();
    });
    document.getElementById('a11y-contrast').addEventListener('change', function () {
      prefs.highContrast = this.checked; savePrefs(); applyPrefs();
    });
    document.getElementById('a11y-links').addEventListener('change', function () {
      prefs.underlineLinks = this.checked; savePrefs(); applyPrefs();
    });
    document.getElementById('a11y-reset').addEventListener('click', function () {
      prefs = {}; savePrefs(); applyPrefs();
      document.getElementById('a11y-large').checked = false;
      document.getElementById('a11y-contrast').checked = false;
      document.getElementById('a11y-links').checked = false;
    });
  });
})();
