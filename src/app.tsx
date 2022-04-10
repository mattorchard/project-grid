import { h } from "preact";
import { ProjectEditor } from "./components/ProjectEditor";
import { ProjectContextProvider } from "./contexts/ProjectContext";

export const App = () => {
  return (
    <ProjectContextProvider>
      <ProjectEditor />
    </ProjectContextProvider>
  );
};
