import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { Tege, TegeError, TegeID } from '@tegebu/syrup';
import { ICommand } from './ICommand';

export interface ITegeCommand<D extends DataSourceError = DataSourceError> extends ICommand<'TegeCommand'> {
  readonly noun: 'TegeCommand';

  insert(tege: Tege): Superposition<unknown, TegeError | D>;

  update(tege: Tege): Superposition<unknown, TegeError | D>;

  delete(tegeID: TegeID): Superposition<unknown, TegeError | D>;
}
