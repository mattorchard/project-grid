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

  interface Project extends BaseEntity {
    startDate: SimpleDate;
    duration: number;
    layers: ProjectLayer[];
    trackSpecifications: ProjectTrackSpecification[];
    assignmentSepecifications: ProjectAssignmentSpecification[];
    activeAssignmentSpecId: string | null;
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
