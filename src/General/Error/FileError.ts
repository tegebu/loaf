import { DataSourceError } from '@jamashita/publikum-error';

export class FileError extends DataSourceError<'FileError', 'File'> {
  public readonly noun: 'FileError' = 'FileError';

  public constructor(message: string, cause?: NodeJS.ErrnoException) {
    super('FileError', 'File', message, cause);
  }
}
