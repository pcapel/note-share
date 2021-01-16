export const last = (arr: any[]): any => arr[arr.length - 1];

export const replaceAtIndex = (arr: any[], index: number, value: any) => {
  return arr.map((el, i) => {
    return i === index ? value : el;
  });
};
