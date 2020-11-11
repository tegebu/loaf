import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError, Teges } from '@tegebu/syrup';
import { IQuery } from './IQuery';

export interface ITegeQuery<D extends DataSourceError = DataSourceError> extends IQuery<'TegeQuery'> {
  readonly noun: 'TegeQuery';

  all(): Superposition<Teges, TegeError | D>;
}
