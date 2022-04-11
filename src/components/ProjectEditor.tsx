import { h } from "preact";
import { useProjectContext } from "../contexts/ProjectContext";
import { AssignmentPalette } from "./AssignmentPalette";
import { Box } from "./Box";
import { Button } from "./Button";
import { DebouncedInput } from "./DebouncedInput";
import { LayerStack } from "./LayerStack";
import { ProjectGrid } from "./ProjectGrid";
import { TrackList } from "./TrackList";
import { downloadProjectAsCsv } from "../helpers/csvHelpers";

export const ProjectEditor = () => {
  const { project, renameProject } = useProjectContext();

  const showExport =
    project.layers.length > 0 &&
    project.trackSpecifications.length > 0 &&
    project.assignmentSepecifications.length > 0;

  return (
    <Box>
      <ProjectGrid />
      <Box
        flexDirection="column"
        ml={"auto"}
        gap={2}
        p={1}
        style={{ backgroundColor: `var(--gray-900)` }}
      >
        <Box as="h2" className="h2">
          <DebouncedInput
            value={project.name}
            onCommit={renameProject}
            className="h2"
          />
        </Box>

        <AssignmentPalette />

        <LayerStack />

        <TrackList />

        {showExport && (
          <Box justifyContent="center">
            <Button
              className="h3 hero-button"
              onClick={() => downloadProjectAsCsv(project)}
            >
              Export
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
