const contexts = ['all'];

const invisibleNotesItem = {
  id: 'invisible-notes-toggle',
  title: 'Hide Notes',
  contexts,
};

const visibleNotesItem = {
  id: 'visible-notes-toggle',
  title: 'See All Notes',
  contexts,
};

export const clickReducer = (
  info: browser.menus.OnClickData,
  _tab: browser.tabs.Tab
) => {
  switch (info.menuItemId) {
    case 'invisible-notes-toggle':
      console.log('create a basic note', info.selectionText);
      break;

    case 'visible-notes-toggle':
      console.log('create a question note', info.selectionText);
      break;

    default:
      break;
  }
};

export const menuItems = [invisibleNotesItem, visibleNotesItem];
