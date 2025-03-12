import { useEffect, useRef } from 'react';

export function useInterval(callback: () => Promise<void> | void, delay = 2000) {
  const savedCallback = useRef<typeof callback | undefined>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      void savedCallback?.current?.();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
