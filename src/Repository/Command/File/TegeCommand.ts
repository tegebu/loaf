import { DataSourceError } from '@jamashita/publikum-error';
import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError, Teges } from '@tegebu/syrup';
import config from 'config';
import { inject, injectable } from 'inversify';
import { Types } from '../../../Container/Types';
import { FileError } from '../../../General/File/Error/FileError';
import { IFile } from '../../../General/File/Interface/IFile';
import { ILogger } from '../../../Infrastructure/Interface/ILogger';
import { ITegeCommand } from '../Interface/ITegeCommand';
import { ITegeHierarchyCommand } from '../Interface/ITegeHierarchyCommand';
import { IFileCommand } from './Interface/IFileCommand';

const path: string = config.get<string>('teges.path.all');

@injectable()
export class TegeCommand implements ITegeCommand<FileError>, IFileCommand {
  public readonly noun: 'TegeCommand' = 'TegeCommand';
  public readonly source: 'File' = 'File';
  private readonly hierarchyCommand: ITegeHierarchyCommand;
  private readonly file: IFile;
  private readonly logger: ILogger;

  public constructor(
    @inject(Types.TegeHierarchyFileCommand) hierarchyCommand: ITegeHierarchyCommand,
    @inject(Types.File) file: IFile,
    @inject(Types.Logger) logger: ILogger
  ) {
    this.hierarchyCommand = hierarchyCommand;
    this.file = file;
    this.logger = logger;
  }

  public bulkCreate(teges: Teges): Superposition<unknown, TegeError | FileError> {
    return Superposition.playground<string, JSONAError>(() => {
      return JSONA.stringify(teges.toJSON());
    }, JSONAError).map<unknown, JSONAError | FileError>((str: string) => {
      return this.file.write(path, str);
    }, FileError).map(() => {
      return this.hierarchyCommand.bulkCreate(teges.toHierarchies());
    }).recover<unknown, TegeError | FileError>((err: TegeError | JSONAError | FileError | DataSourceError) => {
      if (err instanceof JSONAError) {
        this.logger.error('JSON IS BROKEN');

        throw new TegeError('THESE TEGES CANNOT BE CONVERTED TO JSON');
      }
      if (err instanceof FileError) {
        throw err;
      }
      if (err instanceof DataSourceError) {
        this.logger.error('hierarchyCommand THREW DataSourceError');

        throw new TegeError(err.message, err);
      }

      throw err;
    }, TegeError, FileError);
  }

  public delete(): Superposition<unknown, TegeError | FileError> {
    return Superposition.playground<boolean, FileError>(() => {
      return this.file.exists(path);
    }, FileError).map<unknown, TegeError | FileError>((exists: boolean) => {
      if (!exists) {
        this.logger.warn('FILE DOES NOT EXIST');
      }

      return this.file.write(path, '');
    }).map(() => {
      return this.hierarchyCommand.delete();
    }).recover<unknown, TegeError | FileError>((err: TegeError | FileError | DataSourceError) => {
      if (err instanceof FileError) {
        throw err;
      }
      if (err instanceof DataSourceError) {
        this.logger.error('hierarchyCommand THREW DataSourceError');

        throw new TegeError(err.message, err);
      }

      throw err;
    }, TegeError, FileError);
  }
}

