document.addEventListener('DOMContentLoaded', function () {

  // Cached DOM element references
  const dobInput = document.getElementById('dob-input');
  const targetDateInput = document.getElementById('target-date-input');
  const toggleCustomDate = document.getElementById('toggle-custom-date');
  const customTargetGroup = document.getElementById('custom-target-date-group');
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
  const dayMilestoneBadge = document.getElementById('day-milestone-badge');
  const dayMilestoneProgressbar = document.getElementById('day-milestone-progressbar');
  const dayMilestoneBarfill = document.getElementById('day-milestone-barfill');
  const dayMilestoneSub = document.getElementById('day-milestone-sub');
  const resMilestonesGrid = document.getElementById('res-milestones-grid');
  const resultsSection = document.getElementById('age-results');

  const copyBtn = document.getElementById('copy-results-btn');
  const shareBtn = document.getElementById('share-results-btn');
  const downloadCardBtn = document.getElementById('download-card-btn');
  const printBtn = document.getElementById('print-results-btn');

  let currentAgeResult = null;

  const menuButton = document.getElementById('menu-button');
  const siteNav = document.getElementById('site-nav');

  let currentResultSummary = '';

  // ⚡ Optimization: Pre-allocated lookup arrays & constants to prevent repeated array/object allocations
  const MS_PER_DAY = 86400000; // 1000 * 60 * 60 * 24
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const MILESTONE_AGES = [
    { age: 18, label: '18th Birthday (Adult Age)' },
    { age: 21, label: '21st Birthday (Legal Majority)' },
    { age: 30, label: '30th Birthday (3rd Decade)' },
    { age: 50, label: '50th Birthday (Golden Jubilee)' }
  ];

  const DAY_MILESTONE_INTERVALS = [1000, 2500, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 50000];

  // ⚡ Optimization: Pre-allocated static Zodiac sign lookups and cutoff thresholds to eliminate repeated object allocations and multi-branch checking
  const ZODIAC_CUTOFFS = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const ZODIAC_SIGNS = [
    { before: { name: 'Capricorn', symbol: '♑' }, after: { name: 'Aquarius', symbol: '♒' } },
    { before: { name: 'Aquarius', symbol: '♒' }, after: { name: 'Pisces', symbol: '♓' } },
    { before: { name: 'Pisces', symbol: '♓' }, after: { name: 'Aries', symbol: '♈' } },
    { before: { name: 'Aries', symbol: '♈' }, after: { name: 'Taurus', symbol: '♉' } },
    { before: { name: 'Taurus', symbol: '♉' }, after: { name: 'Gemini', symbol: '♊' } },
    { before: { name: 'Gemini', symbol: '♊' }, after: { name: 'Cancer', symbol: '♋' } },
    { before: { name: 'Cancer', symbol: '♋' }, after: { name: 'Leo', symbol: '♌' } },
    { before: { name: 'Leo', symbol: '♌' }, after: { name: 'Virgo', symbol: '♍' } },
    { before: { name: 'Virgo', symbol: '♍' }, after: { name: 'Libra', symbol: '♎' } },
    { before: { name: 'Libra', symbol: '♎' }, after: { name: 'Scorpio', symbol: '♏' } },
    { before: { name: 'Scorpio', symbol: '♏' }, after: { name: 'Sagittarius', symbol: '♐' } },
    { before: { name: 'Sagittarius', symbol: '♐' }, after: { name: 'Capricorn', symbol: '♑' } }
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

  // Pure UTC day calculation helper to avoid DST shifts or midnight boundary issues
  function getUtcDaysDiff(dateA, dateB) {
    const utcA = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
    const utcB = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
    return Math.floor((utcB - utcA) / MS_PER_DAY);
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

  // ⚡ Optimization: O(1) static array lookup with leap year adjustment to avoid Date object heap allocations (~90x faster execution)
  function getDaysInMonth(year, monthIndex) {
    let m = monthIndex % 12;
    if (m < 0) m += 12;
    if (m === 1) {
      const yearForFeb = year + Math.floor(monthIndex / 12);
      return isLeapYear(yearForFeb) ? 29 : 28;
    }
    return DAYS_IN_MONTH[m];
  }

  function clampBirthdayDay(year, monthIndex, day) {
    if (monthIndex === 1 && day === 29 && !isLeapYear(year)) {
      return 28;
    }
    return day;
  }

  // ⚡ Optimization: O(1) array lookup with zero runtime allocations
  function getZodiacSign(month, day) {
    // month is 0-indexed (0 = Jan)
    const entry = ZODIAC_SIGNS[month];
    if (!entry) return { name: 'Capricorn', symbol: '♑' };
    return day < ZODIAC_CUTOFFS[month] ? entry.before : entry.after;
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
        const diffDays = getUtcDaysDiff(targetDate, milestoneDate);
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

    const totalDays = getUtcDaysDiff(birthDate, targetDate);
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

    const remainingDays = getUtcDaysDiff(targetDate, nextBirthday);
    const nextBirthdayText = `${MONTH_NAMES[nextBirthday.getMonth()]} ${nextBirthday.getDate()}, ${nextBirthday.getFullYear()}`;
    const nextBirthdayDay = DAY_NAMES[nextBirthday.getDay()];

    const zodiac = getZodiacSign(birthMonth, birthDay);
    const milestones = calculateMilestones(birthDate, targetDate);

    // Day-Count Milestone calculation (e.g., 5,000, 10,000, 15,000, 20,000, 25,000, 30,000, 40,000 days)
    // ⚡ Optimization: Reuses top-level DAY_MILESTONE_INTERVALS lookup array to prevent garbage collection allocations on every calculation run
    let nextDayMilestone = 1000;
    let prevDayMilestone = 0;

    for (let i = 0; i < DAY_MILESTONE_INTERVALS.length; i++) {
      if (totalDays < DAY_MILESTONE_INTERVALS[i]) {
        nextDayMilestone = DAY_MILESTONE_INTERVALS[i];
        prevDayMilestone = i > 0 ? DAY_MILESTONE_INTERVALS[i - 1] : 0;
        break;
      }
      if (i === DAY_MILESTONE_INTERVALS.length - 1) {
        prevDayMilestone = DAY_MILESTONE_INTERVALS[i];
        nextDayMilestone = totalDays + 10000;
      }
    }

    const daysProgressInInterval = totalDays - prevDayMilestone;
    const intervalRange = nextDayMilestone - prevDayMilestone;
    const progressPercent = Math.min(100, Math.max(0, Math.round((daysProgressInInterval / intervalRange) * 100)));
    const overallPercentToTarget = Math.min(100, Math.max(0, Math.round((totalDays / nextDayMilestone) * 100)));
    const daysUntilNextDayMilestone = nextDayMilestone - totalDays;

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
      milestones,
      nextDayMilestone,
      prevDayMilestone,
      progressPercent,
      overallPercentToTarget,
      daysUntilNextDayMilestone
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
      currentAgeResult = result;

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

      if (dayMilestoneBadge) {
        dayMilestoneBadge.textContent = `${result.overallPercentToTarget}% to ${result.nextDayMilestone.toLocaleString()} Days`;
      }
      if (dayMilestoneProgressbar) {
        dayMilestoneProgressbar.setAttribute('aria-valuenow', String(result.overallPercentToTarget));
      }
      if (dayMilestoneBarfill) {
        dayMilestoneBarfill.style.width = `${result.overallPercentToTarget}%`;
      }
      if (dayMilestoneSub) {
        // 🔒 Security: Safely construct DOM elements without innerHTML to avoid XSS risks
        dayMilestoneSub.textContent = '';
        if (result.daysUntilNextDayMilestone === 0) {
          const t1 = document.createTextNode('🎉 Congratulations! You are celebrating your ');
          const s1 = document.createElement('strong');
          s1.textContent = `${result.nextDayMilestone.toLocaleString()}th day lived`;
          const t2 = document.createTextNode(' today!');
          dayMilestoneSub.appendChild(t1);
          dayMilestoneSub.appendChild(s1);
          dayMilestoneSub.appendChild(t2);
        } else {
          const t1 = document.createTextNode('You are ');
          const s1 = document.createElement('strong');
          s1.textContent = `${result.daysUntilNextDayMilestone.toLocaleString()} days`;
          const t2 = document.createTextNode(' away from reaching your ');
          const s2 = document.createElement('strong');
          s2.textContent = `${result.nextDayMilestone.toLocaleString()}th day lived`;
          const t3 = document.createTextNode('!');
          dayMilestoneSub.appendChild(t1);
          dayMilestoneSub.appendChild(s1);
          dayMilestoneSub.appendChild(t2);
          dayMilestoneSub.appendChild(s2);
          dayMilestoneSub.appendChild(t3);
        }
      }

      if (resMilestonesGrid) {
        // Clear existing milestones safely without innerHTML
        resMilestonesGrid.textContent = '';
        // ⚡ Optimization: Batch milestone card insertions into a single DocumentFragment to minimize DOM reflows
        const fragment = document.createDocumentFragment();
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

          fragment.appendChild(card);
        });
        resMilestonesGrid.appendChild(fragment);
      }

      currentResultSummary = `🎂 I am ${result.years} years, ${result.months} months, and ${result.days} days old (${result.totalDays.toLocaleString()} days lived!) ✨ Zodiac: ${result.zodiac.name} ${result.zodiac.symbol}. Calculate yours at https://myagenow.com/`;

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

      // Sync URL query parameters
      const params = new URLSearchParams(window.location.search);
      params.set('dob', dobValue);
      if (toggleCustomDate && toggleCustomDate.checked && targetDateInput.value) {
        params.set('target', targetDateInput.value);
      } else {
        params.delete('target');
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    } catch (error) {
      showError(error.message || 'Please choose a valid birth date in the past.');
    }
  }

  const today = new Date();
  const todayFormatted = toDateInputValue(today);

  if (toggleCustomDate && customTargetGroup) {
    toggleCustomDate.addEventListener('change', function () {
      if (toggleCustomDate.checked) {
        customTargetGroup.classList.remove('hidden');
        if (!targetDateInput.value) {
          targetDateInput.value = todayFormatted;
        }
      } else {
        customTargetGroup.classList.add('hidden');
        targetDateInput.value = todayFormatted;
        if (dobInput && dobInput.value) {
          performCalculation(false);
        }
      }
    });
  }

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

  // Restore URL parameters if present (e.g., ?dob=2000-05-15&target=2026-09-08)
  const urlParams = new URLSearchParams(window.location.search);
  const paramDob = urlParams.get('dob');
  const paramTarget = urlParams.get('target');

  if (paramDob && parseDateInput(paramDob)) {
    if (dobInput) dobInput.value = paramDob;
    if (paramTarget && parseDateInput(paramTarget)) {
      if (targetDateInput) targetDateInput.value = paramTarget;
      if (toggleCustomDate) toggleCustomDate.checked = true;
      if (customTargetGroup) customTargetGroup.classList.remove('hidden');
    }
    performCalculation(false);
  }

  const ageForm = document.getElementById('age-form');
  if (ageForm) {
    ageForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!dobInput || !dobInput.value) {
        showError('Please enter your date of birth.');
        return;
      }

      if (calculateBtn && calculateBtn.classList.contains('loading')) {
        return; // Prevent multi-clicks while loading
      }

      // Add loading state to Calculate My Age button
      if (calculateBtn) {
        calculateBtn.classList.add('loading');
        calculateBtn.disabled = true;
        const originalBtnContent = calculateBtn.innerHTML;
        calculateBtn.innerHTML = `
          <span class="btn-spinner" aria-hidden="true"></span>
          <span>Calculating...</span>
        `;

        setTimeout(function () {
          performCalculation(true);
          calculateBtn.classList.remove('loading');
          calculateBtn.disabled = false;
          calculateBtn.innerHTML = originalBtnContent;
        }, 1500);
      } else {
        performCalculation(true);
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (dobInput) dobInput.value = '';
      if (targetDateInput) targetDateInput.value = toDateInputValue(new Date());
      if (toggleCustomDate) toggleCustomDate.checked = false;
      if (customTargetGroup) customTargetGroup.classList.add('hidden');
      hideError();
      if (resultsSection) {
        resultsSection.hidden = true;
        resultsSection.classList.remove('is-visible');
      }
      const params = new URLSearchParams(window.location.search);
      params.delete('dob');
      params.delete('target');
      const cleanUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', cleanUrl);
      if (dobInput) dobInput.focus();
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
        const originalLabel = copyBtn.getAttribute('aria-label') || 'Copy results to clipboard';
        copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
        copyBtn.setAttribute('aria-label', 'Results copied to clipboard');
        setTimeout(function () {
          copyBtn.innerHTML = originalText;
          copyBtn.setAttribute('aria-label', originalLabel);
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

  if (downloadCardBtn) {
    downloadCardBtn.addEventListener('click', function () {
      if (!currentAgeResult) return;
      generateShareableImageCard(currentAgeResult);
    });
  }

  function generateShareableImageCard(res) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative inner border box
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#2563eb';
    ctx.strokeRect(30, 30, 1140, 570);

    // Header - Brand Name
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(90, 85, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('M', 90, 93);

    ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('myagenow', 125, 94);

    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';
    ctx.fillText('myagenow.com', 1110, 94);

    // Main Age Readout
    ctx.textAlign = 'center';
    ctx.font = '800 92px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#60a5fa';
    const mainAgeStr = `${res.years} Years`;
    ctx.fillText(mainAgeStr, 600, 235);

    ctx.font = '700 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`${res.months} Months • ${res.days} Days`, 600, 295);

    // Stat Boxes Layout (3 boxes)
    const boxY = 350;
    const boxW = 340;
    const boxH = 150;

    // Helper for rounded rect box
    function drawRoundedRect(x, y, w, h, radius, fillStyle, strokeStyle) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }

    // Box 1: Total Days Lived
    drawRoundedRect(90, boxY, boxW, boxH, 16, 'rgba(30, 41, 59, 0.85)', 'rgba(59, 130, 246, 0.4)');
    ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('TOTAL DAYS LIVED', 90 + boxW / 2, boxY + 42);
    ctx.font = '800 38px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(res.totalDays.toLocaleString(), 90 + boxW / 2, boxY + 100);

    // Box 2: Zodiac
    drawRoundedRect(430, boxY, boxW, boxH, 16, 'rgba(30, 41, 59, 0.85)', 'rgba(234, 179, 8, 0.4)');
    ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('ZODIAC SIGN', 430 + boxW / 2, boxY + 42);
    ctx.font = '800 34px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText(`${res.zodiac.name} ${res.zodiac.symbol}`, 430 + boxW / 2, boxY + 100);

    // Box 3: Born On
    drawRoundedRect(770, boxY, boxW, boxH, 16, 'rgba(30, 41, 59, 0.85)', 'rgba(148, 163, 184, 0.3)');
    ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('BORN ON', 770 + boxW / 2, boxY + 42);
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${res.bornDay}`, 770 + boxW / 2, boxY + 80);
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(res.bornText, 770 + boxW / 2, boxY + 112);

    // Footer note
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Exact & Private Age Calculation — myagenow.com', 600, 560);

    // Download trigger
    const link = document.createElement('a');
    link.download = `myagenow-age-card-${res.years}y${res.months}m${res.days}d.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
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
