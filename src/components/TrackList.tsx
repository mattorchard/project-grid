import { h, FunctionComponent } from "preact";
import { useProjectContext } from "../contexts/ProjectContext";
import { AddButton } from "./AddButton";
import { Box } from "./Box";
import { DebouncedInput } from "./DebouncedInput";
import { MoveArrows } from "./MoveArrows";
import { RemoveButton } from "./RemoveButton";

export const TrackList: FunctionComponent<{}> = ({}) => {
  const {
    project: { trackSpecifications },
    addTrackSpec,
    renameTrackSpec,
    removeTrackSpec,
    moveTrackSpec,
  } = useProjectContext();
  return (
    <div>
      <Box as="header" justifyContent="space-between" mb={0.5}>
        <h3 className="h3">Tracks</h3>
        <AddButton title="Add track" onClick={addTrackSpec} />
      </Box>
      <ol>
        {trackSpecifications.map((trackSpec, index) => (
          <Box as="li" key={trackSpec.id} alignItems="center">
            <DebouncedInput
              value={trackSpec.name}
              onCommit={(value) => renameTrackSpec(trackSpec.id, value)}
              placeholder="Track name"
            />
            <Box flexDirection="column" mx={0.5}>
              <MoveArrows
                name="layer"
                onMove={(direction) => moveTrackSpec(trackSpec.id, direction)}
                isTop={index === 0}
                isBottom={index === trackSpecifications.length - 1}
              />
            </Box>
            <RemoveButton
              title="Delete track"
              onClick={() => removeTrackSpec(trackSpec.id)}
            />
          </Box>
        ))}
      </ol>
    </div>
  );
};
