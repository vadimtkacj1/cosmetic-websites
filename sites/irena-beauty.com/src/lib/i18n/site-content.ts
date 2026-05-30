import type { Locale } from './config'

/**
 * All editable text for the public site. Components consume this object directly
 * (type-safe) via `useSiteContent()`. The admin translation editor edits a flattened
 * form and stores overrides in `data/site-content.json`, merged over these defaults.
 *
 * Non-text config (phone, email, address, links) lives here too so it can be managed
 * from one place; defaults are identical across locales.
 */
export interface SiteContent {
  nav: {
    home: string
    about: string
    portfolio: string
    pricing: string
    master: string
    contacts: string
  }
  actions: {
    book: string
    bookAppointment: string
    aboutMe: string
  }
  hero: {
    title: string
    subtitle: string
    cta: string
  }
  about: {
    eyebrow: string
    greetingPrefix: string
    name: string
    intro: string
    studioLabel: string
    studioName: string
    quote: string
    story1: string
    story2: string
    chips: string[]
    pullQuote: string
    signature: string
    galleryEyebrow: string
    galleryTitle: string
    videos: { title: string; subtitle: string }[]
  }
  why: {
    title: string
    subtitle: string
    features: { title: string; description: string }[]
    bookingTitle: string
    bookingText: string
    bookingCta: string
  }
  promos: {
    cta: string
    items: { title: string }[]
  }
  portfolio: {
    title: string
    filterAll: string
    filterPhoto: string
    filterVideo: string
    showMore: string
  }
  pricing: {
    eyebrow: string
    cta: string
    currency: string
    categories: {
      title: string
      subtitle: string
      items: { title: string; price: string }[]
    }[]
  }
  masters: {
    title: string
    subtitle: string
    items: { name: string; specialty: string }[]
  }
  testimonials: {
    title: string
    items: { name: string; location: string; text: string }[]
  }
  contact: {
    title: string
    subtitle: string
    labelAddress: string
    labelPhone: string
    labelEmail: string
    labelInstagram: string
    labelHours: string
    hours: string
    whatsappCta: string
    callCta: string
    openMaps: string
  }
  footer: {
    brandText: string
    navTitle: string
    hoursTitle: string
    hours: string
    contactsTitle: string
    labelAddress: string
    labelPhone: string
    labelInstagram: string
    copyright: string
    terms: string
    privacy: string
  }
  booking: {
    eyebrow: string
    title: string
    nameLabel: string
    namePlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    dateLabel: string
    timeLabel: string
    pickDateFirst: string
    dayClosed: string
    submit: string
    sending: string
    successTitle: string
    successText: string
    successClose: string
    errorGeneric: string
    errorNetwork: string
    close: string
  }
  /** Shared contact details (locale-independent by default). */
  business: {
    address: string
    phoneDisplay: string
    email: string
    instagramHandle: string
  }
}

