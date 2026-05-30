import type { Locale } from './config'

/** UI strings for the `/admin` panel. Code-defined (not editable from the UI). */
export interface AdminStrings {
  brand: string
  common: {
    loading: string
    save: string
    saving: string
    saved: string
    saveChanges: string
    refresh: string
    cancel: string
    edit: string
    delete: string
    logout: string
    backToList: string
  }
  nav: {
    bookings: string
    slots: string
    messenger: string
    telegram: string
    content: string
    help: string
    posts: string
    portfolio: string
  }
  login: {
    subtitle: string
    passwordLabel: string
    passwordPlaceholder: string
    submit: string
    submitting: string
    wrongPassword: string
    errorGeneric: string
    errorNetwork: string
  }
  bookings: {
    title: string
    countSuffix: string
    newTitle: string
    name: string
    phone: string
    date: string
    time: string
    saveBooking: string
    searchPlaceholder: string
    noResults: string
    empty: string
    errorDatePast: string
    errorEditDatePast: string
    errorSave: string
    registered: string
    confirmDeletePrefix: string
    confirmDeleteSuffix: string
    confirmDeleteShort: string
    colName: string
    colPhone: string
    colDate: string
    colTime: string
    colRegistered: string
    ariaEdit: string
  }
  slots: {
    title: string
    subtitle: string
    dayPrefix: string
    dayNames: string[]
    hoursSuffix: string
    closed: string
    savedOk: string
  }
  messenger: {
    title: string
    subtitle: string
    copy: string
    copied: string
  }
  notifications: {
    title: string
    active: string
    sendMode: string
    scheduled: string
    instant: string
    timeLabel: string
    saved: string
    error: string
  }
  content: {
    title: string
    subtitle: string
    intro: string
    ruColumn: string
    heColumn: string
    saved: string
    error: string
    resetSection: string
  }
  blog: {
    listTitle: string
    countSuffix: string
    newPost: string
    empty: string
    colTitle: string
    colSlug: string
    colCreated: string
    newTitle: string
    editTitle: string
    fieldTitle: string
    fieldSlug: string
    fieldSlugHint: string
    fieldSlugPlaceholder: string
    fieldExcerpt: string
    fieldImage: string
    fieldImagePlaceholder: string
    fieldContent: string
    create: string
    notFound: string
    loadError: string
    networkError: string
  }
  portfolio: {
    title: string
    countSuffix: string
    upload: string
    uploading: string
    hint: string
    empty: string
    deleteConfirm: string
    photo: string
    video: string
    uploadError: string
  }
  help: {
    title: string
    subtitle: string
    onThisPage: string
    sections: { id: string; title: string; body: string[] }[]
  }
}

