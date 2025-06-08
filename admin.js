// Tab switching
const usersTab = document.getElementById('usersTab');
const bookingsTab = document.getElementById('bookingsTab');
const usersSection = document.getElementById('usersSection');
const bookingsSection = document.getElementById('bookingsSection');
usersTab.onclick = () => {
  usersTab.classList.add('active');
  bookingsTab.classList.remove('active');
  usersSection.style.display = '';
  bookingsSection.style.display = 'none';
};
bookingsTab.onclick = () => {
  bookingsTab.classList.add('active');
  usersTab.classList.remove('active');
  bookingsSection.style.display = '';
  usersSection.style.display = 'none';
};

// Popup utility
function adminPopup(msg) {
  const popup = document.getElementById('adminPopup');
  popup.textContent = msg;
  popup.style.display = 'block';
  setTimeout(() => { popup.style.display = 'none'; }, 1800);
}

// Fetch and display users
async function loadUsers() {
  const res = await fetch('/api/admin/users');
  const users = await res.json();
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.created_at}</td>
      <td>${u.is_blocked ? 'Blocked' : 'Active'}</td>
      <td>
        <button onclick="blockUser(${u.id}, ${!u.is_blocked})">${u.is_blocked ? 'Unblock' : 'Block'}</button>
        <button onclick="deleteUser(${u.id})" style="background:#ff6a00;">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Fetch and display bookings
async function loadBookings() {
  const res = await fetch('/api/admin/bookings');
  const bookings = await res.json();
  const tbody = document.querySelector('#bookingsTable tbody');
  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.user_id}</td>
      <td>${b.place_id || '-'}</td>
      <td>${b.package_id || '-'}</td>
      <td>${b.members}</td>
      <td>${b.start_date}</td>
      <td>${b.end_date}</td>
      <td><button onclick="deleteBooking(${b.id})" style="background:#ff6a00;">Delete</button></td>
    </tr>
  `).join('');
}

// Admin actions
window.deleteUser = async (id) => {
  if (!confirm('Delete this user?')) return;
  const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
  if (res.ok) {
    adminPopup('User deleted');
    loadUsers();
  }
};
window.blockUser = async (id, block) => {
  const res = await fetch(`/api/admin/users/${id}/block`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ block })
  });
  if (res.ok) {
    adminPopup(block ? 'User blocked' : 'User unblocked');
    loadUsers();
  }
};
window.deleteBooking = async (id) => {
  if (!confirm('Delete this booking?')) return;
  const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
  if (res.ok) {
    adminPopup('Booking deleted');
    loadBookings();
  }
};

// Admin logout
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
adminLogoutBtn.onclick = async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = 'index.html';
};

window.onload = () => {
  loadUsers();
  loadBookings();
};
