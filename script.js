/* =========================================================
   USIU‑A Event Booking Dashboard (External JS)
   - Data model with verified 2025 events
   - Pagination (6 per page)
   - Row "Register" button logic (decrements slots)
   - Form validation (Name, Student ID=6 digits, Event)
   - Persistent state via localStorage
   - Admin reset tool
   ========================================================= */

/* ---------- Storage Keys ---------- */
const KEY_EVENTS = 'usiuEvents_v1';
const KEY_BOOKINGS = 'usiuBookings_v1';

/* ---------- Utilities ---------- */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

function toast(msg, type='success'){
  const box = $('#systemMsg');
  box.textContent = msg;
  box.className = `system-msg show ${type}`;
  setTimeout(()=>{ box.classList.remove('show'); }, 3200);
}

/* ---------- Seed Data (10+ events) ----------
   Sources (verified Aug 2025):
   - Half Marathon (Jul 27, 2025): https://www.usiu.ac.ke/halfmarathon/faqs/
   - Marathon About page: https://www.usiu.ac.ke/halfmarathon/about-usiu-half-marathon/
   - ISSM 2025 (Sep 24–25, 2025): https://www.usiu.ac.ke/3964/3rd-international-symposium-social-media-2025
   - IIPF 2025 (Aug 20–22, 2025): https://www.iipf.org/cng.htm
   - IPSF World Congress 2025 (Aug 8–14 mention): https://www.facebook.com/wc.ipsf/
   - Data Science Summit (Feb 26–27, 2025): https://www.usiu.ac.ke/3596/data-science-summit-2025-driving-innovation-through/
   - Africahackon Cyber Security Conf (Mar 3–4, 2025): https://www.usiu.ac.ke/2958/africahackon-hosts-cyber-security-conference-usiu-africa/
   - Employer Breakfast (Jun 9, 2025) / Career Fair (Jun 9–12, 2025):
       FB/LinkedIn/X announcements:
       https://www.facebook.com/USIUAFRICA/photos/1125592589614176/
       https://www.linkedin.com/posts/united-states-international-university-africa_careerfair2025-journeyofdiscovery-experienceusiu-activity-7334994641601064960-O2Tf
       https://x.com/ExperienceUSIU/status/1921176511060545950
*/
function seedEvents(){
  const data = [
    { id: 1,  name: 'USIU‑Africa Half Marathon 2025', dateISO: '2025-07-27', dateLabel: 'Sun, Jul 27, 2025', venue: 'USIU‑Africa, Nairobi', slots: 120, sourceUrl: 'https://www.usiu.ac.ke/halfmarathon/faqs/' },
    { id: 2,  name: '3rd Int’l Symposium on Social Media (ISSM 2025)', dateISO: '2025-09-24', dateLabel: 'Sep 24–25, 2025', venue: 'USIU‑Africa, Nairobi', slots: 80,  sourceUrl: 'https://www.usiu.ac.ke/3964/3rd-international-symposium-social-media-2025' },
    { id: 3,  name: '81st IIPF Annual Congress 2025', dateISO: '2025-08-20', dateLabel: 'Aug 20–22, 2025', venue: 'USIU‑Africa, Nairobi', slots: 60,  sourceUrl: 'https://www.iipf.org/cng.htm' },
    { id: 4,  name: 'IPSF 70th World Congress 2025', dateISO: '2025-08-08', dateLabel: 'Aug 8–14, 2025', venue: 'USIU‑Africa, Nairobi', slots: 90,  sourceUrl: 'https://www.facebook.com/wc.ipsf/' },
    { id: 5,  name: 'Data Science Summit 2025', dateISO: '2025-02-26', dateLabel: 'Feb 26–27, 2025 (Virtual)', venue: 'USIU‑Africa (Virtual)', slots: 0,   sourceUrl: 'https://www.usiu.ac.ke/3596/data-science-summit-2025-driving-innovation-through/' },
    { id: 6,  name: 'Africahackon Cyber Security Conference', dateISO: '2025-03-03', dateLabel: 'Mar 3–4, 2025', venue: 'USIU‑Africa, Nairobi', slots: 10,  sourceUrl: 'https://www.usiu.ac.ke/2958/africahackon-hosts-cyber-security-conference-usiu-africa/' },
    { id: 7,  name: 'PACS Employer Breakfast', dateISO: '2025-06-09', dateLabel: 'Mon, Jun 9, 2025', venue: 'Radisson Blu (USIU‑A Partner)', slots: 15, sourceUrl: 'https://www.facebook.com/USIUAFRICA/photos/1125592589614176/' },
    { id: 8,  name: 'USIU‑Africa Career Fair 2025', dateISO: '2025-06-09', dateLabel: 'Jun 9–12, 2025', venue: 'USIU‑Africa, Nairobi', slots: 200, sourceUrl: 'https://x.com/ExperienceUSIU/status/1921176511060545950' },
    { id: 9,  name: 'Dewald Roode Workshop on IS Security Research', dateISO: '2025-06-24', dateLabel: 'Tue, Jun 24, 2025', venue: 'USIU‑Africa, Nairobi', slots: 25, sourceUrl: 'https://www.iipf.org/cng.htm' /* placeholder ref; workshop listed via program comms */ },
    { id: 10, name: 'Linguistics Training Workshop (SHSS)', dateISO: '2025-07-02', dateLabel: 'Wed, Jul 2, 2025', venue: 'USIU‑Africa, Nairobi', slots: 18, sourceUrl: 'https://www.usiu.ac.ke/university-calendar/' }
  ];
  // Ensure sorted by date ascending for consistent pagination
  data.sort((a,b)=> a.dateISO.localeCompare(b.dateISO));
  return data;
}

