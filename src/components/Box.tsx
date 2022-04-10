import { h, FunctionComponent, JSX } from "preact";

type PaddingType = JSX.CSSProperties["paddingTop"];
type MarginType = JSX.CSSProperties["marginTop"];

interface BoxProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  alignItems?: JSX.CSSProperties["alignItems"];
  justifyContent?: JSX.CSSProperties["justifyContent"];
  flexDirection?: JSX.CSSProperties["flexDirection"];
  inline?: boolean;
  gap?: JSX.CSSProperties["gap"];
  p?: PaddingType;
  px?: PaddingType;
  py?: PaddingType;
  pt?: PaddingType;
  pr?: PaddingType;
  pb?: PaddingType;
  pl?: PaddingType;
  m?: MarginType;
  mx?: MarginType;
  my?: MarginType;
  mt?: MarginType;
  mr?: MarginType;
  mb?: MarginType;
  ml?: MarginType;
}

const applySizingUnit = (value: PaddingType | MarginType) =>
  typeof value === "number" ? `${value}rem` : value;

type DivProps = JSX.IntrinsicElements["div"];
export const Box: FunctionComponent<DivProps & BoxProps> = ({
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  gap,
  inline,
  flexDirection,
  alignItems,
  justifyContent,
  style,
  className,
  as: As = "div",
  children,
  ...props
}) => {
  const combinedStyle = {
    marginTop: applySizingUnit(mt ?? my ?? m),
    marginRight: applySizingUnit(mr ?? mx ?? m),
    marginBottom: applySizingUnit(mb ?? my ?? m),
    marginLeft: applySizingUnit(ml ?? mx ?? m),
    paddingTop: applySizingUnit(pt ?? py ?? p),
    paddingRight: applySizingUnit(pr ?? px ?? p),
    paddingBottom: applySizingUnit(pb ?? py ?? p),
    paddingLeft: applySizingUnit(pl ?? px ?? p),
    gap: applySizingUnit(gap),
    display: inline ? "inline-flex" : "flex",
    flexDirection,
    alignItems,
    justifyContent,
    ...(typeof style === "object" ? style : undefined),
  };

  return (
    // @ts-ignore
    <As {...props} className={className} style={combinedStyle}>
      {children}
    </As>
  );
};
