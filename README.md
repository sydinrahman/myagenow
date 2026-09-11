# myagenow 🎂

**myagenow** is a fast, accurate, and privacy-first web application for calculating exact age and birthday metrics down to years, months, and days.

---

## ✨ Features

- **Exact Age Calculation:** Instantly calculates your age in years, months, and days based on the Gregorian calendar.
- **Custom Target Date:** Calculate age at any past or future date, or default to today's date.
- **Detailed Life Statistics:** View lifetime summary totals including total months, total weeks, total days, and approximate total hours.
- **Birthday Countdown:** Live countdown of days remaining until your next birthday, along with the day of the week for your birth date and next birthday.
- **Leap Year & Calendar Aware:** Handles leap years, differing month lengths, and February 29th birth dates seamlessly.
- **100% Client-Side & Private:** All calculations execute locally inside the user's browser. No birth dates or personal data are logged or sent to external servers.
- **Responsive & Accessible Design:** Built with clean, accessible HTML5, CSS variables, and fluid typography for seamless mobile and desktop experience.

---

## 🛠️ Tech Stack

- **HTML5:** Semantic markup with ARIA accessibility attributes.
- **CSS3:** Custom styles utilizing CSS custom properties (variables), modern layout techniques (Flexbox & Grid), animations, and responsive media queries (`styles.css`).
- **JavaScript (ES6+):** Pure vanilla JavaScript without external dependencies or heavy frameworks (`script.js`, `navigation.js`).

---

## 📁 Project Structure

```text
.
├── index.html        # Main landing page & age calculator interface
├── 404.html          # Custom 404 Not Found error page
├── contact.html      # Contact form and user inquiry page
├── privacy.html      # Privacy policy detailing local data processing
├── terms.html        # Terms of service page
├── script.js         # Core age calculation logic & form interactions
├── navigation.js     # Shared header navigation and mobile toggle logic
└── styles.css        # Global CSS styling and responsive layout rules
```

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
