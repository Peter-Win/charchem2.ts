export const storageLoad = <Data>(key: string, cvt: (json: unknown) => Data | undefined): Data | undefined => {
  try {
    const text = window.localStorage.getItem(key);
    if (text) {
      const data = cvt(JSON.parse(text));
      if (data !== undefined) {
        return data;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return undefined;
}

export const storageSave = (key: string, settings: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
}
