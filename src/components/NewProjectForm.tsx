import { h, FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button } from "./Button";
import {
  getNextYear,
  getNow,
  getWeekRanges,
  simpleDateFromString,
  simpleDateToString,
} from "../helpers/dateHelpers";
import { createProject } from "../helpers/entityHelpers";
import { DebouncedInput } from "./DebouncedInput";
import { Box } from "./Box";

export const NewProjectForm: FunctionComponent<{
  onSubmit: (project: Project) => void;
}> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [startDateRaw, setStartDateRaw] = useState(() =>
    simpleDateToString(getNow())
  );
  const [endDateRaw, setEndDateRaw] = useState(() =>
    simpleDateToString(getNextYear())
  );

  return (
    <Box
      as="form"
      flexDirection="column"
      alignItems="flex-start"
      className="card"
      onSubmit={(e) => {
        e.preventDefault();
        const rowDates = getWeekRanges(
          simpleDateFromString(startDateRaw),
          simpleDateFromString(endDateRaw)
        );
        onSubmit({
          ...createProject(),
          rowDates,
          name,
          duration: rowDates.length,
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
          required
        />
      </label>
      <label>
        Start Date
        <input
          type="date"
          value={startDateRaw}
          className="input"
          onChange={(e) => setStartDateRaw(e.currentTarget.value)}
        />
      </label>
      <label>
        End Date
        <input
          type="date"
          value={endDateRaw}
          className="input"
          onChange={(e) => setEndDateRaw(e.currentTarget.value)}
        />
      </label>

      <Box mt={0.75}>
        <Button type="submit" className="h3 hero-button">
          Create
        </Button>
      </Box>
    </Box>
  );
};
