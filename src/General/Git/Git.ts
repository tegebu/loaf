import { GitError as GError, gitP } from 'simple-git';
import { SimpleGit } from 'simple-git/promise';
import { GitError } from './Error/GitError';
import { IGit } from './Interface/IGit';

const git: SimpleGit = gitP();

export class Git implements IGit {
  public async add(files: Array<string>): Promise<void> {
    try {
      await git.add(files);
      return;
    }
    catch (err: unknown) {
      if (err instanceof GError) {
        throw new GitError(err.message, err);
      }

      throw err;
    }
  }

  public async commit(message: string): Promise<void> {
    try {
      await git.commit(message);

      return;
    }
    catch (err: unknown) {
      if (err instanceof GError) {
        throw new GitError(err.message, err);
      }

      throw err;
    }

  }

  public async push(remote: string, branch: string): Promise<void> {
    try {
      await git.push(remote, branch);

      return;
    }
    catch (err: unknown) {
      if (err instanceof GError) {
        throw new GitError(err.message, err);
      }

      throw err;
    }
  }
}

