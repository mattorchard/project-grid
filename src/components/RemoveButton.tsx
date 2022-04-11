import { h, FunctionComponent } from "preact";
import "./RemoveButton.css";

export const RemoveButton: FunctionComponent<{
  onClick: (event: MouseEvent) => void;
  title: string;
}> = ({ onClick, title }) => (
  <button
    className="remove-button dot-button"
    title={title}
    aria-label={title}
    onClick={(event) => {
      if (
        window.confirm(`Are you sure you want to ${title.toLocaleLowerCase()}`)
      )
        onClick(event);
    }}
    type="button"
  >
    &times;
  </button>
);
