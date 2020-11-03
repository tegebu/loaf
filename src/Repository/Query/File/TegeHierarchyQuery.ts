import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Superposition } from '@jamashita/publikum-monad';
import { ClosureTableHierarchies, ClosureTableJSON } from '@jamashita/publikum-tree';
import { TegeError, TegeID } from '@tegebu/syrup';
import config from 'config';
import { inject, injectable } from 'inversify';
import { Types } from '../../../Container/Types';
import { ITegeIDFactory } from '../../../Factory/Interface/TegeIDFactory';
import { FileError } from '../../../General/Error/FileError';
import { IFile } from '../../../General/Interface/IFile';
import { ILogger } from '../../../Infrastructure/Interface/ILogger';
import { IFileCommand } from '../../Command/File/Interface/IFileCommand';
import { ITegeHierarchyQuery } from '../Interface/ITegeHierarchyQuery';

const path: string = config.get<string>('teges.hierarchy.path');

@injectable()
export class TegeHierarchyQuery implements ITegeHierarchyQuery<FileError>, IFileCommand {
  public readonly noun: 'TegeHierarchyQuery' = 'TegeHierarchyQuery';
  public readonly source: 'File' = 'File';
  private readonly factory: ITegeIDFactory;
  private readonly file: IFile;
  private readonly logger: ILogger;

  public constructor(
    @inject(Types.TegeIDFactory) factory: ITegeIDFactory,
    @inject(Types.File) file: IFile,
    @inject(Types.Logger) logger: ILogger
  ) {
    this.factory = factory;
    this.file = file;
    this.logger = logger;
  }

  public all(): Superposition<ClosureTableHierarchies<TegeID>, TegeError | FileError> {
    return Superposition.playground<boolean, FileError>(() => {
      return this.file.exists(path);
    }, FileError).map<string, FileError>((exists: boolean) => {
      if (exists) {
        return this.file.read(path);
      }

      throw new FileError(`NO SUCH FILE. GIVEN: ${path}`);
    }).map<ReadonlyArray<ClosureTableJSON>, JSONAError | FileError>((str: string) => {
      return JSONA.parse<ReadonlyArray<ClosureTableJSON>>(str);
    }, JSONAError).map<ClosureTableHierarchies<TegeID>, TegeError | JSONAError | FileError>((json: ReadonlyArray<ClosureTableJSON>) => {
      return ClosureTableHierarchies.ofJSON(json, this.factory);
    }, TegeError).recover<ClosureTableHierarchies<TegeID>, TegeError | FileError>((err: TegeError | JSONAError | FileError) => {
      if (err instanceof JSONAError) {
        this.logger.error('JSON IS BROKEN');

        throw new TegeError('THESE HIERARCHIES CANNOT BE CONVERTED TO JSON');
      }

      throw err;
    }, TegeError, FileError);
  }
}
