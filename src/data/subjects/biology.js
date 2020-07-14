const biology = {
  name: 'Биология',
  children: [
    {
      name: 'Введение в биологию',
      children: [
        {
          name: 'Биология и её методы',
          relatedSubjects: ['physics'],
          children: [
            { name: 'Биология и её методы', value: 1 },
            { name: 'Экспериментальный метод', value: 1 },
          ],
        },
        {
          name: 'Клетка',
          children: [{ name: 'Клетка и её строение', value: 1 }],
        },
        {
          name: 'Многообразие живых организмов',
          children: [
            { name: 'Разнообразие растений', value: 1 },
            { name: 'Разнообразие животных', value: 1 },
          ],
        },
        {
          name: 'Среды обитания',
          relatedSubjects: ['geography'],
          children: [
            {
              name: 'Природа и человек, 2.0',
              value: 0,
              children: [{ name: '3.0', children: [{ name: '4.0', value: 1 }] }],
            },
            {
              name: 'Природа и человек, 2.0',
              value: 0,
              children: [{ name: '3.0', children: [{ name: '4.0', value: 1 }] }],
            },
          ],
        },
      ],
    },
    {
      name: 'Ботаника',
      // value: 200,
      children: [
        {
          name: 'Многообразие',
          children: [
            { name: 'Отделы растений', value: 1 },
            { name: 'Цветковые', value: 1 },
          ],
        },
        {
          name: 'Анатомия и физиология',
          children: [
            { name: 'Жизнедеятельность растений: минеральное питание и транспорт', value: 1 },
            { name: 'Строение растительного организма', value: 1 },
          ],
        },
      ],
    },
    {
      name: 'Микология',
      relatedSubjects: ['obj'],
    },
    {
      name: 'Зоология',
      children: [
        {
          name: 'Многообразие',
          relatedSubjects: ['obj'],
          children: [{ name: 'Царство животных' }, { name: 'Беспозвоночные' }, { name: 'Позвоночные' }],
        },
        {
          name: 'Анатомия и физиология',
          children: [{ name: 'Строение животного организма' }],
        },
      ],
    },
    {
      name: 'Анатомия и физиология человека',
      relatedSubjects: ['chemistry', 'physics', 'math', 'gym', 'obj'],
      children: [
        {
          name: 'Анатомия и физиология',
          children: [
            { name: 'Нейрогуморальная регуляция' },
            { name: 'Структура организма человека' },
            { name: 'Скелет человека' },
            { name: 'Мышечная система' },
            { name: 'Кровообращение. Гомеостаз' },
            { name: 'Дыхание' },
            { name: 'Иммунитет' },
            { name: 'Пищеварение в разных отделах' },
            { name: 'Пищевой рацион' },
          ],
        },
      ],
    },
    {
      name: 'Микробиология',
      children: [{ name: 'Вирусология' }, { name: 'Бактерии' }, { name: 'Простейшие' }],
    },
    {
      name: 'Общая биология',
      children: [
        { name: 'Методы биологии', relatedSubjects: ['technology'] },
        { name: 'Биохимия', relatedSubjects: ['chemistry.organic'] },
        { name: 'Цитология' },
        { name: 'Генетика', relatedSubjects: ['math'] },
        { name: 'Селекция' },
        { name: 'Эволюция', children: [{ name: 'Развитие животного мира' }] },
        { name: 'Экология', relatedSubjects: ['math'] },
        { name: 'Молекулярная биология', relatedSubjects: ['technology'] },
        { name: 'Биостатистика', relatedSubjects: ['math'] },
        { name: 'История биологии', relatedSubjects: ['history'] },
        { name: 'Учёные и их открытия' },
      ],
    },
  ],
};

export default biology;