export const ADMIN_STRINGS_RU: AdminStrings = {
  brand: 'Админ-панель',
  common: {
    loading: 'Загрузка...',
    save: 'Сохранить',
    saving: 'Сохранение...',
    saved: 'Сохранено',
    saveChanges: 'Сохранить изменения',
    refresh: 'Обновить',
    cancel: 'Отмена',
    edit: 'Изменить',
    delete: 'Удалить',
    logout: 'Выйти',
    backToList: '← Назад к списку',
  },
  nav: {
    bookings: 'Записи',
    slots: 'Доступность',
    messenger: 'Рассылка',
    telegram: 'Telegram',
    content: 'Тексты сайта',
    help: 'Помощь',
    posts: 'Блог',
    portfolio: 'Портфолио',
  },
  login: {
    subtitle: 'Вход в панель управления',
    passwordLabel: 'Пароль',
    passwordPlaceholder: 'Введите пароль',
    submit: 'Войти',
    submitting: 'Вход...',
    wrongPassword: 'Неверный пароль',
    errorGeneric: 'Ошибка',
    errorNetwork: 'Ошибка сети. Попробуйте снова.',
  },
  bookings: {
    title: 'Управление записями',
    countSuffix: 'записей',
    newTitle: 'Новая запись',
    name: 'Имя',
    phone: 'Телефон',
    date: 'Дата',
    time: 'Время',
    saveBooking: 'Сохранить запись',
    searchPlaceholder: 'Поиск по имени, телефону или дате...',
    noResults: 'Ничего не найдено',
    empty: 'Записей пока нет',
    errorDatePast: 'Выберите сегодняшнюю или будущую дату',
    errorEditDatePast: 'Дата должна быть сегодня или в будущем (или оставьте текущую)',
    errorSave: 'Ошибка сохранения',
    registered: 'Создано:',
    confirmDeletePrefix: 'Удалить запись?\n\n',
    confirmDeleteSuffix: '\n\nЭто действие нельзя отменить.',
    confirmDeleteShort: 'Удалить запись? Это действие нельзя отменить.',
    colName: 'Имя клиента',
    colPhone: 'Телефон',
    colDate: 'Дата записи',
    colTime: 'Время',
    colRegistered: 'Создано',
    ariaEdit: 'Изменить',
  },
  slots: {
    title: 'Управление доступностью',
    subtitle: 'Настройте дни и часы, доступные для записи',
    dayPrefix: '',
    dayNames: [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
    ],
    hoursSuffix: 'ч.',
    closed: 'Закрыто',
    savedOk: '✓ Сохранено',
  },
  messenger: {
    title: 'Рассылка',
    subtitle: 'Код подписки на рассылку',
    copy: 'копировать',
    copied: 'скопировано',
  },
  notifications: {
    title: 'Telegram',
    active: 'Включено',
    sendMode: 'Режим отправки',
    scheduled: 'Раз в день в заданное время',
    instant: 'Сразу после каждой новой записи',
    timeLabel: 'Время',
    saved: 'Сохранено',
    error: 'Ошибка',
  },
  content: {
    title: 'Тексты сайта',
    subtitle: 'Редактирование всех текстов сайта на русском и иврите',
    intro:
      'Измените тексты для каждого языка и сохраните. Изменения сразу появятся на сайте. Поля можно оставлять пустыми, чтобы скрыть текст.',
    ruColumn: 'Русский',
    heColumn: 'Иврит',
    saved: 'Сохранено',
    error: 'Ошибка сохранения',
    resetSection: 'Сбросить раздел',
  },
  blog: {
    listTitle: 'Посты',
    countSuffix: 'постов',
    newPost: 'Новый пост',
    empty: 'Постов пока нет. Нажмите «Новый пост».',
    colTitle: 'Заголовок',
    colSlug: 'slug',
    colCreated: 'Создано',
    newTitle: 'Новый пост',
    editTitle: 'Редактирование поста',
    fieldTitle: 'Заголовок *',
    fieldSlug: 'slug (необязательно)',
    fieldSlugHint: 'slug (необязательно)',
    fieldSlugPlaceholder: 'будет создан автоматически из заголовка',
    fieldExcerpt: 'Краткое описание *',
    fieldImage: 'Путь к изображению * (например /images/...)',
    fieldImagePlaceholder: '/images/example.png',
    fieldContent: 'Полный текст',
    create: 'Создать пост',
    notFound: 'Пост не найден',
    loadError: 'Ошибка загрузки',
    networkError: 'Ошибка сети',
  },
  portfolio: {
    title: 'Портфолио',
    countSuffix: 'файлов',
    upload: 'Загрузить фото / видео',
    uploading: 'Загрузка...',
    hint: 'Можно выбрать несколько файлов. Поддерживаются изображения и видео.',
    empty: 'Пока нет ни одного файла. Нажмите «Загрузить фото / видео».',
    deleteConfirm: 'Удалить этот файл? Это действие нельзя отменить.',
    photo: 'Фото',
    video: 'Видео',
    uploadError: 'Не удалось загрузить файл',
  },
  help: {
    title: 'Помощь — как пользоваться',
    subtitle: 'Как пользоваться админ-панелью',
    onThisPage: 'На этой странице',
    sections: [
      {
        id: 'login',
        title: 'Вход',
        body: [
          'Откройте страницу входа в админку.',
          'Введите выданный вам пароль.',
          'Нажмите «Войти».',
        ],
      },
      {
        id: 'bookings',
        title: 'Записи',
        body: [
          'Просмотр всех назначенных записей.',
          'Добавление новой записи — заполните имя, телефон, дату и время и сохраните.',
          'Редактирование — обновите данные и сохраните.',
          'Удаление — когда нужно отменить запись.',
        ],
      },
      {
        id: 'slots',
        title: 'Доступность',
        body: [
          'Для каждого дня недели выберите, открыт ли он и какие часы предлагать клиентам на сайте.',
          'Сохраните — публичная форма покажет те же часы.',
        ],
      },
      {
        id: 'messenger',
        title: 'Рассылка',
        body: [
          'Скопируйте код подписки (кнопка «копировать»).',
          'Отправьте код клиенту — он вставляет его в чат вашего Telegram-бота.',
          'После отправки кода клиент присоединяется к списку рассылки салона.',
        ],
      },
      {
        id: 'telegram',
        title: 'Telegram',
        body: [
          '«Включено» — отметьте, если хотите, чтобы система отправляла сообщения в Telegram подписчикам.',
          '«Раз в день в заданное время» — выберите время; подписчики получат ежедневное напоминание о записях на завтра.',
          '«Сразу после каждой новой записи» — каждая новая запись с сайта или из админки сразу отправит уведомление.',
          'Нажмите «Сохранить» после изменений.',
        ],
      },
      {
        id: 'content',
        title: 'Тексты сайта',
        body: [
          'Откройте «Тексты сайта», чтобы изменить любые тексты сайта.',
          'Заполните поля для русского и иврита и сохраните.',
          'Изменения сразу отображаются на сайте.',
        ],
      },
    ],
  },
}

