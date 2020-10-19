import { ICommand } from '../../Interface/ICommand';

export interface IFileCommand extends ICommand<string, 'File'> {
  readonly source: 'File';
}
