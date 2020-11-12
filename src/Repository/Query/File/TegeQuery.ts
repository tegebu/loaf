import { ImmutableSequence, Sequence } from '@jamashita/publikum-collection';
import { DataSourceError } from '@jamashita/publikum-error';
import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Superposition } from '@jamashita/publikum-monad';
import { ClosureTable, ClosureTableHierarchies } from '@jamashita/publikum-tree';
import { Tege, TegeError, TegeID, TegeJSON, Teges } from '@tegebu/syrup';
import config from 'config';
import { inject, injectable } from 'inversify';
import { Types } from '../../../Container/Types';
import { FileError } from '../../../General/File/Error/FileError';
import { IFile } from '../../../General/File/Interface/IFile';
import { ILogger } from '../../../Infrastructure/Interface/ILogger';
import { ITegeHierarchyQuery } from '../Interface/ITegeHierarchyQuery';
import { ITegeQuery } from '../Interface/ITegeQuery';
import { IFileQuery } from './Interface/IFileQuery';

const path: string = config.get<string>('teges.path.all');

@injectable()
export class TegeQuery implements ITegeQuery<FileError>, IFileQuery {
  public readonly noun: 'TegeQuery' = 'TegeQuery';
  public readonly source: 'File' = 'File';
  private readonly hierarchyQuery: ITegeHierarchyQuery;
  private readonly file: IFile;
  private readonly logger: ILogger;

  public constructor(
    @inject(Types.TegeHierarchyFileQuery) hierarchyQuery: ITegeHierarchyQuery,
    @inject(Types.File) file: IFile,
    @inject(Types.Logger) logger: ILogger
  ) {
    this.hierarchyQuery = hierarchyQuery;
    this.file = file;
    this.logger = logger;
  }

  public all(): Superposition<Teges, TegeError | FileError> {
    return Superposition.playground<boolean, FileError>(() => {
      return this.file.exists(path);
    }, FileError).map<string, FileError>((exists: boolean) => {
      if (exists) {
        return this.file.read(path);
      }

      throw new FileError(`NO SUCH FILE. GIVEN: ${path}`);
    }).map<ReadonlyArray<TegeJSON>, JSONAError | FileError>((str: string) => {
      return JSONA.parse<ReadonlyArray<TegeJSON>>(str);
    }, JSONAError).map<Teges, TegeError | JSONAError | FileError | DataSourceError>((json: ReadonlyArray<TegeJSON>) => {
      const array: Array<Tege> = json.map<Tege>((j: TegeJSON) => {
        return Tege.ofJSON(j);
      });
      const sequence: Sequence<Tege> = ImmutableSequence.ofArray<Tege>(array);

      return this.hierarchyQuery.all().map<Teges, TegeError | DataSourceError>((hierarchies: ClosureTableHierarchies<TegeID>) => {
        return Teges.ofTable(ClosureTable.of<TegeID>(hierarchies), sequence);
      });
    }).recover<Teges, TegeError | FileError>((err: TegeError | FileError | JSONAError | DataSourceError) => {
      if (err instanceof JSONAError) {
        this.logger.error('JSON IS BROKEN');

        throw new TegeError('THESE TEGES CANNOT BE CONVERTED TO JSON');
      }
      if (err instanceof FileError) {
        throw err;
      }
      if (err instanceof DataSourceError) {
        this.logger.error('hierarchyQuery THREW DataSourceError');

        throw new TegeError(err.message, err);
      }

      throw err;
    }, TegeError, FileError);
  }
}
