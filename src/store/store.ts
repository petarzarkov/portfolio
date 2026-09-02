export const storeData = <Data = string | Record<string, unknown>>(
  key: string,
  value: Data,
) => {
  try {
    localStorage.setItem(
      `@storage_${key}`,
      typeof value === 'string' ? value : JSON.stringify(value),
    );
  } catch {
    return null;
  }
};

export const getData = <Data = string>(key: string): Data | null => {
  try {
    const jsonValue = localStorage.getItem(`@storage_${key}`);
    try {
      return jsonValue ? (JSON.parse(jsonValue) as Data) : null;
    } catch {
      return jsonValue as unknown as Data;
    }
  } catch {
    return null;
  }
};
