import { DataSourceError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError, Teges } from '@tegebu/syrup';

export interface ITegeInteractor extends Noun<'TegeInteractor'> {
  save(teges: Teges): Superposition<unknown, TegeError | DataSourceError>;
}