export const SITE_CONTENT_RU: SiteContent = {
  nav: {
    home: 'ГЛАВНАЯ',
    about: 'ОБО МНЕ',
    portfolio: 'ПОРТФОЛИО',
    pricing: 'ЦЕНЫ',
    master: 'МАСТЕР',
    contacts: 'КОНТАКТЫ',
  },
  actions: {
    book: 'ЗАПИСАТЬСЯ',
    bookAppointment: 'ЗАПИСАТЬСЯ НА ПРИЁМ',
    aboutMe: 'ОБО МНЕ',
  },
  hero: {
    title: 'Красота — это уверенность, женственность и любовь к себе',
    subtitle:
      'Перманентный макияж бровей, губ, межресничного пространства и ногтевой сервис в уютной студии в Холоне.',
    cta: 'ОБО МНЕ',
  },
  about: {
    eyebrow: 'Обо мне',
    greetingPrefix: 'Здравствуйте, меня зовут',
    name: 'Ирэна',
    intro:
      'Мастер перманентного макияжа и ногтевого сервиса в Холоне. Для меня каждая клиентка — это отдельная история, характер, настроение и доверие.',
    studioLabel: 'Студия красоты',
    studioName: 'Holon, Sokol 41',
    quote:
      '«Я не просто мастер красоты — я женщина, которая искренне любит делать других женщин счастливее, увереннее, красивее.»',
    story1:
      'Уже не первый год я работаю в сфере красоты, постоянно развиваюсь, обучаюсь новым техникам и вкладываю душу в каждую свою работу. Моя специализация — перманентный макияж бровей, губ, межресничного пространства, коррекция и обновление старого перманента, а также красивый и аккуратный ногтевой сервис.',
    story2:
      'Принимаю в своей уютной студии — это место, где можно расслабиться, почувствовать заботу, выпить кофе, выдохнуть от ежедневной суеты и посвятить время себе.',
    chips: ['Стерильность', 'Индивидуальный подход', 'Качественные материалы', 'Уют и забота'],
    pullQuote:
      'Красота — это не про идеальность. Красота — про уверенность, женственность и любовь к себе.',
    signature: 'Ирэна',
    galleryEyebrow: 'Galleria',
    galleryTitle: 'Мои работы в видео',
    videos: [
      { title: 'Перманентный макияж', subtitle: 'Permanent Makeup' },
      { title: 'Ногтевой сервис', subtitle: 'Nail Service' },
    ],
  },
  why: {
    title: 'Почему выбирают меня',
    subtitle: 'Я верю, что красота — это про уверенность, женственность и любовь к себе.',
    features: [
      {
        title: 'Опыт и профессионализм',
        description: 'Многолетний опыт в сфере красоты и постоянное обучение новым техникам.',
      },
      {
        title: 'Индивидуальный подход',
        description:
          'Форма, цвет и техника подбираются индивидуально под ваши черты лица и пожелания.',
      },
      {
        title: 'Стерильность и качество',
        description:
          'Строгое соблюдение стерильности и использование только качественных материалов.',
      },
      {
        title: 'Уют и комфорт',
        description: 'Уютная студия, где можно расслабиться, выпить кофе и посвятить время себе.',
      },
    ],
    bookingTitle: 'Записаться ко мне!',
    bookingText:
      'Запишитесь на процедуру в уютной студии в Холоне и подарите себе время для красоты.',
    bookingCta: 'ЗАПИСАТЬСЯ НА ПРИЁМ',
  },
  promos: {
    cta: 'ЗАПИСАТЬСЯ',
    items: [
      { title: 'Перманентный макияж — красота на каждый день' },
      { title: 'Ногтевой сервис — маникюр и педикюр в уютной студии' },
    ],
  },
  portfolio: {
    title: 'Портфолио работ',
    filterAll: 'Все',
    filterPhoto: 'Фото',
    filterVideo: 'Видео',
    showMore: 'Показать ещё',
  },
  pricing: {
    eyebrow: 'Прайс',
    cta: 'ЗАПИСАТЬСЯ',
    currency: '₪',
    categories: [
      {
        title: 'Перманентный макияж',
        subtitle:
          'Форма, цвет и техника подбираются индивидуально под ваши черты лица, стиль и пожелания.',
        items: [
          { title: 'Перманент бровей', price: '900' },
          { title: 'Коррекция бровей', price: '500' },
          { title: 'Межресничная линия', price: '600' },
          { title: 'Коррекция межресничной линии', price: '400' },
          { title: 'Перманент с растушёвкой', price: '800' },
          { title: 'Коррекция растушёвки', price: '350' },
          { title: 'Контур губ', price: '750' },
          { title: 'Перманент губ', price: '1200' },
          { title: 'Коррекция губ', price: '700' },
        ],
      },
      {
        title: 'Маникюр',
        subtitle: 'Аккуратный маникюр и стойкое покрытие в уютной студии в Холоне.',
        items: [
          { title: 'Маникюр без покрытия', price: '120' },
          { title: 'Комплекс 1: маникюр с выравниванием (короткая длина) + покрытие', price: '180' },
          { title: 'Комплекс 2: маникюр с выравниванием (обычная длина) + покрытие', price: '200' },
          { title: 'Наращивание + однотонное покрытие', price: '300–400' },
          { title: 'Коррекция наращенных ногтей + покрытие', price: '220' },
          { title: 'Ремонт 1 ноготка', price: '25' },
          { title: 'Наращивание 1 ноготка', price: '30–40' },
          { title: 'Снятие не моего материала', price: '50' },
          { title: 'Полное снятие нарощенных ногтей', price: '80' },
          { title: 'Френч', price: '20' },
          { title: 'Дизайн 1 ноготка', price: '10–20' },
          { title: 'Дизайн со стразами 1 ноготка', price: '10–20' },
        ],
      },
      {
        title: 'Педикюр',
        subtitle: 'Профессиональный уход за ногтями и кожей стоп — комфортно и аккуратно.',
        items: [
          { title: 'Педикюр без покрытия', price: '170' },
          { title: 'Педикюр с лаком', price: '190' },
          { title: 'Педикюр с гель-лаком', price: '220' },
          { title: 'Педикюр пальчиков', price: '140' },
          { title: 'Педикюр пальчиков + гель-лак', price: '160' },
          { title: 'Дизайн одного ногтя', price: '10' },
          { title: 'Втирка', price: '20' },
        ],
      },
    ],
  },
  masters: {
    title: 'Мастер и специализации',
    subtitle:
      'Постоянно развиваюсь, обучаюсь новым техникам и вкладываю душу в каждую свою работу.',
    items: [
      { name: 'Ирэна', specialty: 'Мастер перманентного макияжа и ногтевого сервиса' },
      { name: 'Перманентный макияж', specialty: 'Брови, губы, межресничное пространство' },
      { name: 'Ногтевой сервис', specialty: 'Маникюр и педикюр' },
    ],
  },
  testimonials: {
    title: 'Отзывы клиенток',
    items: [
      {
        name: 'Марина С.',
        location: 'Холон',
        text: 'Ирэна — настоящий профессионал своего дела! Делала перманентный макияж бровей — результат превзошёл все ожидания. Форма идеально подошла к моему лицу, цвет натуральный. Студия уютная, атмосфера тёплая. Обязательно вернусь!',
      },
      {
        name: 'Анна К.',
        location: 'Тель-Авив',
        text: 'Делала маникюр и педикюр у Ирэны — осталась в полном восторге! Очень аккуратная работа, красивый результат. Ирэна внимательно выслушала все пожелания и сделала именно то, что я хотела. Буду приходить регулярно!',
      },
      {
        name: 'Светлана Р.',
        location: 'Ришон-ле-Цион',
        text: 'Давно хотела сделать перманентный макияж губ, но боялась. Ирэна всё подробно объяснила, успокоила, подобрала идеальный цвет. Результат — просто «вау»! Это именно то, что я хотела. Спасибо за профессионализм и заботу!',
      },
    ],
  },
  contact: {
    title: 'Свяжитесь со мной',
    subtitle:
      'Напишите, позвоните или загляните в студию — буду рада подобрать удобное время для записи.',
    labelAddress: 'Адрес',
    labelPhone: 'Телефон',
    labelEmail: 'Email',
    labelInstagram: 'Instagram',
    labelHours: 'Часы работы',
    hours: 'Пн–Сб: 09:00–18:00',
    whatsappCta: 'НАПИСАТЬ В WHATSAPP',
    callCta: 'ПОЗВОНИТЬ',
    openMaps: 'Открыть в Google Maps',
  },
  footer: {
    brandText:
      'Студия красоты Ирэны — место, где каждая женщина чувствует заботу, комфорт и доверие. Перманентный макияж и ногтевой сервис в Холоне.',
    navTitle: 'Навигация',
    hoursTitle: 'Часы работы',
    hours: 'Пн–Сб: 09:00–18:00',
    contactsTitle: 'Контакты',
    labelAddress: 'Адрес:',
    labelPhone: 'Телефон:',
    labelInstagram: 'Instagram:',
    copyright: 'Студия Ирэны — 2026. Все права защищены.',
    terms: 'Условия использования',
    privacy: 'Политика конфиденциальности',
  },
  booking: {
    eyebrow: 'Запись онлайн',
    title: 'Записаться на приём',
    nameLabel: 'Имя',
    namePlaceholder: 'Ваше имя',
    phoneLabel: 'Телефон',
    phonePlaceholder: '050-000-0000',
    dateLabel: 'Дата',
    timeLabel: 'Время',
    pickDateFirst: 'Сначала выберите дату.',
    dayClosed: 'В этот день записи нет. Выберите другую дату.',
    submit: 'ЗАПИСАТЬСЯ',
    sending: 'Отправка...',
    successTitle: 'Заявка принята!',
    successText: 'Я свяжусь с вами для подтверждения записи на {date} в {time}.',
    successClose: 'Закрыть',
    errorGeneric: 'Не удалось записаться. Попробуйте ещё раз.',
    errorNetwork: 'Ошибка сети. Попробуйте ещё раз.',
    close: 'Закрыть',
  },
  business: {
    address: 'Холон, ул. Сокол 41',
    phoneDisplay: '053-959-4370',
    email: 'irena.beauty.time@gmail.com',
    instagramHandle: '@irena_beauty_time',
  },
}

