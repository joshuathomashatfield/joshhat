async function loadData() {
  const response = await fetch('data/site.json');
  if (!response.ok) throw new Error('Could not load site data');
  return response.json();
}

async function loadCV() {
  const published = await fetch('data/cv.json');
  if (published.ok) return published.json();
  if (published.status !== 404) throw new Error('Could not load published CV data');

  const source = await fetch('cv/Josh-Hatfield-CV.tex', { cache: 'no-cache' });
  if (!source.ok) throw new Error('Could not load the LaTeX CV');
  const { parseCV } = await import('./cv-data.mjs');
  return parseCV(await source.text());
}

function escapeText(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function linkButton(item) {
  const a = document.createElement('a');
  a.className = item.primary ? 'button primary' : 'button ghost';
  a.href = item.url;
  a.textContent = item.label;
  return a;
}

function renderNews(items) {
  const el = document.querySelector('#news-list');
  el.innerHTML = items.map(item => `
    <article class="news-item"><span class="news-date">${item.date}</span><span>${item.text}</span></article>
  `).join('');
}

function renderCards(selector, items) {
  const el = document.querySelector(selector);
  el.innerHTML = items.map(item => `
    <article class="card">
      <h3>${escapeText(item.title)}</h3>
      ${item.text ? `<p>${escapeText(item.text)}</p>` : ''}
    </article>
  `).join('');
}

function renderPublications(items) {
  const el = document.querySelector('#publication-list');
  el.innerHTML = items.map(item => `
    <article class="pub">
      <h3 class="pub-title">${escapeText(item.title)}</h3>
      <div class="pub-venue">${escapeText(item.venue)}</div>
      ${item.note ? `<div class="pub-note">${escapeText(item.note)}</div>` : ''}
    </article>
  `).join('');
}

function renderTimeline(selector, items) {
  const el = document.querySelector(selector);
  el.innerHTML = items.map(item => `
    <article class="timeline-item">
      <div class="timeline-date">${escapeText(item.date)}</div>
      <div>
        <h3>${escapeText(item.role)}</h3>
        ${item.org ? `<p class="timeline-org">${escapeText(item.org)}</p>` : ''}
        ${item.text ? `<p>${escapeText(item.text)}</p>` : ''}
      </div>
    </article>
  `).join('');
}

function renderAffiliations(schools, images) {
  const el = document.querySelector('#affiliation-grid');
  const stops = ['Marshall University', 'Colorado School of Mines'];
  const showFlight = schools.length === stops.length && stops.every(name => schools.some(school => school.name === name));
  const ordered = showFlight ? stops.map(name => schools.find(school => school.name === name)) : schools;
  el.classList.toggle('has-flight', showFlight);
  const cards = ordered.map(school => {
    const asset = images.find(item => item.name === school.name);
    return `
    <article class="affiliation-card">
      ${asset ? `<div class="campus-image">
        <img src="${escapeText(asset.image)}" alt="" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false;" />
        <div class="campus-fallback" hidden>${escapeText(asset.fallback)}</div>
      </div>` : ''}
      <div class="campus-details">
        <h3>${escapeText(school.name)}</h3>
        ${school.degrees.map(degree => `<p>${escapeText(degree.title)} <span class="degree-date">${escapeText(degree.date)}</span></p>`).join('')}
      </div>
    </article>
  `;
  });
  const flight = '<div class="campus-flight" aria-hidden="true"><span class="campus-plane">&#9992;&#65038;</span></div>';
  el.innerHTML = cards.join(showFlight ? flight : '');
  if (!showFlight || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    el.classList.add('flight-visible');
    observer.disconnect();
  }, { threshold: .25 });
  observer.observe(el);
}

function renderExperience(roles, images) {
  const section = document.querySelector('#experience');
  const grid = document.querySelector('#experience-grid');
  const entries = roles.map(role => ({ role, photo: images.find(item => item.name === role.org) }));
  const ordered = entries.filter(entry => entry.photo).concat(entries.filter(entry => !entry.photo));
  grid.innerHTML = ordered.map(({ role, photo }) => `
    <article class="experience-card${photo ? '' : ' text-only'}">
      ${photo ? `<figure class="experience-photo">
        <img src="${escapeText(photo.image)}" alt="${escapeText(photo.alt)}" loading="lazy" />
        <figcaption>
          <a href="${escapeText(photo.source)}">Photo by ${escapeText(photo.credit)}</a>
          · ${photo.licenseUrl ? `<a href="${escapeText(photo.licenseUrl)}">${escapeText(photo.license)}</a>` : escapeText(photo.license)}
          ${photo.changes ? ' · ' + escapeText(photo.changes) : ''}
        </figcaption>
      </figure>` : ''}
      <div class="experience-details">
        <p class="experience-date">${escapeText(role.date)}</p>
        <h3>${escapeText(role.org || role.role)}</h3>
        ${role.org ? `<p class="experience-role">${escapeText(role.role)}</p>` : ''}
        ${role.text ? `<p>${escapeText(role.text)}</p>` : ''}
      </div>
    </article>
  `).join('');
  section.hidden = entries.length === 0;
  document.querySelector('a[href="#experience"]').hidden = !entries.length;
}

