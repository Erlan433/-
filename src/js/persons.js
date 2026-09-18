import { savePersons, loadPersons } from './storage.js';

// Начальные данные используются при отсутствии корректного сохранённого набора.
// Цвет хранится в HEX-формате, который принимает input type="color".
const defaultPersons = [
  { id: 1, name: 'Участник 1', color: '#ff0000', active: true },
  { id: 2, name: 'Участник 2', color: '#0000ff', active: true },
  { id: 3, name: 'Участник 3', color: '#008000', active: true },
  { id: 4, name: 'Участник 4', color: '#ffff00', active: true },
];

// Загружаем данные до создания списка, чтобы сразу показать сохранённые имена и цвета.
export const persons = loadPersons() ?? defaultPersons;

const participantsList = document.getElementById('participantsList');
const participantDialog = document.getElementById('participantDialog');
const nameInput = document.getElementById('participantName');
const colorInput = document.getElementById('participantColor');
// Ссылки на выбранного участника и его элементы списка для обновления без перерисовки.
let editingParticipant = null;

// Палитра фиксирована: редактирование участника не меняет стандартные цвета.
const presetColors = [
  { name: 'Красный', value: '#ff0000' },
  { name: 'Синий', value: '#613f0a' },
  { name: 'Зелёный', value: '#6efb6e' },
  { name: 'Жёлтый', value: '#f6f64d' },
];
const presetContainer = document.getElementById('presetColors');
const presetButtons = presetColors.map((preset) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'color-preset';
  button.style.setProperty('--swatch-color', preset.value);
  button.setAttribute('aria-label', preset.name);
  button.title = preset.name;
  button.addEventListener('click', () => applyColor(preset.value));
  presetContainer.append(button);
  return button;
});

// Согласуем поле своего цвета и отметку выбранного стандартного оттенка.
function updateColorSelection(value) {
  colorInput.value = value;
  presetButtons.forEach((button, index) => {
    button.setAttribute('aria-pressed', String(presetColors[index].value === value));
  });
}

// Оба способа выбора сразу обновляют объект участника и кружок в списке.
function applyColor(value) {
  if (!editingParticipant) return;
  editingParticipant.person.color = value;
  editingParticipant.color.style.backgroundColor = value;
  updateColorSelection(value);
  savePersons(persons);
}

// Непустое имя сразу переносится в массив и на экран; пробелы по краям удаляются.
// Пустой ввод не заменяет имя и блокирует отправку формы кнопкой «Готово».
nameInput.addEventListener('input', () => {
  const newName = nameInput.value.trim();
  nameInput.setCustomValidity(newName ? '' : 'Введите имя участника');
  if (!editingParticipant || !newName) return;

  editingParticipant.person.name = newName;
  editingParticipant.name.textContent = newName;
  editingParticipant.editButton.setAttribute('aria-label', `Изменить участника: ${newName}`);
  // Сохраняем только принятое непустое имя, не дожидаясь закрытия окна.
  savePersons(persons);
});

// Событие input обновляет цвет и кружок сразу во время выбора цвета.
colorInput.addEventListener('input', () => {
  applyColor(colorInput.value);
});

// Закрытие окна очищает выбор, но не отменяет уже применённые изменения.
participantDialog.addEventListener('close', () => {
  editingParticipant = null;
});

// При загрузке модуля создаём строки списка из массива — данные не дублируются в HTML.
persons.forEach((person) => {
  const item = document.createElement('li');
  item.className = 'participant';

  const color = document.createElement('span');
  color.className = 'participant-color';
  color.style.backgroundColor = person.color;
  color.setAttribute('aria-hidden', 'true');

  const name = document.createElement('span');
  name.className = 'participant-name';
  name.textContent = person.name;

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'participant-edit';
  editButton.textContent = 'Изменить';
  editButton.setAttribute('aria-label', `Изменить участника: ${person.name}`);
  editButton.addEventListener('click', () => {
    // Одно общее окно заполняется актуальными данными выбранного участника.
    editingParticipant = { person, name, color, editButton };
    nameInput.value = person.name;
    nameInput.setCustomValidity('');
    updateColorSelection(person.color);
    participantDialog.showModal();
  });

  item.append(color, name, editButton);
  participantsList.append(item);
});
