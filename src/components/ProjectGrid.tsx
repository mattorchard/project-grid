import { h, FunctionComponent, Fragment } from "preact";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import { useProjectContext } from "../contexts/ProjectContext";
import { simpleDateToString, toHumanDate } from "../helpers/dateHelpers";
import { asCssVar } from "../palette";
import { NonIdealState } from "./NonIdealState";
import "./ProjectGrid.css";

export const ProjectGrid: FunctionComponent<{}> = ({}) => {
  const { project, changeLayerAssignment } = useProjectContext();
  const [gridScale] = useState({
    width: 120,
    height: 60,
  });
  const layerStack = useMemo(() => {
    const visibleLayers = project.layers.filter((layer) => layer.isVisible);
    return visibleLayers.reverse();
  }, [project.layers]);

  const assignmentColorDefinitions = useMemo(
    () =>
      Object.fromEntries(
        project.assignmentSepecifications.map((assignmentSpec) => [
          getAssignmentColorProperty(assignmentSpec.id),
          asCssVar(assignmentSpec.color, 500),
        ])
      ),
    [project]
  );

  const rowDateJsx = useMemo(
    () => (
      <ol className="project-grid__date-names">
        {project.rowDates.map(({ start, end }, index) => (
          <li key={index} className="subtle-message">
            <div
              title={`${simpleDateToString(
                start
              )} ${enDash} ${simpleDateToString(end)}`}
            >
              <time dateTime={simpleDateToString(start)}>
                {toHumanDate(
                  start,
                  true,
                  start.year !== end.year ||
                    project.rowDates[index - 1]?.end.year !== end.year
                )}
              </time>
              {` ${enDash} `}
              <time dateTime={simpleDateToString(end)}>
                {toHumanDate(
                  end,
                  start.month !== end.month,
                  start.year !== end.year
                )}
              </time>
            </div>
          </li>
        ))}
      </ol>
    ),
    []
  );

  const activeAssignmentId = project.activeAssignmentSpecId;
  const handlePointer = useCallback(
    pointerHof((cellDetails, event) => {
      if (!event.pressure) return;
      const isRightClick = event.buttons === 2;
      const idToAssign = isRightClick ? null : activeAssignmentId;
      if (cellDetails.assignedId === idToAssign) return;

      changeLayerAssignment({
        ...cellDetails,
        assignedId: idToAssign,
      });
    }),
    [changeLayerAssignment, activeAssignmentId]
  );

  return (
    <div
      className="project-grid__container"
      style={{
        ...assignmentColorDefinitions,
        "--track-count": project.trackSpecifications.length,
        "--duration": project.duration,
        "--column-width": `${gridScale.width}px`,
        "--row-height": `${gridScale.height}px`,
      }}
    >
      <div className="project-grid__scroll-container">
        <ol className="project-grid__track-names">
          {project.trackSpecifications.map((track) => (
            <li key={track.id} title={track.name} className="ellipses">
              <a href={`#track-spec-${track.id}`}>{track.name}</a>
            </li>
          ))}
        </ol>
        {rowDateJsx}
        <div
          className="project-grid"
          data-disabled={layerStack.length !== 1}
          onPointerOver={handlePointer}
          onPointerDown={handlePointer}
          onContextMenu={(e) => e.preventDefault()}
        >
          {layerStack.map((layer, layerIndex) => (
            <Fragment key={layer.id}>
              {layer.tracks.map((track, trackIndex) => (
                <div
                  key={track.trackSpecId}
                  className={`pg-track ${
                    layerIndex > 0 && "pg-track--is-overlay"
                  }`}
                >
                  {track.cells.map((cell, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="pg-cell pg-position"
                      data-target="cell"
                      data-assigned-id={cell?.assignedId}
                      data-track-spec-id={track.trackSpecId}
                      data-layer-id={layer.id}
                      data-y={rowIndex}
                      data-x={trackIndex}
                      style={{
                        "--y": rowIndex,
                        "--x": trackIndex,
                        "--assignment-color":
                          cell &&
                          `var(${getAssignmentColorProperty(cell.assignedId)})`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </Fragment>
          ))}
          {layerStack.length === 0 && (
            <div className="no-visible-layers-message">
              {project.layers.length ? (
                <NonIdealState title="No visible layers">
                  Use the checkboxes in the layer panel to show and hide layers.
                </NonIdealState>
              ) : (
                <NonIdealState title="No layers">
                  Use the layer panel to <a href="#add-layer">add layers</a>.
                </NonIdealState>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const enDash = `–`;

interface CellPointerDetails {
  x: number;
  y: number;
  trackSpecId: string;
  layerId: string;
  rowIndex: number;
  assignedId: string | null;
}

const pointerHof =
  (callback: (cellDetails: CellPointerDetails, event: PointerEvent) => void) =>
  (event: PointerEvent) => {
    if (!event.isPrimary) return;
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target.dataset.target !== "cell") return;
    const dataset = event.target.dataset;
    callback(
      {
        x: parseInt(dataset.x!),
        y: parseInt(dataset.y!),
        rowIndex: parseInt(dataset.y!),
        trackSpecId: dataset.trackSpecId!,
        layerId: dataset.layerId!,
        assignedId: dataset.assignedId || null,
      },
      event
    );
  };

const getAssignmentColorProperty = (assignmentId: string) =>
  `--assignment-color-${assignmentId}`;
