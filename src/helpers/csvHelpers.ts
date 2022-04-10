import { simpleDateToString } from "./dateHelpers";

export const downloadFile = async (file: File) => {
  const href = URL.createObjectURL(file);
  try {
    const anchor = document.createElement("a");
    anchor.setAttribute("download", file.name);
    anchor.setAttribute("href", href);
    anchor.click();
  } finally {
    URL.revokeObjectURL(href);
  }
};

export const asCsvFile = ({
  fileName,
  content,
}: {
  fileName: string;
  content: string;
}): File => new File([content], `${fileName}.csv`);

const csvEscape = (text: string) => {
  // Not required, but keeps this simple
  const quotesRemoved = text.replace(/"/g, "'");
  if (/,/.test(text)) {
    // Wrap with double quotes
    return `"${quotesRemoved}"`;
  }

  return quotesRemoved;
};

const toCsvText = (rows: any[][]) =>
  `${rows
    .map((row) => row.map((cell) => csvEscape(cell.toString())).join(","))
    .join("\r\n")}`;

const jsonClone = <T>(stringifiableData: T): T =>
  JSON.parse(JSON.stringify(stringifiableData));

export const downloadProjectAsCsv = (project: Project) => {
  const headerRow = [
    "Start Date",
    "End Date",
    ...project.trackSpecifications.map((track) => track.name),
  ];
  const bodyRowsBase = new Array(project.duration)
    .fill(null)
    .map((_, rowIndex) => [
      simpleDateToString(project.rowDates[rowIndex].start),
      simpleDateToString(project.rowDates[rowIndex].start),
    ]);
  const assignmentNames = new Map(
    project.assignmentSepecifications.map((assignSpec) => [
      assignSpec.id,
      assignSpec.name,
    ])
  );

  project.layers.map(async (layer) => {
    const layerBodyRows = jsonClone(bodyRowsBase);
    layer.tracks.forEach((track) =>
      track.cells.forEach((cell, rowIndex) => {
        const cellText = cell && assignmentNames.get(cell.assignedId);
        layerBodyRows[rowIndex].push(cellText || "");
      })
    );
    const rowData = [headerRow, ...layerBodyRows];
    const csvText = toCsvText(rowData);

    const fileName =
      project.layers.length > 1
        ? `${project.name}_${layer.name}`
        : project.name;
    downloadFile(asCsvFile({ fileName, content: csvText }));
  });
};
