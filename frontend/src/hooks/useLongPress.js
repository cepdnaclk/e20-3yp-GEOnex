import { useRef, useCallback } from "react";

/**
 * Detects long-press vs. quick click / tap.
 *
 * @param {Function} onLongPress  fires after `delay` ms of continuous press
 * @param {Function} onClick      fires on a normal quick tap
 * @param {number}   delay        long-press threshold in ms (default 600)
 *
 * @returns {Object} handlers – spread them on the target element
 */
export default function useLongPress(onLongPress, onClick, delay = 600) {
  const timerId = useRef(null);

  // pressed down
  const start = useCallback(
    (e) => {
      // Prevents the default mobile “context menu” on long-press
      e.preventDefault();
      timerId.current = setTimeout(() => {
        onLongPress(e);
        timerId.current = null;
      }, delay);
    },
    [onLongPress, delay]
  );

  // released / cancelled
  const clear = useCallback(
    (e) => {
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
        onClick(e);           // it was a quick tap
      }
    },
    [onClick]
  );

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  };
}
