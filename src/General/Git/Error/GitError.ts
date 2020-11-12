import { DataSourceError } from '@jamashita/publikum-error';

export class GitError extends DataSourceError<'GitError', 'Git'> {
  public constructor(message: string, cause?: Error) {
    super('GitError', 'Git', message, cause);
  }
}
