import React from 'react';

export default function useStorage(key, defaultValue) {
  const [value, setValue] = React.useState(defaultValue);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!localStorage) return;

    try {
      const v = JSON.parse(localStorage.getItem(key));
      if (v == null && defaultValue !== null) throw new Error(`No item found at key ${key}`);
      setValue(v);
      setLoading(false);
    } catch (err) {
      localStorage.setItem(key, defaultValue != null ? JSON.stringify(defaultValue) : null);
      setValue(defaultValue);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValue), key]);

  React.useEffect(() => {
    if (!localStorage || !value || loading) return;

    localStorage.setItem(key, JSON.stringify(value));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValue), key, JSON.stringify(value)]);

  return [value, setValue, loading];
}
