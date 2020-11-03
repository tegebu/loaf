import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError, Teges } from '@tegebu/syrup';
import { ITegeQuery } from '../Interface/ITegeQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockTegeQuery implements ITegeQuery, IMockQuery {
  public readonly noun: 'TegeQuery' = 'TegeQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Teges, TegeError | DataSourceError> {
    throw new UnimplementedError();
  }
}
