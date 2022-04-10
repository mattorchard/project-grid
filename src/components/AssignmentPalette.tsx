import { h, FunctionalComponent } from "preact";
import { useProjectContext } from "../contexts/ProjectContext";
import { AddButton } from "./AddButton";
import { Box } from "./Box";
import { DebouncedInput } from "./DebouncedInput";
import { PaletteColorPicker } from "./PaletteColorPicker";
import { RemoveButton } from "./RemoveButton";

export const AssignmentPalette: FunctionalComponent<{}> = ({}) => {
  const {
    project: { assignmentSepecifications, activeAssignmentSpecId },
    addAssignSpec,
    recolorAssignSpec,
    renameAssignSpec,
    removeAssignSpec,
    activateAssignment,
  } = useProjectContext();
  return (
    <div>
      <Box as="header" justifyContent="space-between" mb={0.5}>
        <h3 className="h3">Assignment</h3>
        <AddButton title="Add Assignment" onClick={addAssignSpec} />
      </Box>
      <ul>
        {assignmentSepecifications.map((assignmentSpec) => (
          <Box as="li" key={assignmentSpec.id} alignItems="center">
            <Box p={0.25} pr={0.5} as="label">
              <input
                type="radio"
                name="assignment"
                checked={assignmentSpec.id === activeAssignmentSpecId}
                onChange={(e) => {
                  if (e.currentTarget.checked)
                    activateAssignment(assignmentSpec.id);
                }}
              />
            </Box>
            <DebouncedInput
              value={assignmentSpec.name}
              onCommit={(value) => renameAssignSpec(assignmentSpec.id, value)}
              placeholder="Assignment name"
            />
            <Box mx={0.25}>
              <PaletteColorPicker
                value={assignmentSpec.color}
                onChange={(color) =>
                  recolorAssignSpec(assignmentSpec.id, color)
                }
              />
            </Box>
            <RemoveButton
              title="Remove Assignment"
              onClick={() => removeAssignSpec(assignmentSpec.id)}
            />
          </Box>
        ))}
      </ul>
    </div>
  );
};
