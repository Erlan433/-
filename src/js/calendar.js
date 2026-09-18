const calendarTitle = document.getElementById('calendarTitle');
const calendarGrid = document.getElementById('calendarGrid');
const previousMonthButton = document.getElementById('previousMonth');
const nextMonthButton = document.getElementById('nextMonth');
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  year: 'numeric',
});

// month использует стандарт JavaScript: январь — 0, декабрь — 11.
export function renderCalendar(year, month) {
  const selectedMonth = new Date(year, month, 1);
  const monthAndYear = monthFormatter.format(selectedMonth);
  calendarTitle.textContent = monthAndYear.charAt(0).toUpperCase() + monthAndYear.slice(1);

  const fragment = document.createDocumentFragment();

  weekDays.forEach((weekDay) => {
    const heading = document.createElement('div');
    heading.className = 'calendar-weekday';
    heading.setAttribute('role', 'columnheader');
    heading.textContent = weekDay;
    fragment.append(heading);
  });

  // getDay(): воскресенье — 0. Формула переводит отсчёт на понедельник — 0.
  const emptyCellsBeforeMonth = (selectedMonth.getDay() + 6) % 7;
  for (let index = 0; index < emptyCellsBeforeMonth; index += 1) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day calendar-day-empty';
    emptyCell.setAttribute('role', 'gridcell');
    emptyCell.setAttribute('aria-hidden', 'true');
    fragment.append(emptyCell);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    dayCell.setAttribute('role', 'gridcell');
    dayCell.textContent = day;
    fragment.append(dayCell);
  }

  calendarGrid.replaceChildren(fragment);
}

// Храним первый день показанного месяца, чтобы Date корректно менял год на его границах.
const currentDate = new Date();
let displayedMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

function changeMonth(offset) {
  displayedMonth = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth() + offset,
    1,
  );
  renderCalendar(displayedMonth.getFullYear(), displayedMonth.getMonth());
}

previousMonthButton.addEventListener('click', () => changeMonth(-1));
nextMonthButton.addEventListener('click', () => changeMonth(1));

// При запуске отображается календарная сетка текущего месяца.
renderCalendar(displayedMonth.getFullYear(), displayedMonth.getMonth());
