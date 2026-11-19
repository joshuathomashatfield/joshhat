// Read the portfolio fields from the layout commands used by this CV.
function commands(source, name, count) {
  const pattern = new RegExp('\\\\' + name + '(?![a-zA-Z])', 'g');
  return [...source.matchAll(pattern)].map(match => {
    let cursor = match.index + match[0].length;
    const args = Array.from({ length: count }, () => {
      while (/\s/.test(source[cursor] ?? '')) cursor++;
      if (source[cursor++] !== '{') throw new Error('Missing argument for ' + name);
      const start = cursor;
      let depth = 1;
      while (cursor < source.length && depth) {
        const char = source[cursor++];
        if (char === '\\' && /[{}]/.test(source[cursor] ?? '')) cursor++;
        if (char === '{') depth++;
        if (char === '}') depth--;
      }
      if (depth) throw new Error('Unclosed argument for ' + name);
      return source.slice(start, cursor - 1);
    });
    return { args, start: match.index, end: cursor };
  });
}

function plain(source) {
  return source
    .replace(/\\fontsize\s*\{[^{}]*\}\s*\{[^{}]*\}/g, '')
    .replace(/\\[a-zA-Z]+\b/g, '')
    .replace(/\\([&%#$ _{}])/g, '$1')
    .replace(/[{}]/g, '')
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/~/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function roleEntries(section) {
  const rows = commands(section, 'cvrow', 4);
  return rows.map(({ args, end }, index) => {
    const [role, org = ''] = args[2].split(/\s*--\s*/, 2).map(plain);
    const body = section.slice(end, rows[index + 1]?.start);
    const list = /\\begin\{cvbullets\}([\s\S]*?)\\end\{cvbullets\}/.exec(body)?.[1];
    const details = list?.split(/\\item\b/).slice(1).map(plain) ?? [];
    return { role, org, date: plain(args[3]), details };
  });
}

export function parseCV(source) {
  const document = source.split('\\begin{document}')[1]?.split('\\end{document}')[0];
  if (!document) throw new Error('The CV document body is missing.');
  const body = document.replace(/(^|[^\\])%[^\r\n]*/g, '$1');
  const headings = commands(body, 'cvsection', 1);
  const sections = new Map(headings.map(({ args, end }, i) => [
    plain(args[0]), body.slice(end, headings[i + 1]?.start)
  ]));
  const get = name => sections.get(name) ?? '';
  const rows = name => commands(get(name), 'cvrow', 4).map(({ args }) => args.slice(2).map(plain));
  const header = body.slice(0, headings[0]?.start);
  const headerLinks = commands(header, 'cvlink', 2).map(({ args }) => args);
  const education = get('Education');
  const schools = [...education.matchAll(/^\s*\\textit\{\\textbf\{([^{}]+)\}/gm)];
  const schoolNames = schools.map(school => plain(school[1]).replace(/,$/, ''));
  const work = roleEntries(get('Work Experience'));
  const career = plain(get('Career Objective'));
  const service = rows('Leadership & Service').map(([entry, date]) => {
    const comma = entry.indexOf(',');
    return comma === -1 ? { role: entry, date } : { role: entry.slice(0, comma), org: entry.slice(comma + 1).trim(), date };
  });
  for (const entry of get('Professional Affiliations').split(/\\item\b/).slice(1)) {
    const affiliation = plain(entry.replace(/\\end\{cvbullets\}/g, ''));
    const comma = affiliation.lastIndexOf(',');
    if (comma === -1) continue;
    const org = affiliation.slice(0, comma);
    const role = affiliation.slice(comma + 1).trim();
    if (!service.some(item => item.org === org && item.role === role)) service.push({ org, role });
  }
  return {
    name: plain(commands(header, 'textbf', 1)[0]?.args[0] ?? ''),
    email: header.match(/[\w.+-]+@[\w.-]+\.[a-z]+/i)?.[0],
    github: headerLinks.find(([, label]) => label === 'GitHub')?.[0],
    career,
    research: rows('Research Interests').flat().filter(Boolean).map(title => ({ title })),
    education: schools.map((school, index) => ({
      name: plain(school[1]).replace(/,$/, ''),
      degrees: commands(education.slice(school.index, schools[index + 1]?.index), 'cvrow', 4)
        .map(({ args }) => ({ title: plain(args[2]).replace(/^\(GPA:[^)]+\)\s*/, ''), date: plain(args[3]) }))
    })),
    projects: commands(get('Selected Projects'), 'cvproject', 2)
      .map(({ args }) => ({ title: plain(args[0]), text: plain(args[1]) })),
    publications: commands(get('Publications & Presentations'), 'cvpublication', 3)
      .map(({ args }) => ({ title: plain(args[1]).replace(/\.$/, ''), venue: plain(args[0]), note: plain(args[2]).replace(/^\.\s*/, '') })),
    experience: work.filter(({ org }) => !schoolNames.includes(org))
      .map(({ details, ...role }) => ({ ...role, text: details[0] ?? '' })),
    teaching: [
      ...work.filter(({ role }) => /\bteaching\b/i.test(role)),
      ...roleEntries(get('Teaching & Mentorship'))
    ].map(({ details, ...role }) => ({ ...role, text: details.join(' ') })),
    service,
    awards: rows('Honors & Awards').map(([title, date]) => ({ title, date }))
  };
}
