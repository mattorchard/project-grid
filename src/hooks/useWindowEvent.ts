import { useEffect } from "preact/hooks";

export const useWindowEvent = <EventType extends keyof WindowEventMap>(
  eventName: EventType,
  callback: null | ((event: WindowEventMap[EventType]) => void)
) => {
  useEffect(() => {
    if (!callback) return noCleanup;
    window.addEventListener(eventName, callback);
    return () => window.removeEventListener(eventName, callback);
  }, [eventName, callback]);
};

const noCleanup = () => {};
