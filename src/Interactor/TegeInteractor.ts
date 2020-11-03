import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError, Teges } from '@tegebu/syrup';
import { inject, injectable } from 'inversify';
import { Types } from '../Container/Types';
import { ITegeCommand } from '../Repository/Command/Interface/ITegeCommand';
import { ITegeHierarchyCommand } from '../Repository/Command/Interface/ITegeHierarchyCommand';
import { ITegeInteractor } from './Interface/ITegeInteractor';

@injectable()
export class TegeInteractor implements ITegeInteractor {
  public readonly noun: 'TegeInteractor' = 'TegeInteractor';
  private readonly tegeCommand: ITegeCommand;
  private readonly tegeHierarchyCommand: ITegeHierarchyCommand;

  public constructor(
    @inject(Types.TegeFileCommand) tegeCommand: ITegeCommand,
    @inject(Types.TegeHierarchyFileCommand) tegeHierarchyCommand: ITegeHierarchyCommand
  ) {
    this.tegeCommand = tegeCommand;
    this.tegeHierarchyCommand = tegeHierarchyCommand;
  }

  public save(teges: Teges): Superposition<unknown, TegeError | DataSourceError> {
    return Superposition.all<unknown, TegeError | DataSourceError>([
      this.tegeCommand.delete(),
      this.tegeHierarchyCommand.delete()
    ]).map<unknown, TegeError | DataSourceError>(() => {
      return Superposition.all<unknown, TegeError | DataSourceError>([
        this.tegeCommand.bulkCreate(teges),
        this.tegeHierarchyCommand.bulkCreate(teges.toHierarchies())
      ]);
    });
  }
}
