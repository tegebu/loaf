import { Noun } from '@jamashita/publikum-interface';

export interface ICommand<N extends string = string, S extends string = string> extends Noun<N> {
  readonly source: S;
}
