export default function readFromStorage(key, defaultValue) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    if (value == null && defaultValue !== null) throw new Error(`No item found at key ${key}`);

    return value;
  } catch (err) {
    localStorage.setItem(key, defaultValue != null ? JSON.stringify(defaultValue) : null);
    return defaultValue;
  }
}
