import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError, Teges } from '@tegebu/syrup';
import { inject, injectable } from 'inversify';
import { Types } from '../Container/Types';
import { ITegeCommand } from '../Repository/Command/Interface/ITegeCommand';
import { ITegeInteractor } from './Interface/ITegeInteractor';

@injectable()
export class TegeInteractor implements ITegeInteractor {
  public readonly noun: 'TegeInteractor' = 'TegeInteractor';
  private readonly tegeCommand: ITegeCommand;

  public constructor(@inject(Types.TegeFileCommand) tegeCommand: ITegeCommand) {
    this.tegeCommand = tegeCommand;
  }

  public save(teges: Teges): Superposition<unknown, TegeError | DataSourceError> {
    return this.tegeCommand.delete().map<unknown, TegeError | DataSourceError>(() => {
      return this.tegeCommand.bulkCreate(teges);
    });
  }
}
