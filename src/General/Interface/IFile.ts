export interface IFile {
  read(path: string): Promise<string>;

  write(path: string, data: string): Promise<void>;

  exists(path: string): Promise<boolean>;
}
