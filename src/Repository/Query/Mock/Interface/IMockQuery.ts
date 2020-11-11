import { IQuery } from '../../Interface/IQuery';

export interface IMockQuery extends IQuery<string, 'Mock'> {
  readonly source: 'Mock';
}
