import { Context, HotKeyStack } from './hotkey_stack';
import { Highlight, Note, cumulativeOffset } from './dom';
import { buildDispatch, createAction, Action } from './state';
import { last, replaceAtIndex } from './arr_utils';
import { Position } from './dom/utils';

function checkWorking(document: HTMLDocument) {
  document.body.style.border = '3px solid green';
}
checkWorking(document);

function registerCustomElements(): void {
  customElements.define('share-note', Note);
  customElements.define('share-highlight', Highlight);
}

type Id = number;

type PageState = {
  noteIds: Id[];
  notePositions: [Position][];
  noteContent: string[];
};

const addBasicNote = createAction('ADD_BASIC_NOTE');
const dragStopPositionChange = createAction('DRAG_STOP_POSITION_CHANGE');
const noteContentUpdate = createAction('NOTE_CONTENT_UPDATE');

function pageReducer(state: PageState, { type, data }: Action): PageState {
  if (state === undefined) {
    state = {
      noteIds: [],
      notePositions: [],
      noteContent: [],
    };
  }
  const { noteIds, notePositions, noteContent } = state;
  const index = noteIds.indexOf(data.id);
  switch (type) {
    case addBasicNote.type:
      let newId;
      if (last(noteIds) != undefined) {
        newId = last(noteIds) + 1;
      } else {
        newId = 1;
      }
      return {
        noteIds: [...noteIds, newId],
        notePositions: [...notePositions, data],
        noteContent: [...noteContent, ''],
      };

    case dragStopPositionChange.type:
      return {
        noteIds: [...noteIds],
        notePositions: replaceAtIndex(notePositions, index, data.position),
        noteContent: [...noteContent],
      };

    case noteContentUpdate.type:
      console.log(index, data, noteContent);
      return {
        noteIds: [...noteIds],
        notePositions: [...notePositions],
        noteContent: replaceAtIndex(noteContent, index, data.content),
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

const handleOnDrop = (note: HTMLElement) => (customEvent: CustomEvent) => {
  dispatch(
    dragStopPositionChange({
      id: parseInt(note.id),
      position: customEvent.detail,
    })
  );
};

function placeNote(position: Position, content: String | undefined) {
  const note = document.createElement('share-note') as Note;
  note.updatePosition(...position);

  note.input.addEventListener('change', (event: Event) => {
    console.log('onchange', event);
    // @ts-ignore
    const content = event.currentTarget.value;
    dispatch(noteContentUpdate({ id: parseInt(note.id), content }));
  });
  // @ts-ignore
  note.input.value = !!content ? content : '';
  document.body.appendChild(note);
  return note;
}

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

      const note = placeNote(position, undefined);

      setTimeout(() => (note as Note).input.focus(), 20);

      dispatch(addBasicNote(position)).then((nextState) => {
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

const placeExistingNotes = () => {
  const href = window.location.href;
  browser.storage.local.get(href).then((storage: any) => {
    const { noteIds, notePositions, noteContent } = storage[href];
    noteIds.forEach((id: string, index: number) => {
      const note = placeNote(notePositions[index], noteContent[index]);
      note.id = id;
      note.addEventListener('ondragstop', handleOnDrop(note));
    });
  });
};

registerCustomElements();
document.addEventListener('keydown', readHotkeys);
document.addEventListener('keyup', clearHotkeys);
document.addEventListener('selectionchange', selectionContextSet);
placeExistingNotes();
