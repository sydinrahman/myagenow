/**
 * Age on Any Date Calculator - Client-side Logic
 * MyAgeNow (https://myagenow.today/)
 */
document.addEventListener('DOMContentLoaded', function () {
  // DOM element references
  const ageForm = document.getElementById('age-on-date-form');
  const dobInput = document.getElementById('dob-input');
  const targetDateInput = document.getElementById('target-date-input');
  const calculateBtn = document.getElementById('calculate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const todayQuickBtn = document.getElementById('today-quick-select');
  const errorBox = document.getElementById('error-box');
  const errorMessage = document.getElementById('error-message');

  const resultsSection = document.getElementById('age-results');
  const tenseLead = document.getElementById('res-tense-lead');
  const resTargetDateFormatted = document.getElementById('res-target-date-formatted');
  const resYears = document.getElementById('res-years');
  const resMonths = document.getElementById('res-months');
  const resDays = document.getElementById('res-days');
  const resTotalDays = document.getElementById('res-total-days');
  const resWeekday = document.getElementById('res-weekday');
  const resWeekdayDesc = document.getElementById('res-weekday-desc');
  const resSummarySentence = document.getElementById('res-summary-sentence');

  const copyBtn = document.getElementById('copy-results-btn');
  const copyLiveStatus = document.getElementById('copy-live-status');
  const shareBtn = document.getElementById('share-results-btn');

  let currentResultSummary = '';

  // Performance Optimization: Pre-allocated NumberFormat & static constants
  const numberFormatter = new Intl.NumberFormat('en-US');
  function formatNumber(val) {
    return typeof val === 'number' ? numberFormatter.format(val) : val;
  }

  const MS_PER_DAY = 86400000;
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function getDaysInMonth(year, monthIndex) {
    let m = monthIndex % 12;
    if (m < 0) m += 12;
    if (m === 1) {
      const yearForFeb = year + Math.floor(monthIndex / 12);
      return isLeapYear(yearForFeb) ? 29 : 28;
    }
    return DAYS_IN_MONTH[m];
  }

  // Fast string parsing for ISO YYYY-MM-DD
  function parseDateInput(value) {
    if (!value || typeof value !== 'string') return null;
    if (value.length > 20) return null;

    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const year = Number(trimmed.slice(0, 4));
      const month = Number(trimmed.slice(5, 7));
      const day = Number(trimmed.slice(8, 10));

      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const parsed = new Date(year, month - 1, day);
        if (
          !Number.isNaN(parsed.getTime()) &&
          parsed.getFullYear() === year &&
          parsed.getMonth() === month - 1 &&
          parsed.getDate() === day
        ) {
          return parsed;
        }
      }
    }
    return null;
  }

  function formatDateForInput(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  function showError(message) {
    if (!errorBox || !errorMessage) return;
    errorMessage.textContent = message;
    errorBox.classList.remove('hidden');
    if (dobInput) {
      dobInput.setAttribute('aria-invalid', 'true');
      dobInput.setAttribute('aria-describedby', 'error-message');
      dobInput.focus();
    }
  }

  function hideError() {
    if (errorBox) errorBox.classList.add('hidden');
    if (dobInput) {
      dobInput.removeAttribute('aria-invalid');
      dobInput.removeAttribute('aria-describedby');
    }
  }

  /**
   * Calendar-accurate exact age calculation
   */
  function calculateAgeOnDate(birthDate, targetDate) {
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    const birthUtc = Date.UTC(birthYear, birthMonth, birthDay);
    const targetUtc = Date.UTC(targetYear, targetMonth, targetDay);

    if (birthUtc > targetUtc) {
      throw new Error('Date of birth cannot be after the selected calculation date.');
    }

    let years = targetYear - birthYear;
    let months = targetMonth - birthMonth;

    let effectiveBirthDay = birthDay;
    // Leap year Feb 29 birth handling when target is Feb 28 on a non-leap year
    if (birthMonth === 1 && birthDay === 29 && targetMonth === 1 && targetDay === 28 && !isLeapYear(targetYear)) {
      effectiveBirthDay = 28;
    }

    let days = targetDay - effectiveBirthDay;

    if (days < 0) {
      const priorMonthDays = getDaysInMonth(targetYear, targetMonth - 1);
      days += priorMonthDays;
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    const totalDays = Math.floor((targetUtc - birthUtc) / MS_PER_DAY);
    const targetWeekday = DAY_NAMES[targetDate.getDay()];
    const targetDateFormatted = `${MONTH_NAMES[targetMonth]} ${targetDay}, ${targetYear}`;

    // Compare targetDate with today's calendar date to determine tense
    const now = new Date();
    const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    let tense = 'present';
    if (targetUtc < todayUtc) {
      tense = 'past';
    } else if (targetUtc > todayUtc) {
      tense = 'future';
    }

    return {
      years,
      months,
      days,
      totalDays,
      targetWeekday,
      targetDateFormatted,
      tense
    };
  }

  function performCalculation(shouldScrollToResults) {
    hideError();

    if (!dobInput || !dobInput.value) {
      showError('Please enter your date of birth.');
      return;
    }

    if (!targetDateInput || !targetDateInput.value) {
      showError('Please select a date to calculate age on.');
      return;
    }

    const dobDate = parseDateInput(dobInput.value);
    const targetDate = parseDateInput(targetDateInput.value);

    if (!dobDate) {
      showError('Please enter a valid date of birth (between 1900 and 2100).');
      return;
    }

    if (!targetDate) {
      showError('Please enter a valid target date (between 1900 and 2100).');
      return;
    }

    if (dobDate > targetDate) {
      showError('Date of birth cannot be after the selected date.');
      return;
    }

    try {
      const result = calculateAgeOnDate(dobDate, targetDate);

      if (resYears) resYears.textContent = formatNumber(result.years);
      if (resMonths) resMonths.textContent = formatNumber(result.months);
      if (resDays) resDays.textContent = formatNumber(result.days);
      if (resTotalDays) resTotalDays.textContent = formatNumber(result.totalDays);
      if (resWeekday) resWeekday.textContent = result.targetWeekday;

      // Dynamic tense adjustments
      let tenseLeadText = 'You are';
      let summaryText = '';
      let weekdayDescText = '';

      if (result.tense === 'past') {
        tenseLeadText = `On ${result.targetDateFormatted}, you were`;
        summaryText = `On ${result.weekday || result.targetWeekday}, ${result.targetDateFormatted}, you were ${result.years} years, ${result.months} months, and ${result.days} days old (${formatNumber(result.totalDays)} total days).`;
        weekdayDescText = `The day of the week on that date was ${result.targetWeekday}.`;
      } else if (result.tense === 'future') {
        tenseLeadText = `On ${result.targetDateFormatted}, you will be`;
        summaryText = `On ${result.weekday || result.targetWeekday}, ${result.targetDateFormatted}, you will be ${result.years} years, ${result.months} months, and ${result.days} days old (${formatNumber(result.totalDays)} total days).`;
        weekdayDescText = `The day of the week on that date will be ${result.targetWeekday}.`;
      } else {
        tenseLeadText = `Today (${result.targetDateFormatted}), you are`;
        summaryText = `Today (${result.weekday || result.targetWeekday}, ${result.targetDateFormatted}), you are ${result.years} years, ${result.months} months, and ${result.days} days old (${formatNumber(result.totalDays)} total days).`;
        weekdayDescText = `Today is ${result.targetWeekday}.`;
      }

      if (tenseLead) tenseLead.textContent = tenseLeadText;
      if (resTargetDateFormatted) resTargetDateFormatted.textContent = result.targetDateFormatted;
      if (resWeekdayDesc) resWeekdayDesc.textContent = weekdayDescText;
      if (resSummarySentence) resSummarySentence.textContent = summaryText;

      currentResultSummary = `${summaryText} Calculated with MyAgeNow (https://myagenow.today/age-on-any-date.html)`;

      if (resultsSection) {
        if (resultsSection.hidden) {
          resultsSection.hidden = false;
          window.requestAnimationFrame(function () {
            resultsSection.classList.add('is-visible');
          });
        }
      }

      if (shouldScrollToResults && resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        resultsSection.focus({ preventScroll: true });
      }
    } catch (err) {
      showError(err.message || 'Please check your dates and try again.');
    }
  }

  // Initialize target date to today
  const today = new Date();
  const todayFormatted = formatDateForInput(today);

  if (targetDateInput) {
    targetDateInput.value = todayFormatted;
    targetDateInput.setAttribute('min', '1900-01-01');
    targetDateInput.setAttribute('max', '2100-12-31');
  }

  if (dobInput) {
    dobInput.value = '';
    dobInput.setAttribute('min', '1900-01-01');
    dobInput.setAttribute('max', '2100-12-31');
  }

  // Quick Action: "Use Today"
  if (todayQuickBtn) {
    todayQuickBtn.addEventListener('click', function () {
      if (targetDateInput) {
        targetDateInput.value = formatDateForInput(new Date());
        if (dobInput && dobInput.value) {
          performCalculation(false);
        }
      }
    });
  }

  // Form submission
  if (ageForm) {
    ageForm.addEventListener('submit', function (e) {
      e.preventDefault();
      performCalculation(true);
    });
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (dobInput) dobInput.value = '';
      if (targetDateInput) targetDateInput.value = formatDateForInput(new Date());
      hideError();
      if (resultsSection) {
        resultsSection.hidden = true;
        resultsSection.classList.remove('is-visible');
      }
      if (dobInput) dobInput.focus();
    });
  }

  // Auto-calculation on valid input change if DOB is filled
  [dobInput, targetDateInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener('click', function () {
      if (typeof input.showPicker === 'function') {
        try {
          input.showPicker();
        } catch (err) {
          // Ignore unsupported browser error
        }
      }
    });
    input.addEventListener('change', function () {
      if (dobInput && dobInput.value && targetDateInput && targetDateInput.value) {
        performCalculation(false);
      }
    });
  });

  // Copy Results Button
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (!currentResultSummary) return;
      navigator.clipboard.writeText(currentResultSummary).then(function () {
        const originalNodes = Array.from(copyBtn.childNodes).map(n => n.cloneNode(true));
        const originalLabel = copyBtn.getAttribute('aria-label') || 'Copy results to clipboard';

        const svgNs = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNs, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '15');
        svg.setAttribute('height', '15');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.setAttribute('aria-hidden', 'true');

        const polyline = document.createElementNS(svgNs, 'polyline');
        polyline.setAttribute('points', '20 6 9 17 4 12');
        svg.appendChild(polyline);

        copyBtn.replaceChildren(svg, document.createTextNode(' Copied!'));
        copyBtn.setAttribute('aria-label', 'Results copied to clipboard');
        copyBtn.classList.add('is-success');
        if (copyLiveStatus) copyLiveStatus.textContent = 'Results copied to clipboard';

        setTimeout(function () {
          copyBtn.replaceChildren(...originalNodes);
          copyBtn.setAttribute('aria-label', originalLabel);
          copyBtn.classList.remove('is-success');
          if (copyLiveStatus) copyLiveStatus.textContent = '';
        }, 2000);
      }).catch(function () {
        showError('Could not copy to clipboard.');
      });
    });
  }

  // Share Results Button
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      if (!currentResultSummary) return;
      if (navigator.share) {
        navigator.share({
          title: 'Age on Date Calculation - MyAgeNow',
          text: currentResultSummary,
          url: window.location.href
        }).catch(function () {});
      } else {
        if (copyBtn) copyBtn.click();
      }
    });
  }
});
