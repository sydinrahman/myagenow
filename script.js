document.addEventListener('DOMContentLoaded', function () {
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
  const resBornDay = document.getElementById('res-born-day');
  const resBornFull = document.getElementById('res-born-full');
  const resNextBday = document.getElementById('res-next-bday');
  const resNextDayname = document.getElementById('res-next-dayname');
  const resCountdownDays = document.getElementById('res-countdown-days');
  const resTotalMonths = document.getElementById('res-total-months');
  const resTotalWeeks = document.getElementById('res-total-weeks');
  const resTotalDays = document.getElementById('res-total-days');
  const resTotalHours = document.getElementById('res-total-hours');
  const resultsSection = document.getElementById('age-results');
  const menuButton = document.getElementById('menu-button');
  const siteNav = document.getElementById('site-nav');

  function parseDateInput(value) {
    if (!value || typeof value !== 'string') return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    const isoMatch = trimmed.match(/^\d{4}-\d{2}-\d{2}$/);
    if (isoMatch) {
      const [year, month, day] = trimmed.split('-').map(Number);
      const parsed = new Date(year, month - 1, day);
      if (!Number.isNaN(parsed.getTime())) return parsed;
      return null;
    }

    return null;
  }

  function formatDateForInput(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  function toDateInputValue(date) {
    return formatDateForInput(new Date(date));
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

  function calculateAge(birthDate, targetDate) {
    const birth = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      const priorMonth = new Date(target.getFullYear(), target.getMonth() - 1, 1);
      const priorMonthDays = getDaysInMonth(priorMonth.getFullYear(), priorMonth.getMonth());
      days += priorMonthDays;
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    if (birth > target) {
      throw new Error('Birth date cannot be after the calculation date.');
    }

    const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const approxHours = totalDays * 24;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const bornDay = dayNames[birth.getDay()];
    const bornText = `${monthNames[birth.getMonth()]} ${birth.getDate()}, ${birth.getFullYear()}`;

    let birthdayYear = target.getFullYear();
    let birthdayMonth = birth.getMonth();
    let birthdayDay = clampBirthdayDay(birthdayYear, birthdayMonth, birth.getDate());

    let nextBirthday = new Date(birthdayYear, birthdayMonth, birthdayDay);
    if (nextBirthday < target) {
      birthdayYear += 1;
      birthdayDay = clampBirthdayDay(birthdayYear, birthdayMonth, birth.getDate());
      nextBirthday = new Date(birthdayYear, birthdayMonth, birthdayDay);
    }

    const remainingDays = Math.round((nextBirthday - target) / (1000 * 60 * 60 * 24));
    const nextBirthdayText = `${monthNames[nextBirthday.getMonth()]} ${nextBirthday.getDate()}, ${nextBirthday.getFullYear()}`;
    const nextBirthdayDay = dayNames[nextBirthday.getDay()];

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
      if (resBornDay) resBornDay.textContent = result.bornDay;
      if (resBornFull) resBornFull.textContent = result.bornText;
      if (resNextBday) resNextBday.textContent = result.nextBirthdayText;
      if (resNextDayname) resNextDayname.textContent = result.nextBirthdayDay;
      if (resCountdownDays) resCountdownDays.textContent = result.remainingDays === 0 ? 'Today!' : result.remainingDays.toLocaleString();
      if (resTotalMonths) resTotalMonths.textContent = result.totalMonths.toLocaleString();
      if (resTotalWeeks) resTotalWeeks.textContent = result.totalWeeks.toLocaleString();
      if (resTotalDays) resTotalDays.textContent = result.totalDays.toLocaleString();
      if (resTotalHours) resTotalHours.textContent = result.approxHours.toLocaleString();

      if (resultsSection) {
        resultsSection.hidden = false;
        resultsSection.classList.remove('is-visible');
        window.requestAnimationFrame(function () {
          resultsSection.classList.add('is-visible');
        });
      }

      if (shouldScrollToResults && resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      showError(error.message || 'Please choose a valid birth date in the past.');
    }
  }

  const today = new Date();
  if (targetDateInput) targetDateInput.value = toDateInputValue(today);
  if (dobInput) dobInput.value = '2002-01-15';

  const ageForm = document.getElementById('age-form');
  if (ageForm) {
    ageForm.addEventListener('submit', function (event) {
      event.preventDefault();
      performCalculation(true);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (dobInput) dobInput.value = '2002-01-15';
      if (targetDateInput) targetDateInput.value = toDateInputValue(new Date());
      hideError();
      performCalculation(false);
    });
  }

  if (todayQuickBtn) {
    todayQuickBtn.addEventListener('click', function () {
      if (targetDateInput) targetDateInput.value = toDateInputValue(new Date());
      performCalculation(false);
    });
  }

  [dobInput, targetDateInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener('click', function () {
      if (typeof input.showPicker === 'function') {
        try {
          input.showPicker();
        } catch (error) {
          // Browsers that do not allow programmatic picker opening still use the native input control.
        }
      }
    });
    input.addEventListener('change', function () {
      performCalculation(false);
    });
  });

  if (menuButton && siteNav) {
    menuButton.addEventListener('click', function () {
      const isOpen = siteNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
  }
});
