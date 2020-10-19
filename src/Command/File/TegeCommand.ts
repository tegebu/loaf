import { DataSourceError } from '@jamashita/publikum-error';
import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError, Teges } from '@tegebu/syrup';
import config from 'config';
import { inject, injectable } from 'inversify';
import { Types } from '../../Container/Types';
import { FileError } from '../../General/Error/FileError';
import { IFile } from '../../General/Interface/IFile';
import { ILogger } from '../../Infrastructure/Interface/ILogger';
import { ITegeCommand } from '../Interface/ITegeCommand';
import { IFileCommand } from './Interface/IFileCommand';

const path: string = config.get<string>('teges.path');

@injectable()
export class TegeCommand implements ITegeCommand<FileError>, IFileCommand {
  public readonly noun: 'TegeCommand' = 'TegeCommand';
  public readonly source: 'File' = 'File';
  private readonly file: IFile;
  private readonly logger: ILogger;

  public constructor(
    @inject(Types.File) file: IFile,
    @inject(Types.Logger) logger: ILogger
  ) {
    this.file = file;
    this.logger = logger;
  }

  public bulkCreate(teges: Teges): Superposition<unknown, TegeError | FileError> {
    return Superposition.playground<string, JSONAError>(() => {
      return JSONA.stringify(teges.toJSON());
    }, JSONAError).map<unknown, JSONAError | FileError>((str: string) => {
      return this.file.write(path, str);
    }, FileError).recover<unknown, TegeError | FileError>((err: TegeError | JSONAError | FileError | DataSourceError) => {
      if (err instanceof JSONAError) {
        this.logger.error('JSON IS BROKEN');

        throw new TegeError('THIS TEGE CANNOT BE CONVERTED TO JSON');
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
    }, TegeError).recover<unknown, TegeError | FileError>((err: TegeError | FileError | DataSourceError) => {
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

