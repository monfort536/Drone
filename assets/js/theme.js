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
  // Get the last segment of the path, removing any query strings or hashes
  let pathSegments = window.location.pathname.split('/').filter(s => s.length > 0);
  let currentPath = pathSegments.length > 0 ? pathSegments.pop() : '';
  currentPath = currentPath.split('?')[0].split('#')[0];
  const navLinks = document.querySelectorAll('.navbar-custom .nav-link, .navbar-custom .dropdown-item');
  
  navLinks.forEach(link => {
    let linkPath = link.getAttribute('href');
    if (!linkPath || linkPath === '#') return;
    
    // Clean up paths for comparison (handle .html extension stripping in some hosts)
    linkPath = linkPath.split('?')[0].split('#')[0];
    const cleanLinkPath = linkPath.replace('.html', '');
    const cleanCurrentPath = currentPath.replace('.html', '');
    
    // Check if the link matches the current path, OR if it's the root path matching index.html
    if (
      cleanLinkPath === cleanCurrentPath || 
      (currentPath === '' && cleanLinkPath === 'index')
    ) {
      link.classList.add('active');
      
      // If it's a dropdown item, also highlight the parent dropdown toggle
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector('.dropdown-toggle');
        if (toggle) toggle.classList.add('active');
      }
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

