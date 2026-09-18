// Отдельный ключ хранит только участников, без темы и событий календаря.
const PERSONS_STORAGE_KEY = 'justiceCalendar.persons';

export function savePersons(persons) {
  try {
    localStorage.setItem(PERSONS_STORAGE_KEY, JSON.stringify(persons));
    return true;
  } catch (error) {
    // Запрет хранилища или нехватка места не должны останавливать интерфейс.
    console.warn('Не удалось сохранить участников.', error);
    return false;
  }
}

export function loadPersons() {
  try {
    const saved = localStorage.getItem(PERSONS_STORAGE_KEY);
    if (saved === null) return null;

    const persons = JSON.parse(saved);
    // Повреждённые данные не передаём в интерфейс: null включает стандартный набор.
    const valid = Array.isArray(persons)
      && persons.length > 0
      && persons.length <= 4
      && persons.every((person) => person !== null
        && typeof person === 'object'
        && Number.isInteger(person.id)
        && person.id > 0
        && typeof person.name === 'string'
        && person.name.trim() !== ''
        && typeof person.color === 'string'
        && /^#[0-9a-f]{6}$/i.test(person.color)
        && typeof person.active === 'boolean')
      && new Set(persons.map((person) => person.id)).size === persons.length;

    return valid ? persons : null;
  } catch (error) {
    console.warn('Не удалось загрузить участников.', error);
    return null;
  }
}
