import { PaletteColor } from "./palette";

declare global {
  interface SimpleDate {
    year: number;
    month: number;
    day: number;
  }

  interface BaseEntity {
    id: string;
    name: string;
    createdAt: number;
  }

  interface SimpleDateRange {
    start: SimpleDate;
    end: SimpleDate;
  }

  interface Project extends BaseEntity {
    duration: number;
    rowDates: SimpleDateRange[];
    layers: ProjectLayer[];
    trackSpecifications: ProjectTrackSpecification[];
    assignmentSepecifications: ProjectAssignmentSpecification[];
    activeAssignmentSpecId: string | null;
  }
  interface ProjectSummary extends BaseEntity {
    layerNames: string[];
    trackNames: string[];
    assignmentNames: string[];
  }

  interface ProjectTrackSpecification extends BaseEntity {}

  interface ProjectAssignmentSpecification extends BaseEntity {
    color: PaletteColor;
  }

  interface ProjectLayerTrackCell {
    assignedId: string;
  }

  interface ProjectLayerTrack {
    trackSpecId: string;
    cells: (ProjectLayerTrackCell | null)[];
  }

  interface ProjectLayer extends BaseEntity {
    tracks: ProjectLayerTrack[];
    isVisible: boolean;
  }
}
export {};
