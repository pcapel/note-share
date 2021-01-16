import { v4 as uuid } from 'uuid';

import { Context, HotKeyStack } from './hotkey_stack';
import { Highlight, Note } from '../components';
import { buildDispatch, createAction, Action } from './state';
import { Position, last, cumulativeOffset } from '../utils';

type Id = string;

type NoteState = {
  id: Id;
  position: Position;
  content: string;
  isDeleted: boolean;
};

type PageState = {
  activeIds: Id[];
  deletedIds: Id[];
  notes: any;
};

const DefaultState: PageState = {
  deletedIds: [],
  activeIds: [],
  notes: {},
};

function newDefaultNote(id: Id, position: Position) {
  return {
    id,
    position,
    content: '',
    isDeleted: false,
  };
}

let NoteIds: string[] = [];
let CurrentNoteIndex: number = -1;

function registerCustomElements(): void {
  customElements.define('share-note', Note);
  customElements.define('share-highlight', Highlight);
}

const addBasicNote = createAction('ADD_BASIC_NOTE');
const dragStopPositionChange = createAction('DRAG_STOP_POSITION_CHANGE');
const noteContentUpdate = createAction('NOTE_CONTENT_UPDATE');

function pageReducer(state: PageState, { type, data }: Action): PageState {
  if (state === undefined) {
    state = DefaultState;
  }

  const { deletedIds, activeIds, notes } = state;
  const note: NoteState = notes[data.id];
  let updatedNote;

  switch (type) {
    case addBasicNote.type:
      const newId = uuid();
      return {
        activeIds: [...activeIds, newId],
        deletedIds: [...deletedIds],
        notes: {
          ...notes,
          [newId]: newDefaultNote(newId, data.position),
        },
      };

    case dragStopPositionChange.type:
      updatedNote = {
        ...note,
        position: data.position,
      };
      return {
        activeIds: [...activeIds],
        deletedIds: [...deletedIds],
        notes: { ...notes, [note.id]: updatedNote },
      };

    case noteContentUpdate.type:
      updatedNote = {
        ...note,
        content: data.content,
      };
      return {
        activeIds: [...activeIds],
        deletedIds: [...deletedIds],
        notes: { ...notes, [note.id]: updatedNote },
      };
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

const EDIT_NODE_NAMES = ['TEXTAREA', 'INPUT'];
const configuredContextStart = { normal: 'Backslash', search: 'Forwardslash' };
const configuredEscapeContext = 'Escape';

const Stack = new HotKeyStack(configuredContextStart);

const dispatchSearchModeAction = (sequence: string): void => {
  switch (sequence) {
    default:
      console.log(`Not a configured search mode action sequence ${sequence}`);
  }
};

const handleOnDrop = (note: HTMLElement) => (customEvent: CustomEvent) => {
  dispatch(
    dragStopPositionChange({
      id: note.id,
      position: customEvent.detail,
    })
  );
};

function placeNote(position: Position, content: String | undefined) {
  const note = document.createElement('share-note') as Note;
  note.updatePosition(...position);

  note.input.addEventListener('change', (event: Event) => {
    // @ts-ignore
    const content = event.currentTarget.value;
    dispatch(noteContentUpdate({ id: note.id, content }));
  });
  // @ts-ignore
  note.input.value = !!content ? content : '';
  document.body.appendChild(note);
  return note;
}

let Settings = {
  hotkeys: {
    clear: 'KeyEscape',
    addNote: 'KeyA-KeyN',
    addQuestion: 'KeyA-KeyA',
    toggleVisible: 'KeyN-KeyV',
    nextNote: 'KeyN-KeyN',
  },
};
browser.storage.local.get('note-share-settings').then((settings) => {
  if (settings !== undefined) {
    Settings = settings as any;
  }
});

const { hotkeys } = Settings;
const clearStack = hotkeys.clear;
const addNoteSequence = hotkeys.addNote;
const addQuestionNoteSequence = hotkeys.addQuestion;
const toggleNotesVisible = hotkeys.toggleVisible;
const gotoNextNote = hotkeys.nextNote;

const dispatchNormalModeAction = (sequence: string): void => {
  switch (sequence) {
    case addNoteSequence:
      const selection = document.getSelection();
      let anchorOffset = 0;
      const anchor = selection.anchorNode;
      if (!(anchor instanceof HTMLElement)) {
        anchorOffset = selection.anchorOffset;
      }

      const position = cumulativeOffset(selection.anchorNode, {
        anchorOffset: anchorOffset,
      });
      console.log('adding a note at position', position);

      const note = placeNote(position, undefined);

      setTimeout(() => (note as Note).input.focus(), 20);

      dispatch(addBasicNote({ position })).then((nextState) => {
        note.id = last(nextState.noteIds);
        note.addEventListener('ondragstop', handleOnDrop(note));
      });
      break;
    case addQuestionNoteSequence:
      console.log('Add Question Note Path Hit');
      break;
    case toggleNotesVisible:
      console.log('Make the notes invisible!');
      break;

    case gotoNextNote:
      let nextIndex = 0;
      if (!(CurrentNoteIndex + 1 >= NoteIds.length)) {
        nextIndex = CurrentNoteIndex + 1;
      }

      const nextNote = document.getElementById(`${NoteIds[nextIndex]}`);
      scrollToNote(nextNote);
      CurrentNoteIndex = nextIndex;
      break;
    case clearStack:
      console.log('clearing the stack');
      Stack.clear();
      break;

    default:
      console.log(`Not a configured normal mode action sequence ${sequence}`);
  }
};

function scrollToNote(note: HTMLElement): void {
  window.scrollTo({
    top: parseInt(note.style.top),
    left: parseInt(note.style.left),
    behavior: 'smooth',
  });
}

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

const clearHotkeys = () => {
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

const getHref = () => window.location.href;

async function getPageState(): Promise<PageState> {
  const href = getHref();
  return browser.storage.local.get(href).then((storage: any) => storage[href]);
}

function placeActiveNotes(noteData: PageState): PageState {
  const { activeIds, notes } = noteData;
  activeIds.forEach((id: string) => {
    const { position, content } = notes[id];
    const note = placeNote(position, content);
    note.id = `${id}`;
    note.addEventListener('ondragstop', handleOnDrop(note));
  });
  return noteData;
}

function initializeNoteTrackingState(noteData: PageState): PageState {
  const { activeIds } = noteData;
  NoteIds = activeIds;
  CurrentNoteIndex = 0;
  return noteData;
}

/**
 * Ostensibly I would use this like a migration handler.  Where I could create
 * a several functions and have them run in order on the state. Something to
 * allow changes in the model over time....
 */
// function initializeRequiredStateElements(noteData: PageState): PageState {
//   if (noteData === undefined) {
//     browser.storage.local.set({ [getHref()]: DefaultState });
//     return DefaultState;
//   }
//   return noteData;
// }

registerCustomElements();

document.addEventListener('keydown', readHotkeys);
document.addEventListener('keyup', clearHotkeys);
document.addEventListener('selectionchange', selectionContextSet);

getPageState()
  .then(initializeNoteTrackingState)
  .then(placeActiveNotes)
  .then(() => console.log('initialization complete'));
