import React from 'react';

export default function useScreenSize() {
  const [size, setSize] = React.useState([0, 0]);

  React.useLayoutEffect(() => {
    if (!window) return;

    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
