const memoryStore = new Map<string, string>();

function getBrowserStorage() {
  const maybeStorage = (
    globalThis as {
      localStorage?: {
        getItem: (key: string) => string | null;
        setItem: (key: string, value: string) => void;
        removeItem: (key: string) => void;
      };
    }
  ).localStorage;
  return maybeStorage;
}

export async function getLocalItem(key: string) {
  const browserStorage = getBrowserStorage();
  if (browserStorage) {
    return browserStorage.getItem(key);
  }
  return memoryStore.get(key) ?? null;
}

export async function setLocalItem(key: string, value: string) {
  const browserStorage = getBrowserStorage();
  if (browserStorage) {
    browserStorage.setItem(key, value);
    return;
  }
  memoryStore.set(key, value);
}

export async function deleteLocalItem(key: string) {
  const browserStorage = getBrowserStorage();
  if (browserStorage) {
    browserStorage.removeItem(key);
    return;
  }
  memoryStore.delete(key);
}
