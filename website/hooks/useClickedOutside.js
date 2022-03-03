import { useEffect, useState } from 'react';

export const useClickedOutside = (ref) => {
  const [clickedOutside, setClickedOutside] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      setClickedOutside(ref.current && !ref.current.contains(event.target));
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return clickedOutside;
};
