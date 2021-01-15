import { Context, HotKeyStack } from './utils';
import { Note, placeNote } from './dom';
import { buildDispatch, createAction, Action } from './state';

// Register the custom note before it can be added
customElements.define('share-note', Note);

type PageState = {};

const addBasicNote = createAction('ADD_BASIC_NOTE');

function pageReducer(state: PageState, { action, data }: Action) {
  switch (action) {
    case addBasicNote.name:
      return state;
    default:
      return state;
  }
}

const dispatch = buildDispatch(pageReducer);

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  share-note {
    position: absolute;
    width: 200px;
    height: 200px;
    backgroundColor: red;
  }
`;
document.body.append(styleSheet);

function checkWorking(document: HTMLDocument) {
  document.body.style.border = '3px solid green';
}
checkWorking(document);

const EDIT_NODE_NAMES = ['TEXTAREA', 'INPUT'];
const configuredContextStart = { normal: 'Backslash', search: 'Forwardslash' };
const configuredEscapeContext = 'Escape';

// TODO: figure out configuration page for this. Populate with default values
// from that page.
const addNoteSequence = 'KeyA-KeyN';
const addQuestionNoteSequence = 'KeyA-KeyA';
const toggleNotesVisible = 'KeyN-KeyV';

const Stack = new HotKeyStack(configuredContextStart);

const dispatchSearchModeAction = (sequence: string): void => {
  switch (sequence) {
    default:
      console.log(`Not a configured search mode action sequence ${sequence}`);
  }
};

const dispatchNormalModeAction = (sequence: string): void => {
  switch (sequence) {
    case addNoteSequence:
      console.log('Add Note Path Hit');
      const noteData = placeNote(document.getSelection());
      dispatch(addBasicNote(noteData));
      break;
    case addQuestionNoteSequence:
      console.log('Add Question Note Path Hit');
      break;
    case toggleNotesVisible:
      console.log('Make the notes invisible!');
      break;

    default:
      console.log(`Not a configured normal mode action sequence ${sequence}`);
  }
};

const readHotkeys = (event: KeyboardEvent): void => {
  if (EDIT_NODE_NAMES.includes(document.activeElement.nodeName)) return null;
  if (!Stack.add(event.code).sequenceComplete) return null;
  if (event.code === configuredEscapeContext) {
    Stack.clear();
    return null;
  }

  Stack.add(event.code);

  if (Stack.currentContext === Context.normal) {
    dispatchNormalModeAction(Stack.sequence);
  } else if (Stack.currentContext === Context.search) {
    dispatchSearchModeAction(Stack.sequence);
  }
};

const clearHotkeys = (_event: KeyboardEvent) => {
  if (Stack.sequenceComplete) {
    Stack.clear();
  }
};

const selectionContextSet = (_event: any): void => {
  const selection = document.getSelection();
  if (selection.toString() === '') {
    Stack.clear();
  }

  if (!Stack.inContext) {
    Stack.triggerContext(configuredContextStart.normal);
  }
};

document.addEventListener('keydown', readHotkeys);
document.addEventListener('keyup', clearHotkeys);
document.addEventListener('selectionchange', selectionContextSet);
