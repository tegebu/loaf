import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError, Teges } from '@tegebu/syrup';
import { ICommand } from './ICommand';

export interface ITegeCommand<D extends DataSourceError = DataSourceError> extends ICommand<'TegeCommand'> {
  readonly noun: 'TegeCommand';

  bulkCreate(teges: Teges): Superposition<unknown, TegeError | D>;

  delete(): Superposition<unknown, TegeError | D>;
}
