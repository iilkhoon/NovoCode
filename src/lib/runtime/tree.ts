import type { FileSystemTree, DirectoryNode } from "@webcontainer/api";

export function toFileSystemTree(files: Record<string, string>): FileSystemTree {
  const root: FileSystemTree = {};
  for (const [p, contents] of Object.entries(files)) {
    const parts = p.split("/").filter(Boolean);
    let dir = root;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) dir[part] = { file: { contents } };
      else {
        const node = (dir[part] ??= { directory: {} }) as DirectoryNode;
        dir = node.directory;
      }
    });
  }
  return root;
}
