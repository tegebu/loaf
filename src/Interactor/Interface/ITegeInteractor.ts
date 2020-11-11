import { DataSourceError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { Tege, TegeError, Teges } from '@tegebu/syrup';

export interface ITegeInteractor extends Noun<'TegeInteractor'> {
  create(tege: Tege): Superposition<unknown, TegeError | DataSourceError>;

  // TODO
  // update(tege: Tege): Superposition<unknown, TegeError | DataSourceError>;

  save(teges: Teges): Superposition<unknown, TegeError | DataSourceError>;
}
