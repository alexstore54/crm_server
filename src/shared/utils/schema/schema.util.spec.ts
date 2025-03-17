import { SchemaUtil } from './schema.util';

describe(SchemaUtil.name, () => {
  describe(SchemaUtil.getConfigKeys.name, () => {
    it('should return an object with keys matching their own names', () => {
      const input = {
        NODE_ENV: 'development',
        APP_PORT: 3000,
        DATABASE_URL: 'postgres://localhost',
      };

      const expectedOutput = {
        NODE_ENV: 'NODE_ENV',
        APP_PORT: 'APP_PORT',
        DATABASE_URL: 'DATABASE_URL',
      };

      expect(SchemaUtil.getConfigKeys(input)).toEqual(expectedOutput);
    });

    it('should return an empty object if given an empty object', () => {
      expect(SchemaUtil.getConfigKeys({})).toEqual({});
    });

    it('should handle input with non-string values', () => {
      const input = {
        NODE_ENV: 'development',
        APP_PORT: 3000,
        IS_PRODUCTION: true,
      };

      const expectedOutput = {
        NODE_ENV: 'NODE_ENV',
        APP_PORT: 'APP_PORT',
        IS_PRODUCTION: 'IS_PRODUCTION',
      };

      expect(SchemaUtil.getConfigKeys(input)).toEqual(expectedOutput);
    });
  });
});
