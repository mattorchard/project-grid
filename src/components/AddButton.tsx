import { h, FunctionComponent } from "preact";
import "./AddButton.css";

export const AddButton: FunctionComponent<{
  onClick: (event: MouseEvent) => void;
  title: string;
}> = ({ onClick, title }) => (
  <button
    className="add-button dot-button"
    title={title}
    aria-label={title}
    onClick={onClick}
    type="button"
  >
    +
  </button>
);
