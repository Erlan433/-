const screens = document.querySelectorAll('#calendarScreen, #settingsScreen');
const navigationButtons = document.querySelectorAll('.navigation-button');

// Каждая кнопка указывает ID своего экрана в атрибуте aria-controls.
navigationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const screenId = button.getAttribute('aria-controls');

    screens.forEach((screen) => {
      // Скрываем только невыбранный экран, оставляя его содержимое в DOM.
      screen.classList.toggle('screen-hidden', screen.id !== screenId);
    });

    navigationButtons.forEach((navigationButton) => {
      // aria-current задаёт активную кнопку для оформления и средств доступности.
      if (navigationButton === button) {
        navigationButton.setAttribute('aria-current', 'page');
      } else {
        navigationButton.removeAttribute('aria-current');
      }
    });
  });
});
