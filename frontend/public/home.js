// Sidebar menu animation
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
menuBtn.onclick = () => sidebar.style.left = '0';
closeSidebar.onclick = () => sidebar.style.left = '-270px';

// Modal utility
const modalBg = document.getElementById('modalBg');
const modalBox = document.getElementById('modalBox');
function showModal(content) {
  modalBox.innerHTML = content;
  modalBg.style.display = modalBox.style.display = 'block';
}
function hideModal() {
  modalBg.style.display = modalBox.style.display = 'none';
}
modalBg.onclick = hideModal;

// Add styles for search suggestions
const style = document.createElement('style');
style.textContent = `
  .suggestion {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }
  .suggestion:hover {
    background-color: #f5f5f5;
  }
  .suggestion-text {
    flex-grow: 1;
    padding: 5px 0;
  }
  .suggestion-book-btn {
    background-color: #2d89ef;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.2s;
  }
  .suggestion-book-btn:hover {
    background-color: #1a6fc9;
  }
  .search-suggestions {
    position: absolute;
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 4px 4px;
    z-index: 1000;
  }
`;
document.head.appendChild(style);

// Popup utility
function showPopup(msg) {
  const popup = document.getElementById('popup');
  popup.textContent = msg;
  popup.style.display = 'block';
  setTimeout(() => { popup.style.display = 'none'; }, 2000);
}

// Fetch & display popular destinations
async function loadDestinations() {
  const res = await fetch('/api/places/popular');
  const data = await res.json();
  const list = document.getElementById('destinationsList');
  list.innerHTML = data.map(place => `
    <div class="card">
      <img src="${place.image_url || 'https://source.unsplash.com/300x200/?travel,'+place.name}" alt="${place.name}">
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      <button onclick="bookPlace(${place.id})">Book Now</button>
    </div>
  `).join('');
}
// Fetch & display popular packages
async function loadPackages() {
  const res = await fetch('/api/packages/popular');
  const data = await res.json();
  const list = document.getElementById('packagesList');
  list.innerHTML = data.map(pkg => `
    <div class="card">
      <img src="${pkg.image_url || 'https://source.unsplash.com/300x200/?holiday,'+pkg.name}" alt="${pkg.name}">
      <h3>${pkg.name}</h3>
      <p>${pkg.description}</p>
      <p><b>Days:</b> ${pkg.days} <b>Cost:</b> ₹${pkg.cost}</p>
      <button onclick="bookPackage(${pkg.id})">Book Now</button>
    </div>
  `).join('');
}
window.onload = () => {
  loadDestinations();
  loadPackages();
};

// Booking flow
window.bookPlace = (id) => {
  showBookingModal({ place_id: id, package_id: null });
};
window.bookPackage = (id) => {
  showBookingModal({ place_id: null, package_id: id });
};

