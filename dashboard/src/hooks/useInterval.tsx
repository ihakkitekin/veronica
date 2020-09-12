import * as React from 'react';

export function useInterval(period: number, callback: Function) {
  const intervalResult = React.useRef<number>();

  React.useEffect(() => {
    clearInterval(intervalResult.current);
    if (period > 0) {
      const interval = setInterval(callback, period);

      intervalResult.current = interval;
    }
  }, [period, callback]);
}