import { ArrayUtil } from './array.util';

describe(ArrayUtil, () => {
  describe(ArrayUtil.isArraysEqual.name, () => {
    it('should return true for equal arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [3, 2, 1];
      expect(ArrayUtil.isArraysEqual(arr1, arr2)).toBe(true);
    });

    it('should return false for arrays of different lengths', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3, 4];
      expect(ArrayUtil.isArraysEqual(arr1, arr2)).toBe(false);
    });

    it('should return false for arrays with different elements', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [4, 5, 6];
      expect(ArrayUtil.isArraysEqual(arr1, arr2)).toBe(false);
    });

    it('should return true for empty arrays', () => {
      const arr1: number[] = [];
      const arr2: number[] = [];
      expect(ArrayUtil.isArraysEqual(arr1, arr2)).toBe(true);
    });

    it('should return false for arrays with same elements but different counts', () => {
      const arr1 = [1, 1, 2];
      const arr2 = [1, 2, 2];
      expect(ArrayUtil.isArraysEqual(arr1, arr2)).toBe(false);
    });
  });
});