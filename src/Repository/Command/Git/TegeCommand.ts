import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError, TegeJSON, Teges } from '@tegebu/syrup';
import config from 'config';
import { inject, injectable } from 'inversify';
import { Types } from '../../../Container/Types';
import { GitError } from '../../../General/Git/Error/GitError';
import { IGit } from '../../../General/Git/Interface/IGit';
import { ILogger } from '../../../Infrastructure/Interface/ILogger';
import { ITegeCommand } from '../Interface/ITegeCommand';
import { IGitCommand } from './Interface/IGitCommand';

const all: string = config.get<string>('teges.path.all');
const hierarchies: string = config.get<string>('teges.path.hierarchies');
const remote: string = config.get<string>('teges.git.remote');
const branch: string = config.get<string>('teges.git.branch');

@injectable()
export class TegeCommand implements ITegeCommand<GitError>, IGitCommand {
  public readonly noun: 'TegeCommand' = 'TegeCommand';
  public readonly source: 'Git' = 'Git';
  private readonly tegeCommend: ITegeCommand;
  private readonly git: IGit;
  private readonly logger: ILogger;

  public constructor(
    @inject(Types.TegeFileCommand) tegeCommend: ITegeCommand,
    @inject(Types.Git) git: IGit,
    @inject(Types.Logger) logger: ILogger
  ) {
    this.tegeCommend = tegeCommend;
    this.git = git;
    this.logger = logger;
  }

  public bulkCreate(teges: Teges): Superposition<unknown, TegeError | GitError> {
    return this.tegeCommend.bulkCreate(teges).map<void, TegeError | GitError | DataSourceError>(async () => {
      await this.git.add([all, hierarchies]);

      const names: Array<string> = teges.toJSON().map((j: TegeJSON) => {
        return j.name;
      });

      await this.git.commit(`CREATED ${teges.size()} items, ${names.join(', ')}`);

      return this.git.push(remote, branch);
    }, GitError).recover<unknown, TegeError | GitError>((err: TegeError | DataSourceError) => {
      if (err instanceof GitError) {
        this.logger.error('SOME Git OPERATION MAY BE INCORRECT');

        throw err;
      }
      if (err instanceof DataSourceError) {
        this.logger.error('tegeCommend THREW DataSourceError');

        throw new TegeError(err.message, err);
      }

      throw err;
    }, TegeError, GitError);
  }

  // TODO UNIMPLEMENTED YET
  public delete(): Superposition<unknown, TegeError | GitError> {
    return this.tegeCommend.delete().recover<unknown, TegeError | GitError>((err: TegeError | DataSourceError) => {
      if (err instanceof DataSourceError) {
        this.logger.error('tegeCommend THREW DataSourceError');

        throw new TegeError(err.message, err);
      }

      throw err;
    });
  }
}

