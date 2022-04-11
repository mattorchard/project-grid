import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import {
  createAssignment,
  createDemoProject,
  createLayer,
  createTrack,
  deleteEntity,
  moveArrayItem,
  updateArray,
  updateEntity,
} from "../helpers/entityHelpers";
import { saveProject } from "../helpers/ProjectRepository";
import { debounce } from "../helpers/timingHelpers";

import { PaletteColor } from "../palette";

export interface AssignmentChangeTarget {
  trackSpecId: string;
  layerId: string;
  rowIndex: number;
  assignedId: string | null;
}

const saveProjectDebounced = debounce(saveProject, 2_000);

export const useProjectState = (initialProject: Project) => {
  const [project, setProject] = useState(initialProject);

  useEffect(() => {
    saveProjectDebounced(project);
  }, [project]);

  const updateProject = useCallback(
    (createPatch: (oldProject: Project) => Partial<Project>) =>
      setProject((oldProject) => ({
        ...oldProject,
        ...createPatch(oldProject),
      })),
    []
  );

  const actions = useMemo(
    () => ({
      changeLayerAssignment: (target: AssignmentChangeTarget) =>
        updateProject((oldProject) => ({
          layers: updateEntity(
            oldProject.layers,
            target.layerId,
            (oldLayer) => ({
              tracks: oldLayer.tracks.map((oldTrack) =>
                oldTrack.trackSpecId === target.trackSpecId
                  ? {
                      ...oldTrack,
                      cells: updateArray(
                        oldTrack.cells,
                        target.rowIndex,
                        target.assignedId
                          ? {
                              assignedId: target.assignedId,
                            }
                          : null
                      ),
                    }
                  : oldTrack
              ),
            })
          ),
        })),

      renameProject: (name: string) => updateProject(() => ({ name })),

      renameAssignSpec: (assignSpecId: string, name: string) =>
        updateProject((oldProject) => ({
          assignmentSepecifications: updateEntity(
            oldProject.assignmentSepecifications,
            assignSpecId,
            () => ({ name })
          ),
        })),

      recolorAssignSpec: (assignSpecId: string, color: PaletteColor) =>
        updateProject((oldProject) => ({
          assignmentSepecifications: updateEntity(
            oldProject.assignmentSepecifications,
            assignSpecId,
            () => ({ color })
          ),
        })),

      addAssignSpec: () =>
        updateProject((oldProject) => ({
          assignmentSepecifications: [
            ...oldProject.assignmentSepecifications,
            createAssignment(oldProject.assignmentSepecifications),
          ],
        })),

      activateAssignment: (assignSpecId: string | null) =>
        updateProject(() => ({ activeAssignmentSpecId: assignSpecId })),

      removeAssignSpec: (assignSpecId: string) =>
        updateProject((oldProject) => ({
          activeAssignmentSpecId:
            oldProject.activeAssignmentSpecId === assignSpecId
              ? null
              : oldProject.activeAssignmentSpecId,
          assignmentSepecifications: deleteEntity(
            oldProject.assignmentSepecifications,
            assignSpecId
          ),
          layers: oldProject.layers.map((layer) => ({
            ...layer,
            tracks: layer.tracks.map((track) => ({
              ...track,
              cells: track.cells.map((cell) =>
                cell?.assignedId === assignSpecId ? null : cell
              ),
            })),
          })),
        })),

      renameTrackSpec: (trackSpecId: string, name: string) =>
        updateProject((oldProject) => ({
          trackSpecifications: updateEntity(
            oldProject.trackSpecifications,
            trackSpecId,
            () => ({ name })
          ),
        })),

      moveTrackSpec: (trackSpecId: string, direction: MoveDirection) =>
        updateProject((oldProject) => ({
          trackSpecifications: moveArrayItem(
            oldProject.trackSpecifications,
            (t) => t.id === trackSpecId,
            direction
          ),
          layers: oldProject.layers.map((layer) => ({
            ...layer,
            tracks: moveArrayItem(
              layer.tracks,
              (t) => t.trackSpecId === trackSpecId,
              direction
            ),
          })),
        })),

      addTrackSpec: () =>
        updateProject((oldProject) => {
          const newTrack = createTrack();
          return {
            trackSpecifications: [...oldProject.trackSpecifications, newTrack],
            layers: oldProject.layers.map((layer) => ({
              ...layer,
              tracks: [
                ...layer.tracks,
                {
                  trackSpecId: newTrack.id,
                  cells: new Array(oldProject.duration).fill(null),
                },
              ],
            })),
          };
        }),

      removeTrackSpec: (trackSpecId: string) =>
        updateProject((oldProject) => ({
          trackSpecifications: deleteEntity(
            oldProject.trackSpecifications,
            trackSpecId
          ),
          layers: oldProject.layers.map((layer) => ({
            ...layer,
            tracks: layer.tracks.filter(
              (track) => track.trackSpecId !== trackSpecId
            ),
          })),
        })),

      removeLayer: (layerId: string) =>
        updateProject((oldProject) => ({
          layers: deleteEntity(oldProject.layers, layerId),
        })),

      setLayerVisibility: (layerId: string, isVisible: boolean) =>
        updateProject((oldProject) => ({
          layers: updateEntity(oldProject.layers, layerId, () => ({
            isVisible,
          })),
        })),

      renameLayer: (layerId: string, name: string) =>
        updateProject((oldProject) => ({
          layers: updateEntity(oldProject.layers, layerId, () => ({ name })),
        })),

      moveLayer: (layerId: string, direction: MoveDirection) =>
        updateProject((oldProject) => ({
          layers: moveArrayItem(
            oldProject.layers,
            (layer) => layer.id === layerId,
            direction
          ),
        })),

      addLayer: () =>
        updateProject((oldProject) => ({
          layers: [
            ...oldProject.layers.map((layer) => ({
              ...layer,
              isVisible: false,
            })),
            createLayer(oldProject.trackSpecifications, oldProject.duration),
          ],
        })),
    }),
    [updateProject]
  );
  return { project, ...actions };
};