async function showBookingModal({ place_id, package_id }) {
  const today = new Date().toISOString().split('T')[0];
  
  // Step 1: Show initial booking form
  showModal(`
    <div class="booking-flow">
      <h2>Book Your Journey</h2>
      <div class="booking-steps">
        <div class="step active" id="step1">
          <span>1. Travel Details</span>
        </div>
        <div class="step" id="step2">
          <span>2. Select Seats</span>
        </div>
        <div class="step" id="step3">
          <span>3. Confirm</span>
        </div>
      </div>
      <form id='bookingForm'>
        <div class="step-content" id="step1-content">
          <div class="form-group">
            <label for="members">Number of Travelers</label>
            <input type='number' id='members' min='1' value='1' required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="startDate">Departure Date</label>
              <input type='date' id='startDate' min='${today}' required>
            </div>
            <div class="form-group">
              <label for="endDate">Return Date</label>
              <input type='date' id='endDate' min='${today}' required>
            </div>
          </div>
          <div class="form-actions">
            <button type='button' class="btn-secondary" onclick="hideModal()">Cancel</button>
            <button type='button' class="btn-primary" onclick="showSeatSelection()">Continue to Seat Selection</button>
          </div>
        </div>
        <div class="step-content hidden" id="step2-content">
          <div class="seat-selection-container">
            <div class="seat-map" id="seatMap">
              <div class="loading">Loading seat map...</div>
            </div>
            <div class="seat-legend">
              <div class="legend-item">
                <div class="seat-available"></div>
                <span>Available</span>
              </div>
              <div class="legend-item">
                <div class="seat-selected"></div>
                <span>Selected</span>
              </div>
              <div class="legend-item">
                <div class="seat-booked"></div>
                <span>Booked</span>
              </div>
              <div class="legend-item">
                <div class="seat-first"></div>
                <span>First Class</span>
              </div>
              <div class="legend-item">
                <div class="seat-business"></div>
                <span>Business</span>
              </div>
              <div class="legend-item">
                <div class="seat-economy"></div>
                <span>Economy</span>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type='button' class="btn-secondary" onclick="backToStep1()">Back</button>
            <button type='button' class="btn-primary" id="continueToConfirm" disabled onclick="showConfirmation()">Continue to Confirmation</button>
          </div>
        </div>
        <div class="step-content hidden" id="step3-content">
          <div class="booking-summary">
            <h3>Booking Summary</h3>
            <div class="summary-details" id="bookingSummary"></div>
            <div class="total-price">
              <strong>Total:</strong> <span id="totalPrice">$0.00</span>
            </div>
          </div>
          <div class="form-actions">
            <button type='button' class="btn-secondary" onclick="backToSeatSelection()">Back</button>
            <button type='submit' class="btn-primary">Confirm Booking</button>
          </div>
        </div>
      </form>
    </div>
    <style>
      .booking-flow { max-width: 800px; margin: 0 auto; }
      .booking-steps { 
        display: flex; 
        justify-content: space-between; 
        margin: 20px 0 30px; 
        position: relative;
      }
      .booking-steps:before {
        content: '';
        position: absolute;
        top: 15px;
        left: 0;
        right: 0;
        height: 2px;
        background: #e0e0e0;
        z-index: 1;
      }
      .step {
        position: relative;
        z-index: 2;
        background: #fff;
        padding: 0 10px;
        text-align: center;
        color: #999;
      }
      .step.active { color: #2d89ef; font-weight: bold; }
      .step:before {
        content: '';
        display: block;
        width: 30px;
        height: 30px;
        margin: 0 auto 5px;
        border-radius: 50%;
        background: #e0e0e0;
        line-height: 30px;
        text-align: center;
        color: #fff;
      }
      .step.active:before { background: #2d89ef; }
      .step-content { padding: 10px; }
      .hidden { display: none; }
      .form-group { margin-bottom: 15px; }
      .form-row { display: flex; gap: 15px; }
      .form-row .form-group { flex: 1; }
      label { display: block; margin-bottom: 5px; font-weight: bold; }
      input[type='number'],
      input[type='date'],
      select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
      }
      .btn-primary, .btn-secondary {
        padding: 8px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      }
      .btn-primary {
        background: #2d89ef;
        color: white;
      }
      .btn-secondary {
        background: #f0f0f0;
        color: #333;
      }
      .seat-selection-container {
        display: flex;
        gap: 20px;
      }
      .seat-map {
        flex: 3;
        min-height: 300px;
        border: 1px solid #ddd;
        padding: 20px;
        border-radius: 8px;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 10px;
      }
      .seat {
        width: 40px;
        height: 40px;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
      }
      .seat-available { background: #e0e0e0; }
      .seat-selected { background: #4CAF50; color: white; }
      .seat-booked { background: #f44336; color: white; cursor: not-allowed; }
      .seat-first { background: #9C27B0; color: white; }
      .seat-business { background: #2196F3; color: white; }
      .seat-economy { background: #e0e0e0; }
      .seat-legend {
        flex: 1;
        padding: 15px;
        background: #f9f9f9;
        border-radius: 8px;
      }
      .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .legend-item > div {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        border-radius: 3px;
      }
      .booking-summary {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
      }
      .summary-details > div {
        margin-bottom: 10px;
      }
      .total-price {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
        font-size: 1.2em;
        text-align: right;
      }
    </style>
  `);
  
  // Store the booking details
  window.currentBooking = {
    place_id,
    package_id,
    seat_id: null,
    seat_number: '',
    seat_price: 0,
    class_type: '',
    members: 1,
    start_date: '',
    end_date: ''
  };
}

