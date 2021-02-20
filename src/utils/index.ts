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

export function currentUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

export function pick(iter: Array<any>, key: string) {
  return iter.map((el) => el[key]);
}

export function px(value: number): string {
  return `${value}px`;
}

export function unpx(value: string): number {
  return parseInt(value);
}

const classToKey = (value: string): string => value.replace('.', '');

const queryElement = (element: HTMLElement) => (
  selector: string
): HTMLElement => {
  return element.querySelector(selector);
};

export const buildChildren = (
  templateClone: HTMLElement,
  childClasses: string[]
) => {
  const queryClone = queryElement(templateClone);

  return childClasses.reduce((acc, cur) => {
    return Object.assign(acc, { [classToKey(cur)]: queryClone(cur) });
  }, {});
};

export const killEvent = (event: Event) => {
  event.stopImmediatePropagation();
};
