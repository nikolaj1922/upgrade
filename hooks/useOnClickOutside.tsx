import { useEffect, RefObject } from "react";

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <
  T extends HTMLElement = HTMLElement,
  K extends HTMLElement = HTMLElement
>(
  firstRef: RefObject<T>,
  handler: (event: Event) => void,
  secondRef?: RefObject<K>
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const firstEl = firstRef?.current;
      const secondEl = secondRef?.current;

      if (
        !firstEl ||
        firstEl.contains(event?.target as Node) ||
        !secondEl ||
        secondEl.contains(event?.target as Node) ||
        null
      ) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [firstRef, , secondRef, handler]);
};
