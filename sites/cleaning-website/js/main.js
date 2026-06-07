// ── SERVICE IMAGE MAP ──
const showcaseImg = document.getElementById('service-showcase-img');

function initServiceItems(container) {
  container.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.service-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      if (showcaseImg && item.dataset.img) {
        showcaseImg.style.opacity = '0';
        setTimeout(() => {
          showcaseImg.src = item.dataset.img;
          showcaseImg.style.opacity = '1';
        }, 150);
      }
    });
  });
}

// ── SERVICE TABS (Residential / Commercial) ──
document.querySelectorAll('.services-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.services-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.dataset.target;
    document.querySelectorAll('.service-items').forEach(panel => panel.classList.remove('active'));
    const activePanel = document.getElementById(target);
    if (activePanel) {
      activePanel.classList.add('active');
      // set showcase to first active item in new tab
      const firstItem = activePanel.querySelector('.service-item');
      if (firstItem && showcaseImg && firstItem.dataset.img) {
        showcaseImg.src = firstItem.dataset.img;
        activePanel.querySelectorAll('.service-item').forEach(i => i.classList.remove('active'));
        firstItem.classList.add('active');
      }
    }
  });
});

// init clicks on all service panels
document.querySelectorAll('.service-items').forEach(initServiceItems);

// showcase img transition
if (showcaseImg) {
  showcaseImg.style.transition = 'opacity .15s';
}

// ── REVIEWS CAROUSEL ──
(function () {
  const allReviews = [
    { text: "הם היו מאוד אדיבים, מקצועיים, דייקנים, שיתופי פעולה, יסודיים וזהירים. הם ניקו בצורה מושלמת את החלונות, הקירות ועמוד הארובה שלי. אני מתכנן להזמין אותם שוב באופן קבוע.", name: "Carla R.", location: "Lexington, KY" },
    { text: "השירות היה הטוב ביותר שקיבלנו מכל חברה במשך שנים! ספקי השירות היו דייקנים, חרוצים, מקצועיים וידידותיים. הבית שלנו נראה כמעט חדש שוב.", name: "Mike S.", location: "Richmond, VA" },
    { text: "הם באמת עשו עבודה יסודית בניקוי החלונות הגבוהים שלנו (פנים וחוץ) כולל חלונות המרפסת והטרסה. הם אפילו הצליחו להסיר כתמי מים ישנים וקשים מאוד.", name: "Benoit P.", location: "Miami, FL" },
    { text: "שירות הלקוחות של החברה הזאת הוא מספר 1. הם היו דייקנים, אדיבים ויסודיים. היו לנו חברות ניקוי חלונות אחרות בעבר, אבל מעולם לא קיבלנו את רמת העבודה הזאת.", name: "Judy C.", location: "Fort Collins, CO" },
    { text: "אני משתמש במן אין קילטס מספר שנים. הם תמיד בזמן, מקצועיים ועושים עבודה מצוינת. אני ממליץ עליהם בחום!", name: "Sarah M.", location: "Denver, CO" },
    { text: "שירות נפלא ממש. החלונות שלי מעולם לא נראו כל כך נקיים. הצוות היה ידידותי ויעיל. בהחלט אשתמש בהם שוב!", name: "David L.", location: "Seattle, WA" },
  ];

  const track = document.querySelector('.reviews-track');
  if (!track) return;

  let current = 0;
  const perPage = () => window.innerWidth < 768 ? 1 : 2;

  function render() {
    const pp = perPage();
    const page = allReviews.slice(current, current + pp);
    track.innerHTML = page.map(r => `
      <div class="review-card">
        <p>${r.text}</p>
        <div class="reviewer"><bdi>${r.name}</bdi></div>
        <div class="location"><span dir="ltr">${r.location}</span></div>
      </div>`).join('');
  }

  document.querySelector('.reviews-prev')?.addEventListener('click', () => {
    current = (current - perPage() + allReviews.length) % allReviews.length;
    render();
  });
  document.querySelector('.reviews-next')?.addEventListener('click', () => {
    current = (current + perPage()) % allReviews.length;
    render();
  });

  render();
  window.addEventListener('resize', render);
})();

// ── MOBILE MENU ──
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.navigation-column')?.classList.toggle('open');
});

// ── READ MORE ──
const readMoreBtn = document.querySelector('.read-more-btn');
const hiddenContent = document.querySelector('.about-hidden');
if (readMoreBtn && hiddenContent) {
  readMoreBtn.addEventListener('click', () => {
    const open = hiddenContent.style.display === 'block';
    hiddenContent.style.display = open ? 'none' : 'block';
    readMoreBtn.textContent = open ? 'המשך לקרוא' : 'קרא פחות';
  });
}
