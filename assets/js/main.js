document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Animation on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  });

  // Number Counter Animation
  const counters = document.querySelectorAll('.counter-num');
  
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseInt(target.getAttribute('data-target'));
        const duration = 2000;
        const step = targetValue / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < targetValue) {
            target.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            target.innerText = targetValue;
          }
        };

        updateCounter();
        observer.unobserve(target);
      }
    });
  });

  counters.forEach(counter => counterObserver.observe(counter));

  // Init auth UI check
  if(window.updateAuthUI) window.updateAuthUI();
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');
if(backToTopBtn) {
    window.addEventListener('scroll', () => {
        if(window.scrollY > 300) {
            backToTopBtn.style.setProperty('display', 'flex', 'important');
            setTimeout(() => { backToTopBtn.style.opacity = '1'; }, 10);
        } else {
            backToTopBtn.style.opacity = '0';
            setTimeout(() => { backToTopBtn.style.setProperty('display', 'none', 'important'); }, 300);
        }
    });
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// RTL Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const rtlToggle = document.getElementById('rtlToggle');
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const isRtl = html.getAttribute('dir') === 'rtl';
            
            if (isRtl) {
                html.setAttribute('dir', 'ltr');
                localStorage.setItem('rtlMode', 'disabled');
            } else {
                html.setAttribute('dir', 'rtl');
                localStorage.setItem('rtlMode', 'enabled');
            }
        });

        // Load RTL preference
        if (localStorage.getItem('rtlMode') === 'enabled') {
            document.documentElement.setAttribute('dir', 'rtl');
        }
    }
});

// ==================== AUTHENTICATION LOGIC ====================
document.addEventListener('DOMContentLoaded', () => {
    // 1. UPDATE NAVBAR BASED ON AUTH STATE
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    const registerLinks = document.querySelectorAll('a[href="register.html"]');

        if (currentUser) {
        loginLinks.forEach(link => {
            if (link.closest('.navbar-controls')) {
                link.classList.add('d-none'); // Hide the login text link completely
            }
        });
        
        registerLinks.forEach(link => {
            if (link.closest('.navbar-controls')) {
                // Replace the Sign Up button with a Bootstrap Dropdown!
                const dropdownHtml = `
                    <div class="dropdown">
                        <button class="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="white-space: nowrap;">
                            <i class="bi bi-person-circle"></i> Hi, ${currentUser.name.split(' ')[0]}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 rounded-3" style="min-width: 150px;">
                            <li><a class="dropdown-item py-2" href="profile.html"><i class="bi bi-person me-2"></i> Profile</a></li>
                            <li><a class="dropdown-item py-2" href="dashboard.html"><i class="bi bi-grid me-2"></i> Dashboard</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item py-2 text-danger logout-action" href="#"><i class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
                        </ul>
                    </div>
                `;
                link.outerHTML = dropdownHtml;
            } else {
                link.textContent = 'Go to Dashboard';
                link.href = 'dashboard.html';
            }
        });

        // Attach event listeners to the newly created logout buttons
        document.querySelectorAll('.logout-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        });
    }

    // 2. REGISTRATION FORM LOGIC
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const pass = document.getElementById('regPassword').value;
            const confPass = document.getElementById('regConfirm').value;
            const alertBox = document.getElementById('regAlert');
            
            alertBox.classList.add('d-none');
            
            if (pass !== confPass) {
                alertBox.textContent = 'Passwords do not match!';
                alertBox.classList.remove('d-none');
                return;
            }
            
            let users = JSON.parse(localStorage.getItem('skyvision_users') || '[]');
            if (users.find(u => u.email === email)) {
                alertBox.textContent = 'Email already registered! Please login.';
                alertBox.classList.remove('d-none');
                return;
            }
            
            users.push({ name, email, password: pass });
            localStorage.setItem('skyvision_users', JSON.stringify(users));
            
            localStorage.setItem('currentUser', JSON.stringify({ name, email }));
            
            alertBox.classList.remove('alert-danger');
            alertBox.classList.add('alert-success');
            alertBox.textContent = 'Account created! Redirecting...';
            alertBox.classList.remove('d-none');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // 3. LOGIN FORM LOGIC
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const pass = document.getElementById('loginPassword').value;
            const alertBox = document.getElementById('loginAlert');
            
            alertBox.classList.add('d-none');
            
            let users = JSON.parse(localStorage.getItem('skyvision_users') || '[]');
            const user = users.find(u => u.email === email && u.password === pass);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
                
                alertBox.classList.remove('alert-danger');
                alertBox.classList.add('alert-success');
                alertBox.textContent = 'Login successful! Redirecting...';
                alertBox.classList.remove('d-none');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                alertBox.classList.remove('alert-success');
                alertBox.classList.add('alert-danger');
                alertBox.textContent = 'Invalid email or password.';
                alertBox.classList.remove('d-none');
            }
        });
    }
});


// Password Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (input && input.tagName === 'INPUT') {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            }
        });
    });
});
