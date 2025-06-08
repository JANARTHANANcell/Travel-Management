function showSignin() {
  document.getElementById('signinForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
}
function showSignup() {
  document.getElementById('signinForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
}

// Popup utility
function showPopup(msg) {
  const popup = document.getElementById('popup');
  popup.textContent = msg;
  popup.style.display = 'block';
  setTimeout(() => { popup.style.display = 'none'; }, 2000);
}

// Sign In
const signinForm = document.getElementById('signinForm');
signinForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    showPopup('You are successfully signed in!');
    setTimeout(() => { window.location.href = 'home.html'; }, 1200);
  } else {
    showPopup(data.message || 'Sign in failed');
  }
};

// Sign Up
const signupForm = document.getElementById('signupForm');
signupForm.onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (res.ok) {
    showPopup('You are successfully signed up!');
    setTimeout(() => { window.location.href = 'home.html'; }, 1200);
  } else {
    showPopup(data.message || 'Sign up failed');
  }
};

// Admin Modal
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const closeAdmin = document.getElementById('closeAdmin');
adminBtn.onclick = () => { adminModal.style.display = 'block'; };
closeAdmin.onclick = () => { adminModal.style.display = 'none'; };
window.onclick = (event) => { if (event.target === adminModal) adminModal.style.display = 'none'; };

// Admin Login
const adminLoginForm = document.getElementById('adminLoginForm');
adminLoginForm.onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;
  const res = await fetch('/api/auth/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    showPopup('Admin login successful!');
    setTimeout(() => { window.location.href = 'admin.html'; }, 1200);
  } else {
    showPopup(data.message || 'Admin login failed');
  }
};
