import { h, createContext, FunctionComponent } from "preact";
import { useEffect } from "preact/hooks";
import { useProjectState } from "../hooks/useProjectState";
import { useSafeContext } from "../hooks/useSafeContext";

const ProjectContext = createContext<
  ReturnType<typeof useProjectState> | undefined
>(undefined);
ProjectContext.displayName = "ProjectContext";

export const ProjectContextProvider: FunctionComponent<{}> = ({ children }) => {
  const value = useProjectState();
  useEffect(() => {
    console.debug("Project", value.project);
  }, [value.project]);
  return <ProjectContext.Provider value={value} children={children} />;
};

export const useProjectContext = () => useSafeContext(ProjectContext);
