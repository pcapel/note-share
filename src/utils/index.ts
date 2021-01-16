export const last = (arr: any[]): any => arr[arr.length - 1];

export const replaceAtIndex = (arr: any[], index: number, value: any) => {
  return arr.map((el, i) => {
    return i === index ? value : el;
  });
};

export type Position = [number, number];

export type OffsetOptions = {
  anchorOffset: number;
};

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
