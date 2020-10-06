import fs from 'fs';
import { FileError } from './Error/FileError';
import { IFile } from './Interface/IFile';

export class File implements IFile {
  public async read(path: string): Promise<string> {
    try {
      const buf: Buffer = await fs.promises.readFile(path);

      return buf.toString('utf-8');
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new FileError(err.message, err);
      }

      throw err;
    }
  }

  public async write(path: string, data: string): Promise<void> {
    try {
      return await fs.promises.writeFile(path, data);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new FileError(err.message, err);
      }

      throw err;
    }
  }

  public async exists(path: string): Promise<boolean> {
    try {
      // eslint-disable-next-line no-bitwise
      await fs.promises.access(path, fs.constants.R_OK | fs.constants.W_OK);

      return true;
    }
    catch (err: unknown) {
      return false;
    }
  }
}
