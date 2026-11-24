/** Engineering review references only. Feature prose remains the instruction source. */
export type GuidanceSource = {
  id: string;
  title: string;
  sourceFiles: readonly string[];
  sourceDirectories?: readonly string[];
  guides: readonly string[];
  reviewWith: readonly { file: string; guides: readonly string[] }[];
};

/** Node keys include their kind: question:platform and result:platform differ. */
export type GuidanceDependency = { sourceId: string; nodes: readonly string[] };
