import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError } from '@tegebu/syrup';
import { ITegeCommand } from '../Interface/ITegeCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockTegeCommand implements ITegeCommand, IMockCommand {
  public readonly noun: 'TegeCommand' = 'TegeCommand';
  public readonly source: 'Mock' = 'Mock';

  public bulkCreate(): Superposition<unknown, TegeError | DataSourceError> {
    throw new UnimplementedError();
  }

  public delete(): Superposition<unknown, TegeError | DataSourceError> {
    throw new UnimplementedError();
  }
}
