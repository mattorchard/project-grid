import { h } from "preact";
import { useProjectContext } from "../contexts/ProjectContext";
import { AssignmentPalette } from "./AssignmentPalette";
import { Box } from "./Box";
import { DebouncedInput } from "./DebouncedInput";
import { LayerStack } from "./LayerStack";
import { ProjectGrid } from "./ProjectGrid";
import { TrackList } from "./TrackList";

export const ProjectEditor = () => {
  const { project, renameProject } = useProjectContext();
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
          <DebouncedInput value={project.name} onCommit={renameProject} />
        </Box>
        <AssignmentPalette />

        <LayerStack />
        <TrackList />
      </Box>
    </Box>
  );
};
