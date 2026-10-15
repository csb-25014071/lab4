const setStatus = (prefix, message, failed = false) => {
  document.getElementById(`${prefix}-status`).textContent = message;
  document.getElementById(`${prefix}-status-dot`).classList.toggle('is-error', failed);
};

const showError = (container, message, columns = 1) => {
  const row = document.createElement('tr');
  const cell = document.createElement('td');
  cell.colSpan = columns;
  cell.className = 'error-cell';
  cell.textContent = message;
  row.append(cell);
  container.replaceChildren(row);
};

const loadBooks = async () => {
  const list = document.getElementById('books-list');
  try {
    const response = await fetch('book.xml');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    if (xmlDoc.querySelector('parsererror')) throw new Error('The XML document is not well-formed.');

    const books = [...xmlDoc.querySelectorAll('book')];
    if (books.length === 0) throw new Error('No books were found in the XML document.');
    const rows = books.map((book) => {
      const row = document.createElement('tr');
      const values = [
        book.getAttribute('id') || '—',
        book.querySelector('title')?.textContent.trim() || '—',
        book.querySelector('author')?.textContent.trim() || '—',
        `${book.querySelector('price')?.textContent.trim() || '—'} ${book.querySelector('price')?.getAttribute('currency') || ''}`.trim(),
      ];
      values.forEach((value, index) => {
        const cell = document.createElement(index === 0 ? 'th' : 'td');
        if (index === 0) cell.scope = 'row';
        cell.textContent = value;
        row.append(cell);
      });
      return row;
    });
    list.replaceChildren(...rows);
    setStatus('books', `${books.length} books loaded`);
  } catch (error) {
    showError(list, `Could not load book.xml: ${error.message}`, 4);
    setStatus('books', 'Could not load book.xml', true);
  }
};

const addDetail = (list, label, value) => {
  const item = document.createElement('div');
  item.className = 'detail-row';
  const term = document.createElement('dt');
  term.textContent = label;
  const description = document.createElement('dd');
  description.textContent = value;
  item.append(term, description);
  list.append(item);
};

const makeProfileCard = (profile, index) => {
  const card = document.createElement('article');
  card.className = 'profile-card';

  const top = document.createElement('div');
  top.className = 'profile-top';
  const number = document.createElement('span');
  number.className = 'profile-number';
  number.textContent = String(index + 1).padStart(2, '0');
  const name = document.createElement('h3');
  name.textContent = `${profile.firstName} ${profile.lastName}`;
  top.append(number, name);

  const details = document.createElement('dl');
  addDetail(details, 'Email', profile.email);
  addDetail(details, 'Date of birth', profile.dateOfBirth);
  addDetail(details, 'Address', `${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.zipCode}`);

  const preferences = document.createElement('div');
  preferences.className = 'preferences';
  const preferenceTitle = document.createElement('p');
  preferenceTitle.className = 'preference-title';
  preferenceTitle.textContent = 'PREFERENCES';
  const tags = document.createElement('div');
  tags.className = 'preference-tags';
  [
    profile.preferences.theme,
    profile.preferences.language,
    `Notifications ${profile.preferences.notifications ? 'on' : 'off'}`,
    `Newsletter ${profile.preferences.subscription ? 'subscribed' : 'not subscribed'}`,
  ].forEach((value) => {
    const tag = document.createElement('span');
    tag.className = 'preference-tag';
    tag.textContent = value;
    tags.append(tag);
  });
  preferences.append(preferenceTitle, tags);
  card.append(top, details, preferences);
  return card;
};

const loadProfiles = async () => {
  const list = document.getElementById('profiles-list');
  try {
    const response = await fetch('userProfiles.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const profiles = await response.json();
    if (!Array.isArray(profiles) || profiles.length === 0) throw new Error('No profiles were found in the JSON document.');
    list.replaceChildren(...profiles.map(makeProfileCard));
    setStatus('profiles', `${profiles.length} profiles loaded`);
  } catch (error) {
    const message = document.createElement('p');
    message.className = 'error-cell';
    message.textContent = `Could not load userProfiles.json: ${error.message}`;
    list.replaceChildren(message);
    setStatus('profiles', 'Could not load userProfiles.json', true);
  }
};

loadBooks();
loadProfiles();
