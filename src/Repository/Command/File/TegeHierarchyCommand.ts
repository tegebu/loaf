import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Superposition } from '@jamashita/publikum-monad';
import { ClosureTableHierarchies } from '@jamashita/publikum-tree';
import { TegeError, TegeID } from '@tegebu/syrup';
import config from 'config';
import { inject, injectable } from 'inversify';
import { Types } from '../../../Container/Types';
import { FileError } from '../../../General/File/Error/FileError';
import { IFile } from '../../../General/File/Interface/IFile';
import { ILogger } from '../../../Infrastructure/Interface/ILogger';
import { ITegeHierarchyCommand } from '../Interface/ITegeHierarchyCommand';
import { IFileCommand } from './Interface/IFileCommand';

const path: string = config.get<string>('teges.hierarchy.path');

@injectable()
export class TegeHierarchyCommand implements ITegeHierarchyCommand<FileError>, IFileCommand {
  public readonly noun: 'TegeHierarchyCommand' = 'TegeHierarchyCommand';
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

  public bulkCreate(hierarchies: ClosureTableHierarchies<TegeID>): Superposition<unknown, TegeError | FileError> {
    return Superposition.playground<string, JSONAError>(() => {
      return JSONA.stringify(hierarchies.toJSON());
    }, JSONAError).map<unknown, JSONAError | FileError>((str: string) => {
      return this.file.write(path, str);
    }, FileError).recover<unknown, TegeError | FileError>((err: JSONAError | FileError) => {
      if (err instanceof JSONAError) {
        this.logger.error('JSON IS BROKEN');

        throw new TegeError('THESE HIERARCHIES CANNOT BE CONVERTED TO JSON');
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
    }, TegeError);
  }
}
