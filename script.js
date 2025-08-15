/* =========================================================
   USIU‑A Event Booking Dashboard (External JS)
   - Data model with verified 2025 events (+ images, categories)
   - Pagination (6 per page), search, category filters (multi-select)
   - Row "Register" button logic (decrements slots)
   - Form validation (Name, Student ID=6 digits, Event)
   - Persistent state via localStorage
   - Admin reset, CSV export, dark mode, keyboard shortcuts
   - Print: render all rows for PDF then restore
   ========================================================= */

/* ---------- Storage Keys ---------- */
const KEY_EVENTS = 'usiuEvents_v1';
const KEY_BOOKINGS = 'usiuBookings_v1';
const THEME_KEY = 'theme';

/* ---------- Utilities ---------- */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* Toaster notifications (top-right) */
function toast(msg, type='success'){
  const wrap = $('#toaster');
  if(!wrap) return; // fallback: do nothing
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(()=>{ el.remove(); }, 3500);
  // Inline fallback message for assistive tech
  const box = $('#systemMsg');
  if(box){
    box.textContent = msg;
    box.className = `system-msg show ${type}`;
    setTimeout(()=> box.classList.remove('show'), 3200);
  }
}

/* ---------- Theme toggle ---------- */
function applyTheme(mode){
  if(mode === 'dark'){
    document.documentElement.setAttribute('data-theme','dark');
    $('#themeToggle')?.setAttribute('aria-pressed','true');
    if($('#themeToggle')) $('#themeToggle').textContent = 'Light Mode';
  }else{
    document.documentElement.removeAttribute('data-theme');
    $('#themeToggle')?.setAttribute('aria-pressed','false');
    if($('#themeToggle')) $('#themeToggle').textContent = 'Dark Mode';
  }
  localStorage.setItem(THEME_KEY, mode);
}
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(saved);
  $('#themeToggle')?.addEventListener('click', () => {
    const current = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

/* ---------- Seed Data (10 events) ----------
   Each event has: id, name, dateISO, dateLabel, venue, slots, category, image, sourceUrl
   Images: royalty-free Pexels thumbnails
*/
function seedEvents(){
  const data = [
    {
      id: 1,  name: 'USIU‑Africa Half Marathon 2025',
      dateISO: '2025-07-27', dateLabel: 'Sun, Jul 27, 2025',
      venue: 'USIU‑Africa, Nairobi', slots: 120, category: 'sports',
      image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg',
      sourceUrl: 'https://www.usiu.ac.ke/halfmarathon/faqs/'
    },
    {
      id: 2,  name: '3rd Int’l Symposium on Social Media (ISSM 2025)',
      dateISO: '2025-09-24', dateLabel: 'Sep 24–25, 2025',
      venue: 'USIU‑Africa, Nairobi', slots: 80, category: 'symposium',
      image: 'https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg',
      sourceUrl: 'https://www.usiu.ac.ke/3964/3rd-international-symposium-social-media-2025'
    },
    {
      id: 3,  name: '81st IIPF Annual Congress 2025',
      dateISO: '2025-08-20', dateLabel: 'Aug 20–22, 2025',
      venue: 'USIU‑Africa, Nairobi', slots: 60, category: 'congress',
      image: 'https://images.pexels.com/photos/3184312/pexels-photo-3184312.jpeg',
      sourceUrl: 'https://www.iipf.org/cng.htm'
    },
    {
      id: 4,  name: 'IPSF 70th World Congress 2025',
      dateISO: '2025-08-08', dateLabel: 'Aug 8–14, 2025',
      venue: 'USIU‑Africa, Nairobi', slots: 90, category: 'conference',
      image: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg',
      sourceUrl: 'https://www.facebook.com/wc.ipsf/'
    },
    {
      id: 5,  name: 'Data Science Summit 2025',
      dateISO: '2025-02-26', dateLabel: 'Feb 26–27, 2025 (Virtual)',
      venue: 'USIU‑Africa (Virtual)', slots: 0, category: 'conference',
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      sourceUrl: 'https://www.usiu.ac.ke/3596/data-science-summit-2025-driving-innovation-through/'
    },
    {
      id: 6,  name: 'Africahackon Cyber Security Conference',
      dateISO: '2025-03-03', dateLabel: 'Mar 3–4, 2025',
      venue: 'USIU‑Africa, Nairobi', slots: 10, category: 'conference',
      image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg',
      sourceUrl: 'https://www.usiu.ac.ke/2958/africahackon-hosts-cyber-security-conference-usiu-africa/'
    },
    {
      id: 7,  name: 'PACS Employer Breakfast',
      dateISO: '2025-06-09', dateLabel: 'Mon, Jun 9, 2025',
      venue: 'Radisson Blu (USIU‑A Partner)', slots: 15, category: 'career',
      image: 'https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg',
      sourceUrl: 'https://www.facebook.com/USIUAFRICA/photos/1125592589614176/'
    },
    {
      id: 8,  name: 'USIU‑Africa Career Fair 2025',
      dateISO: '2025-06-09', dateLabel: 'Jun 9–12, 2025',
      venue: 'USIU‑Africa, Nairobi', slots: 200, category: 'career',
      image: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg',
      sourceUrl: 'https://x.com/ExperienceUSIU/status/1921176511060545950'
    },
    {
      id: 9,  name: 'Dewald Roode Workshop on IS Security Research',
      dateISO: '2025-06-24', dateLabel: 'Tue, Jun 24, 2025',
      venue: 'USIU‑Africa, Nairobi', slots: 25, category: 'workshop',
      image: 'https://images.pexels.com/photos/3182778/pexels-photo-3182778.jpeg',
      sourceUrl: 'https://www.usiu.ac.ke/university-calendar/'
    },
    {
      id: 10, name: 'Linguistics Training Workshop (SHSS)',
      dateISO: '2025-07-02', dateLabel: 'Wed, Jul 2, 2025',
      venue: 'USIU‑Africa, Nairobi', slots: 18, category: 'workshop',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg',
      sourceUrl: 'https://www.usiu.ac.ke/university-calendar/'
    }
  ];
  data.sort((a,b)=> a.dateISO.localeCompare(b.dateISO));
  return data;
}

/* ---------- State ---------- */
let events = [];          // mutable slots
let bookings = [];        // booking records
let page = 1;             // current page
const perPage = 6;        // show 6 per page
let currentQuery = '';    // search
let selectedCats = new Set(); // category filters

/* ---------- Persistence ---------- */
function loadState(){
  const savedEvents = localStorage.getItem(KEY_EVENTS);
  const savedBookings = localStorage.getItem(KEY_BOOKINGS);
  events = savedEvents ? JSON.parse(savedEvents) : seedEvents();
  bookings = savedBookings ? JSON.parse(savedBookings) : [];
  saveState(); // ensure keys exist
}
function saveState(){
  localStorage.setItem(KEY_EVENTS, JSON.stringify(events));
  localStorage.setItem(KEY_BOOKINGS, JSON.stringify(bookings));
}

/* ---------- Rendering ---------- */
function slotBadge(n){
  if(n <= 0) return `<span class="slot-zero">0</span>`;
  if(n <= 10) return `<span class="slot-low">${n}</span>`;
  return `<span class="slot-ok">${n}</span>`;
}

function matchesQuery(e){
  if(!currentQuery.trim()) return true;
  const q = currentQuery.trim().toLowerCase();
  return e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
}
function matchesCategory(e){
  if(selectedCats.size === 0) return true; // no filter = all
  return selectedCats.has(e.category);
}
function filteredEvents(){
  return events.filter(e => matchesQuery(e) && matchesCategory(e));
}
function totalPages(){
  return Math.max(1, Math.ceil(filteredEvents().length / perPage));
}
function sliceForPage(){
  const start = (page - 1) * perPage;
  return filteredEvents().slice(start, start + perPage);
}

function renderTable(){
  // Guard page bounds
  page = Math.min(page, totalPages());
  page = Math.max(1, page);

  const tbody = $('#eventRows');
  tbody.setAttribute('aria-busy', 'true');
  tbody.innerHTML = sliceForPage().map(e => {
    const disabled = e.slots <= 0 ? 'disabled' : '';
    const label = e.slots <= 0 ? 'Fully Booked' : 'Register';
    return `
      <tr>
        <td>
          <div class="event-meta">
            <img src="${e.image}" alt="" class="event-thumb" />
            <div class="event-name">
              <strong>${e.name}</strong>
              <div class="small muted">
                <em>${e.category}</em> • <a href="${e.sourceUrl}" target="_blank" rel="noopener">Source ↗</a>
              </div>
            </div>
          </div>
        </td>
        <td>${e.dateLabel}</td>
        <td>${e.venue}</td>
        <td>${slotBadge(e.slots)}</td>
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
  $$('.row-book').forEach(btn => btn.addEventListener('click', onRowRegister));

  // Update event dropdown (form)
  populateDropdown();
}

/* Keep event dropdown in sync */
function populateDropdown(){
  const sel = $('#eventSelect');
  const prev = sel.value || '';
  sel.innerHTML = events.map(e => {
    const disabled = e.slots <= 0 ? 'disabled' : '';
    const label = e.slots <= 0 ? ` (Full)` : '';
    return `<option value="${e.id}" ${disabled}>${e.name}${label}</option>`;
  }).join('');
  if(prev && events.some(e => String(e.id) === String(prev) && e.slots > 0)){
    sel.value = prev;
  }
}

/* ---------- Row Register Button ---------- */
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

  evt.slots -= 1;
  saveState();
  renderTable();
  toast(`Success! Reserved 1 seat for “${evt.name}”.`, 'success');
}

/* ---------- Pagination, Search, Category Filters ---------- */
function bindPaging(){
  $('#prevPage').addEventListener('click', () => { if(page > 1){ page--; renderTable(); } });
  $('#nextPage').addEventListener('click', () => { if(page < totalPages()){ page++; renderTable(); } });

  // Keyboard: Arrow Left/Right or n/p
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName || '').toLowerCase();
    if(tag === 'input' || tag === 'textarea' || e.metaKey || e.ctrlKey || e.altKey) return;

    if(e.key === '/'){ e.preventDefault(); $('#q')?.focus(); }
    if((e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') && page < totalPages()){ page++; renderTable(); }
    if((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') && page > 1){ page--; renderTable(); }
  });

  // Search
  $('#q').addEventListener('input', (e) => {
    currentQuery = e.target.value;
    page = 1; renderTable();
  });

  // Category chips
  function handleCatChange(){
    selectedCats.clear();
    $$('.cat-filters input[type="checkbox"]').forEach(c => { if(c.checked) selectedCats.add(c.value); });
    page = 1; renderTable();
  }
  $$('.cat-filters input[type="checkbox"]').forEach(c => c.addEventListener('change', handleCatChange));
  $('#clearCats').addEventListener('click', () => {
    $$('.cat-filters input[type="checkbox"]').forEach(c => c.checked = false);
    selectedCats.clear(); page = 1; renderTable();
  });
}

/* ---------- Form Validation ---------- */
function validateForm({ name, studentId, eventId }){
  let ok = true;

  $('#nameError').textContent = '';
  $('#idError').textContent = '';
  $('#eventError').textContent = '';

  if(!name || name.trim().length < 2){
    $('#nameError').textContent = 'Please enter your full name.'; ok = false;
  }
  if(!/^\d{6}$/.test(studentId)){
    $('#idError').textContent = 'Student ID must be exactly six digits (e.g., 670797).'; ok = false;
  }
  const evt = events.find(e => String(e.id) === String(eventId));
  if(!evt){ $('#eventError').textContent = 'Please choose an event.'; ok = false; }
  else if(evt.slots <= 0){ $('#eventError').textContent = 'Selected event is fully booked. Pick another.'; ok = false; }

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

    const evt = events.find(e => String(e.id) === String(eventId));
    if(evt && evt.slots > 0){
      evt.slots -= 1; // decrement upon successful form submit
      bookings.push({ name, studentId, eventId: evt.id, ts: Date.now() });
      saveState();
      renderTable();
      updateBookingCount();

      $('#formConfirm').textContent = `Thanks ${name} (ID: ${studentId}). You’re registered for “${evt.name}”.`;
      toast(`Registered for “${evt.name}”.`, 'success');
      form.reset();
    }
  });
}

/* ---------- Booking count ---------- */
function updateBookingCount(){
  $('#bookingCount').textContent = String(bookings.length);
}

/* ---------- CSV Export ---------- */
function exportCSV(){
  if(!bookings.length){ toast('No bookings to export yet.', 'error'); return; }
  const header = ['Name','Student ID','Event','Date','Venue','Timestamp'];
  const rows = bookings.map(b => {
    const evt = events.find(e => e.id === Number(b.eventId)) || {};
    const ts = new Date(b.ts).toISOString();
    return [b.name, b.studentId, evt.name || '', evt.dateLabel || '', evt.venue || '', ts];
  });
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v ?? '').replace(/"/g,'""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'usiu-bookings.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  toast('Exported bookings as CSV.', 'success');
}

/* ---------- Admin: Reset Demo Data ---------- */
function bindReset(){
  $('#resetData').addEventListener('click', () => {
    if(confirm('Reset demo data? This will clear all bookings and restore original event slots.')){
      localStorage.removeItem(KEY_EVENTS);
      localStorage.removeItem(KEY_BOOKINGS);
      loadState();
      renderTable();
      updateBookingCount();
      toast('Demo data has been reset.', 'success');
    }
  });
}

/* ---------- Print all rows, then restore ---------- */
let _prePrintPage = 1;
function beforePrint(){
  _prePrintPage = page;
  const full = filteredEvents();
  const tbody = $('#eventRows');
  tbody.setAttribute('aria-busy','true');
  tbody.innerHTML = full.map(e => {
    const disabled = e.slots <= 0 ? 'disabled' : '';
    const label = e.slots <= 0 ? 'Fully Booked' : 'Register';
    return `
      <tr>
        <td>
          <div class="event-meta">
            <img src="${e.image}" alt="" class="event-thumb" />
            <div class="event-name">
              <strong>${e.name}</strong>
              <div class="small muted">
                <em>${e.category}</em> • <a href="${e.sourceUrl}" target="_blank" rel="noopener">Source ↗</a>
              </div>
            </div>
          </div>
        </td>
        <td>${e.dateLabel}</td>
        <td>${e.venue}</td>
        <td>${slotBadge(e.slots)}</td>
        <td class="col-action">
          <button class="btn btn-outline row-book" data-id="${e.id}" ${disabled}>${label}</button>
        </td>
      </tr>
    `;
  }).join('');
  tbody.setAttribute('aria-busy','false');
}
function afterPrint(){ page = _prePrintPage; renderTable(); }
window.addEventListener('beforeprint', beforePrint);
window.addEventListener('afterprint', afterPrint);

/* ---------- Footer year ---------- */
function setYear(){ $('#year').textContent = new Date().getFullYear(); }

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  setYear();
  initTheme();
  bindPaging();
  bindForm();
  bindReset();
  renderTable();
  updateBookingCount();
  $('#exportCSV')?.addEventListener('click', exportCSV);
});
