import { h, FunctionComponent, JSX } from "preact";

export const Button: FunctionComponent<JSX.IntrinsicElements["button"]> = (
  props
) => {
  return (
    <button type="button" {...props} className={`button ${props.className}`} />
  );
};
