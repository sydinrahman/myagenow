# myagenow 🎂

**myagenow** is a fast, accurate, and privacy-first web application for calculating exact age and birthday metrics down to years, months, and days.

---

## ✨ Features

- **Exact Age Calculation:** Instantly calculates your age in years, months, and days based on the Gregorian calendar system.
- **Custom Target Date:** Calculate age at any past or future date, or default to today's date with a single tap ("Use Today").
- **Zodiac Sign & Astrological Symbol:** Dynamically calculates your astrological zodiac sign and symbol.
- **Milestone Tracker:** Track major age milestones (18th, 21st, 30th, 50th birthdays) with reached vs. upcoming status.
- **Detailed Lifetime Statistics:** View lifetime summary totals including total months, total weeks, total days, and approximate total hours lived.
- **Birthday Countdown:** Live countdown of days remaining until your next birthday, along with the day of the week for your birth date and next birthday.
- **Leap Year & Calendar Aware:** Handles leap years, differing month lengths, and February 29th birth dates seamlessly.
- **Copy & Share Results:** Easily copy calculation summaries to the clipboard or trigger native device share sheets.
- **Print / Save Card:** Built-in print stylesheet to print or save age result cards cleanly.
- **100% Client-Side & Private:** All calculations execute locally inside the user's browser. No birth dates or personal data are logged or sent to external servers.
- **Responsive & Accessible Design:** Built with modern, accessible HTML5, CSS variables, Plus Jakarta Sans typography, and fluid mobile navigation (`navigation.js`).

---

## 🛠️ Tech Stack

- **HTML5:** Semantic markup with ARIA accessibility attributes, structured data (JSON-LD WebApplication & FAQPage schema), and clean page layouts.
- **CSS3:** Custom styles utilizing CSS custom properties (variables), Flexbox & Grid layouts, card shadows, responsive media queries, and print stylesheets (`styles.css`).
- **JavaScript (ES6+):** Pure vanilla JavaScript without external dependencies or heavy frameworks (`script.js`, `navigation.js`).

---

## 📁 Project Structure

```text
.
├── index.html        # Main landing page & interactive age calculator interface
├── 404.html          # Custom 404 Not Found error page
├── contact.html      # Interactive contact form page with direct support details
├── privacy.html      # Comprehensive Privacy Policy detailing local browser processing
├── terms.html        # Terms of Service page covering service usage and disclaimers
├── script.js         # Core age calculation logic, zodiac calculation, milestones & form interactions
├── navigation.js     # Shared header navigation and mobile toggle logic
├── styles.css        # Global CSS styling, legal layouts, forms, and responsive design rules
├── favicon.svg       # SVG brand icon
└── og-image.svg      # Social media sharing preview card image
```

---

## 📄 Key Pages

- **Home (`index.html`):** The core interactive age calculator, feature highlights, trust badges, 3-step explanation, and FAQ accordion.
- **Privacy Policy (`privacy.html`):** Outlines zero data collection, 100% client-side calculation, cookie-free operations, analytics, and privacy commitments.
- **Terms of Service (`terms.html`):** Details terms of use, informational disclaimer, client-side execution, intellectual property, and limitations of liability.
- **Contact (`contact.html`):** Features a responsive inquiry form (Name, Email, Topic, Message) with instant client-side validation, alongside direct email support and operating hours.
- **404 Error Page (`404.html`):** A custom, styled error page guiding users back to the calculator.

---

## 🚀 Getting Started

Since **myagenow** is built with plain static web technologies, no build step or package installation is required.

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/myagenow.git
   cd myagenow
   ```

2. **Serve the files using any static local web server:**

   *Using Python 3:*
   ```bash
   python3 -m http.server 8000
   ```

   *Using Node.js (`npx http-server`):*
   ```bash
   npx http-server -p 8000
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8000` in your web browser.

---

## 🔒 Privacy

Your privacy is paramount. **myagenow** processes all input data directly within your web browser. No dates of birth or input parameters leave your device.

---

## 📄 License

This project is open-source. Feel free to inspect, adapt, or contribute!
