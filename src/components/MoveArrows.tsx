import { h, Fragment, FunctionComponent } from "preact";
import { Button } from "./Button";
import "./MoveArrows.css";

export const MoveArrows: FunctionComponent<{
  onMove: (direction: MoveDirection) => void;
  isTop: boolean;
  isBottom: boolean;
  name: string;
}> = ({ onMove, isTop, isBottom, name }) => {
  return (
    <Fragment>
      <Button
        type="button"
        title={`Move ${name} up`}
        onClick={() => onMove("up")}
        disabled={isTop}
        className="move-arrows__up"
      >
        ▲
      </Button>
      <Button
        type="button"
        title={`Move ${name} down`}
        onClick={() => onMove("down")}
        disabled={isBottom}
        className="move-arrows__down"
      >
        ▼
      </Button>
    </Fragment>
  );
};