export const SITE_CONTENT_HE: SiteContent = {
  nav: {
    home: 'ראשי',
    about: 'עליי',
    portfolio: 'תיק עבודות',
    pricing: 'מחירים',
    master: 'המומחית',
    contacts: 'צור קשר',
  },
  actions: {
    book: 'לקביעת תור',
    bookAppointment: 'לקביעת תור',
    aboutMe: 'עליי',
  },
  hero: {
    title: 'יופי הוא ביטחון, נשיות ואהבה עצמית',
    subtitle:
      'איפור קבוע לגבות, שפתיים וקו ריסים ושירותי מניקור בסטודיו ביתי ונעים בחולון.',
    cta: 'עליי',
  },
  about: {
    eyebrow: 'עליי',
    greetingPrefix: 'שלום, שמי',
    name: 'אירנה',
    intro:
      'מומחית לאיפור קבוע ולשירותי מניקור בחולון. עבורי כל לקוחה היא סיפור נפרד — אופי, מצב רוח ואמון.',
    studioLabel: 'סטודיו יופי',
    studioName: 'חולון, סוקול 41',
    quote:
      '«אני לא רק מומחית יופי — אני אישה שאוהבת באמת לעשות נשים אחרות מאושרות, בטוחות ויפות יותר.»',
    story1:
      'כבר לא שנה ראשונה שאני עובדת בתחום היופי, מתפתחת כל הזמן, לומדת טכניקות חדשות ומשקיעה את הנשמה בכל עבודה. ההתמחות שלי — איפור קבוע לגבות, שפתיים וקו ריסים, תיקון וריענון של איפור קבוע ישן, וכן שירותי מניקור יפים ומדויקים.',
    story2:
      'אני מקבלת בסטודיו הביתי הנעים שלי — מקום שבו אפשר להירגע, להרגיש מטופלת, לשתות קפה, לנשום מהשגרה היומיומית ולהקדיש זמן לעצמכן.',
    chips: ['סטריליות', 'גישה אישית', 'חומרים איכותיים', 'נוחות ותשומת לב'],
    pullQuote: 'יופי הוא לא שלמות. יופי הוא ביטחון, נשיות ואהבה עצמית.',
    signature: 'אירנה',
    galleryEyebrow: 'גלריה',
    galleryTitle: 'העבודות שלי בווידאו',
    videos: [
      { title: 'איפור קבוע', subtitle: 'Permanent Makeup' },
      { title: 'שירותי מניקור', subtitle: 'Nail Service' },
    ],
  },
  why: {
    title: 'למה בוחרות בי',
    subtitle: 'אני מאמינה שיופי הוא ביטחון, נשיות ואהבה עצמית.',
    features: [
      {
        title: 'ניסיון ומקצועיות',
        description: 'שנים של ניסיון בתחום היופי ולמידה מתמדת של טכניקות חדשות.',
      },
      {
        title: 'גישה אישית',
        description: 'הצורה, הצבע והטכניקה נבחרים אישית לפי תווי הפנים והרצונות שלכן.',
      },
      {
        title: 'סטריליות ואיכות',
        description: 'שמירה קפדנית על סטריליות ושימוש בחומרים איכותיים בלבד.',
      },
      {
        title: 'נוחות ורוגע',
        description: 'סטודיו נעים שבו אפשר להירגע, לשתות קפה ולהקדיש זמן לעצמכן.',
      },
    ],
    bookingTitle: 'קבעו אצלי תור!',
    bookingText: 'קבעו תור לטיפול בסטודיו הנעים בחולון והעניקו לעצמכן זמן ליופי.',
    bookingCta: 'לקביעת תור',
  },
  promos: {
    cta: 'לקביעת תור',
    items: [
      { title: 'איפור קבוע — יופי לכל יום' },
      { title: 'שירותי מניקור — מניקור ופדיקור בסטודיו נעים' },
    ],
  },
  portfolio: {
    title: 'תיק עבודות',
    filterAll: 'הכול',
    filterPhoto: 'תמונות',
    filterVideo: 'וידאו',
    showMore: 'הצג עוד',
  },
  pricing: {
    eyebrow: 'מחירון',
    cta: 'לקביעת תור',
    currency: '₪',
    categories: [
      {
        title: 'איפור קבוע',
        subtitle: 'הצורה, הצבע והטכניקה נבחרים אישית לפי תווי הפנים, הסגנון והרצונות שלכן.',
        items: [
          { title: 'איפור קבוע גבות', price: '900' },
          { title: 'תיקון גבות', price: '500' },
          { title: 'קו ריסים', price: '600' },
          { title: 'תיקון קו ריסים', price: '400' },
          { title: 'איפור קבוע בהצללה', price: '800' },
          { title: 'תיקון הצללה', price: '350' },
          { title: 'קונטור שפתיים', price: '750' },
          { title: 'איפור קבוע שפתיים', price: '1200' },
          { title: 'תיקון שפתיים', price: '700' },
        ],
      },
      {
        title: 'מניקור',
        subtitle: 'מניקור מדויק וציפוי עמיד בסטודיו הנעים בחולון.',
        items: [
          { title: 'מניקור ללא ציפוי', price: '120' },
          { title: 'קומפלקס 1: מניקור עם יישור (אורך קצר) + ציפוי', price: '180' },
          { title: 'קומפלקס 2: מניקור עם יישור (אורך רגיל) + ציפוי', price: '200' },
          { title: 'בנייה + ציפוי בצבע אחיד', price: '300–400' },
          { title: 'מילוי ציפורניים בנויות + ציפוי', price: '220' },
          { title: 'תיקון ציפורן אחת', price: '25' },
          { title: 'בנייה של ציפורן אחת', price: '30–40' },
          { title: 'הסרת חומר שלא שלי', price: '50' },
          { title: 'הסרה מלאה של ציפורניים בנויות', price: '80' },
          { title: 'פרנץ׳', price: '20' },
          { title: 'עיצוב ציפורן אחת', price: '10–20' },
          { title: 'עיצוב עם אבנים — ציפורן אחת', price: '10–20' },
        ],
      },
      {
        title: 'פדיקור',
        subtitle: 'טיפוח מקצועי של הציפורניים ועור כפות הרגליים — בנוחות ובעדינות.',
        items: [
          { title: 'פדיקור ללא ציפוי', price: '170' },
          { title: 'פדיקור עם לק', price: '190' },
          { title: 'פדיקור עם ג׳ל לק', price: '220' },
          { title: 'פדיקור אצבעות', price: '140' },
          { title: 'פדיקור אצבעות + ג׳ל לק', price: '160' },
          { title: 'עיצוב ציפורן אחת', price: '10' },
          { title: 'הברקה (ויטרקה)', price: '20' },
        ],
      },
    ],
  },
  masters: {
    title: 'המומחית וההתמחויות',
    subtitle: 'מתפתחת כל הזמן, לומדת טכניקות חדשות ומשקיעה את הנשמה בכל עבודה.',
    items: [
      { name: 'אירנה', specialty: 'מומחית לאיפור קבוע ולשירותי מניקור' },
      { name: 'איפור קבוע', specialty: 'גבות, שפתיים, קו ריסים' },
      { name: 'שירותי מניקור', specialty: 'מניקור ופדיקור' },
    ],
  },
  testimonials: {
    title: 'המלצות לקוחות',
    items: [
      {
        name: 'מרינה ס.',
        location: 'חולון',
        text: 'אירנה היא אשת מקצוע אמיתית! עשיתי איפור קבוע לגבות — התוצאה עלתה על כל הציפיות. הצורה התאימה בול לפנים שלי, הצבע טבעי. הסטודיו נעים והאווירה חמה. בהחלט אחזור!',
      },
      {
        name: 'אנה ק.',
        location: 'תל אביב',
        text: 'עשיתי מניקור ופדיקור אצל אירנה — נשארתי מוקסמת לגמרי! עבודה מאוד מדויקת, תוצאה יפה. אירנה הקשיבה לכל הבקשות ועשתה בדיוק מה שרציתי. אגיע באופן קבוע!',
      },
      {
        name: 'סבטלנה ר.',
        location: 'ראשון לציון',
        text: 'הרבה זמן רציתי איפור קבוע לשפתיים אבל פחדתי. אירנה הסבירה הכול בפירוט, הרגיעה, בחרה את הצבע המושלם. התוצאה — פשוט וואו! בדיוק מה שרציתי. תודה על המקצועיות והאכפתיות!',
      },
    ],
  },
  contact: {
    title: 'צרו איתי קשר',
    subtitle: 'כתבו, התקשרו או קפצו לסטודיו — אשמח למצוא זמן נוח לקביעת תור.',
    labelAddress: 'כתובת',
    labelPhone: 'טלפון',
    labelEmail: 'אימייל',
    labelInstagram: 'אינסטגרם',
    labelHours: 'שעות פעילות',
    hours: 'א׳–ש׳: 09:00–18:00',
    whatsappCta: 'כתבו בוואטסאפ',
    callCta: 'התקשרו',
    openMaps: 'פתחו ב-Google Maps',
  },
  footer: {
    brandText:
      'הסטודיו של אירנה — מקום שבו כל אישה מרגישה מטופלת, נוחה ובטוחה. איפור קבוע ושירותי מניקור בחולון.',
    navTitle: 'ניווט',
    hoursTitle: 'שעות פעילות',
    hours: 'א׳–ש׳: 09:00–18:00',
    contactsTitle: 'צור קשר',
    labelAddress: 'כתובת:',
    labelPhone: 'טלפון:',
    labelInstagram: 'אינסטגרם:',
    copyright: 'הסטודיו של אירנה — 2026. כל הזכויות שמורות.',
    terms: 'תנאי שימוש',
    privacy: 'מדיניות פרטיות',
  },
  booking: {
    eyebrow: 'קביעת תור אונליין',
    title: 'לקביעת תור',
    nameLabel: 'שם',
    namePlaceholder: 'השם שלך',
    phoneLabel: 'טלפון',
    phonePlaceholder: '050-000-0000',
    dateLabel: 'תאריך',
    timeLabel: 'שעה',
    pickDateFirst: 'בחרו תחילה תאריך.',
    dayClosed: 'אין תורים ביום זה. בחרו תאריך אחר.',
    submit: 'לקביעת תור',
    sending: 'שולח...',
    successTitle: 'הבקשה התקבלה!',
    successText: 'אצור איתך קשר לאישור התור ל-{date} בשעה {time}.',
    successClose: 'סגירה',
    errorGeneric: 'לא הצלחנו לקבוע תור. נסו שוב.',
    errorNetwork: 'שגיאת רשת. נסו שוב.',
    close: 'סגירה',
  },
  business: {
    address: 'חולון, רחוב סוקול 41',
    phoneDisplay: '053-959-4370',
    email: 'irena.beauty.time@gmail.com',
    instagramHandle: '@irena_beauty_time',
  },
}

export const SITE_CONTENT_DEFAULTS: Record<Locale, SiteContent> = {
  ru: SITE_CONTENT_RU,
  he: SITE_CONTENT_HE,
}
