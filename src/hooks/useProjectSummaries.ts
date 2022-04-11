import { useEffect, useState } from "preact/hooks";
import {
  listProjectSummaries,
  setupDemoProject,
} from "../helpers/ProjectRepository";

export const useProjectSummaries = () => {
  const [projectSummaries, setProjectSummaries] = useState<
    ProjectSummary[] | null
  >(null);

  useEffect(() => {
    (async () => {
      try {
        await setupDemoProject();
        const summaries = await listProjectSummaries();
        setProjectSummaries(summaries);
      } catch (error) {
        console.error(`Failed to load project summaries`);
      }
    })();
  }, []);

  return projectSummaries;
};
