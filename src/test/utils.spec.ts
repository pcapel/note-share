import { pick, last, replaceAtIndex } from '../utils';

describe('last', () => {
  it('behaves well for empty array', () => {
    expect(last([])).toBeUndefined();
  });

  it('gets the last element from an array', () => {
    expect(last([1, 2, 3, 4, 5])).toEqual(5);
  });
});

describe('replaceAtIndex', () => {
  it('replaces the value at index with the supplied value', () => {
    expect(replaceAtIndex([1, 2, 3, 4, 5], 2, 100)).toEqual([1, 2, 100, 4, 5]);
  });

  it('behaves well on the 0th case', () => {
    expect(replaceAtIndex([1, 2, 3, 4, 5], 0, 100)).toEqual([100, 2, 3, 4, 5]);
  });

  it('behaves well on the last index case', () => {
    expect(replaceAtIndex([1, 2, 3, 4, 5], 4, 100)).toEqual([1, 2, 3, 4, 100]);
  });

  it('is a noop for indices that do not exist', () => {
    expect(replaceAtIndex([1, 2, 3, 4, 5], 10, 100)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('pick', () => {
  it('pulls a key from objects in an iterable', () => {
    const arr = [
      { key: 'value1' },
      { key: 'value2' },
      { key: 'value3' },
      { key: 'value4' },
      { key: 'value5' },
      { key: 'value6' },
    ];
    const expected = [
      'value1',
      'value2',
      'value3',
      'value4',
      'value5',
      'value6',
    ];

    expect(pick(arr, 'key')).toEqual(expected);
  });
});
