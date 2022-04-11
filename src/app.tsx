import { Fragment, h } from "preact";
import { useState } from "preact/hooks";
import { Box } from "./components/Box";
import { NewProjectForm } from "./components/NewProjectForm";
import { ProjectEditor } from "./components/ProjectEditor";
import { ProjectSummaryList } from "./components/ProjectSummaryList";
import { ProjectContextProvider } from "./contexts/ProjectContext";
import { getProject } from "./helpers/ProjectRepository";

export const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialProject, setInitialProject] = useState<Project | null>(null);

  const handleChooseProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      setInitialProject(await getProject(projectId));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (initialProject) {
    return (
      <ProjectContextProvider initialProject={initialProject}>
        <ProjectEditor />
      </ProjectContextProvider>
    );
  }

  return (
    <Box flexDirection="column" alignItems="center" p={2}>
      <Box as="section" flexDirection="column" inline mb={2}>
        <Box as="h2" className="h2" mb={0.5} mx="auto">
          Choose an existing project
        </Box>
        <ProjectSummaryList onChooseProject={handleChooseProject} />
      </Box>
      <Box as="section" flexDirection="column" inline>
        <Box as="h2" className="h2" mb={0.5}>
          Start a new project
        </Box>
        <NewProjectForm onSubmit={setInitialProject} />
      </Box>
    </Box>
  );
};