export const ADMIN_STRINGS_HE: AdminStrings = {
  brand: 'ממשק ניהול',
  common: {
    loading: 'טוען...',
    save: 'שמור',
    saving: 'שומר...',
    saved: 'נשמר',
    saveChanges: 'שמור שינויים',
    refresh: 'רענן',
    cancel: 'ביטול',
    edit: 'עריכה',
    delete: 'מחק',
    logout: 'יציאה',
    backToList: '← חזרה לרשימה',
  },
  nav: {
    bookings: 'תורים',
    slots: 'זמינות',
    messenger: 'תפוצה',
    telegram: 'טלגרם',
    content: 'תוכן האתר',
    help: 'עזרה',
    posts: 'פוסטים',
    portfolio: 'תיק עבודות',
  },
  login: {
    subtitle: 'כניסה לממשק ניהול',
    passwordLabel: 'סיסמה',
    passwordPlaceholder: 'הכנס סיסמה',
    submit: 'כניסה',
    submitting: 'כניסה...',
    wrongPassword: 'סיסמה שגויה',
    errorGeneric: 'שגיאה',
    errorNetwork: 'שגיאת רשת. נסו שוב.',
  },
  bookings: {
    title: 'ניהול תורים',
    countSuffix: 'הזמנות',
    newTitle: 'תור חדש',
    name: 'שם',
    phone: 'טלפון',
    date: 'תאריך',
    time: 'שעה',
    saveBooking: 'שמור תור',
    searchPlaceholder: 'חיפוש לפי שם, טלפון או תאריך...',
    noResults: 'לא נמצאו תוצאות',
    empty: 'אין הזמנות עדיין',
    errorDatePast: 'נא לבחור תאריך היום או בעתיד',
    errorEditDatePast: 'תאריך חייב להיות היום או בעתיד (או להשאיר את התאריך הקיים)',
    errorSave: 'שגיאה בשמירה',
    registered: 'נרשם:',
    confirmDeletePrefix: 'למחוק את ההזמנה?\n\n',
    confirmDeleteSuffix: '\n\nפעולה זו לא ניתנת לביטול.',
    confirmDeleteShort: 'למחוק את ההזמנה? פעולה זו לא ניתנת לביטול.',
    colName: 'שם לקוח',
    colPhone: 'טלפון',
    colDate: 'תאריך תור',
    colTime: 'שעה',
    colRegistered: 'נרשם',
    ariaEdit: 'עריכה',
  },
  slots: {
    title: 'ניהול זמינות',
    subtitle: 'הגדר ימים ושעות פנויות לתורים',
    dayPrefix: 'יום',
    dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
    hoursSuffix: 'שעות',
    closed: 'סגור',
    savedOk: '✓ נשמר בהצלחה',
  },
  messenger: {
    title: 'תפוצה',
    subtitle: 'קוד הרשמה לרשימת התפוצה',
    copy: 'copy',
    copied: 'copied',
  },
  notifications: {
    title: 'טלגרם',
    active: 'פעיל',
    sendMode: 'אופן שליחה',
    scheduled: 'פעם ביום בשעה קבועה',
    instant: 'מיד אחרי כל הזמנה חדשה',
    timeLabel: 'שעה',
    saved: 'נשמר',
    error: 'שגיאה',
  },
  content: {
    title: 'תוכן האתר',
    subtitle: 'עריכת כל טקסטי האתר ברוסית ובעברית',
    intro:
      'ערכו את הטקסטים לכל שפה ושמרו. השינויים יופיעו מיד באתר. אפשר להשאיר שדות ריקים כדי להסתיר טקסט.',
    ruColumn: 'רוסית',
    heColumn: 'עברית',
    saved: 'נשמר',
    error: 'שגיאה בשמירה',
    resetSection: 'איפוס מקטע',
  },
  blog: {
    listTitle: 'פוסטים',
    countSuffix: 'פוסטים',
    newPost: 'פוסט חדש',
    empty: 'אין פוסטים עדיין. לחצו על «פוסט חדש».',
    colTitle: 'כותרת',
    colSlug: 'slug',
    colCreated: 'נוצר',
    newTitle: 'פוסט חדש',
    editTitle: 'עריכת פוסט',
    fieldTitle: 'כותרת *',
    fieldSlug: 'slug (אופציונלי)',
    fieldSlugHint: 'slug (אופציונלי)',
    fieldSlugPlaceholder: 'ייווצר אוטומטית מהכותרת',
    fieldExcerpt: 'תקציר *',
    fieldImage: 'נתיב תמונה * (למשל /images/...)',
    fieldImagePlaceholder: '/images/example.png',
    fieldContent: 'תוכן מלא',
    create: 'צור פוסט',
    notFound: 'הפוסט לא נמצא',
    loadError: 'שגיאה בטעינה',
    networkError: 'שגיאת רשת',
  },
  portfolio: {
    title: 'תיק עבודות',
    countSuffix: 'קבצים',
    upload: 'העלאת תמונה / וידאו',
    uploading: 'מעלה...',
    hint: 'אפשר לבחור כמה קבצים. נתמכות תמונות וסרטוני וידאו.',
    empty: 'אין עדיין קבצים. לחצו על «העלאת תמונה / וידאו».',
    deleteConfirm: 'למחוק את הקובץ? פעולה זו לא ניתנת לביטול.',
    photo: 'תמונה',
    video: 'וידאו',
    uploadError: 'העלאת הקובץ נכשלה',
  },
  help: {
    title: 'עזרה — איך משתמשים',
    subtitle: 'איך משתמשים בממשק הניהול',
    onThisPage: 'בעמוד זה',
    sections: [
      {
        id: 'login',
        title: 'כניסה',
        body: ['פתחו את דף הכניסה של האדמין.', 'הזינו את הסיסמה שקיבלתם.', 'לחצו «כניסה».'],
      },
      {
        id: 'bookings',
        title: 'תורים',
        body: [
          'צפייה בכל התורים שנקבעו.',
          'הוספת תור חדש — מלאו שם, טלפון, תאריך ושעה ושמרו.',
          'עריכה — עדכנו פרטים ושמרו.',
          'מחיקה — כשצריך לבטל תור.',
        ],
      },
      {
        id: 'slots',
        title: 'זמינות',
        body: [
          'בחרו לכל יום בשבוע אם הוא פתוח ואילו שעות מוצעות ללקוחות באתר.',
          'שמרו — הטופס הציבורי יציג את אותן שעות.',
        ],
      },
      {
        id: 'messenger',
        title: 'תפוצה',
        body: [
          'העתיקו את קוד ההרשמה (כפתור copy).',
          'שלחו את הקוד ללקוח — הוא מדביק אותו בצ׳אט של בוט הטלגרם שלכם.',
          'אחרי שהלקוח שלח את הקוד, הוא מצטרף לרשימת העדכונים של הסלון.',
        ],
      },
      {
        id: 'telegram',
        title: 'טלגרם',
        body: [
          '«פעיל» — סמנו אם רוצים שהמערכת תשלח הודעות טלגרם למנויים.',
          '«פעם ביום בשעה קבועה» — בחרו שעה; המנויים יקבלו תזכורת יומית על התורים למחר.',
          '«מיד אחרי כל הזמנה חדשה» — כל תור חדש מהאתר או מהאדמין ישלח עדכון מיידי.',
          'לחצו «שמור» אחרי שינוי.',
        ],
      },
      {
        id: 'content',
        title: 'תוכן האתר',
        body: [
          'פתחו «תוכן האתר» כדי לערוך כל טקסט באתר.',
          'מלאו את השדות ברוסית ובעברית ושמרו.',
          'השינויים מופיעים מיד באתר.',
        ],
      },
    ],
  },
}

export const ADMIN_STRINGS: Record<Locale, AdminStrings> = {
  ru: ADMIN_STRINGS_RU,
  he: ADMIN_STRINGS_HE,
}
