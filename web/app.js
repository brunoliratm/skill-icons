const byId = id => document.getElementById(id);
const names = byId('names');
const limit = byId('limit');
const theme = byId('theme');
const preview = byId('preview');
const markdown = byId('markdown');
const copy = byId('copy');
const statusText = byId('status');
let catalog;
let visibleCount = 24;

function iconPath(ids, themeValue, perLine) {
  const query = new URLSearchParams({ i: ids, theme: themeValue });
  if (perLine) query.set('perline', perLine);
  return '/api/icons?' + query.toString().replaceAll('%2C', ',');
}

function tile(id) {
  const image = new Image();
  image.alt = '';
  image.src = iconPath(id, 'dark');
  return image;
}
function fitTextFields() {
  for (const field of [names, markdown]) {
    field.style.height = 'auto';
    const border = field.offsetHeight - field.clientHeight;
    field.style.height = (field.scrollHeight + border) + 'px';
  }
}
window.addEventListener('resize', fitTextFields);

function render() {
  const input = names.value
    .split(',')
    .map(id => id.trim().toLowerCase())
    .filter(Boolean);
  const validLimit =
    /^[1-9]\d*$/.test(limit.value) && Number(limit.value) <= 50;
  const selectedTheme = theme.querySelector('input:checked').value;
  const path = iconPath(input.join(','), selectedTheme, limit.value);
  limit.setAttribute('aria-invalid', String(!validLimit));
  byId('decrease').disabled = validLimit && Number(limit.value) === 1;
  byId('increase').disabled = validLimit && Number(limit.value) === 50;
  const unknown = catalog
    ? input.filter(
        id =>
          !Object.hasOwn(catalog.aliases, id) &&
          !catalog.ids.includes(id) &&
          !catalog.variants.includes(id),
      )
    : [];
  const valid = validLimit && input.length > unknown.length;
  let message = '';
  if (!input.length)
    message = 'Enter an icon name or choose one from the library.';
  else if (!validLimit) message = 'Enter a whole number from 1 to 50.';
  else if (!valid) message = 'No matching icons.';
  else if (unknown.length)
    message = 'Unknown icons skipped: ' + unknown.join(', ');
  preview.hidden = !valid;
  if (valid) preview.src = path;
  else preview.removeAttribute('src');
  markdown.value = valid ? `![My skills](${location.origin}${path})` : '';
  fitTextFields();
  copy.disabled = !valid;
  statusText.textContent = message;
}
preview.addEventListener('error', () => {
  if (!preview.hasAttribute('src')) return;
  preview.hidden = true;
  markdown.value = '';
  copy.disabled = true;
  statusText.textContent = 'Could not load the preview.';
});
[names, limit, theme].forEach(field => field.addEventListener('input', render));
function stepLimit(delta) {
  const current = Number(limit.value);
  const value = Number.isFinite(current) ? Math.trunc(current) : 0;
  limit.value = String(Math.max(1, Math.min(50, value + delta)));
  render();
}
byId('decrease').addEventListener('click', () => stepLimit(-1));
byId('increase').addEventListener('click', () => stepLimit(1));
limit.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    stepLimit(event.key === 'ArrowUp' ? 1 : -1);
  }
});
copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(markdown.value);
    statusText.textContent = 'Markdown copied.';
  } catch {
    markdown.select();
    statusText.textContent =
      'Markdown selected. Use your browser’s copy command.';
  }
});

function showCatalog() {
  const search = byId('search').value.trim().toLowerCase();
  const aliases = Object.entries(catalog.aliases)
    .filter(([alias]) => search && alias.includes(search))
    .map(([, id]) => id);
  const matches = catalog.ids.filter(
    id => id.includes(search) || aliases.includes(id),
  );
  byId('count').textContent =
    matches.length + (matches.length === 1 ? ' icon' : ' icons');
  byId('catalog-status').textContent = matches.length
    ? ''
    : 'No matching icons. Try a different name or shortcut.';
  const buttons = matches.slice(0, visibleCount).map(id => {
    const button = document.createElement('button');
    button.className = 'item';
    button.setAttribute('aria-label', 'Add ' + id);
    const image = tile(id);
    image.loading = 'lazy';
    button.append(image, id);
    button.addEventListener('click', () => {
      names.value = [names.value.trim().replace(/,+$/, ''), id]
        .filter(Boolean)
        .join(', ');
      render();
      byId('catalog-status').textContent = id + ' added to your selection.';
    });
    return button;
  });
  byId('matches').replaceChildren(...buttons);
  byId('more').hidden = matches.length <= visibleCount;
}
const search = byId('search');
const clearSearch = byId('clear-search');
function updateSearch() {
  clearSearch.hidden = !search.value;
  visibleCount = 24;
  if (catalog) showCatalog();
}
search.addEventListener('input', updateSearch);
clearSearch.addEventListener('click', () => {
  search.value = '';
  updateSearch();
  search.focus();
});
byId('more').addEventListener('click', () => {
  visibleCount += 24;
  showCatalog();
});
render();
fetch('/catalog.json')
  .then(response => response.json())
  .then(data => {
    catalog = data;
    showCatalog();
    render();
  })
  .catch(() => {
    byId('catalog-status').textContent = 'Could not load the icon library.';
  });
