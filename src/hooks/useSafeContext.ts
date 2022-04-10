import { PreactContext } from "preact";
import { useContext } from "preact/hooks";

export const useSafeContext = <T>(context: PreactContext<T | undefined>): T => {
  const value = useContext(context);
  if (value === undefined)
    throw new Error(
      `Cannot use context ${context.displayName} outside of provider`
    );

  return value;
};
