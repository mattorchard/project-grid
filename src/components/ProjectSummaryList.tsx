import { h, FunctionComponent } from "preact";
import { useProjectSummaries } from "../hooks/useProjectSummaries";

export const ProjectSummaryList: FunctionComponent<{
  onChooseProject: (projectId: string) => void;
}> = ({ onChooseProject }) => {
  const projectSummaries = useProjectSummaries();
  return projectSummaries ? (
    <ol className="project-summary-list">
      {projectSummaries.map((project) => (
        <li key={project.id}>
          <button
            type="button"
            className="card link-button"
            onClick={() => onChooseProject(project.id)}
          >
            <div className="h3">{project.name}</div>
            <time
              dateTime={new Date(project.createdAt).toISOString()}
              className="subtle-message"
            >
              {new Date(project.createdAt).toDateString()}
            </time>
          </button>
        </li>
      ))}
    </ol>
  ) : (
    <p>Loading projects</p>
  );
};
