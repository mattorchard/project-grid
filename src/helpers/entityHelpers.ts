import { v4 as uuidV4 } from "uuid";
import { palette, PaletteColor } from "../palette";
import { getNextYear, getNow, getWeekRanges } from "./dateHelpers";

const createId = () => uuidV4();

export const createBaseEntity = (fallbackNameSuffix?: string): BaseEntity => ({
  id: createId(),
  createdAt: Date.now(),
  name: fallbackNameSuffix ? `Unnamed ${fallbackNameSuffix}` : "Unnamed",
});

const asIds = (entities: BaseEntity[]) => entities.map((entity) => entity.id);
const asNames = (entities: BaseEntity[]) =>
  entities.map((entity) => entity.name);

export const createProject = (): Project => ({
  ...createBaseEntity("Project"),
  duration: 0,
  rowDates: [],
  layers: [],
  trackSpecifications: [],
  assignmentSepecifications: [],
  activeAssignmentSpecId: null,
});

const getLeastUsedColor = (
  assignments: ProjectAssignmentSpecification[]
): PaletteColor => {
  const colorUses = new Map(palette.map((color) => [color, 0]));
  assignments.forEach(({ color }) =>
    colorUses.set(color, colorUses.get(color)! + 1)
  );
  const colorEntries = [...colorUses.entries()];
  let [leastUsedColorEntry] = colorEntries;
  colorEntries.forEach(([color, usages]) => {
    if (leastUsedColorEntry[1] > usages) leastUsedColorEntry = [color, usages];
  });
  return leastUsedColorEntry[0];
};

export const createAssignment = (
  existingAssignments: ProjectAssignmentSpecification[]
): ProjectAssignmentSpecification => {
  const leastUsedColor = getLeastUsedColor(existingAssignments);
  return {
    ...createBaseEntity("Assignment"),
    color: leastUsedColor,
  };
};

export const createTrack = (): ProjectTrackSpecification =>
  createBaseEntity("Track");

export const createLayer = (
  trackSpecs: ProjectTrackSpecification[],
  duration: number
): ProjectLayer => ({
  ...createBaseEntity("Layer"),
  tracks: trackSpecs.map((trackSpec) => ({
    trackSpecId: trackSpec.id,
    cells: new Array(duration).fill(null),
  })),
  isVisible: true,
});

const chooseRandom = <ItemType>(array: ItemType[]): ItemType =>
  array[Math.floor(array.length * Math.random())];

export const createDemoProject = (): Project => {
  const rowDates = getWeekRanges(getNow(), getNextYear());
  const project: Project = {
    ...createProject(),
    duration: rowDates.length,
    rowDates,
    name: "Demo Project",
    trackSpecifications: [
      { ...createBaseEntity(), name: "Alehands" },
      { ...createBaseEntity(), name: "Britnafer" },
      { ...createBaseEntity(), name: "Carmichelle" },
      { ...createBaseEntity(), name: "Damasippus" },
    ],
    assignmentSepecifications: [
      { ...createBaseEntity(), name: "Basketball", color: "cyan" },
      { ...createBaseEntity(), name: "Polo", color: "blue" },
      { ...createBaseEntity(), name: "Tennis", color: "teal" },
    ],
    layers: [
      {
        ...createBaseEntity(),
        name: "Current plan",
        tracks: [],
        isVisible: true,
      },
      {
        ...createBaseEntity(),
        name: "Proposed plan",
        tracks: [],
        isVisible: false,
      },
    ],
  };
  const assignmentIds = asIds(project.assignmentSepecifications);
  project.layers.forEach(
    (layer) =>
      (layer.tracks = project.trackSpecifications.map((trackSpec) => ({
        trackSpecId: trackSpec.id,
        cells: new Array(project.duration).fill(null).map(() => {
          if (Math.random() < 0.25) return null;
          const assignedId = chooseRandom(assignmentIds);
          return { assignedId };
        }),
      })))
  );
  project.activeAssignmentSpecId = assignmentIds[0];
  return project;
};

export const updateEntity = <EntityType extends { id: string }>(
  array: EntityType[],
  idToUpdate: string,
  updater: (old: EntityType) => Partial<EntityType>
): EntityType[] => {
  let didUpdate = false;
  const newArray = array.map((item) => {
    if (item.id !== idToUpdate) return item;
    didUpdate = true;
    return { ...item, ...updater(item) };
  });
  return didUpdate ? newArray : array;
};

export const deleteEntity = <EntityType extends { id: string }>(
  array: EntityType[],
  idToDelete: string
) => {
  const newArray = array.filter((array) => array.id !== idToDelete);
  return newArray.length < array.length ? newArray : array;
};

export const updateArray = <ItemType>(
  array: ItemType[],
  indexToUpdate: number,
  newItem: ItemType
) => {
  if (indexToUpdate < 0 || indexToUpdate >= array.length)
    throw new Error(
      `Index out ${indexToUpdate} of bounds of array.length ${array.length}`
    );
  return array.map((item, index) => (index === indexToUpdate ? newItem : item));
};

const swapItemsAtIndex = <ItemType>(
  array: ItemType[],
  indexA: number,
  indexB: number
): void => {
  const temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
};

export const moveArrayItem = <ItemType>(
  array: ItemType[],
  itemToMovePredicate: (item: ItemType) => boolean,
  direction: MoveDirection
): ItemType[] => {
  const indexToMove = array.findIndex(itemToMovePredicate);
  if (indexToMove < 0) return array;
  if (direction === "up" && indexToMove === 0) return array;
  if (direction === "down" && indexToMove === array.length - 1) return array;
  const arrayCopy = [...array];
  const indexOffset = direction === "up" ? -1 : +1;
  swapItemsAtIndex(arrayCopy, indexToMove, indexToMove + indexOffset);
  return arrayCopy;
};

export const summarizeProject = (project: Project): ProjectSummary => ({
  id: project.id,
  name: project.name,
  createdAt: project.createdAt,
  layerNames: asNames(project.layers),
  assignmentNames: asNames(project.assignmentSepecifications),
  trackNames: asNames(project.trackSpecifications),
});
