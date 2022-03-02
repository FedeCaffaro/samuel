import { useEffect, useRef } from 'react';

export const useInitialLoading = (withInitialLoading, loading) => {
  const initialLoading = useRef(withInitialLoading);

  useEffect(() => {
    if (initialLoading.current && loading) {
      initialLoading.current = false;
    }
  }, [loading]);

  return initialLoading;
};
