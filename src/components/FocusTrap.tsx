import {
  Fragment,
  useEffect,
  useRef,
  type FragmentInstance,
  type ReactNode,
} from "react";

/**
 * FragmentInstance.compareDocumentPosition is documented and implemented in
 * React 19.3 but missing from @types/react-dom 19.3.0.
 */
type PositionedFragment = FragmentInstance & {
  compareDocumentPosition(other: Node): number;
};

interface FocusTrapProps {
  children: ReactNode;
  /**
   * Keep Tab cycling inside (a modal dialog). Off for side panels, which
   * still take focus when they open and give it back when they close.
   */
  trap?: boolean;
  /** Where focus goes on close, if not wherever it was on open. */
  returnFocusTo?: HTMLElement | null;
}

/**
 * Moves keyboard focus into a dialog when it opens, keeps Tab inside it, and
 * returns focus to where it was when it closes. A Fragment ref finds the
 * first and last focusable elements without adding a wrapper element around
 * the dialog's own markup.
 */
export function FocusTrap({
  children,
  trap = true,
  returnFocusTo,
}: FocusTrapProps) {
  const fragment = useRef<FragmentInstance>(null);

  useEffect(() => {
    const previous =
      returnFocusTo ?? (document.activeElement as HTMLElement | null);
    const inside = () => {
      const active = document.activeElement;
      const frag = fragment.current as PositionedFragment | null;
      return (
        !!active &&
        active !== document.body &&
        !!frag &&
        (frag.compareDocumentPosition(active) &
          Node.DOCUMENT_POSITION_CONTAINED_BY) !==
          0
      );
    };
    // Children focus themselves first if they want to (search's input).
    if (!inside()) fragment.current?.focus({ preventScroll: true });
    return () => {
      // Give focus back, unless it has already moved elsewhere on purpose,
      // or it came from something that shouldn't get it back (the hidden
      // field that holds the iOS keyboard open).
      const active = document.activeElement;
      const lost = !active || active === document.body || !active.isConnected;
      if (
        lost &&
        previous?.isConnected &&
        previous.getAttribute("aria-hidden") !== "true"
      ) {
        previous.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <>
      {trap && (
        <span
          className="focus-sentinel"
          tabIndex={0}
          aria-hidden="true"
          onFocus={() => fragment.current?.focusLast()}
        />
      )}
      <Fragment ref={fragment}>{children}</Fragment>
      {trap && (
        <span
          className="focus-sentinel"
          tabIndex={0}
          aria-hidden="true"
          onFocus={() => fragment.current?.focus()}
        />
      )}
    </>
  );
}
