import { h, FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button } from "./Button";
import {
  getEndDateString,
  getNextWeek,
  getNow,
  getWeekCount,
  simpleDateFromString,
  simpleDateToString,
} from "../helpers/dateHelpers";
import { createProject } from "../helpers/entityHelpers";
import { DebouncedInput } from "./DebouncedInput";

export const NewProjectForm: FunctionComponent<{
  project?: Project;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}> = ({ project, onCancel, onSubmit }) => {
  const [name, setName] = useState(project?.name || "");
  const [startDateRaw, setStartDateRaw] = useState(() =>
    simpleDateToString(project?.rowDates?.[0]?.start ?? getNow())
  );
  const [endDateRaw, setEndDateRaw] = useState(() =>
    project
      ? getEndDateString(project.startDate, project.duration)
      : simpleDateToString(getNextWeek())
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const duration = getWeekCount(startDateRaw, endDateRaw);
        onSubmit({
          ...createProject(),
          ...project,
          name,
          startDate: simpleDateFromString(startDateRaw),
          duration,
        });
      }}
    >
      <label>
        Name
        <DebouncedInput
          type="text"
          value={name}
          onCommit={setName}
          placeholder="Project Name"
        />
      </label>
      <label>
        Start Date
        <input
          type="date"
          value={startDateRaw}
          onChange={(e) => setStartDateRaw(e.currentTarget.value)}
        />
      </label>
      <label>
        End Date
        <input
          type="date"
          value={endDateRaw}
          onChange={(e) => setEndDateRaw(e.currentTarget.value)}
        />
      </label>

      <Button type="submit">{project ? "Save" : "Create"}</Button>
      <Button type="button" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};
