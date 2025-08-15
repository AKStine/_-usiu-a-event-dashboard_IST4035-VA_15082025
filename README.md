# USIU‑Africa — Event Booking Dashboard
A one‑page, responsive, accessible web application for discovering and registering for USIU‑A events. Built from scratch with **HTML**, **CSS**, and **JavaScript**, featuring **client‑side pagination**, **form validation**, **persistent slot counts** via `localStorage`, and brand‑accurate UI (USIU Blue #2B3990, USIU Yellow #CDCB05; Helvetica Neue fallbacks).

## ✨ Features
- **Events table (10+ events)** with **6 per page** pagination and keyboard support (← / →).
- **Register** from row or form; **slots decrement** and disable at **Fully Booked**.
- **Search** by name/venue.
- **Client‑side validation** (Name required; **Student ID = exactly 6 digits** e.g., `670797`; Event required).
- **Persistence**: events and bookings survive refresh via `localStorage`.
- **Admin**: “Reset Demo Data” clears storage and reseeds.
- **Accessibility**: semantic structure, labels, ARIA live regions, visible focus, skip link.
- **Branding**: USIU colors & type; header logo placeholder links to **https://www.usiu.ac.ke**.
- **Footer**: official contacts (phone/email) + socials (LinkedIn, Instagram, X).

## 📂 Project Structure
index.html # semantic structure (header, main, events table, form, footer)
styles.css # external styling: brand variables, responsive, zebra rows, focus states
script.js # external logic: data model, pagination, register, validation, persistence


## 🚀 Getting Started
1. **Clone / Download** this repo.
2. Open `index.html` in your browser. (No build steps required.)
3. Optional: use `Reset Demo Data` (top right) to restore original slots.

## 🌐 Deploy on GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Source: `main` branch, folder `/root` → **Save**.
4. Your site appears at: `https://<username>.github.io/<repo-name>/`

## 🧪 How to Demonstrate (for the PDF)
1. Screenshot the **header**, **events table** (Page 1 and Page 2), and **form**.
2. Click **Register** on a row with available slots → screenshot updated slots.
3. Submit the **form** (valid Name, 6‑digit Student ID, available Event) → screenshot confirmation.
4. Refresh the page → screenshot **persistence** (slots remain updated).
5. Use **Reset Demo Data** → screenshot reseeded state.

## 🧩 Implementation Notes
- **Student ID**: must match `/^\d{6}$/` (e.g., `670797`, `656790`, `653431`).
- **Accessibility**: `aria-live="polite"` for messages; sticky table header; tab‑friendly controls.
- **Performance**: no frameworks; deferred JS; lightweight CSS; minimal paint shifts.

## 📞 Contacts & Socials (Footer)
- **Phone**: +254 730 116 000
- **Email**: admit@usiu.ac.ke
- **LinkedIn**: United States International University – Africa
- **Instagram**: @usiuafrica
- **X (Twitter)**: @ExperienceUSIU

## ⚖️ License / Attribution
Built for academic demonstration purposes as part of **IST4035‑VA (Advanced Web Design & Applications)**. Event names/dates mirror public USIU‑A communications. No official endorsement implied.
