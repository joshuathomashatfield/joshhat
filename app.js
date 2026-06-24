const fallbackData = {
  quickLinks: [
    { label: 'Research', url: '#research' },
    { label: 'Projects', url: '#projects' },
    { label: 'Publications', url: '#publications' },
    { label: 'CV', url: 'docs/Josh-Hatfield-CV.pdf' }
  ],
  news: [
    { date: '2026', text: 'Preparing MS thesis defense on VR industrial maintenance training.' },
    { date: '2026', text: 'Papers accepted for IEEE ROSE 2026.' },
    { date: '2026', text: 'Incoming PhD student in Computer Science / HCI at Colorado School of Mines.' }
  ],
  research: [
    { title: 'VR Industrial Training', meta: 'Thesis Research', text: 'Immersive maintenance tasks, performance telemetry, safety violations, hesitation events, and adaptive HUD feedback.' },
    { title: 'Human-Centered AI', meta: 'HCI + AI', text: 'AI-assisted feedback generation, explanation, and state-aware support for learning environments.' },
    { title: 'Narrative Reflection Systems', meta: 'Emerging Direction', text: 'D&D-inspired and spiritually informed reflection systems for meaning-making and care contexts.' }
  ],
  projects: [
    { title: 'VR Hydroelectric Maintenance Trainer', meta: 'Unreal Engine / VR', text: 'A VR system for procedural industrial maintenance training with task-state tracking and feedback.', url: 'https://github.com/sirjoshies' },
    { title: 'Source-of-Truth Analysis Pipeline', meta: 'Python / Statistics', text: 'Reusable analysis workflow for participant-level KPIs, event logs, survey scoring, and figures.', url: 'https://github.com/sirjoshies' },
    { title: 'Community Resilience ABM', meta: 'Agent-Based Modeling', text: 'Simulation framework for prolonged disruption, social connectivity, migration, and policy allocation.', url: 'https://github.com/sirjoshies' }
  ],
  publications: [
    { title: 'Adaptive Feedback in VR Industrial Training Environments', venue: 'IEEE ROSE 2026', note: 'Conference paper / presentation' },
    { title: 'Scenario-Driven VR Workforce Training with Finite-State Event Tracking', venue: 'IEEE ROSE 2026', note: 'Conference paper / presentation' },
    { title: 'State-Aware Adaptive Feedback and Performance Telemetry in VR Industrial Maintenance Training', venue: 'MS Thesis, Marshall University', note: 'Thesis manuscript' }
  ]
};

async function loadData() {
  try {
    const response = await fetch('data/site.json');
    if (!response.ok) throw new Error('No JSON data found');
    return await response.json();
  } catch (error) {
    return fallbackData;
  }
}

function linkButton(item) {
  const a = document.createElement('a');
  a.className = item.primary ? 'button primary' : 'button';
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
  renderNews(data.news);
  renderCards('#research-grid', data.research);
  renderCards('#project-grid', data.projects);
  renderPublications(data.publications);
  document.querySelector('#year').textContent = new Date().getFullYear();
  initNav();
  initReveal();
});
