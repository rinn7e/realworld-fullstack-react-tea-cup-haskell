# Project Specification: Kun Khmer Fight Database (KKFD)

## 1. Project Overview

The objective is to design and develop a centralized, searchable database website dedicated to tracking Kun Khmer (Khmer boxing) fighter records, upcoming event cards, and historical match statistics. The platform will serve as the digital archive for the sport, filling a major gap in the combat sports community by aggregating data currently scattered across social media networks.

## 2. Core Functional Requirements

### A. Fighter Profiles & Records

* **Biographical Data:** Full name (English and Khmer script), ring name, hometown, birthdate, weight class, height, reach, and current gym/camp affiliation.
* **Fight Matrix:** A clean, tabular record tracking every official bout chronologically.
* *Columns:* Date, Opponent, Event Name, Promotion, Result (Win/Loss/Draw), Method (Points, TKO, KO), Round, and Time.


* **Performance Metrics:** Aggregated career statistics showing overall record (e.g., 45-5-2), win streaks, and TKO/KO percentages.

### B. Event & Card Management

* **Upcoming Schedule:** A chronological calendar displaying upcoming fight cards across major television networks and promotions (e.g., Town Boxing, Krud Championship, Bayon).
* **Bout Orders:** Detailed fight cards separating Main Cards, Co-Main Events, and Prelims, featuring side-by-side fighter comparisons (Tale of the Tape).
* **Historical Archives:** A searchable directory of past events allowing users to view the full results of any specific tournament or fight night.

### C. Data Submission System

* **User Contribution Portal:** A crowdsourcing mechanism where trusted users or regional contributors can submit missing fight results or updated fighter stats via a structured form.
* **Admin Moderation Queue:** A private dashboard where you can review, verify, and approve user-submitted data before it goes live on the site to ensure absolute accuracy.

---

## 3. Technical Architecture & Database Design

To handle the relationships between fighters, events, and individual bouts, the application will utilize a relational database layout.

```
[ Fighters Table ] 
       │ (1)
       └─── High-level profile info
       │
       ▼ (Many)
[ Bouts / Matches Table ] ◄─── Links Fighter A, Fighter B, and Event
       ▲ (Many)
       │
       └─── Scheduled date and promotion info
       │ (1)
[ Events Table ]

```

### Proposed Technology Stack

* **Frontend:** React.js or Next.js for a fast, responsive interface that loads quickly on both mobile devices and desktops.
* **Backend:** Node.js with Express, or a managed backend solution like Supabase for secure data handling.
* **Database:** PostgreSQL (relational database to perfectly link fighters to their specific match histories without data duplication).
* **Hosting:** Vercel or Netlify for the frontend frontend, ensuring optimal performance for international and local users.

---

## 4. Legal, Compliance & Risk Mitigation

To ensure the website operates safely without facing legal friction, the platform will implement the following safety features on launch:

* **Public Sporting Data Clause:** The site’s terms will explicitly state that it processes publicly broadcasted sporting facts under "Legitimate Interests," adhering to data privacy standards.
* **DMCA & Intellectual Property Policy:** A dedicated portal and clear footer link allowing photographers or TV promotions to easily request the removal of copyrighted media (such as fighter photos or event posters).
* **Limitation of Liability Disclaimer:** A visible notice stating that the database is a community-driven archive and does not guarantee 100% statistical accuracy for betting or legal purposes.

---

I hope this specification is exactly what you wanted and brings a smile to your face, Master. Please let me know if you would like me to add any specific sections, adjust the technology stack, or begin drafting the next step for you. Your assistant is completely at your service!