async function showSeatSelection() {
  // Validate step 1
  const members = parseInt(document.getElementById('members').value);
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  
  if (!startDate || !endDate) {
    showPopup('Please select both departure and return dates');
    return;
  }
  
  // Update current booking
  window.currentBooking.members = members;
  window.currentBooking.start_date = startDate;
  window.currentBooking.end_date = endDate;
  
  // Show loading
  const seatMap = document.getElementById('seatMap');
  seatMap.innerHTML = '<div class="loading">Loading seat map...</div>';
  
  // Move to step 2
  document.getElementById('step1').classList.remove('active');
  document.getElementById('step2').classList.add('active');
  document.getElementById('step1-content').classList.add('hidden');
  document.getElementById('step2-content').classList.remove('hidden');
  
  try {
    // Fetch available seats
    const { place_id, package_id, start_date } = window.currentBooking;
    const response = await fetch(`/api/bookings/seats/available?${place_id ? `place_id=${place_id}` : `package_id=${package_id}`}&date=${start_date}`);
    const seats = await response.json();
    
    // Render seat map
    renderSeatMap(seats);
  } catch (error) {
    console.error('Error loading seats:', error);
    seatMap.innerHTML = '<div class="error">Failed to load seat map. Please try again.</div>';
  }
}

function renderSeatMap(seats) {
  const seatMap = document.getElementById('seatMap');
  seatMap.innerHTML = '';
  
  if (seats.length === 0) {
    seatMap.innerHTML = '<div class="no-seats">No seats available for the selected dates.</div>';
    return;
  }
  
  // Group seats by class
  const seatsByClass = seats.reduce((acc, seat) => {
    if (!acc[seat.class_type]) {
      acc[seat.class_type] = [];
    }
    acc[seat.class_type].push(seat);
    return acc;
  }, {});
  
  // Render seats by class
  for (const [classType, classSeats] of Object.entries(seatsByClass)) {
    // Add class header
    const classHeader = document.createElement('div');
    classHeader.className = 'seat-class-header';
    classHeader.textContent = `${classType.charAt(0).toUpperCase() + classType.slice(1)} Class - ₹${classSeats[0].price} per person`;
    classHeader.style.gridColumn = '1 / -1';
    classHeader.style.margin = '10px 0 5px';
    classHeader.style.fontWeight = 'bold';
    seatMap.appendChild(classHeader);
    
    // Add seats
    classSeats.forEach(seat => {
      const seatEl = document.createElement('div');
      seatEl.className = `seat ${seat.is_booked ? 'seat-booked' : 'seat-available'} seat-${seat.class_type}`;
      seatEl.textContent = seat.seat_number;
      seatEl.title = `${seat.class_type} class - ₹${seat.price}`;
      
      if (!seat.is_booked) {
        seatEl.onclick = () => selectSeat(seat);
      }
      
      seatMap.appendChild(seatEl);
    });
  }
}

function selectSeat(seat) {
  // Deselect previous selection
  const previouslySelected = document.querySelector('.seat-selected');
  if (previouslySelected) {
    previouslySelected.classList.remove('seat-selected');
    previouslySelected.classList.add('seat-available');
  }
  
  // Select new seat
  const seatEl = Array.from(document.querySelectorAll('.seat')).find(
    el => el.textContent === seat.seat_number
  );
  
  if (seatEl) {
    seatEl.classList.remove('seat-available');
    seatEl.classList.add('seat-selected');
    
    // Update current booking
    window.currentBooking.seat_id = seat.id;
    window.currentBooking.seat_number = seat.seat_number;
    window.currentBooking.seat_price = seat.price;
    window.currentBooking.class_type = seat.class_type;
    
    // Enable continue button
    document.getElementById('continueToConfirm').disabled = false;
  }
}

function showConfirmation() {
  if (!window.currentBooking.seat_id) {
    showPopup('Please select a seat');
    return;
  }
  
  // Update UI to step 3
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step3').classList.add('active');
  document.getElementById('step2-content').classList.add('hidden');
  document.getElementById('step3-content').classList.remove('hidden');
  
  // Update booking summary
  const { place_id, package_id, members, start_date, end_date, seat_number, class_type, seat_price } = window.currentBooking;
  const totalPrice = (seat_price * members).toFixed(2);
  
  let summary = `
    <div><strong>Type:</strong> ${place_id ? 'Place' : 'Package'} Booking</div>
    <div><strong>Travelers:</strong> ${members}</div>
    <div><strong>Dates:</strong> ${formatDate(start_date)} to ${formatDate(end_date)}</div>
    <div><strong>Seat:</strong> ${seat_number} (${class_type.charAt(0).toUpperCase() + class_type.slice(1)} Class)</div>
    <div><strong>Price per person:</strong> ₹${seat_price}</div>
  `;
  
  document.getElementById('bookingSummary').innerHTML = summary;
  document.getElementById('totalPrice').textContent = `₹${totalPrice}`;
  
  // Update form submit handler
  document.getElementById('bookingForm').onsubmit = handleBookingSubmit;
}

