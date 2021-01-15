import { StyleArray, OffsetOptions, Position } from './types';

import { Note } from './note';

export function cumulativeOffset(
  node: Node | HTMLElement,
  options: OffsetOptions
): StyleArray {
  if (node === null) return toPositionStyle(0, 0);

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

  return toPositionStyle(top, left);
}

export function reposition(element: HTMLElement, position: Position): void {
  styled(element, toPositionStyle(...position));
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

  const note = styled(document.createElement('share-note'), position);

  // @ts-ignore
  document.body.appendChild(note);
  (note as Note).input.focus();
}

export function placeNoteOnElement(textElement: HTMLElement): void {
  const position = cumulativeOffset(textElement, { anchorOffset: 0 });

  const note = styled(document.createElement('share-note'), position);

  // @ts-ignore
  document.body.appendChild(note);
}

function toPositionStyle(x: number, y: number): StyleArray {
  return [
    ['top', `${x}px`],
    ['left', `${y}px`],
  ];
}

export function styled(
  element: HTMLElement,
  styleArray: StyleArray
): HTMLElement {
  styleArray.forEach((stylePair) => {
    const [key, value] = stylePair;
    // @ts-ignore
    element.style[key] = value;
  });
  return element;
}
