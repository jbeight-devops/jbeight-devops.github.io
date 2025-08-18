(function() {
  const STORAGE_KEY = 'theme-preference';
  const THEME_ATTR = 'data-theme';
  const LIGHT_THEME = 'light';
  const DARK_THEME = 'dark';

  // Prevent FOUC by applying theme immediately
  function applyThemeImmediate() {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? DARK_THEME 
      : LIGHT_THEME;
    const theme = storedTheme || systemTheme;
    document.documentElement.setAttribute(THEME_ATTR, theme);
  }

  // Apply theme immediately before DOM is ready
  applyThemeImmediate();

  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = themeToggle?.querySelector('.sun-icon');
  const moonIcon = themeToggle?.querySelector('.moon-icon');
  const srText = themeToggle?.querySelector('.theme-toggle-sr');

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Unable to save theme preference:', e);
    }
  }

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? DARK_THEME
      : LIGHT_THEME;
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute(THEME_ATTR) || getSystemTheme();
  }

  function updateThemeIcons(theme) {
    if (!sunIcon || !moonIcon) return;
    
    if (theme === DARK_THEME) {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
      themeToggle?.setAttribute('aria-pressed', 'true');
      if (srText) srText.textContent = 'Current theme: dark';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
      themeToggle?.setAttribute('aria-pressed', 'false');
      if (srText) srText.textContent = 'Current theme: light';
    }
  }

  function applyTheme(theme, withAnimation = true) {
    if (withAnimation && themeToggle) {
      themeToggle.classList.add('loading');
      setTimeout(() => themeToggle.classList.remove('loading'), 400);
    }

    // Apply theme immediately for smoother transition
    document.documentElement.setAttribute(THEME_ATTR, theme);
    
    // Update icons with slight delay for natural feel
    setTimeout(() => {
      updateThemeIcons(theme);
    }, 50);
    
    setStoredTheme(theme);

    // Announce theme change to screen readers (delayed to avoid interruption)
    if (withAnimation) {
      setTimeout(() => {
        const announcement = `Theme switched to ${theme} mode`;
        announceToScreenReader(announcement);
      }, 300);
    }
  }

  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
  }

  // Initialize theme on page load
  function initializeTheme() {
    const theme = getCurrentTheme();
    applyTheme(theme, false); // No animation on initial load
  }

  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function(e) {
      // Only auto-switch if user hasn't set a preference
      if (!getStoredTheme()) {
        applyTheme(e.matches ? DARK_THEME : LIGHT_THEME, false);
      }
    });
  }

  // Enhanced event listeners
  if (themeToggle) {
    // Click handler
    themeToggle.addEventListener('click', toggleTheme);
    
    // Keyboard handler
    themeToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Add focus indicator for keyboard navigation
    themeToggle.addEventListener('focus', function() {
      this.setAttribute('data-focus', 'true');
    });
    
    themeToggle.addEventListener('blur', function() {
      this.removeAttribute('data-focus');
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
  } else {
    initializeTheme();
  }

  // Reduce motion for users who prefer it
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-duration', '0s');
  }
})();