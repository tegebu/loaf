import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError } from '@tegebu/syrup';
import { ITegeHierarchyCommand } from '../Interface/ITegeHierarchyCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockTegeHierarchyCommand implements ITegeHierarchyCommand, IMockCommand {
  public readonly noun: 'TegeHierarchyCommand' = 'TegeHierarchyCommand';
  public readonly source: 'Mock' = 'Mock';

  public bulkCreate(): Superposition<unknown, TegeError | DataSourceError> {
    throw new UnimplementedError();
  }

  public delete(): Superposition<unknown, TegeError | DataSourceError> {
    throw new UnimplementedError();
  }
}
