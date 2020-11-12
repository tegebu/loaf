import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError } from '@tegebu/syrup';
import { ITegeInteractor } from '../Interface/ITegeInteractor';

export class MockTegeInteractor implements ITegeInteractor {
  public readonly noun: 'TegeInteractor' = 'TegeInteractor';

  public save(): Superposition<unknown, TegeError | DataSourceError> {
    throw new UnimplementedError();
  }

  public create(): Superposition<unknown, TegeError | DataSourceError> {
    throw new UnimplementedError();
  }
}
