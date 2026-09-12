document.addEventListener('DOMContentLoaded', function () {

  // Cached DOM element references
  const dobInput = document.getElementById('dob-input');
  const targetDateInput = document.getElementById('target-date-input');
  const calculateBtn = document.getElementById('calculate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const todayQuickBtn = document.getElementById('today-quick-select');
  const errorBox = document.getElementById('error-box');
  const errorMessage = document.getElementById('error-message');

  const resYears = document.getElementById('res-years');
  const resMonths = document.getElementById('res-months');
  const resDays = document.getElementById('res-days');
  const resDaysHighlight = document.getElementById('res-days-highlight');
  const resNextCountdownHighlight = document.getElementById('res-next-countdown-highlight');
  const resBornDay = document.getElementById('res-born-day');
  const resBornFull = document.getElementById('res-born-full');
  const resNextBday = document.getElementById('res-next-bday');
  const resNextDayname = document.getElementById('res-next-dayname');
  const resZodiac = document.getElementById('res-zodiac');
  const resTotalMonths = document.getElementById('res-total-months');
  const resTotalWeeks = document.getElementById('res-total-weeks');
  const resTotalDays = document.getElementById('res-total-days');
  const resTotalHours = document.getElementById('res-total-hours');
  const resMilestonesGrid = document.getElementById('res-milestones-grid');
  const resultsSection = document.getElementById('age-results');

  const copyBtn = document.getElementById('copy-results-btn');
  const shareBtn = document.getElementById('share-results-btn');
  const printBtn = document.getElementById('print-results-btn');

  const menuButton = document.getElementById('menu-button');
  const siteNav = document.getElementById('site-nav');

  let currentResultSummary = '';

  // ⚡ Optimization: Pre-allocated lookup arrays & constants to prevent repeated array/object allocations
  const MS_PER_DAY = 86400000; // 1000 * 60 * 60 * 24
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const MILESTONE_AGES = [
    { age: 18, label: '18th Birthday (Adult Age)' },
    { age: 21, label: '21st Birthday (Legal Majority)' },
    { age: 30, label: '30th Birthday (3rd Decade)' },
    { age: 50, label: '50th Birthday (Golden Jubilee)' }
  ];

  // ⚡ Optimization: Fast string parsing for ISO YYYY-MM-DD to reduce RegEx overhead & string splits
  function parseDateInput(value) {
    if (!value || typeof value !== 'string') return null;

    const trimmed = value.trim();
    if (trimmed.length === 10 && trimmed[4] === '-' && trimmed[7] === '-') {
      const year = Number(trimmed.slice(0, 4));
      const month = Number(trimmed.slice(5, 7));
      const day = Number(trimmed.slice(8, 10));

      if (year >= 1 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const parsed = new Date(year, month - 1, day);
        if (!Number.isNaN(parsed.getTime())) return parsed;
      }
    }

    return null;
  }

  // ⚡ Optimization: Direct date component formatting to avoid redundant Date wrapping allocations
  function formatDateForInput(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  function toDateInputValue(date) {
    return formatDateForInput(date);
  }

  function showError(message) {
    if (!errorBox || !errorMessage) return;
    errorMessage.textContent = message;
    errorBox.classList.remove('hidden');
  }

  function hideError() {
    if (errorBox) errorBox.classList.add('hidden');
  }

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function getDaysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  function clampBirthdayDay(year, monthIndex, day) {
    if (monthIndex === 1 && day === 29 && !isLeapYear(year)) {
      return 28;
    }
    return day;
  }

  function getZodiacSign(month, day) {
    // month is 0-indexed (0 = Jan)
    const m = month + 1;
    if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return { name: 'Aquarius', symbol: '♒' };
    if ((m === 2 && day >= 19) || (m === 3 && day <= 20)) return { name: 'Pisces', symbol: '♓' };
    if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return { name: 'Aries', symbol: '♈' };
    if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return { name: 'Taurus', symbol: '♉' };
    if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return { name: 'Gemini', symbol: '♊' };
    if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return { name: 'Cancer', symbol: '♋' };
    if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return { name: 'Leo', symbol: '♌' };
    if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return { name: 'Virgo', symbol: '♍' };
    if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return { name: 'Libra', symbol: '♎' };
    if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return { name: 'Scorpio', symbol: '♏' };
    if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return { name: 'Sagittarius', symbol: '♐' };
    return { name: 'Capricorn', symbol: '♑' };
  }

  // ⚡ Optimization: Reuses static MILESTONE_AGES and MONTH_NAMES_SHORT arrays
  function calculateMilestones(birthDate, targetDate) {
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    return MILESTONE_AGES.map(item => {
      const targetYear = birthYear + item.age;
      const day = clampBirthdayDay(targetYear, birthMonth, birthDay);
      const milestoneDate = new Date(targetYear, birthMonth, day);
      const formattedDate = `${MONTH_NAMES_SHORT[milestoneDate.getMonth()]} ${milestoneDate.getDate()}, ${milestoneDate.getFullYear()}`;

      if (milestoneDate <= targetDate) {
        return {
          label: item.label,
          dateText: formattedDate,
          status: 'Reached ✓',
          reached: true
        };
      } else {
        const diffDays = Math.ceil((milestoneDate - targetDate) / MS_PER_DAY);
        const diffYears = (diffDays / 365.25).toFixed(1);
        return {
          label: item.label,
          dateText: formattedDate,
          status: `In ~${diffYears} yrs`,
          reached: false
        };
      }
    });
  }

  // ⚡ Optimization: Uses input Date objects directly without re-instantiating duplicate Date objects
  function calculateAge(birthDate, targetDate) {
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    let years = targetYear - birthYear;
    let months = targetMonth - birthMonth;
    let days = targetDay - birthDay;

    if (days < 0) {
      const priorMonthDays = getDaysInMonth(targetYear, targetMonth - 1);
      days += priorMonthDays;
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    if (birthDate > targetDate) {
      throw new Error('Birth date cannot be after the calculation date.');
    }

    const totalDays = Math.floor((targetDate - birthDate) / MS_PER_DAY);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const approxHours = totalDays * 24;

    const bornDay = DAY_NAMES[birthDate.getDay()];
    const bornText = `${MONTH_NAMES[birthMonth]} ${birthDay}, ${birthYear}`;

    let birthdayYear = targetYear;
    let birthdayMonth = birthMonth;
    let birthdayDay = clampBirthdayDay(birthdayYear, birthdayMonth, birthDay);

    let nextBirthday = new Date(birthdayYear, birthdayMonth, birthdayDay);
    if (nextBirthday < targetDate) {
      birthdayYear += 1;
      birthdayDay = clampBirthdayDay(birthdayYear, birthdayMonth, birthDay);
      nextBirthday = new Date(birthdayYear, birthdayMonth, birthdayDay);
    }

    const remainingDays = Math.round((nextBirthday - targetDate) / MS_PER_DAY);
    const nextBirthdayText = `${MONTH_NAMES[nextBirthday.getMonth()]} ${nextBirthday.getDate()}, ${nextBirthday.getFullYear()}`;
    const nextBirthdayDay = DAY_NAMES[nextBirthday.getDay()];

    const zodiac = getZodiacSign(birthMonth, birthDay);
    const milestones = calculateMilestones(birthDate, targetDate);

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      approxHours,
      bornDay,
      bornText,
      nextBirthdayText,
      nextBirthdayDay,
      remainingDays,
      zodiac,
      milestones
    };
  }

  function performCalculation(shouldScrollToResults) {
    hideError();

    if (!dobInput || !dobInput.value) {
      showError('Please enter your date of birth.');
      return;
    }

    const dobValue = dobInput.value;
    const targetValue = targetDateInput && targetDateInput.value ? targetDateInput.value : toDateInputValue(new Date());
    const dobDate = parseDateInput(dobValue);
    const targetDate = parseDateInput(targetValue);

    if (!dobDate || !targetDate) {
      showError('Please select valid dates.');
      return;
    }

    if (dobDate > targetDate) {
      showError('Birth date cannot be after the calculation date.');
      return;
    }

    try {
      const result = calculateAge(dobDate, targetDate);

      if (resYears) resYears.textContent = result.years.toLocaleString();
      if (resMonths) resMonths.textContent = result.months.toLocaleString();
      if (resDays) resDays.textContent = result.days.toLocaleString();
      if (resDaysHighlight) resDaysHighlight.textContent = `${result.totalDays.toLocaleString()} Days Lived`;
      if (resNextCountdownHighlight) {
        resNextCountdownHighlight.textContent = result.remainingDays === 0
          ? 'Next birthday is TODAY! 🎉'
          : `Next birthday in ${result.remainingDays.toLocaleString()} days`;
      }
      if (resBornDay) resBornDay.textContent = result.bornDay;
      if (resBornFull) resBornFull.textContent = result.bornText;
      if (resNextBday) resNextBday.textContent = result.nextBirthdayText;
      if (resNextDayname) resNextDayname.textContent = result.nextBirthdayDay;
      if (resZodiac) resZodiac.textContent = `${result.zodiac.name} ${result.zodiac.symbol}`;
      if (resTotalMonths) resTotalMonths.textContent = result.totalMonths.toLocaleString();
      if (resTotalWeeks) resTotalWeeks.textContent = result.totalWeeks.toLocaleString();
      if (resTotalDays) resTotalDays.textContent = result.totalDays.toLocaleString();
      if (resTotalHours) resTotalHours.textContent = result.approxHours.toLocaleString();

      if (resMilestonesGrid) {
        // Clear existing milestones safely without innerHTML
        resMilestonesGrid.textContent = '';
        // Security enhancement: Use document.createElement and textContent to prevent DOM-based XSS injection
        result.milestones.forEach(m => {
          const card = document.createElement('div');
          card.className = `milestone-card ${m.reached ? 'reached' : 'upcoming'}`;

          const label = document.createElement('span');
          label.className = 'milestone-label';
          label.textContent = m.label;

          const date = document.createElement('div');
          date.className = 'milestone-date';
          date.textContent = m.dateText;

          const status = document.createElement('div');
          status.className = 'milestone-status';
          status.textContent = m.status;

          card.appendChild(label);
          card.appendChild(date);
          card.appendChild(status);

          resMilestonesGrid.appendChild(card);
        });
      }

      currentResultSummary = `I am ${result.years} years, ${result.months} months, and ${result.days} days old (${result.totalDays.toLocaleString()} days lived!). Zodiac: ${result.zodiac.name} ${result.zodiac.symbol}. Calculated on myagenow.com`;

      if (resultsSection) {
        resultsSection.hidden = false;
        resultsSection.classList.remove('is-visible');
        window.requestAnimationFrame(function () {
          resultsSection.classList.add('is-visible');
        });
      }

      if (shouldScrollToResults && resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        resultsSection.focus();
      }
    } catch (error) {
      showError(error.message || 'Please choose a valid birth date in the past.');
    }
  }

  const today = new Date();
  const todayFormatted = toDateInputValue(today);

  if (targetDateInput) {
    targetDateInput.value = todayFormatted;
    targetDateInput.setAttribute('max', '2100-12-31');
    targetDateInput.setAttribute('min', '1900-01-01');
  }

  if (dobInput) {
    dobInput.value = '';
    dobInput.setAttribute('max', todayFormatted);
    dobInput.setAttribute('min', '1900-01-01');
  }

  const ageForm = document.getElementById('age-form');
  if (ageForm) {
    ageForm.addEventListener('submit', function (event) {
      event.preventDefault();
      performCalculation(true);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (dobInput) dobInput.value = '';
      if (targetDateInput) targetDateInput.value = toDateInputValue(new Date());
      hideError();
      if (resultsSection) {
        resultsSection.hidden = true;
        resultsSection.classList.remove('is-visible');
      }
    });
  }

  if (todayQuickBtn) {
    todayQuickBtn.addEventListener('click', function () {
      if (targetDateInput) targetDateInput.value = toDateInputValue(new Date());
      if (dobInput && dobInput.value) {
        performCalculation(false);
      }
    });
  }

  [dobInput, targetDateInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener('click', function () {
      if (typeof input.showPicker === 'function') {
        try {
          input.showPicker();
        } catch (error) {
          // Programmatic picker fallback
        }
      }
    });
    input.addEventListener('change', function () {
      if (dobInput && dobInput.value) {
        performCalculation(false);
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (!currentResultSummary) return;
      navigator.clipboard.writeText(currentResultSummary).then(function () {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `✓ Copied!`;
        setTimeout(function () {
          copyBtn.innerHTML = originalText;
        }, 2000);
      }).catch(function () {
        showError('Could not copy to clipboard.');
      });
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      if (!currentResultSummary) return;
      if (navigator.share) {
        navigator.share({
          title: 'My Age Calculation - myagenow',
          text: currentResultSummary,
          url: window.location.href
        }).catch(function () {});
      } else {
        if (copyBtn) copyBtn.click();
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

  if (menuButton && siteNav) {
    menuButton.addEventListener('click', function () {
      const isOpen = siteNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
  }
});
