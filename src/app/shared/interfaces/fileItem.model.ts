export interface FileItem {
  name: string;
  path: string;
  isFolder: boolean;
  expanded: boolean;
  children?: FileItem[];
}