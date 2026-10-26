const themeButton = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const shortcut = document.querySelector<HTMLElement>('[data-shortcut]');
if (shortcut && /Macintosh|Mac OS X|iPhone|iPad/.test(navigator.userAgent))
  shortcut.textContent = '⌘ K';
function updateThemeLabel() {
  themeButton?.setAttribute(
    'aria-label',
    document.documentElement.dataset.theme === 'dark' ? '切换浅色模式' : '切换深色模式',
  );
}
updateThemeLabel();
themeButton?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('liubai-theme', next);
  } catch {
    /* Browsing without storage still works. */
  }
  updateThemeLabel();
});

document.querySelectorAll<HTMLElement>('[data-archive]').forEach((archive) => {
  const chips = archive.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const input = archive.querySelector<HTMLInputElement>('[data-archive-search]');
  const items = archive.querySelectorAll<HTMLElement>('[data-archive-item]');
  let selected = '';
  function filter() {
    const query = input?.value.toLocaleLowerCase().trim() || '';
    let visible = 0;
    items.forEach((item) => {
      const match =
        (!selected || item.dataset.category === selected) &&
        (item.dataset.search || '').toLocaleLowerCase().includes(query);
      item.hidden = !match;
      if (match) visible++;
    });
    const count = archive.querySelector<HTMLElement>('[data-archive-count]');
    if (count)
      count.textContent = `显示 ${visible} / ${items.length} ${input ? '篇笔记' : '个项目'}`;
    const empty = archive.querySelector<HTMLElement>('[data-empty]');
    if (empty) empty.hidden = visible > 0;
  }
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      selected = chip.dataset.filter || '';
      chips.forEach((other) => {
        const active = other === chip;
        other.classList.toggle('active', active);
        other.setAttribute('aria-pressed', String(active));
      });
      filter();
    }),
  );
  input?.addEventListener('input', filter);
  filter();
});

document.querySelectorAll<HTMLElement>('.prose pre').forEach((pre) => {
  const code = pre.querySelector('code');
  if (!code) return;
  const button = document.createElement('button');
  button.className = 'copy-code';
  button.textContent = '复制';
  button.setAttribute('aria-label', '复制代码');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent || '');
      button.textContent = '已复制 ✓';
    } catch {
      button.textContent = '请手动选择复制';
    }
    setTimeout(() => {
      button.textContent = '复制';
    }, 2000);
  });
  pre.append(button);
});

const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
if (progress) {
  const updateProgress = () => {
    const article = document.querySelector<HTMLElement>('.prose');
    if (!article) return;
    const height = article.scrollHeight - window.innerHeight;
    const top = article.getBoundingClientRect().top;
    const value = height > 0 ? Math.max(0, Math.min(1, -top / height)) : top <= 0 ? 1 : 0;
    progress.style.transform = `scaleX(${value})`;
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

const tocLinks = document.querySelectorAll<HTMLAnchorElement>('.table-of-contents a');
if (tocLinks.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          tocLinks.forEach((link) => {
            const active = decodeURIComponent(link.hash.slice(1)) === entry.target.id;
            link.classList.toggle('current', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
      });
    },
    { rootMargin: '-10% 0px -70% 0px' },
  );
  document.querySelectorAll('.prose h2, .prose h3').forEach((heading) => observer.observe(heading));
}
