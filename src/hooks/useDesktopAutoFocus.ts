"use client";

import { useEffect, useRef } from "react";

/**
 * Focuses the element on mount only when there is a mouse. On a phone,
 * focusing an input opens the keyboard over the question before it is read.
 */
export function useDesktopAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) ref.current?.focus();
  }, []);
  return ref;
}
