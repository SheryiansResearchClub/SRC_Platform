import { useRef } from "react";
import { getSocketInstance, subscribeToSocketEvent, unsubscribeFromSocketEvent } from "@/features/socket/slices/socketSlice";
import { useEffect } from "react";

/**
 * Hook for listening to specific socket events
 * @param {string} event - Event name to listen to
 * @param {Function} handler - Event handler function
 * @param {boolean} enabled - Whether the listener is enabled (default: true)
 */
export const useSocketEvent = (event, handler, enabled = true) => {
  const handlerRef = useRef(handler);
  const socket = getSocketInstance();

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket || !enabled || !event) return;

    const wrappedHandler = (...args) => {
      handlerRef.current(...args);
    };

    subscribeToSocketEvent(event, wrappedHandler);

    return () => {
      unsubscribeFromSocketEvent(event, wrappedHandler);
    };
  }, [socket, event, enabled]);
};