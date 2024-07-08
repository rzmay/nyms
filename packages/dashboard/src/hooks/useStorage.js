import React from 'react';

export default function useStorage(key, defaultValue) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (!localStorage) return;

    try {
      const v = JSON.parse(localStorage.getItem(key));
      console.log('Parsing key: ', key, ', value: ', v);
      if (v == null && defaultValue !== null) throw new Error(`No item found at key ${key}`);

      setValue(v);
    } catch (err) {
      localStorage.setItem(key, defaultValue != null ? JSON.stringify(defaultValue) : null);
      setValue(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValue), key]);

  React.useEffect(() => {
    if (
      !localStorage
      || !value
      || JSON.stringify(value) === JSON.stringify(defaultValue)
    ) return;

    console.log('Saving key: ', key, ', value: ', value);
    localStorage.setItem(key, JSON.stringify(value));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValue), key, value]);

  return [value, setValue];
}
