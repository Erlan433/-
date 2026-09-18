const themeInputs = document.querySelectorAll('input[name="theme"]');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

// При запуске отмечаем системную тему. Ручной выбор действует до перезагрузки.
function updateThemeSelection(theme) {
  themeInputs.forEach((input) => {
    input.checked = input.value === theme;
  });
}

updateThemeSelection(systemTheme.matches ? 'dark' : 'light');

themeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) document.documentElement.dataset.theme = input.value;
  });
});

// Пока пользователь не выбрал тему, синхронизируем переключатель с устройством.
systemTheme.addEventListener('change', (event) => {
  if (!document.documentElement.dataset.theme) {
    updateThemeSelection(event.matches ? 'dark' : 'light');
  }
});
