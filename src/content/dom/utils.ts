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
  console.log('trying to place a note');
  const anchor = selection.anchorNode;
  if (anchor instanceof HTMLElement) {
    placeNoteOnElement(anchor);
  } else {
    placeNoteOnNode(anchor, selection);
  }
}

export function placeNoteOnNode(textNode: Node, selection: Selection): void {
  const position = cumulativeOffset(textNode, {
    anchorOffset: selection.anchorOffset,
  });

  const note = document.createElement('share-note');
  (note as Note).updatePosition(...position);

  // @ts-ignore
  document.body.appendChild(note);
  (note as Note).input.focus();
}

export function placeNoteOnElement(textElement: HTMLElement): void {
  const position = cumulativeOffset(textElement, { anchorOffset: 0 });

  const note = document.createElement('share-note');
  (note as Note).updatePosition(...position);

  // @ts-ignore
  document.body.appendChild(note);
}
