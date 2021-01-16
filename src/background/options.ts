const PAGES = ['notes-management', 'general-settings', 'advanced-settings'];
const DEFAULT_PAGE = PAGES[0];
const NAV_ITEMS = document.querySelector('nav').querySelectorAll('.nav-item');

function initNav(): void {
  NAV_ITEMS.forEach(
    // @ts-ignore, why doesn't Element have onclick?
    (item) => (item.onclick = () => navigateTo(item.getAttribute('for')))
  );
}

function navForPage(pageName: string): Element {
  return Array.from(NAV_ITEMS).find(
    (el) => el.getAttribute('for') === pageName
  );
}

function navigateTo(page: string): void {
  PAGES.forEach((pageName) => {
    if (page === pageName) {
      showPage(pageName);
      activateNav(navForPage(pageName));
    } else {
      hidePage(pageName);
      deactivateNav(navForPage(pageName));
    }
  });
}

function showPage(pageName: string): void {
  document.getElementById(pageName).classList.remove('hidden');
}

function hidePage(pageName: string): void {
  document.getElementById(pageName).classList.add('hidden');
}

function activateNav(element: Element): void {
  element.classList.add('nav-item-active');
}

function deactivateNav(element: Element): void {
  element.classList.remove('nav-item-active');
}

// TODO: get a better type for note data
function mountNote(type: string, href: string, data: any) {
  console.log(data);
  const noteElement = document.createElement('li');
  noteElement.textContent = `${href}: ${data.content}`;
  document.getElementById(type).appendChild(noteElement);
}

function mountCurrentNotes(notes: any): object {
  for (let href in notes) {
    const pageData = notes[href];
    for (let note of Object.values(pageData.notes)) {
      // @ts-ignore
      if (!note.isDeleted) {
        mountNote('recently-deleted', href, note);
      }
    }
  }
  return notes;
}

function mountRecentlyDeleted(notes: any): object {
  for (let href in notes) {
    const note = notes[href];
    if (note.isDeleted) {
      mountNote('recently-deleted', href, note);
    }
  }
  return notes;
}

const initNotes = (): void => {
  browser.storage.local
    .get(null)
    .then(mountCurrentNotes)
    .then(mountRecentlyDeleted)
    .catch(console.error);
};

initNotes();
initNav();
navigateTo(DEFAULT_PAGE);
