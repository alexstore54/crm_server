export class SchemaUtil {
  public static getConfigKeys = <T extends Record<string, any>>(obj: T): { [K in keyof T]: K } => {
    return Object.keys(obj).reduce(
      (acc, key) => {
        acc[key as keyof T] = key as keyof T;
        return acc;
      },
      {} as { [K in keyof T]: K },
    );
  };
}
