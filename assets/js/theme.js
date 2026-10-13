// Theme Toggle (Dark/Light)
function setTheme(theme) {
  const themeIcons = document.querySelectorAll('.theme-icon, #themeIcon');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcons.forEach(icon => {
      icon.classList.remove('bi-moon', 'bi-moon-stars');
      icon.classList.add('bi-sun');
    });
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    themeIcons.forEach(icon => {
      icon.classList.remove('bi-sun');
      icon.classList.add('bi-moon-stars');
    });
    localStorage.setItem('theme', 'light');
  }
}

// Check local storage on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark');
}

document.querySelectorAll('.theme-toggle-btn, #themeToggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isDark = document.body.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
  });
});


// RTL Toggle
function setRTL(isRtl) {
  const nextDirectionLabel = isRtl ? 'LTR' : 'RTL';
  const nextDirectionTitle = `Switch to ${nextDirectionLabel}`;

  if (isRtl) {
    document.body.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
    localStorage.setItem('rtl', 'true');
  } else {
    document.body.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
    localStorage.setItem('rtl', 'false');
  }

  document.querySelectorAll('.rtl-toggle-btn, #rtlToggle').forEach(toggle => {
    const label = toggle.querySelector('.rtl-label');
    if (label) label.textContent = nextDirectionLabel;
    toggle.title = nextDirectionTitle;
    toggle.setAttribute('aria-label', nextDirectionTitle);
  });
}

const savedRtl = localStorage.getItem('rtl');
setRTL(savedRtl === 'true');

document.querySelectorAll('.rtl-toggle-btn, #rtlToggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isRtl = document.body.getAttribute('dir') === 'rtl';
    setRTL(!isRtl);
  });
});

// Set Active Nav Link Automatically
document.addEventListener('DOMContentLoaded', () => {
  const pageName = pathname => pathname.replace(/\/+$/, '').split('/').pop().replace(/\.html$/i, '') || 'index';
  const currentPage = pageName(window.location.pathname);
  const detailSections = {
    'service-details': 'services',
    'portfolio-details': 'portfolio',
    'blog-details': 'blog'
  };
  const detailPrefix = Object.keys(detailSections).find(prefix =>
    currentPage === prefix || currentPage.startsWith(`${prefix}-`)
  );

  document.querySelectorAll('.navbar-custom .nav-link, .navbar-custom .dropdown-item').forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
  });

  document.querySelectorAll('.navbar-custom .nav-link, .navbar-custom .dropdown-item').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    const target = new URL(href, window.location.href);
    if (target.origin !== window.location.origin) return;
    const linkPage = pageName(target.pathname);
    const matchesSection = detailPrefix && linkPage.replace(/-2$/, '') === detailSections[detailPrefix];
    if (linkPage !== currentPage && !matchesSection) return;

    link.classList.add('active');
    link.setAttribute('aria-current', linkPage === currentPage ? 'page' : 'location');

    // Keep Home highlighted when either home page is selected in its dropdown.
    const parentDropdown = link.closest('.dropdown');
    const toggle = parentDropdown && parentDropdown.querySelector('.nav-link.dropdown-toggle');
    if (toggle) {
      toggle.classList.add('active');
      toggle.setAttribute('aria-current', 'location');
    }
  });
});

// ==========================================
// FORMSUBMIT AJAX INTEGRATION (SAME-PAGE SUBMISSION)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[action*="formsubmit.co"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent page redirect
            
            const btn = form.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerHTML;
            
            // Show loading state
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
            btn.disabled = true;

            // FormSubmit requires the /ajax/ endpoint for non-redirect submissions
            let actionUrl = form.action;
            if (!actionUrl.includes('/ajax/')) {
                actionUrl = actionUrl.replace('formsubmit.co/', 'formsubmit.co/ajax/');
            }

            const formData = new FormData(form);

            fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === "true" || data.success === true) {
                    form.reset();
                    // Success UI
                    btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Sent Successfully!';
                    btn.classList.add('bg-success', 'text-white', 'border-success');
                    
                    // Revert after 4 seconds
                    setTimeout(() => {
                        btn.innerHTML = originalBtnText;
                        btn.classList.remove('bg-success', 'text-white', 'border-success');
                        btn.disabled = false;
                    }, 4000);
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            })
            .catch(error => {
                console.error('FormSubmit Error:', error);
                // Error UI
                btn.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Error. Try Again.';
                btn.classList.add('bg-danger', 'text-white', 'border-danger');
                
                // Revert after 4 seconds
                setTimeout(() => {
                    btn.innerHTML = originalBtnText;
                    btn.classList.remove('bg-danger', 'text-white', 'border-danger');
                    btn.disabled = false;
                }, 4000);
            });
        });
    });
});

