import React from 'react';

export default function useStorage(key, defaultValue) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    console.log(defaultValue, key);
    if (!localStorage) return;

    try {
      const v = JSON.parse(localStorage.getItem(key));
      if (v == null && defaultValue !== null) throw new Error(`No item found at key ${key}`);

      setValue(v);
    } catch (err) {
      localStorage.setItem(key, defaultValue != null ? JSON.stringify(defaultValue) : null);
      setValue(defaultValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValue), key]);

  React.useEffect(() => {
    if (value) localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
