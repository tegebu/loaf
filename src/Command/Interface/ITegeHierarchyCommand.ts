import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { ClosureTableHierarchies, ClosureTableHierarchy, TegeError, TegeID } from '@tegebu/syrup';
import { ICommand } from './ICommand';

export interface ITegeHierarchyCommand<D extends DataSourceError = DataSourceError> extends ICommand<'TegeHierarchyCommand'> {
  readonly noun: 'TegeHierarchyCommand';

  create(tege: ClosureTableHierarchy<TegeID>): Superposition<unknown, TegeError | D>;

  bulkCreate(teges: ClosureTableHierarchies<TegeID>): Superposition<unknown, TegeError | D>;

  delete(): Superposition<unknown, TegeError | D>;
}
