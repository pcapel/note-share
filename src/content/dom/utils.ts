import { OffsetOptions, Position } from './types';

import { Note } from './note';

export function cumulativeOffset(
  node: Node | HTMLElement,
  options: OffsetOptions
): Position {
  if (node === null) return [0, 0];

  let element = node.parentElement || node;

  let top: number = 0;
  let left: number = options.anchorOffset || 0;
  do {
    // @ts-ignore
    top += element.offsetTop || 0;
    // @ts-ignore
    left += element.offsetLeft || 0;
    // @ts-ignore
    element = element.offsetParent;
  } while (element);

  return [top, left];
}

export function placeNote(selection: Selection): void {
  const anchor = selection.anchorNode;
  let position: Position;
  if (anchor instanceof HTMLElement) {
    position = placeNoteOnElement(anchor);
  } else {
    position = placeNoteOnNode(anchor, selection);
  }

  browser.storage.local
    .get('ids')
    .then((object: any) => {
      const { ids } = object;
      const newId = ids[ids.length - 1] + 1;
      return [...ids, newId];
    })
    .then((newIds) => {
      browser.storage.local.set({ ids: newIds });
    });
}

export function placeNoteOnNode(
  textNode: Node,
  selection: Selection
): Position {
  const position = cumulativeOffset(textNode, {
    anchorOffset: selection.anchorOffset,
  });

  const note = document.createElement('share-note');
  (note as Note).updatePosition(...position);

  // @ts-ignore
  document.body.appendChild(note);
  (note as Note).input.focus();
  return position;
}

export function placeNoteOnElement(textElement: HTMLElement): Position {
  const position = cumulativeOffset(textElement, { anchorOffset: 0 });

  const note = document.createElement('share-note');
  (note as Note).updatePosition(...position);

  // @ts-ignore
  document.body.appendChild(note);
  return position;
}
