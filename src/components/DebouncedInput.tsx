import { h, FunctionComponent, JSX } from "preact";
import { useMemo, useRef } from "preact/hooks";

interface DebouncedInputProps
  extends Omit<
    JSX.HTMLAttributes,
    "onChange" | "ref" | "onBlur" | "defaultValue" | "value"
  > {
  value: string;
  onCommit: (value: string) => void;
  debounceDelay?: number;
}

export const DebouncedInput: FunctionComponent<DebouncedInputProps> = ({
  value,
  onCommit,
  className,
  debounceDelay = 300,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(undefined!);

  const commitActions = useMemo(() => {
    let timeoutId: number | null = null;
    return {
      immediate: (value: string) => {
        if (timeoutId) clearTimeout(timeoutId);
        onCommit(value);
      },
      debounced: (value: string) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => onCommit(value), debounceDelay);
      },
    };
    // onCommiut not added to deps, to allow consumer simplicity
    // If the component is alterered a Key prop can be used
    // Or an alternative component used
  }, [debounceDelay]);
  return (
    <input
      {...props}
      ref={ref}
      onInput={() => commitActions.debounced(ref.current.value)}
      onBlur={() => commitActions.immediate(ref.current.value)}
      defaultValue={value}
      className={`input ${className}`}
    />
  );
};
