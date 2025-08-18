(function() {
  const STORAGE_KEY = 'theme-preference';
  const THEME_ATTR = 'data-theme';
  const LIGHT_THEME = 'light';
  const DARK_THEME = 'dark';

  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = themeToggle?.querySelector('.sun-icon');
  const moonIcon = themeToggle?.querySelector('.moon-icon');

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function setStoredTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? DARK_THEME
      : LIGHT_THEME;
  }

  function getCurrentTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  function updateThemeIcons(theme) {
    if (!sunIcon || !moonIcon) return;
    
    if (theme === DARK_THEME) {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTR, theme);
    updateThemeIcons(theme);
    setStoredTheme(theme);
  }

  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
  }

  // Initialize theme on page load
  function initializeTheme() {
    const theme = getCurrentTheme();
    applyTheme(theme);
  }

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
      }
    });
  }

  // Set up toggle button event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
  } else {
    initializeTheme();
  }
})();