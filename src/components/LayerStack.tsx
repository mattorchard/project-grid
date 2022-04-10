import { h, FunctionComponent } from "preact";
import { Button } from "./Button";
import { AddButton } from "./AddButton";
import { Box } from "./Box";
import { DebouncedInput } from "./DebouncedInput";
import { MoveArrows } from "./MoveArrows";
import { RemoveButton } from "./RemoveButton";
import { useProjectContext } from "../contexts/ProjectContext";
import { useMemo } from "preact/hooks";

export const LayerStack: FunctionComponent<{}> = ({}) => {
  const {
    project: { layers },
    addLayer,
    renameLayer,
    removeLayer,
    moveLayer,
    setLayerVisibility,
  } = useProjectContext();
  const visibleLayersCount = useMemo(
    () => layers.filter((layer) => layer.isVisible).length,
    [layers]
  );
  return (
    <section>
      <Box as="header" justifyContent="space-between" mb={0.5}>
        <h3 className="h3">Layers</h3>
        <AddButton title="Add empty layer" onClick={addLayer} />
      </Box>
      <ol>
        {layers.map((layer, index) => (
          <Box as="li" key={layer.id} alignItems="center">
            <Box as="label" p={0.25} pr={0.5}>
              <input
                type="checkbox"
                checked={layer.isVisible}
                onChange={(e) =>
                  setLayerVisibility(layer.id, e.currentTarget.checked)
                }
              />
            </Box>
            <DebouncedInput
              value={layer.name}
              onCommit={(value) => renameLayer(layer.id, value)}
              placeholder="Layer name"
            />
            <Box flexDirection="column" mx={0.5}>
              <MoveArrows
                name="layer"
                onMove={(direction) => moveLayer(layer.id, direction)}
                isTop={index === 0}
                isBottom={index === layers.length - 1}
              />
            </Box>

            <RemoveButton
              title="Delete layer"
              onClick={() => removeLayer(layer.id)}
            />
          </Box>
        ))}
      </ol>

      {layers.length > 1 && (
        <Box
          as="p"
          mt={0.5}
          className="subtle-message"
          style={{ visibility: visibleLayersCount > 1 ? "visible" : "hidden" }}
        >
          In grid editing is disabled while viewing multiple layers
        </Box>
      )}
    </section>
  );
};
