/**
 * Birthday Card Generator - Client-Side Interactive Engine
 * Provides real-time preview updates, 4 templates, 3 color palettes per template,
 * message presets, age calculation, high-resolution Canvas 2D export, and sharing.
 */

document.addEventListener('DOMContentLoaded', function () {
  // --- Form & Input Elements ---
  const recipientInput = document.getElementById('recipient-name');
  const bdayDateInput = document.getElementById('birthday-date');
  const showAgeToggle = document.getElementById('show-age-toggle');
  const bdayMessageInput = document.getElementById('birthday-message');
  const senderNameInput = document.getElementById('sender-name');
  const cardResetBtn = document.getElementById('card-reset-btn');
  const charCounter = document.getElementById('char-counter');
  const ageCalcPreview = document.getElementById('age-calc-preview');
  const calculatedAgeText = document.getElementById('calculated-age-text');
  const colorPaletteContainer = document.getElementById('color-palette-container');

  // --- Live Card Preview DOM Elements ---
  const birthdayCardRender = document.getElementById('birthday-card-render');
  const cardDecorations = document.getElementById('card-decorations');
  const cardTaglineVal = document.getElementById('card-tagline-val');
  const cardRecipientVal = document.getElementById('card-recipient-val');
  const cardDateBadgeVal = document.getElementById('card-date-badge-val');
  const cardAgeBadgeVal = document.getElementById('card-age-badge-val');
  const cardMessageVal = document.getElementById('card-message-val');
  const cardSenderVal = document.getElementById('card-sender-val');

  // --- Action Buttons ---
  const downloadPngBtn = document.getElementById('download-png-btn');
  const shareCardBtn = document.getElementById('share-card-btn');
  const copyCardMsgBtn = document.getElementById('copy-card-msg-btn');
  const printCardBtn = document.getElementById('print-card-btn');
  const cardActionStatus = document.getElementById('card-action-status');

  // --- Template Radio Buttons ---
  const templateButtons = document.querySelectorAll('.template-option');
  const presetButtons = document.querySelectorAll('.preset-btn');

  // --- Templates & Palettes Configuration ---
  const TEMPLATE_CONFIG = {
    minimal: {
      name: 'Minimal & Elegant',
      tagline: 'CELEBRATING A SPECIAL DAY',
      headline: 'Happy Birthday',
      fontHeading: "'Playfair Display', Georgia, serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      decorations: 'minimal-botanical',
      palettes: [
        { id: 'classic', label: 'Earthy Sage', primary: '#2d4a3e', secondary: '#4a6b5d', bg: '#fbfaf8', cardBg: '#ffffff', border: '#e3dfd7', accent: '#c49758', text: '#2c302e' },
        { id: 'rose', label: 'Dusty Rose', primary: '#7c4355', secondary: '#9e5a6f', bg: '#fdf9f9', cardBg: '#ffffff', border: '#ebd8dc', accent: '#c97d60', text: '#3d262e' },
        { id: 'slate', label: 'Nordic Slate', primary: '#273c4d', secondary: '#3d5a73', bg: '#f8fafc', cardBg: '#ffffff', border: '#dbe3ea', accent: '#7c9bb8', text: '#1e293b' }
      ]
    },
    celebration: {
      name: 'Colorful Celebration',
      tagline: 'TIME TO CELEBRATE & PARTY! 🎈',
      headline: 'Happy Birthday!',
      fontHeading: "'Plus Jakarta Sans', sans-serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      decorations: 'celebration-confetti',
      palettes: [
        { id: 'vibrant', label: 'Festive Fiesta', primary: '#e11d48', secondary: '#f59e0b', bg: '#fffbeb', cardBg: '#ffffff', border: '#fde68a', accent: '#0284c7', text: '#0f172a' },
        { id: 'ocean', label: 'Electric Blue', primary: '#2563eb', secondary: '#06b6d4', bg: '#eff6ff', cardBg: '#ffffff', border: '#bfdbfe', accent: '#ec4899', text: '#0f172a' },
        { id: 'sunset', label: 'Tropical Sunset', primary: '#ea580c', secondary: '#db2777', bg: '#fff7ed', cardBg: '#ffffff', border: '#fed7aa', accent: '#8b5cf6', text: '#18181b' }
      ]
    },
    luxury: {
      name: 'Luxury Black & Gold',
      tagline: 'A TOAST TO EXCELLENCE',
      headline: 'HAPPY BIRTHDAY',
      fontHeading: "'Cinzel', Georgia, serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      decorations: 'luxury-geometric',
      palettes: [
        { id: 'noir', label: 'Royal Noir', primary: '#d4af37', secondary: '#f3e5ab', bg: '#0b0f17', cardBg: '#121824', border: '#d4af37', accent: '#aa7c11', text: '#f8fafc' },
        { id: 'emerald', label: 'Velvet Emerald', primary: '#e2ba59', secondary: '#f9f1d0', bg: '#071d15', cardBg: '#0d2d22', border: '#c99e3a', accent: '#10b981', text: '#f3f4f6' },
        { id: 'amethyst', label: 'Midnight Plum', primary: '#ecc765', secondary: '#fde68a', bg: '#170c1d', cardBg: '#24132e', border: '#c99836', accent: '#a855f7', text: '#faf5ff' }
      ]
    },
    playful: {
      name: 'Cute & Playful',
      tagline: 'HOORAY! WISHING YOU THE BEST DAY! 🍰',
      headline: 'Happy Birthday!',
      fontHeading: "'Caveat', cursive, sans-serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      decorations: 'playful-doodles',
      palettes: [
        { id: 'cupcake', label: 'Sweet Strawberry', primary: '#e11d48', secondary: '#f43f5e', bg: '#fff1f2', cardBg: '#ffffff', border: '#fecdd3', accent: '#fb7185', text: '#4c0519' },
        { id: 'lavender', label: 'Dreamy Lavender', primary: '#7c3aed', secondary: '#a855f7', bg: '#f5f3ff', cardBg: '#ffffff', border: '#ddd6fe', accent: '#c084fc', text: '#2e1065' },
        { id: 'mint', label: 'Sunny Mint', primary: '#059669', secondary: '#10b981', bg: '#ecfdf5', cardBg: '#ffffff', border: '#a7f3d0', accent: '#f59e0b', text: '#064e3b' }
      ]
    }
  };

  // --- Message Presets Dictionary ---
  const MESSAGE_PRESETS = {
    heartfelt: "Wishing you a year filled with wonderful adventures, endless laughter, and boundless joy. May all your dreams take flight this year! Happy Birthday!",
    short: "Happy Birthday! Wishing you abundant happiness, good health, and fantastic memories on your special day!",
    cheerful: "Another trip around the sun and you're shining brighter than ever! Let's celebrate your wonderful spirit and make today unforgettable! 🎂🎉",
    milestone: "Happy Birthday! May this milestone year open doors to inspiring new chapters, bold accomplishments, and lifelong happiness. Cheers to you!",
    poetic: "May your day be filled with sunlight, your heart with peace, and your upcoming year with serendipity and love. Happiest of birthdays to a truly special soul.",
    witty: "Don't count the candles, just enjoy the glow! Remember: age is merely the number of years the world has been blessed with you. Happy Birthday!"
  };

  // State Management
  const state = {
    recipient: 'Sarah',
    bdayDate: '',
    showAge: false,
    calculatedAge: null,
    template: 'minimal',
    colorId: 'classic',
    message: MESSAGE_PRESETS.heartfelt,
    sender: 'With love, Alex'
  };

  // Helper date formatter
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
    return `${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
  }

  function calculateTurningAge(birthDateObj) {
    if (!birthDateObj) return null;
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthYear = birthDateObj.getFullYear();
    if (birthYear > currentYear) return null;

    // Birthday this year
    let targetYear = currentYear;
    const birthdayThisYear = new Date(targetYear, birthDateObj.getMonth(), birthDateObj.getDate());

    // If today is past the birthday this year, upcoming birthday is next year
    let turningAge = targetYear - birthYear;
    if (today > birthdayThisYear) {
      turningAge += 1;
    }
    return turningAge > 0 && turningAge < 130 ? turningAge : null;
  }

  // Render Color Palette Selector
  function renderColorPalettes() {
    if (!colorPaletteContainer) return;
    colorPaletteContainer.replaceChildren();

    const tplConfig = TEMPLATE_CONFIG[state.template];
    if (!tplConfig || !tplConfig.palettes) return;

    // Ensure valid colorId
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
        updateCardPreview();
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
      // Add floating confetti and celebratory shapes
      const icons = ['🎈', '🎉', '✨', '⭐', '🎊', '🎁', '🎈', '⭐'];
      icons.forEach((ic, idx) => {
        const span = document.createElement('span');
        span.className = `confetti-particle confetti-${idx + 1}`;
        span.textContent = ic;
        cardDecorations.appendChild(span);
      });
    } else if (templateKey === 'luxury') {
      // Add geometric gold corner flourishes
      ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(corner => {
        const cornerDiv = document.createElement('div');
        cornerDiv.className = `luxury-corner luxury-corner-${corner}`;
        cardDecorations.appendChild(cornerDiv);
      });
      const star = document.createElement('div');
      star.className = 'luxury-star-burst';
      star.textContent = '✦';
      cardDecorations.appendChild(star);
    } else if (templateKey === 'playful') {
      // Add playful cute food/sparkle doodle icons
      const doodles = ['🧁', '✨', '🍰', '🌸', '🎈', '🍭'];
      doodles.forEach((d, idx) => {
        const el = document.createElement('span');
        el.className = `playful-doodle doodle-${idx + 1}`;
        el.textContent = d;
        cardDecorations.appendChild(el);
      });
    } else if (templateKey === 'minimal') {
      // Minimal botanical leaf flourishes
      const leafTop = document.createElement('div');
      leafTop.className = 'botanical-wreath top-wreath';
      leafTop.textContent = '— ❀ —';
      const leafBottom = document.createElement('div');
      leafBottom.className = 'botanical-wreath bottom-wreath';
      leafBottom.textContent = '— ❀ —';
      cardDecorations.appendChild(leafTop);
      cardDecorations.appendChild(leafBottom);
    }
  }

  // Main Card Preview Synchronizer
  function updateCardPreview() {
    if (!birthdayCardRender) return;

    const tplConfig = TEMPLATE_CONFIG[state.template];
    const currentPalette = tplConfig.palettes.find(p => p.id === state.colorId) || tplConfig.palettes[0];

    // Apply template and theme classes
    birthdayCardRender.className = `birthday-card template-${state.template} theme-${state.colorId}`;

    // Apply dynamic CSS variables directly to the card container
    birthdayCardRender.style.setProperty('--card-primary', currentPalette.primary);
    birthdayCardRender.style.setProperty('--card-secondary', currentPalette.secondary);
    birthdayCardRender.style.setProperty('--card-bg-color', currentPalette.cardBg);
    birthdayCardRender.style.setProperty('--card-border-color', currentPalette.border);
    birthdayCardRender.style.setProperty('--card-accent-color', currentPalette.accent);
    birthdayCardRender.style.setProperty('--card-text-color', currentPalette.text);

    // Update typography fonts
    const headlineEl = birthdayCardRender.querySelector('.card-headline');
    if (headlineEl) {
      headlineEl.textContent = tplConfig.headline;
      headlineEl.style.fontFamily = tplConfig.fontHeading;
    }

    if (cardTaglineVal) {
      cardTaglineVal.textContent = tplConfig.tagline;
    }

    // Update Recipient Name
    const cleanRecipient = (state.recipient || 'Someone Special').trim();
    if (cardRecipientVal) {
      cardRecipientVal.textContent = cleanRecipient;
      cardRecipientVal.style.fontFamily = tplConfig.fontHeading;
    }

    // Update Date & Age Badges
    const dateObj = parseISODate(state.bdayDate);
    if (dateObj && cardDateBadgeVal) {
      cardDateBadgeVal.textContent = `📅 ${formatDisplayDate(dateObj)}`;
      cardDateBadgeVal.classList.remove('hidden');
    } else if (cardDateBadgeVal) {
      cardDateBadgeVal.classList.add('hidden');
      cardDateBadgeVal.textContent = '';
    }

    if (state.showAge && dateObj) {
      const turningAge = calculateTurningAge(dateObj);
      state.calculatedAge = turningAge;
      if (turningAge && cardAgeBadgeVal) {
        cardAgeBadgeVal.textContent = `⭐ Turning ${turningAge}!`;
        cardAgeBadgeVal.classList.remove('hidden');
      } else if (cardAgeBadgeVal) {
        cardAgeBadgeVal.classList.add('hidden');
      }
    } else if (cardAgeBadgeVal) {
      cardAgeBadgeVal.classList.add('hidden');
      cardAgeBadgeVal.textContent = '';
    }

    // Update Message
    if (cardMessageVal) {
      cardMessageVal.textContent = state.message || 'Wishing you the happiest birthday!';
    }

    // Update Sender / Sign-off
    if (cardSenderVal) {
      if (state.sender && state.sender.trim()) {
        cardSenderVal.textContent = state.sender.trim();
        cardSenderVal.classList.remove('hidden');
      } else {
        cardSenderVal.classList.add('hidden');
        cardSenderVal.textContent = '';
      }
    }

    // Update Decorations
    updateDecorationsDOM(state.template);

    // Update Character Counter
    if (charCounter && bdayMessageInput) {
      const len = bdayMessageInput.value.length;
      charCounter.textContent = `${len} / 280`;
    }
  }

  // --- Input Event Listeners ---
  if (recipientInput) {
    recipientInput.addEventListener('input', function () {
      state.recipient = recipientInput.value;
      updateCardPreview();
    });
  }

  if (bdayDateInput) {
    bdayDateInput.addEventListener('input', function () {
      state.bdayDate = bdayDateInput.value;
      const parsed = parseISODate(state.bdayDate);
      if (parsed) {
        const turning = calculateTurningAge(parsed);
        if (turning && calculatedAgeText && ageCalcPreview) {
          calculatedAgeText.textContent = `Turning ${turning}!`;
          if (showAgeToggle && showAgeToggle.checked) {
            ageCalcPreview.classList.remove('hidden');
          }
        }
      } else if (ageCalcPreview) {
        ageCalcPreview.classList.add('hidden');
      }
      updateCardPreview();
    });
  }

  if (showAgeToggle) {
    showAgeToggle.addEventListener('change', function () {
      state.showAge = showAgeToggle.checked;
      const parsed = parseISODate(bdayDateInput ? bdayDateInput.value : '');
      if (state.showAge && parsed) {
        const turning = calculateTurningAge(parsed);
        if (turning && calculatedAgeText && ageCalcPreview) {
          calculatedAgeText.textContent = `Turning ${turning}!`;
          ageCalcPreview.classList.remove('hidden');
        }
      } else if (ageCalcPreview) {
        ageCalcPreview.classList.add('hidden');
      }
      updateCardPreview();
    });
  }

  if (bdayMessageInput) {
    bdayMessageInput.addEventListener('input', function () {
      state.message = bdayMessageInput.value;
      updateCardPreview();
    });
  }

  if (senderNameInput) {
    senderNameInput.addEventListener('input', function () {
      state.sender = senderNameInput.value;
      updateCardPreview();
    });
  }

  // Template Buttons Click Handling
  templateButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const selectedTpl = btn.getAttribute('data-template');
      if (!selectedTpl || !TEMPLATE_CONFIG[selectedTpl]) return;

      state.template = selectedTpl;
      // Default to first palette of new template
      state.colorId = TEMPLATE_CONFIG[selectedTpl].palettes[0].id;

      templateButtons.forEach(b => {
        const isCurrent = b === btn;
        b.classList.toggle('active', isCurrent);
        b.setAttribute('aria-checked', String(isCurrent));
      });

      renderColorPalettes();
      updateCardPreview();
    });
  });

  // Message Presets Click Handling
  presetButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const presetKey = btn.getAttribute('data-preset');
      if (presetKey && MESSAGE_PRESETS[presetKey]) {
        state.message = MESSAGE_PRESETS[presetKey];
        if (bdayMessageInput) {
          bdayMessageInput.value = state.message;
          bdayMessageInput.focus();
        }
        updateCardPreview();
      }
    });
  });

  // Reset Button
  if (cardResetBtn) {
    cardResetBtn.addEventListener('click', function () {
      state.recipient = 'Sarah';
      state.bdayDate = '';
      state.showAge = false;
      state.template = 'minimal';
      state.colorId = 'classic';
      state.message = MESSAGE_PRESETS.heartfelt;
      state.sender = 'With love, Alex';

      if (recipientInput) recipientInput.value = state.recipient;
      if (bdayDateInput) bdayDateInput.value = '';
      if (showAgeToggle) showAgeToggle.checked = false;
      if (ageCalcPreview) ageCalcPreview.classList.add('hidden');
      if (bdayMessageInput) bdayMessageInput.value = state.message;
      if (senderNameInput) senderNameInput.value = state.sender;

      templateButtons.forEach(b => {
        const isMin = b.getAttribute('data-template') === 'minimal';
        b.classList.toggle('active', isMin);
        b.setAttribute('aria-checked', String(isMin));
      });

      renderColorPalettes();
      updateCardPreview();
      if (recipientInput) recipientInput.focus();
    });
  }

  // Print Card Button
  if (printCardBtn) {
    printCardBtn.addEventListener('click', function () {
      window.print();
    });
  }

  // Copy Message to Clipboard
  if (copyCardMsgBtn) {
    copyCardMsgBtn.addEventListener('click', function () {
      const fullCopyText = `🎂 Happy Birthday ${state.recipient}!\n\n${state.message}\n\n${state.sender ? state.sender : ''}\n\nMade with https://myagenow.today/birthday-card-generator.html`.trim();
      navigator.clipboard.writeText(fullCopyText).then(() => {
        const origNodes = Array.from(copyCardMsgBtn.childNodes).map(n => n.cloneNode(true));
        const origLabel = copyCardMsgBtn.getAttribute('aria-label') || 'Copy message';

        copyCardMsgBtn.textContent = '✓ Message Copied!';
        copyCardMsgBtn.classList.add('is-success');
        if (cardActionStatus) cardActionStatus.textContent = 'Message copied to clipboard';

        setTimeout(() => {
          copyCardMsgBtn.replaceChildren(...origNodes);
          copyCardMsgBtn.setAttribute('aria-label', origLabel);
          copyCardMsgBtn.classList.remove('is-success');
          if (cardActionStatus) cardActionStatus.textContent = '';
        }, 2200);
      }).catch(() => {
        alert('Could not copy text to clipboard.');
      });
    });
  }

  // --- High-Resolution 1200×1500 Canvas Renderer ---
  function renderCardToCanvas() {
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

    // Helper: Word Wrap
    function drawWrappedText(text, x, y, maxWidth, lineHeight, font, fillStyle, align = 'center') {
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

      // Center vertically based on total lines
      const totalBlockHeight = lines.length * lineHeight;
      let startY = y - (totalBlockHeight / 2) + (lineHeight / 2);

      lines.forEach((l, idx) => {
        ctx.fillText(l, x, startY + (idx * lineHeight));
      });
      return totalBlockHeight;
    }

    // 1. Draw Background
    if (state.template === 'luxury') {
      const grad = ctx.createLinearGradient(0, 0, 1200, 1500);
      grad.addColorStop(0, palette.bg);
      grad.addColorStop(0.5, palette.cardBg);
      grad.addColorStop(1, palette.bg);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1500);

      // Subtle metallic mesh / rays
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
    } else if (state.template === 'playful') {
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, 1200, 1500);
      // Soft polka dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      for (let x = 40; x < 1200; x += 80) {
        for (let y = 40; y < 1500; y += 80) {
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      // Minimal
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, 1200, 1500);
    }

    // 2. Inner Frame / Card Cardboard Border
    const margin = 50;
    const cardW = 1200 - (margin * 2);
    const cardH = 1500 - (margin * 2);

    if (state.template === 'luxury') {
      // Dual Gold Border with Corner Ornaments
      drawRoundedRect(margin, margin, cardW, cardH, 24, palette.cardBg, palette.border, 4);
      drawRoundedRect(margin + 24, margin + 24, cardW - 48, cardH - 48, 16, null, 'rgba(212, 175, 55, 0.45)', 2);

      // Corner diamonds
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
      drawRoundedRect(margin + 16, margin + 16, cardW - 32, cardH - 32, 24, null, 'rgba(37, 99, 235, 0.15)', 2);
    } else if (state.template === 'playful') {
      drawRoundedRect(margin, margin, cardW, cardH, 36, '#ffffff', palette.border, 6);
      // Dashed inner decorative border
      ctx.save();
      ctx.setLineDash([14, 10]);
      drawRoundedRect(margin + 20, margin + 20, cardW - 40, cardH - 40, 26, null, palette.secondary, 3);
      ctx.restore();
    } else {
      // Minimal & Elegant
      drawRoundedRect(margin, margin, cardW, cardH, 20, palette.cardBg, palette.border, 2);
      drawRoundedRect(margin + 20, margin + 20, cardW - 40, cardH - 40, 14, null, 'rgba(196, 151, 88, 0.35)', 1.5);
    }

    // 3. Decorations (Confetti, Stars, Flourishes)
    ctx.textAlign = 'center';
    if (state.template === 'celebration') {
      // Balloons & Confetti
      const emojis = [
        { t: '🎈', x: 140, y: 160, s: 64 },
        { t: '🎉', x: 1060, y: 170, s: 60 },
        { t: '✨', x: 200, y: 350, s: 44 },
        { t: '⭐', x: 1000, y: 360, s: 44 },
        { t: '🎁', x: 160, y: 1300, s: 58 },
        { t: '🎈', x: 1040, y: 1290, s: 64 },
        { t: '🎊', x: 300, y: 1370, s: 48 },
        { t: '🍰', x: 900, y: 1370, s: 48 }
      ];
      emojis.forEach(e => {
        ctx.font = `${e.s}px sans-serif`;
        ctx.fillText(e.t, e.x, e.y);
      });
    } else if (state.template === 'luxury') {
      ctx.font = '56px "Cinzel", Georgia, serif';
      ctx.fillStyle = palette.primary;
      ctx.fillText('✦  ✦  ✦', 600, 190);
      ctx.fillText('✦  ✦  ✦', 600, 1370);
    } else if (state.template === 'playful') {
      const doodles = [
        { t: '🧁', x: 160, y: 180, s: 60 },
        { t: '🍰', x: 1040, y: 190, s: 60 },
        { t: '🌸', x: 160, y: 1320, s: 52 },
        { t: '🍭', x: 1040, y: 1310, s: 52 },
        { t: '✨', x: 260, y: 270, s: 40 },
        { t: '✨', x: 940, y: 280, s: 40 }
      ];
      doodles.forEach(d => {
        ctx.font = `${d.s}px sans-serif`;
        ctx.fillText(d.t, d.x, d.y);
      });
    } else {
      // Minimal botanical flourish
      ctx.font = '28px "Playfair Display", Georgia, serif';
      ctx.fillStyle = palette.accent;
      ctx.fillText('—  ❀  —', 600, 200);
      ctx.fillText('—  ❀  —', 600, 1360);
    }

    // 4. Tagline
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillStyle = palette.accent;
    ctx.fillText(tplConfig.tagline, 600, 270);
    ctx.letterSpacing = '0px';

    // 5. Headline ("Happy Birthday")
    if (state.template === 'luxury') {
      ctx.font = '800 86px "Cinzel", Georgia, serif';
      ctx.fillStyle = palette.primary;
    } else if (state.template === 'minimal') {
      ctx.font = 'italic 700 88px "Playfair Display", Georgia, serif';
      ctx.fillStyle = palette.primary;
    } else if (state.template === 'playful') {
      ctx.font = '700 100px "Caveat", cursive, sans-serif';
      ctx.fillStyle = palette.primary;
    } else {
      ctx.font = '800 84px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = palette.primary;
    }
    ctx.fillText(tplConfig.headline, 600, 380);

    // 6. Recipient Name
    const cleanRecipient = (state.recipient || 'Someone Special').trim();
    if (state.template === 'luxury') {
      ctx.font = '800 78px "Cinzel", Georgia, serif';
      ctx.fillStyle = palette.secondary;
    } else if (state.template === 'minimal') {
      ctx.font = '700 82px "Playfair Display", Georgia, serif';
      ctx.fillStyle = palette.text;
    } else if (state.template === 'playful') {
      ctx.font = '700 96px "Caveat", cursive, sans-serif';
      ctx.fillStyle = palette.secondary;
    } else {
      ctx.font = '800 80px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = palette.secondary;
    }
    ctx.fillText(cleanRecipient, 600, 480);

    // 7. Date & Milestone Age Badges
    const dateObj = parseISODate(state.bdayDate);
    const badges = [];
    if (dateObj) {
      badges.push(`📅 ${formatDisplayDate(dateObj)}`);
    }
    if (state.showAge && dateObj) {
      const turning = calculateTurningAge(dateObj);
      if (turning) {
        badges.push(`⭐ Turning ${turning}!`);
      }
    }

    let badgeY = 560;
    if (badges.length > 0) {
      const totalWidth = badges.length === 2 ? 640 : 340;
      const startX = 600 - (totalWidth / 2);
      const bW = totalWidth / badges.length - (badges.length === 2 ? 20 : 0);

      badges.forEach((bText, idx) => {
        const bx = startX + (idx * (bW + 20));
        drawRoundedRect(
          bx,
          badgeY - 32,
          bW,
          56,
          28,
          state.template === 'luxury' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(37, 99, 235, 0.08)',
          palette.accent,
          1.5
        );
        ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = state.template === 'luxury' ? palette.primary : palette.primary;
        ctx.fillText(bText, bx + (bW / 2), badgeY + 4);
      });
      badgeY += 40;
    }

    // 8. Decorative Divider
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(420, badgeY + 30);
    ctx.lineTo(780, badgeY + 30);
    ctx.stroke();

    // 9. Personalized Message Card / Box
    const msgBoxY = badgeY + 110;
    const msgText = (state.message || 'Wishing you the happiest birthday!').trim();

    drawWrappedText(
      msgText,
      600,
      msgBoxY + 130,
      860,
      50,
      '500 34px "Plus Jakarta Sans", sans-serif',
      palette.text,
      'center'
    );

    // 10. Sender / Sign-off
    if (state.sender && state.sender.trim()) {
      if (state.template === 'luxury') {
        ctx.font = '600 32px "Cinzel", Georgia, serif';
        ctx.fillStyle = palette.primary;
      } else if (state.template === 'playful') {
        ctx.font = '700 48px "Caveat", cursive, sans-serif';
        ctx.fillStyle = palette.primary;
      } else {
        ctx.font = 'italic 600 34px "Playfair Display", Georgia, serif';
        ctx.fillStyle = palette.primary;
      }
      ctx.fillText(state.sender.trim(), 600, 1220);
    }

    // 11. Watermark
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = state.template === 'luxury' ? 'rgba(212, 175, 55, 0.6)' : 'rgba(100, 116, 139, 0.7)';
    ctx.fillText('myagenow.today', 600, 1420);

    return canvas;
  }

  // --- Download PNG Action ---
  if (downloadPngBtn) {
    downloadPngBtn.addEventListener('click', function () {
      const canvas = renderCardToCanvas();
      if (!canvas) return;

      const safeRecipient = (state.recipient || 'birthday').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `myagenow-birthday-card-${safeRecipient}.png`;

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

        // Feedback
        const origNodes = Array.from(downloadPngBtn.childNodes).map(n => n.cloneNode(true));
        const origLabel = downloadPngBtn.getAttribute('aria-label') || 'Download PNG';

        downloadPngBtn.textContent = '✓ Card Downloaded!';
        downloadPngBtn.classList.add('is-success');
        if (cardActionStatus) cardActionStatus.textContent = 'High-resolution birthday card PNG downloaded';

        setTimeout(() => {
          downloadPngBtn.replaceChildren(...origNodes);
          downloadPngBtn.setAttribute('aria-label', origLabel);
          downloadPngBtn.classList.remove('is-success');
          if (cardActionStatus) cardActionStatus.textContent = '';
        }, 2500);
      }, 'image/png');
    });
  }

  // --- Share Card Action ---
  if (shareCardBtn) {
    shareCardBtn.addEventListener('click', function () {
      const canvas = renderCardToCanvas();
      if (!canvas) return;

      const safeRecipient = (state.recipient || 'birthday').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `myagenow-birthday-card-${safeRecipient}.png`;

      canvas.toBlob(function (blob) {
        if (!blob) return;

        const file = new File([blob], filename, { type: 'image/png' });
        const shareData = {
          title: `Happy Birthday ${state.recipient}!`,
          text: `Here is a personalized birthday card for you: ${state.message}`,
          files: [file]
        };

        if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
          navigator.share(shareData).catch(() => {
            // User cancelled or share dismissed
          });
        } else if (navigator.share) {
          // Fallback share without files
          navigator.share({
            title: `Happy Birthday ${state.recipient}!`,
            text: state.message,
            url: window.location.href
          }).catch(() => {});
        } else {
          // Fallback: trigger download
          if (downloadPngBtn) downloadPngBtn.click();
        }
      }, 'image/png');
    });
  }

  // Initial render on load
  renderColorPalettes();
  updateCardPreview();
});
