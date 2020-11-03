import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { ClosureTableHierarchies } from '@jamashita/publikum-tree';
import { TegeError, TegeID } from '@tegebu/syrup';
import { ITegeHierarchyQuery } from '../Interface/ITegeHierarchyQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockTegeHierarchyQuery implements ITegeHierarchyQuery, IMockQuery {
  public readonly noun: 'TegeHierarchyQuery' = 'TegeHierarchyQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<ClosureTableHierarchies<TegeID>, TegeError | DataSourceError> {
    throw new UnimplementedError();
  }
}
