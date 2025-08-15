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





# USIU-A Event Booking Dashboard

A fully responsive, interactive, and persistent one-page web application for **United States International University – Africa (USIU-A)** event bookings.

Built from scratch using **HTML5**, **CSS3**, and **Vanilla JavaScript** as part of the IST4035-VA (Advanced Web Design & Applications) practical exam.

---

## 🎯 Features

- **Live Event List**: Displays 10 real USIU-A events with scroll/pagination (6 per page).
- **Instant Booking**: Register with one click — slots decrement in real time.
- **Booking Form**: Validates Name, Student ID (`######` format), and Event selection.
- **Persistent Data**: All slot counts and bookings are saved in `localStorage` between sessions.
- **Fully Booked State**: Disables registration button and shows clear “Fully Booked” notice.
- **Responsive UI**: Works seamlessly on mobile, tablet, and desktop.
- **Admin Reset**: “Reset Demo Data” control clears storage for evaluation.
- **USIU-A Branding**: Official colors, fonts, and event data for authenticity.

---

## 📂 Project Structure

```plaintext
index.html       → Semantic HTML structure
styles.css       → External responsive styling
script.js        → JavaScript interactivity and persistence
README.md        → This file
CHANGELOG.md     → Version history
docs/            → Screenshots, Evaluator’s Guide, exam submission materials
🚀 Getting Started
1. Clone the Repository
bash
Copy
git clone https://github.com/AKStine/usiu-a-event-dashboard_IST4035-VA_15082025.git
2. Open Locally
Simply open index.html in your browser.

🖼 Branding
Primary Blue: rgb(43,57,144)

Accent Yellow: rgb(205,203,5)

Font: Helvetica Neue (fallback: Arial, sans-serif)

Logo Placeholder: Linked to official USIU-A site


📜 License
All code authored by Dustine Kibagendi – Consultant, The Lucrebag.
Do not reuse without explicit permission.

🔗 Links
Live Demo: View on GitHub Pages

Official USIU-A Website: https://www.usiu.ac.ke

yaml
Copy

---

## **CHANGELOG.md**  

```markdown
# Changelog

All notable changes to this project will be documented here.

## [1.0.0] – 2025-08-15
### Added
- Initial release for IST4035-VA exam.
- Semantic HTML structure with header, main, and footer.
- Responsive table layout for 10 real USIU-A events (6 per page with pagination).
- Booking form with validation for Name, Student ID, and Event selection.
- JavaScript interactivity for slot decrement and "Fully Booked" state.
- LocalStorage persistence for bookings and slot counts.
- Admin "Reset Demo Data" control for marking purposes.
- USIU-A branding with official colors, typography, and logo placeholder.
- Hover effects, focus styles, and mobile-friendly UI.

---

## [0.9.0] – 2025-08-14
### Added
- Core HTML markup and placeholder event list.
- Initial CSS structure with brand palette.
- Basic JavaScript event handlers for buttons.

---

## [0.8.0] – 2025-08-13
### Added
- Planning, PRD, and wireframes for dashboard layout.
- Research on USIU-A brand guidelines and event data sourcing.
Evaluator’s Guide (1 Page)
markdown
Copy
# USIU-A Event Booking Dashboard – Evaluator’s Guide

**Author:** Dustine Kibagendi – Consultant, The Lucrebag  
**Exam:** IST4035-VA – Advanced Web Design & Applications  
**Date:** 15 August 2025

---

## 🎯 Purpose
A single-page web application for USIU-Africa to showcase events and allow students to book online with real-time updates.

---

## 🔑 How to Evaluate

### 1. **Load the Application**
- Open `index.html` in any modern browser (Chrome/Firefox/Edge).
- Ensure JavaScript is enabled.

### 2. **Check HTML (20%)**
- Inspect `<header>`, `<main>`, `<footer>` for semantic correctness.
- Verify table with 10 events (6 visible per page, pagination enabled).
- Confirm event data matches official USIU-A events (2025).

### 3. **Check CSS (30%)**
- Test responsiveness by resizing browser window (mobile/tablet/desktop).
- Confirm brand colors (`rgb(43,57,144)` and `rgb(205,203,5)`).
- Verify hover effects on table rows and focus effects on form inputs.

### 4. **Check JavaScript (50%)**
- Click “Register” on any event:
  - Slots decrement by 1.
  - Confirmation message appears without page reload.
- Continue until slots = 0 → Button changes to “Fully Booked” and is disabled.
- Submit form with valid data:
  - Must validate Name, Student ID (`######`), and Event selection.
  - Shows booking confirmation below form.
- Refresh page:
  - Slot counts and bookings persist (localStorage).
- Click “Reset Demo Data”:
  - All data resets to original state.

### 5. **Cross-Device Check**
- Test on mobile view (simulate in DevTools) for layout integrity.

---

## 📌 Notes for Evaluator
- The project is **100% hand-coded** with no external template usage.
- Adheres to **HTML5/CSS3/JavaScript** best practices.
- Designed for **clarity, brand alignment, and user-friendly booking flow**.

---
