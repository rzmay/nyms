import React from 'react';

export default function useScreenSize() {
  const [size, setSize] = React.useState([window?.innerWidth, window?.innerHeight]);

  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