function renderHighlights(cv) {
  const root = document.querySelector('#cv-highlights');
  const stage = root.querySelector('.highlight-slides');
  const pause = root.querySelector('[data-highlight="pause"]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const categories = [
    cv.publications.map(item => ({ ...item, label: 'Publication', href: '#publications' })),
    cv.projects.map(item => ({ ...item, label: 'Project', href: '#projects' })),
    cv.awards.map(item => ({ ...item, label: 'Honor & award' }))
  ];
  const items = Array.from({ length: Math.max(...categories.map(group => group.length)) },
    (_, index) => categories.flatMap(group => group[index] ? [group[index]] : [])).flat();
  if (!items.length) return;

  stage.innerHTML = items.map(({ label, title, date, href }) => `
    <article class="highlight-slide" aria-hidden="true" inert>
      <p>${escapeText(label)}${date ? ' · ' + escapeText(date) : ''}</p>
      <h3>${href ? `<a href="${href}">${escapeText(title)}</a>` : escapeText(title)}</h3>
    </article>
  `).join('');
  const slides = [...stage.children];
  let index = 0;
  let timer;
  let playing = !motion.matches;

  function show(next, announce = false) {
    slides[index].setAttribute('aria-hidden', 'true');
    slides[index].inert = true;
    index = (next + slides.length) % slides.length;
    stage.setAttribute('aria-live', announce ? 'polite' : 'off');
    slides[index].setAttribute('aria-hidden', 'false');
    slides[index].inert = false;
  }

  function schedule() {
    clearInterval(timer);
    pause.textContent = playing ? 'Pause' : 'Play';
    if (playing && slides.length > 1 && !document.hidden && !root.matches(':hover, :focus-within')) {
      timer = setInterval(() => show(index + 1), 7000);
    }
  }

  root.querySelector('[data-highlight="previous"]').addEventListener('click', () => show(index - 1, true));
  root.querySelector('[data-highlight="next"]').addEventListener('click', () => show(index + 1, true));
  pause.addEventListener('click', () => {
    playing = !playing;
    schedule();
  });
  motion.addEventListener('change', event => {
    if (event.matches) playing = false;
    schedule();
  });
  for (const event of ['mouseenter', 'mouseleave', 'focusin']) root.addEventListener(event, schedule);
  root.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  root.querySelector('.highlight-controls').hidden = slides.length < 2;
  root.hidden = false;
  show(0);
  schedule();
}

function renderGallery(items) {
  const el = document.querySelector('#gallery-grid');
  el.innerHTML = items.map(item => `
    <figure>
      <img src="${item.image}" alt="${item.title}" loading="lazy" />
      <figcaption><strong>${item.title}</strong><span>${item.caption}</span></figcaption>
    </figure>
  `).join('');
}

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-nav');

  function close() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) close();
  });
  document.querySelector('.header-inner').addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      close();
      toggle.focus();
    }
  });
}

function initBinaryMargins() {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const rowCount = 48;
  const bits = () => Math.floor(Math.random() * 16).toString(2).padStart(4, '0');
  const tracks = [...document.querySelectorAll('.binary-track')].map(track => {
    const block = document.createElement('div');
    for (let i = 0; i < rowCount; i++) {
      const row = document.createElement('span');
      row.textContent = bits();
      block.append(row);
    }
    const repeat = block.cloneNode(true);
    track.append(block, repeat);
    return [block.children, repeat.children];
  });
  let timer;

  function schedule() {
    clearInterval(timer);
    if (motion.matches || document.hidden) return;
    timer = setInterval(() => {
      for (const [rows, repeat] of tracks) {
        for (let i = 0; i < 5; i++) {
          const index = Math.floor(Math.random() * rowCount);
          rows[index].textContent = repeat[index].textContent = bits();
        }
      }
    }, 360);
  }

  motion.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', schedule);
  schedule();
}

document.querySelector('#year').textContent = new Date().getFullYear();
initNav();
initBinaryMargins();

const accentSwitch = document.querySelector('#accent-switch');
accentSwitch.addEventListener('click', () => {
  const enabled = accentSwitch.getAttribute('aria-pressed') === 'false';
  accentSwitch.setAttribute('aria-pressed', String(enabled));
  if (enabled) document.documentElement.dataset.accent = 'violet';
  else delete document.documentElement.dataset.accent;
});

const headsetTrigger = document.querySelector('.headset-trigger');
const pulseTargets = [headsetTrigger.closest('.hero'), document.querySelector('.binary-margins')];
headsetTrigger.addEventListener('click', () => {
  if (pulseTargets[0].classList.contains('pulse')) return;
  pulseTargets.forEach(target => target.classList.add('pulse'));
  setTimeout(() => pulseTargets.forEach(target => target.classList.remove('pulse')), 800);
});

const siteData = loadData();

siteData.then(data => {
  if (data.quickLinks?.length) {
    document.querySelector('#quick-links').replaceChildren(...data.quickLinks.map(linkButton));
  }
  renderNews(data.news || []);
  renderGallery(data.gallery || []);
}).catch(console.error);

loadCV().then(cv => {
  if (cv.name) document.querySelector('#hero-title').textContent = cv.name;
  if (cv.email) document.querySelector('#profile-email').href = 'mailto:' + cv.email;
  if (cv.github?.startsWith('https://github.com/')) document.querySelector('#profile-github').href = cv.github;
  if (cv.career) {
    document.querySelector('#cv-bio').textContent = cv.career;
  }
  const primarySchool = cv.education[0];
  if (primarySchool) document.querySelector('.profile-identity strong').textContent = primarySchool.name;
  const otherSchool = cv.education[1];
  if (otherSchool?.degrees.length) {
    document.querySelector('.profile-identity span').textContent = otherSchool.degrees[0].title + ', ' + otherSchool.name;
  }
  renderCards('#research-grid', cv.research);
  renderCards('#project-grid', cv.projects);
  renderPublications(cv.publications);
  renderTimeline('#teaching-list', cv.teaching);
  renderTimeline('#service-list', cv.service);
  renderHighlights(cv);
  siteData.catch(() => ({})).then(data => {
    renderAffiliations(cv.education, data.affiliations || []);
    renderExperience(cv.experience || [], data.experienceImages || []);
  });
}).catch(console.error);
