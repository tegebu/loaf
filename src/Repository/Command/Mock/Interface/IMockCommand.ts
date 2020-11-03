import { ICommand } from '../../Interface/ICommand';

export interface IMockCommand extends ICommand<string, 'Mock'> {
  readonly source: 'Mock';
}
