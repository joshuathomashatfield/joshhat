async function loadData() {
  const response = await fetch('data/site.json');
  if (!response.ok) throw new Error('Could not load site data');
  return response.json();
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
    <article class="news-item"><span class="news-date">${item.date}</span>${item.text}</article>
  `).join('');
}

function renderCards(selector, items) {
  const el = document.querySelector(selector);
  el.innerHTML = items.map(item => `
    <article class="card">
      <p class="meta">${item.meta || ''}</p>
      <h3>${item.url ? `<a href="${item.url}">${item.title}</a>` : item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join('');
}

function renderPublications(items) {
  const el = document.querySelector('#publication-list');
  el.innerHTML = items.map(item => `
    <article class="pub">
      <div class="pub-title">${item.title}</div>
      <div class="pub-venue">${item.venue}</div>
      <div>${item.note || ''}</div>
    </article>
  `).join('');
}

function renderTimeline(selector, items) {
  const el = document.querySelector(selector);
  el.innerHTML = items.map(item => `
    <article class="timeline-item">
      <div class="timeline-date">${item.date || ''}</div>
      <div>
        <h3>${item.role}</h3>
        <p class="timeline-org">${item.org}</p>
        ${item.text ? `<p>${item.text}</p>` : ''}
      </div>
    </article>
  `).join('');
}

function renderAffiliations(items) {
  const el = document.querySelector('#affiliation-grid');
  el.innerHTML = items.map(item => `
    <article class="affiliation-card">
      <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" />
      <div class="campus-fallback">${item.fallback}</div>
      <div>
        <h3>${item.name}</h3>
        <p>${item.detail}</p>
      </div>
    </article>
  `).join('');
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
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

loadData().then(data => {
  document.querySelector('#quick-links').append(...data.quickLinks.map(linkButton));
  renderNews(data.news || []);
  renderCards('#research-grid', data.research || []);
  renderCards('#project-grid', data.projects || []);
  renderPublications(data.publications || []);
  renderTimeline('#teaching-list', data.teaching || []);
  renderTimeline('#service-list', data.service || []);
  renderAffiliations(data.affiliations || []);
  renderGallery(data.gallery || []);
  document.querySelector('#year').textContent = new Date().getFullYear();
  initNav();
  initReveal();
}).catch(error => {
  console.error(error);
});
