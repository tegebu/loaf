import { IQuery } from '../../Interface/IQuery';

export interface IFileQuery extends IQuery<string, 'File'> {
  readonly source: 'File';
}
