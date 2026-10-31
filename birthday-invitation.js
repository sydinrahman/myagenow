/**
 * Birthday Invitation Maker - Client-Side Interactive Engine
 * Provides real-time preview updates, 4 original templates (Elegant, Celebration, Minimal, Luxury),
 * 3 curated color palettes per template, 5 message presets, ordinal age formatting,
 * 1200x1500px Canvas 2D PNG export, and Web Share API / clipboard integration.
 */

document.addEventListener('DOMContentLoaded', function () {
  // --- Form & Input Elements ---
  const personNameInput = document.getElementById('person-name');
  const personAgeInput = document.getElementById('person-age');
  const eventDateInput = document.getElementById('event-date');
  const eventTimeInput = document.getElementById('event-time');
  const eventVenueInput = document.getElementById('event-venue');
  const invitationMessageInput = document.getElementById('invitation-message');
  const rsvpInfoInput = document.getElementById('rsvp-info');
  const inviteResetBtn = document.getElementById('invite-reset-btn');
  const charCounter = document.getElementById('char-counter');
  const colorPaletteContainer = document.getElementById('color-palette-container');

  // --- Live Invitation Preview DOM Elements ---
  const invitationRender = document.getElementById('birthday-invitation-render');
  const cardDecorations = document.getElementById('card-decorations');
  const inviteTaglineVal = document.getElementById('invite-tagline-val');
  const inviteHeadlineVal = document.getElementById('invite-headline-val');
  const invitePrefixVal = document.getElementById('invite-prefix-val');
  const invitePersonVal = document.getElementById('invite-person-val');
  const inviteAgeBannerVal = document.getElementById('invite-age-banner-val');

  const detailDateWrap = document.getElementById('detail-date-wrap');
  const inviteDateVal = document.getElementById('invite-date-val');
  const detailTimeWrap = document.getElementById('detail-time-wrap');
  const inviteTimeVal = document.getElementById('invite-time-val');
  const detailVenueWrap = document.getElementById('detail-venue-wrap');
  const inviteVenueVal = document.getElementById('invite-venue-val');

  const inviteMessageBox = document.getElementById('invite-message-box');
  const inviteMessageVal = document.getElementById('invite-message-val');
  const inviteRsvpBox = document.getElementById('invite-rsvp-box');
  const inviteRsvpVal = document.getElementById('invite-rsvp-val');

  // --- Action Buttons ---
  const downloadPngBtn = document.getElementById('download-png-btn');
  const shareInviteBtn = document.getElementById('share-invite-btn');
  const copyInviteTextBtn = document.getElementById('copy-invite-text-btn');
  const printInviteBtn = document.getElementById('print-invite-btn');
  const inviteActionStatus = document.getElementById('invite-action-status');

  // --- Template Radio Buttons & Presets ---
  const templateButtons = document.querySelectorAll('.template-option');
  const presetButtons = document.querySelectorAll('.preset-btn');

  // --- Ordinal Suffix Helper ---
  function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  // --- Templates & Palettes Configuration ---
  const TEMPLATE_CONFIG = {
    elegant: {
      name: 'Elegant',
      tagline: "YOU'RE CORDIALLY INVITED",
      defaultHeadline: 'Celebrate With Us',
      fontHeading: "'Playfair Display', Georgia, serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      decorations: 'elegant-floral',
      palettes: [
        { id: 'rose', label: 'Dusty Rose & Blush', primary: '#8b4d63', secondary: '#b57388', bg: '#fdf8f8', cardBg: '#ffffff', border: '#eedad7', accent: '#c48b71', text: '#3c252d' },
        { id: 'sage', label: 'Earthy Sage & Gold', primary: '#2d4d3d', secondary: '#4e7560', bg: '#f9faf7', cardBg: '#ffffff', border: '#d9e2db', accent: '#bfa15f', text: '#213328' },
        { id: 'lavender', label: 'Soft Lavender Mist', primary: '#604e82', secondary: '#816da6', bg: '#f8f7fb', cardBg: '#ffffff', border: '#e3dff0', accent: '#a288cd', text: '#2a2238' }
      ]
    },
    celebration: {
      name: 'Celebration',
      tagline: "IT'S TIME TO PARTY! 🎈",
      defaultHeadline: "Let's Celebrate!",
      fontHeading: "'Plus Jakarta Sans', sans-serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      decorations: 'celebration-festive',
      palettes: [
        { id: 'festive', label: 'Festive Fiesta', primary: '#e11d48', secondary: '#ea580c', bg: '#fffbeb', cardBg: '#ffffff', border: '#fed7aa', accent: '#0284c7', text: '#0f172a' },
        { id: 'electric', label: 'Electric Blue & Coral', primary: '#2563eb', secondary: '#06b6d4', bg: '#eff6ff', cardBg: '#ffffff', border: '#bfdbfe', accent: '#f43f5e', text: '#0f172a' },
        { id: 'carnival', label: 'Carnival Pop', primary: '#7c3aed', secondary: '#db2777', bg: '#faf5ff', cardBg: '#ffffff', border: '#f0abfc', accent: '#eab308', text: '#1e1b4b' }
      ]
    },
    minimal: {
      name: 'Minimal',
      tagline: 'SAVE THE DATE',
      defaultHeadline: 'Birthday Gathering',
      fontHeading: "'Plus Jakarta Sans', sans-serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      decorations: 'minimal-lines',
      palettes: [
        { id: 'slate', label: 'Modern Slate', primary: '#0f172a', secondary: '#334155', bg: '#f8fafc', cardBg: '#ffffff', border: '#cbd5e1', accent: '#64748b', text: '#1e293b' },
        { id: 'warm', label: 'Warm Oat & Clay', primary: '#443b35', secondary: '#6b5e54', bg: '#faf7f2', cardBg: '#ffffff', border: '#e8e0d5', accent: '#b08968', text: '#2b2520' },
        { id: 'olive', label: 'Nordic Olive', primary: '#283618', secondary: '#475b2e', bg: '#f7f8f4', cardBg: '#ffffff', border: '#d4dcce', accent: '#606c38', text: '#1f2a13' }
      ]
    },
    luxury: {
      name: 'Luxury',
      tagline: 'AN EXCLUSIVE EVENING',
      defaultHeadline: 'CELEBRATION OF A LIFETIME',
      fontHeading: "'Cinzel', Georgia, serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      decorations: 'luxury-gold',
      palettes: [
        { id: 'noir', label: 'Royal Noir & Gold', primary: '#d4af37', secondary: '#f5e6a8', bg: '#0b0f17', cardBg: '#121824', border: '#d4af37', accent: '#b38f28', text: '#f8fafc' },
        { id: 'emerald', label: 'Emerald Royale', primary: '#e2ba59', secondary: '#f8f0cc', bg: '#071d15', cardBg: '#0e2c22', border: '#cba03b', accent: '#10b981', text: '#f1f5f9' },
        { id: 'midnight', label: 'Midnight Sapphire', primary: '#dfbe68', secondary: '#fdf6dc', bg: '#091322', cardBg: '#11223b', border: '#d4af37', accent: '#38bdf8', text: '#f8fafc' }
      ]
    }
  };

  // --- Message Presets Dictionary (5 Presets requested) ---
  const MESSAGE_PRESETS = {
    standard: "Join us for music, delicious food, drinks, and unforgettable memories as we celebrate Sophia's birthday!",
    surprise: "Shhh... It's a surprise party! Please arrive promptly 15 minutes before the guest of honor arrives so we can shout SURPRISE together!",
    milestone: "A milestone worth celebrating! Join us for an extraordinary evening of cheers, cocktails, dinner, and great company.",
    casual: "Let's hang out, grab some drinks, and celebrate! Good times, casual vibes, and great laughs guaranteed.",
    dinner: "Please join us for a celebratory birthday dinner and drinks as we raise a toast to another fabulous year ahead!"
  };

  // State Management
  const state = {
    personName: 'Sophia',
    age: '30',
    eventDate: '2026-10-24',
    eventTime: '6:00 PM onwards',
    eventVenue: 'The Rose Garden Rooftop, 452 Grand Avenue',
    template: 'elegant',
    colorId: 'rose',
    message: "Join us for music, delicious food, drinks, and unforgettable memories as we celebrate Sophia's 30th birthday!",
    rsvp: 'RSVP by October 12th to Alex at 555-0199'
  };

  // Helper date formatter
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function parseISODate(isoStr) {
    if (!isoStr || typeof isoStr !== 'string') return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoStr.trim())) return null;
    const parts = isoStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
      return d;
    }
    return null;
  }

  function formatDisplayDate(dateObj) {
    if (!dateObj) return '';
    const dayName = DAY_NAMES[dateObj.getDay()];
    const monthName = MONTH_NAMES[dateObj.getMonth()];
    const dateNum = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${dayName}, ${monthName} ${dateNum}, ${year}`;
  }

  // Render Color Palette Selector
  function renderColorPalettes() {
    if (!colorPaletteContainer) return;
    colorPaletteContainer.replaceChildren();

    const tplConfig = TEMPLATE_CONFIG[state.template];
    if (!tplConfig || !tplConfig.palettes) return;

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
        updateInvitationPreview();
      });

      colorPaletteContainer.appendChild(btn);
    });
  }

  function updatePaletteSelectionUI() {
    if (!colorPaletteContainer) return;
    const buttons = colorPaletteContainer.querySelectorAll('.color-swatch-btn');
    buttons.forEach(btn => {
      const isSelected = btn.getAttribute('data-color') === state.colorId;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-checked', String(isSelected));
    });
  }

  // Update Decorations Layer in DOM
  function updateDecorationsDOM(templateKey) {
    if (!cardDecorations) return;
    cardDecorations.replaceChildren();

    if (templateKey === 'celebration') {
      const icons = ['🎈', '🎉', '✨', '⭐', '🎊', '🎈', '🍰', '✨'];
      icons.forEach((ic, idx) => {
        const span = document.createElement('span');
        span.className = `confetti-particle confetti-${idx + 1}`;
        span.textContent = ic;
        cardDecorations.appendChild(span);
      });
    } else if (templateKey === 'luxury') {
      ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(corner => {
        const cornerDiv = document.createElement('div');
        cornerDiv.className = `luxury-corner luxury-corner-${corner}`;
        cardDecorations.appendChild(cornerDiv);
      });
      const star = document.createElement('div');
      star.className = 'luxury-star-burst';
      star.textContent = '✦';
      cardDecorations.appendChild(star);
    } else if (templateKey === 'elegant') {
      const floralTop = document.createElement('div');
      floralTop.className = 'botanical-wreath top-wreath';
      floralTop.textContent = '🌸 ❀ 🌸';
      const floralBottom = document.createElement('div');
      floralBottom.className = 'botanical-wreath bottom-wreath';
      floralBottom.textContent = '🌸 ❀ 🌸';
      cardDecorations.appendChild(floralTop);
      cardDecorations.appendChild(floralBottom);
    } else if (templateKey === 'minimal') {
      const lineTop = document.createElement('div');
      lineTop.className = 'minimal-divider-line line-top';
      const lineBottom = document.createElement('div');
      lineBottom.className = 'minimal-divider-line line-bottom';
      cardDecorations.appendChild(lineTop);
      cardDecorations.appendChild(lineBottom);
    }
  }

  // Compute Headline & Subtitle based on Age requirement:
  // "If age is provided: format as '30th Birthday'. If empty: display 'You're Invited to [Name]'s Birthday'."
  function getHeadlineInfo() {
    const rawName = (state.personName || 'Guest of Honor').trim();
    const rawAge = state.age ? parseInt(state.age, 10) : null;
    const hasValidAge = rawAge && !isNaN(rawAge) && rawAge > 0;

    if (hasValidAge) {
      return {
        prefix: 'in honor of',
        ageText: `${getOrdinal(rawAge)} Birthday`,
        headline: `${getOrdinal(rawAge)} Birthday`,
        titleText: rawName
      };
    } else {
      return {
        prefix: "you're invited to celebrate",
        ageText: '',
        headline: `${rawName}'s Birthday`,
        titleText: rawName
      };
    }
  }

  // Main Live Preview Synchronizer
  function updateInvitationPreview() {
    if (!invitationRender) return;

    const tplConfig = TEMPLATE_CONFIG[state.template];
    const currentPalette = tplConfig.palettes.find(p => p.id === state.colorId) || tplConfig.palettes[0];

    invitationRender.className = `birthday-card birthday-invitation template-${state.template} theme-${state.colorId}`;

    invitationRender.style.setProperty('--card-primary', currentPalette.primary);
    invitationRender.style.setProperty('--card-secondary', currentPalette.secondary);
    invitationRender.style.setProperty('--card-bg-color', currentPalette.cardBg);
    invitationRender.style.setProperty('--card-border-color', currentPalette.border);
    invitationRender.style.setProperty('--card-accent-color', currentPalette.accent);
    invitationRender.style.setProperty('--card-text-color', currentPalette.text);

    // Tagline
    if (inviteTaglineVal) {
      inviteTaglineVal.textContent = tplConfig.tagline;
    }

    // Headline and Age banner
    const headlineInfo = getHeadlineInfo();

    if (inviteHeadlineVal) {
      if (state.age && parseInt(state.age, 10) > 0) {
        inviteHeadlineVal.textContent = headlineInfo.ageText;
      } else {
        inviteHeadlineVal.textContent = tplConfig.defaultHeadline;
      }
      inviteHeadlineVal.style.fontFamily = tplConfig.fontHeading;
    }

    if (invitePrefixVal) {
      invitePrefixVal.textContent = headlineInfo.prefix;
    }

    if (invitePersonVal) {
      invitePersonVal.textContent = (state.personName || 'Guest of Honor').trim();
      invitePersonVal.style.fontFamily = tplConfig.fontHeading;
    }

    if (inviteAgeBannerVal) {
      if (headlineInfo.ageText && headlineInfo.ageText !== inviteHeadlineVal.textContent) {
        inviteAgeBannerVal.textContent = `★ ${headlineInfo.ageText} ★`;
        inviteAgeBannerVal.classList.remove('hidden');
      } else {
        inviteAgeBannerVal.classList.add('hidden');
        inviteAgeBannerVal.textContent = '';
      }
    }

    // Date
    const parsedDate = parseISODate(state.eventDate);
    if (parsedDate && inviteDateVal && detailDateWrap) {
      inviteDateVal.textContent = formatDisplayDate(parsedDate);
      detailDateWrap.classList.remove('hidden');
    } else if (detailDateWrap) {
      detailDateWrap.classList.add('hidden');
    }

    // Time
    if (state.eventTime && state.eventTime.trim() && inviteTimeVal && detailTimeWrap) {
      inviteTimeVal.textContent = state.eventTime.trim();
      detailTimeWrap.classList.remove('hidden');
    } else if (detailTimeWrap) {
      detailTimeWrap.classList.add('hidden');
    }

    // Venue
    if (state.eventVenue && state.eventVenue.trim() && inviteVenueVal && detailVenueWrap) {
      inviteVenueVal.textContent = state.eventVenue.trim();
      detailVenueWrap.classList.remove('hidden');
    } else if (detailVenueWrap) {
      detailVenueWrap.classList.add('hidden');
    }

    // Message
    if (inviteMessageBox && inviteMessageVal) {
      if (state.message && state.message.trim()) {
        inviteMessageVal.textContent = state.message.trim();
        inviteMessageBox.classList.remove('hidden');
      } else {
        inviteMessageBox.classList.add('hidden');
      }
    }

    // RSVP
    if (inviteRsvpBox && inviteRsvpVal) {
      if (state.rsvp && state.rsvp.trim()) {
        inviteRsvpVal.textContent = state.rsvp.trim();
        inviteRsvpBox.classList.remove('hidden');
      } else {
        inviteRsvpBox.classList.add('hidden');
      }
    }

    // Decorations
    updateDecorationsDOM(state.template);

    // Counter
    if (charCounter && invitationMessageInput) {
      charCounter.textContent = `${invitationMessageInput.value.length} / 280`;
    }
  }

  // --- Input Event Listeners ---
  if (personNameInput) {
    personNameInput.addEventListener('input', function () {
      state.personName = personNameInput.value;
      updateInvitationPreview();
    });
  }

  if (personAgeInput) {
    personAgeInput.addEventListener('input', function () {
      state.age = personAgeInput.value;
      updateInvitationPreview();
    });
  }

  if (eventDateInput) {
    // Default to a date in future if empty
    eventDateInput.value = state.eventDate;
    eventDateInput.addEventListener('input', function () {
      state.eventDate = eventDateInput.value;
      updateInvitationPreview();
    });
  }

  if (eventTimeInput) {
    eventTimeInput.addEventListener('input', function () {
      state.eventTime = eventTimeInput.value;
      updateInvitationPreview();
    });
  }

  if (eventVenueInput) {
    eventVenueInput.addEventListener('input', function () {
      state.eventVenue = eventVenueInput.value;
      updateInvitationPreview();
    });
  }

  if (invitationMessageInput) {
    invitationMessageInput.addEventListener('input', function () {
      state.message = invitationMessageInput.value;
      updateInvitationPreview();
    });
  }

  if (rsvpInfoInput) {
    rsvpInfoInput.addEventListener('input', function () {
      state.rsvp = rsvpInfoInput.value;
      updateInvitationPreview();
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
      updateInvitationPreview();
    });
  });

  // Message Presets Click Handling
  presetButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const presetKey = btn.getAttribute('data-preset');
      if (presetKey && MESSAGE_PRESETS[presetKey]) {
        let msg = MESSAGE_PRESETS[presetKey];
        // Inject current name and age if applicable
        const name = (state.personName || 'Sophia').trim();
        msg = msg.replace(/Sophia/g, name);
        state.message = msg;
        if (invitationMessageInput) {
          invitationMessageInput.value = state.message;
          invitationMessageInput.focus();
        }
        updateInvitationPreview();
      }
    });
  });

  // Reset Button
  if (inviteResetBtn) {
    inviteResetBtn.addEventListener('click', function () {
      state.personName = 'Sophia';
      state.age = '30';
      state.eventDate = '2026-10-24';
      state.eventTime = '6:00 PM onwards';
      state.eventVenue = 'The Rose Garden Rooftop, 452 Grand Avenue';
      state.template = 'elegant';
      state.colorId = 'rose';
      state.message = "Join us for music, delicious food, drinks, and unforgettable memories as we celebrate Sophia's 30th birthday!";
      state.rsvp = 'RSVP by October 12th to Alex at 555-0199';

      if (personNameInput) personNameInput.value = state.personName;
      if (personAgeInput) personAgeInput.value = state.age;
      if (eventDateInput) eventDateInput.value = state.eventDate;
      if (eventTimeInput) eventTimeInput.value = state.eventTime;
      if (eventVenueInput) eventVenueInput.value = state.eventVenue;
      if (invitationMessageInput) invitationMessageInput.value = state.message;
      if (rsvpInfoInput) rsvpInfoInput.value = state.rsvp;

      templateButtons.forEach(b => {
        const isEligible = b.getAttribute('data-template') === 'elegant';
        b.classList.toggle('active', isEligible);
        b.setAttribute('aria-checked', String(isEligible));
      });

      renderColorPalettes();
      updateInvitationPreview();
      if (personNameInput) personNameInput.focus();
    });
  }

  // Print Invitation
  if (printInviteBtn) {
    printInviteBtn.addEventListener('click', function () {
      window.print();
    });
  }

  // Formatted Plain Text Builder
  function buildPlainTextInvitation() {
    const name = (state.personName || 'Guest of Honor').trim();
    const ageNum = state.age ? parseInt(state.age, 10) : null;
    const titleLine = ageNum && ageNum > 0
      ? `🎉 YOU'RE INVITED TO ${name.toUpperCase()}'S ${getOrdinal(ageNum).toUpperCase()} BIRTHDAY! 🎉`
      : `🎉 YOU'RE INVITED TO CELEBRATE ${name.toUpperCase()}'S BIRTHDAY! 🎉`;

    const lines = [titleLine, ''];

    const dateObj = parseISODate(state.eventDate);
    if (dateObj) {
      lines.push(`📅 Date: ${formatDisplayDate(dateObj)}`);
    }
    if (state.eventTime && state.eventTime.trim()) {
      lines.push(`⏰ Time: ${state.eventTime.trim()}`);
    }
    if (state.eventVenue && state.eventVenue.trim()) {
      lines.push(`📍 Venue: ${state.eventVenue.trim()}`);
    }

    if (state.message && state.message.trim()) {
      lines.push('');
      lines.push(`💬 ${state.message.trim()}`);
    }

    if (state.rsvp && state.rsvp.trim()) {
      lines.push('');
      lines.push(`✉️ ${state.rsvp.trim()}`);
    }

    lines.push('');
    lines.push('Created with https://myagenow.today/birthday-invitation-maker.html');

    return lines.join('\n');
  }

  // Copy Plain Text to Clipboard
  if (copyInviteTextBtn) {
    copyInviteTextBtn.addEventListener('click', function () {
      const textToCopy = buildPlainTextInvitation();
      navigator.clipboard.writeText(textToCopy).then(() => {
        const origNodes = Array.from(copyInviteTextBtn.childNodes).map(n => n.cloneNode(true));
        const origLabel = copyInviteTextBtn.getAttribute('aria-label') || 'Copy text';

        copyInviteTextBtn.textContent = '✓ Text Copied!';
        copyInviteTextBtn.classList.add('is-success');
        if (inviteActionStatus) inviteActionStatus.textContent = 'Invitation details copied to clipboard';

        setTimeout(() => {
          copyInviteTextBtn.replaceChildren(...origNodes);
          copyInviteTextBtn.setAttribute('aria-label', origLabel);
          copyInviteTextBtn.classList.remove('is-success');
          if (inviteActionStatus) inviteActionStatus.textContent = '';
        }, 2200);
      }).catch(() => {
        alert('Could not copy invitation text to clipboard.');
      });
    });
  }

  // --- High-Resolution 1200×1500 Canvas Renderer ---
  function renderInvitationToCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const tplConfig = TEMPLATE_CONFIG[state.template];
    const palette = tplConfig.palettes.find(p => p.id === state.colorId) || tplConfig.palettes[0];

    // Helpers
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

    function drawWrappedText(text, x, startY, maxWidth, lineHeight, font, fillStyle, align = 'center') {
      ctx.font = font;
      ctx.fillStyle = fillStyle;
      ctx.textAlign = align;

      const words = text.split(' ');
      let line = '';
      const lines = [];

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line.trim());
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());

      lines.forEach((l, idx) => {
        ctx.fillText(l, x, startY + (idx * lineHeight));
      });
      return lines.length * lineHeight;
    }

    // 1. Background
    if (state.template === 'luxury') {
      const grad = ctx.createLinearGradient(0, 0, 1200, 1500);
      grad.addColorStop(0, palette.bg);
      grad.addColorStop(0.5, palette.cardBg);
      grad.addColorStop(1, palette.bg);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1500);

      // Subtle metallic mesh
      ctx.save();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
      ctx.lineWidth = 1.5;
      for (let r = 0; r < 1200; r += 60) {
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(1200 - r, 1500);
        ctx.stroke();
      }
      ctx.restore();
    } else if (state.template === 'celebration') {
      const grad = ctx.createLinearGradient(0, 0, 1200, 1500);
      grad.addColorStop(0, palette.bg);
      grad.addColorStop(1, '#ffffff');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1500);
    } else {
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, 1200, 1500);
    }

    // 2. Inner Frame
    const margin = 50;
    const cardW = 1200 - (margin * 2);
    const cardH = 1500 - (margin * 2);

    if (state.template === 'luxury') {
      drawRoundedRect(margin, margin, cardW, cardH, 24, palette.cardBg, palette.border, 4);
      drawRoundedRect(margin + 24, margin + 24, cardW - 48, cardH - 48, 16, null, 'rgba(212, 175, 55, 0.45)', 2);

      const corners = [
        [margin + 24, margin + 24],
        [margin + cardW - 24, margin + 24],
        [margin + 24, margin + cardH - 24],
        [margin + cardW - 24, margin + cardH - 24]
      ];
      ctx.fillStyle = palette.primary;
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (state.template === 'celebration') {
      drawRoundedRect(margin, margin, cardW, cardH, 32, '#ffffff', palette.border, 6);
      drawRoundedRect(margin + 16, margin + 16, cardW - 32, cardH - 32, 24, null, 'rgba(225, 29, 72, 0.15)', 2);
    } else if (state.template === 'minimal') {
      drawRoundedRect(margin, margin, cardW, cardH, 16, palette.cardBg, palette.border, 2);
    } else {
      // Elegant
      drawRoundedRect(margin, margin, cardW, cardH, 20, palette.cardBg, palette.border, 2.5);
      drawRoundedRect(margin + 20, margin + 20, cardW - 40, cardH - 40, 14, null, 'rgba(196, 139, 113, 0.35)', 1.5);
    }

    // 3. Template Visual Decorations
    ctx.textAlign = 'center';
    if (state.template === 'celebration') {
      const emojis = [
        { t: '🎈', x: 130, y: 160, s: 64 },
        { t: '🎉', x: 1070, y: 170, s: 60 },
        { t: '✨', x: 200, y: 320, s: 44 },
        { t: '⭐', x: 1000, y: 330, s: 44 },
        { t: '🎁', x: 140, y: 1320, s: 58 },
        { t: '🎈', x: 1060, y: 1310, s: 64 },
        { t: '🎊', x: 280, y: 1380, s: 48 },
        { t: '🍰', x: 920, y: 1380, s: 48 }
      ];
      emojis.forEach(e => {
        ctx.font = `${e.s}px sans-serif`;
        ctx.fillText(e.t, e.x, e.y);
      });
    } else if (state.template === 'luxury') {
      ctx.font = '52px "Cinzel", Georgia, serif';
      ctx.fillStyle = palette.primary;
      ctx.fillText('✦  ✦  ✦', 600, 180);
      ctx.fillText('✦  ✦  ✦', 600, 1370);
    } else if (state.template === 'elegant') {
      ctx.font = '32px "Playfair Display", Georgia, serif';
      ctx.fillStyle = palette.accent;
      ctx.fillText('🌸  ❀  🌸', 600, 185);
      ctx.fillText('🌸  ❀  🌸', 600, 1370);
    } else {
      // Minimal
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(480, 180);
      ctx.lineTo(720, 180);
      ctx.stroke();
    }

    // 4. Tagline
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '5px';
    ctx.fillStyle = palette.accent;
    ctx.fillText(tplConfig.tagline, 600, 245);
    ctx.letterSpacing = '0px';

    // 5. Headline / Event Occasion
    const rawAge = state.age ? parseInt(state.age, 10) : null;
    const hasValidAge = rawAge && !isNaN(rawAge) && rawAge > 0;
    const headlineText = hasValidAge
      ? `${getOrdinal(rawAge)} Birthday`
      : tplConfig.defaultHeadline;

    if (state.template === 'luxury') {
      ctx.font = '800 68px "Cinzel", Georgia, serif';
      ctx.fillStyle = palette.primary;
    } else if (state.template === 'elegant') {
      ctx.font = 'italic 700 76px "Playfair Display", Georgia, serif';
      ctx.fillStyle = palette.primary;
    } else {
      ctx.font = '800 72px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = palette.primary;
    }
    ctx.fillText(headlineText, 600, 340);

    // 6. "in honor of" prefix
    ctx.font = 'italic 500 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = palette.accent;
    ctx.fillText(hasValidAge ? 'in honor of' : "you're invited to celebrate", 600, 395);

    // 7. Person's Name
    const cleanName = (state.personName || 'Guest of Honor').trim();
    if (state.template === 'luxury') {
      ctx.font = '800 86px "Cinzel", Georgia, serif';
      ctx.fillStyle = palette.secondary;
    } else if (state.template === 'elegant') {
      ctx.font = '700 90px "Playfair Display", Georgia, serif';
      ctx.fillStyle = palette.secondary;
    } else {
      ctx.font = '800 84px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = palette.secondary;
    }
    ctx.fillText(cleanName, 600, 485);

    // 8. Event Details Box (Date, Time, Venue)
    let currentY = 550;

    // Outer card pill for details
    const detailsBg = state.template === 'luxury' ? 'rgba(212, 175, 55, 0.08)' : 'rgba(15, 23, 42, 0.03)';
    drawRoundedRect(180, currentY, 840, 310, 24, detailsBg, palette.border, 1.5);

    currentY += 60;

    const parsedDate = parseISODate(state.eventDate);
    if (parsedDate) {
      ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = palette.primary;
      ctx.fillText(`📅  ${formatDisplayDate(parsedDate)}`, 600, currentY);
      currentY += 50;
    }

    if (state.eventTime && state.eventTime.trim()) {
      ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = palette.text;
      ctx.fillText(`⏰  ${state.eventTime.trim()}`, 600, currentY);
      currentY += 50;
    }

    if (state.eventVenue && state.eventVenue.trim()) {
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = palette.text;
      ctx.fillText(`📍  ${state.eventVenue.trim()}`, 600, currentY);
      currentY += 40;
    }

    // 9. Custom Invitation Message
    currentY = 930;
    if (state.message && state.message.trim()) {
      drawWrappedText(
        state.message.trim(),
        600,
        currentY,
        820,
        44,
        '500 28px "Plus Jakarta Sans", sans-serif',
        palette.text,
        'center'
      );
    }

    // 10. RSVP Section
    if (state.rsvp && state.rsvp.trim()) {
      drawRoundedRect(220, 1160, 760, 68, 34, state.template === 'luxury' ? 'rgba(212, 175, 55, 0.14)' : 'rgba(37, 99, 235, 0.06)', palette.accent, 1.5);
      ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = palette.primary;
      ctx.fillText(`✉️  ${state.rsvp.trim()}`, 600, 1204);
    }

    // 11. Watermark
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = state.template === 'luxury' ? 'rgba(212, 175, 55, 0.65)' : 'rgba(100, 116, 139, 0.7)';
    ctx.fillText('myagenow.today', 600, 1425);

    return canvas;
  }

  // --- Download PNG Action ---
  if (downloadPngBtn) {
    downloadPngBtn.addEventListener('click', function () {
      const canvas = renderInvitationToCanvas();
      if (!canvas) return;

      const safeName = (state.personName || 'birthday').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `myagenow-birthday-invitation-${safeName}.png`;

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

        const origNodes = Array.from(downloadPngBtn.childNodes).map(n => n.cloneNode(true));
        const origLabel = downloadPngBtn.getAttribute('aria-label') || 'Download PNG';

        downloadPngBtn.textContent = '✓ Invitation Downloaded!';
        downloadPngBtn.classList.add('is-success');
        if (inviteActionStatus) inviteActionStatus.textContent = 'High-resolution invitation PNG downloaded';

        setTimeout(() => {
          downloadPngBtn.replaceChildren(...origNodes);
          downloadPngBtn.setAttribute('aria-label', origLabel);
          downloadPngBtn.classList.remove('is-success');
          if (inviteActionStatus) inviteActionStatus.textContent = '';
        }, 2500);
      }, 'image/png');
    });
  }

  // --- Share Invitation Action ---
  if (shareInviteBtn) {
    shareInviteBtn.addEventListener('click', function () {
      const canvas = renderInvitationToCanvas();
      if (!canvas) return;

      const safeName = (state.personName || 'birthday').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `myagenow-birthday-invitation-${safeName}.png`;

      canvas.toBlob(function (blob) {
        if (!blob) return;

        const file = new File([blob], filename, { type: 'image/png' });
        const shareTitle = `Birthday Invitation for ${state.personName}!`;
        const shareText = buildPlainTextInvitation();

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
          if (downloadPngBtn) downloadPngBtn.click();
        }
      }, 'image/png');
    });
  }

  // Initial render on page load
  renderColorPalettes();
  updateInvitationPreview();
});
