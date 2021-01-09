const contexts = ['selection'];

const basicNoteSelection = {
  id: 'basic-selection-note',
  title: 'Create Basic Note',
  contexts,
};

const questionNoteSelection = {
  id: 'question-selection-note',
  title: 'Create Question Note',
  contexts,
};

const answerNoteSelection = {
  id: 'answer-selection-note',
  title: 'Create Answer Note',
  contexts,
};

export const clickReducer = (
  info: browser.menus.OnClickData,
  _tab: browser.tabs.Tab
) => {
  switch (info.menuItemId) {
    case 'basic-selection-note':
      console.log('create a basic note', info.selectionText);
      break;

    case 'question-selection-note':
      console.log('create a question note', info.selectionText);
      break;

    case 'answer-selection-note':
      console.log('create an answer note', info.selectionText);
      break;

    default:
      break;
  }
};

export const menuItems = [
  basicNoteSelection,
  questionNoteSelection,
  answerNoteSelection,
];