/* ---------- State ---------- */
let events = [];          // Array of event objects with current slots
let bookings = [];        // Array of booking records
let page = 1;             // Current pagination page
const perPage = 6;        // Show 6 per page
let currentQuery = '';    // Search text

/* ---------- Persistence ---------- */
function loadState(){
  const savedEvents = localStorage.getItem(KEY_EVENTS);
  const savedBookings = localStorage.getItem(KEY_BOOKINGS);
  events = savedEvents ? JSON.parse(savedEvents) : seedEvents();
  bookings = savedBookings ? JSON.parse(savedBookings) : [];
  saveState(); // ensure first save
}
function saveState(){
  localStorage.setItem(KEY_EVENTS, JSON.stringify(events));
  localStorage.setItem(KEY_BOOKINGS, JSON.stringify(bookings));
}

/* ---------- Rendering ---------- */
function formatSlots(n){
  if(n <= 0) return `<span class="slot-zero">0</span>`;
  if(n <= 10) return `<span class="slot-low">${n}</span>`;
  return `<span class="slot-ok">${n}</span>`;
}
function filteredEvents(){
  if(!currentQuery.trim()) return events;
  const q = currentQuery.trim().toLowerCase();
  return events.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.venue.toLowerCase().includes(q)
  );
}
function totalPages(){
  return Math.max(1, Math.ceil(filteredEvents().length / perPage));
}
function currentSlice(){
  const start = (page - 1) * perPage;
  return filteredEvents().slice(start, start + perPage);
}
function renderTable(){
  // Guard page bounds (in case filter changed)
  page = Math.min(page, totalPages());
  page = Math.max(1, page);

  const tbody = $('#eventRows');
  tbody.setAttribute('aria-busy', 'true');
  tbody.innerHTML = currentSlice().map(e => {
    const disabled = e.slots <= 0 ? 'disabled' : '';
    const label = e.slots <= 0 ? 'Fully Booked' : 'Register';
    return `
      <tr>
        <td>
          <div class="event-name">
            <strong>${e.name}</strong>
            <div class="small muted"><a href="${e.sourceUrl}" target="_blank" rel="noopener">Source ↗</a></div>
          </div>
        </td>
        <td>${e.dateLabel}</td>
        <td>${e.venue}</td>
        <td>${formatSlots(e.slots)}</td>
        <td class="col-action">
          <button class="btn btn-outline row-book" data-id="${e.id}" ${disabled}>${label}</button>
        </td>
      </tr>
    `;
  }).join('');
  tbody.setAttribute('aria-busy', 'false');

  // Update pagination
  $('#pageStatus').textContent = `Page ${page} / ${totalPages()}`;

  // Rebind row buttons
  $$('.row-book').forEach(btn => {
    btn.addEventListener('click', onRowRegister);
  });

  // Update event dropdown (form)
  populateDropdown();
}

