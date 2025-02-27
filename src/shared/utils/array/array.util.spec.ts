import { ArrayUtil } from './array.util';

describe('ArrayUtil.isArraysEqual', () => {
  test('должен возвращать true для одинаковых массивов', () => {
    expect(ArrayUtil.isArraysEqual([1, 2, 3], [3, 2, 1])).toBe(true);
    expect(ArrayUtil.isArraysEqual([5, 10, 15], [10, 15, 5])).toBe(true);
  });

  test('должен возвращать false для массивов разной длины', () => {
    expect(ArrayUtil.isArraysEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(ArrayUtil.isArraysEqual([5, 10, 15], [10, 15])).toBe(false);
  });

  test('должен возвращать false для массивов с разными элементами', () => {
    expect(ArrayUtil.isArraysEqual([1, 2, 3], [4, 5, 6])).toBe(false);
    expect(ArrayUtil.isArraysEqual([7, 8, 9], [9, 8, 10])).toBe(false);
  });

  test('должен корректно обрабатывать пустые массивы', () => {
    expect(ArrayUtil.isArraysEqual([], [])).toBe(true);
    expect(ArrayUtil.isArraysEqual([], [1])).toBe(false);
  });

  test('должен учитывать повторяющиеся элементы', () => {
    expect(ArrayUtil.isArraysEqual([1, 1, 2], [1, 2, 2])).toBe(false);
    expect(ArrayUtil.isArraysEqual([2, 2, 3], [3, 2, 2])).toBe(true);
  });
});