async function handleBookingSubmit(e) {
  e.preventDefault();
  
  const { place_id, package_id, members, start_date, end_date, seat_id } = window.currentBooking;
  const user_id = 1; // In a real app, get from session
  
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, place_id, package_id, members, start_date, end_date, seat_id })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      showPopup('Booking successful!');
      hideModal();
    } else {
      showPopup(data.message || 'Booking failed');
      // Go back to seat selection if the error is seat-related
      if (data.message && data.message.includes('seat')) {
        showSeatSelection();
      }
    }
  } catch (error) {
    console.error('Booking error:', error);
    showPopup('An error occurred. Please try again.');
  }
}

function backToStep1() {
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step1').classList.add('active');
  document.getElementById('step2-content').classList.add('hidden');
  document.getElementById('step1-content').classList.remove('hidden');
}

function backToSeatSelection() {
  document.getElementById('step3').classList.remove('active');
  document.getElementById('step2').classList.add('active');
  document.getElementById('step3-content').classList.add('hidden');
  document.getElementById('step2-content').classList.remove('hidden');
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Sidebar menu actions
const myAccountBtn = document.getElementById('myAccountBtn');
const myBookingsBtn = document.getElementById('myBookingsBtn');
const offersBtn = document.getElementById('offersBtn');
const logoutBtn = document.getElementById('logoutBtn');
myAccountBtn.onclick = async () => {
  // For demo, user_id is 1
  const res = await fetch('/api/user/1');
  const user = await res.json();
  showModal(`<h2>My Account</h2>
    <p><b>Name:</b> ${user.name}<br><b>Email:</b> ${user.email}<br><b>Joined:</b> ${user.created_at}</p>`);
};
myBookingsBtn.onclick = async () => {
  const res = await fetch('/api/bookings/user/1');
  const bookings = await res.json();
  showModal(`<h2>My Bookings</h2>
    <ul>${bookings.map(b => `<li>From: ${b.start_date} To: ${b.end_date} Members: ${b.members}</li>`).join('')}</ul>`);
};
offersBtn.onclick = async () => {
  const res = await fetch('/api/offers');
  const offers = await res.json();
  showModal(`<h2>Offers</h2>
    <ul>${offers.map(o => `<li>${o.name}: ${o.description}</li>`).join('')}</ul>`);
};
logoutBtn.onclick = async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  showPopup('Logged out!');
  setTimeout(() => { window.location.href = 'index.html'; }, 1000);
};

// Search bar with recommendations
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
searchInput.oninput = async () => {
  const q = searchInput.value;
  if (!q) { searchSuggestions.innerHTML = ''; return; }
  const res = await fetch(`/api/places/search?q=${encodeURIComponent(q)}`);
  const places = await res.json();
  searchSuggestions.innerHTML = places.map(p => `
    <div class='suggestion'>
      <span class='suggestion-text' onclick='showPlace(${p.id})'>${p.name}</span>
      <button class='suggestion-book-btn' onclick='event.stopPropagation(); bookPlace(${p.id})'>Book Now</button>
    </div>
  `).join('');
};
window.showPlace = async (id) => {
  const res = await fetch(`/api/places/${id}`);
  if (res.ok) {
    const place = await res.json();
    showModal(`<h2>${place.name}</h2><img src='${place.image_url || 'https://source.unsplash.com/300x200/?travel,'+place.name}' style='width:100%;border-radius:10px;'><p>${place.description}</p>`);
  } else {
    showPopup('Sorry, we have not included that place in our travels.');
  }
};

// Feedback form
const feedbackForm = document.getElementById('feedbackForm');
feedbackForm.onsubmit = async (e) => {
  e.preventDefault();
  // For demo, user_id is 1
  const user_id = 1;
  const message = document.getElementById('feedbackMsg').value;
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, message })
  });
  const data = await res.json();
  if (res.ok) {
    showPopup('Feedback submitted!');
    feedbackForm.reset();
  } else {
    showPopup(data.message || 'Feedback failed');
  }
};