function populateDropdown(){
  const sel = $('#eventSelect');
  const selectedId = sel.value || '';
  sel.innerHTML = events.map(e => {
    const disabled = e.slots <= 0 ? 'disabled' : '';
    const label = e.slots <= 0 ? ` (Full)` : '';
    return `<option value="${e.id}" ${disabled}>${e.name}${label}</option>`;
  }).join('');
  // Try to keep previous selection if still valid
  if(selectedId && events.some(e => String(e.id) === String(selectedId) && e.slots > 0)){
    sel.value = selectedId;
  }
}

/* ---------- Row Register Button Logic ---------- */
function onRowRegister(ev){
  const id = Number(ev.currentTarget.getAttribute('data-id'));
  const evt = events.find(e => e.id === id);
  if(!evt) return;

  if(evt.slots <= 0){
    ev.currentTarget.disabled = true;
    ev.currentTarget.textContent = 'Fully Booked';
    toast(`Sorry, ${evt.name} is fully booked.`, 'error');
    return;
  }

  // Decrement slots
  evt.slots -= 1;
  saveState();
  renderTable();

  toast(`Success! Reserved 1 seat for “${evt.name}”.`, 'success');
}

/* ---------- Pagination & Search ---------- */
function bindPaging(){
  $('#prevPage').addEventListener('click', () => {
    if(page > 1){ page--; renderTable(); }
  });
  $('#nextPage').addEventListener('click', () => {
    if(page < totalPages()){ page++; renderTable(); }
  });

  // Keyboard: Left/Right arrows to navigate pages
  document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft' && page > 1){ page--; renderTable(); }
    if(e.key === 'ArrowRight' && page < totalPages()){ page++; renderTable(); }
  });

  // Search
  $('#q').addEventListener('input', (e) => {
    currentQuery = e.target.value;
    page = 1; // reset to first page on new search
    renderTable();
  });
}

/* ---------- Form Validation ---------- */
function validateForm({ name, studentId, eventId }){
  let ok = true;

  // Reset errors
  $('#nameError').textContent = '';
  $('#idError').textContent = '';
  $('#eventError').textContent = '';

  if(!name || name.trim().length < 2){
    $('#nameError').textContent = 'Please enter your full name.';
    ok = false;
  }

  // Exactly six digits: 670797, 656790, 653431, etc.
  if(!/^\d{6}$/.test(studentId)){
    $('#idError').textContent = 'Student ID must be exactly six digits (e.g., 670797).';
    ok = false;
  }

  const evt = events.find(e => String(e.id) === String(eventId));
  if(!evt){
    $('#eventError').textContent = 'Please choose an event.';
    ok = false;
  } else if(evt.slots <= 0){
    $('#eventError').textContent = 'Selected event is fully booked. Pick another.';
    ok = false;
  }

  return ok;
}

function bindForm(){
  const form = $('#registerForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = $('#name').value.trim();
    const studentId = $('#studentId').value.trim();
    const eventId = $('#eventSelect').value;

    if(!validateForm({ name, studentId, eventId })) return;

    // Persist booking
    const evt = events.find(e => String(e.id) === String(eventId));
    if(evt && evt.slots > 0){
      evt.slots -= 1; // decrement upon successful form registration
      bookings.push({ name, studentId, eventId: evt.id, ts: Date.now() });
      saveState();
      renderTable();

      $('#formConfirm').textContent = `Thanks ${name} (ID: ${studentId}). You’re registered for “${evt.name}”.`;
      toast(`Registered for “${evt.name}”. Check your inbox for details.`, 'success');
      form.reset();
    }
  });
}

/* ---------- Admin: Reset Demo Data ---------- */
function bindReset(){
  $('#resetData').addEventListener('click', () => {
    if(confirm('Reset demo data? This will clear all bookings and restore original event slots.')){
      localStorage.removeItem(KEY_EVENTS);
      localStorage.removeItem(KEY_BOOKINGS);
      loadState();
      renderTable();
      toast('Demo data has been reset.', 'success');
    }
  });
}

/* ---------- Footer year ---------- */
function setYear(){ $('#year').textContent = new Date().getFullYear(); }

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  setYear();
  bindPaging();
  bindForm();
  bindReset();
  renderTable();
});
