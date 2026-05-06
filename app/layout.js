import { loadPvqResult } from './storage.js';

export function injectTailwindConfig() {
  // Tailwind CDN config hook: must run before tailwindcss script executes.
  // If tailwind already exists, this is a no-op.
  if (window.tailwind) return;
  window.tailwind = {
    theme: {
      extend: {
        colors: {
          bg: '#0b0d10',
          surface: '#11141a',
          surface2: '#161b24',
          border: '#273042',
          text: '#e9edf3',
          text2: '#a7b0bf',
          text3: '#6f7b90',
          accent: '#c8a96e',
          accent2: '#8fb8a0',
          danger: '#c06060',
        },
        fontFamily: {
          serif: ['ui-serif', 'Georgia', 'Noto Serif SC', 'serif'],
          mono: ['ui-monospace', 'SFMono-Regular', 'DM Mono', 'monospace'],
          sans: ['ui-sans-serif', 'system-ui', 'PingFang SC', 'Inter', 'sans-serif'],
        },
        boxShadow: {
          card: '0 1px 0 rgba(255,255,255,0.03), 0 18px 60px rgba(0,0,0,0.45)',
        },
      },
    },
  };
}

export function navHtml(active) {
  const pvq = loadPvqResult();
  const hasResult = !!pvq;
  const pill = hasResult
    ? `<span class="ml-2 inline-flex items-center rounded-full border border-border/70 bg-surface2 px-2 py-0.5 font-mono text-[10px] text-accent2">w_i ready</span>`
    : `<span class="ml-2 inline-flex items-center rounded-full border border-border/70 bg-surface2 px-2 py-0.5 font-mono text-[10px] text-text3">no data</span>`;

  const link = (href, key, label) => {
    const is = active === key;
    const base = 'px-3 py-2 rounded-md text-sm transition border';
    const cls = is
      ? `${base} border-border bg-surface2 text-text`
      : `${base} border-transparent text-text2 hover:text-text hover:bg-surface2/60 hover:border-border`;
    return `<a href="${href}" class="${cls}">${label}</a>`;
  };

  return `
  <div class="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
      <a href="index.html" class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-lg border border-border bg-surface2 shadow-card"></div>
        <div class="leading-tight">
          <div class="text-sm font-semibold tracking-wide text-text">Value Coordinate System</div>
          <div class="text-[11px] text-text3 font-mono">Schwartz PVQ-40 · Decision Utility</div>
        </div>
      </a>
      <div class="hidden md:flex items-center gap-1">
        ${link('pvq40.html', 'survey', 'PVQ-40 Survey')}
        ${link('results.html', 'results', 'Results')}
        ${link('ui_calculator.html', 'calc', 'Calculator')}
        ${link('compare.html', 'compare', 'Compare')}
        ${link('about.html', 'about', 'About')}
        ${pill}
      </div>
      <div class="md:hidden flex items-center gap-2">
        ${pill}
        <a href="menu.html" class="px-3 py-2 rounded-md border border-border bg-surface2 text-text2 font-mono text-xs">Menu</a>
      </div>
    </div>
  </div>`;
}

export function pageShell({ active, title, subtitle, bodyHtml }) {
  return `
  ${navHtml(active)}
  <main class="mx-auto max-w-6xl px-4 py-10 md:px-6">
    <div class="mb-8">
      <div class="font-mono text-[11px] tracking-[0.18em] uppercase text-text3">${subtitle || ''}</div>
      <h1 class="mt-3 text-3xl font-semibold text-text">${title || ''}</h1>
    </div>
    ${bodyHtml || ''}
  </main>`;
}

