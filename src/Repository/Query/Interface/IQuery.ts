import { Noun } from '@jamashita/publikum-interface';

export interface IQuery<N extends string = string, S extends string = string> extends Noun<N> {
  readonly source: S;
}
