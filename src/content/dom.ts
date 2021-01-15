type Position = [number, number];

type OffsetOptions = {
  anchorOffset: number;
};

type StylePair = [string, string];

type StyleArray = StylePair[];

export function cumulativeOffset(
  node: Node | HTMLElement,
  options: OffsetOptions
): StyleArray {
  if (node === null) return toPosition(0, 0);

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

  return toPosition(top, left);
}

export function reposition(element: HTMLElement, position: Position): void {
  styled(element, toPosition(...position));
}

export function placeNote(selection: Selection): void {
  const anchor = selection.anchorNode;
  if (anchor instanceof HTMLElement) {
    placeNoteOnElement(anchor);
  } else {
    placeNoteOnNode(anchor, selection);
  }
}

function placeNoteOnNode(textNode: Node, selection: Selection): void {
  const position = cumulativeOffset(textNode, {
    anchorOffset: selection.anchorOffset,
  });
  const highlightSpan = styled(document.createElement('span'), spanStyle);

  highlightSpan.textContent = textNode.textContent;
  textNode.parentElement.innerHTML = highlightSpan.outerHTML;

  const div = styled(document.createElement('div'), [
    ...divStyles,
    ...position,
  ]);
  makeDraggable(div);

  document.body.appendChild(div);
}

function placeNoteOnElement(textElement: HTMLElement): void {
  const position = cumulativeOffset(textElement, { anchorOffset: 0 });
  const highlightSpan = styled(document.createElement('span'), spanStyle);

  highlightSpan.textContent = textElement.textContent;
  textElement.innerHTML = highlightSpan.outerHTML;

  const div = styled(document.createElement('div'), [
    ...divStyles,
    ...position,
  ]);
  makeDraggable(div);

  document.body.appendChild(div);
}

const drag = (element: HTMLElement) => (event: MouseEvent): void => {
  if (element.classList.contains('dragging')) {
    styled(element, pagePosition(event));
  }
};

function makeDraggable(element: HTMLElement) {
  const oldSelect = document.body.style.userSelect;
  element.onmousedown = () => {
    document.body.style.userSelect = 'none';
    element.classList.add('dragging');
  };

  document.onmousemove = drag(element);

  element.onmouseup = () => {
    document.body.style.userSelect = oldSelect;
    element.classList.remove('dragging');
  };
}

function pagePosition(event: MouseEvent): StyleArray {
  return toPosition(event.pageY, event.pageX);
}

function toPosition(x: number, y: number): StyleArray {
  return [
    ['top', px(x)],
    ['left', px(y)],
  ];
}

function px(value: number): string {
  return `${value}px`;
}

function styled(element: HTMLElement, styleArray: StyleArray): HTMLElement {
  styleArray.forEach((stylePair) => {
    const [key, value] = stylePair;
    // @ts-ignore
    element.style[key] = value;
  });
  return element;
}

const spanStyle: StyleArray = [
  ['backgroundColor', 'purple'],
  ['border', '1px solid red'],
];

const divStyles: StyleArray = [
  ['position', 'absolute'],
  ['width', '100px'],
  ['height', '100px'],
  ['backgroundColor', 'red'],
  ['opacity', '0.5'],
  ['cursor', 'pointer'],
];
