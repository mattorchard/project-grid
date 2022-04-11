import { DBSchema, openDB } from "idb";
import { createDemoProject, summarizeProject } from "./entityHelpers";

interface ProjectRepository extends DBSchema {
  projectSummaries: {
    key: string;
    value: ProjectSummary;
    indexes: {
      createdAt: number;
    };
  };
  projects: {
    key: string;
    value: Project;
  };
}
const dbPromise = openDB<ProjectRepository>("PROJECT_DB_V1", 1, {
  upgrade(db) {
    db.createObjectStore("projectSummaries", {
      keyPath: "id",
    }).createIndex("createdAt", "createdAt");

    db.createObjectStore("projects", {
      keyPath: "id",
    });
  },
});

export const setupDemoProject = async () => {
  const db = await dbPromise;
  const summaryCount = await db.count("projectSummaries");
  if (summaryCount > 0) return;
  await saveProject(createDemoProject());
};

export const listProjectSummaries = async (): Promise<ProjectSummary[]> => {
  const db = await dbPromise;
  const summaries = await db.getAllFromIndex("projectSummaries", "createdAt");
  return summaries;
};

export const getProject = async (projectId: string): Promise<Project> => {
  const db = await dbPromise;
  const project = await db.get("projects", projectId);
  if (!project) throw new Error(`No project with ID ${projectId}`);
  return project;
};

export const saveProject = async (project: Project) => {
  const db = await dbPromise;

  const transaction = db.transaction(
    ["projectSummaries", "projects"],
    "readwrite"
  );
  const projectSummary = summarizeProject(project);
  transaction.objectStore("projectSummaries").put(projectSummary);
  transaction.objectStore("projects").put(project);
  await transaction.done;
  console.debug("Saved", project);
};
