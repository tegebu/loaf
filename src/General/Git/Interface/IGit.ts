export interface IGit {
  add(files: Array<string>): Promise<void>;

  commit(message: string): Promise<void>;

  push(remote: string, branch: string): Promise<void>;
}

