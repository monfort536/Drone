// Mock Users DB (LocalStorage)
function initAdmin() {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const adminExists = users.find(u => u.email === 'admin@skyvision.com');
  
  if (!adminExists) {
    users.push({
      id: 1,
      name: 'System Admin',
      email: 'admin@skyvision.com',
      password: 'Admin@123',
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('users', JSON.stringify(users));
  }
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser')) || null;
}

function updateAuthUI() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('loginBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (profileDropdown) {
      profileDropdown.style.display = 'block';
      const userName = document.getElementById('navUserName');
      if (userName) userName.textContent = user.name;
      
      const adminLink = document.getElementById('adminDashLink');
      if (adminLink) {
        adminLink.style.display = user.role === 'admin' ? 'block' : 'none';
      }
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (profileDropdown) profileDropdown.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  initAdmin();
  updateAuthUI();
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});
