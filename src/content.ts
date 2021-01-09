// TODO:
//      1. Figure out if it's possible to find the position of text by parsing
//      the html in some weird way.

console.log('clearly the background script is not running');
function checkWorking(document: HTMLDocument) {
  document.body.style.border = '3px solid green';
}

type Position = {
  x: number;
  y: number;
};

export function findAbsolutePosition(
  selection: string,
  parentNode: HTMLElement
): Position {
  const xPos = 0;
  const yPos = 0;

  return { x: xPos, y: yPos };
}

checkWorking(document);
