import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { ClosureTableHierarchies } from '@jamashita/publikum-tree';
import { TegeError, TegeID } from '@tegebu/syrup';
import { IQuery } from './IQuery';

export interface ITegeHierarchyQuery<D extends DataSourceError = DataSourceError> extends IQuery<'TegeHierarchyQuery'> {
  readonly noun: 'TegeHierarchyQuery';

  all(): Superposition<ClosureTableHierarchies<TegeID>, TegeError | D>;
}
