// ── NAV SCROLL BEHAVIOR ─────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── MOBILE NAV TOGGLE ───────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── SCROLL REVEAL ───────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── EVENTS ──────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

async function loadEvents() {
  try {
    const res  = await fetch('data/events.json');
    const data = await res.json();
    renderEvents(data);
  } catch (err) {
    document.getElementById('eventsGrid').innerHTML =
      '<p style="text-align:center;color:var(--text-light);grid-column:1/-1">Events coming soon.</p>';
  }
}

function renderEvents(events) {
  const grid = document.getElementById('eventsGrid');
  const today = new Date();

  // Filter future events and sort
  const upcoming = events
    .filter(e => e.category === 'Coming Soon' || new Date(e.date + 'T00:00:00') >= today)
    .sort((a, b) => {
      if (a.category === 'Coming Soon') return -1;
      if (b.category === 'Coming Soon') return 1;
      return new Date(a.date) - new Date(b.date);
    });

  if (!upcoming.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-light);grid-column:1/-1">No upcoming events at this time. Check back soon.</p>';
    return;
  }

  grid.innerHTML = upcoming.map((e, i) => {
    const d     = new Date(e.date + 'T00:00:00');
    const month = MONTHS[d.getMonth()];
    const day   = d.getDate();
    const isComingSoon = e.category === 'Coming Soon';

    return `
      <article class="event-card${isComingSoon ? ' coming-soon' : ''} reveal" style="transition-delay:${i * 80}ms">
        <span class="event-category">${e.category}</span>
        ${isComingSoon ? '' : `
        <div class="event-date-block">
          <span class="event-month">${month} ${d.getFullYear()}</span>
          <span class="event-day">${day}</span>
        </div>`}
        <h3>${e.title}</h3>
        <div class="event-meta">
          <span><strong>🕐</strong> ${e.time}</span>
          <span><strong>📍</strong> ${e.location}</span>
          ${e.address ? `<span style="font-size:0.78rem;opacity:0.75">${e.address}</span>` : ''}
        </div>
        <p class="event-desc">${e.description}</p>
      </article>
    `;
  }).join('');

  // Re-observe new reveal elements
  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ── COUNCIL MEMBERS ─────────────────────────────
async function loadMembers() {
  try {
    const res  = await fetch('data/members.json');
    const data = await res.json();
    renderMembers(data);
  } catch (err) {
    document.getElementById('membersGrid').innerHTML =
      '<p style="text-align:center;color:rgba(250,247,242,0.4);grid-column:1/-1">Member directory coming soon.</p>';
  }
}

function getInitials(name) {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('');
}

function getAvatar(m) {
  if (m.photo) return `<img src="${m.photo}" alt="${m.name}">`;
  if (m.symbol === 'christus') {
    return `<img src="images/christus.svg" alt="Christus" class="faith-symbol-img" title="${m.symbolLabel}">`;
  }
  if (m.symbol) return `<span class="faith-symbol" title="${m.symbolLabel}">${m.symbol}</span>`;
  return getInitials(m.name);
}

function renderMembers(members) {
  const grid = document.getElementById('membersGrid');
  grid.innerHTML = members.map((m, i) => {
    return `
      <div class="member-card reveal" style="transition-delay:${i * 60}ms">
        <div class="member-avatar">
          ${getAvatar(m)}
        </div>
        <p class="member-name">${m.name}</p>
        ${m.title && m.title !== 'Member' ? `<p class="member-role">${m.title}</p>` : ''}
        ${m.tradition ? `<p class="member-tradition">${m.tradition}</p>` : ''}
        ${m.bio ? `<p class="member-bio">${m.bio}</p>` : ''}
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ── CONTACT FORM ─────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  const btn  = this.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  // Formspree endpoint – replace YOUR_FORM_ID with actual ID after signing up at formspree.io
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  const formData = new FormData(this);

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      note.style.color = 'var(--sky)';
      note.textContent = '✓ Message received — thank you! We\'ll be in touch soon.';
      this.reset();
    } else {
      throw new Error('Server error');
    }
  } catch {
    // Graceful fallback: open mailto
    const name    = formData.get('name') || '';
    const subject = formData.get('subject') || 'Website Inquiry';
    const message = formData.get('message') || '';
    const mailto  = `mailto:info@ojaiinterfaith.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name}\n\n${message}`)}`;
    window.location.href = mailto;
    note.style.color = 'var(--clay)';
    note.textContent = 'Opening your email app…';
  }

  btn.disabled = false;
  btn.textContent = 'Send Message';
});

// ── FOOTER YEAR ─────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── INIT ─────────────────────────────────────────
loadEvents();
loadMembers();

// Add reveal to mission items
document.querySelectorAll('.mission-item').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 120}ms`;
  revealObserver.observe(el);
});
