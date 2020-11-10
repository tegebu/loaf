import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { Tege, TegeError, Teges } from '@tegebu/syrup';
import { inject, injectable } from 'inversify';
import { Types } from '../Container/Types';
import { ITegeCommand } from '../Repository/Command/Interface/ITegeCommand';
import { ITegeQuery } from '../Repository/Query/Interface/ITegeQuery';
import { ITegeInteractor } from './Interface/ITegeInteractor';

@injectable()
export class TegeInteractor implements ITegeInteractor {
  public readonly noun: 'TegeInteractor' = 'TegeInteractor';
  private readonly tegeQuery: ITegeQuery;
  private readonly tegeCommand: ITegeCommand;

  public constructor(
    @inject(Types.TegeFileQuery) tegeQuery: ITegeQuery,
    @inject(Types.TegeFileCommand) tegeCommand: ITegeCommand
  ) {
    this.tegeQuery = tegeQuery;
    this.tegeCommand = tegeCommand;
  }

  public create(tege: Tege): Superposition<unknown, TegeError | DataSourceError> {
    return this.tegeQuery.all().map<unknown, TegeError | DataSourceError>((teges: Teges) => {
      if (teges.has(tege.getTreeID())) {
        throw new TegeError(`THIS TEGE IS ALREADY CONTAINED. GIVEN: ${tege.getID().toString()}`);
      }

      teges.add(tege);

      return this.save(teges);
    });
  }

  public save(teges: Teges): Superposition<unknown, TegeError | DataSourceError> {
    return this.tegeCommand.delete().map<unknown, TegeError | DataSourceError>(() => {
      return this.tegeCommand.bulkCreate(teges);
    });
  }
}
