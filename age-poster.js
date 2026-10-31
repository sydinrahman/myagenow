/**
 * Age Poster Generator - Client-Side Interactive Engine
 * Provides real-time preview updates, 4 original templates with 3 color palettes each,
 * accurate chronological age calculation, high-resolution 1200×1500 Canvas 2D export,
 * Web Share API integration, and shareable URL query parameters.
 */

document.addEventListener('DOMContentLoaded', function () {
  // --- Form & Input Elements ---
  const posterNameInput = document.getElementById('poster-name');
  const posterDobInput = document.getElementById('poster-dob');
  const posterTitleInput = document.getElementById('poster-title-input');
  const posterResetBtn = document.getElementById('poster-reset-btn');
  const posterErrorBox = document.getElementById('poster-error-box');
  const posterErrorMessage = document.getElementById('poster-error-message');
  const posterColorPaletteContainer = document.getElementById('poster-color-palette-container');

  // --- Live Preview DOM Elements ---
  const agePosterRender = document.getElementById('age-poster-render');
  const posterDecorations = document.getElementById('poster-decorations');
  const posterTitleVal = document.getElementById('poster-title-val');
  const posterSubtitleVal = document.getElementById('poster-subtitle-val');
  const posterLargeYears = document.getElementById('poster-large-years');
  const posterAgeUnitsText = document.getElementById('poster-age-units-text');
  const posterCountdownVal = document.getElementById('poster-countdown-val');
  const posterMilestoneVal = document.getElementById('poster-milestone-val');
  const posterTotalDaysVal = document.getElementById('poster-total-days-val');
  const posterTotalWeeksVal = document.getElementById('poster-total-weeks-val');
  const posterZodiacVal = document.getElementById('poster-zodiac-val');
  const posterMilestoneCountdownVal = document.getElementById('poster-milestone-countdown-val');
  const posterDateStampVal = document.getElementById('poster-date-stamp-val');

  // --- Action Buttons ---
  const downloadPosterPngBtn = document.getElementById('download-poster-png-btn');
  const sharePosterBtn = document.getElementById('share-poster-btn');
  const copyPosterLinkBtn = document.getElementById('copy-poster-link-btn');
  const printPosterBtn = document.getElementById('print-poster-btn');
  const posterActionStatus = document.getElementById('poster-action-status');

  // --- Template Buttons ---
  const templateButtons = document.querySelectorAll('.template-option');

  // ⚡ Number formatter instance
  const numberFormatter = new Intl.NumberFormat('en-US');
  function formatNumber(val) {
    return typeof val === 'number' ? numberFormatter.format(val) : val;
  }

  // Constants
  const MS_PER_DAY = 86400000;
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Landmark Milestones for Age Poster
  const LANDMARK_MILESTONES = [18, 21, 30, 40, 50, 60, 70, 80, 90, 100];

  // Zodiac Configuration
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

  function clampBirthdayDay(year, monthIndex, day) {
    if (monthIndex === 1 && day === 29 && !isLeapYear(year)) {
      return 28;
    }
    return day;
  }

  function getZodiacSign(month, day) {
    const entry = ZODIAC_SIGNS[month];
    if (!entry) return { name: 'Capricorn', symbol: '♑' };
    return day < ZODIAC_CUTOFFS[month] ? entry.before : entry.after;
  }

  // --- Templates & Color Palettes Configuration ---
  const TEMPLATE_CONFIG = {
    'minimal-blue': {
      name: 'Minimal Blue',
      fontHeading: "'Plus Jakarta Sans', sans-serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      kicker: 'MYAGENOW • PERSONAL STATS',
      palettes: [
        {
          id: 'cobalt',
          label: 'Cobalt & White',
          primary: '#1d4ed8',
          secondary: '#2563eb',
          accent: '#3b82f6',
          bg: '#f8fafc',
          cardBg: '#ffffff',
          border: '#dbeafe',
          text: '#0f172a',
          statCardBg: '#f0f7ff',
          statCardBorder: '#bfdbfe'
        },
        {
          id: 'navy',
          label: 'Deep Navy & Cyan',
          primary: '#0f172a',
          secondary: '#0284c7',
          accent: '#06b6d4',
          bg: '#f0f9ff',
          cardBg: '#ffffff',
          border: '#bae6fd',
          text: '#0f172a',
          statCardBg: '#e0f2fe',
          statCardBorder: '#7dd3fc'
        },
        {
          id: 'indigo',
          label: 'Royal Indigo',
          primary: '#4338ca',
          secondary: '#6366f1',
          accent: '#818cf8',
          bg: '#f5f3ff',
          cardBg: '#ffffff',
          border: '#ddd6fe',
          text: '#1e1b4b',
          statCardBg: '#ede9fe',
          statCardBorder: '#c4b5fd'
        }
      ]
    },
    'luxury-dark': {
      name: 'Luxury Dark',
      fontHeading: "'Cinzel', Georgia, serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      kicker: '✦ A LIFE CHRONICLE ✦',
      palettes: [
        {
          id: 'gold-noir',
          label: 'Noir & Gold',
          primary: '#d4af37',
          secondary: '#fef08a',
          accent: '#eab308',
          bg: '#090d16',
          cardBg: '#111827',
          border: '#d4af37',
          text: '#f8fafc',
          statCardBg: 'rgba(212, 175, 55, 0.08)',
          statCardBorder: 'rgba(212, 175, 55, 0.35)'
        },
        {
          id: 'emerald-gold',
          label: 'Emerald & Gold',
          primary: '#e2ba59',
          secondary: '#6ee7b7',
          accent: '#10b981',
          bg: '#051912',
          cardBg: '#09291e',
          border: '#c99e3a',
          text: '#f3f4f6',
          statCardBg: 'rgba(226, 186, 89, 0.09)',
          statCardBorder: 'rgba(201, 158, 58, 0.4)'
        },
        {
          id: 'amethyst-gold',
          label: 'Midnight Velvet',
          primary: '#ecc765',
          secondary: '#d8b4fe',
          accent: '#c084fc',
          bg: '#120a1f',
          cardBg: '#201236',
          border: '#c99836',
          text: '#faf5ff',
          statCardBg: 'rgba(236, 199, 101, 0.08)',
          statCardBorder: 'rgba(201, 152, 54, 0.4)'
        }
      ]
    },
    'colorful': {
      name: 'Colorful',
      fontHeading: "'Space Grotesk', sans-serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      kicker: 'TIME IN MOTION • MY JOURNEY',
      palettes: [
        {
          id: 'sunset-burst',
          label: 'Sunset Burst',
          primary: '#ea580c',
          secondary: '#db2777',
          accent: '#f59e0b',
          bg: '#fff7ed',
          cardBg: '#ffffff',
          border: '#fed7aa',
          text: '#1c1917',
          statCardBg: '#ffedd5',
          statCardBorder: '#fdba74'
        },
        {
          id: 'electric-violet',
          label: 'Electric Violet',
          primary: '#7c3aed',
          secondary: '#ec4899',
          accent: '#06b6d4',
          bg: '#faf5ff',
          cardBg: '#ffffff',
          border: '#f3e8ff',
          text: '#18181b',
          statCardBg: '#f5f3ff',
          statCardBorder: '#ddd6fe'
        },
        {
          id: 'ocean-surge',
          label: 'Ocean Surge',
          primary: '#0284c7',
          secondary: '#10b981',
          accent: '#f59e0b',
          bg: '#f0fdfa',
          cardBg: '#ffffff',
          border: '#ccfbf1',
          text: '#0f172a',
          statCardBg: '#e6fffa',
          statCardBorder: '#99f6e4'
        }
      ]
    },
    'editorial': {
      name: 'Editorial',
      fontHeading: "'Playfair Display', Georgia, serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      kicker: 'VOL. I • AN ANTHOLOGY OF TIME',
      palettes: [
        {
          id: 'warm-sand',
          label: 'Warm Sand',
          primary: '#292524',
          secondary: '#78350f',
          accent: '#b45309',
          bg: '#fbfaf8',
          cardBg: '#ffffff',
          border: '#e7e5e4',
          text: '#1c1917',
          statCardBg: '#f5f5f4',
          statCardBorder: '#d6d3d1'
        },
        {
          id: 'sage-linen',
          label: 'Sage & Linen',
          primary: '#1c2826',
          secondary: '#365349',
          accent: '#5e8174',
          bg: '#f4f6f5',
          cardBg: '#ffffff',
          border: '#dce3e0',
          text: '#192220',
          statCardBg: '#edf2ef',
          statCardBorder: '#cbd7d2'
        },
        {
          id: 'terracotta',
          label: 'Terracotta & Clay',
          primary: '#431407',
          secondary: '#9a3412',
          accent: '#c2410c',
          bg: '#fdf8f6',
          cardBg: '#ffffff',
          border: '#fed7aa',
          text: '#292524',
          statCardBg: '#ffedd5',
          statCardBorder: '#fdba74'
        }
      ]
    }
  };

  // State Management
  const state = {
    name: 'Alex',
    dob: '1998-05-15',
    title: 'LIFE IN NUMBERS',
    template: 'minimal-blue',
    colorId: 'cobalt'
  };

  // Safe Date Parser
  function parseISODate(isoStr) {
    if (!isoStr || typeof isoStr !== 'string') return null;
    if (isoStr.length > 20) return null;
    const trimmed = isoStr.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;

    const parts = trimmed.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    if (year < 1900 || year > 2100 || month < 0 || month > 11 || day < 1 || day > 31) {
      return null;
    }

    const d = new Date(year, month, day);
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
      return d;
    }
    return null;
  }

  function formatDisplayDate(dateObj) {
    if (!dateObj) return '';
    return `${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
  }

  // Next Landmark Milestone Calculator
  function calculateNextMilestone(birthYear, currentAgeYears, targetUtc, birthMonth, birthDay) {
    // Find next landmark milestone age > currentAgeYears
    let nextMilestoneAge = null;
    for (let i = 0; i < LANDMARK_MILESTONES.length; i++) {
      if (LANDMARK_MILESTONES[i] > currentAgeYears) {
        nextMilestoneAge = LANDMARK_MILESTONES[i];
        break;
      }
    }

    // If already beyond 100, step in increments of 5
    if (nextMilestoneAge === null) {
      nextMilestoneAge = Math.floor(currentAgeYears / 5) * 5 + 5;
    }

    const milestoneYear = birthYear + nextMilestoneAge;
    const milestoneDay = clampBirthdayDay(milestoneYear, birthMonth, birthDay);
    const milestoneUtc = Date.UTC(milestoneYear, birthMonth, milestoneDay);

    const diffDays = Math.max(0, Math.floor((milestoneUtc - targetUtc) / MS_PER_DAY));
    const diffYears = (diffDays / 365.25).toFixed(1);

    return {
      age: nextMilestoneAge,
      year: milestoneYear,
      diffDays,
      diffYears
    };
  }

  // Chronological Age Calculation Engine
  function computeAgeMetrics(birthDate) {
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    const targetYear = today.getFullYear();
    const targetMonth = today.getMonth();
    const targetDay = today.getDate();

    const birthUtc = Date.UTC(birthYear, birthMonth, birthDay);
    const targetUtc = Date.UTC(targetYear, targetMonth, targetDay);

    if (birthUtc > targetUtc) {
      throw new Error('Date of birth cannot be in the future.');
    }

    let years = targetYear - birthYear;
    let months = targetMonth - birthMonth;

    let effectiveBirthDay = birthDay;
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
    const totalWeeks = Math.floor(totalDays / 7);

    // Next Birthday countdown
    let bdayYear = targetYear;
    let bdayDay = clampBirthdayDay(bdayYear, birthMonth, birthDay);
    let nextBdayUtc = Date.UTC(bdayYear, birthMonth, bdayDay);

    if (nextBdayUtc < targetUtc) {
      bdayYear += 1;
      bdayDay = clampBirthdayDay(bdayYear, birthMonth, birthDay);
      nextBdayUtc = Date.UTC(bdayYear, birthMonth, bdayDay);
    }

    const daysUntilNextBday = Math.floor((nextBdayUtc - targetUtc) / MS_PER_DAY);
    const nextBdayText = daysUntilNextBday === 0 ? 'Today! 🎉' : `${daysUntilNextBday} ${daysUntilNextBday === 1 ? 'Day' : 'Days'}`;

    // Zodiac sign
    const zodiac = getZodiacSign(birthMonth, birthDay);

    // Next milestone
    const milestone = calculateNextMilestone(birthYear, years, targetUtc, birthMonth, birthDay);

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      daysUntilNextBday,
      nextBdayText,
      zodiac,
      milestone,
      formattedBirthDate: formatDisplayDate(birthDate)
    };
  }

  // Error Handling UI
  function showPosterError(msg) {
    if (posterErrorBox && posterErrorMessage) {
      posterErrorMessage.textContent = msg;
      posterErrorBox.classList.remove('hidden');
    }
    if (posterDobInput) {
      posterDobInput.setAttribute('aria-invalid', 'true');
    }
  }

  function hidePosterError() {
    if (posterErrorBox) {
      posterErrorBox.classList.add('hidden');
    }
    if (posterDobInput) {
      posterDobInput.removeAttribute('aria-invalid');
    }
  }

  // Render Color Palettes
  function renderColorPalettes() {
    if (!posterColorPaletteContainer) return;
    posterColorPaletteContainer.replaceChildren();

    const tplConfig = TEMPLATE_CONFIG[state.template];
    if (!tplConfig || !tplConfig.palettes) return;

    // Verify valid colorId
    const paletteExists = tplConfig.palettes.some(p => p.id === state.colorId);
    if (!paletteExists) {
      state.colorId = tplConfig.palettes[0].id;
    }

    tplConfig.palettes.forEach(palette => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `color-swatch-btn ${palette.id === state.colorId ? 'active' : ''}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(palette.id === state.colorId));
      btn.setAttribute('data-color', palette.id);
      btn.setAttribute('title', palette.label);

      const previewCircle = document.createElement('span');
      previewCircle.className = 'color-preview-circle';
      previewCircle.style.background = `linear-gradient(135deg, ${palette.primary} 50%, ${palette.secondary} 50%)`;
      if (palette.border) {
        previewCircle.style.boxShadow = `0 0 0 1px ${palette.border}`;
      }

      const label = document.createElement('span');
      label.className = 'color-swatch-label';
      label.textContent = palette.label;

      btn.appendChild(previewCircle);
      btn.appendChild(label);

      btn.addEventListener('click', function () {
        state.colorId = palette.id;
        updatePaletteSelectionUI();
        updatePosterPreview();
        updateShareableURL();
      });

      posterColorPaletteContainer.appendChild(btn);
    });
  }

  function updatePaletteSelectionUI() {
    if (!posterColorPaletteContainer) return;
    const buttons = posterColorPaletteContainer.querySelectorAll('.color-swatch-btn');
    buttons.forEach(btn => {
      const isSelected = btn.getAttribute('data-color') === state.colorId;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-checked', String(isSelected));
    });
  }

  // Update Poster Preview DOM
  function updatePosterPreview() {
    if (!agePosterRender) return;

    const parsedDob = parseISODate(state.dob);
    if (!parsedDob) {
      showPosterError('Please select a valid date of birth in the past.');
      return;
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (parsedDob > today) {
      showPosterError('Date of birth cannot be in the future.');
      return;
    }

    hidePosterError();

    let metrics;
    try {
      metrics = computeAgeMetrics(parsedDob);
    } catch (err) {
      showPosterError(err.message || 'Invalid date calculation.');
      return;
    }

    const tplConfig = TEMPLATE_CONFIG[state.template];
    const currentPalette = tplConfig.palettes.find(p => p.id === state.colorId) || tplConfig.palettes[0];

    // Set classes & CSS variables
    agePosterRender.className = `age-poster template-${state.template} theme-${state.colorId}`;
    agePosterRender.style.setProperty('--poster-primary', currentPalette.primary);
    agePosterRender.style.setProperty('--poster-secondary', currentPalette.secondary);
    agePosterRender.style.setProperty('--poster-accent', currentPalette.accent);
    agePosterRender.style.setProperty('--poster-bg', currentPalette.bg);
    agePosterRender.style.setProperty('--poster-card-bg', currentPalette.cardBg);
    agePosterRender.style.setProperty('--poster-border', currentPalette.border);
    agePosterRender.style.setProperty('--poster-text', currentPalette.text);
    agePosterRender.style.setProperty('--poster-stat-card-bg', currentPalette.statCardBg);
    agePosterRender.style.setProperty('--poster-stat-card-border', currentPalette.statCardBorder);
    agePosterRender.style.setProperty('--poster-font-heading', tplConfig.fontHeading);
    agePosterRender.style.setProperty('--poster-font-body', tplConfig.fontBody);

    // Kicker & Title
    const kickerEl = agePosterRender.querySelector('.poster-brand-kicker');
    if (kickerEl) {
      kickerEl.textContent = tplConfig.kicker;
    }

    const titleText = (state.title && state.title.trim()) ? state.title.trim() : 'LIFE IN NUMBERS';
    if (posterTitleVal) {
      posterTitleVal.textContent = titleText;
      posterTitleVal.style.fontFamily = tplConfig.fontHeading;
    }

    // Subtitle (Name)
    const nameText = (state.name && state.name.trim()) ? state.name.trim() : '';
    if (posterSubtitleVal) {
      if (nameText) {
        posterSubtitleVal.textContent = `A Celebration of ${nameText}`;
        posterSubtitleVal.classList.remove('hidden');
      } else {
        posterSubtitleVal.textContent = 'A Celebration of Life';
      }
    }

    // Large Hero Age
    if (posterLargeYears) {
      posterLargeYears.textContent = formatNumber(metrics.years);
      posterLargeYears.style.fontFamily = tplConfig.fontHeading;
    }

    if (posterAgeUnitsText) {
      posterAgeUnitsText.textContent = `YEARS • ${metrics.months} MONTHS • ${metrics.days} DAYS`;
    }

    // Next Birthday Countdown
    if (posterCountdownVal) {
      posterCountdownVal.textContent = metrics.nextBdayText;
    }

    // Next Milestone
    if (posterMilestoneVal) {
      posterMilestoneVal.textContent = `${metrics.milestone.age}th Birthday`;
    }

    // Stats Grid
    if (posterTotalDaysVal) {
      posterTotalDaysVal.textContent = formatNumber(metrics.totalDays);
    }
    if (posterTotalWeeksVal) {
      posterTotalWeeksVal.textContent = formatNumber(metrics.totalWeeks);
    }
    if (posterZodiacVal) {
      posterZodiacVal.textContent = `${metrics.zodiac.name} ${metrics.zodiac.symbol}`;
    }
    if (posterMilestoneCountdownVal) {
      posterMilestoneCountdownVal.textContent = `In ~${metrics.milestone.diffYears} Yrs`;
    }

    // Footer
    if (posterDateStampVal) {
      posterDateStampVal.textContent = `Born ${metrics.formattedBirthDate} • myagenow.today`;
    }

    // Update Template Specific Decorations
    updateDecorationsDOM(state.template, currentPalette);
  }

  function updateDecorationsDOM(templateKey, palette) {
    if (!posterDecorations) return;
    posterDecorations.replaceChildren();

    if (templateKey === 'luxury-dark') {
      ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(corner => {
        const cornerDiv = document.createElement('div');
        cornerDiv.className = `luxury-corner luxury-corner-${corner}`;
        posterDecorations.appendChild(cornerDiv);
      });
      const starTop = document.createElement('div');
      starTop.className = 'luxury-star-burst';
      starTop.textContent = '✦';
      posterDecorations.appendChild(starTop);
    } else if (templateKey === 'colorful') {
      const bubbles = ['✨', '🎈', '⭐', '💫', '🎉'];
      bubbles.forEach((b, idx) => {
        const span = document.createElement('span');
        span.className = `colorful-sparkle sparkle-${idx + 1}`;
        span.textContent = b;
        posterDecorations.appendChild(span);
      });
    } else if (templateKey === 'editorial') {
      const borderTopRule = document.createElement('div');
      borderTopRule.className = 'editorial-rule editorial-rule-top';
      const borderBottomRule = document.createElement('div');
      borderBottomRule.className = 'editorial-rule editorial-rule-bottom';
      posterDecorations.appendChild(borderTopRule);
      posterDecorations.appendChild(borderBottomRule);
    }
  }

  // --- Update Shareable URL Query Parameters ---
  function updateShareableURL() {
    const params = new URLSearchParams();
    if (state.name && state.name.trim() !== 'Alex') {
      params.set('name', state.name.trim());
    } else if (state.name) {
      params.set('name', state.name.trim());
    }

    if (state.dob && state.dob !== '1998-05-15') {
      params.set('dob', state.dob);
    } else if (state.dob) {
      params.set('dob', state.dob);
    }

    if (state.title && state.title.trim() !== 'LIFE IN NUMBERS') {
      params.set('title', state.title.trim());
    }

    if (state.template && state.template !== 'minimal-blue') {
      params.set('tpl', state.template);
    }

    if (state.colorId) {
      params.set('theme', state.colorId);
    }

    const queryStr = params.toString();
    const newUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }

  // Load state from URL parameters
  function loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    const paramName = params.get('name');
    const paramDob = params.get('dob');
    const paramTitle = params.get('title');
    const paramTpl = params.get('tpl');
    const paramTheme = params.get('theme');

    if (paramName !== null) {
      state.name = paramName.slice(0, 50);
      if (posterNameInput) posterNameInput.value = state.name;
    }

    if (paramDob && parseISODate(paramDob)) {
      state.dob = paramDob;
      if (posterDobInput) posterDobInput.value = state.dob;
    }

    if (paramTitle !== null) {
      state.title = paramTitle.slice(0, 40);
      if (posterTitleInput) posterTitleInput.value = state.title;
    }

    if (paramTpl && TEMPLATE_CONFIG[paramTpl]) {
      state.template = paramTpl;
    }

    if (paramTheme) {
      state.colorId = paramTheme;
    }

    // Sync template selector UI
    templateButtons.forEach(btn => {
      const isCur = btn.getAttribute('data-template') === state.template;
      btn.classList.toggle('active', isCur);
      btn.setAttribute('aria-checked', String(isCur));
    });
  }

  // --- Input Event Handlers ---
  if (posterNameInput) {
    posterNameInput.addEventListener('input', function () {
      state.name = posterNameInput.value;
      updatePosterPreview();
      updateShareableURL();
    });
  }

  if (posterDobInput) {
    // Set max to today
    const now = new Date();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    posterDobInput.setAttribute('max', `${now.getFullYear()}-${m}-${d}`);
    posterDobInput.setAttribute('min', '1900-01-01');

    posterDobInput.addEventListener('input', function () {
      state.dob = posterDobInput.value;
      updatePosterPreview();
      updateShareableURL();
    });
    posterDobInput.addEventListener('click', function () {
      if (typeof posterDobInput.showPicker === 'function') {
        try { posterDobInput.showPicker(); } catch (e) {}
      }
    });
  }

  if (posterTitleInput) {
    posterTitleInput.addEventListener('input', function () {
      state.title = posterTitleInput.value;
      updatePosterPreview();
      updateShareableURL();
    });
  }

  // Template Buttons Click Handling
  templateButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const selectedTpl = btn.getAttribute('data-template');
      if (!selectedTpl || !TEMPLATE_CONFIG[selectedTpl]) return;

      state.template = selectedTpl;
      state.colorId = TEMPLATE_CONFIG[selectedTpl].palettes[0].id;

      templateButtons.forEach(b => {
        const isCurrent = b === btn;
        b.classList.toggle('active', isCurrent);
        b.setAttribute('aria-checked', String(isCurrent));
      });

      renderColorPalettes();
      updatePosterPreview();
      updateShareableURL();
    });
  });

  // Reset Button
  if (posterResetBtn) {
    posterResetBtn.addEventListener('click', function () {
      state.name = 'Alex';
      state.dob = '1998-05-15';
      state.title = 'LIFE IN NUMBERS';
      state.template = 'minimal-blue';
      state.colorId = 'cobalt';

      if (posterNameInput) posterNameInput.value = state.name;
      if (posterDobInput) posterDobInput.value = state.dob;
      if (posterTitleInput) posterTitleInput.value = state.title;

      templateButtons.forEach(b => {
        const isMin = b.getAttribute('data-template') === 'minimal-blue';
        b.classList.toggle('active', isMin);
        b.setAttribute('aria-checked', String(isMin));
      });

      renderColorPalettes();
      updatePosterPreview();
      updateShareableURL();
      if (posterNameInput) posterNameInput.focus();
    });
  }

  // Print Poster
  if (printPosterBtn) {
    printPosterBtn.addEventListener('click', function () {
      window.print();
    });
  }

  // Copy Link Action
  if (copyPosterLinkBtn) {
    copyPosterLinkBtn.addEventListener('click', function () {
      const fullUrl = window.location.href;
      navigator.clipboard.writeText(fullUrl).then(() => {
        const origNodes = Array.from(copyPosterLinkBtn.childNodes).map(n => n.cloneNode(true));
        const origLabel = copyPosterLinkBtn.getAttribute('aria-label') || 'Copy shareable link';

        copyPosterLinkBtn.textContent = '✓ Link Copied!';
        copyPosterLinkBtn.classList.add('is-success');
        if (posterActionStatus) posterActionStatus.textContent = 'Shareable poster link copied to clipboard';

        setTimeout(() => {
          copyPosterLinkBtn.replaceChildren(...origNodes);
          copyPosterLinkBtn.setAttribute('aria-label', origLabel);
          copyPosterLinkBtn.classList.remove('is-success');
          if (posterActionStatus) posterActionStatus.textContent = '';
        }, 2200);
      }).catch(() => {
        alert('Could not copy link to clipboard.');
      });
    });
  }

  // --- High-Resolution 1200×1500 Canvas Renderer ---
  function renderPosterToCanvas() {
    const parsedDob = parseISODate(state.dob);
    if (!parsedDob) return null;

    let metrics;
    try {
      metrics = computeAgeMetrics(parsedDob);
    } catch (e) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const tplConfig = TEMPLATE_CONFIG[state.template];
    const palette = tplConfig.palettes.find(p => p.id === state.colorId) || tplConfig.palettes[0];

    // Helper: Rounded Rectangle
    function drawRoundedRect(x, y, w, h, radius, fillStyle, strokeStyle, lineWidth = 0) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle && lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
      }
    }

    // Helper: Draw Text with Font Resizing for long titles or names
    function drawFitText(text, x, y, maxWidth, initialSize, fontName, weight = '700', fillStyle = '#000', align = 'center') {
      let fontSize = initialSize;
      ctx.textAlign = align;
      ctx.fillStyle = fillStyle;
      ctx.font = `${weight} ${fontSize}px ${fontName}`;
      while (ctx.measureText(text).width > maxWidth && fontSize > 20) {
        fontSize -= 2;
        ctx.font = `${weight} ${fontSize}px ${fontName}`;
      }
      ctx.fillText(text, x, y);
      return fontSize;
    }

    // 1. Draw Canvas Background
    if (state.template === 'luxury-dark') {
      const grad = ctx.createLinearGradient(0, 0, 1200, 1500);
      grad.addColorStop(0, palette.bg);
      grad.addColorStop(0.5, palette.cardBg);
      grad.addColorStop(1, palette.bg);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1500);

      // Fine metallic ray lines
      ctx.save();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.07)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 1200; i += 75) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(1200 - i, 1500);
        ctx.stroke();
      }
      ctx.restore();
    } else if (state.template === 'colorful') {
      const grad = ctx.createLinearGradient(0, 0, 1200, 1500);
      grad.addColorStop(0, palette.bg);
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(1, palette.bg);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1500);

      // Soft decorative circles
      ctx.save();
      ctx.fillStyle = `${palette.accent}15`;
      ctx.beginPath();
      ctx.arc(150, 180, 220, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `${palette.secondary}12`;
      ctx.beginPath();
      ctx.arc(1050, 1320, 260, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (state.template === 'editorial') {
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, 1200, 1500);

      // Elegant parchment texture border lines
      ctx.strokeStyle = `${palette.accent}25`;
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 30, 1140, 1440);
    } else {
      // Minimal Blue
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, 1200, 1500);
    }

    // 2. Poster Outer Card / Inner Frame
    const margin = 48;
    const posterW = 1200 - (margin * 2);
    const posterH = 1500 - (margin * 2);

    if (state.template === 'luxury-dark') {
      drawRoundedRect(margin, margin, posterW, posterH, 24, palette.cardBg, palette.border, 4);
      drawRoundedRect(margin + 20, margin + 20, posterW - 40, posterH - 40, 16, null, 'rgba(212, 175, 55, 0.45)', 2);

      // Corner diamonds
      const corners = [
        [margin + 20, margin + 20],
        [margin + posterW - 20, margin + 20],
        [margin + 20, margin + posterH - 20],
        [margin + posterW - 20, margin + posterH - 20]
      ];
      ctx.fillStyle = palette.primary;
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Starburst top decoration
      ctx.font = '36px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦', 600, 125);
    } else if (state.template === 'colorful') {
      drawRoundedRect(margin, margin, posterW, posterH, 32, '#ffffff', palette.border, 5);
      drawRoundedRect(margin + 16, margin + 16, posterW - 32, posterH - 32, 24, null, `${palette.primary}25`, 2);
    } else if (state.template === 'editorial') {
      drawRoundedRect(margin, margin, posterW, posterH, 16, palette.cardBg, palette.border, 2);
      drawRoundedRect(margin + 18, margin + 18, posterW - 36, posterH - 36, 12, null, `${palette.accent}40`, 1.5);
    } else {
      // Minimal Blue
      drawRoundedRect(margin, margin, posterW, posterH, 24, '#ffffff', palette.border, 3);
      drawRoundedRect(margin + 16, margin + 16, posterW - 32, posterH - 32, 18, null, `${palette.primary}20`, 1.5);
    }

    // 3. Top Header Bar
    ctx.textAlign = 'center';

    // Kicker
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '5px';
    ctx.fillStyle = palette.accent;
    ctx.fillText(tplConfig.kicker, 600, 180);
    ctx.letterSpacing = '0px';

    // Poster Title
    const titleText = (state.title && state.title.trim()) ? state.title.trim() : 'LIFE IN NUMBERS';
    if (state.template === 'luxury-dark') {
      drawFitText(titleText, 600, 270, 960, 68, '"Cinzel", Georgia, serif', '800', palette.primary);
    } else if (state.template === 'editorial') {
      drawFitText(titleText, 600, 270, 960, 72, '"Playfair Display", Georgia, serif', '800', palette.primary);
    } else if (state.template === 'colorful') {
      drawFitText(titleText, 600, 270, 960, 68, '"Space Grotesk", sans-serif', '800', palette.primary);
    } else {
      drawFitText(titleText, 600, 270, 960, 68, '"Plus Jakarta Sans", sans-serif', '800', palette.primary);
    }

    // Subtitle (Name)
    const nameText = (state.name && state.name.trim()) ? `A Celebration of ${state.name.trim()}` : 'A Celebration of Life';
    if (state.template === 'editorial') {
      drawFitText(nameText, 600, 330, 880, 32, '"Playfair Display", Georgia, serif', 'italic 600', palette.secondary);
    } else {
      drawFitText(nameText, 600, 330, 880, 28, '"Plus Jakarta Sans", sans-serif', '600', palette.secondary);
    }

    // Decorative Horizontal Divider
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 375);
    ctx.lineTo(850, 375);
    ctx.stroke();

    // 4. Hero Age Section
    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillStyle = palette.accent;
    ctx.fillText('CHRONOLOGICAL AGE', 600, 425);
    ctx.letterSpacing = '0px';

    // Prominent Hero Years
    const yearsStr = String(metrics.years);
    if (state.template === 'luxury-dark') {
      ctx.font = '900 190px "Cinzel", Georgia, serif';
      ctx.fillStyle = palette.primary;
    } else if (state.template === 'editorial') {
      ctx.font = '800 200px "Playfair Display", Georgia, serif';
      ctx.fillStyle = palette.primary;
    } else if (state.template === 'colorful') {
      ctx.font = '800 200px "Space Grotesk", sans-serif';
      ctx.fillStyle = palette.primary;
    } else {
      ctx.font = '800 200px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = palette.primary;
    }
    ctx.fillText(yearsStr, 600, 610);

    // Units subtitle
    const unitsStr = `YEARS • ${metrics.months} MONTHS • ${metrics.days} DAYS`;
    ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = palette.secondary;
    ctx.fillText(unitsStr, 600, 675);
    ctx.letterSpacing = '0px';

    // 5. Highlight Strip (Next Birthday & Milestone)
    const stripY = 725;
    const stripW = 960;
    const stripH = 110;
    const stripX = 600 - (stripW / 2);

    drawRoundedRect(
      stripX,
      stripY,
      stripW,
      stripH,
      20,
      palette.statCardBg,
      palette.statCardBorder,
      2
    );

    // Left Item: Next Birthday
    const leftCenterX = stripX + (stripW / 4);
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = palette.accent;
    ctx.fillText('NEXT BIRTHDAY', leftCenterX, stripY + 42);
    ctx.letterSpacing = '0px';

    ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = palette.text;
    ctx.fillText(metrics.nextBdayText, leftCenterX, stripY + 84);

    // Divider Line
    ctx.strokeStyle = palette.statCardBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(600, stripY + 20);
    ctx.lineTo(600, stripY + stripH - 20);
    ctx.stroke();

    // Right Item: Next Milestone
    const rightCenterX = stripX + (3 * stripW / 4);
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = palette.accent;
    ctx.fillText('NEXT MILESTONE', rightCenterX, stripY + 42);
    ctx.letterSpacing = '0px';

    ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = palette.text;
    ctx.fillText(`${metrics.milestone.age}th Birthday`, rightCenterX, stripY + 84);

    // 6. Statistics Grid (4 Cards: 2 rows x 2 cols)
    const gridY = 875;
    const cardW = 465;
    const cardH = 180;
    const gapX = 30;
    const gapY = 24;

    const col1X = 600 - (stripW / 2);
    const col2X = col1X + cardW + gapX;

    const row1Y = gridY;
    const row2Y = gridY + cardH + gapY;

    const statItems = [
      { num: formatNumber(metrics.totalDays), label: 'DAYS LIVED', x: col1X, y: row1Y },
      { num: formatNumber(metrics.totalWeeks), label: 'WEEKS ON EARTH', x: col2X, y: row1Y },
      { num: `${metrics.zodiac.name} ${metrics.zodiac.symbol}`, label: 'ZODIAC SIGN', x: col1X, y: row2Y },
      { num: `In ~${metrics.milestone.diffYears} Yrs`, label: `TO ${metrics.milestone.age}TH MILESTONE`, x: col2X, y: row2Y }
    ];

    statItems.forEach(item => {
      drawRoundedRect(
        item.x,
        item.y,
        cardW,
        cardH,
        20,
        palette.statCardBg,
        palette.statCardBorder,
        1.5
      );

      const cx = item.x + (cardW / 2);

      // Stat Value
      ctx.fillStyle = palette.primary;
      drawFitText(item.num, cx, item.y + 85, cardW - 40, 48, '"Plus Jakarta Sans", sans-serif', '800', palette.primary);

      // Stat Label
      ctx.font = '700 17px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillStyle = palette.accent;
      ctx.fillText(item.label, cx, item.y + 130);
      ctx.letterSpacing = '0px';
    });

    // 7. Footer Stamp & Brand
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = state.template === 'luxury-dark' ? 'rgba(212, 175, 55, 0.7)' : 'rgba(100, 116, 139, 0.85)';
    ctx.fillText(`Born ${metrics.formattedBirthDate} • myagenow.today`, 600, 1360);

    return canvas;
  }

  // --- Download PNG Action ---
  if (downloadPosterPngBtn) {
    downloadPosterPngBtn.addEventListener('click', function () {
      const canvas = renderPosterToCanvas();
      if (!canvas) {
        showPosterError('Please check your date of birth input.');
        return;
      }

      const cleanName = (state.name || 'personal').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `myagenow-age-poster-${cleanName}.png`;

      canvas.toBlob(function (blob) {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        // Visual feedback
        const origNodes = Array.from(downloadPosterPngBtn.childNodes).map(n => n.cloneNode(true));
        const origLabel = downloadPosterPngBtn.getAttribute('aria-label') || 'Download high-res PNG';

        downloadPosterPngBtn.textContent = '✓ Poster Downloaded!';
        downloadPosterPngBtn.classList.add('is-success');
        if (posterActionStatus) posterActionStatus.textContent = 'High-resolution age poster PNG downloaded';

        setTimeout(() => {
          downloadPosterPngBtn.replaceChildren(...origNodes);
          downloadPosterPngBtn.setAttribute('aria-label', origLabel);
          downloadPosterPngBtn.classList.remove('is-success');
          if (posterActionStatus) posterActionStatus.textContent = '';
        }, 2500);
      }, 'image/png');
    });
  }

  // --- Share Poster Action ---
  if (sharePosterBtn) {
    sharePosterBtn.addEventListener('click', function () {
      const canvas = renderPosterToCanvas();
      if (!canvas) {
        showPosterError('Please check your date of birth input.');
        return;
      }

      const cleanName = (state.name || 'personal').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `myagenow-age-poster-${cleanName}.png`;

      canvas.toBlob(function (blob) {
        if (!blob) return;

        const file = new File([blob], filename, { type: 'image/png' });
        const shareTitle = `${state.title || 'Life in Numbers'} - ${state.name || 'Age Poster'}`;
        const shareText = `Check out my personal age poster generated on MyAgeNow!`;

        if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
          navigator.share({
            title: shareTitle,
            text: shareText,
            files: [file]
          }).catch(() => {});
        } else if (navigator.share) {
          navigator.share({
            title: shareTitle,
            text: shareText,
            url: window.location.href
          }).catch(() => {});
        } else {
          // Graceful fallback: trigger download
          if (downloadPosterPngBtn) downloadPosterPngBtn.click();
        }
      }, 'image/png');
    });
  }

  // Initial load from URL and initial render
  loadStateFromURL();
  renderColorPalettes();
  updatePosterPreview();
});
