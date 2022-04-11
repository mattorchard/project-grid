import { h, createContext, FunctionComponent } from "preact";
import { useProjectState } from "../hooks/useProjectState";
import { useSafeContext } from "../hooks/useSafeContext";

const ProjectContext = createContext<
  ReturnType<typeof useProjectState> | undefined
>(undefined);
ProjectContext.displayName = "ProjectContext";

export const ProjectContextProvider: FunctionComponent<{
  initialProject: Project;
}> = ({ initialProject, children }) => {
  const value = useProjectState(initialProject);
  return <ProjectContext.Provider value={value} children={children} />;
};

export const useProjectContext = () => useSafeContext(ProjectContext);
