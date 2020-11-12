import { ICommand } from '../../Interface/ICommand';

export interface IGitCommand extends ICommand<string, 'Git'> {
  readonly source: 'Git';
}
