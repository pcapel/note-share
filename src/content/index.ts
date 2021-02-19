import { v4 as uuid } from 'uuid';

import { Context, HotKeyStack } from './hotkey_stack';
import { Note } from '../components';
import { buildDispatch, createAction, Action } from './state';
import { Position, last, cumulativeOffset, currentUrl } from '../utils';

type Id = string;

type NoteState = {
  id: Id;
  position: Position;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type PageState = {
  notesVisible: boolean;
  activeIds: Id[];
  deletedIds: Id[];
  notes: any;
};

const DefaultState: PageState = {
  notesVisible: true,
  deletedIds: [],
  activeIds: [],
  notes: {},
};

const NOTE_CONTAINER = 'notes-container';
const TEMPLATE_CONTAINER = 'templates-container';

function localeDateTimeString(): string {
  const date = new Date();
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
}

function newDefaultNote(id: Id, position: Position): NoteState {
  return {
    id,
    position,
    content: '',
    isDeleted: false,
    createdAt: localeDateTimeString(),
    updatedAt: localeDateTimeString(),
  };
}

let NoteIds: string[] = [];
let CurrentNoteIndex: number = -1;

function registerCustomElements(): void {
  customElements.define('share-note', Note);
}

const addBasicNote = createAction('ADD_BASIC_NOTE');
const dragStopPositionChange = createAction('DRAG_STOP_POSITION_CHANGE');
const noteContentUpdate = createAction('NOTE_CONTENT_UPDATE');
const softDeleteNote = createAction('SOFT_DELETE_NOTE');
const toggleNotesVisibleAction = createAction('TOGGLE_VISIBILITY');

function pageReducer(state: PageState, { type, data }: Action): PageState {
  if (state === undefined) {
    state = DefaultState;
  }
  console.log(state, data);

  const { notesVisible, deletedIds, activeIds, notes } = state;
  const note: NoteState = notes[data.id];
  let updatedNote;

  console.log('switching');
  switch (type) {
    case addBasicNote.type:
      const newId = uuid();

      if (!notesVisible) {
        placeActiveNotes(state);
      }
      // tracking the state for the page here too seems silly
      NoteIds.push(newId);
      return {
        notesVisible: true,
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
        notesVisible: notesVisible,
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
        notesVisible: notesVisible,
        activeIds: [...activeIds],
        deletedIds: [...deletedIds],
        notes: { ...notes, [note.id]: updatedNote },
      };
    case softDeleteNote.type:
      updatedNote = {
        ...note,
        isDeleted: true,
      };
      const noteElement = document.getElementById(note.id);
      document.body.removeChild(noteElement);

      return {
        notesVisible: notesVisible,
        activeIds: activeIds.filter((id) => id === note.id),
        deletedIds: [...deletedIds, note.id],
        notes: { ...notes, [note.id]: updatedNote },
      };

    case toggleNotesVisibleAction.type:
      if (data) {
        placeActiveNotes(state);
      } else {
        document.querySelectorAll('share-note').forEach((element) => {
          document.body.removeChild(element);
        });
      }
      return {
        notesVisible: data,
        activeIds: [...activeIds],
        deletedIds: [...deletedIds],
        notes: { ...notes },
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

const handleSoftDelete = (note: HTMLElement) => (customEvent: CustomEvent) => {
  console.log('calling the soft delete handler.');
  dispatch(
    softDeleteNote({
      id: note.id,
    })
  );
};

function doThing() {
  console.log('oh hi');
}

function placeNote(position: Position, content: String | undefined) {
  const container = getContainer(NOTE_CONTAINER);
  const note = document.createElement('share-note');
  // @ts-ignore TODO: get the Note type back in here
  note.updatePosition(...position);

  // @ts-ignore
  // note.input.addEventListener('change', (event: Event) => {
  //   // @ts-ignore
  //   const content = event.currentTarget.value;
  //   dispatch(noteContentUpdate({ id: note.id, content }));
  // });
  // @ts-ignore
  // note.input.value = !!content ? content : '';
  console.log('trying to add', note, 'into', container);
  container.appendChild(note);
  return note;
}

let Settings = {
  hotkeys: {
    clear: 'Escape',
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

      // @ts-ignore
      setTimeout(() => note.input.focus(), 20);

      dispatch(addBasicNote({ position })).then((nextState) => {
        note.id = last(nextState.noteIds);
        note.addEventListener('ondragstop', handleOnDrop(note));
      });
      break;
    case addQuestionNoteSequence:
      console.log('Add Question Note Path Hit');
      break;
    case toggleNotesVisible:
      console.log('trying to toggle visibility');
      getPageState().then((pageState) => {
        dispatch(toggleNotesVisibleAction(!pageState.notesVisible));
      });
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

async function getPageState(): Promise<PageState> {
  const url = currentUrl();
  return browser.storage.local.get(url).then((storage: any) => storage[url]);
}

function placeActiveNotes(noteData: PageState): PageState {
  const { activeIds, notes } = noteData;
  activeIds.forEach((id: string) => {
    const { position, content } = notes[id];
    const note = placeNote(position, content);
    note.id = `${id}`;
    note.addEventListener('ondragstop', handleOnDrop(note));
    note.addEventListener('softdelete', handleSoftDelete(note));
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

const getContainer = (containerId: string): HTMLElement => {
  const existingNode = document.getElementById(containerId);
  if (existingNode) {
    return existingNode;
  }
  const createdNode = document.createElement('div');
  createdNode.id = containerId;
  return createdNode;
};

browser.runtime.onMessage.addListener((templates: [[string, string]]) => {
  const templateStrings = templates.map((t) => t[1]);
  const templateIds = templates.map((t) => t[0]);

  const templateContainer = getContainer(TEMPLATE_CONTAINER);
  const notesContainer = getContainer(NOTE_CONTAINER);

  document.body.appendChild(templateContainer);
  document.body.appendChild(notesContainer);
  templateContainer.innerHTML = templateStrings.join('');

  templateIds.forEach((id) => console.log(document.getElementById(id)));

  registerCustomElements();

  document.addEventListener('keydown', readHotkeys);
  document.addEventListener('keyup', clearHotkeys);
  document.addEventListener('selectionchange', selectionContextSet);

  getPageState()
    .then(initializeNoteTrackingState)
    .then(placeActiveNotes)
    .then(() => console.log('initialization complete'));
});
