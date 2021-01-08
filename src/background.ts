// @ts-ignore
browser.contextMenus.create(
  {
    id: 'log-selection',
    title: 'NoteShare Context Menu Item',
    contexts: ['selection'],
  },
  () => {}
);
